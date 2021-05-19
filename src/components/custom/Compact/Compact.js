import React, { Component } from 'react';
import {
  Button,
  Popconfirm,
  message,
  Spin,
  Tabs,
  Modal,
  Checkbox,
  DatePicker
} from 'antd';
import moment from 'moment';

import TableData from '../../common/data/TableData';
import './Compact.less';
import http from 'Util20/api';

const contractHistoryResid = '436624421847'; //合同历史记录
const mailHis = '641216663667'; //邮件提醒历史记录
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const CheckboxOptions = ['一线员工', '办公室员工'];
const CheckboxOptionsMap = {
  一线员工: '产线',
  办公室员工: '办公室'
};
const filterTab1 = [
  {
    label: '在职人员',
    resid: '440237518278'
  },
  {
    label: '离职人员',
    resid: '437092525908'
  },
  {
    label: '全部人员',
    resid: '436624135588'
  },
  {
    label: '合同历史信息',
    resid: '436624421847'
  }
];
const filterTab2A = [
  {
    label: '待发送邮件(待续签提醒)',
    resid: '640264082868'
  },
  {
    label: '已发送邮件(待续签提醒)',
    resid: '640264102764'
  },
  {
    label: '所有记录',
    resid: '640264137935'
  }
];
const filterTab2B = [
  {
    label: 'DL',
    cms: `C3_640119278050= 'DL'`
  },
  {
    label: 'IDL',
    cms: `C3_640119278050= 'IDL'`
  }
];
const filterTab3A = [
  {
    label: '办公室员工'
  },
  {
    label: '一线员工'
  }
];
const filterTab3B = [
  {
    condition: 'DL',
    label: '员工意向确认',
    resid: '668712593119'
  },
  {
    condition: 'DL',
    label: '一级部门经理审批',
    resid: '668710715266'
  },
  {
    condition: 'DL',
    label: '部门总监审批',
    resid: '668712440510'
  },
  {
    condition: 'IDL',
    label: '主管审批',
    resid: '668709373267'
  },
  {
    condition: 'IDL',
    label: '经理审批',
    resid: '668710368892'
  }
];
class Compact extends Component {
  constructor(props) {
    super(props);
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let jobId = userInfo.UserInfo.EMP_ID;
    this.state = {
      jobId: jobId,
      key1: '_0A',
      ke2: '_0B',
      key3: '_03A',
      key4: '_03B',
      residTab3: '668712593119',
      residTab1: '440237518278',
      residTab2: '640264082868',
      cms: `C3_532015901062 != 'N' and C3_532015901062 != 'Y' and C3_532015785778 = '${jobId}'`,
      cms2: `C3_640119278050= 'DL'`,
      selectedPerson: {},
      selectedPersons: [],
      contractHistoryVisible: false,
      checkboxOptions: CheckboxOptions,
      signingDate: null,
      signingVisible: false,
      signingLoading: false,
      showCheck: false,
      checkMem: '',
      checkType: '',
      loading: false
    };
  }
  changeDate = v => {
    let str =
      moment(v[0]).format('YYYY-MM-DD hh:mm:ss') +
      ' ~ ' +
      moment(v[1]).format('YYYY-MM-DD hh:mm:ss');
    this.setState({ signingDate: v, meetTime: str });
  };
  /**
   * 重新发送提醒邮件=清空后台已发送邮件的字段
   */
  handleRemail = async record => {
    this.setState({ loading: true });
    if (record.selectedRowKeys.length < 1) {
      message.error('请先选择记录！');
      this.setState({ loading: false });
    } else {
      const data = record.dataSource;
      let Reldata = [];
      data.map(item => {
        record.selectedRowKeys.map(items => {
          if (item.REC_ID === items) {
            Reldata.push(item);
          }
        });
      });
      let obj = {};
      let resid;
      let toChange;
      //C3_640795239364 咨询员工意向已发
      //C3_489008835622提醒第一审批人已发
      //C3_641226096054部门总监审批已发

      //C3_640820671962是否已经发送(表640820603954)

      resid = '436624135588';

      // if (this.state.key4 === '_03B') {
      //   toChange = 'C3_640795239364';
      // } else if (this.state.key4 === '_13B') {
      //   toChange = 'C3_489008835622';
      // } else if (this.state.key4 === '_23B') {
      //   toChange = 'C3_641226096054';
      // } else {
      //   toChange = 'C3_640820671962';
      // }
      if (this.state.key4 == '_33B') {
        toChange = 'C3_669745543191';
      } else {
        toChange = 'C3_669745551472';
      }
      let toSend = [];
      let n = 0;
      while (n < Reldata.length) {
        toSend.push({
          REC_ID: Reldata[n].REC_ID,
          [toChange]: ''
        });
        n++;
      }
      obj = {
        resid,
        data: toSend
      };
      // console.log(obj);
      try {
        let res = await http().modifyRecords(obj);
        this.setState({ loading: false });
        message.success('操作成功');
        this.tableDataRef3.handleRefresh();
      } catch (e) {
        console.log(e.message);
        this.setState({ loading: false });
      }
    }
  };
  /**
   * 发送签约邮件
   */
  handleSendEmail = async persons => {
    try {
      await http().modifyRecords({
        resid: '640264082868',
        data: persons
      });
      this.setState({
        signingLoading: false,
        signingVisible: false,
        selectedPersons: [],
        signingDate: null
      });
      message.success('操作成功');
      this.tableDataRef2.handleRefresh();
    } catch (error) {
      message.error(error.message);
      console.error(error);
      this.setState({ signingLoading: false });
    }
  };
  // 发送提醒审批邮件
  // sendMail=async(data)=>{
  //   this.setState({loading:true});
  //   console.log(data)
  // 工号
  // 姓名
  // 合同类别
  // 合同期开始
  // 合同期结束
  // var obj={
  //   C3_641217561996:'Y',//发送邮件
  //   C3_641218070825:data.C3_532015785778,//工号
  //   C3_641218081651:data.C3_532015800738,//姓名
  //   C3_641218091102:data.C3_640790367952,//合同类别
  //   C3_641218115536:data.C3_640790368615,//合同期开始
  //   C3_641218133499:data.C3_640790368858,//合同期截止
  //   C3_641218180355:data.C3_640790990665,//审批人工号
  //   C3_641218158590:'',//审批人邮箱
  //   C3_641218180355:'',//审批人工号
  //   C3_641218170823:'',//审批人编号
  // }

