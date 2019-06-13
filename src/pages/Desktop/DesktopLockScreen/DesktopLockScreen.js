import React from 'react';
import './DesktopLockScreen.less';
import PropTypes from 'prop-types';
import LockScreen from './LockScreen';
import { Input, Button, Icon, message } from 'antd';
import { defaultLogin, domainLogin } from 'Util/api';

const { domainLoginConfig, lockScreenWaitTime } = window.pwConfig[
  process.env.NODE_ENV
];
const time = lockScreenWaitTime;

/**
 * 桌面锁屏组件
 */
export default class DesktopLockScreen extends React.PureComponent {
  static propTypes = {
    /**
     * 用户信息
     */
    userInfo: PropTypes.object.isRequired
  };

  static defaultProps = {};

  state = {
    password: ''
  };

  getLockScreenRef = node => {
    this.lockScreenRef = node;
  };

  unloadCallback = () => {
    localStorage.removeItem('userInfo');
  };

  handleMaskShow = () => {
    window.addEventListener('unload', this.unloadCallback);
  };

  handlePassChange = e => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = async () => {
    const { password } = this.state;
    let res;
    // 普通方式登录
    const loginMode = localStorage.getItem('loginMode');
    if (loginMode === 'normal') {
      try {
        res = await defaultLogin(this.userCode, password);
      } catch (err) {
        console.error(err);
        return message.error(err.message);
      }

      // 域登录
    } else {
      const domain = domainLoginConfig.domain;
      const usernameSuffix = domainLoginConfig.usernameSuffix;
      const domainUserField = domainLoginConfig.domainUserField;
      try {
        res = await domainLogin(
          this.domainCode||this.userCode + usernameSuffix,
          password,
          domain,
          domainUserField
        );
      } catch (err) {
        console.error(err);
        return message.error(err.message);
      }
    }
    if (res.OpResult === 'N') {
      return message.error('密码输入错误');
    }
    localStorage.setItem('userInfo', JSON.stringify(res));
    this.lockScreenRef.removeLockScreen();
    this.setState({ password: '' });
    window.removeEventListener('unload', this.unloadCallback);
  };

  render() {
    const { password } = this.state;
    const { userInfo } = this.props;

    let username;
    if (userInfo) {
      this.userCode = userInfo.UserCode;
      this.domainCode=userInfo.DomainCode;
      username = userInfo.Data;
    }

    return (
      <LockScreen
        className="app-lock-screen-wrap"
        time={time}
        maskShow={this.handleMaskShow}
        ref={this.getLockScreenRef}
      >
        <div className="app-lock-screen">
          <div className="app-lock-screen__logo">
            <span className="app-lock-screen__logo-bg" />
            <span className="iconfont icon-lock-logo" />
          </div>
          <div className="app-lock-screen__username">{username}</div>

          <div className="app-lock-screen__input">
            <Input.Password
              value={password}
              onChange={this.handlePassChange}
              style={{ width: 200, marginRight: 10 }}
              onPressEnter={this.handleSubmit}
            />
            <Button
              type="primary"
              shape="circle"
              className="app-lock-screen__submit"
              onClick={this.handleSubmit}
            >
              <Icon type="login" theme="outlined" />
            </Button>
          </div>
        </div>
      </LockScreen>
    );
  }
}
