import React, { Component } from 'react';

import TableData from './components/data-components/TableData';
import FormData from './components/data-components/FormData';

import PwForm from './components/ui-components/PwForm';
import './App.css';

import { Button, message } from 'antd';
import http from './util/api';
import { setItem } from './util/util';
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

const formData = [
  {
    id: 'name',
    label: '姓名',
    value: '肖磊',
    rules: [{ required: true, message: '请输入姓名' }],
    name: 'Input',

    props: {
      // 控件所接收的 props
      type: 'text'
    }
  },
  {
    id: 'desc',
    label: '自我介绍',
    value: '',
    rules: [{ required: true, message: '请输入自我介绍' }],
    name: 'TextArea',

    props: {
      placeholder: '我的名字叫xx'
    }
  },
  {
    id: 'birthday',
    label: '出生年月',
    // value: '',
    rules: [{ required: true, message: '请选择出生年月日' }],
    name: 'DatePicker',

    props: {}
  },
  {
    id: 'sex',
    label: '性别',
    value: 1,
    rules: [{ required: true, message: '请选择出生年月日' }],
    name: 'RadioGroup',

    props: {
      options: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 0
        }
      ]
    }
  },
  {
    id: 'like',
    label: '爱好',
    value: 0,
    rules: [{ required: true, message: '请选择出生年月日' }],
    name: 'Select',

    props: {
      options: [
        {
          label: '敲代码',
          value: 0
        },
        {
          label: '写代码',
          value: 1
        },
        {
          label: '看代码',
          value: 2
        }
      ]
    }
  },
  {
    id: 'dictionary',
    label: '人员工号',
    value: '',
    rules: [{ required: true, message: '请选择人员工号' }],
    name: 'Search',

    props: {
      onSearch: () => {
        console.log('searched');
      },
      enterButton: true
    }
  },
  {
    id: 'codetime',
    label: '开始敲代码的时间',
    // value: () => {
    //   return moment().format('YYYY-MM-DD');
    // },
    rules: [{ required: true, message: '请选择你开始敲代码的时间' }],
    name: 'DateTimePicker',

    props: {}
  },
  {
    id: 'images',
    label: '图片',
    value: '',
    rules: [{ required: true, message: '请选择图片' }],
    name: 'Upload',

    props: {}
  }
];

// function getFormData(count) {
//   let data = [
//     {
//       id: `name${i}`,
//       label: '姓名',
//       initialValue: '肖磊',
//       rules: [{ required: true, message: '请输入姓名' }],
//       name: 'Input',
//       props: {
//         type: 'text'
//       }
//     },

//   ];
// for (let i = 0; i < count; i++) {
//   data.push({
//     id: `name${i}`,
//     label: '姓名',
//     initialValue: '肖磊',
//     rules: [{ required: true, message: '请输入姓名' }],
//     name: 'Input',
//     props: {
//       type: 'text'
//     }
//   });
// }
// return data;
// }

// const formData = getFormData(20);

const newFormData = [
  {
    type: '基本信息',
    data: [
      {
        id: 'name',
        label: '姓名',
        value: '肖磊',
        rules: [{ required: true, message: '请输入姓名' }],
        name: 'Input',

        props: {
          // 控件所接收的 props
          type: 'text'
        }
      },
      {
        id: 'name1',
        label: '姓名',
        value: '肖磊',
        rules: [{ required: true, message: '请输入姓名' }],
        name: 'Input',

        props: {
          // 控件所接收的 props
          type: 'text'
        }
      },
      {
        id: 'name2',
        label: '姓名',
        value: '肖磊',
        rules: [{ required: true, message: '请输入姓名' }],
        name: 'Input',

        props: {
          // 控件所接收的 props
          type: 'text'
        }
      }
    ]
  },
  {
    type: '基本信息2',
    data: [
      {
        id: 'name22',
        label: '姓名',
        value: '肖磊',
        rules: [{ required: true, message: '请输入姓名' }],
        name: 'Input',

        props: {
          // 控件所接收的 props
          type: 'text'
        }
      },
      {
        id: 'name23',
        label: '姓名',
        value: '肖磊',
        rules: [{ required: true, message: '请输入姓名' }],
        name: 'Input',

        props: {
          // 控件所接收的 props
          type: 'text'
        }
      },
      {
        id: 'name24',
        label: '姓名',
        value: '肖磊',
        rules: [{ required: true, message: '请输入姓名' }],
        name: 'Input',

        props: {
          // 控件所接收的 props
          type: 'text'
        }
      }
    ]
  }
];

class App extends Component {
  state = {
    formData: newFormData
  };

  handleLoginClick = async () => {
    const code = 'demo1';
    const password = '66287175';

    let res;
    try {
      res = await http().login({
        Code: code,
        Password: password
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    message.success('登录成功');
    setItem('userInfo', JSON.stringify(res));
  };

  handleClearCache = async () => {
    let res;
    try {
      await http().clearCache();
    } catch (err) {
      return message.error(err.message);
    }
    message.success('清除缓存成功');
  };

  handleSave = form => {
    // console.log({ form });
    // console.log(form.getFieldsValue());
    form.validateFields((err, values) => {
      console.log({ err, values });
    });
  };
  handleCancel = form => {
    form.setFieldsValue({ name0: '欧阳' });
  };

  handleAddControl = () => {
    const data = [
      ...this.state.formData,
      {
        id: 'name' + new Date().getTime(),
        label: '姓名',
        value: '',
        rules: [{ required: true, message: '请输入姓名' }],
        name: 'Input',
        props: {
          type: 'text'
        }
      }
    ];
    this.state.formData.push();
    this.setState({ formData: data });
  };

  handleDataChange = data => {
    this.setState({ formData: data });
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleLoginClick} type="primary">
          登录
        </Button>
        <Button onClick={this.handleClearCache} type="primary">
          清除缓存
        </Button>
        <Button onClick={this.handleAddControl} type="primary">
          添加控件
        </Button>
        <div>
          <TableData
            title="调休登记"
            resid={596720928643}
            defaultPagination={{
              current: 1,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true
            }}
            width={1360}
            size="small"
            hasBeBtns={false}
            subtractH={180}
            actionBarFixed={true}
            hasRowEdit
            hasAdd={false}
            hasDelete={false}
            hasModify={false}
            hasRowModify={true}
            height={600}
            formProps={{ displayMode: 'default', width: 600, height: 500 }}
            recordFormType="modal"
            // cmscolumns="C3_600449702200,C3_600449723545,C3_600449744490,C3_600449756846,C3_600449776309,C3_600449791836,C3_600449800714,C3_600449820713"
            rowEditFormName="default_rowTest"
          />
          {/* <PwForm
            labelCol={4}
            wrapperCol={12}
            colCount={1}
            mode="edit"
            displayMode="classify"
            data={this.state.formData}
            onSave={this.handleSave}
            onCancel={this.handleCancel}
          /> */}
          {/* <FormData /> */}
        </div>
      </div>
    );
  }
}

export default App;
