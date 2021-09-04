import React from 'react';
import { Layout, DatePicker, Button, Modal, message, Divider } from 'antd';
import './AssessConfig.less';
import DoorGroupTable from '../DoorGroupTable/DoorGroupTable';
import PersonGourpList from '../PersonGroupList/PersonGroupList';
import AddPersonGroupRightModal from '../AddPersonGroupRightModal';

const { RangePicker } = DatePicker;
const { Header, Content, Footer, Sider } = Layout;

class ConfigByPersonGroup extends React.Component {
  constructor(props) {
    super();
    this.state = {
      selectedRowKeys: [],
      personGroupList: [],
      isDeleteModalOpen: false,
      isDeleteModalOpen: false,
      addVisible: false
    };
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  /**
   * 关闭所有模态框
   */
  closeAllModal = () => {
    this.setState({
      isDeleteModalOpen: false,
      isModifyModalOpen: false
    });
  };

  /**
   * 删除权限配置
   */
  removeAssess = () => {
    this.closeAllModal();
  };

  /**
   * 修改权限有效期
   */
  modifyAssessDate = () => {
    this.closeAllModal();
  };

  render() {
    const {
      selectedRowKeys,
      personGroupList,
      isDeleteModalOpen,
      isModifyModalOpen,
      addVisible
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    return (
      <div className="configByPersonGroup-style">
        <Layout>
          <Header>
            <div className="header-button-container">
              <span className="header-button-style">
                <Button
                  icon="plus"
                  type="default"
                  key="1"
                  onClick={() => {
                    this.setState({ addVisible: true });
                  }}
                >
                  添加权限
                </Button>
              </span>
              <span className="header-button-style">
                <Button
                  icon="delete"
                  type="default"
                  key="2"
                  onClick={() => {
                    this.setState({ isDeleteModalOpen: true });
                  }}
                >
                  删除权限
                </Button>
              </span>
              <span className="header-button-style">
                <Button
                  icon="dashboard"
                  type="default"
                  key="3"
                  onClick={() => {
                    this.setState({ isModifyModalOpen: true });
                  }}
                >
                  修改有效期
                </Button>
              </span>
            </div>
          </Header>
          <Content>
            <Layout style={{ background: '#fff' }}>
              <Sider width={'256px'} style={{ background: '#fff' }}>
                <PersonGourpList
                  onFetchPersonGroupList={personGroupList =>
                    this.setState({ personGroupList })
                  }
                  personGroupList={personGroupList}
                  selectedRowKeys={selectedRowKeys}
                  onGroupSelect={selectedRowKeys =>
                    this.setState({ selectedRowKeys })
                  }
                ></PersonGourpList>
              </Sider>
              <Divider type="vertical" style={{ minHeight: '75vh' }} />
              <Content>
                <DoorGroupTable
                  selectedRowKeys={selectedRowKeys}
                  personGroupList={personGroupList}
                />
              </Content>
            </Layout>
          </Content>
        </Layout>

        {/* 删除权限 */}
        <Modal
          visible={isDeleteModalOpen}
          onCancel={this.closeAllModal}
          onOk={this.removeAssess}
        >
          <span>{`确定删除确定删除所选的 ${selectedRowKeys.length} 个人员分组的所有权限？？`}</span>
        </Modal>

        {/* 修改有效期 */}
        <Modal
          visible={isModifyModalOpen}
          onCancel={this.closeAllModal}
          onOk={this.modifyAssessDate}
        >
          <div style={{ margin: '8px 8px 16px 8px' }}>
            <span>设置权限有效期</span>
            <div>
              <RangePicker
                onChange={(date, dateString) => {
                  console.log(date, dateString);
                }}
              ></RangePicker>
            </div>
          </div>
        </Modal>
        {addVisible && (
          <AddPersonGroupRightModal
            visible={addVisible}
            onSuccess={() => {
              message.success('添加成功');
              this.setState({ addVisible: false });
            }}
            onCancel={() => this.setState({ addVisible: false })}
          ></AddPersonGroupRightModal>
        )}
      </div>
    );
  }
}

export default ConfigByPersonGroup;
