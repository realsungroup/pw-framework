import React from 'react';
// import { propTypes, defaultProps } from './propTypes';
import TableData from 'Common/data/TableData';
import ShowDataChart from '../ShowDataChart/ShowDataChart';
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
  DatePicker,
  Tabs
} from 'antd';
import { LzModal, LzMenuForms } from '../loadableCustom';
import http from 'Util20/api';
import { getTableData,getMainTableData } from '../../../util/api';
import moment from 'moment';
import EChartsOfReact from 'echarts-of-react';
import echarts from 'echarts/lib/echarts';

/**
 * 常见数据录入
 */
const { TextArea } = Input;
const { TabPane } = Tabs;

const resid1 = 640186569410; // 血压检测表
const resid2 = 640190825057; // 血糖检测表
const resid3 = 640190883264; // 体温检测表
class RecordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beginDate: '',
      endDate: '',
      now: '',
      days: '',
      basic: '',
      change: '',
      remark: '',
      bloodPressureDate: [],
      selectKey: '1',
      res: {},
      xAxis: {}, // x轴渲染的数据
      legend: {}, // 图表上方的选择器
      series: []
    };
  }

  componentWillMount = () => {
    console.log(this.props);
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
    // this.getTableData();
  };

  handleChartData = () => {
    let legendData = [];
    // recordTime = this.state.res.map(item => {
    //   if (item.recordTime != '') {
    //     let record = moment(item.recordTime).format('YYYY-MM-DD');
    //     return record;
    //   }
    // });

    // legendData = this.state.res.cmscolumninfo.map(item => {
    //   let data = item.forEach(key => {
    //     if (key.ColResDataSort != '') {
    //       return key;
    //     }
    //   });
    //   return data;
    // });
  };

  //获取数据
  // getTableData = async () => {
  //   let res;
  //   if (this.state.selectKey == 1) {
  //     try {
  //       res = await getMainTableData(resid1, {
  //         getcolumninfo:1
  //       });
  //       this.setState({ res: res});
  //     } catch (err) {
  //       return message.error(err.message);
  //     }
  //   } else if (this.state.selectKey == 2) {
  //     try {
  //       res = await getTableData(resid2, {
  //         getcolumninfo:1
  //       });
  //     } catch (err) {
  //       return message.error(err.message);
  //     }
  //   } else if (this.state.selectKey == 3) {
  //     try {
  //       res = await getTableData(resid3, {
  //         getcolumninfo:1
  //       });
  //     } catch (err) {
  //       return message.error(err.message);
  //     }
  //   }
  //   this.handleChartData();
  // };

  //开始日期
  beginDateChange = value => {
    let start = moment(value).format('YYYY-MM-DD');
    let end = moment(this.state.endDate);
    // this.setState({ beginDate: moment(start) });
    let days = end.diff(moment(start), 'day');
    this.setState({
      days: days,
      beginDate: moment(start)
    });
  };
  //结束日期
  endDateChange = value => {
    // this.setState({ endDate: moment(value).format('YYYY-MM-DD') });
    let end = moment(value).format('YYYY-MM-DD');
    let days = moment(end).diff(this.state.beginDate, 'day');
    this.setState({ 
      days: days,
      endDate:moment(end)
     });
  };

  activeKeyChange = key => {
    this.setState({
      selectKey: key
    });
  };
  render() {
    const option = {
      title: {
        text: '血压'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['舒张压', '收缩压']
      },
      xAxis: {
        data: [
          '2020-04-11',
          '2020-04-12',
          '2020-04-13',
          '2020-04-14',
          '2020-04-15',
          '2020-04-16',
          '2020-04-17'
        ]
      },
      yAxis: {
        splitLine: {
          show: false
        }
      },
      toolbox: {},
      dataZoom: [
        {
          startValue: '2020-01-01'
        },
        {
          type: 'inside'
        }
      ],
      series: [
        {
          name: '舒张压',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210],
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 80
              },
              {
                yAxis: 100
              }
            ]
          }
        },
        {
          name: '收缩压',
          type: 'line',
          data: [110, 122, 91, 124, 80, 140, 120],
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 100
              },
              {
                yAxis: 120
              }
            ]
          }
        }
      ]
    };
    const { now, beginDate } = this.state;
    return (
      <div className="DataPut">
        <h2 style={{ marginLeft: '9px' }}>常见信息录入</h2>
        <Tabs defaultActiveKey="1" onChange={this.activeKeyChange}>
          <TabPane tab="血压" key="1">
            <Form className="recordInput">
              <div className="recordInput__userInfo">
                <Form.Item
                  label="用户编号"
                  className="recordInput__userInfo__userNo"
                >
                  <Input defaultValue={this.props.userNo} disabled />
                </Form.Item>
                <Form.Item
                  label="用户姓名"
                  className="recordInput__userInfo__userName"
                >
                  <Input defaultValue={this.props.userName} disabled />
                </Form.Item>
                <Form.Item
                  label="开始日期"
                  className="recordInput__userInfo__beginDate"
                >
                  <DatePicker
                    onChange={this.beginDateChange}
                    value={beginDate}
                  />
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
              <div id="recordInput__showChart1">
                <ShowDataChart
                beginDate = {this.state.beginDate}
                endDate = {this.state.endDate}
                selectKey = {this.state.selectKey}
                />
              </div>
              <div className="recordInput__dataContainer">
                <TableData
                  resid={640186569410}
                  hasModify={false}
                  height={500}
                  hasDelete={false}
                  hasRowDelete={false}
                  defaultColumnWidth={150}
                  actionBarWidth={200}
                  subtractH={150}
                />
              </div>
              <div className="recordInput__basicMd">
                <Form.Item label="基本用药">
                  <TextArea
                    rows={3}
                    className="recordInput__basicMd__basic"
                    value={this.s}
                  />
                </Form.Item>
                <Form.Item label="用药变化">
                  <TextArea rows={3} className="recordInput__basicMd__change" />
                </Form.Item>
                <Form.Item label="备注">
                  <TextArea rows={3} className="recordInput__basicMd__remark" />
                </Form.Item>
              </div>
            </Form>
          </TabPane>
          <TabPane tab="血糖" key="2">
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
                  <DatePicker
                    onChange={this.beginDateChange}
                    value={beginDate}
                  />
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
              <div id="recordInput__showChart2">
                <EChartsOfReact
                  id="myChart2"
                  option={this.state.option}
                  defaultWidth={1200}
                  defaultHeight={400}
                />
              </div>
              <div className="recordInput__dataContainer">
                <TableData
                  resid={resid2}
                  hasModify={false}
                  height={500}
                  hasDelete={false}
                  hasRowDelete={false}
                  defaultColumnWidth={150}
                  actionBarWidth={200}
                  subtractH={150}
                />
              </div>
              <div className="recordInput__basicMd">
                <Form.Item label="基本用药">
                  <TextArea
                    rows={3}
                    className="recordInput__basicMd__basic"
                    value={this.s}
                  />
                </Form.Item>
                <Form.Item label="用药变化">
                  <TextArea rows={3} className="recordInput__basicMd__change" />
                </Form.Item>
                <Form.Item label="备注">
                  <TextArea rows={3} className="recordInput__basicMd__remark" />
                </Form.Item>
              </div>
            </Form>
          </TabPane>
          <TabPane tab="体温" key="3">
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
                  <DatePicker
                    onChange={this.beginDateChange}
                    value={beginDate}
                  />
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
              <div id="recordInput__showChart3">
                <EChartsOfReact
                  id="myChart3"
                  option={this.state.option}
                  defaultWidth={1200}
                  defaultHeight={400}
                />
              </div>
              <div className="recordInput__dataContainer">
                <TableData
                  resid={resid3}
                  hasModify={false}
                  height={500}
                  hasDelete={false}
                  hasRowDelete={false}
                  defaultColumnWidth={150}
                  actionBarWidth={200}
                  subtractH={150}
                />
              </div>
              <div className="recordInput__basicMd">
                <Form.Item label="基本用药">
                  <TextArea
                    rows={3}
                    className="recordInput__basicMd__basic"
                    value={this.s}
                  />
                </Form.Item>
                <Form.Item label="用药变化">
                  <TextArea rows={3} className="recordInput__basicMd__change" />
                </Form.Item>
                <Form.Item label="备注">
                  <TextArea rows={3} className="recordInput__basicMd__remark" />
                </Form.Item>
              </div>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default RecordInput;
