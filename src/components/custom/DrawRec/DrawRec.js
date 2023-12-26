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
import './DrawRec.less';
import moment from 'moment';
const { Option } = Select;

/**
 * 我的就餐账户
 */
export default class DrawRec extends Component {
  constructor(props) {
    super(props);
    this.baseURL = window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadBaseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  state = {
    loading: false,
    visible: 0,
    depId: ''
  };
  componentDidMount() {
  }
  render() {
    return (
      <div className='myMealAccount'>


      </div>

    );
  }
}
