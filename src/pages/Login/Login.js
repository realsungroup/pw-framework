import React from 'react';
import { Redirect } from 'react-router-dom';
import { defaultLogin } from '../../util/auth';
import { message, Button, Input, Form, Icon, Radio } from 'antd';
import { domainLogin } from 'Util/api';
import { getItem, setItem } from 'Util1/util';
import logoImg from '../../assets/logo.png';
import { resetPassByEmail, setLanguage } from 'Util/api';
import FmWrap from '../components/FmWrap';
import './Login.less';
import './Login.css';

const { domainLoginConfig, defaultLoginMode, enterprisecode } = window.pwConfig;

class Login extends React.Component {
  constructor(props) {
    super(props);
    let loginMode = getItem('loginMode');
    if (!loginMode) {
      loginMode = defaultLoginMode;
      setItem('loginMode', defaultLoginMode);
    }
    let language = getItem('language') || '中文';
    this.state = {
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
    // preLoadImg([accountIcon, passwordIcon], () => {
    //   this.setState({ ready: true });
    // });
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
    const { validateFields } = this.props.form;
    validateFields(async (err, values) => {
      if (err) {
        return message.error('请填写账号或密码');
      }
      console.log({ values });
      const { loginMode } = this.state;
      const { userName, password } = values;
      let res;
      // 普通方式登录
      if (loginMode === 'normal') {
        try {
          res = await defaultLogin(userName, password);
        } catch (err) {
          message.error(err.message);
          return console.error(err.message);
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
          message.error(err.message);
          return console.error(err.message);
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
        return message.error(res.ErrorMsg);
      }
    });
  };

  loginModeChange = () => {
    const loginMode = this.state.loginMode === 'normal' ? 'domain' : 'normal';
    this.setState({
      loginMode
    });
    setItem('loginMode', loginMode);
  };

  handleLanguageSelectChange = value => {
    value = value.target.value;
    setItem('language', value);
    document.location.href = '/login';
  };

  renderAddonAfterNode = () => {
    const usernameSuffix = domainLoginConfig.usernameSuffix;
    const { loginMode } = this.state;
    if (loginMode === 'domain') {
      return usernameSuffix;
    }
  };

  render() {
    const { ready, redirectToReferrer, loginMode, language } = this.state;
    // 进入登录页的源路由
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    // 登录成功后，通过 Redirect 组件跳转到源路由
    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <div className="login__left-part" />
        <div className="login__right-part">
          <img src={logoImg} alt="logo" className="login__logo-img" />
          {/* 切换为 普通登录/域登录 */}
          <div className="login__options">
            <div className="login__options-login-mode">
              <a href="javascript:;" onClick={this.loginModeChange}>
                {loginMode === 'normal' ? (
                  <FmWrap id="s2" />
                ) : (
                  <FmWrap id="s3" />
                )}
              </a>
            </div>
            <div>
              <Radio.Group
                value={language}
                onChange={this.handleLanguageSelectChange}
              >
                <Radio.Button value="中文">中文</Radio.Button>
                <Radio.Button value="EngLish">EngLish</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          <Form className="login__form">
            <Form.Item>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入用户名' }]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="用户名"
                  addonAfter={this.renderAddonAfterNode()}
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }]
              })(
                <Input.Password
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                block
                type="primary"
                className="login__submit-btn"
                onClick={this.handleSubmit}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
          <div className="login__copyright">Copyright © 2008 ~ 2018 </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(Login);
