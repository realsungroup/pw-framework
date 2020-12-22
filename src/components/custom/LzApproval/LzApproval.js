import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { message, Tabs, Button, Modal } from 'antd';
import './LzApproval.less';
import classNames from 'classnames';
import http from 'Util20/api';
import { TableData } from '../../common/loadableCommon';
import EventEmitter from 'wolfy87-eventemitter';
import BuilderForm from './BuilderForm';
import DeliverForm from './DeliverForm';
import {
  inApplication,
  applyForAbnormal,
  approved,
  refused,
  history,
  inExaminationAndApproval
} from './config';

const TabPane = Tabs.TabPane;

/**
 * 审批
 */
export default class LzApproval extends React.Component {
  static propTypes = {};
  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      abnormalNum: 0,
      activeKey: '待审批',
      record: {}, //当前操作记录
      showDeliverModal: false, //控制送货人员模态框
      showBuilderModal: false, //控制施工人员模态框
      deliverList: [], //送货人员清单
      builderList: [], //施工人员清单
      approvalList: [] //审批流信息
    };
    this.abnormalRef = React.createRef();
    this.inApplicationRef = React.createRef();
  }

  componentDidMount = () => {
    window.lzCustomEvent = window.lzCustomEvent ? window.lzCustomEvent : {};
    window.lzCustomEvent.ee = new EventEmitter();
    // 监听 批量添加完成
    window.lzCustomEvent.ee.addListener('batchAdd', this.retHandleBatchAdd());
  };

  componentWillUnmount = () => {
    window.lzCustomEvent.ee.removeListener('batchAdd', this.handleBatchAdd);
  };

  retHandleBatchAdd = () => {
    const that = this;
    this.handleBatchAdd = function handleBatchAdd(
      normalRecords,
      abnormalRecords
    ) {
      let activeKey = '已审批';

      if (!abnormalRecords.length) {
        activeKey = '待审批';
      }
      if (normalRecords.length) {
        that.inApplicationRef.current.refreshTableData(true);
      }
      if (abnormalRecords.length) {
        that.abnormalRef.current.refreshTableData(true);
      }
      that.setState({ activeKey });
    };
    return this.handleBatchAdd;
  };

  getTableData = (tableData, total) => {
    this.setState({ abnormalNum: total });
  };

  handleTabsChange = activeKey => {
    this.setState({ activeKey });
  };

  //根据人员类型不同，打开不同的模态框
  showRecord = async record => {
    console.log('record', record);
    if (record.C3_605703913037 === '施工人员') {
      this.setState({ showBuilderModal: true, record: record });
    } else if (record.C3_605703913037 === '送货人员') {
      this.setState({ showDeliverModal: true, record: record });
    } else {
      console(record.C3_605703913037);
    }
    //获取人员清单
    let peopleList;

    try {
      peopleList = await http().getTable({
        resid: '605716014733',
        cmswhere: `C3_606070812241 = '${record.C3_605718092628}'`
      });
      this.setState({
        deliverList: peopleList.data,
        builderList: peopleList.data
      });
      console.log('人员清单', peopleList);
    } catch (error) {
      message.error(error.message);
    }
    //获取审批流信息
    let approvalList;
    const approvalPeopleList = [
      {
        C3_607445035535: '申请人',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '受施工影响部门负责人',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '厂务负责工程师',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '厂务经理',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '经理',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '总监',
        C3_605718014873: '',
        C3_605718009813: ''
      }
    ];
    try {
      approvalList = await http().getTable({
        resid: '605717968873',
        cmswhere: `C3_605717990563 = '${record.C3_605718092628}'`
      });
      this.setState({
        approvalList: approvalList.data
      });
      console.log('审批信息', approvalList);
    } catch (error) {
      message.error(error.message);
    }
  };

  //审批施工人员申请
  approveBuilder = async result => {
    console.log(result);
    let apprecid;
    try {
      apprecid = await http().getTable({
        resid: '605717968873',
        cmswhere: `C3_605718009813 = 'waiting' and C3_605717990563 = '${this.state.record.C3_605718092628}'`
      });
      console.log('recid', apprecid);
    } catch (error) {
      message.error(error.message);
    }
    let finalRes;

    try {
      finalRes = await http().modifyRecords({
        resid: '605717968873',
        data: [
          {
            REC_ID: apprecid,
            C3_605718009813: result
          }
        ]
      });
    } catch (error) {
      message.error(error.message);
    }
    // //获取该申请的审批信息
    // let oldApprovalData;
    // try {
    //   oldApprovalData = await http().getTable({
    //     resid,
    //     dblinkname
    //   });
    // } catch (error) {
    //   message.error(error.message);
    // }
    // //获取预约表信息
    // let appointment;
    // try {
    //   appointment = await http().getTable({
    //     resid,
    //     dblinkname
    //   });
    // } catch (error) {
    //   message.error(error.message);
    // }

    // //审批通过
    // if (result) {
    //   //更新审批结果
    //   oldApprovalData.map((item, index) => {
    //     if (item.C3_605718009813 === 'waiting') {
    //       if (item.C3_607445036471 === oldApprovalData.length) {
    //         item.C3_605718009813 = 'Y';
    //         appointment.C3_607446784359 = 'Y';
    //       } else {
    //         item.C3_605718009813 = 'Y';
    //         oldApprovalData[index + 1].C3_605718009813 = 'waiting';
    //       }
    //     }
    //   });
    // }
    // //审批拒绝
    // else {
    //   //更新审批结果
    //   oldApprovalData.map((item, index) => {
    //     if (item.C3_605718009813 === 'waiting') {
    //       item.C3_605718009813 = 'N';
    //       appointment.C3_607447377367 = 'Y';
    //     }
    //   });
    //   //更改后台审批信息
    //   try {
    //     const res = await http().modifyRecords({
    //       resid: '',
    //       data: ''
    //     });
    //     message.success(res.message);
    //     this.tableDataRef.handleRefresh();
    //   } catch (error) {
    //     message.error(error.message);
    //   }
    // }
  };

  //审批送货人员申请
  approveDeliver = async result => {
    console.log(result);
  };

  render() {
    const {
      activeKey,
      abnormalNum,
      showBuilderModal,
      showDeliverModal,
      record,
      approvalList,
      deliverList,
      builderList
    } = this.state;
    return (
      <div className="lz-approval">
        <Tabs
          activeKey={activeKey}
          renderTabBar={this.renderTabBar}
          onChange={this.handleTabsChange}
        >
          <TabPane tab="待审批" key="待审批">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData
                {...inApplication}
                // https://github.com/react-component/form#note-use-wrappedcomponentref-instead-of-withref-after-rc-form140
                // wrappedComponentRef={form => (this.inApplicationRef = form)}
                ref={this.inApplicationRef}
                customRowBtns={[
                  record => {
                    return (
                      <Button
                        style={{ width: '104px' }}
                        onClick={() => {
                          this.showRecord(record);
                        }}
                      >
                        确认信息
                      </Button>
                    );
                  }
                ]}
              />
            </div>
            {/* 施工人员审批模态框 */}
            <Modal
              width="61%"
              visible={showBuilderModal}
              title="施工人员审批"
              onCancel={() => {
                this.setState({
                  showBuildererModal: false
                });
              }}
              footer={[
                <Button type="primary" onClick={this.approveBuilder('Y')}>
                  通过
                </Button>,
                <Button type="danger" onClick={this.approveBuilder('N')}>
                  拒绝
                </Button>,
                <Button
                  onClick={() => {
                    this.setState({
                      showBuilderModal: false
                    });
                  }}
                >
                  关闭
                </Button>
              ]}
            >
              <BuilderForm
                toBuilderFormInfo={{
                  approvalInfo: record,
                  builderList: builderList,
                  approvalList: approvalList
                }}
              />
            </Modal>
            {/* 送货人员审批模态框 */}
            <Modal
              width="61%"
              visible={showDeliverModal}
              title="送货人员审批"
              onCancel={() => {
                this.setState({
                  showDeliverModal: false
                });
              }}
              footer={[
                <Button type="primary" nClick={this.approveDeliver(true)}>
                  通过
                </Button>,
                <Button type="danger" onClick={this.approveDeliver(false)}>
                  拒绝
                </Button>,
                <Button
                  onClick={() => {
                    this.setState({
                      showDeliverModal: false
                    });
                  }}
                >
                  关闭
                </Button>
              ]}
            >
              <DeliverForm
                toDeliverFormInfo={{
                  approvalInfo: record,
                  deliverList: deliverList,
                  approvalList: approvalList
                }}
              />
            </Modal>
          </TabPane>
          <TabPane tab="已审批" key="已审批" forceRender={true}>
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData
                {...applyForAbnormal}
                getTableData={this.getTableData}
                // https://github.com/react-component/form#note-use-wrappedcomponentref-instead-of-withref-after-rc-form140
                // wrappedComponentRef={form => (this.abnormalRef = form)}
                ref={this.abnormalRef}
              />
            </div>
          </TabPane>
          <TabPane tab="已拒绝" key="已拒绝">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData {...refused} />
            </div>
          </TabPane>
          <TabPane tab="历史记录" key="历史记录">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData {...history} />
            </div>
          </TabPane>
        </Tabs>
        {!!abnormalNum && (
          <div className="lz-affo__abnormal-num">{abnormalNum}</div>
        )}
      </div>
    );
  }
}
