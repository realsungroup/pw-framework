import React from 'react';
import './ManagerAttendanceApproval.less';
import TableData from '../../../common/data/TableData';
import { Button, Popconfirm, message } from 'antd';
import http from 'Util20/api';

/*
 * 经理考勤审批
 */

class ManagerAttendanceApproval extends React.Component {
  state = {
    approvaling: false,
    rejectting: false
  };
  actionBarExtra = record => {
    return (
      <div className="hr-probation_table-action-bar-extra">
        <Popconfirm
          title="确认批准吗？"
          onConfirm={() => {
            if (!record.selectedRowKeys.length) {
              return message.error('请选择一条记录');
            }
            let selectedRecords = record.selectedRowKeys.map(key => {
              return {
                REC_ID: record.dataSource.find(item => {
                  return item.REC_ID === key;
                }).REC_ID,
                C3_446915685257: 'Y'
              };
            });
            this.isApproval(true, selectedRecords);
          }}
        >
          <Button type="primary">批准</Button>
        </Popconfirm>

        <Popconfirm
          title="确认拒绝吗？"
          onConfirm={() => {
            if (!record.selectedRowKeys.length) {
              return message.error('请选择一条记录');
            }
            let selectedRecords = record.selectedRowKeys.map(key => {
              return {
                REC_ID: record.dataSource.find(item => {
                  return item.REC_ID === key;
                }).REC_ID,
                C3_446915693757: 'Y'
              };
            });
            this.isApproval(false, selectedRecords);
          }}
        >
          <Button type="danger">拒绝</Button>
        </Popconfirm>
        <Popconfirm title="确认一键审批吗？" onConfirm={() => {}}>
          <Button type="primary" onClick={() => {}}>
            一键审批
          </Button>
        </Popconfirm>

        <Button type="primary" onClick={() => {}}>
          下属加班明细
        </Button>
        <Button type="primary" onClick={() => {}}>
          下属加班汇总
        </Button>
      </div>
    );
  };
  isApproval = async (isApproval, data) => {
    try {
      this.setState({
        revocatting: true
      });
      let res = await http().modifyRecords({
        resid: '449442699960',
        data,
        dblinkname: 'ehr'
      });
      message.success(res.message);
      this.tableDataRef.handleRefresh();
    } catch (error) {
      message.error(error.message);
      console.log(error);
    } finally {
      this.setState({
        revocatting: false
      });
    }
  };
  render() {
    return (
      <div className="attendance-manage_tabledata__wrapper">
        <TableData
          key="invalid-application-form"
          resid="449442699960"
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
          actionBarWidth={470}
          hasBeBtns={true}
          formProps={{ width: 1000 }}
          recordFormUseAbsolute={true}
          dblinkname="ehr"
          customRowBtns={[
            record => {
              return (
                <Button
                  onClick={() => {
                    this.props.onOpenApprovalRecordModal(record);
                  }}
                >
                  查看审批记录
                </Button>
              );
            }
          ]}
          actionBarExtra={this.actionBarExtra}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
        />
      </div>
    );
  }
}

export default ManagerAttendanceApproval;
