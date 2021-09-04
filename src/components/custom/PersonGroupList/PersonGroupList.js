import React from 'react';
import './PersonGroupList.less';
import { Input, Table, message } from 'antd';
import http from 'Util20/api';
import PropTypes from 'prop-types';
import classNames from 'classnames';
const { Search } = Input;
const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

class PersonGroupList extends React.Component {
  static propTypes = {
    /**
     * 人员分组列表
     */
    personGroupList: PropTypes.array.isRequired,

    /**
     * 人员分组被选中时的回调
     */
    onGroupSelect: PropTypes.func.isRequired,

    /**
     * 获取到了人员分组列表时的回调
     */
    onFetchPersonGroupList: PropTypes.func.isRequired,

    /**
     * 选中的人员分组 key
     */
    selectedRowKeys: PropTypes.array,

    /**
     * 选中的人员分组 id
     */
    selectedPersonGroupId: PropTypes.string,

    /**
     * 选中的人员分组 id 改变时的回调
     */
    onSelectedPersonGroupIdChange: PropTypes.func
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

  componentDidMount = () => {
    this.getGroupList();
  };

  getGroupList = async () => {
    let res;
    try {
      res = await http({ baseURL: realsunApiBaseURL }).getRecordAndSubTables({
        resid: 683209898302,
        subresid: 682507890263,
        getsubresource: 1
      });
    } catch (err) {
      return message.error(err.message);
    }
    const {
      onFetchPersonGroupList,
      onSelectedPersonGroupIdChange
    } = this.props;
    onFetchPersonGroupList && onFetchPersonGroupList(res.data);
    onSelectedPersonGroupIdChange &&
      onSelectedPersonGroupIdChange(`${res.data[0].groupId}`);
  };

  handleRowSelectionChange = selectedRowKeys => {
    const { onGroupSelect } = this.props;
    onGroupSelect && onGroupSelect(selectedRowKeys);
  };

  filterList = list => {
    const { searchValue } = this.state;
    return list.filter(item => item.name.includes(searchValue));
  };

  render() {
    const { searchValue } = this.state;
    const {
      personGroupList,
      selectedRowKeys,
      selectedPersonGroupId
    } = this.props;
    const dataSource = this.filterList(personGroupList);

    return (
      <div className="person-group-list">
        <div className="person-group-list__header">
          待选择人员分组({selectedRowKeys.length}/{personGroupList.length})
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
          rowClassName={(record, index) =>
            classNames({
              'person-group-list__selected':
                String(record.groupId) === String(selectedPersonGroupId)
            })
          }
          onRow={record => {
            return {
              onClick: event => {
                const { onSelectedPersonGroupIdChange } = this.props;
                if (onSelectedPersonGroupIdChange) {
                  if (String(record.groupId) !== selectedPersonGroupId) {
                    onSelectedPersonGroupIdChange(record.groupId);
                  }
                }
              }
            };
          }}
        ></Table>
      </div>
    );
  }
}

export default PersonGroupList;
