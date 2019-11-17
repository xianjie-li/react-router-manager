import React from 'react';
import { Link } from 'react-router-dom';

function AboutSub({ match }) {
  console.log('detail render', match);
  return (
    <div className="page __sub">
      <Link to="/detail2">detail</Link>
    </div>
  );
}

export default AboutSub;
