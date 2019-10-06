import React from 'react';
import './InvalidApplicationForm.less';
import TableData from '../../../common/data/TableData';

/*
 * 已作废
 */

class InvalidApplicationForm extends React.Component {
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
          resid="449449507979"
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
          downloadBaseURL={this.attendanceDownloadURL}
        />
      </div>
    );
  }
}

export default InvalidApplicationForm;
