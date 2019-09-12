import React from 'react';
import './WaitingApproval.less';
import { Button } from 'antd';
import TableData from '../../../common/data/TableData';

/*
 *待审批
 */
class WaitingApproval extends React.Component {
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="waiting-approval"
          resid="449449634592"
          subtractH={200}
          hasAdvSearch={false}
          hasAdd={false}
          hasRowView={false}
          hasRowDelete={true}
          hasRowEdit={false}
          hasDelete={false}
          hasModify={false}
          hasRowModify={false}
          hasRowSelection={true}
          actionBarWidth={200}
          dblinkname="ehr"
          customRowBtns={[
            (record, btnSize) => {
              return (
                <Button onClick={() => this.props.onOpenApprovalRecordModal}>
                  查看审批记录
                </Button>
              );
            }
          ]}
        />
      </div>
    );
  }
}

export default WaitingApproval;
