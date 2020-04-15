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
import TableData from '../../common/data/TableData';
import './Compact.less';
import http from 'Util20/api';

const contractHistoryResid = '436624421847'; //合同历史记录
const { TabPane } = Tabs;
const CheckboxOptions = ['DL', 'IDL'];
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
  }
];
const filterTab2A = [
  {
    label: '待发送邮件',
    resid: '640264082868'
  },
  {
    label: '已发送邮件',
    resid: '640264102764'
  },
  {
    label: '不签约合同',
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
class Compact extends Component {
  constructor(props) {
    super(props);
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let jobId = userInfo.UserInfo.EMP_ID;
    this.state = {
      jobId: jobId,
      key1: '_0A',
      ke2: '_0B',
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
      signingLoading: false
    };
  }

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
      this.tableDataRef.handleRefresh();
    } catch (error) {
      message.error(error.message);
      console.error(error);
      this.setState({ signingLoading: false });
    }
  };

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
          this.tableDataRef.handleRefresh();
        } catch (error) {
          message.error(error.message);
          console.error(error);
        }
      }
    });
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
          style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}
        >
          <TabPane
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
              <TableData
                resid={this.state.residTab1}
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
                hasModify={false}
                hasBeBtns={false}
                hasRowSelection={false}
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
            </div>
          </TabPane>
          <TabPane
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
              <TableData
                resid={residTab2}
                subtractH={220}
                hasAdd={false}
                hasRowView={true}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasBeBtns={false}
                hasRowModify={false}
                hasRowSelection={true}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                cmswhere={
                  checkboxOptions.length !== 1
                    ? ''
                    : `C3_640119278050 = '${checkboxOptions[0]}'`
                }
                actionBarExtra={({ dataSource, selectedRowKeys }) => {
                  return (
                    <>
                      {key1 == '_1A' ? (
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
                                this.handleConfirm(selectedRecords, true);
                              } else {
                                message.info('请勾选记录！');
                              }
                            }}
                          >
                            选中人已签约
                          </Button>
                          <Button
                            size="small"
                            type="danger"
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
                                this.handleConfirm(selectedRecords, false);
                              } else {
                                message.info('请勾选记录！');
                              }
                            }}
                          >
                            选中人不签约
                          </Button>
                        </>
                      ) : null}
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
                          );
                        }
                      ]
                    : key1 === '_1A'
                    ? [
                        (record, btnSize) => {
                          return (
                            <Button
                              size={btnSize}
                              onClick={() => {
                                this.handleConfirm([record], true);
                              }}
                              type="primary"
                            >
                              该员工已签约
                            </Button>
                          );
                        },
                        (record, btnSize) => {
                          return (
                            <Button
                              size={btnSize}
                              onClick={() => {
                                this.handleConfirm([record], false);
                              }}
                              type="danger"
                              style={{ marginLeft: 8 }}
                            >
                              该员工不签约
                            </Button>
                          );
                        }
                      ]
                    : []
                }
              />
            </div>
          </TabPane>
        </Tabs>
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
              hasBeBtns={false}
              hasRowSelection={false}
              cmswhere={`C3_436624448098 = '${selectedPerson.C3_436624212137}'`}
            />
          </div>
        </Modal>
        <Modal
          title="选择签约日期"
          width={300}
          visible={signingVisible}
          onOk={() => {
            if (!signingDate) {
              return message.info('请选择签约日期');
            }
            this.setState({ signingLoading: true });

            selectedPersons.forEach(item => {
              item.C3_491580883247 = 'Y';
              item.meetDate = signingDate;
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
          <DatePicker
            showToday
            value={signingDate}
            onChange={v => this.setState({ signingDate: v })}
          />
        </Modal>
      </div>
    );
  }
}

export default Compact;
