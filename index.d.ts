import React from 'react';
import { RouteProps, match } from 'react-router-dom';
import { RouteChildrenProps } from 'react-router';
import { History, Location } from 'history';

/** <Route/> component props */
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

/** The match object for users contains a lot of common routing information */
export interface RMMatchProps extends RouteChildrenProps {
  /** Original props passed to the Route component */
  routeProps: RMRouteProps;
}

export interface RMWithinHOC {
  (Component?: React.ComponentType<any>): React.ComponentType<any>;
}

/** Used for routing component declaration */
export interface RouteComponentProps<Query = any, Params = any, Meta = any> {
  match: match<Params> & { query: Partial<Query> };
  location: Location;
  history: History;
  meta: Meta;
  pageElRef: React.RefObject<HTMLDivElement>;
}

/** Used for routing component declaration */
export interface RouteComponent<
  Props = any,
  Query = any,
  Params = any,
  Meta = any
> extends React.FC<RouteComponentProps<Query, Params, Meta> & Props> {
  routerConfig: RMRouteProps;
}

/** manage Route components */
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

/** Route components, used to configure a routing item, which is a superset of the Route component of react-router */
export const Route: React.FC<RMRouteProps>;

/** invalid and overload the page cache of keepAlive */
export const triggerPageUpdate: (path: string) => void;
