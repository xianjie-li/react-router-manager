import { createHashHistory, createBrowserHistory } from 'history';

import { Route } from './Route';
import { RouterManager } from './RouterManager';

import './index.css';
import { updateEvent } from './common';

const triggerPageUpdate = updateEvent.emit;

export {
  RouterManager,
  Route,
  createHashHistory,
  createBrowserHistory,
  triggerPageUpdate
};
