import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
// import TableData from 'Common/data/TableData';
import SelectPersonnel from 'Common/data/SelectPersonnel';
import { Spin } from 'antd';

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

const radioGroupConfig = [
  {
    type: 'tree',
    title: '按部门添加',
    resid: 592742244497,
    nameField: 'DEP_NAME',
    idField: 'DEP_ID',
    pidField: 'DEP_PID'
  },
  {
    type: 'list',
    title: '按班组添加',
    resid: 593017031990,
    nameField: 'DESCP'
  },
  {
    type: 'search', // 类型：'tree' 表示树；'list' 表示列表；'search' 表示模糊搜索；'file' 表示文件
    title: '搜索' // 单选按钮文字
  },
  {
    type: 'file', // 类型：'tree' 表示树；'list' 表示列表；'search' 表示模糊搜索；'file' 表示文件
    title: '选择文件' // 单选按钮文字
  }
];

class App extends Component {
  state = {
    loading: false
  };

  _personList = [];
  handleSelectPerson = personList => {
    this._personList = personList;
  };

  handleComplete = () => {
    console.log({ personList: this._personList });
  };

  render() {
    const { loading } = this.state;
    return (
      <TemplateWrap>
        <Spin spinning={loading}>
          <div style={{ width: 1000, height: 520 }}>
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
              radioGroupConfig={radioGroupConfig}
            />
          </div>
        </Spin>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
