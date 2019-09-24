import React from 'react';
import './ViewRate.less';
import TableData from '../../../../common/data/TableData';
import http from 'Util20/api';
import { message, Select, Skeleton } from 'antd';

const { Option } = Select;
class ViewRate extends React.Component {
  state = {
    years: [],
    selectYear: { key: 0, label: '请选择财年' }
  };
  componentDidMount = async () => {
    const { person } = this.props;
    let id;
    if (person) {
      id = person.C3_305737857578;
    }
    this.getYearsTarget(id);
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.person.C3_305737857578 !== this.props.person.C3_305737857578
    ) {
      this.getYearsTarget(this.props.person.C3_305737857578);
    }
  }

  getYearsTarget = async id => {
    try {
      const res = await http().getTable({
        resid: '620409727880',
        cparm1: id,
        dblinkname: 'ehr'
      });
      if (res.data.length) {
        this.setState({
          years: res.data,
          selectYear: {
            key: res.data[0].C3_420297595131,
            label: res.data[0].C3_420150922019
          }
        });
      } else {
        this.setState({
          years: [],
          selectYear: { key: 0, label: '请选择财年' }
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
        style={{ width: 120, margin: '8px' }}
        placeholder="选择财年"
        value={this.state.selectYear}
        onSelect={selectValue => {
          this.setState({ selectYear: selectValue });
        }}
        labelInValue
      >
        {this.state.years.map(target => (
          <Option value={target.C3_420297595131}>
            {target.C3_420150922019}
          </Option>
        ))}
      </Select>
    );
  };
  render() {
    const id = this.props.person.C3_305737857578;
    const { selectYear } = this.state;
    return (
      <div id="view-rate-query">
        {this.renderSelect()}
        <div style={{ flex: 1 }}>
          <Skeleton loading={!id}>
            <TableData
              key="view-rate-query"
              resid="620406435673"
              subtractH={220}
              hasAdvSearch={true}
              hasAdd={false}
              hasRowView={true}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={false}
              hasRowSelection={true}
              actionBarWidth={100}
              cparm1={id}
              cparm2={selectYear.label}
              dblinkname="ehr"
              baseURL="http://10.108.2.66:9091/"
            />
          </Skeleton>
        </div>
      </div>
    );
  }
}

export default ViewRate;
