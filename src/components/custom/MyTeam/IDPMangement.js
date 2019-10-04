import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Menu, Icon } from 'antd';
import './MyTeam.less';
import IdpCard from './IdpCard';
import TypeManger from './TypeManger/TypeManger';
import AbilityMangement from './AbilityMangement/AbilityMangement';
import Development from './Development/Development';
import IDPAnalyze from './IDPAnalyze';

/**
 * 管理员确认
 */
const role = 'HR';
class IDPMangement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'inline',
      theme: 'light',
      selectKey: '1',
      collapsed: false
    };
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  renderContent = () => {
    let selectKey = this.state.selectKey;
    switch (selectKey) {
      case '1':
        return (
          <div style={{ width: '100%', height: '100%' }}>
            <IdpCard role={role}></IdpCard>
          </div>
        );
      case '2':
        return <TypeManger></TypeManger>;
      case '3':
        return <AbilityMangement></AbilityMangement>;
      case '4':
        return <Development></Development>;
      case '5':
        return <IDPAnalyze></IDPAnalyze>;
      default:
        break;
    }
  };
  onSelect = e => {
    this.setState({
      selectKey: e.key
    });
  };

  render() {
    const { loading } = this.state;
    return (
      <div className="myteam-contain" style={{ display: 'flex' }}>
        <div style={{ width: `${this.state.collapsed ? '80px' : '200px'}` }}>
          <div
            style={{
              width: '20px',
              height: '40px',
              borderRadius: '0px 100px 100px 0px',
              marginBottom: 16,
              position: 'absolute',
              background: '#1890ff',
              left: this.state.collapsed ? '79px' : '200px',
              top: (this.state.selectKey - 1) * 48 + 4 + 'px',
              display: 'flex',
              alignItems: 'center',
              zIndex: '999',
              justifyContent: 'center',
              boxShadow: '0px 0px 4px 0px rgba(24,144,255,0.4)'
            }}
            onClick={this.toggleCollapsed}
          >
            <Icon
              type={this.state.collapsed ? 'caret-right' : 'caret-left'}
              style={{ fontSize: '20px', color: '#fff', marginLeft: '-8px' }}
            />
          </div>
          <Menu
            style={{ height: '100%' }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode={this.state.mode}
            theme={this.state.theme}
            onSelect={this.onSelect}
            inlineCollapsed={this.state.collapsed}
          >
            <Menu.Item key="1">
              <Icon type="mail" />
              <span> 计划管理</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="calendar" />
              <span> 类别管理 </span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="calendar" />
              <span> 胜任力管理 </span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="calendar" />
              <span> 发展措施管理 </span>
            </Menu.Item>
            <Menu.Item key="5">
              <Icon type="calendar" />
              <span> 图表分析</span>
            </Menu.Item>
          </Menu>
        </div>
        <div
          style={{
            overflow: 'auto',
            width: `${
              this.state.collapsed ? 'calc(100% - 40px)' : 'calc(100% - 200px)'
            }`
          }}
        >
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

export default IDPMangement;
