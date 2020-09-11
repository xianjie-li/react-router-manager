import React from 'react';

export function NotFound({ match, history }) {
  return (
    <div className="bk-404-page">
      <div>
        <h1 className="bk-404-page_title">😭 404 Not Found</h1>
        <div className="bk-404-page_url">{match.params && match.params.path}</div>
        <a className="bk-404-page_link" onClick={() => history.goBack()}>点击返回</a>
      </div>
    </div>
  );
}
