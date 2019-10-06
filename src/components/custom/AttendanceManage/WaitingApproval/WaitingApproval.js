import React from 'react';
import './WaitingApproval.less';
import { Button, message, Popconfirm, Spin } from 'antd';
import TableData from '../../../common/data/TableData';
import http from 'Util20/api';

/*
 *待审批
 */
class WaitingApproval extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.attendanceDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  actionBarExtra = record => {
    return (
      <div className="hr-probation_table-action-bar-extra">
        <Popconfirm
          title="确认发送邮件吗？"
          onConfirm={() => {
            if (!record.selectedRowKeys.length) {
              return message.error('请选择一条记录');
            }
            let selectedRecords = record.selectedRowKeys.map(key => {
              return {
                REC_ID: record.dataSource.find(item => {
                  return item.REC_ID === key;
                }).REC_ID,
                C3_449609064705: 'Y'
              };
            });
            this.emailNotice(selectedRecords);
          }}
        >
          <Button>发邮件提醒</Button>
        </Popconfirm>

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

  emailNotice = async data => {
    try {
      this.props.setLoading(true);
      await http().modifyRecords({
        resid: '449449634592',
        data,
        dblinkname: 'ehr'
      });
      this.tableDataRef.handleRefresh();
      message.success('邮件已发送');
    } catch (error) {
      message.error(error.message);
      console.log(error);
    } finally {
      this.props.setLoading(false);
    }
  };
  revocat = async data => {
    try {
      this.props.setLoading(true);
      await http().modifyRecords({
        resid: '449449634592',
        data,
        dblinkname: 'ehr'
      });
      this.tableDataRef.handleRefresh();
      this.props.getNotices();
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
          key="waiting-approval"
          resid="449449634592"
          subtractH={230}
          hasAdvSearch={false}
          hasAdd={false}
          hasRowView={true}
          hasRowDelete={true}
          hasRowEdit={false}
          hasDelete={false}
          hasModify={false}
          hasRowModify={false}
          hasRowSelection={true}
          recordFormUseAbsolute={true}
          actionBarWidth={200}
          formProps={{ width: 700 }}
          dblinkname="ehr"
          actionBarExtra={this.actionBarExtra}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          baseURL={this.baseURL}
          downloadBaseURL={this.attendanceDownloadURL}
          customRowBtns={[
            record => {
              return (
                <Button
                  onClick={() => this.props.onOpenApprovalRecordModal(record)}
                >
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
