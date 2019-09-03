import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, Popconfirm, message, Spin, Modal, Input } from 'antd';
import http from 'Util20/api';

/**
 * 管理员确认
 */
const { TextArea } = Input;
class AdminConfirm extends React.Component {
  state = {
    loading: false,
    deleteReason: '',
    sendBackReason: null
  };

  onSendBack = async record => {
    let res;
    record.C3_591373760332 = '';
    record.C3_617212255449 = this.state.sendBackReason;
    try {
      res = await http().modifyRecords({
        resid: 605617716920,
        data: [record]
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
    this.setState({
      sendBackReason: null
    });
  };
  onChangeDeleteReason = event => {
    this.setState({
      deleteReason: event.target.value
    });
  };
  onChangeSendBackReason = event => {
    this.setState({
      sendBackReason: event.target.value
    });
  };
  onClearReason = () => {
    this.setState({
      sendBackReason: null,
      deleteReason: null
    });
  };
  onDelete = async record => {
    let res;
    record.C3_591556634215 = 'Y';
    record.C3_617205061601 = this.state.deleteReason;
    if(!this.state.deleteReason){
      return message.error("请填写删除原因！")
    }
    try {
      res = await http().modifyRecords({
        resid: 605617716920,
        data: [record]
      });
      console.log('res', res);
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
    this.setState({
      deleteReason: null
    });
    this.tableDataRef.handleRefresh();
  };
  handleDownMaterial = url => {
    if (!url) {
      return Modal.warning({
        title: '您还未上传过资料'
      });
    }
    const urls = url.split(';file;');
    for (let i = 0, len = urls.length; i < len; i++) {
      const obj = JSON.parse(urls[i]);
      window.open(obj.url);
    }
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
        <div style={{ height: '100vh' }}>
          <TableData
            {...this.props}
            actionBarExtra={this.renderActionBarExtra}
            wrappedComponentRef={element => (this.tableDataRef = element)}
            refTargetComponentName="TableData"
            customRowBtns={[
              record => {
                return (
                  <Button
                    onClick={() => {
                      this.handleDownMaterial(record.C3_590515131157);
                    }}
                  >
                    下载查阅
                  </Button>
                );
              },
              record => {
                return (
                  <Popconfirm
                    title={
                      <React.Fragment>
                        <span>请输入退回原因</span>
                        <TextArea
                          value={this.state.sendBackReason}
                          onChange={this.onChangeSendBackReason}
                        ></TextArea>
                      </React.Fragment>
                    }
                    onConfirm={() => this.onSendBack(record)}
                    onCancel={() => {
                      this.onClearReason();
                    }}
                  >
                    <Button>退回</Button>
                  </Popconfirm>
                );
              },
              record => {
                return (
                  <Popconfirm
                    title={
                      <React.Fragment>
                        <span>请输入删除原因</span>
                        <TextArea
                          value={this.state.deleteReason}
                          onChange={this.onChangeDeleteReason}
                        ></TextArea>
                      </React.Fragment>
                    }
                    onConfirm={() => this.onDelete(record)}
                  >
                    <Button>删除</Button>
                  </Popconfirm>
                );
              }
            ]}
          />
        </div>
      </Spin>
    );
  }
}

export default AdminConfirm;
