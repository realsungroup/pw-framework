import React from 'react';
import Loadable from 'react-loadable';
import {Spin} from 'antd'

const minLoading = <Spin spinning={true}><div style={{width:'100vw',height:'100vh',background:'#fff',color:'#fff'}}></div></Spin>;

export const TableData = Loadable({
  loader: () => import('./data/TableData'),
  loading() {
    return minLoading;
  }
});

export const MainTableSubTables = Loadable({
  loader: () => import('./data/MainTableSubTables'),
  loading() {
    return minLoading;
  }
});

export const PWRedirect = Loadable({
  loader: () => import('./data/PWRedirect'),
  loading() {
    return minLoading;
  }
});

export const BusinessManagement = Loadable({
  loader: () => import('./data/BusinessManagement'),
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

export const ArchitectureDiagram = Loadable({
  loader: () => import('./data/ArchitectureDiagram'),
  loading() {
    return minLoading;
  }
});

export const ProcessData = Loadable({
  loader: () => import('./data/ProcessData'),
  loading() {
    return minLoading;
  }
});
