import React from 'react';
import Loadable from 'react-loadable';

const minLoading = <span>加载中...</span>;

export const TableData = Loadable({
  loader: () => import('./data/TableData'),
  loading() {
    return minLoading;
  }
});
