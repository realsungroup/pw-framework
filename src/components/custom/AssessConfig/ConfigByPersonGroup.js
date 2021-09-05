import React from 'react';
import {
  Layout,
  DatePicker,
  Button,
  Modal,
  message,
  Divider,
  Progress
} from 'antd';
import DoorGroupTable from '../DoorGroupTable/DoorGroupTable';
import PersonGourpList from '../PersonGroupList/PersonGroupList';
import AddPersonGroupRightModal from '../AddPersonGroupRightModal';
import PropTypes from 'prop-types';
import {
  queryDoors,
  removeRightById,
  authConfigProgress
} from '../../../hikApi';
import http from 'Util20/api';
import './AssessConfig.less';

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

const { RangePicker } = DatePicker;
const { Header, Content, Footer, Sider } = Layout;

class ConfigByPersonGroup extends React.Component {
  baseURL = window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;

  state = {
    selectedRowKeys: [],
    isDeleteModalOpen: false,
    isDeleteModalOpen: false,

    addVisible: false,
    selectedPersonGroupId: '',
    doorGroupTableKey: 1,
    percent: 0,
    progressVisible: false,
    personGroupList: []
  };

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

  handleRemoveRight = record => {
    const { selectedPersonGroupId, personGroupList } = this.state;
    const personGroup = personGroupList.find(
      item => item.groupId === selectedPersonGroupId
    );
    let msg = '';
    if (record.doorType === 'door') {
      msg = `确定删除 ${personGroup.name} 的 ${record.doorDetail.name} 权限？`;
    } else if (record.doorType === 'group') {
      msg = `确定删除 ${personGroup.name} 的 ${record.groupDetail.name} 权限？`;
    }

    const removeRight = async record => {
      this.setState({ progressVisible: true });
      let res;
      try {
        res = await removeRightById([`${record.REC_ID}`]);
      } catch (err) {
        this.setState({ progressVisible: false });
        return message.error(err.message);
      }
      const taskId = res.data.taskIds[0];
      if (taskId) {
        this.getRemoveProgress([taskId], [record]);
      } else {
        message.error('删除失败');
      }
    };

    Modal.confirm({
      title: '提示',
      content: msg,
      onOk: () => {
        Modal.destroyAll();
        removeRight(record);
      }
    });
  };

  getRemoveProgress = async (taskIds, records) => {
    this.setState({ progressVisible: true });
    setTimeout(async () => {
      let resList;
      try {
        resList = await Promise.all(
          taskIds.map(taskId => authConfigProgress({ taskId }))
        );
      } catch (err) {
        return message.error(err.message);
      }

      const total = taskIds.length * 100;
      let currentTotal = 0;
      resList.forEach(res => {
        currentTotal += res.data.percent;
      });

      const percent = Math.floor(currentTotal / total) * 100;

      if (percent < 100) {
        this.setState({ percent });
        this.getRemoveProgress(taskIds);
      } else {
        // 任务完成了，删除人员分组权限表记录
        try {
          await http({ baseURL: realsunApiBaseURL }).removeRecords({
            resid: 684097503067,
            data: records.map(record => ({
              REC_ID: record.REC_ID
            }))
          });
        } catch (err) {
          this.setState({ progressVisible: false });
          return message.error(err.message);
        }
        message.success('删除成功');
        this.setState({
          percent: 100,
          doorGroupTableKey: this.state.doorGroupTableKey + 1
        });
      }
    }, 3000);
  };

  render() {
    const {
      selectedRowKeys,
      personGroupList,
      isDeleteModalOpen,
      isModifyModalOpen,
      addVisible,
      selectedPersonGroupId,
      percent
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
                  disabled={!selectedRowKeys.length}
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
                  disabled={!selectedRowKeys.length}
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
                  selectedPersonGroupId={selectedPersonGroupId}
                  onSelectedPersonGroupIdChange={selectedPersonGroupId =>
                    this.setState({ selectedPersonGroupId })
                  }
                ></PersonGourpList>
              </Sider>
              <Divider type="vertical" style={{ minHeight: '75vh' }} />
              <Content>
                {selectedPersonGroupId && (
                  <DoorGroupTable
                    selectedPersonGroupId={selectedPersonGroupId}
                    personGroupList={personGroupList}
                    key={this.state.doorGroupTableKey}
                    onRemove={this.handleRemoveRight}
                  />
                )}
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
        <AddPersonGroupRightModal
          visible={addVisible}
          onSuccess={() => {
            message.success('添加成功');
            this.setState({
              addVisible: false,
              doorGroupTableKey: this.state.doorGroupTableKey + 1
            });
          }}
          onCancel={() => this.setState({ addVisible: false })}
          destroyOnClose
        ></AddPersonGroupRightModal>

        <Modal
          title="删除进度"
          visible={this.state.progressVisible}
          okButtonProps={{ disabled: percent !== 100 }}
          cancelButtonProps={{ disabled: percent !== 100 }}
          onOk={() => this.setState({ percent: 0, progressVisible: false })}
          onCancel={() => this.setState({ percent: 0, progressVisible: false })}
          closable={false}
          maskClosable={false}
        >
          <div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <Progress type="circle" percent={percent}></Progress>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 8
              }}
            >
              {percent === 100 ? '删除成功' : '删除中，请稍等...'}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ConfigByPersonGroup;
