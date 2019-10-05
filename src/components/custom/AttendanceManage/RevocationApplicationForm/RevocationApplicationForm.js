import React from 'react';
import './RevocationApplicationForm.less';
import TableData from '../../../common/data/TableData';

/*
 * 已撤销
 */

class RevocationApplicationForm extends React.Component {
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="revocation-application-form"
          resid="449599471726"
          subtractH={200}
          hasAdvSearch={false}
          hasAdd={false}
          hasRowView={true}
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

export default RevocationApplicationForm;
