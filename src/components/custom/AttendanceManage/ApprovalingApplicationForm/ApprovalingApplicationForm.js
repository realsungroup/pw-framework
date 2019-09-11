import React from 'react';
import './ApprovalingApplicationForm.less';
import TableData from '../../../common/data/TableData';

/*
 * 审批中
 */
class ApprovalingApplicationForm extends React.Component {
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="approvaling-application-form"
          resid="544795775918"
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

export default ApprovalingApplicationForm;
