import React from 'react';
import { Modal, Table, Input } from 'antd';

const { Search } = Input;

class DoorGroupList extends React.Component {
  state = {
    value: ''
  };
  columns = [
    {
      title: '门禁点',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '所在区域',
      dataIndex: 'region',
      key: 'region'
    },
    {
      title: '所属控制器',
      dataIndex: 'control',
      key: 'control'
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe'
    }
  ];

  render() {
    const { dataSource, ...otherProps } = this.props;
    const { value } = this.state;

    let newDataSource;
    if (value) {
      newDataSource = dataSource.filter(record => record.name.includes(value));
    } else {
      newDataSource = dataSource;
    }

    return (
      <Modal {...otherProps} footer={null}>
        <div style={{ marginBottom: 8 }}>
          <Search
            placeholder="搜索门禁点名称"
            onChange={e => this.setState({ value: e.target.value })}
          ></Search>
        </div>
        <Table
          columns={this.columns}
          dataSource={newDataSource}
          pagination={{
            pageSize: 10
          }}
        ></Table>
      </Modal>
    );
  }
}

export default DoorGroupList;
