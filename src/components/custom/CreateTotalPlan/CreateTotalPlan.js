import React from 'react';
import { TableData } from '../../common/loadableCommon';
import SelectPersonFirstP from '../SelectPersonFirstP';
import {
  Button,
  Popconfirm,
  message,
  Spin,
  Progress,
  Modal,
  notification,
  Icon
} from 'antd';
import http from 'Util20/api';
import './CreateTotalPlan.less';

const SH_id = 611075833524;
const WX_id = 613848452461;

/**
 * 创建总计划
 */
class CreateTotalPlan extends React.Component {
  state = {
    loading: false,
    visible: false, //模态框开启和关闭
    record: {},
    modalDestroyState: false, //模态框关闭时是否保存之前的状态 flase保存
    totalIndex: 0, // 任务总进度
    curIndex: 0, // 当前任务进度
    isTaskComplete: false, // 当前任务是否已完成
    isShowModal: false
  };
  async componentDidMount() {
    // let res;
    // try {
    //   res = await http().getAutoImportStatus();
    // } catch (err) {
    //   if (err.message === '没有正在运行的任务') {
    //     return;
    //   }
    //   return message.error(err.message);
    // }
    // if (res.error !== 0) {
    //   return message.error(res.message);
    // }
    // // 当前任务已完成
    // if (res.IsComplete) {
    //   notification.open({
    //     message: '通知',
    //     description:
    //       '当前财年计划人员名单已生成完毕，请注意查看！',
    //     icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
    //     duration: null
    //   });
    //   this.setState({
    //     curIndex: this.state.totalIndex,
    //     isTaskComplete: true
    //   });
    // }
  }
  componentWillUnmount = () => {
    this.timer = null;
    this.getTaskInfo = null;
  };
  getTaskInfo = async () => {
    let res;
    try {
      res = await http().getAutoImportStatus();
    } catch (err) {
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo();
        }
      }, 1000);
      return message.error(err.message);
    }
    if (res.error !== 0) {
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo();
        }
      }, 1000);
      return message.error(res.message);
    }
    // 当前任务已完成
    if (res.IsComplete) {
      //修改当前财年的是否初始化字段
      const resid = 611077132065;
      const data = [
        {
          REC_ID: this.state.record.REC_ID,
          C3_613679305930: 'Y'
        }
      ];
      http()
        .modifyRecords({
          resid,
          data
        })
        .then(res => {
          if (res.Error === 0) {
            notification.open({
              message: '通知',
              description: '当前财年计划人员名单已生成完毕，请注意查看！',
              icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
              duration: null
            });
            this.setState({
              curIndex: this.state.totalIndex,
              isTaskComplete: true
            });
            this.tableDataRef.handleRefresh();
          } else {
            message.error(res.message);
          }
        })
        .catch(error => {
          message.error(error.message);
        });
      // 当前任务未完成
    } else {
      this.setState({
        totalIndex: res.data.Total,
        curIndex: res.data.Index,
        isTaskComplete: false
      });
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo();
        }
      }, 1000);
    }
  };
  renderTaskProgress = () => {
    const { totalIndex, curIndex } = this.state;
    let percent = 0;
    if (this.state.isTaskComplete) {
      percent = 100;
    } else if (totalIndex) {
      percent = Math.floor((curIndex / totalIndex) * 100);
    }
    return (
      <div className="total-plan__seed_personnel">
        <Progress width={240} type="circle" percent={percent} />
        <div style={{ marginTop: 20 }}>
          {curIndex} / {totalIndex}
        </div>
      </div>
    );
  };

  handleClick = async record => {
    this.setState({
      record: record
    });
    let id = record.C3_613838452660 === 'WX' ? WX_id : SH_id;
    let res;
    try {
      res = await http().runAutoImport({
        id
      });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      if (err.message === '有正在运行的任务，请稍后') {
        message.error('正在初始化，请耐心等候');
      }
    }
    this.setState({ isShowModal: true });
    if (!this.timer) {
      this.getTaskInfo();
    }
    //this.tableDataRef.handleRefresh();
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
  selectPeopleSendEmail = record => {
    this.setState({
      visible: true,
      record: record
    });
  };

  renderActionBarExtra = ({ dataSource, selectedRowKeys }) => {
    // console.log(dataSource)
    return (
      <React.Fragment>
        {/* <Popconfirm
          title="您确定要操作吗？"
          onConfirm={() => this.handleClick(dataSource, selectedRowKeys)}
        >
          <Button>生成计划人员名单</Button>
        </Popconfirm> */}
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
    console.log(e);
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
              (record, btnSize) => {
                if (record.C3_613679305930) {
                  return null;
                } else {
                  return (
                    <Button
                      size={btnSize}
                      onClick={() => {
                        this.handleClick(record);
                      }}
                    >
                      初始化
                    </Button>
                  );
                }
              },
              (record, btnSize) => {
                if (!record.C3_613679305930) {
                  return null;
                } else {
                  return (
                    <Button
                      size={btnSize}
                      onClick={() => {
                        console.log('selectPeopleSendEmail-record', record);
                        this.selectPeopleSendEmail(record);
                      }}
                    >
                      发送通知
                    </Button>
                  );
                }
              }
            ]}
          />
          <Modal
            title="初始化"
            visible={this.state.isShowModal}
            closable={false}
            footer={[
              <Button onClick={() => this.setState({ isShowModal: false })}>
                关闭
              </Button>
            ]}
            // onOk={() => {
            //   this.setState({ isShowModal: false });
            // }}
            // onCancel={() => {
            //   this.setState({ isShowModal: false });
            // }}
          >
            {this.renderTaskProgress()}
          </Modal>
        </div>
        <Modal
          title="选择人员"
          width="100%"
          visible={this.state.visible}
          onCancel={() => this.handleCancel(false)}
          destroyOnClose={this.state.modalDestroyState}
          okButtonProps={{ disabled: true }}
        >
          <SelectPersonFirstP
            record={this.state.record}
            handleCancel={e => this.handleCancel(e)}
          />
        </Modal>
      </Spin>
    );
  }
}

export default CreateTotalPlan;
