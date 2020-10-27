import React, { useMemo, useRef } from "react";
import { Transition } from "@lxjx/react-transition-spring";
import { Route as RRRoute } from "react-router-dom";
import { parse } from "query-string";
import propTypes from "prop-types";
import { firstUpperCase } from "./common";

const transitionType = ["bottom", "right"];

function Route({
  /* 禁用render和children渲染 */
  render,
  children,

  component: Component,
  transition = true,
  keepAlive = false,
  meta = {},
  className = "",
  style: extraStyle,
  ...props
}) {
  const self = useRef({
    matchCount: 0
  });

  // 未匹配阻止更新
  const MemoComponent = useMemo(() => {
    const fn = React.memo(Component, (prevProps, nextProps) => {
      return !nextProps.match;
    });

    fn.displayName = `Memo(${Component.name || Component.displayName})`;

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
    <RRRoute {...props}>
      {routeProps => {
        const { match, history, location } = routeProps;
        const show = !!match;
        const style = show ? {} : { display: "none" };
        const action = history.action;

        /**
         * pushEnter: 完整动画
         * RefreshOrNavEnter: 轻入场动画 (阻止？)
         * PushLeave: 轻离场动画
         * PopLeave: 完整动画
         * - 在toggle没有改变时，阻止任何动画
         * */
        // push新页面
        const isPushEnter = action === "PUSH" && show;
        // 刷新或浏览器导航返回
        const isRefreshOrNavEnter = action === "POP" && show;
        // 通过push进入其他页面
        const isPushLeave = action === "PUSH" && !show;
        // 返回其他页面
        const isPopLeave = action === "POP" && !show;
        // 入参
        const isEnter = isPushEnter || isRefreshOrNavEnter;
        // 离场
        const isLeave = isPushLeave || isPopLeave;

        /* 传递给每一个page包裹元素的prop */
        const baseProps = {
          className: "m78-router-page" + (className ? ` ${className}` : ""),
          "data-path": props.path,
          style: extraStyle
        };

        isEnter && (baseProps["data-enter"] = "");
        isLeave && (baseProps["data-leave"] = "");

        /* 存在查询时，将其转换为对象并设置到match */
        if (match && location.search) {
          match.params = parse(location.search);
        }

        /** 传递给page组件的props */
        const pageProps = {
          ...routeProps,
          match,
          meta
        };

        if (match) {
          self.current.matchCount += 1;
        }

        // 带动画渲染
        if (transition) {
          let actionType = "fade";

          let __style = {};

          if (isEnter) {
            __style = { zIndex: 20 };
          }

          if (isLeave) {
            __style = { zIndex: 10 };
          }

          // 如果在预设类型中，设置动画类型
          if (transitionType.indexOf(transition) !== -1) {
            const transitionName = firstUpperCase(transition);

            if (isPushEnter || isPopLeave) {
              actionType = `slide${transitionName}`;
            }

            if (isRefreshOrNavEnter || isPushLeave) {
              actionType = "zoom";
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
            >
              <MemoComponent {...pageProps} />
            </MemoTransition>
          );
        }

        /* 普通的keepAlive切换 */
        if (keepAlive && self.current.matchCount > 0) {
          return (
            <div {...baseProps} style={{ ...baseProps.style, ...style }}>
              <MemoComponent {...pageProps} />
            </div>
          );
        }

        /** 无keepAlive 无动画 */
        return show ? (
          <div {...baseProps}>
            <Component {...pageProps} />
          </div>
        ) : null;
      }}
    </RRRoute>
  );
}

Route.propTypes = {
  ...RRRoute.propTypes,
  component: propTypes.elementType,
  transition: propTypes.oneOf([...transitionType, false]),
  keepAlive: propTypes.bool,
  meta: propTypes.object,
  className: propTypes.string
};

export { Route };
