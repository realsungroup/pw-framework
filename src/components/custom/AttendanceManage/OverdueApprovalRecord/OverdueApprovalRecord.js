import React from 'react';
import './OverdueApprovalRecord.less';
import TableData from '../../../common/data/TableData';

/*
 * 过期未审批记录
 */

class OverdueApprovalRecord extends React.Component {
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="invalid-application-form"
          resid="532606010925"
          subtractH={200}
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
        />
      </div>
    );
  }
}

export default OverdueApprovalRecord;
