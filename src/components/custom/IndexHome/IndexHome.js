import React from 'react';
import './IndexHome.less';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
import { message, Button, Input, Form, Icon, Radio, Spin, Select } from 'antd';
import { Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import logo from '../../../assets/Newlogo.png';
import {withRouter} from 'react-router-dom'
import http from "../../../util20/api"

const { SubMenu } = Menu;

/**
 * 导航栏
 */
class IndexHome extends React.Component {
  state = {
    current: 'mail',
  };

  componentWillMount = () =>{
    console.log(this.props)
    http().clearCache()
  }

  //切换入住人员
  userList = async () => {
    console.log("props",this.props)
    this.props.history.push({
      pathname: '/index',
    });
    // this.props.location.pathname = "/index"
    this.props.history.go()

  };

  //切换关注人员
  attentionPeo = async () => {
    console.log("props",this.props)
    this.props.history.push('/attentionPeople');
    // this.props.location.pathname = "/attentionPeople"
    this.props.history.go()

  };

  //切换人员信息
  personInfor = async () => {
    console.log("props",this.props)
    this.props.history.push('/personInfor');
    // this.props.location.pathname = "/attentionPeople"
    this.props.history.go()

  };
  //切换医生页面
  doctorList = async () => {
    console.log("props",this.props)
    this.props.history.push('/doctorList');
    // this.props.location.pathname = "/attentionPeople"
    this.props.history.go()

  };
  //切换个人信息
  personalInformation = async () => {
    console.log("props",this.props)
    this.props.history.push('/personalInformation');
    // this.props.location.pathname = "/attentionPeople"
    this.props.history.go()

  };
  //切换医嘱记录
  doctorAdvice = async () => {
    console.log("props",this.props)
    this.props.history.push('/doctorAdvice');
    // this.props.location.pathname = "/attentionPeople"
    this.props.history.go()

  };

  render() {
    return (
      <div className="indexContainer">
        <div className="indexContainer__header">
          <div className="indexContainer__header__logo">
            <img className="indexContainer__header__logo__png" src={logo} />
            <div className="indexContainer__header__logo__name">
              <h1>安康医道</h1>
            </div>
          </div>
          <div className="indexContainer__header__menu">
            <Menu
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
            >
              <SubMenu title={<>会员选项</>}>
                <Menu.ItemGroup>
                  <Menu.Item  key="setting:1">查询信息</Menu.Item>
                  <Menu.Item onClick = {this.personalInformation} key="setting:2">填写信息</Menu.Item>
                  <Menu.Item onClick = {this.doctorList} key="setting:3">选择医护</Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>

              <SubMenu title={<>机构选项</>}>
                <Menu.ItemGroup>
                  <Menu.Item  onClick = {this.personInfor} key="setting:4">人员信息</Menu.Item>
                  <Menu.Item onClick = {this.userList} key="setting:5">入住人员</Menu.Item>
                  <Menu.Item onClick = {this.attentionPeo} key="setting:6">关注人员</Menu.Item>
                  <Menu.Item onClick = {this.doctorList} key="setting:7">对接医生或医院</Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>
              <SubMenu title={<>医生选项</>}>
                <Menu.ItemGroup>
                  <Menu.Item key="setting:8">医生在线提示</Menu.Item>
                  <Menu.Item key="setting:9">响应会员要求</Menu.Item>
                  <Menu.Item onClick = {this.doctorAdvice} key="setting:10">医嘱记录</Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>
              <SubMenu title={<>护理选项</>}>
                <Menu.ItemGroup>
                  <Menu.Item key="setting:11">护理对象状态变化记录</Menu.Item>
                  <Menu.Item key="setting:12">护理建议</Menu.Item>
                  <Menu.Item key="setting:13">医护沟通</Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>
              <SubMenu title={<>管理员选项</>}>
                <Menu.ItemGroup>
                  <Menu.Item key="setting:14">数据库管理</Menu.Item>
                  <Menu.Item key="setting:15">数据表管理</Menu.Item>
                  <Menu.Item key="setting:16">网站结构管理</Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>

              <SubMenu title={<>培训选项</>}>
                <Menu.ItemGroup>
                  <Menu.Item key="setting:17">培训时间</Menu.Item>
                  <Menu.Item key="setting:18">培训地点</Menu.Item>
                  <Menu.Item key="setting:19">培训内容</Menu.Item>
                  <Menu.Item key="setting:20">参与人员</Menu.Item>
                  <Menu.Item key="setting:21">培训记录</Menu.Item>
                </Menu.ItemGroup>
              </SubMenu>
            </Menu>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter( IndexHome);
