import React, { useEffect } from 'react';
import { triggerPageUpdate } from '../components';

const Home = pp => {
  console.log(123123, pp);

  const [count, setCount] = React.useState(0);

  useEffect(() => {
    console.log('home inited');
  }, []);

  console.log('home render', pp);
  return (
    <div onClick={() => setCount(p => p + 1)}>
      <div>Home {count}</div>
      <button onClick={() => triggerPageUpdate('/')}>update</button>
    </div>
  );
};

Home.routerConfig = {
  keepAlive: true
};

export default Home;
