import React from 'react';
import './HRProbation.less';
import TableData from '../../../common/data/TableData';
import { Button, message, Select, Menu, Icon, Modal } from 'antd';
import ProbationForms from '../ProbationForms';
import http from 'Util20/api';

const { Option } = Select;
const { confirm } = Modal;

class HRProbation extends React.Component {
  state = {
    isShowTable: true, //控制页面显示内容
    selectedRecord: {},
    desktop: null,
    mode: 'inline',
    theme: 'light',
    selectKey: '1'
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
    switch (selectKey) {
      case '1':
        return (
          <div id="hr-probation">
            {this.state.isShowTable ? (
              <div style={{ height: '100vh' }}>
                <TableData
                  key="1"
                  resid="619609481002"
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
                  customRowBtns={[
                    record => (
                      <Button
                        type="primary"
                        onClick={this.onCustomViewBtnClick(record)}
                      >
                        查看
                      </Button>
                    )
                  ]}
                  actionBarExtra={this.actionBarExtra}
                />
              </div>
            ) : (
              <ProbationForms
                memberId={this.state.selectedRecord.memberId}
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
              resid="618591427140"
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
  handleSel = async (record, selectValue) => {
    if (record.selectedRowKeys.length) {
      let res;
      let data = [];
      record.dataSource.map(item => {
        if (record.selectedRowKeys.includes(item.REC_ID)) {
          if (selectValue === '主管填写') {
            item.isDirectorFill = 'Y';
          } else if (selectValue === '员工填写') {
            item.isEmployeeFill = 'Y';
          } else if (selectValue === '辅导员填写') {
            item.isCounselorFill = 'Y';
          } else if (selectValue === '员工确认辅导') {
            item.isStaffConfirm = 'Y';
          }
          data.push(item);
        }
      });
      try {
        res = await http().modifyRecords({
          resid: 619609481002,
          data
        });
        if (res.Error === 0) {
          message.success(res.message);
        }
      } catch (error) {
        message.error(error.message);
      }
      this.setState({
        selectCourseArrangementVisible: false
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
        this.handleSel(record, selectValue);
      },
      onCancel() {}
    });
  };
  // 点击转正申请
  handleApply = async record => {
    console.log('record转正111', record);
    if (record.selectedRowKeys.length) {
      this.setState({
        selectCourseArrangementVisible: false
      });
      let res;
      let data = [];
      record.dataSource.map(item => {
        if (record.selectedRowKeys.includes(item.REC_ID)) {
          console.log('come in ');
          item.isRegularNotice = 'Y';
          data.push(item);
        }
      });
      try {
        res = await http().modifyRecords({
          resid: 619609481002,
          data
        });
        if (res.Error === 0) {
          message.success(res.message);
        }
      } catch (error) {
        message.error(error.message);
      }
    } else {
      message.error('请选择至少一条记录');
    }
  };

  actionBarExtra = record => {
    return (
      <div className="hr-probation_table-action-bar-extra">
        <div className="hr-probation_table-action-bar-extra_buttons">
          <Select
            style={{ width: 120 }}
            placeholder="提醒"
            onSelect={selectValue => {
              // this.handleSel(record, selectValue);
              this.showConfirm(record, selectValue);
            }}
          >
            <Option value="员工填写">员工填写</Option>
            <Option value="主管填写">主管填写</Option>
            <Option value="辅导员填写">辅导员填写</Option>
            <Option value="员工确认辅导">员工确认辅导</Option>
          </Select>
          <Button
            onClick={RegularApply => {
              this.handleApply(record);
            }}
          >
            转正申请
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
            defaultSelectedKeys={['1']}
            mode={this.state.mode}
            theme={this.state.theme}
            onSelect={this.onSelect}
            inlineCollapsed={this.state.collapsed}
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
  // render() {
  //   return (
  // <div id="hr-probation">
  //   {this.state.isShowTable ? (
  //     <div style={{ height: '100vh' }}>
  //       <TableData
  //         resid="619609481002"
  //         subtractH={240}
  //         hasAdd={false}
  //         hasRowView={false}
  //         hasRowDelete={false}
  //         hasRowEdit={false}
  //         hasDelete={false}
  //         hasModify={false}
  //         hasRowModify={false}
  //         hasRowSelection={true}
  //         customRowBtns={[
  //           record => (
  //             <Button
  //               type="primary"
  //               onClick={this.onCustomViewBtnClick(record)}
  //             >
  //               查看
  //             </Button>
  //           )
  //         ]}
  //         actionBarExtra={this.actionBarExtra}
  //       />
  //     </div>
  //   ) : (
  //     <ProbationForms
  //       memberId={this.state.selectedRecord.memberId}
  //       goBack={this.goBack}
  //       roleName="HR"
  //       setIsShowTable={this.setIsShowTable}
  //     />
  //   )}
  // </div>
  //   );
  // }
}

export default HRProbation;
