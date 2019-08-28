import React from 'react';
import TableData from '../../../../common/data/TableData';

class TargetSelfAppraise extends React.Component {
  render() {
    return (
      <div id="target-self-appraise">
        <TableData
          key="TargetSelfAppraise"
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
export default TargetSelfAppraise;
