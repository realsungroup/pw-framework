import React, { Component } from 'react';
import { Radio, Button, Icon, Input, Spin, Modal } from 'antd';
import './CyberMoney.less';
import moment from 'moment';
import http from '../../../util20/api';
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
   
    this.getMember('year');
  }
  getMember = async time => {
    this.setState({ loading: true });
    var str = '';
    var myDate = new Date();
    // str = moment().format('YYYY-MM-DD HH:mm:ss');
    var monthId='627146126123';
    var weekId='627146164354';
    var yearId='627146204474';
    var residTo;
    if (time == 'week') {
      residTo = weekId;
      myDate=myDate.getWeeksNum

    } else if (time == 'month') {
      residTo = monthId;


    } else if (time == 'year') {
      residTo = yearId;

    }
    var person='';
    try {
      let res = await http().getTable({
        resid: '623683986122',
      });
      console.log('res',res)
      var personNum
      if(res.data.length>0){
        personNum=res.data[0].personID;
        this.setState({team:res.data[0].person})
        this.getHistory(personNum);
      }
    
      try {
        let res2 = await http().getTable({
          resid:residTo,
          data:[{
            rec_year:personNum,
            C3_623681435599:personNum,
          }]
        });

      this.setState({
        loading: false,
        toSearch: 0,
      });
      console.log('res',res)
      // this.getMemberDetail(str, res.data[this.state.toSearch].personID);
    } catch (err) {
      this.setState({ loading: false });

      Modal.error({
        title: '提示失败',
        content: err.message
      });
    }
    
  } catch (err) {
    this.setState({ loading: false });

    Modal.error({
      title: '提示失败',
      content: err.message
    });
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
          dealSymbol: res.data[n].dealSymbol == '增加' ? '+' : ''
        });
        n++;
      }
      this.setState({ loading: false, history: arr ,yesterdayVar:res.data[0].turnover,total:Number(res.data[0].beforeBalance)+Number(res.data[0].turnover),symbol:res.data[0].dealSymbol});

      console.log('人员',res)
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
              <p>{this.state.team}</p>
              <span>最近{this.state.symbol} {Math.abs( Number(this.state.yesterdayVar))}</span>
              <oval>
                <p>{this.state.total}</p>
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
            <div className="history">
              <h4>我的积分记录</h4>
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
                <h4>团队成长记录</h4>
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
                {this.state.tFin.map((item, index) => {
                  return (
                    <li>
                      <span>
                        <b>{item.name}</b> {item.status}
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
