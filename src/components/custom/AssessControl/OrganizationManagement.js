import React from 'react';
import { Icon, Tabs, Button, Modal, Upload, message } from 'antd';
import './AssessControl.less';
import TableData from 'Common/data/TableData';
import AddDoorsModal from '../AddDoorsModal';
import ModifyDoorsModal from '../ModifyDoorsModal';

const { TabPane } = Tabs;
const uploadProps = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text'
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};

class OrganizationManagement extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isViewPersonModalOpen: false, //控制查看人员信息模态窗
      isDeleteOrgModalOpen: false, //控制删除分组信息模态窗
      isViewEntranceModalOpen: false, //控制查看门禁点信息模态窗
      needRemoveData: {}, //待删除数据
      selectedRowData: {}, //选中行的数据
      isImportExcelModalOpen: false,
      addDoorVisible: false,
      modifyDoorsVisible: false,
      modifyRecord: null,
      doorsTableKey: 0,
    };
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
  }

  /**
   * 删除分组，分为单独删除和批量删除
   *
   */
  removeOrg = () => {
    const { needRemoveData } = this.state;
    console.log(needRemoveData);
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
        <Tabs defaultActiveKey="person">
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
                resid={682695515421}
                baseURL={this.baseURL}
                height={'calc(100vh - 138px)'}
                subtractH={190}
                hasAdd={false}
                hasModify={false}
                hasDelete={false}
                hasRowEdit={false}
                hasRowModify={false}
                hasRowView={false}
                hasRowDelete={false}
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
                      <Button type="primary" key="4">
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
                      >
                        Excel导入添加
                      </Button>
                      <Button
                        type="danger"
                        key="6"
                        onClick={() => {
                          this.setState({
                            isDeleteOrgModalOpen: true,
                            needRemoveData: dataSource.dataSource
                          });
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  );
                }}
                customRowBtns={[
                  (record, btnSize) => {
                    return <Button key="1">编辑</Button>;
                  },
                  (record, btnSize) => {
                    return (
                      <Button
                        key="2"
                        onClick={() => {
                          this.setState({
                            isDeleteOrgModalOpen: true,
                            needRemoveData: [record]
                          });
                        }}
                      >
                        删除
                      </Button>
                    );
                  },
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

              <Modal
                visible={isViewPersonModalOpen}
                title="人员分组详情"
                onCancel={this.closeAllModal}
                width={'80%'}
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
                        baseURL={this.baseURL}
                        cmswhere={`groupId = ${selectedRowData.REC_ID}`}
                        height={'calc(100vh - 138px)'}
                        subtractH={190}
                        hasAdd={false}
                        hasModify={false}
                        hasDelete={false}
                        hasRowEdit={false}
                        hasRowModify={false}
                        hasRowView={false}
                        hasRowDelete={false}
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

              <Modal
                visible={isDeleteOrgModalOpen}
                onCancel={this.closeAllModal}
                onOk={this.removeOrg}
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

              <Modal
                visible={isImportExcelModalOpen}
                onCancel={this.closeAllModal}
                onOk={this.removeOrg}
              >
                <div>
                  <Upload {...uploadProps}>
                    <Button>
                      <Icon type="upload" /> Click to Upload
                    </Button>
                  </Upload>
                </div>
              </Modal>
            </div>
          </TabPane>
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
                resid={682507600534}
                baseURL={this.baseURL}
                height={'calc(100vh - 138px)'}
                subtractH={190}
                hasAdd={false}
                hasModify={false}
                hasDelete={false}
                hasRowEdit={false}
                hasRowModify={false}
                hasRowView={false}
                hasRowDelete={false}
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
                      <Button type="primary" key="4" onClick={() => this.setState({ addDoorVisible: true })}>
                        添加
                      </Button>
                      <Button
                        type="danger"
                        key="6"
                        onClick={() => {
                          this.setState({
                            needRemoveData: dataSource.dataSource
                          });
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  );
                }}
                customRowBtns={[
                  (record, btnSize) => {
                    return <Button key="1" size={btnSize} onClick={() => this.setState({modifyDoorsVisible: true, modifyRecord: record})}>编辑</Button>;
                  },
                  (record, btnSize) => {
                    return (
                      <Button
                        key="2"
                        onClick={() => {
                          this.setState({
                            needRemoveData: [record]
                          });
                        }}
                      >
                        删除
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
              {this.state.addDoorVisible && <AddDoorsModal visible={this.state.addDoorVisible} onSuccess={() => this.setState({addDoorVisible: false, doorsTableKey: this.state.doorsTableKey + 1 })} onCancel={() => this.setState({ addDoorVisible: false})}></AddDoorsModal>}
              {this.state.modifyDoorsVisible && <ModifyDoorsModal visible={this.state.modifyDoorsVisible} record={this.state.modifyRecord} onSuccess={() => this.setState({modifyDoorsVisible: false, modifyRecord: null, doorsTableKey: this.state.doorsTableKey + 1})} onCancel={() => this.setState({ addDoorVisible: false })}></ModifyDoorsModal>}
            </div>
            
            <Modal
              visible={isViewEntranceModalOpen}
              title="人员分组详情"
              onCancel={this.closeAllModal}
              width={'80%'}
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
                      resid={682695559871}
                      baseURL={this.baseURL}
                      cmswhere={`groupId = ${selectedRowData.REC_ID}`}
                      height={'calc(100vh - 138px)'}
                      subtractH={190}
                      hasAdd={false}
                      hasModify={false}
                      hasDelete={false}
                      hasRowEdit={false}
                      hasRowModify={false}
                      hasRowView={false}
                      hasRowDelete={false}
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
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default OrganizationManagement;
