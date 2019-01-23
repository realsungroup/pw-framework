import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import App from './App';
import * as serviceWorker from './serviceWorker';

// 使用自定义 loading
import loadingGif from './assets/loading.gif';
import { Spin } from 'antd';
Spin.setDefaultIndicator(
  <img style={{ width: 69, height: 75 }} src={loadingGif} alt="" />
);

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
