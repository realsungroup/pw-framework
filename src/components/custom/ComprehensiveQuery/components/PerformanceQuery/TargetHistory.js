import React from 'react';
import TableData from '../../../../common/data/TableData';

class TargetHistory extends React.Component {
  render() {
    const { selectYear } = this.props;
    return (
      <div id="target-history">
        {this.props.children}
        <TableData
          key="1"
          resid="462586715318"
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
          dblinkname="ehr"
          cparm1={selectYear.key}
        />
      </div>
    );
  }
}
export default TargetHistory;
