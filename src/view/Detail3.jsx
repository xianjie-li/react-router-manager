import React from 'react';
import { Link } from 'react-router-dom';

function AboutSub() {
  return (
    <div className="__sub">
      <Link to="/detail">detail3</Link>
    </div>
  );
}

AboutSub.routerConfig = {
  transition: 'right'
};

export default AboutSub;
