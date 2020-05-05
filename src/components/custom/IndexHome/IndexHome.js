import React from 'react';
import './IndexHome.less';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import { message, Button, Input, Form, Icon, Radio, Spin, Select } from 'antd';
import { Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import logo from '../../../assets/Newlogo.png';
import { withRouter, Switch, Route } from 'react-router-dom';
import http from '../../../util20/api';
import AuthMenu from './AuthMenu';
const { SubMenu } = Menu;

/**
 * 导航栏
 */
class IndexHome extends React.Component {
  state = {
    current: 'mail',
  };

  componentWillMount = () => {
    console.log(this.props);
    http().clearCache();
  };

  //切换入住人员
  userList = async () => {
    console.log('props', this.props);
    this.props.history.push({
      pathname: '/index',
    });
    // this.props.location.pathname = "/index"
    this.props.history.go();
  };

  //切换关注人员
  attentionPeo = async () => {
    console.log('props', this.props);
    this.props.history.push('/attentionPeople');
    // this.props.location.pathname = "/attentionPeople"
    this.props.history.go();
  };

  //切换人员信息
  personInfor = async () => {
    console.log('props', this.props);
    this.props.history.push('/personInfor');
    // this.props.location.pathname = "/attentionPeople"
    this.props.history.go();
  };
  //切换医生页面
  doctorList = async () => {
    console.log('props', this.props);
    this.props.history.push('/doctorList');
    // this.props.location.pathname = "/attentionPeople"
    this.props.history.go();
  };
  //切换个人信息
  personalInformation = async () => {
    console.log('props', this.props);
    this.props.history.push('/personalInformation');
    // this.props.location.pathname = "/attentionPeople"
    this.props.history.go();
  };
  //切换医嘱记录
  doctorAdvice = async () => {
    console.log('props', this.props);
    this.props.history.push('/doctorAdvice');
    // this.props.location.pathname = "/attentionPeople"
    this.props.history.go();
  };

  render() {
    return (
      <div className='indexContainer'>
        <div className='indexContainer__header'>
          <div className='indexContainer__header__logo'>
            <img className='indexContainer__header__logo__png' src={logo} />
            <div className='indexContainer__header__logo__name'>
              <h1>安康医道</h1>
            </div>
          </div>
          <div className='indexContainer__header__menu'>
            <AuthMenu />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(IndexHome);
