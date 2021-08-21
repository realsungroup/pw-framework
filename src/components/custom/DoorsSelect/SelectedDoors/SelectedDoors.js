import React from 'react';
import { message, Checkbox, Table, Spin } from 'antd';
import './SelectedDoors.less';

class SelectedDoors extends React.Component {
  columns = [
    {
      title: '门禁点',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '所在区域',
      dataIndex: 'regionPathName',
      key: 'regionPathName'
    }
  ];

  render() {
    const { doors, selectedRowKeys, onDoorSelect } = this.props;
    return (
      <div className="select-doors">
        <div className="select-doors__header">
          <div>
            已选择门禁点({selectedRowKeys.length}/{doors.length})
          </div>
        </div>
        <Table
          columns={this.columns}
          size="small"
          rowSelection={{
            columnWidth: 32,
            selectedRowKeys,
            onChange: onDoorSelect
          }}
          dataSource={doors}
          pagination={false}
          rowKey="indexCode"
        ></Table>
      </div>
    );
  }
}

export default SelectedDoors;
