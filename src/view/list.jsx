import React from 'react';
import { Link } from 'react-router-dom';

const list = () => {
  console.log('list render');
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {Array.from({ length: 50 }).map((v, i) => (
        <Link to="/detail" key={i} className="list-item">list item {++i}</Link>
      ))}
    </div>
  );
};

export default list;
