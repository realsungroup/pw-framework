import React from 'react';
import { Button, Modal, message } from 'antd';
import TableData from '../../common/data/TableData';
import DepartmentTree from './DepartmentTree';
import './PersonnelInformationManagement.less';

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03BaseURL;
const downloadBaseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03DownloadBaseURL;
const baseURLAPI = window.pwConfig[process.env.NODE_ENV].customURLs.hikBaseURL;

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
      isOpenFacePicModal: false //控制查看人脸照片的模态框
    };
  }

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
   * 关闭所有模态窗
   * @returns void
   */
  closeAllModal = () => {
    this.setState({
      isOpenFacePicModal: false,
      facePicUrl: ''
    });
  };

  render() {
    const { role } = this.props;
    const {
      selectedDepartment,
      isOpenFacePicModal,
      facePicUrl,
      facePicModalTitle
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
              resid={651688414274}
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
              // cparm1={selectedDepartment}
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
          </div>
        </div>
      </div>
    );
  }
}

export default PersonnelInformationManagement;
