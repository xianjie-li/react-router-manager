import React from 'react';
import { createEvent } from '@lxjx/hooks';

export const placeHolderFn = () => null;

const updateEvent = createEvent();

/** 大写首字母 */
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

/** 创建一个随机的key TODO: 提到utils */
export function getRandString() {
  return `K${Math.random()
    .toString()
    .slice(2)}`;
}

export function keepAliveMaxHandle(ctx, pathname) {
  const cList = ctx.cacheList;
  const max = ctx.maxKeepAlive;

  const ind = cList.indexOf(pathname);

  if (ind !== -1) {
    const cur = cList.splice(ind, 1);
    cList.push(...cur);
  } else {
    cList.push(pathname);
  }

  if (cList.length > max) {
    const removed = cList.splice(0, cList.length - max);

    // 触发被移除的route更新
    setTimeout(() => {
      removed.forEach(p => updateEvent.emit(p));
    });
  }
}

export { updateEvent };
