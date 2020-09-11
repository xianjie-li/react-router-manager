/* eslint-disable */
import React from "react";
import { RouteProps, match } from "react-router-dom";
import { History, Location } from "history";

export const RouterManager: React.FC<{
  /** TODO: 正确组件类型 */
  notFound?: React.FC<any> | React.Component<any, any>;
  onRouteChange?: ({ location: Location, history: History }) => void;
  onNotFound?: ({ location: Location, history: History }) => void;
  /** 自定义history对象 */
  history?: History;
  /** false | 使用hash路由 */
  hash?: boolean;
}>;

/** 如果未自定义history对象, 则导出当前使用的history对象 */
export const history: History;

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

/** 用于页面组件继承的类型，Param为查询解析对象，Meta注册时传入的元数据 */
interface RouteComponentProps<Param extends Object = {}, Meta = {}> {
  match: match & { param: Param };
  location: Location;
  history: History;
  meta?: Meta;
}
