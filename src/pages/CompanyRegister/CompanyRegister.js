import React from 'react';
import { Redirect } from 'react-router-dom';
import { message, Button, Input, Form, Icon, Radio, Spin } from 'antd';
import { getItem, setItem } from 'Util20/util';
import logoImg from '../../assets/logo.png';
import { resetPassByEmail } from 'Util/api';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import http from 'Util20/api';
import './CompanyRegister.less';

const { loginLogoSize } = window.pwConfig;

const {
  domainLoginConfig,
  defaultLoginMode,
  enterprisecode,
  themeColor
} = window.pwConfig;
const resid = 639670241314;

class CompanyRegister extends React.Component {
  constructor() {
    super();
    this.state = {
      showSpin: false,
      disabled: false,
      redirectToReferrer:false,
      counts: '',
      registerMode: 'normal' //normal 普通注册 companyRegister 机构注册 doctorRegister医生注册
    };
  }

  
  register =  () => {
    const { form } = this.props;
    let res;
     this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      let registerData = {
        // companyName: form.getFieldValue('companyName'), // 机构名称
        nickname: form.getFieldValue('userName'), // 法人姓名
        // sex: form.getFieldValue('companyAddress'), // 机构地址
        userid: form.getFieldValue('adminAccount'), //管理员账号
        newpass: form.getFieldValue('adminPassword'), // 密码
        Handphone: form.getFieldValue('telephone'), // 手机号
        validcode: form.getFieldValue('verificationCode'), //验证码
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
        companyName: form.getFieldValue('companyName'), // 机构名称
        legalPerson: form.getFieldValue('userName'), // 法人姓名
        companyAddress: form.getFieldValue('companyAddress'), // 机构地址
        telephone: form.getFieldValue('telephone'), // 联系电话
        userid: form.getFieldValue('adminAccount'), //登录账号
        newpass: form.getFieldValue('adminPassword'), // 登录密码

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
          this.props.history.replace(
            '/fnmodule?resid=588425594397&recid=635517197444&type=人口信息学&title=患者信息'
          )
          window.location.reload();
        } else if (result === 'N') {
          return message.error(res.ErrorMsg);
        }
       this.saveRegisterInfo(registerInformation)
      } catch (error) {
        message.error(error.message);
      }
  };

  //保存注册信息
  saveRegisterInfo = async (data) =>{
   let  dataInfo = {
      ...data,
      _id : 1,
      _state : "editoradd"
    }
    let res;
    try {
          res = await http().saveRecord({
           resid,
           data:JSON.stringify([dataInfo])
          });
        } catch (error) {
          message.error(error.message);
          }
  }

  //验证码计时
  countDown = () => {
    let counts = 60;
    this.setState({
      disabled: true
    });
    let countdown = setInterval(() => {
      if (counts > 0) {
        counts--;
        this.setState({
          counts
        });
      } else {
        this.setState({
          disabled: false
        });
        clearInterval(countdown);
      }
    }, 1000);
  };
  //切换登录路由
  onLogin = () => {
    this.props.history.push({
      pathname: '/login'
    });
  };
  //切换普通注册
  onRegister = () => {
    this.props.history.push({
      pathname: '/register'
    });
  };
  //切换医生注册
  onDoctorRegister = () => {
    this.props.history.push({
      pathname: '/doctorRegister'
    });
  };

  render() {
    const { disabled, counts, showSpin,redirectToReferrer } = this.state;
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
              <h1>机构注册</h1>
              <Form.Item label="机构名称" className = "registerForm">
                {getFieldDecorator('companyName', {
                  rules: [{ required: true, message: '请输入你的机构名称!' }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="机构名称"
                  />
                )}
              </Form.Item>
              <Form.Item label="法人姓名" className = "registerForm">
                {getFieldDecorator('userName', {
                  rules: [
                    { required: true, message: '请输入上述机构法人姓名!' }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="法人姓名"
                  />
                )}
              </Form.Item>
              <Form.Item label="机构地址" className = "registerForm">
                {getFieldDecorator('companyAddress', {
                  rules: [{ required: true, message: '请输入你的机构地址!' }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="机构地址"
                  />
                )}
              </Form.Item>
              <Form.Item label="管理员账号" className = "registerForm">
                {getFieldDecorator('adminAccount', {
                  rules: [{ required: true, message: '请输入你的管理员账号!' }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="管理员账号"
                  />
                )}
              </Form.Item>
              <Form.Item label="管理员密码" className = "registerForm">
                {getFieldDecorator('adminPassword', {
                  rules: [{ required: true, message: '请输入你的管理员密码!' }]
                })(
                  <Input
                    prefix={
                      <Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="管理员密码"
                  />
                )}
              </Form.Item>
              <Form.Item label="手机号" className = "registerForm">
                {getFieldDecorator('telephone', {
                  rules: [{ required: true, message: '请输入你的手机号!' }]
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
                {getFieldDecorator('verificationCode', {
                  rules: [{ required: true, message: '请输入验证码!' }]
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
              <div className = 'registerOrLogin'>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={this.register}
                  size="normal"
                >
                  注册
                </Button>
                <div className="login-form-register">
                  <a onClick={this.onLogin}>已有账号？请登录</a>
                </div>
              </div>
              <div className="other-register">
                <div className="login-form-doctor-register">
                  <a onClick={this.onDoctorRegister}>医生注册</a>
                </div>
                <div className="login-form-company-register">
                  <a onClick={this.onRegister}>普通注册</a>
                </div>
              </div>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

export default injectIntl(Form.create()(CompanyRegister));
