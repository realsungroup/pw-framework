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
  removeRightById,
  authConfigProgress,
  modifyDateByIds
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
    orgIndexCode: ''
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

  handleModifyAllAuthDate = () => {
    const {
      startTime: start,
      endTime: end,
      selectedRowKeys,
      personGroupList,
      modifyDateRecord
    } = this.state;
    if (!start || !end) {
      return message.error('请选择有效期');
    }
    if (modifyDateRecord) {
      if (
        start.format('YYYY-MM-DDTHH:mm:ss') === modifyDateRecord.startTime &&
        end.format('YYYY-MM-DDTHH:mm:ss') === modifyDateRecord.endTime
      ) {
        return message.error('有效期没有改变');
      }
    }

    let msg = '';
    const personGroups = [];
    if (modifyDateRecord) {
      const result = personGroupList.find(
        item => item.groupId === modifyDateRecord.personGroupId
      );
      console.log({ modifyDateRecord });
      msg = `您确定要修改 ${result.name} 的 ${modifyDateRecord.groupDetail.name} 的有效期吗？`;
    } else {
      selectedRowKeys.forEach(key => {
        const result = personGroupList.find(item => item.groupId === key);
        if (result) {
          personGroups.push(result);
        }
      });
      msg = `您确定要修改 ${personGroups
        .map(item => item.name)
        .join(',')} 的有效期吗？`;
    }

    const startTime = start.format('YYYY-MM-DDTHH:mm:ss');
    const endTime = end.format('YYYY-MM-DDTHH:mm:ss');

    const requestAll = async personGroupIds => {
      this.setState({
        progressVisible: true,
        progressMode: 'modify',
        modifyDateLoading: true
      });

      // 获取人员分组权限表记录
      let res;
      try {
        res = await http({ baseURL: realsunApiBaseURL }).getTable({
          resid: 684097503067,
          cmswhere: `personGroupId in (${personGroupIds
            .map(id => `'${id}'`)
            .join(',')})`
        });
      } catch (err) {
        this.setState({ progressVisible: false });
        return message.error(err.message);
      }

      const records = res.data;
      const recIds = records.map(item => `${item.REC_ID}`);

      if (!recIds.length) {
        message.info('您选择的人员分组没有配置权限');
        this.setState({ progressVisible: false });
      } else {
        let res;
        try {
          res = await modifyDateByIds(recIds, startTime, endTime);
        } catch (err) {
          this.setState({ progressVisible: false, modifyDateLoading: false });
          return message.error(err.message);
        }
        this.setState({ modifyDateLoading: false, isModifyModalOpen: false });
        const taskIds = res.data.taskIds;
        if (taskIds && taskIds.length) {
          this.getModifyDateProgress(taskIds, records, { startTime, endTime });
        } else {
          message.error('删除失败');
        }
      }
    };

    const request = async () => {
      let res;
      try {
        res = await modifyDateByIds(
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
        if (modifyDateRecord) {
          request(selectedRowKeys);
        } else {
          requestAll(selectedRowKeys);
        }
      }
    });
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
      this.setState({ progressVisible: true, progressMode: 'remove' });
      let res;
      try {
        res = await removeRightById([`${record.REC_ID}`]);
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
        // 任务完成了，修改人员分组权限表记录
        try {
          await http({ baseURL: realsunApiBaseURL }).modifyRecords({
            resid: 684097503067,
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

  handleRemoveAllRight = () => {
    const { selectedRowKeys, personGroupList } = this.state;
    const personGroups = [];

    selectedRowKeys.forEach(key => {
      const result = personGroupList.find(item => item.groupId === key);
      if (result) {
        personGroups.push(result);
      }
    });

    const removeRight = async personGroupIds => {
      this.setState({ progressVisible: true, progressMode: 'remove' });

      // 获取人员分组权限表记录
      let res;
      try {
        res = await http({ baseURL: realsunApiBaseURL }).getTable({
          resid: 684097503067,
          cmswhere: `personGroupId in (${personGroupIds
            .map(id => `'${id}'`)
            .join(',')})`
        });
      } catch (err) {
        this.setState({ progressVisible: false });
        return message.error(err.message);
      }

      const records = res.data;
      const recIds = records.map(item => `${item.REC_ID}`);

      if (!recIds.length) {
        message.info('您选择的人员分组没有配置权限');
        this.setState({ progressVisible: false });
      } else {
        let res;
        try {
          res = await removeRightById(recIds);
        } catch (err) {
          this.setState({ progressVisible: false });
          return message.error(err.message);
        }
        const taskIds = res.data.taskIds;
        if (taskIds && taskIds.length) {
          this.getRemoveProgress(taskIds, records);
        } else {
          message.error('删除失败');
        }
      }
    };

    Modal.confirm({
      title: '提示',
      content: `确定删除 ${personGroups
        .map(item => item.name)
        .join(',')} 的所有权限？`,
      onOk: () => {
        Modal.destroyAll();
        removeRight(selectedRowKeys);
      }
    });
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
      orgIndexCodes
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
                    this.setState({
                      isModifyModalOpen: true,
                      modifyDateRecord: null
                    });
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
                {orgIndexCodes.length && (
                  <OrgSelect
                    orgIndexCodes={orgIndexCodes}
                    onOrgSelect={orgIndexCode =>
                      this.setState({ orgIndexCode })
                    }
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
                  />
                )}
              </Content>
            </Layout>
          </Content>
        </Layout>

        <Modal
          title="修改权限有效期"
          visible={isModifyModalOpen}
          onOk={this.handleModifyAllAuthDate}
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
