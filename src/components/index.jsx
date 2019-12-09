import React, { useRef } from 'react';
import { Route, withRouter, matchPath } from 'react-router-dom';
import { Transition } from '@lxjx/react-transition-spring';
import propTypes from 'prop-types';
import { parse } from 'query-string';

import './index.css';

function NotFound({ match }) {
  return (
    <div className="bk-404-page">
      <div>
        <h2 className="bk-404-page_title">404 Not Found</h2>
        <div className="bk-404-page_url">{match.params && match.params.path}</div>
        <a href="/" className="bk-404-page_link">返回首页</a>
      </div>
    </div>
  );
}

const placeHolderFn = () => null;

function RouteWrapper_({
  location, history, children, onNotFound = placeHolderFn, onRouteChange = placeHolderFn, notFound,
}) {
  /* 遍历EnhanceRoute子节点, 当没有任何匹配时触发onNotFound */
  let match = null;

  onRouteChange({ location, history });

  React.Children.forEach(children, child => {
    if (child.type === EnhanceRoute) {
      const matchRes = matchPath(location.pathname, child.props);
      if (matchRes) {
        match = matchRes;
      }
    }
  });

  if (!match) {
    if (location.pathname !== '/404') {
      onNotFound({ location, history });
      setTimeout(() => {
        history.replace('/404?path=' + location.pathname);
      });
    }
  }

  return (
    <div className="bk-router-wrap">
      {children}
      <EnhanceRoute path="/404" component={notFound || NotFound} />
    </div>
  );
}


function firstUpperCase(str = '') {
  if (!str) return '';
  return str.replace(/^./, ($1) => $1.toUpperCase());
}

const transitionType = ['bottom', 'right'];

function EnhanceRoute({
  /* 将这两个参数从prop抽离出来，防止冲突 */
  render,
  children,

  component: Component,
  transition = true,
  keepAlive = false,
  meta = {},
  wrapperClassName = '',
  ...props
}) {
  const self = useRef({
    matchCount: 0,
  });

  // 动画组件只有在匹配到时才进行重绘
  const MemoComponent = React.memo(Component, (prevProps, nextProps) => {
    return !nextProps.match;
  });

  MemoComponent.displayName = `Memo(${Component.name || Component.displayName})`;

  // 防止Transition进行不必要的更新
  const MemoTransition = React.memo(Transition, (prevProps, nextProps) => {
    return prevProps.toggle === nextProps.toggle;
  });

  MemoTransition.displayName = `Memo(${Transition.name || Transition.displayName})`;

  return (
    <Route {...props}>
      {routeProps => {
        const { match, history, location } = routeProps;
        const show = !!match;
        const style = show ? {} : { display: 'none' };
        const action = history.action;

        /**
         * pushEnter: 完整动画
         * RefreshOrNavEnter: 轻入场动画
         * PushLeave: 轻离场动画
         * PopLeave: 完整动画
         * - 在toggle没有改变时，阻止任何动画
         * */
        const isPushEnter = action === 'PUSH' && show;
        const isRefreshOrNavEnter = action === 'POP' && show;
        const isPushLeave = action === 'PUSH' && !show;
        const isPopLeave = action === 'POP' && !show;
        const isEnter = isPushEnter || isRefreshOrNavEnter;
        const isLeave = isPushLeave || isPopLeave;

        /* 传递给每一个page包裹元素的prop */
        const baseProps = {
          className: 'bk-router-page' + (wrapperClassName ? ` ${wrapperClassName}` : ''),
          'data-path': props.path,
        };
        isEnter && (baseProps['data-enter'] = '');
        isLeave && (baseProps['data-leave'] = '');

        /* 存在查询时，将其转换为对象方便使用 */
        if (match && location.search) {
          match.params = parse(location.search);
        }

        const pageProps = {
          ...routeProps,
          match,
          meta,
        };

        if (match) {
          self.current.matchCount += 1;
        }

        if (transition) {
          let actionType = 'fade';
          let __style = {};

          if (isEnter) {
            __style = { zIndex: 20 };
          }

          if (isLeave) {
            __style = { zIndex: 10 };
          }

          if (transitionType.indexOf(transition) !== -1) {
            const transitionName = firstUpperCase(transition);

            if (isPushEnter || isPopLeave) {
              actionType = `slide${transitionName}`;
            }

            if (isRefreshOrNavEnter || isPushLeave) {
              actionType = 'zoom';
            }
          }

          return (
            <MemoTransition
              {...baseProps}
              style={__style}
              toggle={show}
              type={actionType}
              reset={true}
              mountOnEnter
              unmountOnExit={!keepAlive}
            >
              <MemoComponent {...pageProps} />
            </MemoTransition>
          );
        }

        /* transition为false时，使用普通的切换 */
        if (keepAlive && self.current.matchCount > 0) {
          return (
            <div {...baseProps} style={style}>
              <MemoComponent {...pageProps} />
            </div>
          );
        }

        return show ? (
          <div {...baseProps}>
            <Component {...pageProps} />
          </div>
        ) : null;
      }}
    </Route>
  );
}

const RouteWrapper = withRouter(RouteWrapper_);

RouteWrapper.propTypes = {
  notFound: propTypes.elementType,
  onNotFound: propTypes.func,
  onRouteChange: propTypes.func,
};

EnhanceRoute.propTypes = {
  ...Route.propTypes,
  component: propTypes.elementType,
  transition: propTypes.oneOf([...transitionType, false]),
  keepAlive: propTypes.bool,
  meta: propTypes.object,
  wrapperClassName: propTypes.string,
};

export * from 'react-router-dom';
export { EnhanceRoute, RouteWrapper };
