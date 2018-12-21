import React, { Component } from 'react';

import PwTable from './components/ui/PwTable';
import './App.css';
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
  render() {
    return (
      <div style={{ width: 800, height: 500, margin: 20 }}>
        <PwTable
          width={800}
          height={500}
          minConstraints={[430, 340]}
          title="PwTable"
          dataSource={dataSource}
          columns={columns}
          bordered
          size={'small'}
        />
      </div>
    );
  }
}

export default App;
