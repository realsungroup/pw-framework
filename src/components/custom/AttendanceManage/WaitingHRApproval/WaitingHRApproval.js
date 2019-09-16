import React from 'react';
import './WaitingHRApproval.less';
import TableData from '../../../common/data/TableData';
import { Button, message, Popconfirm } from 'antd';
import http from 'Util20/api';

/*
 *待HR审批
 */
class WaitingHRApproval extends React.Component {
  state = {
    revocatting: false
  };
  actionBarExtra = record => {
    return (
      <Popconfirm
        title="确认撤销吗？"
        onConfirm={() => {
          if (!record.selectedRowKeys.length) {
            return message.error('请选择一条记录');
          }
          let selectedRecords = record.selectedRowKeys.map(key => {
            return {
              REC_ID: record.dataSource.find(item => {
                return item.REC_ID === key;
              }).REC_ID,
              C3_449011113087: 'Y'
            };
          });
          this.revocat(selectedRecords);
        }}
      >
        <Button loading={this.state.revocatting}>撤销</Button>
      </Popconfirm>
    );
  };
  revocat = async data => {
    try {
      this.props.setLoading(true);
      await http().modifyRecords({
        resid: '544795775918',
        data,
        dblinkname: 'ehr'
      });
      this.tableDataRef.handleRefresh();
    } catch (error) {
      message.error(error.message);
      console.log(error);
    } finally {
      this.props.setLoading(true);
    }
  };
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="waiting-hr-approval"
          resid="544795775918"
          subtractH={230}
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
          actionBarExtra={this.actionBarExtra}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
        />
      </div>
    );
  }
}

export default WaitingHRApproval;
