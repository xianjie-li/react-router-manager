import React from "react";

const Home = pp => {
  const [count, setCount] = React.useState(0);

  console.log("home render", pp);
  return <div onClick={() => setCount(p => p + 1)}>Home {count}</div>;
};

export default Home;
