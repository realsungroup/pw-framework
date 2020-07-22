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

export const ExportData = Loadable({
  loader: () => import('./ExportData'),
  loading() {
    return minLoading;
  }
});
export const PatientPeriod = Loadable({
  loader: () => import('./PatientPeriod'),
  loading() {
    return minLoading;
  }
});
