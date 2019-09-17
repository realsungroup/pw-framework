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
          hasAdd={true}
          hasRowView={false}
          hasRowDelete={true}
          hasRowEdit={false}
          hasDelete={true}
          hasModify={false}
          hasRowModify={true}
          hasRowSelection={true}
          actionBarWidth={100}
          hasBeBtns={true}
          dblinkname="ehr"
        />
      </div>
    );
  }
}

export default ManagerAttendanceApprovalAuth;
