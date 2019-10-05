import React from 'react';
import './ManagerApprovalRecordHistory.less';
import TableData from '../../../common/data/TableData';

/*
 * 经理审批记录历史
 */

class ManagerApprovalRecordHistory extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
  }
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="invalid-application-form"
          resid="470689569411"
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
          baseURL={this.baseURL}
        />
      </div>
    );
  }
}

export default ManagerApprovalRecordHistory;
