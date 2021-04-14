import React, { Component } from 'react';
import { Button, Table, Select, message } from 'antd';
import moment from 'moment';
import http from 'Util20/api';
import ExportJsonExcel from 'js-export-excel';

const { Option } = Select;

const curYear = moment().format('YYYY');
const months = [
  { title: 1, value: '01' },
  { title: 2, value: '02' },
  { title: 3, value: '03' },
  { title: 4, value: '04' },
  { title: 5, value: '05' },
  { title: 6, value: '06' },
  { title: 7, value: '07' },
  { title: 8, value: '08' },
  { title: 9, value: '09' },
  { title: 10, value: '10' },
  { title: 11, value: '11' },
  { title: 12, value: '12' }
];
const years = [
  { title: '2020', value: 2020 },
  { title: '2021', value: 2021 },
  { title: '2022', value: 2022 },
  { title: '2023', value: 2023 }
];

const columns = [
  {
    title: 'Person Number',
    dataIndex: 'C3_671549063991',
    key: 'C3_671549063991',
    ellipsis: true,
    width: 140
  },
  {
    title: 'Assignment Number',
    dataIndex: 'C3_671549075116',
    key: 'C3_671549075116',
    ellipsis: true,
    width: 150
  },
  {
    title: 'Assignment Number (ET)',
    dataIndex: 'C3_671549099976',
    ellipsis: true,
    key: 'C3_671549099976',
    width: 170
  },
  {
    title: 'Hire Date',
    dataIndex: 'C3_671549142897',
    ellipsis: true,
    key: 'C3_671549142897'
  },
  {
    title: 'Person Type',
    dataIndex: 'C3_671549167757',
    ellipsis: true,
    key: 'C3_671549167757',
    width: 140
  },
  {
    title: 'Worker Type',
    dataIndex: 'C3_671549182272',
    ellipsis: true,
    key: 'C3_671549182272',
    width: 140
  },
  {
    title: 'Effective Start Date',
    dataIndex: 'effectDate',
    ellipsis: true,
    key: 'effectDate',
    width: 180
  },
  {
    title: 'Action',
    dataIndex: 'Action',
    ellipsis: true,
    key: 'Action'
  },
  {
    title: 'Reason',
    dataIndex: 'Reason',
    ellipsis: true,
    key: 'Reason'
  },
  {
    title: 'Business Unit',
    dataIndex: 'C3_671549241803',
    ellipsis: true,
    key: 'C3_671549241803',
    width: 250
  },
  {
    title: 'Department',
    dataIndex: 'C3_671563896529',
    ellipsis: true,
    key: 'C3_671563896529',
    width: 300
  },
  {
    title: 'Grade Code',
    dataIndex: 'C3_671561640559',
    ellipsis: true,
    key: 'C3_671561640559',
    width: 140
  },
  {
    title: 'Job Code',
    dataIndex: 'C3_671559774903',
    ellipsis: true,
    key: 'C3_671559774903',
    width: 180
  },
  {
    title: 'Business Title',
    dataIndex: 'C3_671561710715',
    ellipsis: true,
    key: 'C3_671561710715',
    width: 250
  },
  {
    title: '*Current Manager Assignment Number',
    dataIndex: 'C3_671561835861',
    ellipsis: true,
    key: 'C3_671561835861',
    width: 270
  },
  {
    title: 'New Manager Assignment Number',
    dataIndex: 'C3_671561859549',
    ellipsis: true,
    key: 'C3_671561859549',
    width: 250
  },
  {
    title: 'New Manager Person Number',
    dataIndex: 'C3_671561883924',
    ellipsis: true,
    key: 'C3_671561883924',
    width: 250
  }
];

