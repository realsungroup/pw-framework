import React from 'react';
import TableData from '../../../../common/data/TableData';

class JobInfo extends React.Component {
  render() {
    return (
      <div style={{ height: '100%' }}>
        <TableData
          key="1"
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
          actionBarExtra={this.actionBarExtra}
        />
      </div>
    );
  }
}
export default JobInfo;
