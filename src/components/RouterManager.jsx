import React, { useEffect, useMemo, useRef } from 'react';
import { matchPath, withRouter, Route as RRouter } from 'react-router-dom';
import { NotFound } from './NotFound';
import { Route } from './Route';
import { placeHolderFn } from './common';
import context from './context';
import generateConventionRouter from './generateConventionRouter';

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
  conventionRouter,
  onConventionRouterConfigCreated = placeHolderFn,
  maxKeepAlive = 4
}) {
  const ctx = useRef({
    /** 记录缓存的页面列表 */
    cacheList: []
  });

  /** 最大缓存页面数 */
  ctx.current.maxKeepAlive = maxKeepAlive;
  /** 前置拦截器 */
  ctx.current.preInterceptor = preInterceptor;
  /** Route基础prop */
  ctx.current.routeBaseProps = routeBaseProps;

  /** 约定式路由 */
  const cr = useMemo(() => {
    if (!conventionRouter) return null;
    const _cr = generateConventionRouter();
    onConventionRouterConfigCreated(_cr);
    return _cr;
  }, []);

  useEffect(() => {
    onRouteChange({
      location,
      history
    });
  }, [location.pathname]);

  // 遍历所有子项中的 EnhanceRoute， 如果当前path不能匹配任意一项则视为404
  useEffect(() => {
    let match = null;

    // 匹配children route
    React.Children.forEach(children, child => {
      if (child.type === Route || child.type === RRouter) {
        const matchRes = matchPath(location.pathname, child.props);
        if (matchRes) {
          match = matchRes;
        }
      }
    });

    // 匹配约定式路由
    if (Array.isArray(cr)) {
      cr.forEach(route => {
        const matchRes = matchPath(location.pathname, route);
        if (matchRes) {
          match = matchRes;
        }
      });
    }

    if (!match) {
      if (location.pathname !== '/404') {
        onNotFound({
          location,
          history
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
        {cr && cr.map(route => <Route key={route.path} {...route} />)}
        {children}
        <Route path="/404" component={notFound || NotFound} />
      </div>
    </Provider>
  );
}

const RouterManager = withRouter(RouterManagerBase);

RouterManager.displayName = 'RouterManager';

export { RouterManager };
