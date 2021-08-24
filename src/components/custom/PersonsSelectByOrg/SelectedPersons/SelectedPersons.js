import React from 'react';
import { Table, Input, Select } from 'antd';
import './SelectedPersons.less';

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

class SelectedPersons extends React.Component {
  state = {
    optionType: 0, // 下拉选项类型：0 表示姓名 | 1 表示工号
    searchValue: ''
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

  filterPersons = persons => {
    const { optionType, searchValue } = this.state;
    let key;
    if (optionType === 0) {
      key = 'personName';
    } else {
      key = 'jobNo';
    }
    return persons.filter(person => person[key].includes(searchValue));
  };

  render() {
    const { persons, selectedRowKeys, onPersonSelect } = this.props;
    const { optionType, searchValue } = this.state;
    const filteredPersons = this.filterPersons(persons);

    return (
      <div className="select-persons">
        <div className="select-persons__header">
          <div>
            已选择人员({selectedRowKeys.length}/{persons.length})
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
        ></Search>
        <Table
          columns={this.columns}
          size="small"
          rowSelection={{
            columnWidth: 32,
            selectedRowKeys,
            onChange: onPersonSelect
          }}
          dataSource={filteredPersons}
          pagination={{ pageSize: 10 }}
          rowKey="personId"
        ></Table>
      </div>
    );
  }
}

export default SelectedPersons;
