import React from 'react';
import TableData from '../../../../common/data/TableData';

class TargetTarget extends React.Component {
  render() {
    const { selectYear } = this.props;
    return (
      <div id="target-history">
        {this.props.children}
        <TableData
          key="table-target-target"
          resid="462402075404"
          subtractH={240}
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
          cparm1={selectYear.key}
        />
      </div>
    );
  }
}
export default TargetTarget;
