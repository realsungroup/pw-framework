import React from 'react';
import { Menu, Icon, Modal } from 'antd';
import './AttendanceManage.less';
import WorkOvertimeApply from './WorkOvertimeApply';
import AttendanceApply from './AttendanceApply';
import WaitingHRApproval from './WaitingHRApproval';
import WaitingApproval from './WaitingApproval';
import InvalidApplicationForm from './InvalidApplicationForm';
import RevocationApplicationForm from './RevocationApplicationForm';
import ApprovalingApplicationForm from './ApprovalingApplicationForm';
import ApprovaledApplicationForm from './ApprovaledApplicationForm';
import DepartmentAuth from './DepartmentAuth';
import ManagerAttendanceApproval from './ManagerAttendanceApproval';
import ManagerCurrentMonthRecord from './ManagerCurrentMonthRecord';
import ManagerApprovalRecordHistory from './ManagerApprovalRecordHistory';
import OverdueApprovalRecord from './OverdueApprovalRecord';
import ManagerAttendanceApprovalAuth from './ManagerAttendanceApprovalAuth';
import TableData from '../../common/data/TableData';

const { SubMenu } = Menu;

class AttendanceManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'inline',
      theme: 'light',
      selectKey: 'workOverTimeApply',
      collapsed: false,
      desktop: null,
      approvalRecordVisible: false
    };
  }
  componentDidMount = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const desktop = userInfo.UserInfo.EMP_MAINPAGE;
    this.setState({
      desktop
    });
  };
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  openApprovalRecordModal = () =>
    this.setState({ approvalRecordVisible: true });

  renderContent = () => {
    let selectKey = this.state.selectKey;
    let page = null;
    switch (selectKey) {
      // 加班批量审批
      case 'workOverTimeApply':
        page = <WorkOvertimeApply />;
        break;
      // 我的考勤申请单
      case 'sub1-1':
        page = <WaitingHRApproval />;
        break;
      case 'sub1-2':
        page = (
          <WaitingApproval
            onOpenApprovalRecordModal={this.openApprovalRecordModal}
          />
        );
        break;

      case 'sub1-3':
        page = (
          <ApprovalingApplicationForm
            onOpenApprovalRecordModal={this.openApprovalRecordModal}
          />
        );
        break;
      case 'sub1-4':
        page = (
          <ApprovaledApplicationForm
            onOpenApprovalRecordModal={this.openApprovalRecordModal}
          />
        );
        break;
      case 'sub1-5':
        page = <InvalidApplicationForm />;
        break;
      case 'sub1-6':
        page = <RevocationApplicationForm />;
        break;
      case 'sub1-7':
        page = <AttendanceApply />;
        break;
      // 经理人考勤审批
      case 'sub2-1':
        page = <ManagerAttendanceApproval />;
        break;
      case 'sub2-2':
        page = <ManagerCurrentMonthRecord />;
        break;
      case 'sub2-3':
        page = <ManagerApprovalRecordHistory />;
        break;
      case 'sub2-4':
        page = <OverdueApprovalRecord />;
        break;
      case 'sub2-5':
        page = <ManagerAttendanceApprovalAuth />;
        break;
      // 部门独立授权
      case 'departmentAuth':
        page = <DepartmentAuth />;
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
    const {
      approvalRecordVisible,
      desktop,
      collapsed,
      mode,
      theme
    } = this.state;
    return (
      <div
        id="attendance-manage"
        style={{
          display: 'flex',
          height: desktop === 'DESKTOP' ? '100%' : 'calc(100vh - 160px)'
        }}
      >
        <div
          style={{
            width: `${collapsed ? '80px' : '200px'}`,
            height: '100%',
            overflow: 'auto',
            backgroundColor: '#fff'
          }}
        >
          <div
            style={{
              width: '20px',
              height: '40px',
              borderRadius: '0px 100px 100px 0px',
              marginBottom: 16,
              position: 'absolute',
              background: '#1890ff',
              left: collapsed ? '79px' : '200px',
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
              type={collapsed ? 'caret-right' : 'caret-left'}
              style={{ fontSize: '20px', color: '#fff', marginLeft: '-8px' }}
            />
          </div>
          <Menu
            style={{ height: '100%' }}
            defaultSelectedKeys={['workOverTimeApply']}
            defaultOpenKeys={['sub1']}
            mode={mode}
            theme={theme}
            onSelect={this.onSelect}
            inlineCollapsed={collapsed}
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
              <Menu.Item key="sub1-7">考勤申请</Menu.Item>
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
              <Menu.Item key="sub2-1">考勤审批</Menu.Item>
              <Menu.Item key="sub2-2">当月审批记录</Menu.Item>
              <Menu.Item key="sub2-3">历史审批记录</Menu.Item>
              <Menu.Item key="sub2-4">已过期未审批记录</Menu.Item>
              <Menu.Item key="sub2-5">考勤审批授权</Menu.Item>
            </SubMenu>
            <Menu.Item key="departmentAuth">
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
            width: `${collapsed ? 'calc(100% - 40px)' : 'calc(100% - 200px)'}`
          }}
        >
          {this.renderContent()}
        </div>
        <Modal title="审批记录" visible={approvalRecordVisible} width="80%">
          <TableData
            key="revocation-application-form"
            resid="449441441589"
            subtractH={200}
            hasAdvSearch={false}
            hasAdd={false}
            hasRowView={false}
            hasRowDelete={false}
            hasRowEdit={false}
            hasDelete={false}
            hasModify={false}
            hasRowModify={false}
            hasRowSelection={true}
            actionBarWidth={100}
            dblinkname="ehr"
          />
        </Modal>
      </div>
    );
  }
}

export default AttendanceManage;
