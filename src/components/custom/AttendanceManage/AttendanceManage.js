import React from 'react';
import { Menu, Icon } from 'antd';
import './AttendanceManage.less';
import WorkOvertimeApply from './WorkOvertimeApply';

const { SubMenu } = Menu;

class AttendanceManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'inline',
      theme: 'light',
      selectKey: 'workOverTimeApply',
      collapsed: false,
      desktop: null
    };
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  componentDidMount = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const desktop = userInfo.UserInfo.EMP_MAINPAGE;
    this.setState({
      desktop
    });
  };
  renderContent = () => {
    let selectKey = this.state.selectKey;
    console.log('selectKey', selectKey);
    let page = null;
    switch (selectKey) {
      case 'workOverTimeApply':
        page = <WorkOvertimeApply />;
        break;

      default:
        break;
    }

    return page;
  };

  onSelect = e => {
    this.setState({
      selectKey: e.key
    });
  };

  render() {
    return (
      <div
        id="attendance-manage"
        style={{
          display: 'flex',
          height:
            this.state.desktop === 'DESKTOP' ? '100%' : 'calc(100vh - 160px)'
        }}
      >
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
              top: 4,
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
            defaultSelectedKeys={['workOverTimeApply']}
            // defaultOpenKeys={['sub1']}
            mode={this.state.mode}
            theme={this.state.theme}
            onSelect={this.onSelect}
            inlineCollapsed={this.state.collapsed}
            // selectedKeys = {this.selectedKeys}
          >
            <Menu.Item key="workOverTimeApply">
              <Icon type="mail" />
              <span className="attendance-manage_menu__level1">
                加班批量申请
              </span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="appstore" />
                  <span className="attendance-manage_menu__level1">
                    我的考勤申请单
                  </span>
                </span>
              }
            >
              <Menu.Item key="sub1-1">待HR审批</Menu.Item>
              <Menu.Item key="sub1-2">待审批</Menu.Item>
              <Menu.Item key="sub1-3">审批中</Menu.Item>
              <Menu.Item key="sub1-4">已审批</Menu.Item>
              <Menu.Item key="sub1-5">已作废</Menu.Item>
              <Menu.Item key="sub1-6">已撤销</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="appstore" />
                  <span className="attendance-manage_menu__level1">
                    经理人考勤审批
                  </span>
                </span>
              }
            >
              <Menu.Item key="sub2-1">当月审批记录</Menu.Item>
              <Menu.Item key="sub2-2">历史审批记录</Menu.Item>
              <Menu.Item key="sub2-3">已过期未审批记录</Menu.Item>
              <Menu.Item key="sub2-4">考勤审批授权</Menu.Item>
            </SubMenu>
            <Menu.Item key="4">
              <Icon type="calendar" />
              <span className="attendance-manage_menu__level1">
                部门独立授权
              </span>
            </Menu.Item>
          </Menu>
        </div>
        <div
          style={{
            overflow: 'auto',
            backgroundColor: '#fff',
            padding: 28,
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

export default AttendanceManage;
