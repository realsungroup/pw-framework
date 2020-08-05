import React from 'react';
import TableData from '../../../../common/data/TableData';

class TargetHistory extends React.Component {
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
      <div id="target-target">
        {this.props.children}
        <div className="table-data-wrapper">
          <TableData
            key="target-history"
            resid="462586715318"
            size="small"
            subtractH={180}
            hasAdvSearch={false}
            hasAdd={false}
            hasRowView={false}
            hasRowDelete={false}
            hasRowEdit={false}
            hasDelete={false}
            hasModify={false}
            hasRowModify={false}
            hasRowSelection={true}
            actionBarWidth={100}
            dblinkname="ehr"
            // height={440}
            cparm1={this.props.selectYear.key}
            baseURL={this.baseURL}
            downloadBaseURL={this.attendanceDownloadURL}
            // isSetColumnWidth={false}
            isWrap={true}
          />
        </div>
      </div>
    );
  }
}
export default TargetHistory;
