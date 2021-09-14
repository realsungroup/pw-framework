import React, { Component } from 'react';
import SelectPersonnel from 'Common/data/SelectPersonnel';
import './SelectPersonFirstK.less';
import SelectPersonSecond from '../SelectPersonSecond';
import http from '../../../util20/api';
import qs from 'qs';
import {
  message,
  Modal,
  Spin,
  Tabs,
  Button,
  Popconfirm,
  Progress,
  notification
} from 'antd';
import { withRouter } from 'react-router-dom';
import TableData from '../../common/data/TableData';
const TabPane = Tabs.TabPane;
class SelectPersonFirstK extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      persons: [],
      queryID: '',
      percent: 0
    };
  }
  componentWillUnmount = () => {
    this.timer = null;
    this.timer1 = null;
    this.getTaskInfo = null;
  };
  openNotification = () => {
    if (this.state.percent === 100) {
      notification.open({
        key: 'SelectPersonFirstK',
        message: '考试安排进度',
        duration: 3,
        description: (
          <Progress
            percent={100}
            type="circle"
            status={'success'}
            size="small"
            style={{ margin: '0 auto' }}
          />
        )
      });
    } else {
      notification.open({
        key: 'SelectPersonFirstK',
        message: '考试安排进度',
        duration: 0,
        description: (
          <Progress
            percent={this.state.percent}
            type="circle"
            status={this.state.percent === 100 ? 'success' : 'active'}
            size="small"
            style={{ margin: '0 auto' }}
          />
        )
      });
      this.timer1 = setTimeout(this.openNotification, 1000);
    }
  };

  // 人员表
  _personList = [];
  handleSelectPerson = personList => {
    console.log({ personList });
    this.setState({ persons: personList });
  };

  handleCancel = () => {
    this.props.callback(false);
  };

  getTaskInfo = async taskid => {
    let res;
    try {
      res = await http().RetrieveSaveTask({ taskid, includeData: true });
    } catch (err) {
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo(taskid);
        }
      }, 1000);
      console.log(err);
      return message.error(err.message);
    }
    if (res.IsCompleted) {
      message.success('安排成功');
      this.setState({
        loading: false
      });
      this.props.callback(false);
    } else {
      // 当前任务未完成
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo(taskid);
        }
      }, 1000);
    }
    let percent = Math.floor(
      (res.data.intCurrent / res.data.intTotalNumber) * 100
    );
    this.setState({
      percent
    });
  };
  // 点击完成 发送
  handleComplete = () => {
    const { record } = this.props;
    let dataSub = [];
    this.setState({
      loading: true
    });
    // let objcommon = {
    //   query_id: queryID
    // };
    let index_id = 0;
    this.state.persons.map(person => {
      const obj = {
        C3_607197284004: record.C3_607171221170,
        C3_607197253817: person.C3_227192472953,
        _id: ++index_id,
        _state: 'editoradd'
      };
      dataSub.push(obj);
    });
    http()
      .StartSaveTask({
        resid: 610196239974,
        data: JSON.stringify(dataSub)
      })
      .then(res => {
        if (!res.Error) {
          console.log('message', res);
        } else {
          message.error(res.message);
        }
        this.taskid = res.taskid;
        this.getTaskInfo(this.taskid);
        this.openNotification();
      })
      .catch(err => {
        this.props.callback(false);
        this.setState({
          loading: false
        });
        message.info('安排考试出错');
        console.error(err);
      });
  };
  //
  //补考
  handleSendEmail = async (dataSource, selectedRowKeys) => {
    const { record } = this.props;
    // console.log(dataSource);
    // console.log(selectedRowKeys);
    if (dataSource) {
      //向后台发送再次补考人的信息
      let newdataSource = [...dataSource];
      newdataSource.map(person => {
        const key = Object.keys(person);
        // console.log(key);
        console.log('考试安排编号', record.C3_607171221170);
        key.forEach(key => {
          if (key == 'C3_607197284004') {
            person[key] = record.C3_607171221170;
            console.log(person[key]);
          }
          if (key == 'C3_610362592227') {
            person[key] = 'Y';
          }
        });
      });
      console.log('修改后的dataSource', newdataSource);
      http()
        .addRecords({
          resid: 610196239974,
          data: newdataSource
        })
        .then(res => {
          console.log(res);
          Modal.success({
            title: '提示',
            content: '补考邮件发送成功'
          });
        })
        .catch(err => {
          console.error(err);
          Modal.warn({
            title: '提示',
            content: '补考邮件发送成功'
          });
        });
    }
  };
  //第二步中复选框的变化
  handleCheckboxChange = (value, number) => {
    console.log({ value, number });
  };
  componentDidMount() {}
  render() {
    const { loading } = this.state;
    const { record } = this.props;
    return (
      <Modal
        title="选择人员"
        width="100%"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        destroyOnClose
        footer={false}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="选择考试人员" key="1">
            {loading && (
              <div className="person-list__spin">
                <Spin />
              </div>
            )}
            <div className="fisrtStepSelected">
              <SelectPersonnel
                radioGroupConfig={[
                  {
                    type: 'list',
                    title: '按级别添加',
                    resid: 666268376334,
                    nameField: 'type'
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
            </div>
          </TabPane>
          <TabPane tab="补考人员" key="2">
            <TableData
              resid={611837670774}
              hasRowSelection={false}
              hasAdd={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={false}
              hasRowView={false}
              hasRowDelete={false}
              subtractH={230}
              height={330}
              cmswhere={`C3_607197284004 =${record.C3_612452687228}`}
              actionBarExtra={({
                dataSource: dataSource,
                selectedRowKeys: selectedRowKeys
              }) => {
                return (
                  <Popconfirm
                    title="确认发送邮件"
                    onConfirm={() => {
                      this.handleSendEmail(dataSource, selectedRowKeys);
                    }}
                  >
                    {/* <Button>发送补考通知邮件</Button> */}
                  </Popconfirm>
                );
              }}
            />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default SelectPersonFirstK;
