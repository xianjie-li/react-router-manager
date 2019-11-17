import React from 'react';

const Home = () => {
  const [count, setCount] = React.useState(0);
  console.log('home render');
  return <div onClick={() => setCount(p => p + 1)}>Home { count }</div>;
};

export default Home;
