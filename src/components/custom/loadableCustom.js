import React from 'react';
import Loadable from 'react-loadable';

const minLoading = <span>加载中...</span>;

export const TypeIn = Loadable({
  loader: () => import('./TypeIn'),
  loading() {
    return minLoading;
  }
});
