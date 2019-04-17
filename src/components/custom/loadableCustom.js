import React from 'react';
import Loadable from 'react-loadable';

const minLoading = <span>加载中...</span>;

export const TypeIn = Loadable({
  loader: () => import('./TypeIn'),
  loading() {
    return minLoading;
  }
});
export const TableDataWrap = Loadable({
  loader: () => import('./TableDataWrap'),
  loading() {
    return minLoading;
  }
});
export const TableDataInner = Loadable({
  loader: () => import('./TableDataInner'),
  loading() {
    return minLoading;
  }
});

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
export const LzAFFOS = Loadable({
  loader: () => import('./LzAFFOS'),
  loading() {
    return minLoading;
  }
});

export const ViProvider = Loadable({
  loader: () => import('./ViProvider'),
  loading() {
    return minLoading;
  }
});
export const LzProApp = Loadable({
  loader: () => import('./LzProApp'),
  loading() {
    return minLoading;
  }
});




//导出问卷系统的组件
export const MyQuery = Loadable({
  loader: () => import('./MyQuery'),
  loading() {
    return minLoading;
  }
});
export const QueryTable = Loadable({
  loader: () => import('./QueryTable'),
  loading() {
    return minLoading;
  }
});
export const Paging = Loadable({
  loader: () => import('./Paging'),
  loading() {
    return minLoading;
  }
});
// export const xxxxx组件名 = Loadable({
//   loader: () => import('./xxx组件名'),
//   loading() {
//     return minLoading;
//   }
// });
export const QueryType = Loadable({
  loader: () => import('./QueryType'),
  loading() {
    return minLoading;
  }
});
export const QuerySet = Loadable({
  loader: () => import('./QuerySet'),
  loading() {
    return minLoading;
  }
});
// export const Choice = Loadable({
//   loader: () => import('Choice'),
//   loading() {
//     return minLoading;
//   }
// });