import React from 'react';
import { Menu, Icon, Modal, Spin, Badge } from 'antd';
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
import http from 'Util20/api';

const { SubMenu } = Menu;

const waitingApproval = 449449634592;
const approvaling = 544795775918;
const managerApproval = 449442699960;
class AttendanceManage extends React.Component {
  state = {
    mode: 'inline',
    theme: 'light',
    selectKey: 'sub1-7',
    collapsed: false,
    desktop: null,
    approvalRecordVisible: false,
    selectRecord: {},
    loading: false,
    notices: {
      [waitingApproval]: 0,
      [approvaling]: 0,
      [managerApproval]: 0
    }
  };

  componentDidMount = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const desktop = userInfo.UserInfo.EMP_MAINPAGE;
    this.setState({
      desktop
    });
    this.getNotices();
  };

  componentDidUpdate(pervProps, prevState) {
    const { selectKey } = this.state;
    if (selectKey !== prevState.selectKey) {
      this.getNotices();
    }
  }

  getNotices = async () => {
    try {
      let res = await http().getRowCountOfResource({
        resids: '449449634592,544795775918,449442699960',
        dblinkname: 'ehr'
      });
      let data = [...res.data];
      let notices = {};
      data.forEach(item => {
        notices[item.resid] = item.count;
      });
      this.setState({
        notices
      });
    } catch (error) {
      console.log(error);
    }
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  setLoading = loading => this.setState({ loading });

  openApprovalRecordModal = selectRecord =>
    this.setState({ approvalRecordVisible: true, selectRecord });

  renderContent = () => {
    let selectKey = this.state.selectKey;
    let page = null;
    switch (selectKey) {
      // // 加班批量审批
      // case 'workOverTimeApply':
      //   page = <WorkOvertimeApply setLoading={this.setLoading} />;
      // break;
      // 我的考勤申请单
      case 'sub1-1':
        page = <WaitingHRApproval setLoading={this.setLoading} />;
        break;
      case 'sub1-2':
        page = (
          <WaitingApproval
            onOpenApprovalRecordModal={this.openApprovalRecordModal}
            getNotices={this.getNotices}
            setLoading={this.setLoading}
          />
        );
        break;

      case 'sub1-3':
        page = (
          <ApprovalingApplicationForm
            onOpenApprovalRecordModal={this.openApprovalRecordModal}
            setLoading={this.setLoading}
            getNotices={this.getNotices}
          />
        );
        break;
      case 'sub1-4':
        page = (
          <ApprovaledApplicationForm
            onOpenApprovalRecordModal={this.openApprovalRecordModal}
            setLoading={this.setLoading}
          />
        );
        break;
      case 'sub1-5':
        page = <InvalidApplicationForm setLoading={this.setLoading} />;
        break;
      case 'sub1-6':
        page = <RevocationApplicationForm setLoading={this.setLoading} />;
        break;
      case 'sub1-7':
        page = (
          <AttendanceApply
            setLoading={this.setLoading}
            getNotices={this.getNotices}
          />
        );
        break;
      // 经理人考勤审批
      case 'sub2-1':
        page = (
          <ManagerAttendanceApproval
            setLoading={this.setLoading}
            onOpenApprovalRecordModal={this.openApprovalRecordModal}
            getNotices={this.getNotices}
          />
        );
        break;
      case 'sub2-2':
        page = <ManagerCurrentMonthRecord setLoading={this.setLoading} />;
        break;
      case 'sub2-3':
        page = <ManagerApprovalRecordHistory setLoading={this.setLoading} />;
        break;
      case 'sub2-4':
        page = <OverdueApprovalRecord setLoading={this.setLoading} />;
        break;
      case 'sub2-5':
        page = <ManagerAttendanceApprovalAuth setLoading={this.setLoading} />;
        break;
      // 部门独立授权
      case 'departmentAuth':
        page = <DepartmentAuth setLoading={this.setLoading} />;
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
      theme,
      selectRecord,
      loading,
      notices
    } = this.state;
    return (
      <Spin spinning={loading}>
        <div
          id="attendance-manage"
          style={{
            display: 'flex',
            height: desktop === 'DESKTOP' ? '100vh' : 'calc(100vh - 160px)'
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
              defaultSelectedKeys={['sub1-7']}
              defaultOpenKeys={['sub1', 'sub2']}
              mode={mode}
              theme={theme}
              onSelect={this.onSelect}
              inlineCollapsed={collapsed}
              // selectedKeys = {this.selectedKeys}
            >
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
                <Menu.Item key="sub1-1">待HR审核</Menu.Item>

                <Menu.Item key="sub1-2">
                  待审批
                  <Badge count={notices[waitingApproval]} />
                </Menu.Item>
                <Menu.Item key="sub1-3">
                  审批中
                  <Badge count={notices[approvaling]} />
                </Menu.Item>
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
                <Menu.Item key="sub2-1">
                  考勤审批
                  <Badge count={notices[managerApproval]} />
                </Menu.Item>
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
          <Modal
            title="审批记录"
            visible={approvalRecordVisible}
            width="90%"
            destroyOnClose
            onCancel={() => this.setState({ approvalRecordVisible: false })}
            onOk={() => this.setState({ approvalRecordVisible: false })}
          >
            <TableData
              key="revocation-application-form"
              resid="449441441589"
              subtractH={100}
              hasAdvSearch={false}
              hasAdd={false}
              hasRowView={true}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={false}
              hasRowSelection={true}
              actionBarWidth={100}
              dblinkname="ehr"
              height="60vh"
              cmswhere={`C3_446915623989 = '${selectRecord.C3_446915623989 ||
                selectRecord.C3_449011109791}'`}
            />
          </Modal>
        </div>
      </Spin>
    );
  }
}

export default AttendanceManage;
