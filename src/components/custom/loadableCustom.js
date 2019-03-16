import React from 'react';
import Loadable from 'react-loadable';

const minLoading = <span>加载中...</span>;
export const LzStepY = Loadable({
  loader: () => import('./LzStepY'),
  loading() {
    return minLoading;
  }
});
export const LzStepAflY = Loadable({
  loader: () => import('./LzStepAflY'),
  loading() {
    return minLoading;
  }
});
export const LzSelectPersons = Loadable({
  loader: () => import('./LzSelectPersons'),
  loading() {
    return minLoading;
  }
});
export const Card = Loadable({
  loader: () => import('./Card'),
  loading() {
    return minLoading;
  }
});
export const LzRegister = Loadable({
    loader: () => import('./LzRegister'),
    loading() {
      return minLoading;
    }
  });
export const LzRecord = Loadable({
    loader: () => import('./LzRecord'),
    loading() {
      return minLoading;
    }
  });
export const LzApproval = Loadable({
    loader: () => import('./LzApproval'),
    loading() {
      return minLoading;
    }
  });

