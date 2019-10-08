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

function getPreMonth(date) {
            var arr = date.split('-');
            var year = arr[0]; //获取当前日期的年份
            var month = arr[1]; //获取当前日期的月份
            var day = arr[2]; //获取当前日期的日
            var days = new Date(year, month, 0);
            days = days.getDate(); //获取当前日期中月的天数
            var year2 = year;
            var month2 = parseInt(month) - 1;
            if (month2 == 0) {
                year2 = parseInt(year2) - 1;
                month2 = 12;
            }
            var day2 = day;
            var days2 = new Date(year2, month2, 0);
            days2 = days2.getDate();
            if (day2 > days2) {
                day2 = days2;
            }
            if (month2 < 10) {
                month2 = '0' + month2;
            }
            var t2 = year2 + '-' + month2 + '-' + day2;
            return t2;
        }

 class CyberMoney extends  Component{
   constructor(props){
    super(props);
    this.state ={
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
     this.setState({timeScale:v});
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
     this.getMember();
   }
   // 623682682020
   // 623683986122
   getMemberDetail = async(str,id) =>{
     let res = await http().getTable({ resid: 623682682020,
       cmswhere:`REC_DATE > '${str}'`&&`personID=${id}`
     });
     var arr=this.state.teamData;
     try {
       this.setState({
         loading:false
       });
       if(res.data.length>0){
         var l=0;
         while(l<res.data.length){
           var n=0;
           var bol=false;
           if(arr.length==0){
             arr.push({
               name:res.data[l].person,
               status:res.data[l].turnover,
               personID:res.data[l].personID,
             });
             this.setState({teamScale:arr.teamData[n].status});

           }else{
             while(n<arr.length){
               if(res.data[l].personID==this.state.teamData[n].personID){
                 if(res.data[l].dealSymbol=='增加'){
                   arr.teamData[n].status+=res.data[l].turnover;
                   if(arr.teamData[n].status>this.state.teamScale){
                     this.setState({teamScale:arr.teamData[n].status});
                   }
                 }
                 bol=true;
               }
               if(bol==false){
                 arr.push({
                   name:res.data[l].person,
                   status:res.data[l].turnover,
                   personID:res.data[l].personID,
                 });
                 if(res.data[l].turnover>this.state.teamScale){
                   this.setState({teamScale:arr.teamData[n].status});
                 }
               }
               n++;
             }

           }

           l++;
         }

       }
       console.log('xiangq',arr)
     } catch (err) {
       this.setState({loading:false});

       Modal.error({
         title: '提示失败',
         content: err.message
       });
     }
   }
   getMember = async()=>{
     this.setState({loading:true});
     var myDate = new Date();
     var str=myDate;
     str = moment().format('YYYY-MM-DD HH:mm:ss')

     if(this.state.timeScale=='week'){
       str=fun_date(-7)+' 00:00:00'

     }else if(this.state.timeScale=='month'){
       str=str.substr(0,10);
       str=getPreMonth(str);
       str+=' 00:00:00'

     }else if(this.state.timeScale=='year'){
       str=fun_date(-365)+' 00:00:00'
     }

     let res = await http().getTable({ resid: 623683986122,cmswhere:`REC_DATE > '${str}'`});

     try {
       this.setState({
         loading:false
       });
       console.log('jichengbiajo',res);
       var n=0
       while(n<res.data.length){
         this.getMemberDetail(str,res.data[n].personID)
         n++;
       }
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

       console.log(res);
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
          {this.state.teamData.map((item, index) => {
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
