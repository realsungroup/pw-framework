import React, { Component } from 'react';
import { Button, message } from 'antd';
import OrgChartData from './components/common/data/OrgChartData';
import http from 'Util20/api';
import { setItem } from 'Util20/util';

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
            id="org-chart"
            // level={2}
            isExpandAllChildren={true}
            parentNodeId="parentId"
            enableDragDrop
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

export default App;
