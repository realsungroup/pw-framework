import React from 'react';
import TableData from '../../../../common/data/TableData';

class TargetTarget extends React.Component {
  render() {
    return (
      <div id="target-target">
        {this.props.children}
        <div className="table-data-wrapper">
          <TableData
            key="target-target"
            resid="462402075404"
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
            cparm1={this.props.selectYear.key}
            baseURL="http://10.108.2.66:9091/"
          />
        </div>
      </div>
    );
  }
}
export default TargetTarget;
