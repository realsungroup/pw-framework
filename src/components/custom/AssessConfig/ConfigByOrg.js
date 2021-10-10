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
import AddOrgRightModal from '../AddOrgRightModal';
import {
  removeOrgRightById,
  authConfigProgress,
  modifyOrgDateByIds
} from '../../../hikApi';
import http from 'Util20/api';
import moment from 'moment';
import OrgSelect from '../OrgSelect';
import './AssessConfig.less';

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

const { RangePicker } = DatePicker;
const { Header, Content, Footer, Sider } = Layout;

class ConfigByOrg extends React.Component {
  baseURL = window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;

  state = {
    selectedRowKeys: [],

    addVisible: false,
    selectedPersonGroupId: '',
    doorGroupTableKey: 1,
    percent: 0,
    progressVisible: false,
    personGroupList: [],

    startTime: null,
    endTime: null,

    progressMode: '', // 进度模式：'remove' 删除的进度 | 'modify' 修改有效期的进度
    modifyDateRecord: null,
    modifyDateLoading: false,

    orgIndexCodes: [],
    orgIndexCode: '',
    orgList: [],
    selectedRowRecIds: []
  };

  componentDidMount = async () => {
    let res;
    try {
      res = await http({ baseURL: realsunApiBaseURL }).getTable({
        resid: 683043670166
      });
    } catch (err) {
      return message.error(err.message);
    }
    if (res && Array.isArray(res.data)) {
      this.setState({ orgIndexCodes: res.data.map(record => record.depId) });
    }
  };

  handleModifyAuthDate = record => {
    const { startTime, endTime } = record;
    this.setState({
      isModifyModalOpen: true,
      modifyDateRecord: record,
      startTime: moment(startTime),
      endTime: moment(endTime)
    });
  };

  handleRowSelectionChange = selectedRowRecIds => {
    this.setState({ selectedRowRecIds });
  };

  handleModifyAllAuthDate = (multiple = false) => {
    const {
      startTime: start,
      endTime: end,
      selectedRowKeys,
      modifyDateRecord,
      orgList,
      selectedRowRecIds
    } = this.state;
    if (!start || !end) {
      return message.error('请选择有效期');
    }
    if (!multiple) {
      if (
        start.format('YYYY-MM-DDTHH:mm:ss') === modifyDateRecord.startTime &&
        end.format('YYYY-MM-DDTHH:mm:ss') === modifyDateRecord.endTime
      ) {
        return message.error('有效期没有改变');
      }

      let msg = '';
      const result = orgList.find(
        org => org.orgIndexCode === modifyDateRecord.orgIndexCode
      );
      msg = `您确定要修改 ${result.orgName} 的 ${modifyDateRecord.groupDetail.name} 的有效期吗？`;

      const startTime = start.format('YYYY-MM-DDTHH:mm:ss');
      const endTime = end.format('YYYY-MM-DDTHH:mm:ss');
      const request = async () => {
        let res;
        try {
          res = await modifyOrgDateByIds(
            [`${modifyDateRecord.REC_ID}`],
            startTime,
            endTime
          );
        } catch (err) {
          this.setState({ progressVisible: false });
          return message.error(err.message);
        }
        const taskIds = res.data.taskIds;
        if (taskIds && taskIds.length) {
          this.getModifyDateProgress(taskIds, [modifyDateRecord], {
            startTime,
            endTime
          });
        } else {
          message.error('删除失败');
        }
      };

      Modal.confirm({
        title: '提示',
        content: msg,
        onOk: () => {
          Modal.destroyAll();
          request(selectedRowKeys);
        }
      });
    } else {
      const startTime = start.format('YYYY-MM-DDTHH:mm:ss');
      const endTime = end.format('YYYY-MM-DDTHH:mm:ss');
      const request = async () => {
        let res;
        try {
          res = await modifyOrgDateByIds(
            selectedRowRecIds.map(recId => String(recId)),
            startTime,
            endTime
          );
        } catch (err) {
          this.setState({ progressVisible: false });
          return message.error(err.message);
        }
        const taskIds = res.data.taskIds;

        this.setState({ selectedRowRecIds: [] });

        if (taskIds && taskIds.length) {
          this.getModifyDateProgress(
            taskIds,
            selectedRowRecIds.map(recId => ({ REC_ID: recId })),
            {
              startTime,
              endTime
            }
          );
        } else {
          message.error('删除失败');
        }
      };

      Modal.confirm({
        title: '提示',
        content: `您确定要修改选中权限的有效日期吗？`,
        onOk: () => {
          Modal.destroyAll();
          request(selectedRowKeys);
        }
      });
    }
  };

  handleRemoveRight = record => {
    const { orgList, orgIndexCode } = this.state;
    const orgItem = orgList.find(org => org.orgIndexCode === orgIndexCode);
    let msg = '';
    if (record.doorType === 'door') {
      msg = `确定删除 ${orgItem.orgName} 的 ${record.doorDetail.name} 权限？`;
    } else if (record.doorType === 'group') {
      msg = `确定删除 ${orgItem.orgName} 的 ${record.groupDetail.name} 权限？`;
    }

    const removeRight = async record => {
      this.setState({ progressVisible: true, progressMode: 'remove' });
      let res;
      try {
        res = await removeOrgRightById([`${record.REC_ID}`]);
      } catch (err) {
        this.setState({ progressVisible: false });
        return message.error(err.message);
      }
      const taskIds = res.data.taskIds;
      if (taskIds && taskIds.length) {
        this.getRemoveProgress(taskIds, [record]);
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

  getModifyDateProgress = async (taskIds, records, { startTime, endTime }) => {
    this.setState({ progressVisible: true, progressMode: 'modify' });
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
        this.getModifyDateProgress(taskIds, records, { startTime, endTime });
      } else {
        // 任务完成了，修改组织权限表记录
        try {
          await http({ baseURL: realsunApiBaseURL }).modifyRecords({
            resid: 686951200660,
            data: records.map(record => ({
              REC_ID: record.REC_ID,
              startTime,
              endTime
            }))
          });
        } catch (err) {
          this.setState({ progressVisible: false });
          return message.error(err.message);
        }
        message.success('修改成功');
        this.setState({
          percent: 100,
          doorGroupTableKey: this.state.doorGroupTableKey + 1,
          isModifyModalOpen: false
        });
      }
    }, 3000);
  };

