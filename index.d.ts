/* eslint-disable */
import React from "react";
import { RouteProps, match } from "react-router-dom";
import { History, Location } from "history";

/** manage Route components list */
export const RouterManager: React.FC<{
  notFound?: React.ComponentType<RouteComponentProps>;
  onRouteChange?: ({ location: Location, history: History }) => void;
  onNotFound?: ({ location: Location, history: History }) => void;
}>;

/** Used to configure a routing item, which is a superset of the Route component of react-router */
export const Route: React.FC<RouteProps & {
  /** transition type，default is fade */
  transition?: "bottom" | "right" | false;
  /** not destroy when the page leaves */
  keepAlive?: boolean;
  /** extra meta passed to the page component */
  meta?: { [key: string]: any };
  /** page className */
  className?: string;
  /** page style, avoid using such as display、opacity、transform、z-index, etc. */
  style?: React.CSSProperties;
}>;

/** Types used for page component extends */
interface RouteComponentProps<Param extends Object = {}, Meta = {}> {
  match: match & { param: Param };
  location: Location;
  history: History;
  meta?: Meta;
}
