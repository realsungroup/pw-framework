import React from 'react';
import './JobPeopleList.less';
import TableData from '../../../common/data/TableData';
import {Card,Button,Select} from 'antd';


const { Option } = Select;
// const { RangePicker } = DatePicker;
class JobPeopleList extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.dlEmployBaseURL;
    this.dlEmployDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.dlEmployDownloadURL;
  }
  state = {
    SquareCardArr: [],
    val: null,
    selectedRecentPeriod: 'all', //下拉选项的值
    searchPeriod: ['', ''], //搜索时间段
  };
    
  render() {
    return (
      <TableData
        baseURL = {this.baseURL}
        resid={618666208275}
        subtractH={220}
        hasBeBtns={false}
        hasRowSelection={false}
        hasAdd={true}
        hasRowView={false}
        hasModify={false}
        hasRowDelete={true}
        hasDelete={false}
        hasRowModify={true}
        height="100%"
        actionBarWidth ={100}
        downloadBaseURL={this.dlEmployDownloadURL}
        columnsWidth={{
          '面试时间':180,
          '姓名':90,
          '年龄':90,
          '申请职位':115,
          '申请时间':130,
          '考试结果':115,
          '面试结果':115,
          '状态':90,
          '签到':90,
          '开始面试操作':180,
          '结束面试':115,
          '考试批次':130,
          '面试通知发送':160,
          '劳务公司':115,
          '面试官':115,
          '面试官账号':130,
          '体检结果':115,
          '发送体检通知':160,
          '发送报到通知':160,
          '是否入职':115,
          '是否离职':115,
          '预约已过期':130,
          '开始考试时间':180,
          '身份证号':200,
          '考试分数':115,
          '结束考试时间':180
        }}
      ></TableData>
    );
  }
}

export default JobPeopleList;
