import React from 'react';
import TableData from 'Common/data/TableData';
import './GLUChart.less';
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
  Tabs,
} from 'antd';
import { LzModal, LzMenuForms } from '../loadableCustom';
import http from 'Util20/api';
import { getTableData, getMainTableData } from '../../../util/api';
import moment from 'moment';
import echarts from 'echarts';
import { Record } from 'immutable';

/**
 * 血糖EChart
 */
const colors = ['#5793f3', '#d14a61', '#675bba'];
const point = [
  '早餐前',
  '早餐后',
  '中餐前',
  '中餐后',
  '晚餐前',
  '晚餐后',
  '随即',
];

const resid1 = 640186569410; // 血压检测表
const resid2 = 640190825057; // 血糖检测表
const resid3 = 640190883264; // 体温检测表
class GLUChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basic: '', //基本用药
      change: '', //用药变化
      remark: '', //备注
      bloodPressureDate: [],
      res: {},
      xAxis: {}, // x轴渲染的数据
      legendData: {}, // 图表上方的选择器
      series: [],
      recordTime: [],
      minDate: '',
      maxDate: '',
    };
  }

  componentWillMount = () => {
    console.log('props', this.props);
    this.getTableData();
  };
  async componentDidMount() {
    this._echarts = echarts.init(document.getElementById('dataChart2'));
    this._echarts.setOption({
      color: colors,
      title: {
        text: '血糖',
      },
      legend: {
        data: [],
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: [],
      },
      yAxis: {
        splitLine: {
          show: false,
        },
      },
      dataZoom: [
        {
          // startValue: '2020-01-01'
        },
        {
          type: 'inside',
        },
      ],
      series: [
        
      ],
    });
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.beginDate !== prevProps.beginDate) {
      let start = this.props.beginDate.format('YYYY-MM-DD');
      if(this.props.beginDate.isBefore(moment(this.state.minDate))){
        start = this.state.minDate
      }
      this._echarts.setOption({
        dataZoom: [
          {
            // startValue: this.props.beginDate.format("YYYY-MM-DD"),
            startValue: start,
          },
          {
            type: 'inside',
          },
        ],
      });
    }
    if (this.props.endDate !== prevProps.endDate) {
      let end = this.props.endDate.format('YYYY-MM-DD');
      if(this.props.endDate.isAfter(moment(this.state.maxDate))){
        end = this.state.maxDate
      }
      this._echarts.setOption({
        dataZoom: [
          {
            // startValue: this.props.beginDate.format("YYYY-MM-DD"),
            endValue: end,
          },
          {
            type: 'inside',
          },
        ],
      });
    }
  };
  //获取数据
  getTableData = async () => {
    let res;
    try {
      res = await getMainTableData(resid2, {
        getcolumninfo: 1,
      });
      this.setState({ res: res });
      console.log(res);
    } catch (err) {
      return message.error(err.message);
    }
    let source = [];
    let recordTime = []; //记录日期数据
    let records = []; //记录日期数据
    let GLUData = {
      '早餐前':[],
      '早餐后':[],
      '中餐前':[],
      '中餐后':[],
      '晚餐前':[],
      '晚餐后':[],
      '随即':[],
    };
    let dateData = {};

    res.data.map((item) => {
      if (item.recordTime != '') {
        let record = moment(item.recordTime).format('YYYY-MM-DD');
        records.push(record);
        if (dateData[record]) {
          dateData[record].push(item);
        } else {
          dateData[record] = [item];
        }
      }
    });
    console.log('dateData', dateData);
    this.setState({
      minDate: recordTime[0],
      maxDate: recordTime[recordTime.length - 1],
    });
    for (let i in dateData) {
      point.forEach((data) => {
        let findData = dateData[i].find((item) => {
          return item.timing == data;
        });
        if (findData) {
          GLUData[data].push(findData.GLU);
        } else {
          GLUData[data].push(undefined);
        }
      });
    }
    let obj1 = {};
    for(let i of records ){
      if(!obj1[i]){
        recordTime.push(i);
        obj1[i] = 1 ;
      }
    }
    console.log('GLUData', GLUData);
    let legendData = []; //echart legend里data数据
    let legend = [];
    this.state.res.data.forEach((item) => {
      if (item.timing) {
        // return item.text
        // legendData.push(item.text);
        legend.push(item.timing);
      }
    });
    let obj = {};
    for (let i of legend) {
      if (!obj[i]) {
        legendData.push(i);
        obj[i] = 1;
      }
    }
    let seriesData = [[]];
    this.state.res.data.map((item) => {
      if (item.GLU !== null) {
        seriesData[0].push(item.GLU);
      }
    });
    source.push(
      recordTime,
      legendData,
      this.props.beginDate.format('YYYY-MM-DD')
    );
    // console.log(this.props.beginDate.format('YYYY-MM-DD'));
    console.log(source);
    this._echarts.setOption({
      dataset: {
        dimensions: [],
        source: [recordTime],
      },
      legend: { data: legendData },
      xAxis: {
        type: 'category',
        data: recordTime,
      },
      dataZoom: [
        {
          startValue: this.props.beginDate.format("YYYY-MM-DD"),
        },
        {
          // endValue: this.props.endDate.format('YYYY-MM-DD'),
        },
        {
          type: 'inside',
        },
      ],
      series: [
        {
          name: legendData[0],
          type: 'line',
          data: GLUData[point[0]],
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 3.9,
              },
              {
                yAxis: 6.1,
              },
            ],
          },
        },
        {
          name: legendData[1],
          type: 'line',
          data: GLUData[point[1]],
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 3.9,
              },
              {
                yAxis: 6.1,
              },
            ],
          },
        },
        {
          name: legendData[2],
          type: 'line',
          data: GLUData[point[2]],
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 3.9,
              },
              {
                yAxis: 6.1,
              },
            ],
          },
        },
        {
          name: legendData[3],
          type: 'line',
          data: GLUData[point[3]],
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 3.9,
              },
              {
                yAxis: 6.1,
              },
            ],
          },
        },
        {
          name: legendData[4],
          type: 'line',
          data: GLUData[point[4]],
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 3.9,
              },
              {
                yAxis: 6.1,
              },
            ],
          },
        },
        {
          name: legendData[5],
          type: 'line',
          data: GLUData[point[5]],
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 3.9,
              },
              {
                yAxis: 6.1,
              },
            ],
          },
        },
        {
          name: legendData[6],
          type: 'line',
          data: GLUData[point[6]],
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 3.9,
              },
              {
                yAxis: 6.1,
              },
            ],
          },
        },
      ],
    });
  };

  render() {
    return (
      <div
        id="dataChart2"
        style={{
          height: 400,
          width: '80%',
        }}
      />
    );
  }
}

export default GLUChart;

//设置时间范围未生效
//检测指标标准线暂时为写死
//
