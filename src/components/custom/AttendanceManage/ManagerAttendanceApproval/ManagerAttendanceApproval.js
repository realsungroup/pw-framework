import React from 'react';
import './ManagerAttendanceApproval.less';
import TableData from '../../../common/data/TableData';

/*
 * 经理考勤审批
 */

class ManagerAttendanceApproval extends React.Component {
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="invalid-application-form"
          resid="449442699960"
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

export default ManagerAttendanceApproval;