class ExportPersonnelChanges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startMonth: '01', //起止年月
      endMonth: '12',
      startYear: curYear,
      endYear: curYear,
      rawData: [], //原始数据，通过请求获取
      handledData: [] //处理后数据，用于展示和导出
    };
  }

  componentDidMount = () => {
    this.getRawData();
  };

  /**
   * 获取原始数据
   */
  getRawData = async () => {
    const { startYear, endYear, startMonth, endMonth } = this.state;
    const { baseURL } = this.props;
    const startDate = startYear + startMonth + '01';
    const endDate = endYear + endMonth + '31';
    let res;
    try {
      res = await http({ baseURL }).getTable({
        resid: '671538190462',
        cmswhere: `effectDate >= '${startDate}' and effectDate <= '${endDate}'`
      });
      this.setState({
        rawData: res.data
      });
    } catch (error) {
      console.log(error.message);
      message.info(error.message);
    }
    this.handleData();
  };

  /**
   * 处理原始数据，用于展示和导出
   */
  handleData = () => {
    const { rawData } = this.state;
    const handledData = rawData.map(item => {
      //处理生效时间
      item.effectDate = moment(item.effectDate)
        .startOf('month')
        .format('YYYY-MM-DD');
      //处理Action(TRANS_COST_CNTR, ASG_CHANGE, MANAGER_CHANGE)及Reason(REORG, JOB_CODE_CHANGE, NEW_LDR)
      if (
        (item.C3_417991699292 !== '' ||
          item.C3_417991699934 !== '' ||
          item.C3_417991699474 !== '' ||
          item.C3_581428109480 !== '' ||
          item.C3_417991699626 !== '') &&
        (item.iiviGrade === '' &&
          item.C3_417993433650 === '' &&
          item.jobCode === '')
      ) {
        item.Action = 'TRANS_COST_CNTR';
        item.Reason = 'REORG';
      } else if (
        item.C3_417993433650 !== '' &&
        (item.C3_417991699934 === '' &&
          item.C3_417991699474 === '' &&
          item.C3_581428109480 === '' &&
          item.C3_417991699626 === '' &&
          item.iiviGrade === '' &&
          item.C3_417991699292 === '' &&
          item.jobCode === '')
      ) {
        item.Action = 'MANAGER_CHANGE';
        item.Reason = 'NEW_LDR';
      } else {
        item.Action = 'ASG_CHANGE';
        item.Reason = 'JOB_CODE_CHANGE';
      }
      return item;
    });
    this.setState({
      handledData
    });
  };

  /**
   * 导出数据
   */
  exportData = () => {
    const { handledData } = this.state;
    const option = {};
    option.fileName = '人事变动记录';
    const sheetHeader = [
      '* Person Number',
      '* Assignment Number',
      '* Assignment Number (ET)',
      '* Hire Date',
      '* Person Type',
      '* Worker Type',
      '* Effective Start Date',
      '* Action(TRANS_COST_CNTR, ASG_CHANGE, MANAGER_CHANGE)',
      'Reason(REORG, JOB_CODE_CHANGE, NEW_LDR)',
      'Business Unit [..]',
      'Department',
      'Grade Code',
      'Job Code',
      'Business Title',
      '* Current Manager Assignment Number',
      'New Manager Assignment Number',
      'New Manager Person Number'
    ];
    const sheetData = handledData.map(item => {
      return {
        '* Person Number': item.C3_671549063991,
        '* Assignment Number': item.C3_671549075116,
        '* Assignment Number (ET)': item.C3_671549099976,
        '* Hire Date': item.C3_671549142897,
        '* Person Type': item.C3_671549167757,
        '* Worker Type': item.C3_671549182272,
        '* Effective Start Date': item.C3_671549209897,
        '* Action(TRANS_COST_CNTR, ASG_CHANGE, MANAGER_CHANGE)': item.Action,
        'Reason(REORG, JOB_CODE_CHANGE, NEW_LDR)': item.Reason,
        'Business Unit [..]': item.C3_671549241803,
        Department: item.C3_671563896529,
        'Grade Code': item.C3_671561640559,
        'Job Code': item.C3_671559774903,
        'Business Title': item.C3_671561710715,
        '* Current Manager Assignment Number': item.C3_671561835861,
        'New Manager Assignment Number': item.C3_671561859549,
        'New Manager Person Number': item.C3_671561883924
      };
    });
    option.datas = [
      {
        sheetData: sheetData,
        sheetName: '人事变动记录',
        sheetHeader: sheetHeader
      }
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  render() {
    const {
      startYear,
      endYear,
      startMonth,
      endMonth,
      handledData
    } = this.state;
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#fff' }}>
        <div style={{ paddingTop: '16px', paddingBottom: '16px' }}>
          <Button
            type="primary"
            style={{ marginRight: '32px', marginLeft: '32px' }}
            onClick={() => {
              this.exportData();
            }}
          >
            导出变动记录
          </Button>
          <span style={{ marginRight: '16px', marginLeft: '16px' }}>
            起止日期：
          </span>
          <Select
            size="small"
            style={{ width: 100 }}
            value={startYear}
            onChange={v => {
              this.setState(
                {
                  startYear: v
                },
                () => {
                  this.getRawData();
                }
              );
            }}
          >
            {years.map(year => {
              return (
                <Select.Option value={year.value}>{year.title}</Select.Option>
              );
            })}
          </Select>
          年
          <Select
            size="small"
            style={{ width: 100 }}
            value={startMonth}
            onChange={v => {
              this.setState(
                {
                  startMonth: v
                },
                () => {
                  this.getRawData();
                }
              );
            }}
          >
            {months.map(month => {
              return (
                <Select.Option value={month.value}>{month.title}</Select.Option>
              );
            })}
          </Select>
          月{'\u00A0'}
          --{'\u00A0'}
          <Select
            size="small"
            style={{ width: 100 }}
            value={endYear}
            onChange={v => {
              this.setState(
                {
                  endYear: v
                },
                () => {
                  this.getRawData();
                }
              );
            }}
          >
            {years.map(year => {
              return (
                <Select.Option value={year.value}>{year.title}</Select.Option>
              );
            })}
          </Select>
          年
          <Select
            size="small"
            style={{ width: 100 }}
            value={endMonth}
            onChange={v => {
              this.setState(
                {
                  endMonth: v
                },
                () => {
                  this.getRawData();
                }
              );
            }}
          >
            {months.map(month => {
              return (
                <Select.Option value={month.value}>{month.title}</Select.Option>
              );
            })}
          </Select>
          月
        </div>
        <div className="tableStyle">
          <Table
            style={{
              marginRight: '8px',
              marginLeft: '8px'
            }}
            columns={columns}
            dataSource={handledData}
            bordered
            size="middle"
            scroll={{ x: 240 }}
          />
        </div>
      </div>
    );
  }
}

export default ExportPersonnelChanges;
