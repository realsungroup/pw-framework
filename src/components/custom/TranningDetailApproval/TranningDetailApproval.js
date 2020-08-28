import React from 'react';
import TableData from '../../common/data/TableData';
import { Divider, Form, Input, Button, message, Popconfirm } from 'antd';
import http from 'Util20/api';

import './TranningDetailApproval.less';

const resid = '625854136036';
const YEAR_RESID = '420161931474'; //财年表id
const approvalresid = '626179362313';

const { TextArea } = Input;
class TranningDetailApproval extends React.Component {
  state = {
    currentYear: '',
    approvalRecord: {
      isApprove: '',
      year: '',
      triggerName: '',
      triggerTime: '',
      triggerRemark: '',
      remark: ''
    },
    active: false,
    approveButtonLoading: false,
    rejectButtonLoading: false
  };

  componentDidMount() {
    this.getYears();
  }

  //获取财年
  getYears = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: YEAR_RESID
      });
      let years = [...res.data];
      let currentYear = years.find(item => item.C3_478179065325 === 'Y');
      this.setState({
        years,
        currentYear: currentYear.C3_420161949106
      });
      this.getAppoval(currentYear.C3_420161949106);
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  getAppoval = async year => {
    try {
      const res = await http().getTable({
        resid: approvalresid,
        cmswhere: `year = '${year}'`
      });

      if (res.data.length > 0) {
        const data = res.data[0];
        this.setState({
          approvalRecord: data,
          active: true
        });
      } else {
        this.setState({ active: false });
      }

    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  handleRemarkChange = v =>
    this.setState({
      approvalRecord: { ...this.state.approvalRecord, remark: v.target.value }
    });

  approval = isApprove => async () => {
    const _isApprove = isApprove === 'Y' ? true : false;
    if (_isApprove) {
      this.setState({
        approveButtonLoading: true
      });
    } else {
      this.setState({
        rejectButtonLoading: true
      });
    }
    try {
      const res = await http().modifyRecords({
        resid: approvalresid,
        data: [{ ...this.state.approvalRecord, isApprove }]
      });
      this.setState({
        approvalRecord: res.data[0]
      });

    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
    if (_isApprove) {
      message.success('已同意')
      this.setState({
        approveButtonLoading: false
      });
    } else {
      message.success('已拒绝')
      this.setState({
        rejectButtonLoading: false
      });
    }
  };
  render() {
    const {
      currentYear,
      approvalRecord,
      approveButtonLoading,
      rejectButtonLoading
    } = this.state;
    const disabled = approvalRecord.isApprove === 'Y' ? true : false;
    return (
      <div className="tranning-detail-approval">
        <div className="tranning-detail-approval_tabledata-wrapper">
          <TableData
            resid={resid}
            subtractH={220}
            tableComponent="ag-grid"
            sideBarAg={true}
            hasAdvSearch={true}
            hasAdd={false}
            hasRowView={false}
            hasRowDelete={false}
            hasRowEdit={false}
            hasDelete={false}
            hasModify={false}
            hasBeBtns={false}
            hasRowModify={false}
            hasRowSelection={false}
            cmswhere={`C3_613941384328 = '${currentYear}'`}
          />
        </div>
        <sider className="tranning-detail-approval_sider">
          <div className="tranning-detail-approval_sider_item">
            <b>财年:</b>
            <span>{approvalRecord.year}</span>
          </div>
          <div className="tranning-detail-approval_sider_item">
            <b>发起人:</b>
            <span>{approvalRecord.triggerName}</span>
          </div>
          <div className="tranning-detail-approval_sider_item">
            <b>发起时间:</b>
            <span>{approvalRecord.triggerTime}</span>
          </div>
          <div className="tranning-detail-approval_sider_item">
            <b>发起人附语:</b>
            <p>{approvalRecord.triggerRemark}</p>
          </div>
          <Divider />
          <Form.Item label="附语">
            <TextArea
              placeholder="请输入附语"
              rows={6}
              value={approvalRecord.remark}
              onChange={this.handleRemarkChange}
              disabled={disabled}
            />
          </Form.Item>
          {!disabled && this.state.active && (
            <div>
              <Popconfirm title="确认同意吗？" onConfirm={this.approval('Y')}>
                <Button
                  type="primary"
                  style={{ marginRight: 8 }}
                  loading={approveButtonLoading}
                  disabled={approvalRecord.isApprove}
                >
                  同意
                </Button>
              </Popconfirm>
              <Popconfirm title="确认拒绝吗？" onConfirm={this.approval('N')}>
                <Button type="danger" loading={rejectButtonLoading} disabled={approvalRecord.isApprove}>
                  拒绝
                </Button>
              </Popconfirm>
            </div>
          )}
        </sider>
      </div>
    );
  }
}

export default TranningDetailApproval;
