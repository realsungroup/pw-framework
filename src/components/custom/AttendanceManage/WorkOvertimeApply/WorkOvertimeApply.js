import React from 'react';
import './WorkOvertimeApply.less';
import TableData from '../../../common/data/TableData';

class WorkOvertimeApply extends React.Component {
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="work-overtime-apply"
          resid="489233670834"
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
          // dblinkname="ehr"
          // cparm1={this.props.selectYear.key}
        />
      </div>
    );
  }
}

export default WorkOvertimeApply;
