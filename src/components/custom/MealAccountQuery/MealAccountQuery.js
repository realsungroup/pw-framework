import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import {
  Modal,
  Button,
  message,
  Input,
  Row,
  Col,
  Radio,
  Checkbox,
  DatePicker,
  Select,
  Spin, Tabs
} from 'antd';
import Base64 from 'base-64';
import http from 'Util20/api';
import './MealAccountQuery.less';
import MyMealAccount from '../MyMealAccount';
import moment from 'moment';
const { Option } = Select;
const socket = require('socket.io-client')('http://localhost:5000');

/**
 * 一线员工就餐账户查询
 */
export default class MealAccountQuery extends Component {
  constructor(props) {
    super(props);
    this.baseURL = window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadBaseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  state = {
    numberId: ''
  };
  componentDidMount() {
    socket.emit('startRead');
    let card;
    socket.on('card message', async msg => {
      var result = Base64.decode(msg);
      card = eval('(' + result + ')');

      if (card) {
        //根据卡号去查员工工号
        let res;
        try {
          res = await http().getTable({
            resid: 588780106830,
            cmswhere: `C3_301064188869 = '${card.cardno}'`
          });
          if (res.data.length > 0) {
            message.success('查询成功！');
            await this.setState({
              numberId: res.data[0].C3_301572426126
            });
          } else {
            message.error('查无此人！');
          }
        } catch (error) { }
      }
    });
  }

  render() {
    return (
      <div className='MealAccountQuery'>
        <div className={this.state.numberId ? 'MealAccountQuery_menu' : 'MealAccountQuery_hint'}>
          {this.state.numberId ? <Button type='danger' onClick={() => { this.setState({ numberId: '' }) }}>结束查询</Button> : '请刷卡'}
        </div>
        {
          !this.state.numberId ? null : <MyMealAccount
            accountId={764854197590}
            drawId={756315340787}
            accountChangeId={764854332358}
            rechargeId={756315947049}
            dealId={756578142064}
            numberId={this.state.numberId}
            isQuery={true} />
        }
      </div>

    );
  }
}
