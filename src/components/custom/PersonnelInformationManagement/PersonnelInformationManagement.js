import React from 'react';
import { Button, Modal } from 'antd';
import TableData from '../../common/data/TableData';
import DepartmentTree from './DepartmentTree';
import './PersonnelInformationManagement.less';

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03BaseURL;
const downloadBaseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03DownloadBaseURL;

/**
 * 人事信息管理
 */
class PersonnelInformationManagement extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedDepartment: null,
      facePicUrl: '', //人脸照片路径
      isOpenFacePicModal: false //控制查看人脸照片的模态框
    };
  }

  /**
   * 获取指定员工的人脸照片Url
   *@param {String} personId 人员Id
   *@returns void
   */
  getFacePicUrl = personId => {
    console.log(personId);
    this.setState({
      facePicUrl:
        'https://img1.baidu.com/it/u=3778539548,3602910495&fm=26&fmt=auto&gp=0.jpg'
    });
  };

  /**
   * 关闭所有模态窗
   * @returns void
   */
  closeAllModal = () => {
    this.setState({
      isOpenFacePicModal: false
    });
  };

  render() {
    const { role } = this.props;
    const { selectedDepartment, isOpenFacePicModal, facePicUrl } = this.state;
    return (
      <div className="personnel-information">
        <div className="personnel-information-base">
          <div className="department-tree-wrapper">
            <DepartmentTree
              resid="417643880834"
              baseURL={baseURL}
              idField="DEP_ID"
              pidField="DEP_PID"
              titleField="DEP_NAME"
              rootNode={{
                title: 'Enterprise',
                key: 0
              }}
              onSelect={selectedKeys => {
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
              resid="651688414274"
              hasRowModify={false}
              hasRowDelete={false}
              hasRowView={false}
              hasAdd={false}
              hasModify={false}
              hasDelete={false}
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              subtractH={180}
              actionBarWidth={200}
              recordFormUseAbsolute={true}
              recordFormContainerProps={{ width: 1000 }}
              cparm1={selectedDepartment}
              customRowBtns={[
                record => {
                  return (
                    <Button
                      type="primary"
                      onClick={() => {
                        this.getFacePicUrl(record.hikPersonId);
                        this.setState({
                          isOpenFacePicModal: true
                        });
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
              title={'人脸照片'}
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
              <img
                style={{ width: '90%', height: '90%', margin: '0 auto' }}
                src={facePicUrl}
                alt="暂时无法获取该员工的人脸照片"
              ></img>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}

export default PersonnelInformationManagement;
