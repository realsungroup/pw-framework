import React, { Component } from 'react';
import { Select, Button, message, Input } from 'antd';
import moment from 'moment';
import http from 'Util20/api';

const { Option } = Select;

const curYear = parseInt(moment().format('YYYY'));
const year = [
  { label: curYear - 1, value: curYear - 1 },
  { label: curYear, value: curYear }
];
const month = [];
for (let i = 1; i <= 12; i++) {
  month.push({ label: i, value: i });
}

class MonthlySettlementLock extends Component {
  constructor() {
    super();
    this.state = {
      selectedYear: moment().format('YYYY'),
      selectedMonth: moment().format('MM') - 1,
      loading: false
    };
  }

  //进行锁定操作
  handleLock = async () => {
    const { selectedMonth, selectedYear } = this.state;
    // const sql1 = `update CT311025002785 set C3_469045712212 = 'Y' where C3_424652509987='${selectedYear}' and C3_469046133471='${selectedMonth}'`;
    const sql1 = `update CT651238160820 set C3_651238761645 = 'Y' where C3_651238195776='${selectedYear}' and C3_651238202386='${selectedMonth}'`;
    try {
      await http().runBySql({
        dblink: 'me',
        sql: sql1
      });
      message.success(`${selectedYear}年${selectedMonth}月的数据已锁定`);
    } catch (error) {
      console.log(error.message);
      message.info(error.message);
    }
    this.setState({
      loading: false
    });
  };

  render() {
    const { selectedMonth, selectedYear, loading } = this.state;
    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            height: '400px',
            width: '860px',
            border: '1px solid'
          }}
        >
          <p style={{ margin: '16px 0px 0px 16px', fontSize: '16px' }}>
            数据锁定：设置指定条件的数据为不可修改状态
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div style={{ margin: '100px 0 16px 0' }}>
              <span>资源名称</span>
              <Input
                value="考勤月报"
                disabled
                style={{ width: '400px', margin: '0 0 0 16px' }}
              />
            </div>
            <div>
              <span>数据锁定的截止年月(含)</span>
              <Select
                defaultValue={selectedYear}
                onChange={value => {
                  this.setState({ selectedYear: value });
                }}
                style={{ width: 180, margin: '0px 0px 32px 16px' }}
              >
                {year.map(item => {
                  return <Option value={item.value}>{item.label}</Option>;
                })}
              </Select>
              年
              <Select
                defaultValue={selectedMonth}
                onChange={value => {
                  this.setState({ selectedMonth: value });
                }}
                style={{ width: 180, margin: '0px 0px 32px 16px' }}
              >
                {month.map(item => {
                  return <Option value={item.value}>{item.label}</Option>;
                })}
              </Select>
              月
            </div>
            <div>
              <Button
                loading={loading}
                style={{ marginLeft: '48px', marginBottom: '32px' }}
                type="primary"
                onClick={() => {
                  this.setState({
                    loading: true
                  });
                  this.handleLock();
                }}
              >
                确认锁定
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MonthlySettlementLock;
