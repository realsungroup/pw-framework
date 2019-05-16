import React, { Component } from 'react';
import SelectPersonnel from 'Common/data/SelectPersonnel';
import './SelectPersonFirst.less';
import SelectPersonSecond from '../SelectPersonSecond';
import http from '../../../util20/api';
import qs from 'qs';
import { message } from 'antd';
import { withRouter } from 'react-router-dom';
class SelectPersonFirst extends Component {
  constructor(props) {
    super(props);
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

  // 点击完成 发送
  handleComplete = () => {
    console.log({ personList: this.state.persons });
    const { queryID } = this.state;
    let dataSub = [];
    console.log('点击提交', queryID);
    let objcommon = {
      query_id: queryID
    };
    this.state.persons.map(person => {
      const obj = { ...objcommon, staff_number: person.C3_227192472953 };
      dataSub.push(obj);
    });
    console.log('发送的人员列表', dataSub);
    http()
      .addRecords({
        resid: 609613163948,
        data: dataSub
      })
      .then(res => {
        message.info('发送成功啦，可以到查看人员去看发送了哪些人');
        console.log(res);
        window.location.href = `/fnmodule?resid=607189885707&recid=608296075283&type=%E5%89%8D%E7%AB%AF%E5%8A%9F%E8%83%BD%E5%85%A5%E5%8F%A3&title=%E9%97%AE%E5%8D%B7%E9%A6%96%E9%A1%B5`;
      })
      .catch(err => {
        console.error(err);
      });
    http()
      .modifyRecords({
        resid: 608822905547,
        data: [
          {
            REC_ID: queryID,
            query_status: '已发送'
          }
        ]
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
  };
  //第二步中复选框的变化
  handleCheckboxChange = (value, number) => {
    console.log({ value, number });
  };
  componentDidMount() {
    const quertString = window.location.search;
    const qsObj = qs.parse(quertString.substring(1));
    console.log('传过来的', qsObj);
    console.log('问卷ID', qsObj.id);
    this.setState({
      queryID: qsObj.id
    });
  }
  render() {
    return (
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
          personFields={[
            '',
            'C3_227192472953',
            'C3_227192484125',
            'C3_227212499515'
          ]}
          personPrimaryKeyField="C3_227192472953"
          secondFilterInputPlaceholder="输入关键词搜索"
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
          completeText="发送"
          onSelectPerson={this.handleSelectPerson}
          onComplete={this.handleComplete}
        />
      </div>
    );
  }
}

export default SelectPersonFirst;
