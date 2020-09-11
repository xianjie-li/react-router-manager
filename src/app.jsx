import React, { useState } from "react";

import { RouterManager, Route } from "./components";
import { HashRouter, Link, Router } from "react-router-dom";

import Home from "./view/home";
import About from "./view/about";
import List from "./view/list";
import Detail from "./view/detail";
import Detail2 from "./view/detail2";
import Detail3 from "./view/detail3";

function N404() {
  return <div>404</div>;
}

/* TODO: 用户不需要在接触HashRouter等组件 */
function App() {
  const [count, setCount] = useState(0);

  return (
    <HashRouter>
      <RouterManager
        notFound={N404}
        onNotFound={({ location }) => {
          console.log("404", location.pathname);
        }}
        onRouteChange={({ location }) => {
          console.log("change", location.pathname);
        }}
      >
        <div className="link-bar">
          <Link to="/">home</Link>
          <Link to="/about">about</Link>
          <Link to="/list">list</Link>
          <span onClick={() => setCount(p => p + 1)}>click</span>
        </div>
        <Route
          path="/"
          keepAlive
          component={Home}
          exact
          className="extra-style"
        />
        <Route
          path="/about"
          component={About}
          meta={{ name: "lxj", age: "xxx" }}
        />
        <Route path="/list" component={List} keepAlive />
        <Route path="/detail" transition="right" component={Detail} />
        <Route path="/detail2" transition="right" component={Detail2} />
        <Route path="/detail3" transition="right" component={Detail3} />
      </RouterManager>
    </HashRouter>
  );
}

export default App;
