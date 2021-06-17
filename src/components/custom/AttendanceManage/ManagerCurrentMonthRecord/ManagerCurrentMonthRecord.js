import React from 'react';
import './ManagerCurrentMonthRecord.less';
import TableData from '../../../common/data/TableData';

/*
 * 经理当月审批记录
 */

class ManagerCurrentMonthRecord extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.attendanceDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="invalid-application-form"
          resid="450383351695"
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
          baseURL={this.baseURL}
          downloadBaseURL={this.attendanceDownloadURL}
          isUseBESize={true}
          hasBeSort={false}
          isWrap={true}
        />
      </div>
    );
  }
}

export default ManagerCurrentMonthRecord;
