import React from 'react';
import { Redirect } from 'react-router-dom';
import { message, Button, Input, Form, Icon, Radio, Spin, Select } from 'antd';
import { getItem, setItem } from 'Util20/util';
import logoImg from '../../assets/logo.png';
import { resetPassByEmail } from 'Util/api';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import http from 'Util20/api';
import './ForgetPassword.less';

const { loginLogoSize } = window.pwConfig;
const  Option = Select.Option;
const {
  domainLoginConfig,
  defaultLoginMode,
  enterprisecode,
  themeColor
} = window.pwConfig;

class ForgetPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      showSpin: false,
      disabled: false,
      counts: '',
    };
  }

  handleSubmit = () => {
    const { form } = this.props;
    let res;
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      let registerData = {
        userid: form.getFieldValue("loginNum"), //登录账号
        newpass1: form.getFieldValue("newPass"), // 新密码
        resetcode: form.getFieldValue("valid"),//验证码
      };
      try {
        res = await http().ResetPassword(
          registerData
          );
        if (res.data.error == 0) {
          message.success("注册成功");
          // this.props.history.push({
          //   pathname: "/login",
          // });
        } else {
          message.error(res.data.message);
        }
      } catch (error) {
        message.error(error.message);
      }
      
      
    });
  };

  //获取验证码
  getVerCode = async () => {
    const { form } = this.props;
    let res;
    if (form.getFieldValue("phone")) {
      this.countDown();
      try {
        res = await http().getVerCode({
          telephone: form.getFieldValue("phone")
        });
      } catch (error) {
        message.error(error.message);
      }
    } else {
      message.info("请先输入手机号获取验证码");
    }
  };

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

  handleChange = () =>{

  }
  onLogin = () =>{
    this.props.history.push({
      pathname: '/login'
    });
  }

  render() {
    const { disabled, counts, showSpin, registerMode } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="page">
        <div className="register-contain">
          <Spin spinning={showSpin}>
            <Form onSubmit={this.handleSubmit} className="login-form-userName">
              <h1>找回密码</h1>
              <Form.Item>
                {getFieldDecorator('loginNum', {
                  rules: [{ required: true, message: '请输入你的登录账号!' }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="登录账号"
                    autoComplete = 'off'
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('phone', {
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
                {getFieldDecorator('valid', {
                  rules: [{ required: true, message: '请输入你的验证码!' }]
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
              <Form.Item>
                {getFieldDecorator('newPass', {
                  rules: [{ required: true, message: '请输入你的新密码!' }]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="输入你的新密码"
                    type= 'password'
                    autoComplete = 'off'
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={this.handleSubmit}
                  size="normal"
                >
                  提交
                </Button>
                <div className="login-form-register">
                  <a onClick={this.onLogin}>已有账号？请登录</a>
                </div>
              </Form.Item>
             
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

export default injectIntl(Form.create()(ForgetPassword));
