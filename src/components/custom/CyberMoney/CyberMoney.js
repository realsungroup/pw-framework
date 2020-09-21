import React, { Component } from 'react';
import { Radio, Button, Icon, Input, Spin, Modal,Empty } from 'antd';

import './CyberMoney.less';
import moment from 'moment';
import http from '../../../util20/api';
function compare(total){
  return function(a,b){
      var value1 = a[total];
      var value2 = b[total];
      return value2 - value1;
  }
}
Date.prototype.getWeek = function (dowOffset) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
      var nYear;
      var nday;

      dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero
      var newYear = new Date(this.getFullYear(),0,1);
      var day = newYear.getDay() - dowOffset; //the day of week the year begins on
      day = (day >= 0 ? day : day + 7);
      var daynum = Math.floor((this.getTime() - newYear.getTime() - 
      (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
      var weeknum;
      //if the year starts before the middle of a week
      if(day < 4) {
          weeknum = Math.floor((daynum+day-1)/7) + 1;
          if(weeknum > 52) {
              nYear = new Date(this.getFullYear() + 1,0,1);
              nday = nYear.getDay() - dowOffset;
              nday = nday >= 0 ? nday : nday + 7;
              /*if the next year starts before the middle of
                the week, it is week #1 of that year*/
              weeknum = nday < 4 ? 1 : 53;
          }
      }
      else {
          weeknum = Math.floor((daynum+day-1)/7);
      }
      return weeknum;
  };
class CyberMoney extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tFin: [],
      tFinal: [],
      loading: false,
      timeScale: 'year',
      shopStatus: false,
      userName: '',
      yesterdayVar: '10',
      total: '',
      teamScale: 0,
      teamData: [],
      history: [
        {
          time: '2018-01-15 16:00',
          total: '105',
          case: '参加内训课程',
          varAbsolute: '5',
          dealSymbol: '+'
        },
        {
          time: '2018-01-14 16:00',
          total: '105',
          case: '参加内训课程',
          varAbsolute: '5',
          dealSymbol: '+'
        },
        {
          time: '2018-01-13 16:00',
          total: '105',
          case: '参加内训课程',
          varAbsolute: '5',
          dealSymbol: '+'
        }
      ]
    };
  }
  switchTime = v => {
    this.setState({ timeScale: v, tFin: [] });
    this.getMember(v);
  };
  enterShop = () => {
    if (this.state.shopStatus == true) {
    }
  };
  // 计程表
  // 623682682020
  componentDidMount() {
   this.getRecent()
    // 获取人员编号
    
  }
  getRecent = async() =>{
    var currentID=localStorage.getItem('userInfo');
    currentID=JSON.parse(currentID);
    currentID=currentID.UserInfo.EMP_USERCODE;
    this.setState({currentID:currentID});
      this.getMember('year',currentID);
      this.getHistory(currentID);
  }
  // 渲染下属
  renderFollower=(arr)=>{
    var n=0;
    var tFin=[];
    var obj={};
    var teamScale=0;
      while(n<arr.length){
        obj={name:arr[n].person,status:arr[n].total};
        if(arr[n].total>teamScale){
          teamScale=arr[n].total;
        }
        tFin.push(obj);
        n++;
      }
      tFin=tFin.sort(compare('status'));
      console.log(tFin)
    this.setState({
      loading: false,
      toSearch: 0,
      tFin:tFin,
      teamScale:teamScale
    });
  }
  // 没有记录的时候查询下属
  getFollower = async (currentID)=>{
    var tFin=[];
    var obj={};
    try {
      let res = await http().getTable({
        resid:623683986122,
        cmswhere:`directorNum='${currentID}'`
      });

      var n=0;
      while(n<res.data.length){
        obj={name:res.data[n].person,status:0};
        tFin.push(obj)
        n++;
      }
      this.setState({
        loading: false,
        toSearch: 0,
        tFin:tFin,
        teamScale:1
      });
      console.log('res',res)
    } catch (error) {
      console.log(error)
    }
  } 

  getMember = async (time,id) => {
    this.setState({ loading: true });
    var currentID=this.state.currentID;
    var str = '';
    var myDate = new Date();
    // str = moment().format('YYYY-MM-DD HH:mm:ss');
    var monthId='627146126123';
    var weekId='627146164354';
    var yearId='627146204474';
    var residTo;
    if (time == 'week') {
      residTo = weekId;
      myDate=myDate.getWeek(myDate);
      console.log('week',myDate)
        try {
            let res2 = await http().getTable({
              resid:residTo,
              cmswhere:`C3_623681435599='${currentID}' and rec_week = '${myDate}'`,
            });
            if(res2.data){
              this.renderFollower(res2.data);
            }else{
              this.getFollower(currentID);
            }
          console.log('res2',res2)
          // this.getMemberDetail(str, res.data[this.state.toSearch].personID);
        } catch (err) {
          this.setState({ loading: false });

          Modal.error({
            title: '提示失败',
            content: err.message
          });
        }
    } else if (time == 'month') {
      residTo = monthId;
      myDate = myDate.getMonth()+1;
        try {
          let res2 = await http().getTable({
            resid:residTo,
            cmswhere:`C3_623681435599='${currentID}' and rec_month = '${myDate}'`,
            
          });

          if(res2.data){
            this.renderFollower(res2.data);
          }else{
            this.getFollower(currentID);
          }
       
        console.log('res2',res2)
        // this.getMemberDetail(str, res.data[this.state.toSearch].personID);
      } catch (err) {
        this.setState({ loading: false });

        Modal.error({
          title: '提示失败',
          content: err.message
        });
      }
    } else if (time == 'year') {
      residTo = yearId;
      myDate = myDate.getFullYear();
      if(id){
        currentID=id
      }
        try {
          let res2 = await http().getTable({
            resid:residTo,
            cmswhere:`C3_623681435599='${currentID}' and rec_year = '${myDate}'`,
            
          });
          if(res2.data){
            this.renderFollower(res2.data);
          }else{
            this.getFollower(currentID);
          }

        // this.getMemberDetail(str, res.data[this.state.toSearch].personID);
      } catch (err) {
        this.setState({ loading: false });

        Modal.error({
          title: '提示失败',
          content: err.message
        });
      }
    }
    

     
  };
  getHistory = async (personNum) => {
    this.setState({ loading: true });
    let res = await http().getTable({ resid: 623068847241 ,cmswhere: `personID = '${personNum}'`});
    try {
      var arr = [];
      var n = 0;
      while (n < res.data.length) {
        arr.push({
          time: res.data[n].dealTime || '未能获取到时间',
          varAbsolute: res.data[n].turnover || '',
          total: res.data[n].NowBalance || '???',
          case: res.data[n].dealName || '未能获取到交易记录',
          dealSymbol: res.data[n].dealSymbol == '增加' ? '+' : '',
          person:res.data[n].person
        });
        n++;
      }
      if(res.data.length>0){
          this.setState({ loading: false, history: arr ,yesterdayVar:res.data[0].turnover,total:Number(res.data[0].beforeBalance)+Number(res.data[0].turnover),symbol:res.data[0].dealSymbol});
      }
    
    } catch (err) {
      this.setState({ loading: false });

      Modal.error({
        title: '提示失败',
        content: err.message
      });
    }
  };
  render() {
    return (
      <div className="bg">
        <Spin spinning={this.state.loading}>
          <div className="CyberMoney">
            <div className="user">
              <div className="avatar"></div>
              <p>{this.state.history[0].person}</p>
              <span>最近{this.state.history[0].dealSymbol=='+'?'增加':'减少'} {Math.abs( Number(this.state.history[0].varAbsolute))}</span>
              <oval>
                <p>{this.state.history[0].total}</p>
              </oval>
            </div>
            <div
              className={
                this.state.shopStatus == true ? 'shop' : 'shop_cls shop'
              }
              onClick={this.enterShop}
            >
              <rect></rect>
              <p>
                {this.state.shopStatus == true
                  ? '点击进入积分商城'
                  : '积分商城暂未开放'}
              </p>
            </div>
            <Modal
          title="积分规则"
          visible={this.state.showModal}
          width="400px"
          footer={null}
          onOk={() => {
            this.setState({
              showModal:false
            });
          }}
          onCancel={() => {
            this.setState({
              showModal:false
            });
          }}
          centered
          destroyOnClose
        >
            <div className='bonusRule'>
              <span>· 完成考试：</span><br/>
              及格：+5积分<br/>
              及格至89分：+10积分<br/>
              90分至94分：+15积分<br/>
              95分以上：+20积分<br/>
              <b>注：同一科目存在复数次考试的场合，这一科目的前三次考试成绩中的最高成绩将会被系统当作积分计算的依据。</b>
              <hr/>
              <span>· 提交有效问卷：</span>+5积分<hr/>

              <span>· 问卷中的开放式回答被采纳：</span>+10积分<hr/>

              <span>· 完成内训：</span>+5积分<hr/>

              <span>· 完成外训/外聘内训：</span>+10积分<hr/>

              <span>· 给上过的课程点赞：</span>+5积分<br/>
              <b>注：同一员工只有每月前三次点赞才能增加自己的积分，之后不论点赞多少次积分都不会增加。</b><br/>
              <hr/>

              <span>· 内部讲师开课：</span>+10积分<hr/>

              <span>· 内部讲师收到点赞：</span>+1积分<hr/>

              <span>· 此外，参加项目也能增加积分。具体数值需要hr部门进行审核。</span>
            </div>
        </Modal>
            <div className="history">
              <h4>我的积分记录<span className='viewRule' onClick={()=>this.setState({showModal:true})}><Icon style={{marginRight:'8px'}}type="question-circle" />查看规则</span></h4>
              <ul>
                {this.state.history.map((item, index) => {
                  return (
                    <li>
                      <p>{item.time}</p>
                      <p>{item.case}</p>
                      <p>
                        {item.dealSymbol}
                        {item.varAbsolute}
                      </p>
                      <div className="clearfix"></div>
                      <oval>
                        <p>{item.total}</p>
                      </oval>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="team">
              <div>
                <h4>年度团队成长记录</h4>
                <button
                  className={this.state.timeScale == 'year' ? 'current' : ''}
                  onClick={() => {
                    this.switchTime('year');
                  }}
                >
                  年
                </button>
                <button
                  className={this.state.timeScale == 'month' ? 'current' : ''}
                  onClick={() => {
                    this.switchTime('month');
                  }}
                >
                  月
                </button>
                <button
                  className={this.state.timeScale == 'week' ? 'current' : ''}
                  onClick={() => {
                    this.switchTime('week');
                  }}
                >
                  周
                </button>
              </div>
              <ul>

                {this.state.tFin.length>0?this.state.tFin.map((item, index) => {
                  return (
                    <li>
                      <span>
                        <b>{item.name?item.name:'- - -'}</b> {item.status?item.status:0}
                      </span>
                      <bar>
                        <filter
                          style={{
                            width:
                              (item.status / this.state.teamScale) * 100 + '%'
                          }}
                        ></filter>
                      </bar>
                    </li>
                  );
                }):<Empty style={{marginTop:'32px'}}/>}
              </ul>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

export default CyberMoney;
