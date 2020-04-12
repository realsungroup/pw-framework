import React from 'react';
import { Redirect } from 'react-router-dom';
import { message, Button, Input, Form, Icon, Radio } from 'antd';
import { getItem, setItem } from 'Util20/util';
import logoImg from '../../assets/Newlogo.png';
import { resetPassByEmail } from 'Util/api';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import http from 'Util20/api';
import './Login.less';
import './Login.css';

const { loginLogoSize } = window.pwConfig;

const {
  domainLoginConfig,
  defaultLoginMode,
  enterprisecode,
  themeColor
} = window.pwConfig;

class Login extends React.Component {
  constructor(props) {
    super(props);
    let loginMode = getItem('loginMode');
    if (!loginMode) {
      loginMode = defaultLoginMode;
      setItem('loginMode', defaultLoginMode);
    }
    let language = getItem('language');
    if (!language) {
      language = '中文';
      setItem('language', '中文');
    }
    this.state = {
      redirectToReferrer: false,
      loginMode, // 登录模式：'normal' 普通登录 | 'domain' 域登录
      enterprisecode, // 企业编号
      resetPassModalVisible: false, // 重置密码模态框是否显示
      registerEmail: '', // 注册邮箱
      language,
      loading: false
    };
  }

  componentDidMount() {
    this.setThemeColor(themeColor);
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
      message.error(err.message);
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
    try {
      await resetPassByEmail(registerEmail, enterprisecode);
    } catch (err) {
      console.error(err);
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
        return;
      }
      this.setState({ loading: true });
      const { loginMode } = this.state;
      const { userName, password } = values;
      let res;
      // 普通方式登录
      if (loginMode === 'normal') {
        try {
          res = await http().defaultLogin({
            Code: userName,
            Password: password
          });
        } catch (err) {
          this.setState({ loading: false });
          message.error(err.message);
          return console.error(err.message);
        }
      } else {
        // 域登录
        const domain = domainLoginConfig.domain;
        const usernameSuffix = domainLoginConfig.usernameSuffix;
        const domainUserField = domainLoginConfig.domainUserField;
        try {
          res = await http().domainLogin({
            code: userName + usernameSuffix,
            password,
            loginMethod: 'domain',
            domain,
            domainUserField
          });
        } catch (err) {
          this.setState({ loading: false });
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
            res = await http().setLanguage({ language });
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
        this.setState({ loading: false });
        return message.error(res.ErrorMsg);
      }
    });
  };

  loginModeChange = () => {
    const loginMode = this.state.loginMode === 'normal' ? 'domain' : 'normal';
    this.setState({
      loginMode,
      loading: false
    });
    setItem('loginMode', loginMode);
  };
  //忘记密码
  onForgetPassword = () => {
    this.props.history.push({
      pathname: '/ForgetPassword'
    });
  };

  handleLanguageSelectChange = value => {
    value = value.target.value;
    setItem('language', value);
    document.location.href = '/login';
  };

  renderAddonAfterNode = () => {
    const { loginMode } = this.state;
    if (loginMode === 'domain') {
      const usernameSuffix = domainLoginConfig.usernameSuffix;
      return usernameSuffix;
    }
  };
  onRegister = () => {
    console.log(this.props)
    this.props.history.push({
      pathname: '/register'
    });
  };

  // onDoctorRegister = () => {
  //   console.log(this.props)
  //   this.props.history.push({
  //     pathname: '/doctorRegister'
  //   });
  // };

  render() {
    const { redirectToReferrer, loginMode, language, loading } = this.state;
    // 进入登录页的源路由
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    // 登录成功后，通过 Redirect 组件跳转到源路由
    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    const { getFieldDecorator } = this.props.form;
    const { intl } = this.props;
    return (
      <div className="login">
        <div className="login__left-part" />
        <div className="login__right-part">
          <img
            style={{ height: loginLogoSize }}
            src={logoImg}
            alt="logo"
            className="login__logo-img"
          />
          {/* 切换为 普通登录/域登录 */}
          <div className="login__options">
            <div className="login__options-login-mode">
              <a href="javascript:;" onClick={this.loginModeChange}>
                {loginMode === 'normal' ? (
                  <FM id="Login.NormalLogin" defaultMessage="普通登录" />
                ) : (
                  <FM id="Login.DomainLogin" defaultMessage="域登录" />
                )}
              </a>
            </div>
            <div>
              <Radio.Group
                value={language}
                onChange={this.handleLanguageSelectChange}
              >
                <Radio.Button value="中文">中文</Radio.Button>
                <Radio.Button value="English">English</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          <Form className="login__form">
            <Form.Item>
              {getFieldDecorator('userName', {
                rules: [
                  {
                    required: true,
                    message: (
                      <FM
                        id="Login.userNameTip"
                        defaultMessage="请输入用户名"
                      />
                    )
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder={intl.messages['Login.UsernamePlaceholder']}
                  addonAfter={this.renderAddonAfterNode()}
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: (
                      <FM id="Login.passwordTip" defaultMessage="请输入密码" />
                    )
                  }
                ]
              })(
                <Input.Password
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder={intl.messages['Login.PassworkPlaceholder']}
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                block
                type="primary"
                className="login__submit-btn"
                onClick={this.handleSubmit}
                loading={loading}
              >
                <FM id="Login.Login" defaultMessage="登录" />
              </Button>
            </Form.Item>
            <Form.Item>
               <Button style = {{float:"left"}} onClick={this.onRegister}>账号注册</Button>
              <Button style = {{float:"right"}} onClick={this.onForgetPassword}>忘记密码</Button>
            </Form.Item>
          </Form>
          <div className="login__copyright">Copyright © 2008 ~ 2018 </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(Form.create()(Login));
