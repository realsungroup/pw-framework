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
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.attendanceDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
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
      this.props.setLoading(false);
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
          baseURL={this.baseURL}
          downloadBaseURL={this.attendanceDownloadURL}
        />
      </div>
    );
  }
}

export default WaitingHRApproval;
