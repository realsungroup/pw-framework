import React, { Component } from 'react';
import { Radio, Button, Icon, Input, Spin, Modal,Tooltip } from 'antd';
import './IDPTrack.less';
import moment from 'moment';
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
   this.getData(id);
  
  }
  getData = async(id) =>{
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
 // 指定图表的配置项和数据
        var option = {
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
    this.setState({data:obj});
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
       <div style={this.state.visible?{transform:'scaleY(1)',top:'0vh'}:{transform:'scaleY(0)',top:'-50vh'}} className='pop'>
      <div className='popClz' onClick={()=>this.setState({visible:false})}>
       </div>

       <div id='chart' className={this.state.visible?'show':null}>
       </div>
       </div>
       <header>
  <h3>{this.state.name}的个人能力发展轨迹</h3>
         {/* <Icon type="bars"  style={{fontSize:'4vh',float:'right',marginRight:'3.89vw',lineHeight:'11vh',color:'#fff',cursor:'pointer'}}/> */}
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
                 <oval style={{background:item.color}} onClick={()=>{this.showChart(item)}}></oval>
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
      </div>
    );
  }
}

export default IDPTrack;
