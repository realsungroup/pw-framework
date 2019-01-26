import React from 'react';
import Loadable from 'react-loadable';
import FullLoading from 'react-fullscreen-loading';

const minLoading = <span>加载中...</span>;

export const TableData = Loadable({
  loader: () => import('./data/TableData'),
  loading() {
    return <FullLoading loading={true} />;
  }
});
