<h1 align="center">react-router-manager</h1>

<h1 align="center">🗺</h1>

<p align="center">react-router manager, contains animation, keepAlive etc.</p>

<br>

<!-- TOC -->

- [✨`feature`](#✨feature)
- [🎨`example`](#🎨example)
- [📦`install`](#📦install)
- [🤔`usage`](#🤔usage)
    - [basic](#basic)
    - [keepAlive](#keepalive)
    - [auth page](#auth-page)
    - [custom 404 page](#custom-404-page)
    - [page meta](#page-meta)
    - [events](#events)
    - [conventional route](#conventional-route)
    - [typescript tips](#typescript-tips)
- [🎈`API`](#🎈api)
  - [RouterManager](#routermanager)
  - [Route](#route)
  - [RouteComponent](#routecomponent)
  - [triggerPageUpdate](#triggerpageupdate)
- [🌹`other`](#🌹other)
  - [page base style](#page-base-style)
  - [query](#query)

<!-- /TOC -->


<br>

## ✨`feature`

* support for routing level keepAlive, keep the route component states.
* routing animation without performance loss
* 404 custom、onRouteChange、route meta data、query parse、auth page、etc.
* centrally manage route
* conventional route



<br>

## 🎨`example`

![loading...](./demo.gif)

<br>

<br>

## 📦`install`

```shell
npm install @lxjx/react-router-manager
# or
yarn add @lxjx/react-router-manager
```

<br>

<br>

## 🤔`usage`

#### basic

The most basic usage is almost the same as react router

```jsx
import React from 'react';

import { HashRouter, Link } from "react-router-dom";

import {
  RouterManager, Route
} from '@lxjx/react-router-manager';

// pages
import Home from './home';
import About from './about';

function App() {
  return (
    <HashRouter>
      <RouterManager>
        <div>
          <Link to="/">home</Link>
          <Link to="/about">about</Link>
        </div>
        <Route 
            path="/" 
            component={Home} 
            exact // receive all Route props except for render、children
            />
        <Route
          path="/about"
          component={About}
        />
      </RouterManager>
    </HashRouter>
  );
}

export default App;
```

<br>

#### keepAlive

Pass in keepAlive so that a page will not be destroyed when it is unmounted

```jsx
<XX>
    <Route path="/page1" keepAlive component={Page1} />
    <Route path="/page2" component={Page2} />
</XX>
```

use triggerPageUpdate to reload cached pages

```javascript
triggerPageUpdate('/page1')
```

<br>

#### auth page

```jsx
<RouterManager
   preInterceptor={({ location }) => {
   		if (!token && location.pathname !== '/login') return (
        	<div>Please log in first! <a href="/login">to login</a></div>
        )
   }}
</RouterManager>	
```

You can also use `within` prop

```tsx
function withLogin(Component) {
    return function LoginHOC(props) {
        if (!token && props.location.pathname !== '/login') return (
        	<div>Please log in first! <a href="/login">to login</a></div>
        )
        
        return <Component {...props} />
    }
}

<Route component={Page2} path="/page2" within={[withLogin]} />
```

<br>

#### custom 404 page

```jsx
function N404() {
  return <div>404</div>;
}

<RouterManager notFound={N404} >{...}</RouterManager>
```

<br>

#### page meta

```tsx
<Route component={Page2} path="/page2" meta={{ title: 'page 2' }} />

// page component
function Page2({ meta }) {
    return (
    	<div>
        	<Helmet>
                <meta charSet="utf-8" />
                <title>{meta.title}</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
        </div>
    )
}
```

<br>

#### events

```jsx
<RouterManager
    onNotFound={({ location }) => {
        console.log('404', location.pathname);
    }}
    onRouteChange={({ location }) => {
        console.log('change', location.pathname);
    }}
    >
</RouterManager>
```

<br>

#### conventional route

Use convention routing, via webpack `require.context API`

1. open config

```jsx
<RouterManager conventionRouter></RouterManager>
```

2. conventional dir

```jsx
/proj
	/src
		/Index.jsx	// capitalize is require
		/News.jsx
		/About.jsx

// generated like =>
<Route path="/Index" exact component={/* Index.jsx module */}>
<Route path="/News" exact component={/* News.jsx module */}>
<Route path="/About" exact component={/* About.jsx module */}>
```

3. complex construction

```jsx
/proj
	/src
		/Index
			/Index.jsx		// => / 			exact
		/News				
			/News.jsx		// => /News			exact
			/Detail.jsx		// => /News/Detail
		/Center
			/Center.jsx		// => /Center		exact
			/Info.jsx		// => /Center/Info
```

4. config by static prop

```jsx
import React from 'react';

const Index = () => {
  return (
    <div>
      <div>Home Page</div>
    </div>
  );
};

Index.routerConfig = {
  keepAlive: true,
  meta: { title: 'home page' },
  // any Route Props
}

export default AddProduct;
```

<br>

#### typescript tips

Use RouteComponent to declare component

```tsx
import React from 'react';
import { RouteComponent } from '@lxjx/react-router-manager';

type Props = {/* ... */};
type Query = {/* ... */};
type Param = {/* ... */};
type Meta = {/* ... */};
	
const Index: RouteComponent<Props, Query, Param, Meta> = ({
    match, // type ✅
}) => {
  return (
    <div>
      <div>Home Page</div>
    </div>
  );
};

// type ✅
Index.routerConfig = {
  keepAlive: true,
  meta: { title: 'home page' },
}

export default AddProduct;
```





<br>

<br>

## 🎈`API`

### RouterManager

manage Route components

```tsx
export const RouterManager: React.FC<{
  /** custom 404 page components */
  notFound?: React.ComponentType<RouteComponentProps>;
  /** trigger on pathname not found */
  onNotFound?: ({ location: Location, history: History }) => void;
  /** trigger on pathname change */
  onRouteChange?: ({ location: Location, history: History }) => void;
  /** If reactElement or null is returned, prevent the routing node from rendering and render the returned node */
  preInterceptor?: (props: RMMatchProps) => React.ReactElement | null | void;
  /** Global Route props, covered by local props */
  routeBaseProps?: RMRouteProps;
  /** Use convention routing, via webpack require.context API */
  conventionRouter?: boolean;
  /** trigger on convention routing config created */
  onConventionRouterConfigCreated?: (conf: RMRouteProps[]) => void;
}>;
```

<br>

### Route

Route components, used to configure a routing item, which is a superset of the Route component of react-router

```tsx
export interface RMRouteProps extends RouteProps {
  /** transition type */
  transition?: 'bottom' | 'right' | 'fade';
  /** not destroy when the page leaves */
  keepAlive?: boolean;
  /** extra meta passed to the page component */
  meta?: { [key: string]: any };
  /** enhanced component, used for authentication, layout, etc. this hoc component should pass all received props like `<Component ...{props} />` */
  within?: RMWithinHOC[];
  /** page className */
  className?: string;
  /** page style, avoid using such as display、opacity、transform、z-index, etc. */
  style?: React.CSSProperties;
  /** route component */
  component?:
    | RouteComponent
    | React.ComponentType<RouteComponentProps>
    | React.ComponentType<any>;
}
```

<br>

### RouteComponent

Used for routing component declaration

```tsx
export interface RouteComponentProps<Query = any, Params = any, Meta = any> {
  match: match<Params> & { query: Partial<Query> };
  location: Location;
  history: History;
  meta: Meta;
  pageElRef: React.RefObject<HTMLDivElement>;
}

// or 
export interface RouteComponent<
  Props = any,
  Query = any,
  Params = any,
  Meta = any
> extends React.FC<RouteComponentProps<Query, Params, Meta> & Props> {
  routerConfig: RMRouteProps;
}
```

<br>

### triggerPageUpdate

invalid and overload the page cache of keepAlive

```tsx
export const triggerPageUpdate: (path: string) => void;
```





<br>

<br>

## 🌹`other`

### page base style

built-in basic styles for routing components that allow you to handle routing conveniently

```css
.m78-router-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  overflow: hidden;
}

.m78-router-page {
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

it can：

* prevent document flow confusion
* no need to care about html, body, #root height, width...
* scroll bars are maintained by the page itself, rather than using public document scroll bar, which can effectively prevent scrolling confusion
* no need to lock the scroll bar of the document when modal/dialog is show
* It is more convenient to manage pages

<br>

### query

when the query is detected, the internal will be decoded by the query-string and mounted on the match object.

```js
// http://xx.xx.cn/user?name=lxj&age=25

// component inside
props.match.query // => { name: 'lxj', age: 25 }
```
























