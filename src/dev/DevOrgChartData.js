import React, { Component } from 'react';
import { Button, message } from 'antd';
import OrgChartData from 'Common/data/OrgChartData';
import http from 'Util20/api';
import { setItem } from 'Util20/util';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
// 使用自定义 loading
import loadingGif from '../assets/loading.gif';
import { Spin } from 'antd';
Spin.setDefaultIndicator(
  <img style={{ width: 69, height: 75 }} src={loadingGif} alt="" />
);

class App extends Component {
  handleLoginClick = async () => {
    const code = 'demo1';
    const password = '66287175';

    let res;
    try {
      res = await http().login({
        Code: code,
        Password: password
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    message.success('登录成功');
    setItem('userInfo', JSON.stringify(res));
  };

  handleClearCache = async () => {
    let res;
    try {
      await http().clearCache();
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    message.success('清除缓存成功');
  };

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ width: '100%', height: 800 }}>
          <OrgChartData
            resid={461598195535}
            template="luba"
            chartId="org-chart"
            chartWrapId="org-chart-wrap"
            level={3}
            isExpandAllChildren={true}
            parentNodeId="parentId"
            enableDragDrop
            showFields={{
              field_0: 'name',
              field_1: 'title',
              img_0: 'image'
            }}
          />
        </div>
        <Button onClick={this.handleLoginClick} type="primary">
          登录
        </Button>
        <Button onClick={this.handleClearCache} type="primary">
          清除缓存
        </Button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
