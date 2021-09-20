import React from 'react';
import http from 'Util20/api';
import { Icon, Tabs, Button, Modal, Upload, message } from 'antd';
import './AssessControl.less';
import { TableData } from 'pw-components';
import AddDoorsModal from '../AddDoorsModal';
import ModifyDoorsModal from '../ModifyDoorsModal';

import AddPersonGroupByImportExcel from '../AddPersonGroupByImportExcel';

import AddPersonsByOrgModal from '../AddPersonsByOrgModal';
import ModifyPersonsByOrgModal from '../ModifyPersonsByOrgModal';

const { TabPane } = Tabs;

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

/**
 * 分组管理
 */
class OrganizationManagement extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isViewPersonModalOpen: false, //控制查看人员信息模态窗
      isDeleteOrgModalOpen: false, //控制删除门禁分组信息模态窗
      isViewEntranceModalOpen: false, //控制查看门禁点信息模态窗
      needRemoveData: {}, //待删除数据
      selectedRowData: {}, //选中行的数据
      isImportExcelModalOpen: false,
      addDoorVisible: false,
      modifyDoorsVisible: false,
      modifyRecord: null,
      doorsTableKey: 0,
      addPersonVisible: false,
      personGroupKey: 0,
      modifyPersonsVisible: false,
      selectedPersonGroupRecord: null
    };
  }

  /**
   * 删除分组，分为单独删除和批量删除
   *@param {String} 删除分组类型 org--门禁 person--人员
   */
  removeOrg = async type => {
    const { needRemoveData } = this.state;
    const mainTableResid = type === 'org' ? '682695547484' : '682695515421';
    const sonTableResid = type === 'org' ? '682695559871' : '682695529883';
    let result1,
      result2 = null;
    let count = 0;
    needRemoveData.map(async item => {
      try {
        result1 = await http({ baseURL: realsunApiBaseURL }).removeRecords({
          resid: mainTableResid,
          data: [{ REC_ID: item.REC_ID }]
        });
        result2 = await http({ baseURL: realsunApiBaseURL }).removeRecords({
          resid: sonTableResid,
          data: [{ REC_ID: item.REC_ID }]
        });
        count++;
        if (count === needRemoveData.length) {
          this.setState({
            isDeleteOrgModalOpen: false
          });
          this.tableDataRef.handleRefresh();
          message.success('删除成功');
        }
      } catch (error) {
        message.error(error.message);
        console.log(error.message);
      }
    });
  };

  /**
   * 关闭所有模态框
   */
  closeAllModal = () => {
    this.setState({
      isViewPersonModalOpen: false,
      isDeleteOrgModalOpen: false,
      isViewEntranceModalOpen: false,
      isImportExcelModalOpen: false
    });
  };

  render() {
    const {
      isViewPersonModalOpen,
      isDeleteOrgModalOpen,
      needRemoveData,
      selectedRowData,
      isViewEntranceModalOpen,
      isImportExcelModalOpen
    } = this.state;
    return (
      <div className="OrganizationManagement">
        <Tabs defaultActiveKey="entrance">
          <TabPane tab="门禁分组" key="entrance">
            <div className="body-tip">
              <Icon
                type="question-circle"
                style={{ color: '#2196f3', marginRight: '16px' }}
              />
              <span>将相同属性的门禁点归为1组，便于批量配置权限。</span>
            </div>
            <div>
              <TableData
                key={this.state.doorsTableKey}
                resid={683210011323}
                baseURL={realsunApiBaseURL}
                height={'calc(100vh - 138px)'}
                subtractH={190}
                hasAdd={false}
                hasModify={false}
                hasRowEdit={false}
                hasRowModify={false}
                hasRowView={false}
                hasRowSelection={true}
                actionBarExtra={this.actionBarExtra}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                actionBarExtra={(
                  dataSource,
                  selectedRowKeys,
                  data,
                  recordFormData,
                  size
                ) => {
                  return (
                    <div>
                      <Button
                        type="primary"
                        key="4"
                        onClick={() => this.setState({ addDoorVisible: true })}
                        size="small"
                      >
                        添加
                      </Button>
                    </div>
                  );
                }}
                customRowBtns={[
                  (record, btnSize) => {
                    return (
                      <Button
                        key="1"
                        size={btnSize}
                        onClick={() =>
                          this.setState({
                            modifyDoorsVisible: true,
                            modifyRecord: record
                          })
                        }
                      >
                        编辑
                      </Button>
                    );
                  },
                  (record, btnSize) => {
                    return (
                      <Button
                        key="3"
                        onClick={() => {
                          this.setState({
                            isViewEntranceModalOpen: true,
                            selectedRowData: record
                          });
                        }}
                      >
                        详情
                      </Button>
                    );
                  }
                ]}
              />

              {this.state.addDoorVisible && (
                <AddDoorsModal
                  visible={this.state.addDoorVisible}
                  onSuccess={() =>
                    this.setState({
                      addDoorVisible: false,
                      doorsTableKey: this.state.doorsTableKey + 1
                    })
                  }
                  onCancel={() => this.setState({ addDoorVisible: false })}
                ></AddDoorsModal>
              )}
              {this.state.modifyDoorsVisible && (
                <ModifyDoorsModal
                  visible={this.state.modifyDoorsVisible}
                  record={this.state.modifyRecord}
                  onSuccess={() =>
                    this.setState({
                      modifyDoorsVisible: false,
                      modifyRecord: null,
                      doorsTableKey: this.state.doorsTableKey + 1
                    })
                  }
                  onCancel={() => this.setState({ modifyDoorsVisible: false })}
                ></ModifyDoorsModal>
              )}
            </div>

            <Modal
              visible={isViewEntranceModalOpen}
              title="门禁分组详情"
              onCancel={() => this.setState({ isViewEntranceModalOpen: false })}
              width={1180}
              destroyOnClose
              footer={null}
            >
              <div>
                <div className="modal-info">
                  <h2>基本信息</h2>
                  <div className="modal-text">
                    <h4>门禁分组名称</h4>
                    <p>{selectedRowData.name}</p>
                  </div>
                  <div className="modal-text">
                    <h4>描述</h4>
                    <p>{selectedRowData.describe}</p>
                  </div>
                  <div className="modal-table">
                    <h2>门禁点列表</h2>
                    <TableData
                      dataMode="sub"
                      hostrecid={selectedRowData.REC_ID}
                      resid={683210011323}
                      subresid={682507735244}
                      baseURL={realsunApiBaseURL}
                      height={420}
                      subtractH={170}
                      hasAdd={false}
                      hasModify={false}
                      hasDelete={false}
                      hasRowEdit={false}
                      hasRowModify={false}
                      hasRowView={false}
                      hasRowDelete={false}
                      hasImport={false}
                      hasDownload={false}
                      hasAdvSearch={false}
                      hasZoomInOut={false}
                      importConfig={null}
                    />
                  </div>
                </div>
              </div>
            </Modal>
          </TabPane>
          <TabPane tab="人员分组" key="person">
            <div className="body-tip">
              <Icon
                type="question-circle"
                style={{ color: '#2196f3', marginRight: '16px' }}
              />
              <span>
                将拥有相同权限的人员归为1组，便于批量配置权限，可“按人员分组配置权限”。
              </span>
            </div>
            <div>
              <TableData
                key={this.state.personGroupKey}
                resid={683209898302}
                baseURL={realsunApiBaseURL}
                height={'calc(100vh - 138px)'}
                subtractH={190}
                hasAdd={false}
                hasModify={false}
                hasRowEdit={false}
                hasRowModify={false}
                hasRowView={false}
                hasRowSelection={true}
                actionBarExtra={this.actionBarExtra}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                actionBarExtra={(
                  dataSource,
                  selectedRowKeys,
                  data,
                  recordFormData,
                  size
                ) => {
                  return (
                    <div>
                      <Button
                        type="primary"
                        key="4"
                        onClick={() =>
                          this.setState({ addPersonVisible: true })
                        }
                        size="small"
                      >
                        按组织添加
                      </Button>
                      <Button
                        type="primary"
                        key="5"
                        onClick={() => {
                          this.setState({
                            isImportExcelModalOpen: true
                          });
                        }}
                        size="small"
                      >
                        Excel导入添加
                      </Button>
                    </div>
                  );
                }}
                customRowBtns={[
                  (record, btnSize) => {
                    return (
                      <Button
                        key="1"
                        onClick={() =>
                          this.setState({
                            modifyPersonsVisible: true,
                            selectedPersonGroupRecord: record
                          })
                        }
                        size={btnSize}
                      >
                        编辑
                      </Button>
                    );
                  },
                  // (record, btnSize) => {
                  //   return (
                  //     <Button
                  //       key="2"
                  //       onClick={() => {
                  //         this.setState({
                  //           isDeleteOrgModalOpen: true,
                  //           needRemoveData: [record]
                  //         });
                  //       }}
                  //     >
                  //       删除
                  //     </Button>
                  //   );
                  // },
                  (record, btnSize) => {
                    return (
                      <Button
                        key="3"
                        onClick={() => {
                          this.setState({
                            isViewPersonModalOpen: true,
                            selectedRowData: record
                          });
                        }}
                      >
                        详情
                      </Button>
                    );
                  }
                ]}
              />

              {/* 通过Excel导入人员分组信息 */}
              {isImportExcelModalOpen && (
                <AddPersonGroupByImportExcel
                  visible={isImportExcelModalOpen}
                  onCancel={() =>
                    this.setState({ isImportExcelModalOpen: false })
                  }
                  onSuccess={() => {
                    this.setState({
                      isImportExcelModalOpen: false,
                      personGroupKey: this.state.personGroupKey + 1
                    });
                  }}
                ></AddPersonGroupByImportExcel>
              )}

              {this.state.addPersonVisible && (
                <AddPersonsByOrgModal
                  visible={this.state.addPersonVisible}
                  onSuccess={() =>
                    this.setState({
                      addPersonVisible: false,
                      personGroupKey: this.state.personGroupKey + 1
                    })
                  }
                  onCancel={() => this.setState({ addPersonVisible: false })}
                ></AddPersonsByOrgModal>
              )}
              {this.state.selectedPersonGroupRecord && (
                <ModifyPersonsByOrgModal
                  record={this.state.selectedPersonGroupRecord}
                  visible={this.state.modifyPersonsVisible}
                  onSuccess={() =>
                    this.setState({
                      modifyPersonsVisible: false,
                      personGroupKey: this.state.personGroupKey + 1,
                      selectedPersonGroupRecord: null
                    })
                  }
                  onCancel={() =>
                    this.setState({
                      modifyPersonsVisible: false,
                      selectedPersonGroupRecord: null
                    })
                  }
                ></ModifyPersonsByOrgModal>
              )}

              <Modal
                title="人员分组详情"
                visible={isViewPersonModalOpen}
                onCancel={() => this.setState({ isViewPersonModalOpen: false })}
                width={1180}
                footer={null}
                destroyOnClose
              >
                <div>
                  <div className="modal-info">
                    <h2>基本信息</h2>
                    <div className="modal-text">
                      <h4>人员分组名称</h4>
                      <p>{selectedRowData.name}</p>
                    </div>
                    <div className="modal-text">
                      <h4>描述</h4>
                      <p>{selectedRowData.describe}</p>
                    </div>
                    <div className="modal-table">
                      <h2>人员列表</h2>
                      <TableData
                        resid={682695529883}
                        baseURL={realsunApiBaseURL}
                        cmswhere={`groupId = '${selectedRowData.groupId}'`}
                        height={420}
                        subtractH={170}
                        hasAdd={false}
                        hasModify={false}
                        hasDelete={false}
                        hasRowEdit={false}
                        hasRowModify={false}
                        hasRowView={false}
                        hasRowDelete={false}
                        hasDownload={false}
                        hasAdvSearch={false}
                        hasZoomInOut={false}
                        actionBarExtra={this.actionBarExtra}
                        wrappedComponentRef={element =>
                          (this.tableDataRef = element)
                        }
                        refTargetComponentName="TableData"
                      />
                    </div>
                  </div>
                </div>
              </Modal>

              {/* 删除人员分组模态框 */}
              <Modal
                visible={isDeleteOrgModalOpen}
                onCancel={this.closeAllModal}
                onOk={() => {
                  this.removeOrg('org');
                }}
                okButtonProps={{ type: 'danger' }}
              >
                <div>
                  <span>
                    {needRemoveData[0] &&
                      (needRemoveData.length > 1
                        ? `此操作可能会影响已配置的权限，确认删除所选的${needRemoveData.length}个人员分组？`
                        : `此操作可能会影响已配置的权限，确认删除人员分组${needRemoveData[0].name}`)}
                  </span>
                </div>
              </Modal>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default OrganizationManagement;
