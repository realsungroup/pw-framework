import React from 'react';
import TableData from '../../../../common/data/TableData';

class ViewTarget extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[
        process.env.NODE_ENV
      ].customURLs.comprehensiveQueryBaseURL;
    this.attendanceDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  render() {
    return (
      <div id="view-target">
        {this.props.children}
        <div className="table-data-wrapper">
          <TableData
            key="view-target"
            resid="462622744495"
            size="small"
            subtractH={180}
            hasAdvSearch={false}
            hasAdd={false}
            hasRowView={true}
            hasRowDelete={false}
            hasRowEdit={false}
            hasDelete={false}
            hasModify={false}
            hasRowModify={false}
            hasRowSelection={true}
            actionBarWidth={100}
            noWidthFields='C3_420297898057'
            dblinkname="ehr"
            cparm1={this.props.selectYear.key}
            baseURL={this.baseURL}
            downloadBaseURL={this.attendanceDownloadURL}
            isWrap={true}
          />
        </div>
      </div>
    );
  }
}
export default ViewTarget;
