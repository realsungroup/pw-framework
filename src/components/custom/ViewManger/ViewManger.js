import React from 'react';
import './ViewManger.less';
import echarts from 'echarts';
import moment from 'moment';
import { Select, Button, message, DatePicker, Modal, Spin } from 'antd';
import WorkSheetDetail from '../WorkSheetDetail';
import http from 'Util20/api';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

const { Option } = Select;
const { RangePicker } = DatePicker;
class ViewManger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false
    };
  }

  async componentDidMount() {
    this.getSheetData();
  }
  //获取工作单
  getSheetData=async()=>{
    let junk=[];
    let qx=[];
    let done=[];
    let all=[];
    let ing=[];
    let junk2=[];
    let qx2=[];
    let done2=[];
    let all2=[];
    let ing2=[];
    let res;
    this.setState({loading:true});
    let myDate = new Date();
    let myMonth  = myDate.getMonth()+1;
    let myDay = myDate.getDate();
    console.log(myDay)
    if(Number(myMonth)<10){
      myMonth='0'+myMonth;
    }
    if(Number(myDay)<10){
      myMonth='0'+myDay;
    }
    let myYear = myDate.getFullYear();
    let str = myYear+'-'+myMonth+'-01'
    try {
      res = await http().getTable({
        resid: 678790254230,
        cmswhere:`REC_CRTTIME > '${str}' and C3_680644403785 = 'Y'`
      });
      //分类
      let n = 0;
      while(n<res.data.length){
        all2.push(res.data[n]);
        if(res.data[n].sheetStatus=='已作废'){
          junk2.push(res.data[n]);
        }else if(res.data[n].sheetStatus=='已取消'){
          qx2.push(res.data[n]);
        }else if(res.data[n].sheetStatus=='已完成'){
          done2.push(res.data[n]);
        }else if(res.data[n].sheetStatus=='进行中'){
        ing2.push(res.data[n]);
        };
        if(moment(res.data[n].REC_CRTTIME)>moment(myYear+'-'+myMonth+'-'+myDay)){
          all.push(res.data[n]);
          if(res.data[n].sheetStatus=='已作废'){
            junk.push(res.data[n]);
          }else if(res.data[n].sheetStatus=='已取消'){
            qx.push(res.data[n]);
          }else if(res.data[n].sheetStatus=='已完成'){
            done.push(res.data[n]);
          }else if(res.data[n].sheetStatus=='进行中'){
          ing.push(res.data[n]);
          }
        }
       
        n++;
      }
      let chartObj = {
        total: all.length,
        data: [
          { value: done.length, name: '已完成：' + done.length },
          { value: ing.length, name: '进行中：' + ing.length },
          { value: qx.length, name: '取消：' + qx.length },
          { value: junk.length, name: '作废：' + junk.length }
        ]
      };
      let chartObj2 = {
        all2:all2,
        done2:done2,
        junk2:junk2,
        qx2:qx2,
        ing2:ing2
      }
      this.instantiation(chartObj);
      this.instantiation2(chartObj2);
      this.setState({loading:false,total:res.data.length,junk,done});
    } catch (error) {
      message.error(error.message);
    this.setState({loading:false});
    }
  }
  //获取库存
  getStorageData=async()=>{

  }
 //实例化echarts
 instantiation = chartObj => {
  let myDate = new Date();
  myDate = moment(myDate).format('YYYY-MM-DD');
  let chartDom = document.getElementById('showBoard');
  let myChart = echarts.init(chartDom);
  let option;
  let total = 0;
  if (chartObj.total) {
    total = chartObj.total;
  }
  option = {
    title: {
      text: myDate + ' ' + total + '件',
      textStyle: {
        height: '32px'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '32px',
      left: 'left'
    },
    series: [
      {
        name: '工作单',
        top: '50%',
        type: 'pie',
        center: ['50%', '60%'],
        radius: ['30%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold',
            color: '#333333'
          }
        },
        labelLine: {
          show: false
        },
        data: chartObj.data,
        color: ['#13c2c2', '#faad14', '#8c8c8c', '#f5222d']
      }
    ]
  };
  option && myChart.setOption(option);
};

