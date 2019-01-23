import React from 'react';
import { Redirect } from 'react-router-dom';
import { defaultLogin } from '../../util/auth';
import { preLoadImg } from '../../util/imgUtil';
import { Spin, message, Modal, Button, Input, Select } from 'antd';
import accountIcon from './images/account.png';
import passwordIcon from './images/password.png';
import './Login.less';
import { domainLogin } from 'Util/api';
import { getItem, setItem } from 'Util/util';

import loginLeft from './images/login-left.png';
import logoImg from '../../assets/logo.png';
import { resetPassByEmail, setLanguage } from 'Util/api';
import FmWrap from '../components/FmWrap';

const domainLoginConfig = window.domainLogin;

const { enterprisecode } = window.powerWorks;
const Option = Select.Option;

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    let loginMode = getItem('loginMode');
    if (!loginMode) {
      loginMode = window.defaultLoginMode;
      setItem('loginMode', window.defaultLoginMode);
    }
    let language = getItem('language') || '中文';
    this.state = {
      userName: '',
      password: '',
      errorMsg: '',
      ready: false,
      redirectToReferrer: false,
      loginMode, // 登录模式：'normal' 普通登录 | 'domain' 域登录
      enterprisecode, // 企业编号
      resetPassModalVisible: false, // 重置密码模态框是否显示
      registerEmail: '', // 注册邮箱
      language
    };
  }

  componentDidMount() {
    preLoadImg([accountIcon, passwordIcon], () => {
      this.setState({ ready: true });
    });
    this.setThemeColor(window.themeColor);
  }

  setThemeColor = themeColor => {
    try {
      window.less
        .modifyVars(themeColor)
        .then(() => {})
        .catch(err => {
          message.error(err.message);
        });
    } catch (err) {
      message.error('设置主题色出错，请刷新页面');
    }
  };

  handleUserNameChange = e => {
    this.setState({ userName: e.target.value });
  };

  handlePasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  handleForgetPass = () => {
    this.setState({ resetPassModalVisible: true });
  };

  handleResetPassModalCancel = () => {
    this.setState({ resetPassModalVisible: false });
  };

  handleResetPassConfirm = async () => {
    const { registerEmail } = this.state;
    let res;
    try {
      res = await resetPassByEmail(registerEmail, enterprisecode);
    } catch (err) {
      return message.error(err.message);
    }
  };

  handleRegisterEmailChange = e => {
    const val = e.target.value;
    this.setState({ registerEmail: val });
  };

  handleSubmit = () => {
    this.login();
  };

  login = async () => {
    const { userName, password, loginMode } = this.state;

    let res;
    // 普通方式登录
    if (loginMode === 'normal') {
      try {
        res = await defaultLogin(userName, password);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      // 域登录
      const domain = domainLoginConfig.domain;
      const usernameSuffix = domainLoginConfig.usernameSuffix;
      const domainUserField = domainLoginConfig.domainUserField;
      try {
        res = await domainLogin(
          userName + usernameSuffix,
          password,
          domain,
          domainUserField
        );
      } catch (err) {
        console.error(err.message);
      }
    }
    const result = res.OpResult;
    if (result === 'Y') {
      setItem('userInfo', JSON.stringify(res));
      // 登录成功
      const userInfo = JSON.parse(getItem('userInfo'));
      const userLanguage = userInfo.UserInfo.EMP_LANGUAGE;

      const language = getItem('language');

      if (userLanguage !== language) {
        let res;
        try {
          res = await setLanguage(language);
        } catch (err) {
          return message.error(err.message);
        }
        if (res.OpResult !== 'Y') {
          message.error(res.ErrorMsg);
        } else {
          userInfo.UserInfo.EMP_LANGUAGE = language;
          setItem('userInfo', JSON.stringify(userInfo));
        }
      }
      this.setState({
        redirectToReferrer: true
      });
    } else if (result === 'N') {
      const errorMsg = res.ErrorMsg;
      return this.setState({ errorMsg });
    }
  };

  loginModeChange = () => {
    const loginMode = this.state.loginMode === 'normal' ? 'domain' : 'normal';
    this.setState({
      loginMode
    });
    setItem('loginMode', loginMode);
  };

  handleLanguageSelectChange = value => {
    setItem('language', value);
    document.location.href = '/login';
  };

  render() {
    const {
      userName,
      password,
      errorMsg,
      ready,
      redirectToReferrer,
      loginMode,
      registerEmail,
      language
    } = this.state;
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    const usernameSuffix = domainLoginConfig.usernameSuffix;
    return (
      <div className="login">
        <Spin spinning={!ready}>
          <div className="login-left-part">
            <img src={loginLeft} alt="" />
          </div>
          <div className="login-right-part">
            <img src={logoImg} alt="logo" className="login__logo-img" />
            {/* 切换为 普通登录/域登录 */}
            <div className="login__options">
              <div>
                <span>
                  <FmWrap id="s1" />{' '}
                </span>
                <a href="javascript:;" onClick={this.loginModeChange}>
                  {loginMode === 'normal' ? (
                    <FmWrap id="s3" />
                  ) : (
                    <FmWrap id="s2" />
                  )}
                </a>
              </div>

              <div>
                <Select
                  onChange={this.handleLanguageSelectChange}
                  value={language}
                  style={{ width: 120 }}
                >
                  <Option value="中文">中文</Option>
                  <Option value="English">English</Option>
                </Select>
              </div>
            </div>

            <div className="login-input">
              <div style={{ marginTop: 10 }} className="login-input-item">
                <div className="login-input-icon">
                  <img
                    className="login-input-icon-inner"
                    src={accountIcon}
                    alt=""
                  />
                </div>

                <input
                  type="text"
                  className="login-input-box"
                  placeholder="请输入您的账号"
                  value={userName}
                  onChange={this.handleUserNameChange}
                />

                {loginMode === 'domain' ? (
                  <span style={{ fontWeight: 'bold' }}>{usernameSuffix}</span>
                ) : null}
              </div>

              <div className="login-input-item">
                <div className="login-input-icon">
                  <img
                    className="login-input-icon-inner"
                    src={passwordIcon}
                    alt=""
                  />
                </div>

                <input type="hidden" />
                <input
                  type="password"
                  className="login-input-box"
                  placeholder="请输入您的密码"
                  value={password}
                  onChange={this.handlePasswordChange}
                />
              </div>

              {errorMsg && <div className="login-fail">{errorMsg}</div>}
              <div className="login-right-part-row">
                <div
                  className="login-forget-password"
                  onClick={this.handleForgetPass}
                >
                  忘记密码？
                  <Modal
                    title="找回密码"
                    visible={this.state.resetPassModalVisible}
                    footer={
                      <div className="login__reset-pass-modal">
                        <Button onClick={this.handleResetPassConfirm}>
                          确认
                        </Button>
                      </div>
                    }
                    onCancel={this.handleResetPassModalCancel}
                    maskClosable
                  >
                    <Input
                      type="email"
                      placeholder="请输入注册邮箱"
                      value={registerEmail}
                      onChange={this.handleRegisterEmailChange}
                    />
                  </Modal>
                </div>
                <div className="login-register" onClick={() => {}}>
                  注册
                </div>
              </div>
            </div>
            <button className="login-submit-btn" onClick={this.handleSubmit}>
              登 录
            </button>
            <div className="login-copyright">Copyright © 2008 ~ 2018 </div>
          </div>
        </Spin>
      </div>
    );
  }
}
