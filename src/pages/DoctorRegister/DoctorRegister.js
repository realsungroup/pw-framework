import React from 'react';
import { Redirect } from 'react-router-dom';
import { message, Button, Input, Form, Icon, Radio, Spin, Select } from 'antd';
import { getItem, setItem } from 'Util20/util';
import http from 'Util20/api';
import './DoctorRegister.less';
import { FormattedMessage as FM, injectIntl } from 'react-intl';

const { loginLogoSize } = window.pwConfig;
const Option = Select.Option;
const {
  domainLoginConfig,
  defaultLoginMode,
  enterprisecode,
  themeColor,
} = window.pwConfig;
const resid = 639670405070;

class DoctorRegister extends React.Component {
  constructor() {
    super();
    this.state = {
      showSpin: false,
      disabled: false,
      counts: '',
      redirectToReferrer: false,
      once:true
    };
  }

  register = () => {
    const { form } = this.props;
    let res;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      let registerData = {
        // hospital: form.getFieldValue('hospital'), // 所属医院
        nickname: form.getFieldValue('userName'), // 用户姓名
        // sex: form.getFieldValue('sex'), // 性别
        userid: form.getFieldValue('loginAccount'), //登录账号
        newpass: form.getFieldValue('password'), // 登录密码
        Handphone: form.getFieldValue('telephone'), // 手机号
        validcode: form.getFieldValue('code'), //验证码
        validresid: 616851598789, // 注册表
      };
      this.setState({
        showSpin: true,
      });
      try {
        res = await http().register(registerData);
        if (res.error == 0) {
          message.success('注册成功');
        } else {
          message.error(res.message);
        }
        this.handleLogin();
      } catch (error) {
        message.error(error.message);
      }

      this.setState({
        showSpin: false,
      });
    });
  };
  //登录
  handleLogin = async () => {
    let res;
    const { form } = this.props;
    let registerInformation = {
      hospital: form.getFieldValue('hospital'), // 所属医院
      doctorName: form.getFieldValue('userName'), // 用户姓名
      doctorSex: form.getFieldValue('sex'), // 性别
      division: form.getFieldValue('section'), // 科别
      credentialsID: form.getFieldValue('doctorID'), // 资格证编号
      telphone: form.getFieldValue('telephone'), // 手机号
      userid: form.getFieldValue('loginAccount'), //登录账号
      newpass: form.getFieldValue('password'), // 登录密码
    };
    try {
      res = await http().defaultLogin({
        Code: registerInformation.userid,
        Password: registerInformation.newpass,
        // useCookie:true
      });
      const result = res.OpResult;
      if (result === 'Y') {
        // 登录成功
        setItem('userInfo', JSON.stringify(res));
        const userInfo = JSON.parse(getItem('userInfo'));
        if (res.OpResult !== 'Y') {
          message.error(res.ErrorMsg);
        } else {
          setItem('userInfo', JSON.stringify(userInfo));
        }
        // this.setState({
        //   redirectToReferrer: true
        // });
      } else if (result === 'N') {
        return message.error(res.ErrorMsg);
      }
      if(this.state.once){
        this.saveRegisterInfo(registerInformation);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  //保存注册信息
  saveRegisterInfo = async (data) => {
    let dataInfo = {
      ...data,
      _id: 1,
      _state: 'editoradd',
    };
    let res;
    try {
      res = await http().saveRecord({
        resid,
        data: JSON.stringify([dataInfo]),
      });
    } catch (error) {
      message.error(error.message);
    }
    http().clearCache();
    this.handleLogin();
    this.setState({
      once: false,
    });
    setTimeout(() => {
      this.props.history.replace('/');
      window.location.reload();
    }, 500);
  };

  //获取验证码
  getVerCode = async () => {
    const { form } = this.props;
    let res;
    if (form.getFieldValue('phone')) {
      this.countDown();
      try {
        res = await http().getVerCode({
          telephone: form.getFieldValue('phone'),
        });
      } catch (error) {
        message.error(error.message);
      }
    } else {
      message.info('请先输入手机号获取验证码');
    }
  };

  //验证码计时
  countDown = () => {
    let counts = 60;
    this.setState({
      disabled: true,
    });
    let countdown = setInterval(() => {
      if (counts > 0) {
        counts--;
        this.setState({
          counts,
        });
      } else {
        this.setState({
          disabled: false,
        });
        clearInterval(countdown);
      }
    }, 1000);
  };
  handleChange = () => {};
  //切换登录路由
  onLogin = () => {
    this.props.history.push({
      pathname: '/login',
    });
  };
  //切换公司注册
  onCompanyRegister = () => {
    this.props.history.push({
      pathname: '/companyRegister',
    });
  };
  //切换普通注册
  onRegister = () => {
    this.props.history.push({
      pathname: '/register',
    });
  };
  render() {
    const { disabled, counts, showSpin, redirectToReferrer } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <div className="page">
        <div className="register-contain">
          <Spin spinning={showSpin}>
            <Form onSubmit={this.handleSubmit} className="login-form-userName">
              <h1 style={{ marginTop: '9px' }}>医生注册</h1>
              <Form.Item label="姓名" className="registerForm">
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: '请输入你的姓名!' }],
                })(
                  <Input
                    label="姓名"
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="姓名"
                  />
                )}
              </Form.Item>
              <Form.Item label="性别" className="registerForm">
                {getFieldDecorator('sex', {
                  rules: [{ required: true, message: '请选择你的性别!' }],
                })(
                  <Select
                    onChange={this.handleChange}
                    placeholder="选择性别"
                    style={{ width: '190px' }}
                  >
                    <Option value="男">男</Option>
                    <Option value="女">女</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="所属医院" className="registerForm">
                {getFieldDecorator('hospital', {
                  rules: [{ required: true, message: '请输入你的医院!' }],
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="所属医院"
                  />
                )}
              </Form.Item>
              <Form.Item label="科别" className="registerForm">
                {getFieldDecorator('section', {
                  rules: [{ required: true, message: '请输入你的科别!' }],
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="科别"
                  />
                )}
              </Form.Item>
              <Form.Item label="医生资格证编号" className="registerForm">
                {getFieldDecorator('doctorID', {
                  rules: [
                    { required: true, message: '请输入你的医生资格证编号!' },
                  ],
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="医生资格证编号"
                  />
                )}
              </Form.Item>
              <Form.Item label="登录账号" className="registerForm">
                {getFieldDecorator('loginAccount', {
                  rules: [{ required: true, message: '请输入你的登录账号!' }],
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="登录账号"
                  />
                )}
              </Form.Item>
              <Form.Item label="登录密码" className="registerForm">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入你的登录密码!' }],
                })(
                  <Input
                    prefix={
                      <Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="登录密码"
                    type ="password"
                  />
                )}
              </Form.Item>
              <Form.Item label="手机号" className="registerForm">
                {getFieldDecorator('telephone', {
                  rules: [{ required: true, message: '请输入你的手机号!' }],
                })(
                  <Input
                    prefix={
                      <Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="手机号"
                  />
                )}
              </Form.Item>
              <Form.Item className="login-form-valid">
                {getFieldDecorator('code', {
                  rules: [{ required: true, message: '请输入你的验证码!' }],
                })(
                  <Input
                    className="login-form-valid-input"
                    prefix={
                      <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="验证码 "
                  />
                )}
                {disabled ? (
                  <Button
                    className="code-button"
                    style={{ marginLeft: '9px' }}
                    type="primary"
                    disabled
                  >
                    {counts}
                  </Button>
                ) : (
                  <Button
                    style={{ marginLeft: '9px' }}
                    className="code-button"
                    type="primary"
                    onClick={this.getVerCode}
                  >
                    获取验证码
                  </Button>
                )}
              </Form.Item>
              <div className="registerOrLogin">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={this.register}
                  size="default"
                >
                  注册
                </Button>
                <div className="login-form-register">
                  <a onClick={this.onLogin}>已有账号？请登录</a>
                </div>
              </div>
              <div className="other-register">
                <div className="login-form-doctor-register">
                  <a onClick={this.onRegister}>普通注册</a>
                </div>
                <div className="login-form-company-register">
                  <a onClick={this.onCompanyRegister}>机构注册</a>
                </div>
              </div>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

export default injectIntl(Form.create()(DoctorRegister));
