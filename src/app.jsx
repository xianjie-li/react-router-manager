import React, { useState } from 'react';

import { RouterManager } from './components';
import { HashRouter, Link } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);

  return (
    <HashRouter>
      <RouterManager
        conventionRouter
        // notFound={N404}
        onNotFound={({ location }) => {
          console.log('404', location.pathname);
        }}
        onRouteChange={({ location }) => {
          console.log('change', location.pathname);
        }}
      >
        <div className="link-bar">
          <Link to="/">home</Link>
          <Link to="/about">about</Link>
          <Link to="/list">list</Link>
        </div>
      </RouterManager>
    </HashRouter>
  );
}

export default App;
