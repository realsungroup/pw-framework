import React from 'react';
import './HRProbation.less';
import TableData from '../../../common/data/TableData';
import {
  Button,
  message,
  Menu,
  Icon,
  Modal,
  Spin,
  Popconfirm,
  Select
} from 'antd';
import ProbationForms from '../ProbationForms';
import http from 'Util20/api';

const { confirm } = Modal;
const { Option } = Select;
const resid = '619609481002';
const status = ['全部', '待转正', '转正中', '已转正'];
class HRProbation extends React.Component {
  state = {
    isShowTable: true, //控制页面显示内容
    selectedRecord: {},
    desktop: null,
    mode: 'inline',
    theme: 'light',
    selectKey: '1',
    spinning: false,
    collapsed: false,
    selectedStatus: '全部'
  };
  componentDidMount = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const desktop = userInfo.UserInfo.EMP_MAINPAGE;
    this.setState({
      desktop
    });
  };
  onSelect = e => {
    this.setState({
      selectKey: e.key
    });
  };
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  renderContent = () => {
    let selectKey = this.state.selectKey;
    const cmswhere =
      this.state.selectedStatus === '全部'
        ? ''
        : `regStatus = '${this.state.selectedStatus}'`;
    switch (selectKey) {
      case '1':
        return (
          <div id="hr-probation">
            {this.state.isShowTable ? (
              <div style={{ height: '100vh' }}>
                <TableData
                  key="1"
                  resid={resid}
                  subtractH={240}
                  hasAdd={false}
                  hasRowView={false}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  hasDelete={false}
                  hasModify={false}
                  hasRowModify={false}
                  hasRowSelection={true}
                  actionBarWidth={100}
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  refTargetComponentName="TableData"
                  cmswhere={cmswhere}
                  customRowBtns={[
                    (record, btnSize) => (
                      <Button
                        type="primary"
                        onClick={this.onCustomViewBtnClick(record)}
                        size={btnSize}
                      >
                        查看
                      </Button>
                    )
                  ]}
                  actionBarExtra={this.actionBarExtra(
                    this.state.selectedStatus
                  )}
                />
              </div>
            ) : (
              <ProbationForms
                memberId={this.state.selectedRecord.memberId}
                employedId={this.state.selectedRecord.C3_625051545181}
                goBack={this.goBack}
                roleName="HR"
                setIsShowTable={this.setIsShowTable}
              />
            )}
          </div>
        );
      case '2':
        return (
          <div style={{ height: '100vh' }}>
            <TableData
              key="2"
              resid="619268906732"
              subtractH={240}
              hasAdd={true}
              hasRowView={false}
              hasRowDelete={true}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={true}
              hasRowSelection={false}
            />
          </div>
        );
      case '3':
        return (
          <div style={{ height: '100vh' }}>
            <TableData
              key="3"
              resid="619281130628"
              subtractH={240}
              hasAdd={true}
              hasRowView={false}
              hasRowDelete={true}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={true}
              hasRowSelection={false}
            />
          </div>
        );
      case '4':
        return (
          <div style={{ height: '100vh' }}>
            <TableData
              resid="622983009643"
              key="4"
              subtractH={240}
              hasAdd={true}
              hasRowView={false}
              hasRowDelete={true}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={true}
              hasRowSelection={false}
            />
          </div>
        );
      default:
        return '';
    }
  };
  // 点击下拉框
  handleNotice = async (record, selectValue) => {
    if (record.selectedRowKeys.length) {
      let res;
      let data = [];
      record.dataSource.map(item => {
        if (record.selectedRowKeys.includes(item.REC_ID)) {
          if (selectValue === '提醒主管填写') {
            item.isMailed = 'Y';
          } else if (selectValue === '提醒员工填写') {
            item.isEmployeeFill = 'Y';
          } else if (selectValue === '提醒辅导员确认') {
            item.C3_62586860630 = 'Y';
          } else if (selectValue === '提醒员工填写辅导记录') {
            item.noticeEmpFillInstrRecord = 'Y';
          }
          data.push(item);
        }
      });
      this.setState({ spinning: true });
      try {
        res = await http().modifyRecords({
          resid: resid,
          data
        });
        if (res.Error === 0) {
          message.success(res.message);
        }
      } catch (error) {
        message.error(error.message);
        console.log(error);
      }
      this.tableDataRef.handleRefresh();
      this.setState({
        selectCourseArrangementVisible: false,
        spinning: false
      });
    } else {
      message.error('请选择至少一条记录');
    }
  };

  showConfirm = (record, selectValue) => {
    if (!record.selectedRowKeys.length) {
      return message.error('请选择至少一条记录');
    }
    confirm({
      title: '确认提醒?',
      content: '点击确认后将发送邮件至人员邮箱',
      onOk: () => {
        this.handleNotice(record, selectValue);
      },
      onCancel() {}
    });
  };
  // 点击退回申请
  handleApply = async record => {
    if (record.selectedRowKeys.length) {
      this.setState({
        selectCourseArrangementVisible: false,
        spinning: true
      });
      let res;
      let data = [];
      record.dataSource.map(item => {
        if (record.selectedRowKeys.includes(item.REC_ID)) {
          data.push({
            REC_ID: item.REC_ID,
            C3_622649568463: 'N',
            C3_622649502021: 'N',
            isNoticeHrEmail: null
          });
        }
      });
      try {
        res = await http().modifyRecords({
          resid,
          data
        });
        if (res.Error === 0) {
          message.success(res.message);
        }
      } catch (error) {
        message.error(error.message);
      }
      this.tableDataRef.handleRefresh();
      this.setState({ spinning: false });
    } else {
      message.error('请选择至少一条记录');
    }
  };

  // 同意转正
  hadleApproval = async record => {
    if (record.selectedRowKeys.length) {
      try {
        let res;
        let data = [];
        this.setState({ spinning: true });
        record.dataSource.forEach(item => {
          if (record.selectedRowKeys.includes(item.REC_ID)) {
            data.push({
              REC_ID: item.REC_ID,
              C3_622649568463: 'Y'
            });
          }
        });
        res = await http().modifyRecords({
          resid: resid,
          data
        });
        message.success(res.message);
        this.tableDataRef.handleRefresh();
      } catch (error) {
        message.error(error.message);
        console.log(error);
      } finally {
        this.setState({ spinning: false });
      }
    } else {
      message.error('请选择至少一条记录');
    }
  };

  handleSelectedStatus = v => this.setState({ selectedStatus: v });

  actionBarExtra = _status => record => {
    return (
      <div className="hr-probation_table-action-bar-extra">
        <div className="hr-probation_table-action-bar-extra_buttons">
          <Select
            style={{ width: 120 }}
            value={_status}
            onChange={this.handleSelectedStatus}
          >
            {status.map(item => {
              return (
                <Option key={item} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
          <Popconfirm
            title="确认退回申请？"
            onConfirm={() => {
              this.handleApply(record);
            }}
          >
            <Button type="danger">退回转正申请</Button>
          </Popconfirm>
          <Popconfirm
            title="确认同意转正？"
            onConfirm={() => {
              this.hadleApproval(record);
            }}
          >
            <Button type="primary">同意转正申请</Button>
          </Popconfirm>

          <Button
            onClick={RegularApply => {
              this.showConfirm(record, '员工填写');
            }}
            type="primary"
          >
            提醒员工填写
          </Button>
          <Button
            onClick={RegularApply => {
              this.showConfirm(record, '主管填写');
            }}
            type="primary"
          >
            提醒主管填写
          </Button>
          <Button
            onClick={RegularApply => {
              this.showConfirm(record, '提醒辅导员确认');
            }}
            type="primary"
          >
            提醒辅导员确认
          </Button>
          <Button
            onClick={RegularApply => {
              this.showConfirm(record, '提醒员工填写辅导记录');
            }}
            type="primary"
          >
            提醒员工填写辅导记录
          </Button>
        </div>
      </div>
    );
  };

  onCustomViewBtnClick = record => {
    return () => {
      this.setState({
        isShowTable: false,
        selectedRecord: record
      });
    };
  };

  goBack = () => this.setState({ isShowTable: true });

  setIsShowTable = isShowTable => {
    this.setState({ isShowTable });
  };
  render() {
    const { spinning, desktop, selectKey, collapsed, mode, theme } = this.state;
    return (
      <div
        className="hr-probation"
        style={{
          display: 'flex',
          height: desktop === 'DESKTOP' ? '100%' : 'calc(100vh - 160px)'
        }}
      >
        <div
          style={{
            // position: 'fixed',
            // left: 0,
            // bottom: 0,
            // top: 0,
            width: `${collapsed ? '80px' : '200px'}`,
            height: '100vh',
            maxHeight: '100vh'
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
              top:
                desktop === 'DESKTOP'
                  ? (selectKey - 1) * 48 + 4 + 'px'
                  : (selectKey - 1) * 48 + 164 + 'px',
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
            defaultSelectedKeys={['1']}
            mode={mode}
            theme={theme}
            onSelect={this.onSelect}
            inlineCollapsed={collapsed}
          >
            <Menu.Item key="1">
              <Icon type="mail" />
              <span> 试用期管理</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="calendar" />
              <span> 周期管理 </span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="calendar" />
              <span> 辅导员管理 </span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="calendar" />
              <span> 入职培训管理</span>
            </Menu.Item>
          </Menu>
        </div>
        <div
          style={{
            position: 'relative',
            width: `${collapsed ? 'calc(100% - 100px)' : 'calc(100% - 220px)'}`,
            left: '20px',
            overflow: 'auto'
          }}
        >
          <Spin spinning={spinning}>{this.renderContent()}</Spin>
        </div>
      </div>
    );
  }
}

export default HRProbation;
