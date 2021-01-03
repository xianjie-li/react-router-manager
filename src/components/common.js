import React from 'react';
import { createEvent } from '@lxjx/hooks';

export const placeHolderFn = () => null;

export function firstUpperCase(str = '') {
  if (!str) return '';
  return str.replace(/^./, $1 => $1.toUpperCase());
}

/** 执行preInterceptor检测，根据匹配结果返回[pass, replaceNode]格式内容 */
export function preInterceptorHandle(props, preInterceptor) {
  if (!preInterceptor || !props.match) return [true];

  const returned = preInterceptor(props);

  return [!(returned === null || React.isValidElement(returned)), returned];
}

export function getRandString() {
  return `K${Math.random()
    .toString()
    .slice(2)}`;
}

const updateEvent = createEvent();

export { updateEvent };
