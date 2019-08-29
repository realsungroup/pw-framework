import React from 'react';
import './ViewRate.less';
import TableData from '../../../../common/data/TableData';

class ViewRate extends React.Component {
  render() {
    return (
      <div id="view-rate-query">
        <TableData
          key="view-rate-query"
          resid="619609481002"
          subtractH={240}
          hasAdvSearch={true}
          hasAdd={false}
          hasRowView={false}
          hasRowDelete={false}
          hasRowEdit={false}
          hasDelete={false}
          hasModify={false}
          hasRowModify={false}
          hasRowSelection={true}
          actionBarWidth={100}
          actionBarExtra={this.actionBarExtra}
        />
      </div>
    );
  }
}

export default ViewRate;
