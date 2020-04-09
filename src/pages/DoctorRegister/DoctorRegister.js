import React from 'react';
import { Redirect } from 'react-router-dom';
import { message, Button, Input, Form, Icon, Radio, Spin,Select } from 'antd';
import { getItem, setItem } from 'Util20/util';
import logoImg from '../../assets/logo.png';
import { resetPassByEmail } from 'Util/api';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import http from 'Util20/api';
import './DoctorRegister.less';

const { loginLogoSize } = window.pwConfig;
const Option = Select.Option; 
const {
  domainLoginConfig,
  defaultLoginMode,
  enterprisecode,
  themeColor
} = window.pwConfig;

class DoctorRegister extends React.Component {
  constructor() {
    super();
    this.state = {
      showSpin: false,
      disabled:false,
      counts:''
    };
  }

  handleSubmit = () =>{
    const { form } = this.props;
    let res;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      let registerData = {
        userName: form.getFieldValue('userName'), // 姓名
        professionalTitle: form.getFieldValue('professionalTitle'), //职称
        section: form.getFieldValue('section'), //科室类别
        loginAccount: form.getFieldValue('loginAccount'), //登录账号
        password: form.getFieldValue('password'), //登录密码
        telephone: form.getFieldValue('telephone'), //手机号
        code: form.getFieldValue('code') //验证码
        // validresid: 616852937051  // 暂未定义注册表
      };
      this.setState({
        showSpin: true
      });

      //还未定义api
      // try {
      //   res = await http().register(registerData);
      //   if (res.data.error == 0) {
      //     message.success("注册成功");
      //     this.props.history.push({
      //       pathname: "/login",
      //       state: { doctorData }
      //     });
      //   } else {
      //     message.error(res.data.message);
      //   }
      // } catch (error) {
      //   message.error(error.message);
      // }

      this.setState({
        showSpin: false
      });
    });
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
  handleChange = () =>{}
  //切换登录路由
  onLogin = () => {
    this.props.history.push({
      pathname: '/login'
    });
  };
  //切换公司注册
  onCompanyRegister = () =>{
    this.props.history.push({
      pathname: '/companyRegister'
    });
  }
  //切换普通注册
  onRegister = () =>{
    this.props.history.push({
      pathname: '/register'
    });
  }
  render() {
    const { disabled, counts, showSpin } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="page">
        <div className="register-contain">
          <Spin spinning={showSpin}>
            <Form 
            onSubmit={this.handleSubmit}
             className="login-form-userName">
              <h1>医生注册</h1>
              <Form.Item>
              {getFieldDecorator('userName', {
                  rules: [{ required: true, message: '请输入你的姓名!' }]
                })(
                <Input
                label = "姓名"
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="姓名"
                />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('sex', {
                  rules: [{ required: true, message: '请输入你的性别!' }]
                })(
                  <Select onChange = {this.handleChange} placeholder = "选择性别" >
                    <Option value = "男">男</Option>
                    <Option value = "女">女</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item>
              {getFieldDecorator('hospital', {
                  rules: [{ required: true, message: '请输入你的医院!' }]
                })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="所属医院"
                />
                )}
              </Form.Item>
              <Form.Item>
              {getFieldDecorator('section', {
                  rules: [{ required: true, message: '请输入你的科别!' }]
                })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="科别"
                />)}
              </Form.Item>
              <Form.Item>
              {getFieldDecorator('jobTitle', {
                  rules: [{ required: true, message: '请输入你的职称!' }]
                })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="职称"
                />
                )}
              </Form.Item>
              <Form.Item>
              {getFieldDecorator('doctorID', {
                  rules: [{ required: true, message: '请输入你的医生资格证编号!' }]
                })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="医生资格证编号"
                />
                )}
              </Form.Item>
              <Form.Item>
              {getFieldDecorator('loginAccount', {
                  rules: [{ required: true, message: '请输入你的登录账号!' }]
                })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="登录账号"
                />)}
              </Form.Item>
              <Form.Item>
              {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入你的登录密码!' }]
                })(
                <Input
                  prefix={
                    <Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="登录密码"
                />)}
              </Form.Item>
              <Form.Item>
              {getFieldDecorator('telephone', {
                  rules: [{ required: true, message: '请输入你的手机号!' }]
                })(
                <Input
                  prefix={
                    <Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="手机号"
                />)}
              </Form.Item>
              <Form.Item className="login-form-valid">
              {getFieldDecorator('code', {
                  rules: [{ required: true, message: '请输入你的验证码!' }]
                })(
                <Input
                  className="login-form-valid-input"
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="验证码 "
                />)}
                {disabled ? (
                <Button className = "code-button" style={{ marginLeft: '9px' }} type="primary" disabled>
                  {counts}
                </Button>
              ) : (
                <Button
                  style={{ marginLeft: '9px' }}
                  className = "code-button"
                  type="primary"
                  onClick={this.getVerCode}
                >
                  获取验证码
                </Button>
              )}
              </Form.Item>
              <Form.Item>
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
              </Form.Item>
              <Form.Item className="other-register">
                <div className="login-form-doctor-register">
                  <a onClick={this.onRegister}>普通注册</a>
                </div>
                <div className="login-form-company-register">
                  <a onClick={this.onCompanyRegister}>机构注册</a>
                </div>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

export default injectIntl(Form.create()(DoctorRegister));
