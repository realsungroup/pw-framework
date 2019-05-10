import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, Popconfirm, message, Spin } from 'antd';
import http from 'Util20/api';

/**
 * 财年计划
 */
class FiscalYearPlan extends React.Component {
  state = {
    loading: false
  };

  handleConfirm = async (dataSource, selectedRowKeys) => {
    if (!selectedRowKeys.length) {
      return message.error('请选择记录');
    }
    const { resid } = this.props;
    this.setState({ loading: true });
    const data = selectedRowKeys.map(recid => ({
      REC_ID: recid,
      C3_605619907534: 'Y'
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
        <Button>确认</Button>
      </Popconfirm>
    );
  };

  render() {
    const { loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div style={{ height: 'calc(100vh - 160px)' }}>
          <TableData
            resid={609883172764}
            addText="创建财年计划"
            customRowBtns={[
              (record, btnSize) => {
                return (
                  <Button
                    size={btnSize}
                    href={`/fnmodule?resid=610555787304&recid=610555815210&type=前端功能入口&title=财年计划管理`}
                  >
                    计划详情
                  </Button>
                );
              }
            ]}
            hasRowView={false}
            hasRowDelete={false}
            hasRowEdit={false}
            hasDelete={false}
            hasModify={false}
            hasRowModify={false}
          />
        </div>
      </Spin>
    );
  }
}

export default FiscalYearPlan;
