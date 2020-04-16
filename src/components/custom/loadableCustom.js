import React from 'react';
import Loadable from 'react-loadable';

const minLoading = <span>加载中...</span>;

export const PatientInfo = Loadable({
  loader: () => import('./PatientInfo'),
  loading() {
    return minLoading;
  }
});

export const LzModal = Loadable({
  loader: () => import('../../lib/unit-component/components/LzModal'),
  loading() {
    return minLoading;
  }
});

export const LzMenuForms = Loadable({
  loader: () => import('./LzMenuForms'),
  loading() {
    return minLoading;
  }
});

export const RecordInput = Loadable({
  loader: () => import('./RecordInput'),
  loading() {
    return minLoading;
  }
});
export const ShowDataChart = Loadable({
  loader: () => import('./ShowDataChart'),
  loading() {
    return minLoading;
  }
});
