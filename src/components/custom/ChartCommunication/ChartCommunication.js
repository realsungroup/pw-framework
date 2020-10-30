import React from 'react';
import './ChartCommunication.less';
import TableData from '../../common/data/TableData';
import { Tabs, Select, Menu, Button, Spin, Radio, DatePicker } from 'antd';
import http from 'Util20/api';
import moment from 'moment';
import html2canvas from 'html2canvas';
import echarts from 'echarts';

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const dataURIToBlob = (dataURI, fileName, callback) => {
  var binStr = atob(dataURI.split(',')[1]),
    len = binStr.length,
    arr = new Uint8Array(len);

  for (var i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }

  callback(new Blob([arr]), fileName + '.png');
};

const callback = function (blob, fileName) {
  var a = document.createElement('a');
  a.setAttribute('download', fileName);
  a.href = URL.createObjectURL(blob);
  a.click();
};
class ChartCommunication extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL = window.pwConfig[process.env.NODE_ENV].customURLs.onlineTrainning;
    this.state = {
      title: '',//报表标题名
      reportType: '月报',//报表种类
      season: 1,//当前选择的季度
      month: 1,//当前选择月份
      year: 2017,//当前选择年份
      yearGroup: [],//下拉可选年份
      total: 0,//总记录
      app: 0,//线上记录
      offline: 0,//线下记录
      tousu: 0,//投诉数量
      qiuzhu: 0,//求助/申诉数量
      jianyi: 0,//合理化建议数量
      loading: false,//是否在存储数据
      replyTousu: 0,//投诉合计时长
      replyQiuzhu: 0,//求助/申诉合计时长
      replyJianyi: 0,//建议合计时长
      maxTime: 0,//最大时长
      tousuCount: 0,//已处理投诉数量
      qiuzhuCount: 0,//已处理求助数量
      jianyiCount: 0,//已处理建议数量
      replyTousuAvg: 0,//投诉平均回复时长
      replyQiuzhuAvg: 0,//求助平均回复时长
      replyJianyiAvg: 0,//建议平均回复时长
      maxTimeAvg: 0,//平均回复时长里最大的那一个
      waitTousu: 0,//待处理投诉
      waitQiuzhu: 0,//待处理求助
      waitJianyi: 0,//待处理建议
      ingTousu: 0,//处理中投诉
      ingQiuzhu: 0,//处理中求助
      ingJianyi: 0,//处理中建议
      range: '-- -- 至 -- --',//报表显示的时间范围
      stTime:'',//开始日期
      edTime:'',//结束日期
    };
  }
  changeRepo = (v) => {
    this.setState({ reportType: v });
    if (v == '月报') {
      this.getData('month', this.state.month, this.state.year, this.state.season);
    } else if (v == '季报') {
      this.getData('season', this.state.month, this.state.year, this.state.season);
    } else if (v == '年报') {
      this.getData('year', this.state.month, this.state.year, this.state.season);
    }
  }
  getTime = () => {
    let myDate = new Date();
    let myMonth = myDate.getMonth() + 1;
    let myYear = myDate.getFullYear();
    let c = myYear
    let n = 0;
    let yearGroup = [];
    while (c > 2012) {
      yearGroup.push(c)
      c = c - 1;
      n++;
    }
    if (myMonth < 4) {
      this.setState({ season: 1 });
    } else if (myMonth < 7) {
      this.setState({ season: 2 });
    } else if (myMonth < 10) {
      this.setState({ season: 3 });
    } else {
      this.setState({ season: 4 });
    }
    this.setState({ month: myMonth, year: myYear, yearGroup });
    this.getData('month', myMonth, myYear);
  }
  componentDidMount() {
  }
  selectMonth = (v) => {
    this.setState({ month: v });
    this.getData('month', v, this.state.year);
  }
  selectYear = (v) => {
    this.setState({ year: v });
    if (this.state.reportType == '月报') {
      this.getData('month', this.state.month, v, this.state.season);
    } else if (this.state.reportType == '季报') {
      this.getData('season', this.state.month, v, this.state.season);
    } else if (this.state.reportType == '年报') {
      this.getData('year', this.state.month, v, this.state.season);
    }
  }
  selectSeason = (v) => {
    this.setState({ season: v });
    this.getData('season', this.state.month, this.state.year, v);
  }
  getData = async (stTime,edTime) => {
    console.log(stTime,edTime)
    this.setState({
      loading: true,//是否在获取数据
      total: 0,//总记录
      app: 0,//线上记录
      offline: 0,//线下记录
      tousu: 0,//投诉数量
      qiuzhu: 0,//求助/申诉数量
      jianyi: 0,//合理化建议数量
      replyTousu: 0,//投诉合计时长
      replyQiuzhu: 0,//求助/申诉合计时长
      replyJianyi: 0,//建议合计时长
      maxTime: 0,//最大时长
      tousuCount: 0,//已处理投诉数量
      qiuzhuCount: 0,//已处理求助数量
      jianyiCount: 0,//已处理建议数量
      replyTousuAvg: 0,//投诉平均回复时长
      replyQiuzhuAvg: 0,//求助平均回复时长
      replyJianyiAvg: 0,//建议平均回复时长
      maxTimeAvg: 0,//平均回复时长里最大的那一个
      waitTousu: 0,//待处理投诉
      waitQiuzhu: 0,//待处理求助
      waitJianyi: 0,//待处理建议
      ingTousu: 0,//处理中投诉
      ingQiuzhu: 0,//处理中求助
      ingJianyi: 0,//处理中建议
      complainTypeData: {}
    })

    let cms=`REC_CRTTIME > "${stTime}" and REC_CRTTIME < "${edTime}"`
    let str = '';
    str += stTime||'-- --';
    str += '至';
    str += edTime||'-- --'
    this.setState({ title: '员工沟通统计报告', range: str});

    // if (type == 'month') {
    //   if (mm) {
    //     let e = 0;
    //     if (mm == 2) {
    //       if (yy % 4 == 0 && yy % 100 != 0 || yy % 400 == 0) {
    //         e = 29;
    //       } else {
    //         e = 28;
    //       }
    //     } else if (mm == 1 || mm == 3 || mm == 5 || mm == 7 || mm == 8 || mm == 10 || mm == 12) {
    //       e = 31;
    //     } else {
    //       e = 30;
    //     }
    //     cms = `REC_CRTTIME > "${yy + '-' + mm + '-01'}" and REC_CRTTIME < "${yy + '-' + mm + '-' + e}"`;
    //     this.setState({ title: yy + '年' + mm + '月员工沟通统计报告', range: (yy + '年' + mm + '月1日 00:00:00 至 ' + (yy + '年' + mm + '月' + e + '日 23:59:59')) });
    //   }
    // } else if (type == 'season') {
    //   if (ss) {
    //     this.setState({ title: yy + '年第' + ss + '季度员工沟通统计报告' })
    //     if (ss == 1) {
    //       cms = `REC_CRTTIME > "${yy + '-' + '01-01'}" and REC_CRTTIME < "${yy + '-' + '03-31'}"`;
    //       this.setState({ range: yy + '年1月1日 00:00:00 至' + yy + '年3月31日 23:59:59' });
    //     } else if (ss == 2) {
    //       cms = `REC_CRTTIME > "${yy + '-' + '04-01'}" and REC_CRTTIME < "${yy + '-' + '06-30'}"`;
    //       this.setState({ range: yy + '年4月1日 00:00:00 至' + yy + '年6月30日 23:59:59' });
    //     } else if (ss == 3) {
    //       cms = `REC_CRTTIME > "${yy + '-' + '07-01'}" and REC_CRTTIME < "${yy + '-' + '09-30'}"`;
    //       this.setState({ range: yy + '年7月1日 00:00:00 至' + yy + '年9月30日 23:59:59' });
    //     } else if (ss == 4) {
    //       cms = `REC_CRTTIME > "${yy + '-' + '10-01'}" and REC_CRTTIME < "${yy + '-' + '12-31'}"`;
    //       this.setState({ range: yy + '年10月1日 00:00:00 至' + yy + '年12月31日 23:59:59' });
    //     }
    //   }
    // } else if (type == 'year') {
    //   if (yy) {
    //     cms = `REC_CRTTIME > "${yy + '-' + '01-01'}" and REC_CRTTIME < "${yy + '-' + '12-31'}"`;
    //     this.setState({ title: yy + '年员工沟通统计报告', range: yy + '年1月1日 00:00:00 至' + yy + '年12月31日 23:59:59' });
    //   }
    // }
    try {
      let res = await http({ baseURL: this.baseURL }).getTable({
        resid: '648050843809',
        cmswhere: cms,
        getcolumninfo: 1, // 需要这个参数为 1，才能获取到字段信息
      });

      let n = 0;
      let app = 0;
      let offline = 0;
      let tousu = 0;
      let qiuzhu = 0;
      let jianyi = 0;
      let tousuCount = 0;
      let replyTousu = 0;
      let qiuzhuCount = 0;
      let replyQiuzhu = 0;
      let jianyiCount = 0;
      let replyJianyi = 0;
      let waitTousu = 0;
      let waitQiuzhu = 0;
      let waitJianyi = 0;
      let ingTousu = 0;
      let ingQiuzhu = 0;
      let ingJianyi = 0;
      
      const complainTypeData = {};
      const adviceTypeData = {};
      res.cmscolumninfo.find((item) => item.id === 'typeComplaint').typeComplaint.DisplayOptions.filter(item => item).forEach((item) => {
        complainTypeData[item] = { brid:item,count: 0, pending: 0, processing: 0, processed: 0 }
      })
      res.cmscolumninfo.find((item) => item.id === 'typeAdvice').typeAdvice.DisplayOptions.filter(item => item).forEach((item) => {
        adviceTypeData[item] = { count: 0, pending: 0, processed: 0 }
      })

let tousuBrid=Object.keys(complainTypeData);
let jianyiBrid=Object.keys(adviceTypeData);
let bridC=0;
let psdTousu=[];
let psgTousu=[];
let pdgTousu=[];
let psdJianyi=[];
let psgJianyi=[];
let pdgJianyi=[];
while(bridC<tousuBrid.length){
psdTousu.push(0);
psgTousu.push(0);
pdgTousu.push(0);
bridC++;
}
bridC=0;
while(bridC<tousuBrid.length){
psdJianyi.push(0);
psgJianyi.push(0);
pdgJianyi.push(0);
bridC++;
}
      while (n < res.data.length) {
        const item = res.data[n]
        if (res.data[n].offline == 'Y') {
          offline = offline + 1;
        } else {
          app = app + 1;
        }
        if (res.data[n].type == '投诉') {
          tousu = tousu + 1;
          complainTypeData[item.typeComplaint].count++;
          if (res.data[n].HRReplyTime) {
            tousuCount = tousuCount + 1;
            bridC=0;
		while(bridC<tousuBrid.length){
			if(res.data[n].typeComplaint==tousuBrid[bridC]){
				psdTousu[bridC]=psdTousu[bridC]+1;
			}
			bridC++;
		}
            complainTypeData[item.typeComplaint].processed++;
            let t1 = res.data[n].HRReplyTime;
            let d1 = t1.replace(/\-/g, "/");
            let date1 = new Date(d1);
            let t2 = res.data[n].REC_CRTTIME;
            let d2 = t2.replace(/\-/g, "/");
            let date2 = new Date(d2);
            replyTousu = replyTousu + (parseInt(date1 - date2) / 1000);
          } else if (res.data[n].mailed == 'N') {
            waitTousu = waitTousu + 1;
            complainTypeData[item.typeComplaint].pending++;
		bridC=0;
		while(bridC<tousuBrid.length){
			if(res.data[n].typeComplaint==tousuBrid[bridC]){
				pdgTousu[bridC]=pdgTousu[bridC]+1;
			}
			bridC++;
		}
          } else {
            ingTousu = ingTousu + 1;
		bridC=0;
		while(bridC<tousuBrid.length){
			if(res.data[n].typeComplaint==tousuBrid[bridC]){
				psgTousu[bridC]=psgTousu[bridC]+1;
			}
			bridC++;
		}
            complainTypeData[item.typeComplaint].processing++;
          }
        } else if (res.data[n].type == '求助/申诉') {
          qiuzhu = qiuzhu + 1;
          if (res.data[n].HRReplyTime) {
            qiuzhuCount = qiuzhuCount + 1;
            let t1 = res.data[n].HRReplyTime;
            let d1 = t1.replace(/\-/g, "/");
            let date1 = new Date(d1);
            let t2 = res.data[n].REC_CRTTIME;
            let d2 = t2.replace(/\-/g, "/");
            let date2 = new Date(d2);
            replyQiuzhu = replyQiuzhu + (parseInt(date1 - date2) / 1000)
          } else if (res.data[n].mailed == 'N') {
            waitQiuzhu = waitQiuzhu + 1;
          } else {
            ingQiuzhu = ingQiuzhu + 1;
          }
        } else {
          jianyi = jianyi + 1;
          if (res.data[n].HRReplyTime) {
            jianyiCount = jianyiCount + 1;

		bridC=0;
		while(bridC<jianyiBrid.length){
			if(res.data[n].typeAdvice==jianyiBrid[bridC]){
				psdJianyi[bridC]=psdJianyi[bridC]+1;
			}
			bridC++;
		}

            let t1 = res.data[n].HRReplyTime;
            let d1 = t1.replace(/\-/g, "/");
            let date1 = new Date(d1);
            let t2 = res.data[n].REC_CRTTIME;
            let d2 = t2.replace(/\-/g, "/");
            let date2 = new Date(d2);
            replyJianyi = replyJianyi + (parseInt(date1 - date2) / 1000)
          } else if (res.data[n].mailed == 'N') {
            waitJianyi = waitJianyi + 1;
		bridC=0;
		while(bridC<jianyiBrid.length){
			if(res.data[n].typeAdvice==jianyiBrid[bridC]){
				pdgJianyi[bridC]=pdgJianyi[bridC]+1;
			}
			bridC++;
		}
          } else {
            ingJianyi = ingJianyi + 1;
		bridC=0;
		while(bridC<jianyiBrid.length){
			if(res.data[n].typeAdvice==jianyiBrid[bridC]){
				psgJianyi[bridC]=psgJianyi[bridC]+1;
			}
			bridC++;
		}
          }
        }
        n++;
      }
      let maxTime = 0;
      if (maxTime < replyJianyi) {
        maxTime = replyJianyi;
      }
      if (maxTime < replyQiuzhu) {
        maxTime = replyQiuzhu;
      }
      if (maxTime < replyTousu) {
        maxTime = replyTousu;
      }
      let maxTimeAvg = 0;
      let replyJianyiAvg = replyJianyi / (jianyiCount == 0 ? 1 : jianyiCount);
      let replyTousuAvg = replyTousu / (tousuCount == 0 ? 1 : tousuCount);
      let replyQiuzhuAvg = replyQiuzhu / (qiuzhuCount == 0 ? 1 : qiuzhuCount);
      if (maxTimeAvg < replyJianyiAvg) {
        maxTimeAvg = replyJianyiAvg;
      }
      if (maxTimeAvg < replyTousuAvg) {
        maxTimeAvg = replyTousuAvg;
      }
      if (maxTimeAvg < replyQiuzhuAvg) {
        maxTimeAvg = replyQiuzhuAvg;
      }
      this.setState({
        loading: false,
        total: res.data.length,
        app,
        offline,
        tousu,
        qiuzhu,
        jianyi,
        qiuzhuCount,
        jianyiCount,
        tousuCount,
        replyQiuzhu,
        replyJianyi,
        replyTousu,
        maxTime,
        replyJianyiAvg,
        replyQiuzhuAvg,
        replyTousuAvg,
        maxTimeAvg,
        waitJianyi,
        waitQiuzhu,
        waitTousu,
        ingJianyi,
        ingQiuzhu,
        ingTousu,
        complainTypeData
      })
	let myChart = echarts.init(document.getElementById('mycharts'));
	let myChart2 = echarts.init(document.getElementById('mycharts2'));
	let option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: ['未处理', '处理中', '已处理']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    yAxis: [
        {
            type: 'category',
            data: tousuBrid
        }
    ],
    xAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '未处理',
            type: 'bar',
            barWidth: 16,
            stack: 'default',
            data: pdgTousu,
label: {
                show: true,
                position: 'inside'
            },
        },
        {
            name: '处理中',
            type: 'bar',
            stack: 'default',
            data: psgTousu,
label: {
                show: true,
                position: 'inside'
            },
        },
        {
            name: '已处理',
            type: 'bar',
            stack: 'default',
            data: psdTousu,
label: {
                show: true,
                position: 'inside'
            },
        }
    ]
};
 let option2 = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: ['未处理', '处理中', '已处理']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    yAxis: [
        {
            type: 'category',
            data: jianyiBrid
        }
    ],
    xAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: '未处理',
            type: 'bar',
            barWidth: 16,
            stack: 'default2',
	label: {
                show: true,
                position: 'inside'
            },
            data: pdgJianyi
        },
        {
            name: '处理中',
            type: 'bar',
            stack: 'default2',
            data: psgJianyi,
label: {
                show: true,
                position: 'inside'
            },
        },
        {
            name: '已处理',
            type: 'bar',
            stack: 'default2',
            data: psdJianyi,
label: {
                show: true,
                position: 'inside'
            },
        }
    ]
};
 	myChart.setOption(option);
