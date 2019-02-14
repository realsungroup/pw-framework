import React from 'react';
import Loadable from 'react-loadable';

const minLoading = <span>加载中...</span>;

export const PatientInfo = Loadable({
  loader: () => import('./PatientInfo'),
  loading() {
    return minLoading;
  }
});
