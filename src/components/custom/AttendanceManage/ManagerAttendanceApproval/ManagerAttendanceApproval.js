import React from 'react';
import './ManagerAttendanceApproval.less';
import TableData from '../../../common/data/TableData';
import { Button, Popconfirm, message, notification } from 'antd';
import http from 'Util20/api';
import { getItem } from 'Util20/util';

/*
 * 经理考勤审批
 */

class ManagerAttendanceApproval extends React.Component {
  constructor(props) {
    super(props);
    this.UserCode = JSON.parse(getItem('userInfo')).UserCode;
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
  }
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
        <Popconfirm title="确认一键审批吗？" onConfirm={this.approvalAll}>
          <Button type="primary">一键审批</Button>
        </Popconfirm>
      </div>
    );
  };

  //批准或拒绝
  isApproval = async (isApproval, data) => {
    try {
      this.props.setLoading(true);
      let res = await http().modifyRecords({
        resid: '449442699960',
        data,
        dblinkname: 'ehr'
      });
      message.success(res.message);
      this.tableDataRef.handleRefresh();
      this.props.getNotices();
    } catch (error) {
      message.error(error.message);
      console.log(error);
    } finally {
      this.props.setLoading(false);
    }
  };

  //一键审批
  approvalAll = async () => {
    try {
      this.props.setLoading(true);
      if (isNaN(Number(this.UserCode))) {
        return message.info('工号非法');
      }
      let sql =
        "update  CT446915608629  set OneKeyAudit ='Y' where C3_446915646834=(select ID from view_attendance_yg where ygno='" +
        this.UserCode +
        "') and ISNULL( C3_446915685257,'')='' and ISNULL(OneKeyAudit,'')<>'Y' and C3_449443494224=(select min(C3_424358155202)  from CT424358078333 where ISNULL(C3_424358188666,'')='Y') and C3_446945943924='Y' and C3_515595953233 >=CONVERT(char(8),getdate(),112) and isnull(C3_447032685982,'')<>'Y' and C3_447161788710='请假加班申请' and C3_447166742900='用户审批'";
      await http().runBySql({
        dblink: 'ehr',
        sql
      });
      message.success('一键审批成功');
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
          baseURL={this.baseURL}
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
