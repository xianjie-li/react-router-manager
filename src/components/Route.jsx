import React, { useContext, useMemo, useRef, useState } from 'react';
import { Transition } from '@lxjx/react-transition-spring';
import { Route as RRoute } from 'react-router-dom';
import { parse } from 'query-string';

import {
  firstUpperCase,
  getRandString,
  preInterceptorHandle,
  updateEvent
} from './common';
import context from './context';

const transitionType = ['bottom', 'right', 'fade'];

function Route(routePassProps) {
  const ctx = useContext(context);

  const composeProps = {
    ...ctx.routeBaseProps,
    ...routePassProps
  };

  const {
    /* # 禁用render和children渲染 # */
    render,
    children,

    component: Component,

    /* # 剔除内部属性 # */
    transition,
    keepAlive = false,
    meta = {},
    within,
    preInterceptor,
    className = '',
    style: extraStyle,

    ...props
  } = composeProps;

  const self = useRef({
    matchCount: 0
  });

  const pageElRef = useRef(null);

  const [updateKey, setUpdateKey] = useState(() => getRandString());

  updateEvent.useEvent(path => {
    if (path === props.path) {
      setUpdateKey(getRandString());
    }
  });

  // 未匹配阻止更新
  const MemoComponent = useMemo(() => {
    let fn = React.memo(Component, (prevProps, nextProps) => {
      return !nextProps.match;
    });

    const dn = Component.name || Component.displayName;

    if (Array.isArray(within) && within.length) {
      fn = within.reduce((prev, enhancer) => enhancer(prev), fn);
      fn.displayName = `${within.name || within.displayName}(${dn})`;
    } else {
      fn.displayName = `Memo(${dn})`;
    }

    return fn;
  }, []);

  // 前后toggle相同阻止更新
  const MemoTransition = useMemo(() => {
    const fn = React.memo(Transition, (prevProps, nextProps) => {
      return prevProps.toggle === nextProps.toggle;
    });

    fn.displayName = `Memo(${Transition.name || Transition.displayName})`;

    return fn;
  }, []);

  return (
    <RRoute {...props} key={updateKey}>
      {routeChildProps => {
        const { match, history, location } = routeChildProps;

        const rmMatchProps = {
          ...routeChildProps,
          routeProps: routePassProps
        };

        const [pass, replaceNode] = preInterceptorHandle(
          rmMatchProps,
          ctx.preInterceptor
        );

        if (!pass) return replaceNode;

        const show = !!match;
        const style = show ? {} : { display: 'none' };
        const action = history.action;

        /**
         * pushEnter: 完整动画
         * RefreshOrNavEnter: 轻入场动画 (阻止？)
         * PushLeave: 轻离场动画
         * PopLeave: 完整动画
         * - 在toggle没有改变时，阻止任何动画
         * */
        // push新页面
        const isPushEnter = action === 'PUSH' && show;
        // 刷新或浏览器导航返回
        const isRefreshOrNavEnter = action === 'POP' && show;
        // 通过push进入其他页面
        const isPushLeave = action === 'PUSH' && !show;
        // 返回其他页面
        const isPopLeave = action === 'POP' && !show;
        // 入参
        const isEnter = isPushEnter || isRefreshOrNavEnter;
        // 离场
        const isLeave = isPushLeave || isPopLeave;

        /* 传递给每一个page包裹元素的prop */
        const baseProps = {
          className: 'm78-router-page' + (className ? ` ${className}` : ''),
          'data-path': props.path,
          style: extraStyle
        };

        isEnter && (baseProps['data-enter'] = '');
        isLeave && (baseProps['data-leave'] = '');

        /* 存在查询时，将其转换为对象并设置到match */
        if (match) {
          match.query = location.search ? parse(location.search) : {};
        }

        /** 传递给page组件的props */
        const pageProps = {
          ...routeChildProps,
          match,
          meta,
          pageElRef
        };

        if (match) {
          self.current.matchCount += 1;
        }

        // 带动画渲染
        if (transition && transitionType.indexOf(transition) !== -1) {
          let actionType = 'fade';
          let __style = {};

          if (transition === 'fade') {
            if (isEnter) {
              __style = { zIndex: 20 };
            }

            if (isLeave) {
              __style = { zIndex: 10 };
            }
          } else {
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
              toggle={show}
              type={actionType}
              {...baseProps}
              style={{ ...baseProps.style, ...__style }}
              reset
              mountOnEnter
              unmountOnExit={!keepAlive}
              appear={!isRefreshOrNavEnter && self.current.matchCount > 1}
              innerRef={pageElRef}
            >
              <MemoComponent {...pageProps} />
            </MemoTransition>
          );
        }

        /* 普通的keepAlive切换 */
        if (keepAlive && self.current.matchCount > 0) {
          return (
            <div
              {...baseProps}
              ref={pageElRef}
              style={{ ...baseProps.style, ...style }}
            >
              <MemoComponent {...pageProps} />
            </div>
          );
        }

        /** 无keepAlive 无动画 */
        return show ? (
          <div {...baseProps} ref={pageElRef}>
            <Component {...pageProps} />
          </div>
        ) : null;
      }}
    </RRoute>
  );
}

Route.displayName = 'RouteManagerRoute';

export { Route };
