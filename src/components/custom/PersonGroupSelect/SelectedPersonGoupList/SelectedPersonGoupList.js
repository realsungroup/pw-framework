import React from 'react';
import './SelectedPersonGoupList.less';
import { Input, Table } from 'antd';
import PropTypes from 'prop-types';

const { Search } = Input;

class SelectedPersonGoupList extends React.Component {
  static propTypes = {
    /**
     * 人员分组被选中时的回调
     */
    onGroupSelect: PropTypes.func
  };

  state = {
    searchValue: ''
  };

  columns = [
    {
      title: '人员分组',
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
      <div className="selected-person-group-list">
        <div className="selected-person-group-list__header">
          已选择人员分组({selectedRowKeys.length}/{list.length})
        </div>
        <Search
          value={searchValue}
          placeholder="搜索人员分组名称"
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

export default SelectedPersonGoupList;
