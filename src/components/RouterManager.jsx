import React, { useEffect, useRef } from 'react';
import { matchPath, withRouter, Route as RRouter } from 'react-router-dom';
import { NotFound } from './NotFound';
import { Route } from './Route';
import { placeHolderFn } from './common';
import propTypes from 'prop-types';
import context from './context';

const { Provider } = context;

function RouterManagerBase({
  location,
  history,
  children,
  onNotFound = placeHolderFn,
  onRouteChange = placeHolderFn,
  notFound,
  preInterceptor,
  routeBaseProps,
}) {
  const ctx = useRef({});

  ctx.current.preInterceptor = preInterceptor;
  ctx.current.routeBaseProps = routeBaseProps;

  useEffect(() => {
    onRouteChange({
      location,
      history,
    });
  }, [location.pathname]);

  // 遍历所有子项中的 EnhanceRoute， 如果当前path不能匹配任意一项则视为404
  useEffect(() => {
    let match = null;

    React.Children.forEach(children, child => {
      if (child.type === Route || child.type === RRouter) {
        const matchRes = matchPath(location.pathname, child.props);
        if (matchRes) {
          match = matchRes;
        }
      }
    });

    if (!match) {
      if (location.pathname !== '/404') {
        onNotFound({
          location,
          history,
        });
        setTimeout(() => {
          history.replace('/404?path=' + location.pathname);
        });
      }
    }
  }, [location.pathname, React.Children]);

  return (
    <Provider value={ctx.current}>
      <div className="m78-router-wrap">
        {children}
        <Route path="/404" component={notFound || NotFound} />
      </div>
    </Provider>
  );
}

const RouterManager = withRouter(RouterManagerBase);

RouterManager.displayName = 'RouterManager';

RouterManager.propTypes = {
  notFound: propTypes.elementType,
  onNotFound: propTypes.func,
  onRouteChange: propTypes.func,
};

export { RouterManager };
