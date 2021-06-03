import React from 'react';
import TableData from '../../common/data/TableData';
import { Button, Popconfirm, message, Modal, DatePicker } from 'antd';
import http from 'Util20/api';
import './PaySettleAccounts.less';
import moment from 'moment';

/*
 * 薪资结算
 */
class PaySettleAccounts extends React.Component {
  state = {
    createVisible: false,
    month: moment(),
    confirmLoading: false,
    progressVisible: false
  };

  actionBarExtra = record => {
    return (
      <div className="hr-probation_table-action-bar-extra">
        <Button
          type="primary"
          onClick={() => this.setState({ createVisible: true })}
        >
          新建工资结算
        </Button>
      </div>
    );
  };

  handleConfirm = async () => {
    const { month } = this.state;
    if (!month) {
      return message.error('请填写月份');
    }
    this.setState({ confirmLoading: true });
    try {
      await http({
        baseURL: 'http://kingofdinner.realsun.me:30001'
      }).PostRunAutoImport({
        id: 675961915108,
        parms: {
          month: parseInt(month.format('M'), 10)
        }
      });
    } catch (err) {
      this.setState({ confirmLoading: false });
      return message.error(err.message);
    }
    this.setState({ confirmLoading: false, progressVisible: true });
  };

  render() {
    const { baseURL } = this.props;
    const { createVisible, month, confirmLoading } = this.state;
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
          height="100%"
          hasZoomInOut={false}
          // isSetColumnWidth={false}
        />
        <Modal
          title="新建薪资结算"
          visible={createVisible}
          okText="开始结算"
          onOk={this.handleConfirm}
          destroyOnClose
          confirmLoading={confirmLoading}
        >
          <div className="pay-settle-accounts__create-modal-content">
            <span>请输入结薪月份：</span>
            <DatePicker.MonthPicker
              value={month}
              onChange={month => this.setState({ month })}
            ></DatePicker.MonthPicker>
          </div>
        </Modal>
      </div>
    );
  }
}

export default PaySettleAccounts;
