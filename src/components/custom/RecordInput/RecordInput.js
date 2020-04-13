import React from 'react';
// import { propTypes, defaultProps } from './propTypes';
// import TableData from 'Common/data/TableData';
import './RecordInput.less';
import {
  Button,
  message,
  Modal,
  Form,
  Row,
  Col,
  Input,
  TimePicker,
  DatePicker
} from 'antd';
import { LzModal, LzMenuForms } from '../loadableCustom';
import http, { makeCancelable } from 'Util20/api';
import moment from 'moment';
import EChartsOfReact from 'echarts-of-react';
import echarts from 'echarts/lib/echarts'

/**
 * 常见数据录入
 */

class RecordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beginDate: '',
      endDate: '',
      now: '',
      days: '',
      option:{
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
      }]
      }
    }
  }

  componentWillMount = () => {
    let nowDate = moment().format('YYYY-MM-DD');
    let start = moment(nowDate).add(-30, 'days');
    this.setState({
      now: moment(nowDate),
      endDate: moment(nowDate),
      beginDate: moment(nowDate).add(-30, 'days')
    });
    this.setState({
      days: moment(nowDate).diff(start, 'day')
    });
    var myChart = echarts.init(document.getElementsById('showChart'));
    
  };

  //开始日期
  beginDateChange = value => {
    let start = moment(value).format('YYYY-MM-DD');
    let end = moment(this.state.endDate);
    this.setState({ beginDate: moment(start) });
    let days = end.diff(moment(start), 'day');
    this.setState({ days: days });
  };
  //结束日期
  endDateChange = value => {
    this.setState({ endDate: moment(value).format('YYYY-MM-DD') });
    let end = moment(value).format('YYYY-MM-DD');
    let days = moment(end).diff(this.state.beginDate, 'day');
    this.setState({ days: days });
  };

  render() {
    const { now, beginDate } = this.state;
    // const {option}= this.option
    // console.log(this.props);
    return (
      <div className="DataPut">
        <h2 style={{ marginLeft: '9px' }}>常见信息录入</h2>
        <Form className="recordInput">
          <div className="recordInput__userInfo">
            <Form.Item
              label="用户编号"
              className="recordInput__userInfo__userNo"
            >
              <Input defaultValue="00000001" disabled />
            </Form.Item>
            <Form.Item
              label="用户姓名"
              className="recordInput__userInfo__userName"
            >
              <Input defaultValue="张三" disabled />
            </Form.Item>
            <Form.Item
              label="开始日期"
              className="recordInput__userInfo__beginDate"
            >
              <DatePicker onChange={this.beginDateChange} value={beginDate} />
            </Form.Item>
            <Form.Item
              label="结束日期"
              className="recordInput__userInfo__endDate"
            >
              <DatePicker onChange={this.endDateChange} value={now} />
            </Form.Item>
            <Form.Item label="共计" className="recordInput__userInfo__days">
              <Input
                value={`${this.state.days}天`}
                // disabled
                style={{ width: '35%' }}
              />
            </Form.Item>
          </div>
          <div id="showChart">
            <EChartsOfReact
              option={this.state.option}
              notMerge={true}
              lazyUpdate={false}
              style={{ height: '350px', width: '1000px' }}
              className="react_for_echarts"
            />
          </div>
        </Form>
      </div>
    );
  }
}

export default RecordInput;
