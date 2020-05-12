import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import FormData from 'Common/data/FormData';

const record = {
  name0: 'hileix',
  name1: 'hileix',
  name2: 'hileix',
  name3: 'hileix',
  name4: 'hileix',
  name5: 'hileix',
  name6: 'hileix'
};

let data = [];
for (let i = 0; i < 6; i++) {
  data.push({
    id: `name${i}`, // 字段名称
    label: `label-name${i}`, // label
    value: 'hileix', // 初始值
    labelCol: 8, // label 所占列
    wrapperCol: 16, // 控件 所占列
    name: 'Input', // 控件名称
    props: {
      type: 'number'
    },
    rules: [{ required: true, message: '请输入姓名' }]
  });
}

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <FormData
          info={{ dataMode: 'main', resid: 617195083937 }}
          operation="view"
          data={data}
          record={record}
          formProps={{ width: 800 }}
        />
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
