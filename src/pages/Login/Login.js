import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  message,
  Button,
  Input,
  Form,
  Icon,
  Radio,
  Modal,
  Checkbox,
  Popconfirm
} from 'antd';
import { getItem, setItem } from 'Util20/util';
import logoImg from '../../assets/logo-26.png';
import { resetPassByEmail } from 'Util/api';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import http from 'Util20/api';
import './Login.less';
import './Login.css';
import { biLogin } from 'Util20/bi';

const {
  loginLogoSize,
  domainLoginConfig,
  defaultLoginMode,
  enterprisecode,
  themeColor
} = window.pwConfig[process.env.NODE_ENV];
const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.resetKeyWordURL;
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
        // try {
        //   await biLogin({
        //     userName,
        //     password,
        //     isGetUserNameAndPassword: false,
        //   });
        // } catch (err) {
        //   message.error(`bi 系统登录失败:${err.message}`);
        // }
        this.setState({
          redirectToReferrer: true,
        });
      } else if (result === 'N') {
        this.setState({ loading: false });
        return message.error(res.ErrorMsg);
      }
      const { from } = this.props.location.state || { from: { pathname: '/' } };

      await this.getTablesConfigure();

      window.location.href = from.pathname + from.search || '';
    });
  };
  // subChangePSW = async ()=>{
  // 	let res;
  // 	try{
  // 		res =http().changePassword({
  // 			OldPass:'',
  // 			NewPass1:''
  // 		})
  // 	}catch(error){
  // 		console.error(error);
  // 	}
  // }
  getTablesConfigure = async () => {
    try {
      const configure = window.pwConfig[process.env.NODE_ENV].tablesConfig;
      const res = await http().getResourcesData(configure);
      setItem('tablesConfigure', JSON.stringify(res.data));
    } catch (error) {
      console.error(error);
    }
  };

  loginModeChange = () => {
    const loginMode = this.state.loginMode === 'normal' ? 'domain' : 'normal';
    this.setState({
      loginMode,
      loading: false
    });
    setItem('loginMode', loginMode);
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
  mailResPSW = async () => {
    if (this.state.userNameLogin) {
      this.setState({ loading: true });
      let res;
      try {
        res = http({baseURL:baseURL}).forgetPassword({
          badgeno: this.state.userNameLogin,
          enterprisecode: parseInt((100000 * Math.random()) ^ Math.random()),
          sendEmail: 'Y'
        });

        this.setState({ loading: false, isSend: true });
        message.success('已发送验证邮件到您到邮箱，请及时查收！');
        var _this = this;
        _this.setState({ timer: 5 });
        var t = 5;
        var timerC = setInterval(function() {
          t = _this.state.timer - 1;
          _this.setState({ timer: t });
          if (t == 0) {
            clearInterval(timerC);
            _this.setState({ timer: 5, isSend: false });
          }
        }, 1000);
      } catch (e) {
        //TODO handle the exception
        message.error(e);
        console.log(e);
        this.setState({ loading: false });
      }
    } else {
      message.error('请先输入员工ID！');
    }
  };
  subResPSW = async () => {
    if (this.state.PSWNewEcho != this.state.PSWNew) {
      message.error('两次密码输入不一致！');
    } else if (!this.state.userNameLogin) {
      message.error('请输入用户ID！');
    } else if (!this.state.OTP) {
      message.error('请输入验证码！');
    } else {
      this.setState({ loading: true });
      let res;
      try {
        res = await http({baseURL:baseURL}).getResetPassword({
          userid: this.state.userNameLogin,
          newpass1: this.state.PSWNew,
          resetcode: this.state.OTP
        });

        this.forgetPSW(false);
        this.setState({ loading: false });
        message.success('已经成功重置密码！');
      } catch (e) {
        if (e.message == 'resetcode 不正确') {
          message.error('验证码错误');
        } else {
          message.error(e.message);
        }
        //TODO handle the exception
        // console.log(e.error);
        // this.forgetPSW(false);
        // this.setState({loading:false});
      }
    }
  };
  resetPSW = v => {
    this.setState({ showReset: v });
  };
  forgetPSW = v => {
    this.setState({ showForget: v });
  };
  render() {
    const { redirectToReferrer, loginMode, language, loading } = this.state;
    // 进入登录页的源路由
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    // 登录成功后，通过 Redirect 组件跳转到源路由
    // if (redirectToReferrer) {
    //   return <Redirect to={from} />;
    // }
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
            {/* <div>
              <Radio.Group
                value={language}
                onChange={this.handleLanguageSelectChange}
              >
                <Radio.Button value="中文">中文</Radio.Button>
                <Radio.Button value="English">English</Radio.Button>
              </Radio.Group>
            </div> */}
          </div>

          <Form className="login__form">
            <Form.Item>
              {getFieldDecorator('userName', {
                rules: [
                  {
                    required: true,
                    message: (
                      <FM
                        id={
                          loginMode === 'normal'
                            ? 'Login.DomainUserNameTip'
                            : 'Login.userNameTip'
                        }
                        defaultMessage={
                          loginMode === 'normal' ? '请输入工号' : '请输入用户名'
                        }
                      />
                    )
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder={
                    loginMode === 'normal'
                      ? intl.messages['Login.DomainUsernamePlaceholder']
                      : intl.messages['Login.UsernamePlaceholder']
                  }
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
            <div style={{ overflow: 'hidden' }}>
              <a
                style={{
                  marginBottom: '8px',
                  display: 'block',
                  float: 'left',
                  display: 'none'
                }}
                onClick={() => {
                  this.resetPSW(true);
                }}
              >
                修改密码
              </a>

              <a
                style={{
                  marginBottom: '8px',
                  display: 'block',
                  float: 'right'
                }}
                onClick={() => {
                  this.forgetPSW(true);
                }}
              >
                重置密码
              </a>
            </div>
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
          </Form>
          <div className="login__copyright">Copyright © 2008 ~ 2018 </div>
        </div>

        <Modal
          title="重置密码"
          visible={this.state.showForget}
          onCancel={() => this.forgetPSW(false)}
          destroyOnClose
          width={'800px'}
          onOk={() => this.subResPSW()}
        >
          <p style={{ marginBottom: '8px' }}>员工ID</p>
          <Input
            type="number"
            placeholder="请输入员工ID"
            style={{ marginBottom: '8px' }}
            value={this.state.userNameLogin}
            onChange={v => {
              this.setState({ userNameLogin: v.target.value });
            }}
          />
          <p style={{ marginBottom: '8px' }}>
            请先发送验证邮件，然后填写邮件中的验证码
          </p>
          <Button
            type="normal"
            disabled={this.state.isSend}
            style={{ verticalAlign: 'top', width: '120px' }}
            onClick={this.mailResPSW}
          >
            {this.state.isSend
              ? '等待' + this.state.timer + '秒'
              : '发送验证邮件'}
          </Button>
          <Input
            type="text"
            style={{ width: 'calc(100% - 136px)', marginLeft: '16px' }}
            placeholder="请输入邮件中的验证码"
            value={this.state.OTP}
            onChange={v => {
              this.setState({ OTP: v.target.value });
            }}
          />
          <p style={{ marginBottom: '8px', marginTop: '8px' }}>新密码</p>
          <Input.Password
            placeholder="请输入新密码"
            style={{ marginBottom: '8px' }}
            value={this.state.PSWNew}
            onChange={v => {
              this.setState({ PSWNew: v.target.value });
            }}
          />
          <p style={{ marginBottom: '8px' }}>再次输入新密码</p>
          <Input.Password
            placeholder="请再次输入新密码"
            value={this.state.PSWNewEcho}
            onChange={v => {
              this.setState({ PSWNewEcho: v.target.value });
            }}
            style={{ marginBottom: '8px' }}
          />

          <span style={{ marginTop: '8px', color: 'red' }}>
            {this.state.PSWNewEcho != this.state.PSWNew
              ? '两次输入的新密码不一致'
              : null}
          </span>
        </Modal>
      </div>
    );
  }
}

export default injectIntl(Form.create()(Login));
