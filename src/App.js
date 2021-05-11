import React, { useState, useEffect } from 'react';
import * as contentful from 'contentful';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Col, Row } from 'react-bootstrap';
//import ReactPaginate from 'react-paginate';

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
        className="w-100"
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
// pagination
//const ENTRIES_PER_PAGE = 3;
function App() {
  const [entries, setEntries] = useState([]);
  // PAGINATION PAGE COUNT
  // const [pageCount, setPageCount] = useState(0);
  // const [page, setPage] = useState(0);
  useEffect(() => {
    client
      .getEntries({
        content_type: 'blogPost',
        order: '-sys.createdAt',
        limit: 5,
      })
      .then((response) => {
        setEntries(response.items);
        // setPageCount(Math.ceil(response.total / ENTRIES_PER_PAGE));
      });
    window.scrollTo(0, 0);
    //  }, [page]);
  }, []);

  const Entries = entries.map((entry) => (
    <div key={entry.sys.id} className='container'>
      <h1 className='text-start'>{entry.fields.title}</h1>
      <Row>
        <Col md={12}>
          <div style={{ display: 'flex', alignItems: 'safe center' }}>
            <img
              src={entry.fields.author.fields.avatar.fields.file.url}
              alt={entry.fields.author.fields.avatar.fields.title}
              style={{
                borderRadius: '15rem',
                width: '70px',
                padding: '0.5rem',
              }}
            />
            <section className='mt-3'>
              <p>
                {entry.fields.author.fields.name}
                <br />
                {created(entry.sys.createdAt)}
              </p>
            </section>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={12} style={{ lineHeight: '1.1rem' }}>
          {documentToReactComponents(entry.fields.content, options)}
        </Col>
        {/* <Col md={6}>
          {documentToReactComponents(entry.fields.content, options)}
        </Col> */}
      </Row>
    </div>
  ));
  return (
    <div>
      {Entries}
      {/* {pageCount > 1 && (
        <ReactPaginate
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onChange={({ selected }) => setPage(selected)}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      )} */}
    </div>
  );
}

export default App;
