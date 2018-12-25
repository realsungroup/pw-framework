import React, { Component } from 'react';

import TableData from './components/data-components/TableData';
import PwForm from './components/ui-components/PwForm';
import './App.css';

import { Button, message } from 'antd';
import http from './util/api';
import { setItem } from './util/util';
import 'lz-request/lib/login';
import moment from 'moment';

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  }
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
  }
];

// [
//   {
//     id: 'name',
//     label: '姓名',
//     initialValue: '肖磊',
//     rules: [{ required: true, message: '请输入姓名' }],
//     control: {
//       name: 'Input',
//       props: {
//         type: 'text'
//       }
//     }
//   },
//   {
//     id: 'desc',
//     label: '自我介绍',
//     initialValue: '',
//     rules: [{ required: true, message: '请输入自我介绍' }],
//     control: {
//       name: 'TextArea',
//       props: {
//         placeholder: '我的名字叫xx'
//       }
//     }
//   },
//   {
//     id: 'birthday',
//     label: '出生年月',
//     // initialValue: '',
//     rules: [{ required: true, message: '请选择出生年月日' }],
//     control: {
//       name: 'DatePicker',
//       props: {}
//     }
//   },
//   {
//     id: 'sex',
//     label: '性别',
//     initialValue: 1,
//     rules: [{ required: true, message: '请选择出生年月日' }],
//     control: {
//       name: 'RadioGroup',
//       props: {
//         options: [
//           {
//             label: '男',
//             value: 1
//           },
//           {
//             label: '女',
//             value: 0
//           }
//         ]
//       }
//     }
//   },
//   {
//     id: 'like',
//     label: '爱好',
//     initialValue: '敲代码',
//     rules: [{ required: true, message: '请选择出生年月日' }],
//     control: {
//       name: 'Select',
//       props: {
//         options: [
//           {
//             label: '敲代码',
//             value: 0
//           },
//           {
//             label: '写代码',
//             value: 1
//           },
//           {
//             label: '看代码',
//             value: 2
//           }
//         ]
//       }
//     }
//   },
//   {
//     id: 'dictionary',
//     label: '人员工号',
//     initialValue: '',
//     rules: [{ required: true, message: '请选择人员工号' }],
//     control: {
//       name: 'Search',
//       props: {
//         onSearch: () => {
//           console.log('searched');
//         },
//         enterButton: true
//       }
//     }
//   },
//   {
//     id: 'codetime',
//     label: '开始敲代码的时间',
//     initialValue: moment(),
//     rules: [
//       { required: true, message: '请选择你开始敲代码的时间' }
//     ],
//     control: {
//       name: 'DateTimePicker',
//       props: {}
//     }
//   },
//   {
//     id: 'images',
//     label: '图片',
//     initialValue: '',
//     rules: [{ required: true, message: '请选择图片' }],
//     control: {
//       name: 'Upload',
//       props: {}
//     }
//   }
// ]

function getFormData(count) {
  let data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      id: `name${i}`,
      label: '姓名',
      initialValue: '肖磊',
      rules: [{ required: true, message: '请输入姓名' }],
      control: {
        name: 'Input',
        props: {
          type: 'text'
        }
      }
    });
  }
  return data;
}

const formData = getFormData(10);

class App extends Component {
  handleLoginClick = async () => {
    const code = 'demo1';
    const password = '66287175';
    console.log(http());

    let res;
    try {
      res = await http().login({
        Code: code,
        Password: password
      });
    } catch (err) {
      console.log(err);

      return message.error(err.message);
    }
    message.success('登录成功');
    setItem('userInfo', JSON.stringify(res));
  };

  render() {
    return (
      <div style={{ margin: 20 }}>
        <Button onClick={this.handleLoginClick} type="primary">
          登录
        </Button>
        <div>
          {/* <TableData
            title="调休登记"
            resid={596720928643}
            defaultPagination={{
              current: 1,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true
            }}
            size="middle"
            columnsWidth={{
              人员工号: 100
            }}
            hasBeBtns
            opIsFiexed={false}
            fixedColumns={['人员工号', '员工姓名']}
            hasAdd={false}
            hasDelete={false}
          /> */}
          <PwForm
            labelCol={4}
            wrapperCol={12}
            colCount={2}
            mode="edit"
            data={formData}
          />
        </div>
      </div>
    );
  }
}

export default App;
