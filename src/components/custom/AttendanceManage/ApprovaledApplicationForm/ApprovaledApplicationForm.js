import React from 'react';
import './ApprovaledApplicationForm.less';
import TableData from '../../../common/data/TableData';
import { Button, message, Popconfirm } from 'antd';
import http from 'Util20/api';

/*
 * 已审批
 */

class ApprovaledApplicationForm extends React.Component {
  actionBarExtra = record => {
    return (
      <div className="hr-probation_table-action-bar-extra">
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
          <Button>撤销</Button>
        </Popconfirm>
      </div>
    );
  };
  revocat = async data => {
    try {
      this.props.setLoading(true);
      let res = await http().modifyRecords({
        resid: '449449427225',
        data,
        dblinkname: 'ehr'
      });
      message.success(res.message);
      this.tableDataRef.handleRefresh();
    } catch (error) {
      message.error(error.message);
      console.log(error);
    } finally {
      this.props.setLoading(false);
    }
  };
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="approvaled-application-form"
          resid="449449427225"
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
          dblinkname="ehr"
          actionBarExtra={this.actionBarExtra}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
        />
      </div>
    );
  }
}

export default ApprovaledApplicationForm;
