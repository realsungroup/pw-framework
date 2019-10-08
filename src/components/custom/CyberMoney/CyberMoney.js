import React, { Component } from 'react';
import {Radio, Button,Icon,Input,Spin,Modal} from 'antd';
import './CyberMoney.less';
import moment from 'moment'
import http from '../../../util20/api';
function fun_date(num) {
    var date1 = new Date();
    //今天时间
    var time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate()
    var date2 = new Date(date1);
     date2.setDate(date1.getDate() + num);
     //num是正数表示之后的时间，num负数表示之前的时间，0表示今天
     var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
    return time2;
    }
    function unique(arr){
            for(var i=0; i<arr.length; i++){
                for(var j=i+1; j<arr.length; j++){
                    if(arr[i].personID==arr[j].personID){         //第一个等同于第二个，splice方法删除第二个
                        arr.splice(j,1);
                        j--;
                    }
                }
            }
    return arr;
    }

 class CyberMoney extends  Component{
   constructor(props){
    super(props);
    this.state ={
      tFin:[],
      tFinal:[],
      loading:false,
      timeScale:'year',
      shopStatus:false,
      userName:'',
      yesterdayVar:'10',
      total:'',
      teamScale:0,
      teamData:[],
      history:[
        {
          time:'2018-01-15 16:00',
          total:'105',
          case:'参加内训课程',
          varAbsolute:'5',
          dealSymbol:'+'
        },
        {
          time:'2018-01-14 16:00',
          total:'105',
          case:'参加内训课程',
          varAbsolute:'5',
          dealSymbol:'+'

        },
        {
          time:'2018-01-13 16:00',
          total:'105',
          case:'参加内训课程',
          varAbsolute:'5',
          dealSymbol:'+'

        }
      ]
    };
   }
   switchTime=(v)=>{
     this.setState({timeScale:v,tFin:[]});
     this.getMember(v);
   }
   enterShop=()=>{
     if(this.state.shopStatus==true){

     }
   }
   // 计程表
   // 623682682020
   componentDidMount(){
     this.getUserData();
     this.getHistory();
     this.getMember('year');
   }
   // 623682682020
   // 623683986122
   getMemberDetail = async(str,id) =>{
     this.setState({teamData:[],teamScale:0});

     let res = await http().getTable({ resid: 623682682020,
       cmswhere:`REC_DATE > '${str}'`&&`personID=${id}`
     });
     var arr=this.state.teamData;
     // res获取的是人员信息详情
     try {
       this.setState({
         loading:true
       });
       // 如果有人员详情数据
       if(res.data.length>0){
         var l=0;
         // 当计数器小于数据长度时
         while(l<res.data.length){
           var n=0;
           var bol=false;
           // 第一次直接将结果推进数组
           if(arr.length==0){

             arr.push({
               name:res.data[l].person,
               status:res.data[l].turnover,
               personID:res.data[l].personID,
             });


           }else{
             // 第二次开始如果计数器2小于数组长度
             while(n<arr.length){
               // 如果计数1的人员id=计数2的人员id
               if(res.data[l].personID==this.state.teamData[n].personID){

                 if(res.data[l].dealSymbol=='增加'){
                   arr[n].status= Number(arr[n].status)+Number(res.data[l].turnover);

                 }
                 bol=true;
               }
               if(bol==false){
                 arr.push({
                   name:res.data[l].person,
                   status:res.data[l].turnover,
                   personID:res.data[l].personID,
                 });

               }
               n++;
             }

           }

           l++;
         }
       }
       // this.setState({teamData:arr})
       // 去重
       var comp=unique(this.state.teamData);

      var t=this.state.tFinal;
      t.push(comp[0])
        this.setState({teamData:comp,tFinal:t});
     } catch (err) {
       this.setState({loading:false});
       Modal.error({
         title: '提示失败2',
         content: err.message
       });
     }
     if(this.state.toSearch<this.state.team.data.length-1){
       // console.log(this.state.toSearch,this.state.team.data)
       var num=(this.state.toSearch)+1;
       this.setState({toSearch:num})

       this.getMemberDetail(str,this.state.team.data[this.state.toSearch].personID);
     }else{

       var nn=0;
       var array=this.state.tFinal
       while(nn<array.length){
         if(!array[nn]){
           array.splice(nn,1);
           nn--;
         }
         nn++;
       }
       nn=0;
       while(nn<array.length){
         if(!array[nn].name){
           array[nn].name=array[nn].personID
         }
         if(!array[nn].status){
           array[nn].status=0;
         }
         if(nn==0){
           this.setState({teamScale:array[nn].status})
         }else{
           if(array[nn].status>this.state.teamScale){
             this.setState({teamScale:array[nn].status})
           }
         }
         nn++;
       }
       // 排序
       array.sort(function(a,b){
     	return  b.status - a.status;
     })
     array=unique(array);

       this.setState({tFin:array,loading:false})
     }
   }
   getMember = async(time)=>{
     this.setState({loading:true});
     var str='';
       var myDate = new Date();
       str=myDate;
       str = moment().format('YYYY-MM-DD HH:mm:ss')

       if(time=='week'){
         str=str.substr(0,10);

         str=fun_date(-7)+' 00:00:00'

       }else if(time=='month'){
         str=str.substr(0,10);

         str=fun_date(-30)+' 00:00:00'
       }else if(time=='year'){
         str=str.substr(0,10);

         str=fun_date(-365)+' 00:00:00'
       }


     console.log(str)
     let res = await http().getTable({ resid: 623683986122,cmswhere:`REC_DATE > '${str}'`});

     try {
       this.setState({
         loading:false,
         toSearch:0,
         team:res,
       });

         this.getMemberDetail(str,res.data[this.state.toSearch].personID);

     } catch (err) {
       this.setState({loading:false});

       Modal.error({
         title: '提示失败',
         content: err.message
       });
     }
   }
   getUserData = async() =>{
     this.setState({loading:true});
     let res = await http().getTable({ resid: 623068568237});
     try {
       this.setState({
         loading:false,
         userName:res.data[0].person,
         total:res.data[0].accountBalance||0
       });
       console.log(res)
     } catch (err) {
       this.setState({loading:false});

       Modal.error({
         title: '提示失败',
         content: err.message
       });
     }
   }
   getHistory = async()=>{
     this.setState({loading:true});
     let res = await http().getTable({ resid: 623068847241});
     try {

       var arr=[];
       var n=0;
       while (n<res.data.length){
         arr.push({
           time:res.data[n].dealTime||'未能获取到时间',
           varAbsolute:res.data[n].turnover||'',
           total:res.data[n].NowBalance||'???',
           case:res.data[n].dealName||'未能获取到交易记录',
           dealSymbol:res.data[n].dealSymbol=='增加'?'+':'-'
         })
         n++;
       }
       this.setState({loading:false,history:arr});

     } catch (err) {
       this.setState({loading:false});

       Modal.error({
         title: '提示失败',
         content: err.message
       });
     }
   }
   render(){
     return (
       <div className='bg'>
       <Spin spinning={this.state.loading}>
       <div className="CyberMoney">
 				<div className='user'>
          <div className='avatar'></div>
 					<p>{this.state.userName}</p>
 					<span>昨日增加 {this.state.yesterdayVar}</span>
 					<oval>
 						<p>{this.state.total}</p>
 					</oval>
 				</div>
 				<div className={this.state.shopStatus==true?'shop':'shop_cls shop'} onClick={this.enterShop}>
 					<rect></rect>
 					<p>{this.state.shopStatus==true?'点击进入积分商城':'积分商城暂未开放'}</p>
 				</div>
 				<div className='history'>
 					<h4>我的积分记录</h4>
 					<ul>
          {this.state.history.map((item, index) => {
             return   <li>
  							<p>{item.time}</p>
  							<p>{item.case}</p>
  							<p>{item.dealSymbol}{item.varAbsolute}</p>
  							<div className='clearfix'></div>
  							<oval>
  								<p>{item.total}</p>
  							</oval>
  						</li>
           })}


 					</ul>
 				</div>
 				<div className='team'>
          <div>
            <h4>团队成长记录</h4>
            <button className={this.state.timeScale=='year'?'current':''} onClick={()=>{this.switchTime('year')}}>年</button>
            <button className={this.state.timeScale=='month'?'current':''} onClick={()=>{this.switchTime('month')}}>月</button>
            <button className={this.state.timeScale=='week'?'current':''} onClick={()=>{this.switchTime('week')}}>周</button>

          </div>
          <ul>
          {this.state.tFin.map((item, index) => {
             return   <li><span><b>{item.name}</b> {item.status}</span><bar><filter style={{width:(item.status/this.state.teamScale*100)+'%'}}></filter></bar>
               </li>
           })}

          </ul>
        </div>

 			</div>
      </Spin>
      </div>
     );
   }
 }


 export default CyberMoney;
