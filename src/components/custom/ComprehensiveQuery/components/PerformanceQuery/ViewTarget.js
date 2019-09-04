import React from 'react';
import TableData from '../../../../common/data/TableData';

class ViewTarget extends React.Component {
  render() {
    return (
      <div id="view-target">
        {this.props.children}
        <TableData
          key="view-target"
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
          height={'cacl(100% - 48px)'}
          cparm1={this.props.selectYear.key}
        />
      </div>
    );
  }
}
export default ViewTarget;
