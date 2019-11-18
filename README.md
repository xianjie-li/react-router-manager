<h1 align="center">react-transition-route</h1>

<h1 align="center">🗺</h1>

<p align="center">react-router manager includes keepAlive transition and more</p>



<br>

## ✨`Feature`

* support for routing level keepAlive, keep the route component states.
* built-in fade, slide type route transition animation

* some convenient things .eg: 404、onRouteChange、route meta data、query parse
* no unnecessary rerender due to animation, such as 

```jsx
<TransitionGroup>
    <CSSTransition
      appear={true}
      classNames="xxx"
      timeout={500}
      key={location.key} // because of the key, it will cause a lot of unnecessary rerender.
    >
      <Switch location={location}>
       {Routes...}
      </Switch>
    </CSSTransition>
</TransitionGroup>
```

<br>

<br>

## 🎨`demo`

![loading...](./demo.gif)

<br>

<br>

## 📦`install`

```shell
npm install @lxjx/react-router-enhance
# or
yarn add @lxjx/react-router-enhance
```

<br>

<br>

## 🤔`Usage`

```jsx
import React from 'react';

// output all react-router-dom modules
import {
  EnhanceRoute, RouteWrapper, HashRouter, Link,
} from '@lxjx/react-router-enhance';

// pages
import Home from './view/home';
import About from './view/about';
import List from './view/list';
import Detail from './view/detail';
import Detail2 from './view/detail2';
import Detail3 from './view/detail3';

// custom 404
function N404({ location }) {
  return <div>404 {location.pathname}</div>;
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
        <EnhanceRoute 
            path="/" 
            keepAlive 
            component={Home} 
            wrapperClassName="extra-style"
            exact // receive all Route props except for render、children
            />
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
```

<br>

<br>

## 🎈`props`

### RouteWrapper

```ts
{
    // a react component, used to replace the built-in 404 component 
    notFound?: React.FC<any> | React.Component<any, any>
    // route change callback
    onRouteChange?: ({
   		location: Location,
   		history: History
 	}) => void;
    // 404 callback
    onNotFound?: ({
    	location: Location,
    	history: History
  	}) => void;
}

```

<br>

### EnhanceRoute

```ts
{
    /** transition type，default is fade */
  	transition?: 'bottom' | 'right' | false;
    /** cache the Route render component /> */
  	keepAlive?: boolean;
    /** meta data pass to Route render component with props */
  	meta?: { [key: string]: any };
	/** EnhanceRoute wrap el extra className */
  	wrapperClassName?: string;
}
```

<br>

<br>

## 🎄`other`

built-in basic styles for routing components that allow you to handle routing conveniently

```css
.bk-router-wrap {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    overflow: hidden;
}

.bk-router-page {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    overflow: auto;
    background-color: #f6f6f6;
    -webkit-overflow-scrolling: touch;
}
```

He can do：

* prevent document flow confusion
* no need to care about html, body, #root height, width...
* scroll bars are maintained by the page itself, rather than using public document scroll bar, which can effectively prevent scrolling confusion
* no need to lock the scroll bar of the document when modal is show
* It is more convenient to manage pages

<br>

### query

when the query is detected, the internal will be decoded by the query-string and mounted on the match object.

```js
// http://xx.xx.cn/user?name=lxj&age=25

// component inside
props.match.query // => { name: 'lxj', age: 25 }
```
























