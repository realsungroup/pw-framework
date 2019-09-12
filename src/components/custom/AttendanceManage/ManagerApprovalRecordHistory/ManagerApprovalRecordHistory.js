import React from 'react';
import './ManagerApprovalRecordHistory.less';
import TableData from '../../../common/data/TableData';

/*
 * 经理审批记录历史
 */

class ManagerApprovalRecordHistory extends React.Component {
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="invalid-application-form"
          resid="470689569411"
          subtractH={200}
          hasAdvSearch={false}
          hasAdd={false}
          hasRowView={false}
          hasRowDelete={true}
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

export default ManagerApprovalRecordHistory;
