import React, { useEffect } from "react";
import { matchPath, withRouter } from "react-router-dom";
import { NotFound } from "./NotFound";
import { Route } from "./Route";
import { placeHolderFn } from "./common";
import propTypes from "prop-types";

function RouterManagerBase({
  location,
  history,
  children,
  onNotFound = placeHolderFn,
  onRouteChange = placeHolderFn,
  notFound
}) {
  useEffect(() => {
    onRouteChange({ location, history });
  }, [location.pathname]);

  // 遍历所有子项中的 EnhanceRoute， 如果当前path不能匹配任意一项则视为404
  useEffect(() => {
    let match = null;

    React.Children.forEach(children, child => {
      if (child.type === Route) {
        const matchRes = matchPath(location.pathname, child.props);
        if (matchRes) {
          match = matchRes;
        }
      }
    });

    if (!match) {
      if (location.pathname !== "/404") {
        onNotFound({ location, history });
        setTimeout(() => {
          history.replace("/404?path=" + location.pathname);
        });
      }
    }
  }, [location.pathname, React.Children]);

  return (
    <div className="m78-router-wrap">
      {children}
      <Route path="/404" component={notFound || NotFound} />
    </div>
  );
}

RouterManagerBase.displayName = "RouterManager";

const RouterManager = withRouter(RouterManagerBase);

RouterManager.propTypes = {
  notFound: propTypes.elementType,
  onNotFound: propTypes.func,
  onRouteChange: propTypes.func
};

export { RouterManager };
