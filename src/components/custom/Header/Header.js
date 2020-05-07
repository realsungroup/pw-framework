import React from 'react';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import { message, Button, Input, Form, Icon, Radio, Spin, Select } from 'antd';
import { Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import logo from '../../../assets/Newlogo.png';
import { withRouter, Switch, Route } from 'react-router-dom';
import http from '../../../util20/api';
import AuthMenu from './AuthMenu';
import './Header.less';

const { SubMenu } = Menu;

/**
 * 头部
 */
class Header extends React.Component {
  state = {
    current: 'mail',
  };

  componentWillMount = () => {
    // console.log(this.props);
    http().clearCache();
  };

  quitLogin =() =>{
    localStorage.clear();
    // window.location.reload();
    this.onLogin()
  }


  //切换登录路由
  onLogin = async () => {
    await this.props.history.push({
      pathname: '/login',
    });
  };


  render() {
    return (
      <div className='header'>
        <div className='header__header'>
          <div className='header__header__logo'>
            <img className='header__header__logo__png' src={logo} />
            <div className='header__header__logo__name'>
              <h1>安康医道</h1>
             
            </div>
          </div>
          <div className='header__header__menu'>
            <AuthMenu />
          </div>
          <div className='header__header__quit' onClick = {this.quitLogin}>
           <span> 退出登录</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
