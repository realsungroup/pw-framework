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
        downloadBaseURL={this.dlEmployDownloadURL}

      ></TableData>
    );
  }
}

export default JobPeopleList;
