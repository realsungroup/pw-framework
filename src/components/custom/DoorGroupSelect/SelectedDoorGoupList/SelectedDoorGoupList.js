import React from 'react';
import './SelectedDoorGoupList.less';
import { Input, Table } from 'antd';
import PropTypes from 'prop-types';

const { Search } = Input;

class SelectedDoorGoupList extends React.Component {
  static propTypes = {
    /**
     * 门禁分组被选中时的回调
     */
    onGroupSelect: PropTypes.func
  };

  state = {
    searchValue: ''
  };

  columns = [
    {
      title: '门禁分组',
      dataIndex: 'name',
      key: 'name'
    }
  ];

  handleRowSelectionChange = selectedRowKeys => {
    const { onGroupSelect } = this.props;
    onGroupSelect && onGroupSelect(selectedRowKeys);
  };

  render() {
    const { selectedRowKeys, list } = this.props;
    const { searchValue } = this.state;
    const dataSource = list.filter(item => item.name.includes(searchValue));

    return (
      <div className="selected-door-group-list">
        <div className="selected-door-group-list__header">
          已选择门禁分组({selectedRowKeys.length}/{list.length})
        </div>
        <Search
          value={searchValue}
          placeholder="搜索门禁分组名称"
          onChange={e => this.setState({ searchValue: e.target.value })}
          style={{ marginBottom: 8 }}
        ></Search>

        <Table
          size="small"
          columns={this.columns}
          dataSource={dataSource}
          pagination={false}
          rowSelection={{
            columnWidth: 32,
            selectedRowKeys,
            onChange: this.handleRowSelectionChange
          }}
          rowKey="groupId"
        ></Table>
      </div>
    );
  }
}

export default SelectedDoorGoupList;
