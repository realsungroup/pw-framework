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
        hasRowView={true}
        hasModify={false}
        hasRowDelete={true}
        hasDelete={false}
        hasRowModify={true}
        height="100%"
        actionBarWidth ={300}
        downloadBaseURL={this.dlEmployDownloadURL}
        columnsWidth={{
          '面试时间':180,
          '姓名':90,
          '年龄':90,
          '申请职位':130,
          '申请时间':130,
          '考试结果':130,
          '面试结果':130,
          '签到':90,
          '面试官反馈':150,
          '面试官':115,
          '体检结果':130,
          '劳务公司名称':160,
          '身份证号':200,
          '考试分数':115,
        }}
      ></TableData>
    );
  }
}

export default JobPeopleList;
