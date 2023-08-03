import React, { Component } from 'react'
import './AttendanceRepo2.less'
import TableData from '../../common/data/TableData';
import { Tabs, Select, Menu, Button, Spin, Radio, DatePicker, message } from 'antd';
import http from 'Util20/api';
import moment from 'moment';


class AttendanceRepo2 extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.attendanceDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
    this.state = {
      dataLength: 0,
      curNum: 0,
      stModi: false,
      data: [],
      loading: false

    }
  }
  getData = async () => {
    this.setState({ curNum: 0, dataLength: 0, loading: true });
    try {
      let res = await http({ baseURL: this.baseURL }).getTable({
        resid: '744029339756'
      })
      console.log(res.data)
      this.setState({ dataLength: res.total, stModi: true, data: res.data });
      this.modiRec(res.data, 0, res.total);
    } catch (e) {
      console.log(e.message);
      this.setState({ errorMsg: e.message, loading: false });
    }
  }
  modiRec = async (data, n, total) => {
    try {
      let res = await http({ baseURL: this.baseURL }).modifyRecords({
        resid: '744029339756',
        data: [data[n]]
      });
      let c = n + 1;
      this.setState({ curNum: c });
      if (c === total) {
        this.setState({ loading: false });
        message.success('完成');
      } else {
        this.modiRec(data, c, total)
      }
    } catch (e) {
      console.log(e.message);
      this.setState({ errorMsg: e.message, loading: false });
    }
  }
  render() {
    return (
      <div className='attendanceRepo2'>
        <div className='cmdBar'>
          <Button loading={this.state.loading} type='primary' style={{ marginRight: '1rem' }} onClick={() => { this.getData(); }}>重新计算数据</Button>
          {this.state.stModi ? <span>当前进度:{this.state.curNum}/{this.state.dataLength}</span> : null}
        </div>
        <div className='tableWrap'>
          <TableData
            resid='743438730485'
            baseURL={this.baseURL}
            downloadBaseURL={this.attendanceDownloadURL}
            wrappedComponentRef={element => (this.tableDataRef = element)}
            refTargetComponentName="TableData"
            hasAdd={false}
            hasRowView={true}
            hasRowDelete={false}
            hasRowEdit={false}
            hasDelete={false}
            hasModify={false}
            hasRowModify={true}
            hasRowSelection={false}
            hasAdvSearch={false}
            importConfig={null}
            actionBarWidth={100}
            subtractH={220}
          />
        </div>
      </div>

    )
  }
}
export default AttendanceRepo2;