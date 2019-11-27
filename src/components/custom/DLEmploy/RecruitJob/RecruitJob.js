import React from 'react';
import './RecruitJob.less';
import TableData from '../../../common/data/TableData';
class RecruitJob extends React.Component {
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
        resid={617195632278}
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
        downloadBaseURL = {this.dlEmployDownloadURL}
      ></TableData>
    );
  }
}

export default RecruitJob;
