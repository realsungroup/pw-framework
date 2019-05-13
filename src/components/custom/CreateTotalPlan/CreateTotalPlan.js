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

  renderActionBarExtra = ({ dataSource, selectedRowKeys }) => {
    return (
      <Popconfirm
        title="您确定要操作吗？"
        onConfirm={() => this.handleClick(dataSource, selectedRowKeys)}
      >
        <Button>生成计划人员名单</Button>
      </Popconfirm>
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