myChart2.setOption(option2);
	
    } catch (e) { console.log(e.message); this.setState({ loading: false }) }
  }
  componentWillMount() {
    // this.getTime();
  }
  // 导出图片的功能
  exportPNG = async () => {
    const { queryName } = this.state;
    // 下载图片
    this.refs.toPrint.classList.add('printMode');
    await function download(src, name) {
      if (!src) return;
      const a = document.createElement('a');
      a.setAttribute('download', this.state.title);
      a.href = src;
      a.click();
    }
    await html2canvas(document.querySelector('.toPrint')).then(
      canvas => {
        const imgDataURL = canvas.toDataURL('image/png', 1.0);
        dataURIToBlob(imgDataURL, this.state.title, callback);
      }
    );

    await this.refs.toPrint.classList.remove('printMode');
  };
  //改变日期
  changeDate=(v)=>{
    let stTime = moment(v[0]).format('YYYY-MM-DD HH:mm:ss');
    let edTime = moment(v[1]).format('YYYY-MM-DD HH:mm:ss');
    console.log(stTime,edTime,'111')
    this.getData(stTime,edTime)
  }
  render() {
    const { complainTypeData } = this.state
    return (
      <div className='wrap'>
        <Tabs defaultActiveKey="1">
          <TabPane tab="月报/季报/年报" key="1">
            <div className='innerWrap'>
              <div className='center'>
                <div className='ctr'>
                  {/* <div class='ctr-line'>
                    <div style={{ marginBottom: 8 }}>
                      <Radio.Group defaultValue="月报" buttonStyle="solid" onChange={(v) => this.changeRepo(v.target.value)}>
                        <Radio.Button value="月报" style={{ width: 68, textAlign: 'center' }}>月报</Radio.Button>
                        <Radio.Button value="季报" style={{ width: 68, textAlign: 'center' }}>季报</Radio.Button>
                        <Radio.Button value="年报" style={{ width: 68, textAlign: 'center' }}>年报</Radio.Button>
                      </Radio.Group>
                    </div>

                    <span>请选择年份：</span>
                    <Select defaultValue={this.state.year} style={{ width: 120 }} onChange={(v) => this.selectYear(v)}>
                      {this.state.yearGroup.map(v => {
                        return (
                          <Option index={v} value={v}>{v}</Option>
                        )
                      })}
                    </Select>
                  </div>
                  {this.state.reportType == '月报' ?
                    <div class='ctr-line'>
                      <span>请选择月份：</span>
                      <Select defaultValue={this.state.month} style={{ width: 120 }} onChange={(v) => this.selectMonth(v)}>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                        <Option value="6">6</Option>
                        <Option value="7">7</Option>
                        <Option value="8">8</Option>
                        <Option value="9">9</Option>
                        <Option value="10">10</Option>
                        <Option value="11">11</Option>
                        <Option value="12">12</Option>
                      </Select>
                    </div>
                    : null}
                  {this.state.reportType == '季报' ?
                    <div class='ctr-line'>
                      <span>请选择季度：</span>
                      <Select defaultValue={this.state.season} style={{ width: 120 }} onChange={(v) => this.selectSeason(v)}>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                      </Select>
                    </div>
                    : null} */}
                  <h3>选择时间段：</h3>
                  <div style={{margin:'1rem 0'}}>
                  <RangePicker allowClear={false} showTime onOk={(v)=>{this.changeDate(v)}}/>
                  </div>
                  <Button disabled={this.state.loading} onClick={() => this.exportPNG()}>导出PNG</Button>
                </div>

                <div ref='toPrint' className='toPrint'>
                  <h3 style={{ textAlign: 'center', fontSize: '16px' }}>{this.state.title}</h3>
                  <p style={{ fontSize: '14px' }}>公司：菲尼萨（无锡）</p>
                  <p style={{ fontSize: '14px' }}>统计时间段：{this.state.range}</p>
                  <Spin spinning={this.state.loading}>
                    <div>
                      <span>沟通次数：{this.state.total}次</span>
                      <i style={{ display: 'inline-block', width: '0.8rem', height: '0.8rem', marginTop: '0.1rem', verticalAlign: 'middle', marginLeft: '1.5rem', marginRight: '4px', background: '#1890ff' }}></i><span>APP：{this.state.app}次</span>
                      <i style={{ display: 'inline-block', width: '0.8rem', height: '0.8rem', marginTop: '0.1rem', verticalAlign: 'middle', marginLeft: '1.5rem', marginRight: '4px', background: '#f5222d' }}></i><span>线下：{this.state.offline}次</span>
                    </div>
                    <div style={{ marginTop: '0.5rem', width: 545, height: '0.8rem', overflow: 'hidden', background: this.state.total == 0 ? '#f5f5f5' : '#fff' }}>
                      <div style={{ float: 'left', height: '0.8rem', marginTop: '0.1rem', background: '#1890ff', width: (this.state.total == 0) ? 0 : (this.state.app / this.state.total * 100) + '%' }}></div>
                      <div style={{ float: 'left', height: '0.8rem', marginTop: '0.1rem', background: '#f5222d', width: (this.state.total == 0) ? 0 : (this.state.offline / this.state.total * 100) + '%' }}></div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <i style={{ display: 'inline-block', width: '0.8rem', height: '0.8rem', marginTop: '0.1rem', verticalAlign: 'middle', marginRight: '4px', background: '#F9531B' }}></i><span>投诉：{this.state.tousu}次</span>
                      <i style={{ display: 'inline-block', width: '0.8rem', height: '0.8rem', marginTop: '0.1rem', verticalAlign: 'middle', marginLeft: '1.5rem', marginRight: '4px', background: '#13C1C1' }}></i><span>求助/申诉：{this.state.qiuzhu}次</span>
                      <i style={{ display: 'inline-block', width: '0.8rem', height: '0.8rem', marginTop: '0.1rem', verticalAlign: 'middle', marginLeft: '1.5rem', marginRight: '4px', background: '#2F53EB' }}></i><span>合理化建议：{this.state.jianyi}次</span>
                    </div>
                    <div style={{ marginTop: '0.5rem', width: 545, height: '0.8rem', overflow: 'hidden', background: this.state.total == 0 ? '#f5f5f5' : '#fff' }}>
                      <div style={{ float: 'left', height: '0.8rem', marginTop: '0.1rem', background: '#F9531B', width: (this.state.total == 0) ? 0 : (this.state.tousu / this.state.total * 100) + '%' }}></div>
                      <div style={{ float: 'left', height: '0.8rem', marginTop: '0.1rem', background: '#13C1C1', width: (this.state.total == 0) ? 0 : (this.state.qiuzhu / this.state.total * 100) + '%' }}></div>
                      <div style={{ float: 'left', height: '0.8rem', marginTop: '0.1rem', background: '#2F53EB', width: (this.state.total == 0) ? 0 : (this.state.jianyi / this.state.total * 100) + '%' }}></div>
                    </div>
                    <div style={{ overflow: 'hidden', marginTop: "24px" }}>
                      <p style={{ fontWeight: 'bold' }}>回复时长：</p>
                      <p style={{ width: '88px', float: 'left' }}>投诉：</p><div style={{ float: 'left', width: 304, height: '0.8rem', marginTop: '0.1rem', background: this.state.replyTousu ? '#fff' : '#f5f5f5' }}><div style={{ transition: '.3s', height: '0.8rem', marginTop: '0.1rem', background: '#1890ff', width: this.state.maxTime == 0 ? 0 : (this.state.replyTousu / this.state.maxTime * 100 + '%') }}></div></div>
                      <p style={{ float: 'right' }}>{parseInt(this.state.replyTousu / 3600)}时{parseInt((this.state.replyTousu % 3600) / 60)}分{parseInt(this.state.replyTousu % 60)}秒</p>
                      <div style={{ clear: 'both' }}></div>
                      <p style={{ width: '88px', float: 'left' }}>求助/申诉：</p><div style={{ float: 'left', width: 304, height: '0.8rem', marginTop: '0.1rem', background: this.state.replyQiuzhu ? '#fff' : '#f5f5f5' }}><div style={{ transition: '.3s', height: '0.8rem', marginTop: '0.1rem', background: '#1890ff', width: this.state.maxTime == 0 ? 0 : (this.state.replyQiuzhu / this.state.maxTime * 100 + '%') }}></div></div>
                      <p style={{ float: 'right' }}>{parseInt(this.state.replyQiuzhu / 3600)}时{parseInt((this.state.replyQiuzhu % 3600) / 60)}分{parseInt(this.state.replyQiuzhu % 60)}秒</p>
                      <div style={{ clear: 'both' }}></div>
                      <p style={{ width: '88px', float: 'left' }}>合理化建议：</p><div style={{ float: 'left', width: 304, height: '0.8rem', marginTop: '0.1rem', background: this.state.replyJianyi ? '#fff' : '#f5f5f5' }}><div style={{ transition: '.3s', height: '0.8rem', marginTop: '0.1rem', background: '#1890ff', width: this.state.maxTime == 0 ? 0 : (this.state.replyJianyi / this.state.maxTime * 100 + '%') }}></div></div>
                      <p style={{ float: 'right' }}>{parseInt(this.state.replyJianyi / 3600)}时{parseInt((this.state.replyJianyi % 3600) / 60)}分{parseInt(this.state.replyJianyi % 60)}秒</p>
                      <div style={{ clear: 'both' }}></div>
                    </div>

                    <div style={{ overflow: 'hidden', marginTop: "24px" }}>
                      <p style={{ fontWeight: 'bold' }}>平均回复时长：</p>
                      <p style={{ width: '88px', float: 'left' }}>投诉：</p><div style={{ float: 'left', width: 304, height: '0.8rem', marginTop: '0.1rem', background: this.state.replyTousuAvg ? '#fff' : '#f5f5f5' }}><div style={{ transition: '.3s', height: '0.8rem', marginTop: '0.1rem', background: '#1890ff', width: this.state.maxTimeAvg == 0 ? 0 : (this.state.replyTousuAvg / this.state.maxTimeAvg * 100 + '%') }}></div></div>
                      <p style={{ float: 'right' }}>{parseInt(this.state.replyTousuAvg / 3600)}时{parseInt((this.state.replyTousuAvg % 3600) / 60)}分{parseInt(this.state.replyTousuAvg % 60)}秒</p>
                      <div style={{ clear: 'both' }}></div>
                      <p style={{ width: '88px', float: 'left' }}>求助/申诉：</p><div style={{ float: 'left', width: 304, height: '0.8rem', marginTop: '0.1rem', background: this.state.replyQiuzhuAvg ? '#fff' : '#f5f5f5' }}><div style={{ transition: '.3s', height: '0.8rem', marginTop: '0.1rem', background: '#1890ff', width: this.state.maxTimeAvg == 0 ? 0 : (this.state.replyQiuzhuAvg / this.state.maxTimeAvg * 100 + '%') }}></div></div>
                      <p style={{ float: 'right' }}>{parseInt(this.state.replyQiuzhuAvg / 3600)}时{parseInt((this.state.replyQiuzhuAvg % 3600) / 60)}分{parseInt(this.state.replyQiuzhuAvg % 60)}秒</p>
                      <div style={{ clear: 'both' }}></div>
                      <p style={{ width: '88px', float: 'left' }}>合理化建议：</p><div style={{ float: 'left', width: 304, height: '0.8rem', marginTop: '0.1rem', background: this.state.replyJianyiAvg ? '#fff' : '#f5f5f5' }}><div style={{ transition: '.3s', height: '0.8rem', marginTop: '0.1rem', background: '#1890ff', width: this.state.maxTimeAvg == 0 ? 0 : (this.state.replyJianyiAvg / this.state.maxTimeAvg * 100 + '%') }}></div></div>
                      <p style={{ float: 'right' }}>{parseInt(this.state.replyJianyiAvg / 3600)}时{parseInt((this.state.replyJianyiAvg % 3600) / 60)}分{parseInt(this.state.replyJianyiAvg % 60)}秒</p>
                      <div style={{ clear: 'both' }}></div>
                    </div>

                    <div style={{ overflow: 'hidden', marginTop: "24px" }}>
                      <p style={{ width: '88px', fontWeight: 'bold' }}>处理状态：</p>
                      <div style={{ marginTop: 16 }}>
                        <span>投诉：</span>
                        <i style={{ display: 'inline-block', width: '0.8rem', height: '0.8rem', marginTop: '0.1rem', verticalAlign: 'middle', marginRight: '4px', background: '#EB2F96' }}></i><span>未处理：{this.state.waitTousu}次</span>
                        <i style={{ display: 'inline-block', width: '0.8rem', height: '0.8rem', marginTop: '0.1rem', verticalAlign: 'middle', marginLeft: '1.5rem', marginRight: '4px', background: '#722ED1' }}></i><span>处理中：{this.state.ingTousu}次</span>
                        <i style={{ display: 'inline-block', width: '0.8rem', height: '0.8rem', marginTop: '0.1rem', verticalAlign: 'middle', marginLeft: '1.5rem', marginRight: '4px', background: '#52C41A' }}></i><span>已处理：{this.state.tousuCount}次</span>
                      </div>
                      <div style={{ width: 545, height: '0.8rem', marginTop: '0.5rem', overflow: 'hidden', background: this.state.tousu == 0 ? '#f5f5f5' : '#fff' }}>
                        <div style={{ float: 'left', height: '0.8rem', marginTop: '0.1rem', background: '#EB2F96', width: (this.state.tousu == 0) ? 0 : (this.state.waitTousu / this.state.tousu * 100) + '%' }}></div>
                        <div style={{ float: 'left', height: '0.8rem', marginTop: '0.1rem', background: '#722ED1', width: (this.state.tousu == 0) ? 0 : (this.state.ingTousu / this.state.tousu * 100) + '%' }}></div>
                        <div style={{ float: 'left', height: '0.8rem', marginTop: '0.1rem', background: '#52C41A', width: (this.state.tousu == 0) ? 0 : (this.state.tousuCount / this.state.tousu * 100) + '%' }}></div>
                      </div>

                      <div style={{ marginTop: '.5rem' }}>
                        <span>求助/申诉：</span>
                        <i style={{ display: 'inline-block', width: '0.8rem', height: '0.8rem', marginTop: '0.1rem', verticalAlign: 'middle', marginRight: '4px', background: '#EB2F96' }}></i><span>未处理：{this.state.waitQiuzhu}次</span>
                        <i style={{ display: 'inline-block', width: '0.8rem', height: '0.8rem', marginTop: '0.1rem', verticalAlign: 'middle', marginLeft: '1.5rem', marginRight: '4px', background: '#722ED1' }}></i><span>处理中：{this.state.ingQiuzhu}次</span>
                        <i style={{ display: 'inline-block', width: '0.8rem', height: '0.8rem', marginTop: '0.1rem', verticalAlign: 'middle', marginLeft: '1.5rem', marginRight: '4px', background: '#52C41A' }}></i><span>已处理：{this.state.qiuzhuCount}次</span>
                      </div>
                      <div style={{ marginTop: '.5rem', width: 545, height: '0.8rem', overflow: 'hidden', background: this.state.qiuzhu == 0 ? '#f5f5f5' : '#fff' }}>
                        <div style={{ float: 'left', height: '0.8rem', marginTop: '0.1rem', background: '#EB2F96', width: (this.state.qiuzhu == 0) ? 0 : (this.state.waitQiuzhu / this.state.qiuzhu * 100) + '%' }}></div>
                        <div style={{ float: 'left', height: '0.8rem', marginTop: '0.1rem', background: '#722ED1', width: (this.state.qiuzhu == 0) ? 0 : (this.state.ingQiuzhu / this.state.qiuzhu * 100) + '%' }}></div>
                        <div style={{ float: 'left', height: '0.8rem', marginTop: '0.1rem', background: '#52C41A', width: (this.state.qiuzhu == 0) ? 0 : (this.state.qiuzhuCount / this.state.qiuzhu * 100) + '%' }}></div>
                      </div>


                      <div style={{ marginTop: 16 }}>
                        <span>合理化建议：</span>
                        <i style={{ display: 'inline-block', width: '0.8rem', height: '0.8rem', marginTop: '0.1rem', verticalAlign: 'middle', marginRight: '4px', background: '#EB2F96' }}></i><span>未处理：{this.state.waitJianyi}次</span>
                        <i style={{ display: 'inline-block', width: '0.8rem', height: '0.8rem', marginTop: '0.1rem', verticalAlign: 'middle', marginLeft: '1.5rem', marginRight: '4px', background: '#722ED1' }}></i><span>处理中：{this.state.ingJianyi}次</span>
                        <i style={{ display: 'inline-block', width: '0.8rem', height: '0.8rem', marginTop: '0.1rem', verticalAlign: 'middle', marginLeft: '1.5rem', marginRight: '4px', background: '#52C41A' }}></i><span>已处理：{this.state.jianyiCount}次</span>
                      </div>
                      <div style={{ marginTop: 16, width: 545, height: '0.8rem', marginTop: '0.1rem', overflow: 'hidden', background: this.state.jianyi == 0 ? '#f5f5f5' : '#fff' }}>
                        <div style={{ float: 'left', height: '0.8rem', marginTop: '0.1rem', background: '#EB2F96', width: (this.state.jianyi == 0) ? 0 : (this.state.waitJianyi / this.state.jianyi * 100) + '%' }}></div>
                        <div style={{ float: 'left', height: '0.8rem', marginTop: '0.1rem', background: '#722ED1', width: (this.state.jianyi == 0) ? 0 : (this.state.ingJianyi / this.state.jianyi * 100) + '%' }}></div>
                        <div style={{ float: 'left', height: '0.8rem', marginTop: '0.1rem', background: '#52C41A', width: (this.state.jianyi == 0) ? 0 : (this.state.jianyiCount / this.state.jianyi * 100) + '%' }}></div>
                      </div>

                    </div>
                    <div style={{ overflow: 'hidden', marginTop: "24px" }}>
                      <p style={{fontWeight: 'bold' }}>投诉类型：</p>
			<div id='mycharts' style={{width:'571px',height:'264px'}}></div>
                    </div>
		    <div style={{ overflow: 'hidden', marginTop: "24px" }}>
                      <p style={{fontWeight: 'bold' }}>合理化建议类型：</p>
			<div id='mycharts2' style={{width:'571px',height:'264px'}}></div>
                    </div>
                  </Spin>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="自定义" key="2">
            <div className='innerWrap'>
              <TableData
                resid={648050843809}
                baseURL={this.baseURL}
                subtractH={220}
                tableComponent="ag-grid"
                sideBarAg={true}
                hasAdvSearch={true}
                hasAdd={true}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={true}
                hasModify={false}
                hasBeBtns={false}
                hasRowModify={false}
                hasRowSelection={false}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default ChartCommunication;
