import React from 'react';
import {
  Tabs,
  message,
  Select,
  Table,
  DatePicker,
  Modal,
  Icon,
  Button,
  Collapse,
  TreeSelect,
  Spin,
  Input
} from 'antd';
import './CompensatoryLeave.less';
import { getItem } from 'Util20/util';
import http from 'Util20/api';
import TableData from 'Common/data/TableData';
import moment from 'moment';
const { RangePicker } = DatePicker;
const wd = ['日', '一', '二', '三', '四', '五', '六'];
class CompensatoryLeave extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.attendanceDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
    const userInfoJson = JSON.parse(getItem('userInfo'));
    this.state = {
      viz: false,
      dateBreak: ['2023-10-01', '2023-10-02', '2023-10-03'],
      showDate: []
    };
  }
  changeRange = (arr) => {
    let showDate = [];
    let st = moment(arr[0]).format('YYYY-MM-DD');
    let ed = moment(arr[1]).add(1, 'days').format('YYYY-MM-DD');
    let c = st;
    while (c != ed) {
      let b = false;
      let canChange = true;
      if ((moment(c).weekday() === 0) || (moment(c).weekday() === 6)) {
        b = true;
      }
      for (let i = 0; i < this.state.dateBreak.length; i++) {
        if (c === this.state.dateBreak[i]) {
          b = true;
          canChange = false;
        }
      }
      showDate.push(
        {
          Dote: c,
          da: moment(c).weekday(),
          break: b,
          canChange
        }
      )
      c = moment(c).add(1, 'days').format('YYYY-MM-DD');
    }
    let stN = showDate[0].da;
    let edN = showDate[showDate.length - 1].da;
    let beArr = [];
    for (let i = 0; i < stN; i++) {
      beArr.push({
        Dote: '',
        da: i,
        break: false,
        canChange: false,
      })
    }
    for (let i = edN; i < 6; i++) {
      showDate.push(
        {
          Dote: '',
          da: i,
          break: false,
          canChange: false,
        }
      )
    }
    showDate = beArr.concat(showDate);
    this.setState({ showDate });
    console.log(showDate)
  }
  changeBreak = (key) => {
    let showDate = this.state.showDate;
    showDate[key].break = !showDate[key].break;
    this.setState({ showDate });
  }
  clzModal = () => {
    this.setState({ viz: false });
  }
  render() {
    return (
      <div className="CompensatoryLeave">
        <Modal
          title="年假月度使用情况"
          visible={this.state.viz}
          footer={null}
          width="80vw"
          onCancel={() => {
            this.setState({ viz: false });
          }}
        >
          <div className='CompensatoryLeave_modal'>
            <div className='cal_title'>
              <span>节日说明：</span>
              <Input style={{ width: 120 }} />

              <span>选择范围</span>
              <RangePicker style={{ width: 400 }} onChange={(v) => { this.changeRange(v) }}></RangePicker>
            </div>
            <div>
              <ul className='cal'>
                {
                  wd.map((item, key) => {
                    return (
                      <li className='cal_header' key={'_' + key}>
                        {item}
                      </li>
                    )
                  })
                }
                {
                  this.state.showDate.map((item, key) => {
                    return (
                      <li key={key} className={item.canChange ? 'cal_act' : 'cal_fob'} onClick={() => { if (item.canChange) { this.changeBreak(key); } }}>
                        <Icon style={item.canChange ? {} : { display: 'none' }} type="retweet" />
                        <span>{item.Dote}</span>
                        <span style={item.Dote != '' ? {} : { display: 'none' }} className={item.break ? 'cal_bre' : 'cal_wo'}>{item.break ? '休' : '班'}</span>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
          <Button type={'primary'} onClick={() => { this.clzModal(); }}>确定</Button>
        </Modal>
        <div className='CompensatoryLeave'>
          <TableData
            baseURL={this.baseURL}
            downloadBaseURL={this.attendanceDownloadURL}
            resid={375455814611}
            actionBarWidth={200}
            hasAdd={false}
            hasBeBtns={false}
            hasModify={false}
            hasBackBtn={true}
            hasDelete={true}
            hasRowModify={false}
            hasRowView={true}
            hasRowDelete={true}
            hasRowEdit={false}
            isSetColumnWidth={false}
            subtractH={200}
            actionBarExtra={
              () => {
                return (
                  <Button size='small' type='primary' onClick={() => { this.setState({ viz: true }) }}>
                    添加
                  </Button>
                )
              }
            }
          />
        </div>
      </div>
    );
  }
}

export default CompensatoryLeave;
