import React from 'react';
import TableData from '../../../../common/data/TableData';

class ViewRate extends React.Component {
  render() {
    return (
      <div id="ViewRate">
        <TableData
          key="ViewRate"
          resid="619609481002"
          subtractH={240}
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
        />
      </div>
    );
  }
}
export default ViewRate;
