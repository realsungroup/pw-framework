import React from 'react';
import './SelectedOrgList.less';
import { Input, Table } from 'antd';
import PropTypes from 'prop-types';

const { Search } = Input;

class SelectedOrgList extends React.Component {
  static propTypes = {
    /**
     * 组织被选中时的回调
     */
    onOrgSelect: PropTypes.func
  };

  state = {
    searchValue: ''
  };

  columns = [
    {
      title: '组织名称',
      dataIndex: 'orgName',
      key: 'orgName'
    }
  ];

  handleRowSelectionChange = selectedRowKeys => {
    const { onOrgSelect } = this.props;
    onOrgSelect && onOrgSelect(selectedRowKeys);
  };

  render() {
    const { selectedRowKeys, list } = this.props;
    const { searchValue } = this.state;
    const dataSource = list
      .filter(item => item.orgName.includes(searchValue))
      .map(item => ({ ...item, children: undefined }));

    return (
      <div className="selected-org-list">
        <div className="selected-person-group-list__header">已选择组织</div>
        <Search
          value={searchValue}
          placeholder="搜索组织名字"
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
          rowKey="orgIndexCode"
        ></Table>
      </div>
    );
  }
}

export default SelectedOrgList;
