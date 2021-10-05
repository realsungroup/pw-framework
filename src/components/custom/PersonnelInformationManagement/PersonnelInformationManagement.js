import React from 'react';
import { Button, Modal, message, Tabs, Badge } from 'antd';
import TableData from '../../common/data/TableData';
import DepartmentTree from './DepartmentTree';
import './PersonnelInformationManagement.less';
import http from 'Util20/api';

const { TabPane } = Tabs;

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03BaseURL;
const downloadBaseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03DownloadBaseURL;
const baseURLAPI = window.pwConfig[process.env.NODE_ENV].customURLs.hikBaseURL;

const mainTableResid = 651688414274; //主表resid
const addPersonSyncResid = 681988079880; //人员添加异常

const addOrgSyncResid = 681990438067; //部门添加异常
let modifyOrgSyncResid = 680878876091; //部门修改异常

let modifyPersonSyncResid = 680878876091; //人员修改异常

if (process.env.NODE_ENV === 'production') {
  modifyPersonSyncResid = 685114666358;
  modifyOrgSyncResid = 685114916039;
}

/**
 * 人事信息管理
 */
class PersonnelInformationManagement extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedDepartment: '',
      facePicUrl: '', //人脸照片路径
      facePicModalTitle: '', //模态框的标题
      isOpenFacePicModal: false, //控制查看人脸照片的模态框
      isPersonModalOpen: false, //控制查看同步异常人员的模态框
      isOrgModalOpen: false, //控制查看同步异常部门的模态框
      personNum: 0,
      orgNum: 0
    };
  }

  componentDidMount = () => {
    this.getWrongNum();
  };

  /**
   * 获取指定员工的人脸照片Url
   *@param {String} personId 人员Id
   *@returns void
   */
  getFacePicUrl = personId => {
    const url = `${baseURLAPI}api/v1/queryPersonById?hikPersonId=${personId}`;
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(res => {
        if (res.error === 0) {
          if (res.data.person.C3_461934233303 === '') {
            message.info('该员工尚未采集照片');
          } else {
            this.setState(
              {
                facePicModalTitle: res.data.person.personName,
                facePicUrl: res.data.person.C3_461934233303
              },
              () => {
                this.setState({ isOpenFacePicModal: true });
              }
            );
          }
        } else {
          message.info(res.message);
        }
      })
      .catch(error => {
        console.log(error);
        message.info(error.message);
      });
  };

  /**
   * 获取同步异常的数量，包括部门和人员
   */
  getWrongNum = async () => {
    let res1 = null,
      res2 = null,
      res3 = null,
      res4 = null;
    try {
      res1 = await http({ baseURL }).getTable({
        resid: addPersonSyncResid
      });
      res2 = await http({ baseURL }).getTable({
        resid: modifyPersonSyncResid
      });
      this.setState({
        personNum: res1.total + res2.total
      });
    } catch (error) {
      console.log(error.message);
      message.info(error.message);
    }
    try {
      res3 = await http({ baseURL }).getTable({
        resid: addOrgSyncResid
      });
      res4 = await http({ baseURL }).getTable({
        resid: modifyOrgSyncResid
      });
      this.setState({
        orgNum: res3.total + res4.total
      });
    } catch (error) {
      console.log(error.message);
      message.info(error.message);
    }
  };

  /**
   * 重新触发同步，包括人员和部门的添加、修改同步
   * @param {String} type 人员或部门 'person'、'org',
   * @param {String} operation 添加或修改  'add'、'modify',
   * @param {Object} selectedRowKeys 选中的数据
   */
  handleRestartSync = (type, operation, selectedRowKeys) => {
    console.log(type, operation, selectedRowKeys.dataSource);

    let apiUrl = '';
    let count = 0;
    selectedRowKeys.dataSource.map(item => {
      if (type === 'person' && operation === 'add') {
        apiUrl = `${baseURLAPI}api/v2/addPerson?jobNo=${item.C3_227192472953}&certificateNo=${item.C3_308778699827}`;
        console.log(apiUrl);
      } else if (type === 'person' && operation === 'modify') {
        apiUrl = `${baseURLAPI}api/v3/modifyPerson?hikPersonId=${item.hikPersonId}&orgIndexCode=${item.orgId}`;
        console.log(apiUrl);
      } else if (type === 'org' && operation === 'add') {
        apiUrl = `${baseURLAPI}api/v2/addPerson?jobNo=${item.C3_227192472953}&certificateNo=${item.C3_308778699827}`;
        console.log(apiUrl);
      } else if (type === 'org' && operation === 'modify') {
        apiUrl = `${baseURLAPI}api/v1/modifyDepartment?depId=${item.DEP_ID}`;
        console.log(apiUrl);
      }

      fetch(apiUrl)
        .then(response => {
          return response.json();
        })
        .then(res => {
          if (res.error !== 0) {
            message.info(res.message);
          } else {
            count++;
          }
          console.log(res);
        })
        .catch(error => {
          console.log(error);
          message.info(error.message);
        });
    });
    this.tableDataRef.handleRefresh();
    if (count === selectedRowKeys.dataSource.length) {
      message.info('同步成功');
    }
  };

  /**
   * 关闭所有模态窗
   * @returns void
   */
  closeAllModal = () => {
    this.setState({
      isOpenFacePicModal: false,
      isOrgModalOpen: false,
      isPersonModalOpen: false,
      facePicUrl: ''
    });
  };

  render() {
    const { role } = this.props;
    const {
      selectedDepartment,
      isOpenFacePicModal,
      facePicUrl,
      facePicModalTitle,
      isOrgModalOpen,
      isPersonModalOpen,
      personNum,
      orgNum
    } = this.state;
    return (
      <div className="personnel-information">
        <div className="personnel-information-base">
          <div className="department-tree-wrapper">
            <DepartmentTree
              resid={417643880834}
              baseURL={baseURL}
              idField="DEP_ID"
              pidField="DEP_PID"
              titleField="DEP_NAME"
              rootNode={{
                title: 'Enterprise',
                key: 0
              }}
              onSelect={selectedKeys => {
                selectedKeys[0] &&
                  this.setState({
                    selectedDepartment: selectedKeys[0] ? selectedKeys[0] : null
                  });
              }}
              treeClassName="personnel-information-tree"
              onlyPersonData={role === 'manager'}
            />
          </div>
          <div className="table-data-wrapper">
            <TableData
              baseURL={baseURL}
              downloadBaseURL={downloadBaseURL}
              cmswhere={
                selectedDepartment === ''
                  ? ''
                  : `C3_680952619990 = ${selectedDepartment}`
              }
              resid={mainTableResid}
              hasRowModify={false}
              hasRowDelete={false}
              hasRowView={false}
              hasAdd={false}
              hasModify={false}
              hasDelete={false}
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              subtractH={220}
              actionBarWidth={200}
              recordFormUseAbsolute={true}
              recordFormContainerProps={{ width: 1000 }}
              // cparm1={selectedDepartment}
              actionBarExtra={() => {
                return (
                  <div>
                    <Badge count={orgNum}>
                      <Button
                        key="org"
                        type="primary"
                        onClick={() => {
                          this.setState({
                            isOrgModalOpen: true
                          });
                        }}
                      >
                        同步异常的部门
                      </Button>
                    </Badge>
                    <Badge count={personNum}>
                      <Button
                        key="person"
                        type="primary"
                        onClick={() => {
                          this.setState({
                            isPersonModalOpen: true
                          });
                        }}
                        style={{ marginLeft: '32px' }}
                      >
                        同步异常的人员
                      </Button>
                    </Badge>
                  </div>
                );
              }}
              customRowBtns={[
                record => {
                  return (
                    <Button
                      key="facePic"
                      type="primary"
                      onClick={() => {
                        this.getFacePicUrl(record.hikPersonId);
                      }}
                    >
                      查看人脸
                    </Button>
                  );
                }
              ]}
            />
            <Modal
              visible={isOpenFacePicModal}
              title={facePicModalTitle}
              onCancel={this.closeAllModal}
              footer={[
                <Button
                  key="confirm"
                  type="primary"
                  onClick={this.closeAllModal}
                >
                  确认
                </Button>
              ]}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img
                style={{
                  width: '90%',
                  height: '90%',
                  marginLeft: '5%'
                }}
                src={facePicUrl}
                alt="正在加载。。。"
              ></img>
            </Modal>
            <Modal
              width={'80vw'}
              visible={isPersonModalOpen}
              title="同步异常的人员信息"
              onCancel={this.closeAllModal}
              footer={[
                <Button
                  key="confirm"
                  type="primary"
                  onClick={this.closeAllModal}
                >
                  确认
                </Button>
              ]}
            >
              <div
                style={{
                  width: '100%',
                  height: 'calc(100vh - 104px)',
                  position: 'relative'
                }}
              >
                <Tabs defaultActiveKey="1">
                  <TabPane key="1" tab="添加异常">
                    <TableData
                      baseURL={baseURL}
                      downloadBaseURL={downloadBaseURL}
                      resid={addPersonSyncResid}
                      hasRowModify={false}
                      hasRowDelete={false}
                      hasRowView={false}
                      hasAdd={false}
                      hasModify={false}
                      hasDelete={false}
                      subtractH={220}
                      actionBarWidth={200}
                      wrappedComponentRef={element =>
                        (this.tableDataRef = element)
                      }
                      refTargetComponentName="TableData"
                      style={{ height: 'calc(100vh - 160px)' }}
                      hasRowSelection={true}
                      actionBarExtra={selectedRowKeys => {
                        return (
                          <Button
                            key="reAddPeople"
                            type="primary"
                            onClick={() => {
                              this.handleRestartSync(
                                'person',
                                'add',
                                selectedRowKeys
                              );
                            }}
                          >
                            重新添加
                          </Button>
                        );
                      }}
                    />
                  </TabPane>
                  <TabPane key="2" tab="修改异常">
                    <TableData
                      baseURL={baseURL}
                      downloadBaseURL={downloadBaseURL}
                      resid={modifyPersonSyncResid}
                      hasRowModify={false}
                      hasRowDelete={false}
                      hasRowView={false}
                      hasAdd={false}
                      hasModify={false}
                      hasDelete={false}
                      wrappedComponentRef={element =>
                        (this.tableDataRef = element)
                      }
                      refTargetComponentName="TableData"
                      subtractH={220}
                      actionBarWidth={200}
                      style={{ height: 'calc(100vh - 160px)' }}
                      hasRowSelection={true}
                      actionBarExtra={selectedRowKeys => {
                        return (
                          <Button
                            key="reModifyPeople"
                            type="primary"
                            onClick={() => {
                              this.handleRestartSync(
                                'person',
                                'modify',
                                selectedRowKeys
                              );
                            }}
                          >
                            重新修改
                          </Button>
                        );
                      }}
                    />
                  </TabPane>
                </Tabs>
              </div>
            </Modal>
            <Modal
              width={'80vw'}
              visible={isOrgModalOpen}
              title="同步异常的部门信息"
              onCancel={this.closeAllModal}
              footer={[
                <Button
                  key="confirm"
                  type="primary"
                  onClick={this.closeAllModal}
                >
                  确认
                </Button>
              ]}
            >
              <div
                style={{
                  width: '100%',
                  height: 'calc(100vh - 104px)',
                  position: 'relative'
                }}
              >
                <Tabs defaultActiveKey="1">
                  <TabPane key="1" tab="添加异常">
                    <TableData
                      baseURL={baseURL}
                      downloadBaseURL={downloadBaseURL}
                      resid={addOrgSyncResid}
                      hasRowModify={false}
                      hasRowDelete={false}
                      hasRowView={false}
                      hasAdd={false}
                      hasModify={false}
                      hasDelete={false}
                      wrappedComponentRef={element =>
                        (this.tableDataRef = element)
                      }
                      refTargetComponentName="TableData"
                      subtractH={220}
                      actionBarWidth={200}
                      style={{ height: 'calc(100vh - 160px)' }}
                      hasRowSelection={true}
                      actionBarExtra={selectedRowKeys => {
                        return (
                          <Button
                            key="reAddOrg"
                            type="primary"
                            onClick={() => {
                              this.handleRestartSync(
                                'org',
                                'add',
                                selectedRowKeys
                              );
                            }}
                          >
                            重新添加
                          </Button>
                        );
                      }}
                    />
                  </TabPane>
                  <TabPane key="2" tab="修改异常">
                    <TableData
                      baseURL={baseURL}
                      downloadBaseURL={downloadBaseURL}
                      resid={modifyOrgSyncResid}
                      hasRowModify={false}
                      hasRowDelete={false}
                      hasRowView={false}
                      hasAdd={false}
                      hasModify={false}
                      hasDelete={false}
                      wrappedComponentRef={element =>
                        (this.tableDataRef = element)
                      }
                      refTargetComponentName="TableData"
                      subtractH={220}
                      actionBarWidth={200}
                      style={{ height: 'calc(100vh - 160px)' }}
                      hasRowSelection={true}
                      actionBarExtra={selectedRowKeys => {
                        return (
                          <Button
                            key="reModifyOrg"
                            type="primary"
                            onClick={() => {
                              this.handleRestartSync(
                                'org',
                                'modify',
                                selectedRowKeys
                              );
                            }}
                          >
                            重新修改
                          </Button>
                        );
                      }}
                    />
                  </TabPane>
                </Tabs>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default PersonnelInformationManagement;
