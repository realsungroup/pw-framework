import React from 'react';
import TableData from '../../../../common/data/TableData';

class ViewTarget extends React.Component {
  render() {
    return (
      <div id="target-history">
        <TableData
          key="1"
          resid="462622744495"
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
          cparm1={this.props.selectYear.key}
        />
      </div>
    );
  }
}
export default ViewTarget;
