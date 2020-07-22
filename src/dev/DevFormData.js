import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import FormData from 'Common/data/FormData';

const record = {
  name0: 'name0',
  name1: 'name0',
  name2: 'name0',
  name3: 'name0',
  name4: 'name0',
  name5: 'name0',
  name6: 'name0'
};

let data = [];
for (let i = 0; i < 20; i++) {
  data.push({
    id: `name${i}`, // 字段名称
    label: `label${i}`, // label
    initialValue: 'hileix', // 初始值
    labelCol: 8, // label 所占列
    wrapperCol: 16, // 控件 所占列
    name: 'Input', // 控件名称
    props: {
      type: 'number'
    },
    rules: [{ required: true, message: '请输入姓名' }]
  });
}

data.push({
  name: 'Upload',
  id: '图片',
  label: '图片',
  initialValue:
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589710805245&di=67fc43ac37aada6b1327e6e0d19fd738&imgtype=0&src=http%3A%2F%2Fa2.att.hudong.com%2F36%2F48%2F19300001357258133412489354717.jpg'
});

class App extends Component {
  state = {
    data: []
  };

  componentDidMount = () => {
    // setTimeout(() => {
    //   this.setState({ data });
    // }, 200);
  };

  render() {
    // const { data } = this.state;
    return (
      <TemplateWrap>
        <FormData
          info={{ dataMode: 'main', resid: 617195083937 }}
          operation="view"
          data={data}
          record={record}
          style={{ width: 800, background: '#fff' }}
          layout="float"
          subTalbeLayout="grid"
          formProps={{
            colCount: 3,
            fieldsOrder: [
              '图片',
              'name6',
              'name5',
              'name4',
              'name3',
              'name2',
              'name1'
            ]
          }}
          subTableArr={[
            {
              subResid: 617195083937
            },
            {
              subResid: 617195083937
            }
          ]}
          subTableArrProps={[
            {
              subTableName: '物品信息',
              subResid: 617195083937,
              tableProps: {
                title: '子表2',
                dataMode: 'sub',
                resid: 628007834561,
                subresid: 617195083937,
                hasAdd: false,
                hasModify: false,
                hasDelete: false,
                width: 600,
                defaultPagination: false,
                style: {
                  margin: '20px auto'
                }
              },
              hasRowModify: false,
              hasRowView: false,
              hasRowDelete: false
            },
            {
              subTableName: '物品信息',
              subResid: 617195073738,
              tableProps: {
                title: '子表2',
                dataMode: 'sub',
                resid: 628007834561,
                subresid: 617195073738,
                hasAdd: false,
                hasModify: false,
                hasDelete: false,
                width: 600,
                defaultPagination: false,
                style: {
                  margin: '20px auto'
                }
              },
              hasRowModify: false,
              hasRowView: false,
              hasRowDelete: false
            }
          ]}
        />
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
