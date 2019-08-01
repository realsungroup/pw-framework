import React from 'react';
import { TableData } from '../../common/loadableCommon';
import FiscalYearPlan from '../FiscalYearPlan/index'
import { Button, Menu, Icon, Switch } from 'antd';
import './MyTeam.less'
import http from 'Util20/api';
import IdpCard from './IdpCard';

/**
 * 管理员确认
 */
class MyTeam extends React.Component {
  state = {
    mode: 'inline',
    theme: 'light',
    selectKey:'2',
    collapsed: false,
  };
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  renderContent = () => {
    // switch()
    let selectKey = this.state.selectKey
    console.log("selectKey",selectKey)
    switch(selectKey){
      case '1':
      return <div style={{width:"100%"}}><FiscalYearPlan  CreateableGroups={['611769739518']}></FiscalYearPlan></div>
      case '2':
        return <IdpCard></IdpCard>
        case '3':
        return 'ccc'
        case '4':
          return <IdpCard></IdpCard>
          case '5':
            return ''
        default:
          return 'aaaa'
  }
}
  onSelect = (e) => {
    this.setState({
      selectKey:e.key
    })
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="myteam-contain" style={{ height: '100%' }}>
        <div style={{width: 256}}>
        {/* <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
          <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button> */}
        <Menu
          style={{  height: '100%' }}
          defaultSelectedKeys={['4']}
          defaultOpenKeys={['sub1']}
          mode={this.state.mode}
          theme={this.state.theme}
          onSelect = {this.onSelect}
          inlineCollapsed={this.state.collapsed}
          // selectedKeys = {this.selectedKeys}
        >
          <Menu.Item key="1">
            <Icon type="mail" />
            <span> 课程计划</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="calendar" />
            <span>  下属课程 </span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="calendar" />
            <span> 团队发展 </span>
          </Menu.Item>
          <Menu.Item key="4">
            <Icon type="calendar" />
            <span> IDP管理 </span>
          </Menu.Item>
          <Menu.Item key="5">
            <Icon type="calendar" />
            <span> 试用期管理</span>
          </Menu.Item>
        </Menu>
        </div>
      <div style={{width:"calc(100% - 256px)"}}>
        {this.renderContent()}
      </div>
      </div>
    );
  }
}

export default MyTeam;