//实例化echarts
instantiation2 = chartObj => {
  console.log('chartObj2',chartObj)
  let myDate = new Date();
  let myMonth = myDate.getMonth()+1;
  let myDay = myDate.getDate();
  let chartDom = document.getElementById('showBoard2');
  let myChart = echarts.init(chartDom);
  let option;
  let total = 0;
  let date=[];
  let n = 1;
  let junk=[];
  let qx=[];
  let done=[];
  let all=[];
  let ing=[];
  while(n<(Number(myDay)+1)){
    date.push(n);
    junk.push(0);
    qx.push(0);
    done.push(0);
    all.push(0);
    ing.push(0);
    n++;
  }
  n=0;
  while(n<chartObj.all2.length){
    let num = chartObj.all2[n].REC_CRTTIME.substring(8,11);
    num = Number(num);
    let c = 0;
    while(c<Number(myDay)){
      if(num==(c+1)){
        all[c]=all[c]+1;
      }
      c++
    }
    n++;
  }
  n=0;
  while(n<chartObj.junk2.length){
    let num = chartObj.junk2[n].REC_CRTTIME.substring(8,11);
    num = Number(num);
    let c = 0;
    while(c<Number(myDay)){
      if(num==(c+1)){
        junk[c]=junk[c]+1;
      }
      c++
    }
    n++;
  }
  n=0;
  while(n<chartObj.qx2.length){
    let num =chartObj.qx2[n].REC_CRTTIME.substring(8,11);
    let c = 0;
    while(c<Number(myDay)){
      if(num==(c+1)){
        qx[c]=qx[c]+1;
      }
      c++
    }
    n++;
  }
  n=0;
  while(n<chartObj.done2.length){
    let num = chartObj.done2[n].REC_CRTTIME.substring(8,11);
    num = Number(num);
    let c = 0;
    while(c<Number(myDay)){
      if(num==(c+1)){
        done[c]=done[c]+1;
      }
      c++
    }
    n++;
  }
  n=0;
  while(n<chartObj.ing2.length){
    let num =chartObj.ing2[n].REC_CRTTIME.substring(8,11);
    num = Number(num);
    let c = 0;
    while(c<Number(myDay)){
      if(num==(c+1)){
        ing[c]=ing[c]+1;
      }
      c++
    }
    n++;
  }
  console.log('date',date)
  if (chartObj.total) {
    total = chartObj.total;
  }
  option = {
    title: {
      text: myMonth+'月工作单情况'
  },
  tooltip: {
      trigger: 'axis'
  },
  legend: {
      data: ['合计', '已完成', '进行中', '取消', '作废']
  },
  grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
  },
  toolbox: {
      feature: {
          saveAsImage: {}
      }
  },
  xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date
  },
  yAxis: {
      type: 'value'
  },
  series: [
      {
          name: '合计',
          type: 'line',
          stack: '总量',
          data: all,
          color: '#1890ff'},
      {
          name: '已完成',
          type: 'bar',
          stack: '总量',
          data: done,
          color:'#13c2c2'
      },
      {
          name: '进行中',
          type: 'bar',
          stack: '总量',
          data: ing,
         color:'#faad14'
      },
      {
          name: '取消',
          type: 'bar',
          stack: '总量',
          data: qx,color: '#8c8c8c'
      },
      {
          name: '作废',
          type: 'bar',
          stack: '总量',
          data: junk,color: '#f5222d'
      }
  ]
  };
  option && myChart.setOption(option);
};

  render() {
    return (
      <Spin spinning={this.state.loading}>

     <div className="wrap">
        <div className='left'>
          <div className='showBoard today'>
            <div className='title'>
            <h3>今日生产情况</h3>
            </div>
            <div className='board' id='showBoard'>
            </div>
          </div>
          <div className='showBoard curMon'>
          <div className='title '>
            <h3>当月生产情况</h3>
            </div>
            <div className='board' id='showBoard2'>
            </div>
          </div>
        </div>
        <div className='right'>
        <div className='showBoard '>
            <div className='title'>
              <h3>库存情况</h3>
              <div>
                <RangePicker
                  size='small'
                />
              </div>
            </div>
            <div className='board'>
            </div>
          </div>
        </div>
      </div>
      </Spin>


    );
  }
}

export default ViewManger;
