import React from 'react';
import Loadable from 'react-loadable';
import { Spin } from 'antd';

const minLoading = (
  <Spin spinning={true}>
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#fff',
        color: '#fff'
      }}
    ></div>
  </Spin>
);

export const SampleApp = Loadable({
  loader: () => import('./SampleApp'),
  loading() {
    return minLoading;
  }
});