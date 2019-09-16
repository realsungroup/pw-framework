import React from 'react';
import { Select, message } from 'antd';
import TableData from '../../../../common/data/TableData';
import './WorkInfo.less';
import http from 'Util20/api';

const { Option } = Select;
class WorkInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      months: [],
      selectMonth: ''
    };
  }
  componentDidMount = async () => {
    await this.getYearMonths();
  };
  getYearMonths = async () => {
    try {
      const res = await http().getTable({
        resid: '447426327525',
        dblinkname: 'ehr'
      });
      if (res.data.length) {
        this.setState({
          months: res.data,
          selectMonth: res.data[0].C3_424358155202
        });
      }
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  renderSelect = () => {
    return (
      <Select
        placeholder="月份"
        style={{ width: 120, marginBottom: 16 }}
        value={this.state.selectMonth}
        onSelect={selectValue => {
          this.setState({ selectMonth: selectValue });
        }}
        showSearch
        filterOption={(input, option) => {
          console.log(input, option);
          return (
            option.props.children
              .toString()
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          );
        }}
      >
        {this.state.months.map(month => (
          <Option value={month.C3_424358155202}>{month.C3_424358155202}</Option>
        ))}
      </Select>
    );
  };
  render() {
    return (
      <div className="WorkInfoQuery">
        <div className="Home">
          <div className="buttonLine">{this.renderSelect()}</div>
          <TableData
            resid="460481857607"
            subtractH={200}
            hasAdvSearch={false}
            hasAdd={false}
            hasRowView={false}
            hasRowDelete={false}
            hasRowEdit={false}
            hasDelete={false}
            hasModify={false}
            hasBeBtns={true}
            hasRowModify={false}
            hasRowSelection={false}
            actionBarWidth={100}
            dblinkname="ehr"
            cparm1={this.props.person.C3_305737857578}
            cparm2={this.state.selectMonth}
            baseURL="http://10.108.2.66:9091/"
          />
        </div>
      </div>
    );
  }
}
export default WorkInfo;
