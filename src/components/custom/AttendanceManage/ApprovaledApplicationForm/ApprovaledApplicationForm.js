import React from 'react';
import './ApprovaledApplicationForm.less';
import TableData from '../../../common/data/TableData';

/*
 * 已审批
 */

class ApprovaledApplicationForm extends React.Component {
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="approvaled-application-form"
          resid="449449427225"
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

export default ApprovaledApplicationForm;
