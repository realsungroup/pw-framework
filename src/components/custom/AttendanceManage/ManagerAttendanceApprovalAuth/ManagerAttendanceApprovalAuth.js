import React from 'react';
import './ManagerAttendanceApprovalAuth.less';
import TableData from '../../../common/data/TableData';

/*
 * 考勤审批授权
 */

class ManagerAttendanceApprovalAuth extends React.Component {
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="invalid-application-form"
          resid="449582852659"
          subtractH={200}
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
        />
      </div>
    );
  }
}

export default ManagerAttendanceApprovalAuth;
