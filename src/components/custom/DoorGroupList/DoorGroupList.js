import React from 'react';
import './DoorGroupList.less';
import { Input, Table, message } from 'antd';
import http from 'Util20/api';
import PropTypes from 'prop-types';

const { Search } = Input;
const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

class DoorGroupList extends React.Component {
  static propTypes = {
    /**
     * 门禁分组被选中时的回调
     */
    onGroupSelect: PropTypes.func
  };

  state = {
    searchValue: '',
    list: [],
    selectedRowKeys: []
  };

  columns = [
    {
      title: '门禁分组',
      dataIndex: 'name',
      key: 'name'
    }
  ];

  componentDidMount = () => {
    this.getGroupList();
  };

  getGroupList = async () => {
    let res;
    try {
      res = await http({ baseURL: realsunApiBaseURL }).getRecordAndSubTables({
        resid: 682507600534,
        subresid: 682507735244,
        getsubresource: 1
      });
    } catch (err) {
      return message.error(err.message);
    }
    this.setState({ list: res.data });
  };

  handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
    const { onGroupSelect } = this.props;
    this.setState({ selectedRowKeys });
    onGroupSelect && onGroupSelect(selectedRows);
  };

  filterList = list => {
    const { searchValue } = this.state;
    return list.filter(item => item.name.includes(searchValue));
  };

  render() {
    const { searchValue, list, selectedRowKeys } = this.state;
    const dataSource = this.filterList(list);

    return (
      <div className="door-group-list">
        <div className="door-group-list__header">
          待选择门禁分组({selectedRowKeys.length}/{list.length})
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
        ></Table>
      </div>
    );
  }
}

export default DoorGroupList;
