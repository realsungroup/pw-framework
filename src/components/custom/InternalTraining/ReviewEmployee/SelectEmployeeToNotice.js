import React, { Component } from 'react';
import SelectPersonnel from 'Common/data/SelectPersonnel';
// import './SelectPersonFirst.less';
import http from 'Util20/api';
import SelectPersonSecond from '../../SelectPersonSecond';

import { message, Modal,} from 'antd';

class SelectEmployeeToNotice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      persons: [],
    };
  }
  handleSelectPerson = personList => {
    console.log({ personList });
    this.setState({ persons: personList });
  };


  componentDidMount() {
    this.setState({
    //   queryID: qsObj.id
    });
  }

  handleComplete = () => {
    this.props.onNotice(this.state.persons)
  }
  render() {
    return (
      <div style={{height:600}}>
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
            // {
            //   type: 'file',
            //   title: '请选择要上传的文件'
            // }
          ]}
          subResid={609599795438}
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
          personFields={[
            '',
            'C3_227192472953',
            'C3_227192484125',
            'C3_227212499515'
          ]}
          personPrimaryKeyField="C3_227192472953"
          secondFilterInputPlaceholder="输入关键词搜索"
          completeText="通知"
          onSelectPerson={this.handleSelectPerson}
          onComplete={this.handleComplete}
        />
      </div>
    );
  }
}

export default SelectEmployeeToNotice;
