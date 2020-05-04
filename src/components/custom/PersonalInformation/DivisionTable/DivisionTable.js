import React from 'react';
import {
  Select,
  message,
  Table,
  Button,
} from 'antd';
import moment from 'moment';
import './DivisionTable.less';
import http from 'Util20/api';

const { Option } = Select;

class DivisionTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedItem: {},
      dataSource: [],
      options: [],
    };
  }

  componentDidMount = async () => {
    let res;
    try {
      res = await http().getAppLinks({
        getrecordcount: 1,
        parentresids: 639829697215,
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    const options = res.data || [];
    options.forEach(item => {
      item.label = item.resname;
      item.value = item.resname;
    })
    this.setState({ loading: false, options });
  }

  columns = [
    {
      title: '数据表科别',
      dataIndex: 'division',
      key: 'division',
    },
    {
      title: '数据表名称',
      dataIndex: 'name',
      key: 'name',
      render: (value) => {
        return <Button onClick={() => this.props.onCellClick && this.props.onCellClick(value)}>{value}</Button>
      }
    }
  ]

  handleChange = (value, option) => {
    const selectedItem = option.props['option-item'];
    const dataSource = selectedItem.AppLinks.map(item => {
      return {
        division: selectedItem.value,
        name: item.RES_NAME,
        key: item.RES_NAME,
      }
    });
    this.setState({ selectedItem, dataSource });
  }

  render() {
    const { selectedItem, dataSource, options, loading } = this.state;
    return (
      <div className="division-table">
        <div className='division-table__select'>
          <div>访问科别：</div>
          <Select value={selectedItem.value} style={{ width: 160 }} onChange={this.handleChange} placeholder='请选择访问科别'>
            {options.map(optionItem => <Option key={optionItem.value} value={optionItem.value} option-item={optionItem}>{optionItem.label}</Option>)}
          </Select>
        </div>
        <Table dataSource={dataSource} columns={this.columns} loading={loading} bordered />
      </div>
    );
  }
}

export default DivisionTable;
