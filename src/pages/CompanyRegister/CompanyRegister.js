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

class CompanyRegister extends React.Component {
  constructor() {
    super();
    this.state = {
      showSpin: false,
      disabled:false,
      counts:'',
      registerMode:'normal'//normal 普通注册 companyRegister 机构注册 doctorRegister医生注册
    };
  }

  handleSubmit = () =>{

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
  onDoctorRegister = () =>{
    this.props.history.push({
      pathname: '/doctorRegister'
    });
  }

  render() {
    const { disabled, counts, showSpin,registerMode } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="page">
        <div className="register-contain">
          <Spin spinning={showSpin}>
            <Form 
            onSubmit={this.handleSubmit}
             className="login-form-userName">
              <h1>机构注册</h1>
              <Form.Item>
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="单位名称"
                />
              </Form.Item>
              <Form.Item>
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="单位地址"
                />
              </Form.Item>
              <Form.Item>
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="管理员账号"
                />
              </Form.Item>
              <Form.Item>
                <Input
                  prefix={
                    <Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="手机号"
                />
              </Form.Item>
              <Form.Item className="login-form-valid">
                <Input
                  className="login-form-valid-input"
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="验证码 "
                />
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
                  <a onClick={this.onDoctorRegister}>医生注册</a>
                </div>
                <div className="login-form-company-register">
                  <a onClick={this.onRegister}>普通注册</a>
                </div>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </div>
    );
  }
}

export default injectIntl(Form.create()(CompanyRegister));
