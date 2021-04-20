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
import { isWhiteSpaceLike } from 'typescript';

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
      approvalList1: [], //审批流信息
      printModal: false, //打印模态框
      isPrint: false //是否打印
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
    // console.log('record', record);
    if (record.C3_605703913037 === '施工人员') {
      this.setState({ showBuilderModal: true, record: record });
    } else if (record.C3_605703913037 === '送货人员') {
      this.setState({ showDeliverModal: true, record: record });
    } else {
      message.info('当前申请为一般访客，点击行内审批或拒绝即可审批');
      this.setState({ isPrint: false });
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
      // console.log('审批信息', approvalList.data);
      approvalPeopleList.map((item, index) => {
        const current = item.C3_607445035535;
        const data = approvalList.data.filter(
          item1 => item1.C3_607445035535 === current
        );
        // console.log('data', data);
        // return {
        //   item: { ...data }
        // };
        if (data.length === 1) {
          // console.log('111');
          // return {
          //   item: data[0]
          // };
          item.C3_605718014873 = data[0].C3_605718014873;
          item.C3_605718009813 = data[0].C3_605718009813;
          item.C3_227192472953 = data[0].C3_227192472953;
        }
      });
    } catch (error) {
      message.error(error.message);
    }
    // console.log('approvalPeopleList', approvalPeopleList);
    this.setState({
      approvalList1: approvalPeopleList
    });
    console.log('判定长期', this.state.isPrint);
  };

  doPrint = res => {
    var currentHtml = window.document.body.innerHTML;
    if (res === 'deliver') {
      if (
        window.document.getElementById('printDeliverForm').innerHTML != null
      ) {
        let bdHtml = window.document.getElementById('printDeliverForm')
          .innerHTML;
        window.document.body.innerHTML = bdHtml;
        // console.log('获取打印');
        window.print();
        this.setState({
          isPrint: false
        });
      }
    } else if (res === 'builder') {
      if (
        window.document.getElementById('printBuilderForm').innerHTML != null
      ) {
        let bdHtml = window.document.getElementById('printBuilderForm')
          .innerHTML;
        window.document.body.innerHTML = bdHtml;
        // console.log('获取打印');
        window.print();
        this.setState({
          isPrint: false
        });
      }
      window.document.body.innerHTML = currentHtml;
    }
  };

  //审批施工人员申请
  approveBuilder = async result => {
    let apprecid;
    try {
      apprecid = await http().getTable({
        resid: '605717968873',
        cmswhere: `C3_605718009813 = 'waiting' and C3_605717990563 = '${this.state.record.C3_605718092628}'`
      });
      console.log('recid', apprecid.data[0].REC_ID);
    } catch (error) {
      message.error(error.message);
    }
    let finalRes;
    try {
      finalRes = await http().modifyRecords({
        resid: '605717968873',
        data: [
          {
            REC_ID: apprecid.data[0].REC_ID,
            C3_605718009813: result
          }
        ]
      });
      console.log('modify结果', result);
      console.log(finalRes);
      // finalRes = await http().modifyRecords({
      //   resid: '605717968873',
      //   data: [
      //     {
      //       REC_ID: apprecid.data[0].REC_ID
      //     }
      //   ]
      // });
    } catch (error) {
      message.error(error.message);
    }
    this.tableDataRef.handleRefresh();
    message.info('审批完成');
  };

  render() {
    const {
      activeKey,
      abnormalNum,
      showBuilderModal,
      showDeliverModal,
      record,
      approvalList1,
      deliverList,
      builderList,
      isPrint
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
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                ref={this.inApplicationRef}
                customRowBtns={[
                  record => {
                    return (
                      <div
                        style={{
                          width: '300px',
                          zIndex: '3',
                          background: 'white',
                          position: 'absolute',
                          left: 0,
                          top: 0
                        }}
                        className={
                          record.C3_605703913037 !== '一般访客'
                            ? 'lonelyButton'
                            : 'noBuilderButton'
                        }
                      >
                        <Button
                          onClick={() => {
                            this.showRecord(record);
                          }}
                        >
                          施工与送货审批
                        </Button>
                      </div>
                    );
                  }
                ]}
              />
            </div>
            {/* 施工人员审批模态框 */}
            <Modal
              width="61%"
              visible={showBuilderModal}
              title="施工申请审批"
              onCancel={() => {
                this.setState({
                  showBuilderModal: false,
                  isPrint: false
                });
              }}
              footer={
                isPrint
                  ? [
                    <Button
                      type="primary"
                      onClick={() => {
                        console.log('开始打印');
                        this.doPrint('builder');
                        this.setState({
                          isPrint: true
                        });
                      }}
                    >
                      打印
                      </Button>,
                    <Button
                      onClick={() => {
                        this.setState({
                          showBuilderModal: false,
                          isPrint: false
                        });
                      }}
                    >
                      关闭
                      </Button>
                  ]
                  : [
                    <Button
                      type="primary"
                      onClick={() => {
                        this.approveBuilder('Y');
                        this.setState({ showBuilderModal: false });
                      }}
                    >
                      通过
                      </Button>,
                    <Button
                      type="danger"
                      onClick={() => {
                        this.approveBuilder('N');
                        this.setState({ showBuilderModal: false });
                      }}
                    >
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
                  ]
              }
            >
              <div id="printBuilderForm">
                <div className="printBody">
                  <BuilderForm
                    toBuilderFormInfo={{
                      approvalInfo: record,
                      builderList: builderList,
                      approvalList: approvalList1,
                      isPrint: isPrint
                    }}
                  />
                </div>
              </div>
            </Modal>
            {/* 送货人员审批模态框 */}
            <Modal
              width="61%"
              visible={showDeliverModal}
              title="提送货申请审批"
              onCancel={() => {
                this.setState({
                  showDeliverModal: false,
                  isPrint: false
                });
              }}
              footer={
                isPrint
                  ? [
                    <Button
                      type="primary"
                      onClick={() => {
                        console.log('开始打印');
                        this.doPrint('deliver');
                      }}
                    >
                      打印
                      </Button>,
                    <Button
                      onClick={() => {
                        this.setState({
                          showDeliverModal: false,
                          isPrint: false
                        });
                      }}
                    >
                      关闭
                      </Button>
                  ]
                  : [
                    <Button
                      type="primary"
                      onClick={() => {
                        this.approveBuilder('Y');
                        this.setState({ showDeliverModal: false });
                      }}
                    >
                      通过
                      </Button>,
                    <Button
                      type="danger"
                      onClick={() => {
                        this.approveBuilder('N');
                        this.setState({ showDeliverModal: false });
                      }}
                    >
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
                  ]
              }
            >
              <div id="printDeliverForm">
                <div className="printBody">
                  <DeliverForm
                    toDeliverFormInfo={{
                      approvalInfo: record,
                      deliverList: deliverList,
                      approvalList: approvalList1,
                      isPrint: isPrint
                    }}
                  />
                </div>
              </div>
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
                customRowBtns={[
                  record => {
                    return (
                      <Button
                        style={{ width: '104px' }}
                        onClick={() => {
                          this.showRecord(record);
                          this.setState({
                            printModal: true,
                            isPrint: true
                          });
                        }}
                      >
                        打印申请单
                      </Button>
                    );
                  }
                ]}
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
