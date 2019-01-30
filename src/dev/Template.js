import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, message } from 'antd';
import http from 'Util20/api';
import { setItem } from 'Util20/util';
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
      <div>
        <Button onClick={this.handleLoginClick} type="primary">
          登录
        </Button>
        <Button onClick={this.handleClearCache} type="primary">
          清除缓存
        </Button>
        <div>dev area</div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
