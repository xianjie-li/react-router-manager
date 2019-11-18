/* eslint-disable */
import React from 'react';
import { RouteProps, match } from 'react-router-dom';
import { History, Location } from 'history';

export * from 'react-router-dom';

export const RouteWrapper: React.FC<{
  notFound?: React.FC<any> | React.Component<any, any>;
  onRouteChange?: ({
   location: Location,
   history: History
 }) => void;
  onNotFound?: ({
    location: Location,
    history: History
  }) => void;
}>;

export const EnhanceRoute: React.FC<RouteProps & {
  /** transition type，default is fade */
  transition?: 'bottom' | 'right' | false;
  /** cache the Route render component /> */
  keepAlive?: boolean;
  /** meta data pass to Route render component with props */
  meta?: { [key: string]: any };
  /** EnhanceRoute wrap el extra className */
  wrapperClassName?: string;
}>;

interface RouteComponentProps {
  match: match & { param: object },
  location: Location,
  history: History,
  meta?: object,
}

/* 用于声明路由组件 */
export type RouteFC<T = {}> = React.FC<RouteComponentProps & T>;

/* 用于声明路由组件 */
export type RouteComponent<T = {}, S = {}> = React.Component<RouteComponentProps & T, S>;
