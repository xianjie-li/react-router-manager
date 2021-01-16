import React, { useEffect } from 'react';
import Home from '@/view/Home';

const About = ({ meta }) => {
  console.log('about render', 'width meta: ', meta);
  return (
    <div>
      <div>about</div>
    </div>
  );
};

About.routerConfig = {
  keepAlive: true
};

export default About;
