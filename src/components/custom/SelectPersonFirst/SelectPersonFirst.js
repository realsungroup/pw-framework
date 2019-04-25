import React, { Component } from 'react';
import SelectPersonnel from 'Common/data/SelectPersonnel';
const listConfig = [
  {
    title: '按班组添加',
    titleFieldName: 'DESCP',
    resid: 593017031990,
    subResid: 592742369617
  },
  {
    title: '按产线添加',
    titleFieldName: 'C3_593254711841',
    resid: 593255133996,
    subResid: 592742369617
  },
  {
    title: '成本中心1',
    titleFieldName: 'C3_596047861734',
    resid: 596047828849,
    subResid: 592742369617
  },
  {
    title: '成本中心2',
    titleFieldName: 'C3_596047873684',
    resid: 596047837491,
    subResid: 592742369617
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
          subResid={592742369617}
          searchConfig={{ title: '搜索' }}
          treeConfig={{ title: '按部门添加', resid: 592742244497 }}
          personFields={[
            '',
            'C3_227192472953',
            'C3_227192484125',
            'C3_227212499515'
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
