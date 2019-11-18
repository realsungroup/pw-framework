import React from 'react';
import Loadable from 'react-loadable';

const minLoading = <span>加载中...</span>;

export const TableData = Loadable({
  loader: () => import('./data/TableData'),
  loading() {
    return minLoading;
  }
});

export const SelectPersonnel = Loadable({
  loader: () => import('./data/SelectPersonnel'),
  loading() {
    return minLoading;
  }
});

export const FormData = Loadable({
  loader: () => import('./data/FormData'),
  loading() {
    return minLoading;
  }
});

export const OrgChartData = Loadable({
  loader: () => import('./data/OrgChartData'),
  loading() {
    return minLoading;
  }
});

export const BatchTask = Loadable({
  loader: () => import('./data/BatchTask'),
  loading() {
    return minLoading;
  }
});
