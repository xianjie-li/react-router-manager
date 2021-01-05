/** 过滤列表, 生成路由配置 */
function filterList(paths, r) {
  return (
    paths
      /* 所有j|tsx文件 */
      .map(path => {
        const _path = path.replace(/\.+\/|\.jsx|\.tsx/g, '');

        return {
          path: _path,
          originPath: path
        };
      })
      /* 只匹配大写开头的目录 */
      .filter(pathMeta => /^[A-Z].+/.test(pathMeta.path))
      /* 处理目录主页, 加载模块 */
      .map(pathMeta => {
        const slice = pathMeta.path.split('/');
        let res = [];
        let exact = false;

        // 长度为1时直接exact
        if (slice.length === 1) {
          exact = true;
          res = slice;
        } else {
          slice.forEach(item => {
            if (res.indexOf(item) === -1) {
              res.push(item);
            } else {
              exact = true;
            }
          });
        }

        const path = `/${res.join('/')}`;
        const m = r(pathMeta.originPath);
        const component = m.default;

        return {
          path,
          ...component.routerConfig,
          component: m.default,
          exact
        };
      })
  );
}

/** 通过require.context API来生成路由配置 */
export default function generateConventionRouter() {
  // @ts-ignore check with https://webpack.docschina.org/api/module-variables/#webpack_require-webpack-specific
  if (typeof __webpack_require__ !== 'function') {
    console.warn(
      'RouterManager.conventionRouter can only be used in the webpack environment'
    );
  }

  try {
    const contextRequire = require.context(
      // require.context只能静态识别!
      '../../../../src/view/',
      // '../view/',
      true,
      /(\.jsx|\.tsx)$/
    );

    const list = filterList(contextRequire.keys(), contextRequire);

    const indexRoute = list.find(item => item.path === '/Index');

    if (indexRoute) {
      list.unshift({ ...indexRoute, path: '/' });
    }

    return list;
  } catch (e) {
    console.warn(
      'Dynamic routing gets an exception. Check that the routing directory is correct, this feature can only be used in the webpack environment.'
    );
    console.warn(e.stack);
  }
}
