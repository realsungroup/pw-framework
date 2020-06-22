import React from 'react';
import './ManagerAttendanceApprovalAuth.less';
import TableData from '../../../common/data/TableData';

/*
 * 考勤审批授权
 */

class ManagerAttendanceApprovalAuth extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.attendanceDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="invalid-application-form"
          resid="449582852659"
          subtractH={200}
          hasAdvSearch={false}
          hasAdd={true}
          hasRowView={true}
          hasRowDelete={true}
          hasRowEdit={false}
          hasDelete={true}
          hasModify={false}
          hasRowModify={true}
          hasRowSelection={true}
          actionBarWidth={100}
          hasBeBtns={true}
          dblinkname="ehr"
          baseURL={this.baseURL}
          downloadBaseURL={this.attendanceDownloadURL}
          isSetColumnWidth={false}
        />
      </div>
    );
  }
}

export default ManagerAttendanceApprovalAuth;
