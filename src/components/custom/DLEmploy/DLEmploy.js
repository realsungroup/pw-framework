import React from 'react';
import JobInterviewRecord from './JobInterviewRecord';
import JobPeopleList from './JobPeopleList';
import PastInterviewList from './PastInterviewList';
import RecruitJob from './RecruitJob';
import ReportPeople from './ReportPeople';
import UploadMedical from './UploadMedical';
import LaborCorSelect from './LaborCorSelect';
import { Button, Menu, Icon, Switch } from 'antd';
import './DLEmploy.less';
import http from 'Util20/api';

/**
 * 管理员确认
 */
const role = 'Manger';
class DLEmploy extends React.Component {
  constructor(props) {
    super(props)
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
    // switch()
    let selectKey = this.state.selectKey;
    console.log('selectKey', selectKey);
    switch (selectKey) {
      case '1':
        return <JobInterviewRecord></JobInterviewRecord>;
      case '2':
        return <RecruitJob></RecruitJob>
      case '3':
        return <JobPeopleList></JobPeopleList>
      case '4':
        return (
          <div style={{ width: '100%', height: "100%" }}>
            <PastInterviewList></PastInterviewList>
          </div>
        );
      case '5':
        return <UploadMedical></UploadMedical>;
      case '6':
        return <ReportPeople></ReportPeople>;
        case '7':
        return <LaborCorSelect></LaborCorSelect>;
      default:
        return '';
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
          // selectedKeys = {this.selectedKeys}
          >
            <Menu.Item key="1">
              <Icon type="mail" />
              <span> 职位面试安排表</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="calendar" />
              <span> 招聘职务管理 </span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="calendar" />
              <span> 求职人员清单 </span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="calendar" />
              <span> 面试通过人员 </span>
            </Menu.Item>
            <Menu.Item key="5">
              <Icon type="calendar" />
              <span> 上传体检报告</span>
            </Menu.Item>
            <Menu.Item key="6">
              <Icon type="calendar" />
              <span> 报道人员</span>
            </Menu.Item>
            <Menu.Item key="7">
              <Icon type="calendar" />
              <span> 劳务公司分配</span>
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

export default DLEmploy;
