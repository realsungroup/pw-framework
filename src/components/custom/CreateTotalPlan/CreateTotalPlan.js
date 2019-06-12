import React from 'react';
import { TableData } from '../../common/loadableCommon';
import SelectPersonFirstP from '../SelectPersonFirstP';
import { Button, Popconfirm, message, Spin, Modal } from 'antd';
import http from 'Util20/api';

const id = 611075833524;

/**
 * 创建总计划
 */
class CreateTotalPlan extends React.Component {
  state = {
    loading: false,
    visible: false, //模态框开启和关闭
    record: {},
    modalDestroyState: false, //模态框关闭时是否保存之前的状态 flase保存
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
  selectPeopleSendEmail = (record) => {
    this.setState({
      visible: true,
      record: record
    })
  }

  renderActionBarExtra = ({ dataSource, selectedRowKeys }) => {
    return (
      <React.Fragment>
        <Popconfirm
          title="您确定要操作吗？"
          onConfirm={() => this.handleClick(dataSource, selectedRowKeys)}
        >
          <Button>生成计划人员名单</Button>
        </Popconfirm>
        {/* <Popconfirm
          title="您确定要操作吗？"
          onConfirm={() => this.selectPeopleSendEmail()}
        >
          <Button>发送通知</Button>
        </Popconfirm> */}
        {/* <Button onClick={this.selectPeopleSendEmail}>发送通知</Button> */}
      </React.Fragment>
    );
  };

  handleCancel = (e = false) => {
    console.log(e)
    this.setState({
      visible: false,
      modalDestroyState: e
    });
  };

  render() {
    const { loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div style={{ height: '100vh' }}>
          <TableData
            {...this.props}
            hasBeBtns
            actionBarExtra={this.renderActionBarExtra}
            wrappedComponentRef={element => (this.tableDataRef = element)}
            refTargetComponentName="TableData"
            customRowBtns={[
              // (record, btnSize) => {
              //   return <Button size={btnSize}>人员名单</Button>;
              // },
              (record, btnSize) => {
                return <Button size={btnSize}
                  onClick={() => {
                    console.log('selectPeopleSendEmail-record', record)
                    this.selectPeopleSendEmail(record)
                  }}
                >发送通知</Button>;
              },
            ]}
          />
        </div>
        <Modal
          title="选择人员"
          width="100%"
          visible={this.state.visible}
          onCancel={()=>this.handleCancel(false)}
          destroyOnClose={this.state.modalDestroyState}
          okButtonProps={{ disabled: true }}
        >
          <SelectPersonFirstP record={this.state.record} handleCancel={(e)=>this.handleCancel(e)} />
        </Modal>
      </Spin>
    );
  }
}

export default CreateTotalPlan;
