import React from 'react';
import './ManagerCurrentMonthRecord.less';
import TableData from '../../../common/data/TableData';

/*
 * 经理当月审批记录
 */

class ManagerCurrentMonthRecord extends React.Component {
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="invalid-application-form"
          resid="450383351695"
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

export default ManagerCurrentMonthRecord;
