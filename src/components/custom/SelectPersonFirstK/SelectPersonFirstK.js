import React, { Component } from 'react';
import SelectPersonnel from 'Common/data/SelectPersonnel';
import './SelectPersonFirstK.less';
import SelectPersonSecond from '../SelectPersonSecond';
import http from '../../../util20/api';
import qs from 'qs';
import { message, Modal, Spin, Tabs, Button, Popconfirm } from 'antd';
import { withRouter } from 'react-router-dom';
import TableData from '../../common/data/TableData';
const TabPane = Tabs.TabPane;
class SelectPersonFirstK extends Component {
  constructor(props) {
    super(props);
    console.log('pro', props);
    this.state = {
      loading: false,
      persons: [],
      queryID: ''
    };
  }

  // 人员表
  _personList = [];
  handleSelectPerson = personList => {
    console.log({ personList });
    this.setState({ persons: personList });
  };

  handleCancel = () => {
    this.props.callback(false);
  };

  // 点击完成 发送
  handleComplete = () => {
    const { record } = this.props;
    console.log({ personList: this.state.persons });
    let dataSub = [];
    this.setState({
      loading: true
    });
    // let objcommon = {
    //   query_id: queryID
    // };
    this.state.persons.map(person => {
      const obj = {
        C3_607197284004: record.C3_607171221170,
        C3_607197253817: person.C3_227192472953
      };
      dataSub.push(obj);
    });
    console.log('发送的人员列表', dataSub);
    http()
      .addRecords({
        resid: 610196239974,
        data: dataSub
      })
      .then(res => {
        if (!res.Error) {
          message.success(res.message);
        } else {
          message.error(res.message);
        }
        this.setState({
          loading: false
        });
        this.props.callback(false);
      })
      .catch(err => {
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
        //  console.log('考试安排编号',record.C3_607171221170);
        key.forEach(key => {
          if (key == 'C3_607197284004') {
            person[key] = record.C3_607171221170;
            // console.log(person[key]);
          }
          if(key=='C3_610362592227'){
            person[key]='Y';
          }
        });
      });
      // console.log('修改后的dataSource', newdataSource);
      http().addRecords({
        resid:610196239974,
        data:newdataSource
      }).then(res=>{
        console.log(res);
      }).catch(err=>{
        console.error(err);
      })
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
            </div>
          </TabPane>
          <TabPane tab="补考人员" key="2">
            <TableData
              resid={611837670774}
              hasRowSelection={true}
              hasAdd={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={false}
              hasRowView={false}
              hasRowDelete={false}
              // cmswhere={`C3_607197284004 =${record.C3_607171221170}`}
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
                    <Button>发送补考通知邮件</Button>
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
