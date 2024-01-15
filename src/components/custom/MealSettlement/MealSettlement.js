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
import http from 'Util20/api';
import './MealSettlement.less';
import moment from 'moment';
const { Option } = Select;

/**
 * 我的就餐账户
 */
export default class MealSettlement extends Component {
  constructor(props) {
    super(props);
    this.baseURL = window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadBaseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  state = {
    loading: false,
    visible: 0,
    data: {
      numberId: '',
      accountPrechargeDelta: '',
      accountPerkDelta: '',
      accountLMDelta: '',
      accountTMADelta: '',
      dealNumber: ''
    }
  };
  componentDidMount() {
  }

  render() {
    return (
      <div className='myMealAccount'>
        账户结算

      </div>

    );
  }
}
