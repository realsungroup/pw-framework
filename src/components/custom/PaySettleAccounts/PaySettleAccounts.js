import React from 'react';
import TableData from '../../common/data/TableData';
import { Button, Popconfirm, message } from 'antd';
import http from 'Util20/api';
import './PaySettleAccounts.less';

/*
 * 薪资结算
 */
class PaySettleAccounts extends React.Component {
  actionBarExtra = record => {
    return (
      <div className="hr-probation_table-action-bar-extra">
        <Button type="primary" onClick={this.handleCreateSalarySettleAccounts}>
          新建工资结算
        </Button>
      </div>
    );
  };

  handleCreateSalarySettleAccounts = () => {};

  render() {
    const { baseURL } = this.props;
    return (
      <div className="pay-settle-accounts">
        <TableData
          baseURL={baseURL}
          resid="675808935048"
          subtractH={230}
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
          actionBarExtra={this.actionBarExtra}
          hasDownload={false}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          // isSetColumnWidth={false}
        />
      </div>
    );
  }
}

export default PaySettleAccounts;
