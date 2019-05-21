import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, Popconfirm, message, Spin } from 'antd';
import http from 'Util20/api';
import moment from 'moment';

/**
 * 到期违纪清单
 */
class ExpireViolationsList extends React.Component {
  state = {
    loading: false
  };

  handleConfirm = async (dataSource, selectedRowKeys) => {
    console.log({ dataSource, selectedRowKeys });
    if (!selectedRowKeys.length) {
      return message.error('请选择记录');
    }
    const { resid } = this.props;
    this.setState({ loading: true });
    const data = selectedRowKeys.map(recid => ({
      REC_ID: recid,
      C3_605619926825: 'Y', // 确认撤销
      C3_610710181957: moment().format('YYYY-MM-DDTHH:mm:ss') // 确认撤销日期
    }));

    let res;
    try {
      res = await http().modifyRecords({
        resid,
        data
      });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
    message.success('操作成功');
    this.tableDataRef.handleRefresh();
  };

  renderActionBarExtra = ({ dataSource, selectedRowKeys }) => {
    return (
      <Popconfirm
        title="您确定要操作吗？"
        onConfirm={() => this.handleConfirm(dataSource, selectedRowKeys)}
      >
        <Button>确认撤销</Button>
      </Popconfirm>
    );
  };

  render() {
    const { loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div style={{ height: '100vh' }}>
          <TableData
            {...this.props}
            actionBarExtra={this.renderActionBarExtra}
            wrappedComponentRef={element => (this.tableDataRef = element)}
            refTargetComponentName="TableData"
            hasRowSelection
          />
        </div>
      </Spin>
    );
  }
}

export default ExpireViolationsList;