  getRemoveProgress = async (taskIds, records) => {
    this.setState({ progressVisible: true, progressMode: 'remove' });
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
        this.getRemoveProgress(taskIds, records);
      } else {
        // 任务完成了，删除人员分组权限表记录
        try {
          await http({ baseURL: realsunApiBaseURL }).removeRecords({
            resid: 686951200660,
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

  handleRemoveAllRight = () => {
    const { selectedRowRecIds } = this.state;

    const removeRight = async () => {
      this.setState({ progressVisible: true, progressMode: 'remove' });

      const recIds = selectedRowRecIds;

      if (!recIds.length) {
        message.info('您选择的人员分组没有配置权限');
        this.setState({ progressVisible: false });
      } else {
        let res;
        try {
          res = await removeOrgRightById(recIds.map(recId => String(recId)));
        } catch (err) {
          this.setState({ progressVisible: false });
          return message.error(err.message);
        }
        this.setState({ selectedRowRecIds: [] });
        const taskIds = res.data.taskIds;
        if (taskIds && taskIds.length) {
          this.getRemoveProgress(
            taskIds,
            recIds.map(recId => ({ REC_ID: recId }))
          );
        } else {
          message.error('删除失败');
        }
      }
    };

    Modal.confirm({
      title: '提示',
      content: `确定删除选中的权限吗？`,
      onOk: () => {
        Modal.destroyAll();
        removeRight();
      }
    });
  };

  handleOrgSelect = orgIndexCode => {
    if (orgIndexCode) {
      this.setState({
        orgIndexCode,
        doorGroupTableKey: this.state.doorGroupTableKey + 1
      });
    }
  };

  handleOrgListChange = orgList => {
    this.setState({ orgList });
  };

  render() {
    const {
      selectedRowKeys,
      personGroupList,
      isModifyModalOpen,
      addVisible,
      selectedPersonGroupId,
      orgIndexCode,
      percent,
      startTime,
      endTime,
      progressMode,
      modifyDateRecord,
      orgIndexCodes,
      selectedRowRecIds
    } = this.state;
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
                  onClick={this.handleRemoveAllRight}
                  disabled={!selectedRowRecIds.length}
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
                    this.setState({
                      isModifyModalOpen: true,
                      modifyDateRecord: null
                    });
                  }}
                  disabled={!selectedRowRecIds.length}
                >
                  修改有效期
                </Button>
              </span>
            </div>
          </Header>
          <Content>
            <Layout style={{ background: '#fff' }}>
              <Sider width={'256px'} style={{ background: '#fff' }}>
                {orgIndexCodes.length && (
                  <OrgSelect
                    orgIndexCodes={orgIndexCodes}
                    onOrgSelect={this.handleOrgSelect}
                    selectedKeys={[orgIndexCode]}
                    onOrgListChange={this.handleOrgListChange}
                  ></OrgSelect>
                )}
              </Sider>
              <Divider type="vertical" style={{ minHeight: '75vh' }} />
              <Content>
                {orgIndexCode && (
                  <DoorGroupTable
                    mode="org"
                    selectedPersonGroupId={selectedPersonGroupId}
                    personGroupList={personGroupList}
                    key={this.state.doorGroupTableKey}
                    onRemove={this.handleRemoveRight}
                    onModifyDate={this.handleModifyAuthDate}
                    orgIndexCode={orgIndexCode}
                    onRowSelectionChange={this.handleRowSelectionChange}
                    selectedRowKeys={selectedRowRecIds}
                  />
                )}
              </Content>
            </Layout>
          </Content>
        </Layout>

        <Modal
          title="修改权限有效期"
          visible={isModifyModalOpen}
          onOk={() => this.handleModifyAllAuthDate(true)}
          okButtonProps={{ disabled: !startTime || !endTime }}
          onCancel={() => this.setState({ isModifyModalOpen: false })}
          confirmLoading={this.state.modifyDateLoading}
        >
          <RangePicker
            value={[startTime, endTime]}
            style={{ width: '100%' }}
            onChange={date => {
              if (date) {
                this.setState({ startTime: date[0], endTime: date[1] });
              } else {
                this.setState({ startTime: null, endTime: null });
              }
            }}
          ></RangePicker>
        </Modal>
        <AddOrgRightModal
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
          orgIndexCodes={orgIndexCodes}
        ></AddOrgRightModal>

        <Modal
          title={progressMode === 'remove' ? '删除进度' : '修改有效期进度'}
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
              {(() => {
                if (progressMode === 'remove') {
                  return percent === 100 ? '删除成功' : '删除中，请稍等...';
                }
                return percent === 100
                  ? '修改有效期成功'
                  : '修改有效期中，请稍等...';
              })()}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ConfigByOrg;
