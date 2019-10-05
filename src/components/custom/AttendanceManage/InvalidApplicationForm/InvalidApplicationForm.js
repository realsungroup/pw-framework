import React from 'react';
import './InvalidApplicationForm.less';
import TableData from '../../../common/data/TableData';

/*
 * 已作废
 */

class InvalidApplicationForm extends React.Component {
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
        />
      </div>
    );
  }
}

export default InvalidApplicationForm;
