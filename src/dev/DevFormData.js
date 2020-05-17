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
for (let i = 0; i < 6; i++) {
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
    'https://www.baidu.com/link?url=tjAuszWiwt5BUUVMws-xiK44OxgTYjf3LssNiXGllewSIkQzErzEP0IPUz1bsHHg75nRxvWpx9jUpBaDihDqOoB6LD3P7-h5JM07HPEqe5oIKRzTpaaAuhAzgs7AMrpUUGtM3xmfPGuJswrZvEtvfsZQ3hA5leiLi6RcV5hcTSGRFOxM10By-8mDc1EUz98btMCUWe2vvpmgWkBXHKMhkeMeJwvElGJeBEpOshS-5hXZj9XcbMVzCvPbyF6eUnggpoZceVfefkhgV-uJpN684FmIpsXcyJRRim1F8-2Jj83RTA1DIYq7dE_WD8w1AsTlK6kbPsKLWmULLdoocvAVVE-zkyDMfeeZhGjZmXyka6wxGVxDurtjBZRrDeKGuryiSmmfLe9nnsKc1TUl2Kexw3ney-f1dFLIA25HljQg4reu_yY5jhjh9dU1yJfcq3q33s_ByMvTE1xhuQ34K46QppJHkjfwfIK4a__H4zzPLyZtjbNF4o5nXeP4Y-IdYc8hUjJx-pXbyrfHjdIgyXDU9to8nYtxBfJnuURFNyzI5sHUooFVqqcXkQVPrCs83iQdWkMhr5MtEdtsqtmoKMklLtWAuTbMJeRX9Ysy79IaU7O&timg=https%3A%2F%2Fss0.bdstatic.com%2F94oJfD_bAAcT8t7mm9GUKT-xh_%2Ftimg%3Fimage%26quality%3D100%26size%3Db4000_4000%26sec%3D1589276622%26di%3D866c91c55f879489e065cfa69afd2bce%26src%3Dhttp%3A%2F%2Fa2.att.hudong.com%2F36%2F48%2F19300001357258133412489354717.jpg&click_t=1589276625047&s_info=1387_766&wd=&eqid=8774040500024cef000000055eba6fce'
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
          formProps={{
            width: 800,
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
          subTalbeLayout="grid"
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
