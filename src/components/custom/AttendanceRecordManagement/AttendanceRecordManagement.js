import React, { Component } from 'react';
import { Button, Tabs, Row, Col, Input, message, Spin } from 'antd';
import './AttendanceRecordManagement.less';
import AttendenceHead from './AttendenceHead';
import AttendenceTable from './AttendenceTable';
import moment from 'moment';

const baseURLAPI = window.pwConfig[process.env.NODE_ENV].customURLs.hikBaseURL;

class AttendanceRecordManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValues: {
        date: [moment().startOf('day'), moment().endOf('day')],
        controller: '',
        entranceArea: '',
        entrancePoint: [],
        eventType: '全部',
        org: '',
        personNum: '',
        pic: '全部',
        userName: ''
      }, //搜索条件合集
      eventData: [], //出入记录
      loading: false
    };
  }

  componentDidMount = () => {};

  /**
   * 根据条件获取进出记录
   */
  getDoorEvents = () => {
    this.setState({
      loading: true
    });
    const {
      controller,
      date,
      entranceArea,
      entrancePoint,
      eventType,
      org,
      personNum,
      pic,
      userName
    } = this.state.searchValues;
    //对搜索条件进行处理
    let eventTypeReal = [];
    if (eventType !== '全部') {
      eventTypeReal = eventType;
    }
    let picReal = [];
    if (pic !== '全部') {
      picReal = pic;
    }
    moment.fn.toJSON = function() {
      return this.format();
    };
    const startTime = date[0].toJSON(); //事件开始时间，ISOS格式
    const endTime = date[1].toJSON(); //事件结束时间，ISOS格式
    const receiveEndTime = date[1].add(1, 'd').toJSON(); //数据入库结束时间，ISOS格式
    const doorName = entrancePoint.length >= 1 ? entrancePoint[0] : '';
    const readerDevIndexCodes =
      entrancePoint.length >= 1 ? [entrancePoint[1]] : [];

    const url = `${baseURLAPI}api/v1/queryDoorEvents`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pageNo: 1,
        pageSize: 1000,
        doorIndexCodes: [],
        doorName: doorName,
        readerDevIndexCodes: readerDevIndexCodes,
        startTime: startTime,
        endTime: endTime,
        receiveStartTime: startTime,
        receiveEndTime: receiveEndTime,
        doorRegionIndexCodes: entranceArea === '' ? [] : [entranceArea],
        eventTypes: eventTypeReal,
        personName: userName,
        sort: '',
        order: ''
      })
    })
      .then(response => response.json())
      .then(json => {
        if (json.data.list.length === 0) {
          message.info('无相关记录');
        } else {
          this.setState({
            eventData: json.data.list
          });
          message.success('查询成功');
        }
        console.log(json);
      });
    this.setState({
      loading: false
    });
  };

  /**
   * 获取搜索条件合集并查询进出记录，子组件调用
   * @param {Array} allValues 表单中所有的数据，表示搜索条件
   * @returns void
   */
  getSearchValues = allValues => {
    this.setState({
      searchValues: allValues
    });
  };

  render() {
    const { loading } = this.state;
    return (
      <div
        className="page"
        style={{ width: '100vw', height: '100vh', background: '#fff' }}
      >
        <Spin spinning={loading}>
          <AttendenceHead
            getSearchValues={this.getSearchValues}
            getDoorEvents={this.getDoorEvents}
          />
          <AttendenceTable eventData={this.state.eventData} />
        </Spin>
      </div>
    );
  }
}

export default AttendanceRecordManagement;