  //   try{
  //     let res = http().addRecords({
  //       resid:mailHis,
  //       data:[obj]

  //     })
  //   message.success('提醒邮件发送成功');
  //   this.setState({loading:false});

  //   }catch(e){
  //     console.log(e.message)
  //   }
  // }

  handleConfirm = (persons, signing) => {
    let names = '';
    persons.forEach(item => {
      item.C3_640119291887 = signing ? 'Y' : 'N';
      names += item.C3_436624213122 + ';';
    });
    Modal.confirm({
      title: '确认签约状态',
      content: (
        <div>
          {names} {signing ? '已签约' : '不签约'}
        </div>
      ),
      onOk: async () => {
        try {
          await http().modifyRecords({
            resid: '640264102764',
            data: persons
          });
          message.success('操作成功');
          this.tableDataRef2.handleRefresh();
        } catch (error) {
          message.error(error.message);
          console.error(error);
        }
      }
    });
  };
  refre = () => {
    if (this.tableDataRef) {
      this.tableDataRef.handleRefresh();
    }
    if (this.tableDataRef2) {
      this.tableDataRef2.handleRefresh();
    }
    if (this.tableDataRef3) {
      this.tableDataRef3.handleRefresh();
    }
  };
  render() {
    const {
      selectedPerson,
      contractHistoryVisible,
      residTab2,
      checkboxOptions,
      signingDate,
      signingVisible,
      selectedPersons,
      key1,
      signingLoading
    } = this.state;
    return (
      <div className="Compact">
        <Tabs
          defaultActiveKey="1"
          onTabClick={() => {
            this.refre();
          }}
          style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}
        >
          <TabPane
            // forceRender={true}
            tab="合同信息"
            key="1"
            style={{ width: '100%', height: 'calc(100vh - 64px)' }}
          >
            <div className="filterLine">
              {filterTab1.map((item, key) => {
                return (
                  <span
                    className={
                      this.state.residTab1 == item.resid
                        ? 'filter current'
                        : 'filter'
                    }
                    key={'_' + key}
                    onClick={() => {
                      this.setState({ residTab1: item.resid });
                    }}
                  >
                    {item.label}
                  </span>
                );
              })}
            </div>
            <div className="Tab1Outer">
              {this.state.residTab1 == '440237518278' ? (
                <TableData
                  resid={440237518278}
                  subtractH={180}
                  isUseBESize={true}
                  // tableComponent="ag-grid"
                  // sideBarAg={true}
                  hasAdvSearch={true}
                  hasAdd={false}
                  hasRowView={true}
                  recordFormUseAbsolute={true}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  hasRowModify={true}
                  hasDelete={false}
                  hasModify={false}
                  hasBeBtns={false}
                  hasRowSelection={false}
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  customRowBtns={[
                    (record, btnSize) => {
                      return (
                        <Button
                          size={btnSize}
                          onClick={() => {
                            this.setState({
                              selectedPerson: record,
                              contractHistoryVisible: true
                            });
                          }}
                        >
                          查看历史信息
                        </Button>
                      );
                    }
                  ]}
                />
              ) : null}
              {this.state.residTab1 == '437092525908' ? (
                <TableData
                  resid={437092525908}
                  isUseBESize={true}
                  subtractH={180}
                  // tableComponent="ag-grid"
                  // sideBarAg={true}
                  hasAdvSearch={true}
                  hasAdd={false}
                  hasRowView={true}
                  recordFormUseAbsolute={true}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  hasRowModify={true}
                  hasDelete={false}
                  hasModify={false}
                  hasBeBtns={false}
                  hasRowSelection={false}
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  customRowBtns={[
                    (record, btnSize) => {
                      return (
                        <Button
                          size={btnSize}
                          onClick={() => {
                            this.setState({
                              selectedPerson: record,
                              contractHistoryVisible: true
                            });
                          }}
                        >
                          查看历史信息
                        </Button>
                      );
                    }
                  ]}
                />
              ) : null}

              {this.state.residTab1 == '436624421847' ? (
                <TableData
                  resid={436624421847}
                  subtractH={180}
                  isUseBESize={true}
                  // tableComponent="ag-grid"
                  // sideBarAg={true}
                  hasAdvSearch={true}
                  hasAdd={false}
                  hasRowView={true}
                  recordFormUseAbsolute={true}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  hasRowModify={false}
                  hasDelete={false}
                  hasModify={false}
                  hasBeBtns={false}
                  hasRowSelection={false}
                  wrappedComponentRef={element => (this.tableDataRef = element)}

                  // customRowBtns={[
                  //   (record, btnSize) => {
                  //     return (
                  //       <Button
                  //         size={btnSize}
                  //         onClick={() => {

                  //           this.setState({
                  //             selectedPerson: record,
                  //             contractHistoryVisible: true
                  //           });
                  //           console.log(record)
                  //         }}
                  //       >
                  //         查看历史信息
                  //       </Button>
                  //     );
                  //   }
                  // ]}
                />
              ) : null}

              {this.state.residTab1 == '436624135588' ? (
                <TableData
                  resid={436624135588}
                  isUseBESize={true}
                  subtractH={180}
                  // tableComponent="ag-grid"
                  // sideBarAg={true}
                  hasAdvSearch={true}
                  hasAdd={false}
                  hasRowView={true}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  hasRowModify={true}
                  hasDelete={false}
                  recordFormUseAbsolute={true}
                  hasModify={false}
                  hasBeBtns={false}
                  hasRowSelection={false}
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  customRowBtns={[
                    (record, btnSize) => {
                      return (
                        <Button
                          size={btnSize}
                          onClick={() => {
                            this.setState({
                              selectedPerson: record,
                              contractHistoryVisible: true
                            });
                          }}
                        >
                          查看历史信息
                        </Button>
                      );
                    }
                  ]}
                />
              ) : null}
            </div>
          </TabPane>
          <TabPane
            // forceRender={true}

            tab="人员续签"
            key="2"
            style={{ width: '100%', height: 'calc(100vh - 64px)' }}
          >
            <div className="filterLine">
              {filterTab2A.map((item, key) => {
                return (
                  <span
                    className={
                      key1 == '_' + key + 'A' ? 'filter current' : 'filter'
                    }
                    key={'_' + key + 'A'}
                    onClick={() => {
                      this.setState({
                        key1: '_' + key + 'A',
                        residTab2: item.resid,
                        cms1:
                          item.cms +
                          `and C3_532015785778 = '${this.state.jobId}'`
                      });
                    }}
                  >
                    {item.label}
                  </span>
                );
              })}
            </div>
            <div className="filterLine">
              <div style={{ padding: '0 16px' }}>
                <Checkbox.Group
                  options={CheckboxOptions}
                  value={checkboxOptions}
                  onChange={value => {
                    this.setState({ checkboxOptions: value });
                  }}
                />
              </div>
            </div>
            <div
              className="Tab1Outer"
              style={{ height: 'calc(100vh - 125px)' }}
            >
              {residTab2 == 640264082868 ? (
                <TableData
                  resid={640264082868}
                  isUseBESize={true}
                  subtractH={220}
                  hasAdd={false}
                  hasRowView={true}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  hasDelete={false}
                  hasModify={false}
                  hasBeBtns={true}
                  recordFormUseAbsolute={true}
                  hasRowModify={false}
                  hasRowSelection={true}
                  wrappedComponentRef={element =>
                    (this.tableDataRef2 = element)
                  }
                  refTargetComponentName="TableData"
                  cmswhere={
                    checkboxOptions.length !== 1
                      ? checkboxOptions.length === 2
                        ? ''
                        : `1 = 2`
                      : `C3_668601864440  = '${
                          CheckboxOptionsMap[checkboxOptions[0]]
                        }'`
                  }
                  actionBarExtra={({ dataSource, selectedRowKeys }) => {
                    return (
                      <>
                        {key1 == '_0A' ? (
                          <>
                            <Button
                              size="small"
                              type="primary"
                              onClick={() => {
                                if (selectedRowKeys.length) {
                                  let selectedRecords = selectedRowKeys.map(
                                    key => {
                                      return {
                                        ...dataSource.find(item => {
                                          return item.REC_ID === key;
                                        })
                                      };
                                    }
                                  );
                                  this.setState({
                                    signingVisible: true,
                                    selectedPersons: selectedRecords
                                  });
                                } else {
                                  message.info('请勾选记录！');
                                }
                              }}
                            >
                              发送通知邮件
                            </Button>
                          </>
                        ) : null}
                      </>
                    );
                  }}
                  customRowBtns={
                    key1 === '_0A'
                      ? [
                          (record, btnSize) => {
                            return (
                              <>
                                <Button
                                  size={btnSize}
                                  onClick={() => {
                                    this.setState({
                                      selectedPersons: [record],
                                      signingVisible: true
                                    });
                                  }}
                                  type="primary"
                                >
                                  发送通知邮件
                                </Button>

                                <Button
                                  size="small"
                                  style={{ marginLeft: '4px' }}
                                  onClick={() => {
                                    this.setState({
                                      showCheck: true,
                                      checkMem: record.C3_436624212137,
                                      checkType: record.C3_640119278050
                                    });
                                  }}
                                >
                                  查看审批节点
                                </Button>
                              </>
                            );
                          }
                        ]
                      : []
                  }
                />
              ) : null}
              {residTab2 == 640264102764 ? (
                <TableData
                  resid={640264102764}
                  subtractH={220}
                  hasAdd={false}
                  isUseBESize={true}
                  hasRowView={true}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  recordFormUseAbsolute={true}
                  hasDelete={false}
                  hasModify={false}
                  hasBeBtns={true}
                  hasRowModify={false}
                  hasRowSelection={true}
                  wrappedComponentRef={element =>
                    (this.tableDataRef2 = element)
                  }
                  refTargetComponentName="TableData"
                  cmswhere={
                    checkboxOptions.length !== 1
                      ? checkboxOptions.length === 2
                        ? ''
                        : `1 = 2`
                      : `C3_668601864440= '${
                          CheckboxOptionsMap[checkboxOptions[0]]
                        }'`
                  }
                  actionBarExtra={({ dataSource, selectedRowKeys }) => {
                    return (
                      <>
                        {key1 == '_0A' ? (
                          <>
                            <Button
                              size="small"
                              type="primary"
                              onClick={() => {
                                if (selectedRowKeys.length) {
                                  let selectedRecords = selectedRowKeys.map(
                                    key => {
                                      return {
                                        ...dataSource.find(item => {
                                          return item.REC_ID === key;
                                        })
                                      };
                                    }
                                  );
                                  this.setState({
                                    signingVisible: true,
                                    selectedPersons: selectedRecords
                                  });
                                } else {
                                  message.info('请勾选记录！');
                                }
                              }}
                            >
                              发送通知邮件
                            </Button>
                          </>
                        ) : null}
                      </>
                    );
                  }}
                  customRowBtns={[
                    record => {
                      return (
                        <Button
                          size="small"
                          onClick={() => {
                            this.setState({
                              showCheck: true,
                              checkMem: record.C3_436624212137,
                              checkType: record.C3_640119278050
                            });
                          }}
                        >
                          查看审批节点
                        </Button>
                      );
                    }
                  ]}
                />
              ) : null}
              {residTab2 == 640264137935 ? (
                <TableData
                  resid={640264137935}
                  subtractH={220}
                  hasAdd={false}
                  isUseBESize={true}
                  hasRowView={true}
                  recordFormUseAbsolute={true}
                  hasRowDelete={false}
                  hasRowEdit={false}
                  hasDelete={false}
                  hasModify={false}
                  hasBeBtns={true}
                  hasRowModify={false}
                  hasRowSelection={true}
                  wrappedComponentRef={element =>
                    (this.tableDataRef2 = element)
                  }
                  refTargetComponentName="TableData"
                  cmswhere={
                    checkboxOptions.length !== 1
                      ? checkboxOptions.length === 2
                        ? ''
                        : `1 = 2`
                      : `C3_668601864440= '${
                          CheckboxOptionsMap[checkboxOptions[0]]
                        }'`
                  }
                  actionBarExtra={({ dataSource, selectedRowKeys }) => {
                    return (
                      <>
                        {key1 == '_0A' ? (
                          <>
                            <Button
                              size="small"
                              type="primary"
                              onClick={() => {
                                if (selectedRowKeys.length) {
                                  let selectedRecords = selectedRowKeys.map(
                                    key => {
                                      return {
                                        ...dataSource.find(item => {
                                          return item.REC_ID === key;
                                        })
                                      };
                                    }
                                  );
                                  this.setState({
                                    signingVisible: true,
                                    selectedPersons: selectedRecords
                                  });
                                } else {
                                  message.info('请勾选记录！');
                                }
                              }}
                            >
                              发送通知邮件
                            </Button>
                          </>
                        ) : null}
                      </>
                    );
                  }}
                  customRowBtns={[
                    record => {
                      return (
                        <Button
                          size="small"
                          onClick={() => {
                            this.setState({
                              showCheck: true,
                              checkMem: record.C3_436624212137,
                              checkType: record.C3_640119278050
                            });
                          }}
                        >
                          查看审批节点
                        </Button>
                      );
                    }
                  ]}
                />
              ) : null}
            </div>
          </TabPane>
          <TabPane
            tab="审批节点一览"
            key="3"
            style={{ width: '100%', height: 'calc(100vh - 64px)' }}
          >
            <div className="filterLine">
              {filterTab3A.map((item, key) => {
                return (
                  <span
                    className={
                      this.state.key3 == '_' + key + '3A'
                        ? 'filter current'
                        : 'filter'
                    }
                    key={'_' + key + '3A'}
                    onClick={() => {
                      if (this.state.key3 != '_' + key + '3A') {
                        if (item.label == '一线员工') {
                          this.setState({
                            key4: '_33B',
                            residTab3: '668709373267'
                          });
                        } else {
                          this.setState({
                            key4: '_03B',
                            residTab3: '668712593119'
                          });
                        }
                      }
                      this.setState({
                        key3: '_' + key + '3A'
                      });
                    }}
                  >
                    {item.label}
                  </span>
                );
              })}
            </div>
            <div className="filterLine">
              {filterTab3B.map((item, key) => {
                return (
                  <span
                    className={
                      this.state.key4 == '_' + key + '3B'
                        ? 'filter current'
                        : 'filter'
                    }
                    style={{
                      display:
                        (this.state.key3 === ('_03A' || '_13A') &&
                          item.condition == 'DL') ||
                        (this.state.key3 != ('_03A' || '_13A') &&
                          item.condition == 'IDL')
                          ? 'inline'
                          : 'none'
                    }}
                    key={'_' + key + '3B'}
                    onClick={() => {
                      this.setState({
                        key4: '_' + key + '3B',
                        residTab3: item.resid
                      });
                    }}
                  >
                    {item.label}
                  </span>
                );
              })}
            </div>
            <div style={{ width: '100%', height: 'calc(100vh - 128px)' }}>
              <TableData
                resid={this.state.residTab3}
                subtractH={220}
                isUseBESize={true}
                hasAdd={false}
                hasRowView={true}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasBeBtns={true}
                hasRowModify={false}
                hasRowSelection={true}
                wrappedComponentRef={element => (this.tableDataRef3 = element)}
                refTargetComponentName="TableData"
                actionBarExtra={record => {
                  return this.state.key3 === '_13A' ? (
                    <Button
                      type="primary"
                      loading={this.state.loading}
                      onClick={() => {
                        this.handleRemail(record);
                      }}
                    >
                      再次发送提醒邮件
                    </Button>
                  ) : null;
                }}
              />
            </div>
          </TabPane>
          {/* <TabPane
          // forceRender={true}

            tab="邮件提醒发送历史"
            key="3"
            style={{ width: '100%', height: 'calc(100vh - 64px)' }}
          >
            <TableData
                resid={mailHis}
                subtractH={220}
                hasAdd={false}
                hasRowView={true}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasBeBtns={true}
                hasRowModify={false}
                hasRowSelection={true}
                wrappedComponentRef={element => (this.tableDataRef3 = element)}
                refTargetComponentName="TableData"
                tableComponent='ag-grid'
              />
          </TabPane> */}
        </Tabs>
        <Modal
          title="审批节点"
          width={'90vw'}
          visible={this.state.showCheck}
          footer={null}
          onCancel={() => {
            this.setState({
              showCheck: false,
              checkMem: '',
              checkType: ''
            });
          }}
        >
          <div style={{ height: '80vh' }}>
            <TableData
              resid={640899304937}
              subtractH={220}
              hasAdd={false}
              recordFormUseAbsolute={true}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasBeBtns={true}
              hasRowModify={false}
              hasRowSelection={true}
              wrappedComponentRef={element => (this.tableDataRef = element)}
              cmswhere={`C3_532015785778 = '${this.state.checkMem}' and C3_641241582139 = '${this.state.checkType}'`}
              // customRowBtns={[(record)=>{return(
              //   <Button size='small' loading={this.state.loading} onClick={()=>{this.sendMail(record)}}>发送邮件提醒审批</Button>
              // )}]
              // }
            />
          </div>
        </Modal>
        <Modal
          title="合同历史信息"
          width="80vw"
          visible={contractHistoryVisible}
          onCancel={() =>
            this.setState({
              selectedPerson: {},
              contractHistoryVisible: false
            })
          }
          destroyOnClose
          footer={null}
        >
          <div style={{ height: '80vh' }}>
            <TableData
              resid={contractHistoryResid}
              subtractH={220}
              isUseBESize={true}
              // tableComponent="ag-grid"
              // sideBarAg={true}
              hasAdvSearch={false}
              hasAdd={false}
              hasRowView={true}
              hasRowDelete={false}
              hasRowEdit={false}
              hasRowModify={false}
              hasDelete={false}
              hasModify={false}
              recordFormUseAbsolute={true}
              hasBeBtns={false}
              hasRowSelection={false}
              cmswhere={`C3_436624448098 = '${selectedPerson.C3_436624212137}'`}
            />
          </div>
        </Modal>
        <Modal
          title="选择签约起止时间"
          width={400}
          visible={signingVisible}
          onOk={() => {
            if (!signingDate) {
              return message.info('请选择签约日期');
            }
            this.setState({ signingLoading: true });

            selectedPersons.forEach(item => {
              item.C3_49158meetDa0883247 = 'Y';
              item.meetDate = this.state.meetTime;
            });
            this.handleSendEmail(selectedPersons);
          }}
          onCancel={() => {
            this.setState({
              signingVisible: false,
              signingDate: null,
              selectedPersons: []
            });
          }}
          confirmLoading={signingLoading}
        >
          <RangePicker
            // showToday
            showTime
            value={signingDate}
            onChange={v => this.changeDate(v)}
          />
        </Modal>
      </div>
    );
  }
}

export default Compact;
