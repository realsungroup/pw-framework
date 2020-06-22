import React from 'react';
import TableData from '../../../../common/data/TableData';

class TargetSelfAppraise extends React.Component {
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
    const { type } = this.props;
    let resid = '462553161418',
      key = 'MiddleTargetSelfAppraise';
    if (type === '年末') {
      resid = '462583603607';
      key = 'EndTargetSelfAppraise';
    }
    return (
      <div id="target-self-appraise">
        {this.props.children}
        <div className="table-data-wrapper">
          <TableData
            key={key}
            resid={resid}
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
            dblinkname="ehr"
            cparm1={this.props.selectYear.key}
            baseURL={this.baseURL}
            downloadBaseURL={this.attendanceDownloadURL}
            isSetColumnWidth={false}
            isWrap={true}
          />
        </div>
      </div>
    );
  }
}
export default TargetSelfAppraise;
