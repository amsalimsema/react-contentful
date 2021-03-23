import React, { useState, useEffect } from 'react';
import * as contentful from 'contentful';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Col, Row } from 'react-bootstrap';

const client = contentful.createClient({
  space: process.env.REACT_APP_API_SPACE,
  accessToken: process.env.REACT_APP_ACCESS_TOKEN,
});

//const website_url = '';
const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
    [INLINES.HYPERLINK]: (node, children) => (
      <a href={node.data.uri}>{children}</a>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node) => (
      <img
        src={node.data.target.fields.file.url}
        alt={node.data.target.fields.title}
      />
    ),

    /* [INLINES.HYPERLINK]: (node) => {
      return (
        <a
          href={node.data.uri}
          target={`${
            node.data.uri.startsWith(website_url) ? '_self' : '_blank'
          }`}
          rel={`${
            node.data.uri.startsWith(website_url) ? '' : 'noopener noreferrer'
          }`}
        >
          {node.content[0].value}
        </a>
      );
    }, */
  },
  renderMark: {
    [MARKS.ITALIC]: (text) => <span className='italic'>{text}</span>,
  },
};

const created = (timestamp) =>
  new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
function App() {
  const [entries, setEntries] = useState([]);
  useEffect(() => {
    client
      .getEntries({
        content_type: 'blogPost',
      })
      .then((response) => {
        setEntries(response.items);
      });
  }, []);

  const Entries = entries.map((entry) => (
    <div key={entry.sys.id} className='container'>
      <h1 className='text-center'>{entry.fields.title}</h1>
      <Row>
        <Col md={12}>
          <div>
            <img
              src={entry.fields.author.fields.avatar.fields.file.url}
              alt={entry.fields.author.fields.avatar.fields.title}
            />
            {entry.fields.author.fields.name}
            {created(entry.sys.createdAt)}
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          {documentToReactComponents(entry.fields.content, options)}
        </Col>
        {/* <Col md={6}>
          {documentToReactComponents(entry.fields.content, options)}
        </Col> */}
      </Row>
    </div>
  ));
  return <div>{Entries}</div>;
}

export default App;
