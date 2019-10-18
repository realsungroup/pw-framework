import React from 'react';
import { message, Button, Modal, Spin } from 'antd';
import './PersonList.less';
import http from 'Util20/api';
import TableData from '../../../../common/data/TableData';
import SelectPersonnel from '../../../../common/data/SelectPersonnel';
import SelectPersonSecond from '../../../SelectPersonSecond';
import PlanProgress from '../../../CreatePlan/PlanProgress';

/**
 * 管理员确认
 */

const personID = '618488751596'; //下属发展人员表ID
class PersonList extends React.Component {
  state = {
    mode: 'inline',
    theme: 'light',
    selectKey: '1',
    collapsed: false,
    visible: false, //选择人员模态框是否开启
    currentPlan: {},
    historyPlan: [],
    persons: [],
    loading: false,
    isShowProgress: false,
    taskList: []
  };
  constructor(props) {
    super(props);
  }
  onNoticeEmployee = async (dataSource, selectKey) => {
    if (!selectKey.length > 0) {
      return message.error('请选择一条记录');
    }
    let res;
    let data = [];
    dataSource.map(item => {
      if (selectKey.includes(item.REC_ID)) {
        console.log('come in ');
        item.isMessage = 'Y';
        data.push(item);
      }
    });
    try {
      res = await http().modifyRecords({
        resid: personID,
        data
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // 选择人员调用的回调函数
  handleSelectPerson = personList => {
    console.log({ personList });
    this.setState({ persons: personList });
  };

  // 点击完成调用的回调函数
  handleComplete = () => {
    let taskList = [];
    const { persons } = this.state;
    const { record } = this.props;
    let index_id = 0;
    persons.forEach(item => {
      let plans = {
        memberId: item.C3_305737857578, //员工编号
        year: record.year, //员工姓名
        projectId: record.projectId,
        _id: ++index_id,
        _state: 'editoradd'
      };
      taskList.push(plans);
    });

    this.setState({ isShowProgress: true, taskList});
  };
  //结束时调用的回调函数
  onFinishedPlanProgress = () => {
    this.setState({
      isShowProgress: false,
      visible: false 
    });
    this.tableDataRef.handleRefresh();
  };

  onEmployeeWrite = async (dataSource, selectKey) => {
    if (!selectKey.length > 0) {
      return message.error('请选择一条记录');
    }
    let res;
    let data = [];
    dataSource.map(item => {
      if (selectKey.includes(item.REC_ID)) {
        console.log('come in ');
        item.sEmployeeWrite = 'Y';
        data.push(item);
      }
    });
    try {
      res = await http().modifyRecords({
        resid: personID,
        data
      });
      console.log('res.Error', res, res.Error);
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  onAddEmployee = () => {
    this.setState({
      visible: true
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  handleOk = () => {
    this.setState({
      visible: false
    });
  };
  onMangerWrite = async (dataSource, selectKey) => {
    if (!selectKey.length > 0) {
      return message.error('请选择一条记录');
    }
    let res;
    let data = [];
    dataSource.map(item => {
      if (selectKey.includes(item.REC_ID)) {
        console.log('come in ');
        item.sMangerWrite = 'Y';
        data.push(item);
      }
    });
    try {
      res = await http().modifyRecords({
        resid: personID,
        data
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  onCloseWrite = async (dataSource, selectKey) => {
    if (!selectKey.length > 0) {
      return message.error('请选择一条记录');
    }
    let res;
    let data = [];
    dataSource.map(item => {
      if (selectKey.includes(item.REC_ID)) {
        item.sEmployeeWrite = '';
        data.push(item);
      }
    });
    try {
      res = await http().modifyRecords({
        resid: personID,
        data
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  componentDidMount = async () => {
    console.log('props', this.props.record);
  };
  render() {
    const { visible, loading, isShowProgress, taskList } = this.state;
    return (
      <div className="personlist-contain" style={{ height: '100%' }}>
        <TableData
          resid={personID}
          subtractH={220}
          hasBeBtns={false}
          hasRowSelection={true}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          hasAdd={false}
          hasRowView={false}
          hasModify={false}
          hasRowDelete={true}
          hasDelete={false}
          hasRowModify={false}
          actionBarFixed={true}
          hasAdvSearch={true}
          height="100%"
          cmswhere={
            this.props.role === 'HR'
              ? `projectId = '${this.props.record &&
                  this.props.record.projectId}'`
              : `projectId = '${this.props.record &&
                  this.props.record.projectId}' and directorId = '${this.props
                  .record && this.props.record.memberId}' `
          }
          customRowBtns={[
            (record, btnSize) => {
              return (
                <Button
                  onClick={() => {
                    this.props.onLookPerson(record);
                  }}
                  style={{marginTop:'8px',fontSize:'14px',height:'24px',padding:'0 7px'}}
                >
                  修改
                </Button>
              );
            }
          ]}
          actionBarExtra={({ dataSource, selectedRowKeys, data }) => {
            return (
              <React.Fragment>
                <Button
                  onClick={() => {
                    this.onAddEmployee();
                  }}
                >
                  添加员工
                </Button>
                <Button
                  onClick={() => {
                    this.onEmployeeWrite(dataSource, selectedRowKeys);
                  }}
                >
                  提醒员工
                </Button>
                <Button
                  onClick={() => {
                    this.onEmployeeWrite(dataSource, selectedRowKeys);
                  }}
                >
                  开启员工填写
                </Button>
                {/* {this.props.role === 'HR' ? (
                  <Button
                    onClick={() => {
                      this.onMangerWrite(dataSource, selectedRowKeys);
                    }}
                  >
                    开启主管填写
                  </Button>
                ) : null} */}
                <Button
                  onClick={() => {
                    this.onCloseWrite(dataSource, selectedRowKeys);
                  }}
                >
                  关闭员工填写
                </Button>
              </React.Fragment>
            );
          }}
        />
        <Modal
          title="选择人员"
          width="90%"
          height="90%"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={false}
        >
          <div className="fisrtStepSelected">
            {loading && (
              <div className="person-list__spin">
                <Spin />
              </div>
            )}
            <SelectPersonnel
              radioGroupConfig={[
                {
                  type: 'list',
                  title: '按级别添加',
                  resid: 449335746776,
                  nameField: 'C3_587136281870'
                },
                {
                  type: 'tree',
                  title: '按部门添加',
                  resid: 466282405067,
                  nameField: 'DEP_NAME',
                  idField: 'DEP_ID',
                  pidField: 'DEP_PID'
                },
                {
                  type: 'search',
                  title: '输入关键词搜索'
                },
                {
                  type: 'file',
                  title: '请选择要上传的文件'
                }
              ]}
              subResid={609599795438}
              secondFilterInputPlaceholder="输入关键词搜索"
              personFields={[
                '',
                'C3_227192472953',
                'C3_227192484125',
                'C3_227212499515'
              ]}
              personPrimaryKeyField="C3_227192472953"
              stepList={[
                {
                  stepTitle: '验证',
                  renderContent: current => {
                    return (
                      <SelectPersonSecond
                        persons={this.state.persons}
                        onCheckboxChange={this.handleCheckboxChange}
                      />
                    );
                  }
                }
              ]}
              completeText="完成"
              onSelectPerson={this.handleSelectPerson}
              onComplete={this.handleComplete}
            />

            {isShowProgress ? (
              <PlanProgress
                onFinished={this.onFinishedPlanProgress}
                struct="100"
                options={{
                  resid: 618488751596,
                  data: JSON.stringify(taskList)
                }}
                title="添加人员列表"
                // showFields={['C3_609622263470', 'C3_609845305680']}
                // width='50%'
              />
            ) : null}
          </div>
        </Modal>
      </div>
    );
  }
}

export default PersonList;
