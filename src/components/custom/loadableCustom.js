import React from 'react';
import Loadable from 'react-loadable';

const minLoading = <span>加载中...</span>;

export const LzMenuContainerB = Loadable({
  loader: () => import('./LzMenuContainerB'),
  loading() {
    return minLoading;
  }
});
