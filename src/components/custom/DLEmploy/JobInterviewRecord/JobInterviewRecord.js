import React from 'react';
import './JobInterviewRecord.less';
import TableData from '../../../common/data/TableData';
import { Icon, LocaleProvider, Button, message } from 'antd';
class JobInterviewRecord extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.dlEmployBaseURL;
    this.dlEmployDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.dlEmployDownloadURL;
  }
  state = {
    SquareCardArr: [],
    val: null
  };
  render() {
    return (
      <TableData
        baseURL = {this.baseURL}
        resid={617311643033}
        subtractH={520}
        hasBeBtns={true}
        hasRowSelection={false}
        hasAdd={true}
        hasRowView={false}
        hasModify={false}
        hasRowDelete={true}
        hasDelete={false}
        hasRowModify={true}
        height="100%"
        downloadBaseURL = {this.dlEmployDownloadURL}
      >
      </TableData>
    );
  }
}

export default JobInterviewRecord;
