import React, { Component } from 'react';
import { Radio, Button, Icon, Input, Spin, Modal,Tooltip } from 'antd';
import './IDPTrack.less';
import moment from 'moment';
import ReportForm2 from '../StatisticalReportForms/ReportForm2';
import echarts from 'echarts';
import http from '../../../util20/api';
const backColor=[
  '#FFC800',
  '#FF8316',
  '#FF3F69',
  '#6B36C9',
  '#02B3DA',
  '#00B779'
]
class IDPTrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRepo:false,
      dataCourse:[{}],
      loading:false,
      visible:false,
      name:'???',
      data:[{
         year:'??????',
         abi:['暂无数据'],
         status:['暂无数据'],
         score:'暂无数据',
         color:'#FFC800'
      }]
    };
  }
  componentDidMount() {
    var id;
    if(this.props.id){
      id=this.props.id;
      console.log('团队',this.props.id)
    }else{
      id=localStorage.getItem('userInfo')
      id=JSON.parse(id);
      id=id.UserInfo.EMP_USERCODE;
      console.log('个人',id);
    }
    this.setState({personID:id});
   this.getData(id);
  
  }
  getData = async(id) =>{
    this.setState({loading:true});
    let res;
    var score;
    try{
     let res2 = await http().getTable({
       resid: 420130498195,
       cmswhere: `C3_420148203323 = '${id}'`
     });
     console.log(res2)
     var n2=0;
     var arr2=[];
     var data2=res2.data;
     while(n2<data2.length){
       var bol2=false;
         var c2=0;
         while(c2<arr2.length){
           if(data2[n2].REC_YEAR==arr2[c2].year){
             bol2=true;
             arr2[c2].abi.push(data2[n2].C3_431106931302);
             arr2[c2].status.push(data2[n2].C3_431102475269);
           }
           c2++;
         }
         if(bol2==false){
           arr2.push({year:data2[n2].REC_YEAR,abi:[data2[n2].C3_431106931302],status:[data2[n2].C3_431102475269]});
         }
         n2++;
     }
     score=arr2;
    }catch(e){
      this.setState({loading:false});

     console.log(e);
    }
    console.log(score);
  //  var score=this.getScore(id);
    try{
      res = await http().getTable({
        resid: 628284415377,
        cmswhere: `personID = '${id}'`
      });
      
      this.setState({name:res.data[0].personName})
      var data=res.data;
      var arr=[];
      var year=[];
      var n=0;
      // 构建数组
      while(n<data.length){
        var bol=false;
        var c=0;
        while(c<year.length){
          if(data[n].finicialYear==year[c].year){
            bol=true;
            year[c].abi.push(data[n].competency);
            year[c].status.push(data[n].status);
          }
          c++;
        }
        if(bol==false){
          year.push({year:data[n].finicialYear,abi:[data[n].competency],status:[data[n].status]});
        }
        n++;
      }
      n=0;
     
     while(n<score.length){
      var str='FY'+score[n].year;
      c=0;
       while(c<year.length){
         
         if(year[c].year==str){
           var x=0;
           var str2='';
           
           while(x<score[n].abi.length){
            str2+=score[n].abi[x]+score[n].status[x]+' '
             x++;
           }
           year[c].score=str2;
         }
        c++;
       }
       n++;
     }
      this.setState({data:year});
     
       this.renderColor();
    }catch(e){
      this.setState({loading:false});

      console.log(e);
    }
  }
 getScore=async(id)=>{
   var score;
   try{
    let res2 = await http().getTable({
      resid: 420130498195,
      cmswhere: `C3_420148203323 = '${id}'`
    });
    var n=0;
    var arr=[];
    var data=res2.data;
    while(n<data.length){
      var bol=false;
        var c=0;
        while(c<arr.length){
          if(data[n].REC_YEAR==arr[c].year){
            bol=true;
            arr[c].abi.push(data[n].C3_431106931302);
            arr[c].status.push(data[n].C3_431102475269);
          }
          c++;
        }
        if(bol==false){
          arr.push({year:data[n].REC_YEAR,abi:[data[n].C3_431106931302],status:[data[n].C3_431102475269]});
        }
        n++;
    }
    score = arr;
    this.setState({score:arr})
   }
   catch(e){
    console.log(e);

    score =false;
   }
   return score
 }
  showChart=(item)=>{
    this.setState({visible:true});
    // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('chart'));
        var arr=[];
    if(item.abi.length>0){
      var indi=[];
      var n=0;
      while(n<item.abi.length){
        indi.push({name:item.abi[n],max:2.8});
        n++;
      }
      arr=[];
      n=0;
      while(n<item.status.length){
        if(item.status[n]=='不擅长'){
          arr.push(1)
        }else if(item.status[n]=='不擅长'){
          arr.push(2)
        }else{
          arr.push(3)

        }
        n++;
      }
      // 没有三个指标的场合配置条形图
 // 有三个以上指标的场合配置雷达图
        var option={};
          option = {
            title: {
                text: item.year+'年能力指标统计图'
            },
            toolbox: {
                show : true,
                right:32,
                feature : {
                    mark : {show: true},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            tooltip: {},
            legend: {
                data: ['能力值'],
                left:0,
                top:32,
            },
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#1890ff',
                        borderRadius: 3,
                        padding: [8, 8]
                   }
                },
                indicator: indi
            },
            series: [{
                name: '能力值',
                type: 'radar',
                color:'#1890ff',
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data : [
                    {
                        value : arr,
                        name : '能力值'
                    }
                ]
            }]
        };
        }
        
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
  }
  renderColor=()=>{
    var n=0;
    var c=0;
    var obj=this.state.data;
    while(n<this.state.data.length){
      obj[n].color=backColor[c];
      c++;
      if(c==6){
        c=0;
      }
      n++;
    }
    this.setState({data:obj,loading:false});
  }
  renderCourse=async(item)=>{
    this.setState({loading:true});

    var year=item.year;
    // 财年C3_613941384328
    var id = this.state.personID;
      //人员 C3_613941384832

      //已完成 C3_626260901454
    try{
      let res = await http().getTable({
        resid: 613940032707,
        cmswhere: `C3_613941384328 = '${year}' and C3_613941384832 = '${id}' and C3_626260901454 = 'Y'`
      });
      this.setState({loading:false,showCourse:true});

      var data=[[]];
      var n=0;
      var arr=[];
      while(n<res.data.length){
        arr.push(res.data[n].REC_MONTH,res.data[n].C3_613941385843,res.data[n].C3_613941384592)
        n++;
      }
      data[0].push(arr)
      // 渲染图表
      console.log(data)
      var myChart = echarts.init(document.getElementById('chart2'));
      var option = {
        backgroundColor:'#ffffff',
        title: {
            text: year+'财年课程培训图示'
        },
        xAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            scale: true
        },
        series: [{
            name: year,
            data: data[0],
            type: 'scatter',
            symbolSize: function (data) {
                return data[1];
            },
            label: {
                emphasis: {
                    show: true,
                    formatter: function (param) {
                        return ( param.data[2] +"\n"+'课时：'+param.data[1] );
                    },
                    position: 'top'
                }
            },
            itemStyle: {
                normal: {
                    color: '#1890ff'
                }
            }
        }]
    };



      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      console.log(res)
    }catch(e){
      console.log(e);
    }
  }
  renderBar=()=>{
     var n = this.state.data.length;
     n=n/6;
     n=Math.ceil(n);
     var dom=[];
     var c=0;
     while(c<n){
       dom.push(<bar></bar>)
       c++;
     }
  
  return(<div className='barGroup'>{dom.map(item=>(item))}</div>)

  }
  render() {
    return (
      <div className="wrap">
         <Spin style={{width:'100%',height:'100%',position:'fixed'}} spinning={this.state.loading}>
         <div className='repo_track' style={this.state.showRepo?{left:0}:{left:'100vw'}}>
        <div className='clz_track' onClick={()=>{this.setState({showRepo:false})}}>
          <Icon type="right" style={{lineHeight:'100vh',color:'#fff',width:'24px'}}/>
        </div>
        <div style={{width:'calc(100% - 24px)',float:'left'}}>
        <ReportForm2 chara='individual'/>
        </div>
      </div>
      <div style={this.state.showCourse?{transform:'scaleY(1)',top:'0vh'}:{transform:'scaleY(0)',top:'-50vh'}}  className='courseWrap pop'>
      <div className='popClz' onClick={()=>this.setState({showCourse:false})}>
       </div>
       <div id='chart2' className={this.state.showCourse?'show':null}>
       </div>
      </div>
      

       <div style={this.state.visible?{transform:'scaleY(1)',top:'0vh'}:{transform:'scaleY(0)',top:'-50vh'}} className='pop'>
      <div className='popClz' onClick={()=>this.setState({visible:false})}>
       </div>

       <div id='chart' className={this.state.visible?'show':null}>
       </div>
       </div>
       <div style={{zIndex:'10',right:'0',position:'fixed',width:'24px',height:'100vh',background:'#13c2c2',boxShadow:'0px 0px 8px #006d75'}}>
      </div>
       <header>
  <h3>{this.state.name}的个人能力发展轨迹</h3>
        <h4 onClick={()=>{this.setState({showRepo:true})}}><Icon type="left" /> 历年培训统计</h4>
       </header>
       <content>
      
       
        <div>
        
        {this.renderBar()}
        {this.state.data.map((item,key) => (
               <div>
               <Tooltip placement="top" title={'点击查看统计图'}>
                <h4 onClick={()=>{this.showChart(item)}} style={{background:item.color}}>{item.year.substring(2,6)}</h4>
                </Tooltip>
                <div >
                <div className='ovalLine' onClick={()=>{this.renderCourse(item)}}>
                 <oval style={{background:item.color}} ></oval>
                 <a style={{color:item.color}}>查看课程</a>
                 </div>
                 <p style={{fontSize:'1rem',fontWeight:'bold'}}>能力提升：</p>
                 <div className='cardWrap' style={{clear:'both'}}>
                 {item.abi.map(abi=>(
                  <span>{abi}</span>
                ))}
                 </div>
                
                </div>
                <div className='score'>
                  <p>{item.score}</p>
                </div>
               </div>
              ))}
        </div>
        
       </content>
       <footer>
       </footer>
       </Spin>
      </div>
    );
  }
}

export default IDPTrack;
