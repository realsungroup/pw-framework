import React from 'react';
import TableData from 'Common/data/TableData';
import './ShowDataChart.less';
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
import { getTableData, getMainTableData } from '../../../util/api';
import moment from 'moment';
import echarts from 'echarts';

/**
 * 常见数据录入
 */
const colors = ['#5793f3', '#d14a61', '#675bba'];

const resid1 = 640186569410; // 血压检测表
const resid2 = 640190825057; // 血糖检测表
const resid3 = 640190883264; // 体温检测表
class ShowDataChart extends React.Component {
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
      recordTime:[]

    };
  }

  componentWillMount = () => {
    console.log('props', this.props);
    this.getTableData();
  };
  async componentDidMount() {
    this._echarts = echarts.init(document.getElementById('dataChart'));
    this._echarts.setOption({
      color: colors,
      title: {
        text: '血压'
      },
      legend: { data: [
        // '舒张压','收缩压'
      ] },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data:[
        ]
      },
      yAxis: {
        splitLine: {
          show: false
        }
      },
      dataZoom: [
        {
          // startValue: '2020-01-01'
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
    });
  }

  handleChartData = () => {};

  //获取数据
  getTableData = async () => {
    let res;
    if (this.props.selectKey == 1) {
      try {
        res = await getMainTableData(resid1, {
          getcolumninfo: 1
        });
        this.setState({ res: res });
        console.log(res);
      } catch (err) {
        return message.error(err.message);
      }
    } else if (this.props.selectKey == 2) {
      try {
        res = await getMainTableData(resid2, {
          getcolumninfo: 1
        });
      } catch (err) {
        return message.error(err.message);
      }
    } else if (this.props.selectKey == 3) {
      try {
        res = await getMainTableData(resid3, {
          getcolumninfo: 1
        });
      } catch (err) {
        return message.error(err.message);
      }
    }
    let source = [];
    let recordTime = []; //记录日期数据
     this.state.res.data.map(item => {
      if (item.recordTime != '') {
        let record = moment(item.recordTime).format('YYYY-MM-DD HH:mm:ss');
        recordTime.push(record) ;
      }
    });
    let legendData = []; //echart legend数据
    let legendId = []; //echart legend数据
    this.state.res.cmscolumninfo.forEach(item => {
      if (item[item.id].ColResDataSort === '测量数据' && item.text) {
        // console.log("item.text",item.text)
        // return item.text
        legendData.push(item.text);
        legendId.push(item.id);
      }
    });
    let seriesData = [[],[]];
    this.state.res.data.map(item =>{
      if(item.SBP !== null){
        seriesData[1].push(item.SBP)
      }
      if(item.DBP !== null){
        seriesData[0].push(item.DBP)
      }
    })
    source.push(recordTime,legendData,this.props.beginDate.format('YYYY-MM-DD'),)
    console.log(this.props.beginDate.format('YYYY-MM-DD'));
    console.log(source);
    this._echarts.setOption({
      dataset: {
        dimensions:[
        ],
        source: [
          recordTime,
        ]
      },
      legend: { data:legendData },
      xAxis:{
        type: 'category',
        data:recordTime
      },
      dataZoom: [
        {
          // startValue: this.props.beginDate.format("YYYY-MM-DD"),
          // endValue:this.props.endDate.format("YYYY-MM-DD")
        },
        {
          type: 'inside',
        }
      ],
      series:[
        {
          name: legendData[0],
          type: 'line',
          data: seriesData[1],
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 90
              },
              {
                yAxis: 140
              }
            ]
          }
        },
        {
          name: legendData[1],
          type: 'line',
          data: seriesData[0],
          markLine: {
            silent: true,
            data: [
              {
                yAxis: 60
              },
              {
                yAxis: 90
              }
            ]
          }
        },
      ]
    });
    this.handleChartData();
  };

  render() {
    return (
      <div
        id="dataChart"
        style={{
          height: 400,
          width: '80%'
        }}
      ></div>
    );
  }
}

export default ShowDataChart;



//设置时间范围未生效
//检测指标标准线暂时为写死
//