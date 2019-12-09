import React from 'react';
import { TableData } from '../../common/loadableCommon';
import FiscalYearPlan from '../FiscalYearPlan/index';
import ReportForm2 from '../StatisticalReportForms/ReportForm2';
import SubordinateCoures from '../SubordinateCourses';
import DirectorProbation from '../Probation/DirectorProbation';
import { Button, Menu, Icon, Switch } from 'antd';
import './MyTeam.less';
import http from 'Util20/api';
import IdpCard from './IdpCard';

/**
 * 管理员确认
 */
const role = 'Manger';
class MyTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'inline',
      theme: 'light',
      selectKey: '4',
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
    console.log('desktop', desktop);
    this.setState({
      desktop
    });
  };
  renderContent = () => {
    // switch()
    let selectKey = this.state.selectKey;
    console.log('selectKey', selectKey);
    switch (selectKey) {
      
      case '1':
        return (
          <FiscalYearPlan CreateableGroups={['611769739518']}></FiscalYearPlan>
        );
      case '2':
        return <SubordinateCoures></SubordinateCoures>;
      case '3':
        return (
          <div style={{ width: '100%', height: '100%' }}>
            <IdpCard role={role}></IdpCard>
          </div>
        );
      case '4':
        return <DirectorProbation></DirectorProbation>;
      case '5':
        return <ReportForm2 chara='director'/>
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
      <div
        className="myteam-contain"
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
              top:
                this.state.desktop === 'DESKTOP'
                  ? (this.state.selectKey - 1) * 48 + 4 + 'px'
                  : (this.state.selectKey - 1) * 48 + 164 + 'px',
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
            defaultSelectedKeys={['4']}
            defaultOpenKeys={['sub1']}
            mode={this.state.mode}
            theme={this.state.theme}
            onSelect={this.onSelect}
            inlineCollapsed={this.state.collapsed}
            // selectedKeys = {this.selectedKeys}
          >
            <Menu.Item key="1">
              <Icon type="mail" />
              <span> 课程计划</span>
            </Menu.Item>
            <Menu.Item key="2">
            <Icon type="book" />
              <span> 下属课程 </span>
            </Menu.Item>
            <Menu.Item key="3">
            <Icon type="heat-map" />
              <span> IDP管理 </span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="calendar" />
              <span> 试用期管理</span>
            </Menu.Item>
            <Menu.Item key="5">
            <Icon type="line-chart" />
              <span> 培训报告</span>
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

export default MyTeam;
