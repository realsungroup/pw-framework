import React from 'react';
import { message, Checkbox, Table, Spin, Input, Select } from 'antd';
import './SelectPersons.less';
import { queryDoors, queryPersons, queryAllPersons } from '../../../../hikApi';

const { Search } = Input;
const { Option } = Select;

const optionTypeOptions = [
  {
    label: '姓名',
    value: 0
  },
  {
    label: '工号',
    value: 1
  }
];

class SelectPersons extends React.Component {
  state = {
    loading: false,
    isSubOrg: false,
    optionType: 0, // 下拉选项类型：0 表示姓名 | 1 表示工号
    searchValue: '',
    pagination: { current: 1, pageSize: 10, total: 0 },
    total: 0
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.selectedOrgIndexCode !== prevProps.selectedOrgIndexCode) {
      this.props.selectedOrgIndexCode && this.getPersons();
    }
  };

  getPersons = async () => {
    const { selectedOrgIndexCode } = this.props;
    if (!selectedOrgIndexCode) {
      return;
    }
    this.setState({ loading: true });
    const { isSubOrg, optionType, searchValue } = this.state;
    let res;
    const data = {
      orgIndexCodes: selectedOrgIndexCode,
      isSubOrg
    };
    if (optionType === 0 && searchValue) {
      data.personName = searchValue;
    }
    if (optionType === 1 && searchValue) {
      data.expressions = [
        {
          key: 'jobNo',
          operator: 6,
          values: [searchValue]
        }
      ];
    }

    try {
      res = await queryAllPersons(data);
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    this.setState({
      loading: false,
      total: res.data.total
    });

    const { onFetchNewPersons } = this.props;
    onFetchNewPersons && onFetchNewPersons(res.data.list);
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'personName',
      key: 'personName'
    },
    {
      title: '工号',
      dataIndex: 'jobNo',
      key: 'jobNo'
    },
    {
      title: '所属组织',
      dataIndex: 'orgPathName',
      key: 'orgPathName'
    }
  ];

  handleIsSubRegionChange = e => {
    this.setState({ isSubOrg: e.target.checked }, this.getPersons);
  };

  handleSearch = () => {
    this.props.selectedOrgIndexCode && this.getPersons();
  };

  render() {
    const { isSubOrg, loading, optionType, total, searchValue } = this.state;
    const {
      persons,
      selectedRowKeys,
      onPersonSelect,
      selectedPersons
    } = this.props;
    return (
      <div className="select-persons">
        <Spin spinning={loading}>
          <div className="select-persons__header">
            <div>
              待选择人员({selectedRowKeys.length}/{persons.length})
            </div>
            <div>
              <Checkbox
                checked={isSubOrg}
                onChange={this.handleIsSubRegionChange}
              >
                包含下级
              </Checkbox>
            </div>
          </div>
          <Search
            addonBefore={
              <Select
                style={{ width: 72 }}
                value={optionType}
                onChange={value =>
                  this.setState({ optionType: value, searchValue: '' })
                }
              >
                {optionTypeOptions.map(option => (
                  <Option value={option.value}>{option.label}</Option>
                ))}
              </Select>
            }
            value={searchValue}
            placeholder={optionType === 0 ? '搜索姓名' : '搜索工号'}
            onChange={e => this.setState({ searchValue: e.target.value })}
            onSearch={this.handleSearch}
          ></Search>
          <Table
            columns={this.columns}
            size="small"
            rowSelection={{
              columnWidth: 32,
              selectedRowKeys,
              onChange: onPersonSelect
            }}
            dataSource={persons}
            pagination={false}
            rowKey="personId"
            onChange={this.handleTableChange}
            scroll={{ y: 300 }}
          ></Table>
        </Spin>
      </div>
    );
  }
}

export default SelectPersons;
