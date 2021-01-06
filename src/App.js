import React, { useState, useEffect } from 'react';
import * as contentful from 'contentful';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const client = contentful.createClient({
  space: process.env.REACT_APP_API_SPACE,
  accessToken: process.env.REACT_APP_ACCESS_TOKEN,
});

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
    [INLINES.HYPERLINK]: (node, children) => (
      <a href={node.data.url}>{children}</a>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node) => (
      <img
        src={node.data.target.fields.file.url}
        alt={node.data.target.fields.title}
      />
    ),
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
    <div className='container' key={entry.sys.id}>
      <h1>{entry.fields.title}</h1>
      <div>
        <img
          src={entry.fields.author.fields.avatar.fields.file.url}
          alt={entry.fields.author.fields.avatar.fields.title}
        />
      </div>
      {entry.fields.author.fields.name}
      {created(entry.sys.createdAt)}
      {documentToReactComponents(entry.fields.content, options)}
    </div>
  ));
  return <div className='App'>{Entries}</div>;
}

export default App;
