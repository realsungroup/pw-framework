import React from 'react';
import './OverdueApprovalRecord.less';
import TableData from '../../../common/data/TableData';

/*
 * 过期未审批记录
 */

class OverdueApprovalRecord extends React.Component {
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
          resid="532606010925"
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
          downloadBaseURL={this.attendanceDownloadURL}
          dblinkname="ehr"
          baseURL={this.baseURL}
          // isSetColumnWidth={false}
          noWidthFields='C3_447031495725'
        />
      </div>
    );
  }
}

export default OverdueApprovalRecord;
