import React, { Component } from 'react';

import TableData from './components/data-components/TableData';
import './App.css';

import { Button, message } from 'antd';
import http from './util/api';
import { setItem } from './util/util';
import 'lz-request/lib/login';

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
        <Button onClick={this.handleLoginClick}>登录</Button>
        <div style={{ width: 800, height: 500 }}>
          <TableData
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
            fixedColumns={['人员工号', '员工姓名']}
          />
        </div>
      </div>
    );
  }
}

export default App;
