import React, { Component } from 'react';
import SelectPersonnel from 'Common/data/SelectPersonnel';
import './SelectPersonFirstP.less';
import SelectPersonSecond from '../SelectPersonSecond';
import http from '../../../util20/api';
import qs from 'qs';
import { message, Modal, } from 'antd';
import { withRouter } from 'react-router-dom';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

class SelectPersonFirstP extends Component {
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
    this.setState({ persons: personList });
  };
  modalClose = () => {
    console.log(66)
    this.props.handleCancel(true)
  }

  // 点击完成 发送
  handleComplete = () => {
    const terminalPerpleList = this.state.persons.map(e => {
      return {
        C3_613656069698: e.C3_227192472953,
        C3_613656048223: 'Y'
      }
    })
    console.log(terminalPerpleList)
    Modal.confirm({
      title: '提示！',
      content: '点击确定就发邮件了，确认发送吗？',
      onOk: () => {
        http().addRecords({
          resid: 613655930846,
          data: terminalPerpleList
        }).then(res => {
          console.log(res)
          if (res.Error === 0) {
            message.success('发送成功！');
            this.modalClose()
          } else {
            message.error(res.message);
          }
        })

      },
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

export default SelectPersonFirstP;
