import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, Popconfirm, message, Spin } from 'antd';
import http from 'Util20/api';

const id = 611075833524;

/**
 * 创建总计划
 */
class CreateTotalPlan extends React.Component {
  state = {
    loading: false
  };

  handleClick = async () => {
    let res;
    try {
      res = await http().runAutoImport({
        id
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

  handleSeed = async (dataSource, selectedRowKeys) => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      return message.error('请选择记录');
    }
    this.setState({ loading: true });
    const data = selectedRowKeys.map(key => ({
      REC_ID: key,
      C3_611076156223: 'Y'
    }));

    try {
      await http().modifyRecords({
        resid: this.props.resid,
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
      <React.Fragment>
        <Popconfirm
          title="您确定要操作吗？"
          onConfirm={() => this.handleClick(dataSource, selectedRowKeys)}
        >
          <Button>生成计划人员名单</Button>
        </Popconfirm>
        <Popconfirm
          title="您确定要操作吗？"
          onConfirm={() => this.handleSeed(dataSource, selectedRowKeys)}
        >
          <Button>发送通知</Button>
        </Popconfirm>
      </React.Fragment>
    );
  };

  render() {
    const { loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div style={{ height: 'calc(100vh - 160px)' }}>
          <TableData
            {...this.props}
            actionBarExtra={this.renderActionBarExtra}
            wrappedComponentRef={element => (this.tableDataRef = element)}
            refTargetComponentName="TableData"
          />
        </div>
      </Spin>
    );
  }
}

export default CreateTotalPlan;
