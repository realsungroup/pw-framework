import React from 'react';
import TableData from '../../../../common/data/TableData';

class TargetSelfAppraise extends React.Component {
  render() {
    const { type } = this.props;
    let resid = '462553161418',
      key = 'MiddleTargetSelfAppraise';
    if (type === '年末') {
      resid = '462583603607';
      key = 'EndTargetSelfAppraise';
    }
    return (
      <div id="target-self-appraise">
        {this.props.children}
        <TableData
          key={key}
          resid={resid}
          subtractH={220}
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
export default TargetSelfAppraise;
