import React, { Component } from 'react';
import SelectPersonnel from 'Common/data/SelectPersonnel';
const listConfig = [
  {
    title: '按所属部门添加',
    titleFieldName: 'C3_227212499515',
    resid: 449335746776,
    subResid: 609599795438
  },
  {
    title: '按所在地添加',
    titleFieldName: 'C3_417994395847',
    resid: 449335746776,
    subResid: 609599795438
  },
  {
    title: '按级别添加',
    titleFieldName: 'C3_449336358186',
    resid: 449335746776,
    subResid: 609599795438
  }
];
class SelectPersonFirst extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  // 人员表
  _personList = [];
  handleSelectPerson = personList => {
    this._personList = personList;
  };
// 点击完成
  handleComplete = () => {
    console.log({ personList: this._personList });
  };
  render() {
    return (
      <div className="fisrtStepSelected">
        <SelectPersonnel
          listConfig={listConfig}
          subResid={609599795438}
          searchConfig={{ title: '搜索' }}
          treeConfig={{ title: '按级别添加', resid: 449335746776 }}
          personFields={[
            '',
            'C3_227192472953',  //员工工号
            'C3_227192484125',  //员工姓名
            'C3_227212499515'   //所属部门
          ]}
          onSelectPerson={this.handleSelectPerson}
          stepList={[
            {
              stepTitle: '选择日期',
              renderContent: current => {
                return <div>这是第 {current + 1} 步</div>;
              },
              canToNext: () => true
            }
          ]}
          onComplete={this.handleComplete}
          completeText="发送"
          onSelectPerson={this.handleSelectPerson}
        />
      </div>
    );
  }
}

export default SelectPersonFirst;
