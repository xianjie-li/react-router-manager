import React from 'react';

import {
  EnhanceRoute, RouteWrapper, HashRouter, Link,
} from './components';

import Home from './view/home';
import About from './view/about';
import List from './view/list';
import Detail from './view/detail';
import Detail2 from './view/detail2';
import Detail3 from './view/detail3';

function N404() {
  return <div>404</div>;
}

function App() {
  return (
    <HashRouter>
      <RouteWrapper
        notFound={N404}
        onNotFound={({ location }) => { console.log('404', location.pathname); }}
        onRouteChange={({ location }) => { console.log(location.pathname); }}
      >
        <div className="link-bar">
          <Link to="/">home</Link>
          <Link to="/about">about</Link>
          <Link to="/list">list</Link>
        </div>
        <EnhanceRoute path="/" keepAlive component={Home} exact wrapperClassName="extra-style" />
        <EnhanceRoute
          path="/about"
          component={About}
          meta={{ name: 'lxj', age: 'xxx' }}
        />
        <EnhanceRoute
          path="/list"
          component={List}
          keepAlive
        />
        <EnhanceRoute path="/detail" transition="right" component={Detail} />
        <EnhanceRoute path="/detail2" transition="right" component={Detail2} />
        <EnhanceRoute path="/detail3" transition="right" component={Detail3} />
      </RouteWrapper>
    </HashRouter>
  );
}

export default App;
