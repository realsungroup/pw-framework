import React from 'react';
import {
  Modal,
  Form,
  message,
  Spin,
  DatePicker,
  Progress,
  Icon,
  List,
  Tooltip
} from 'antd';
import http from 'Util20/api';
import PropTypes from 'prop-types';
import {
  authConfigProgress,
  authDownload,
  authDownloadProgress
} from '../../../hikApi';
import DoorsSelect from '../DoorsSelect';
import { cloneDeep, chunk } from 'lodash';
import { errorCodeMap } from './errorCodeMap';
import './DownloadAuthModal.less';

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

class DownloadAuthModal extends React.Component {
  static propTypes = {
    /**
     * 点击完成按钮的回调
     */
    onComplete: PropTypes.func
  };

  state = {
    regionIndexCodes: [],
    loading: false,
    selectedDoors: [],
    progressVisible: false,
    doorsProgress: []
  };

  componentDidMount = () => {
    this.getRegionIndexCodes();
  };

  getRegionIndexCodes = async () => {
    this.setState({ loading: true });
    let res;
    try {
      res = await http({ baseURL: realsunApiBaseURL }).getTable({
        resid: 682964730936
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    this.setState({
      regionIndexCodes: res.data.map(record => record.regionIndexCode),
      loading: false
    });
  };

  handleSubmit = () => {
    const { selectedDoors } = this.state;
    Modal.confirm({
      title: '再次确认',
      content: (
        <div>
          <div>您确定要下载权限到以下门禁点吗？</div>
          <ul style={{ paddingLeft: 24 }}>
            {selectedDoors.map(door => (
              <li key={door.indexCode}>{door.name}</li>
            ))}
          </ul>
        </div>
      ),
      onOk: () => {
        const doorsProgress = cloneDeep(selectedDoors);
        doorsProgress.forEach(door => {
          door.percent = 0;
          door.time = 999;
          door.finishedCount = 0;
          door.total = 0;
          door.errorCode = 0;
        });

        this.setState(
          { doorsProgress, progressVisible: true },
          this.startDownload
        );
      }
    });
  };

  startDownload = async () => {
    const { selectedDoors } = this.state;
    const list = chunk(selectedDoors, 100);

    let res;
    try {
      res = await Promise.all(
        list.map(selectedDoors =>
          authDownload({
            taskType: 4,
            resourceInfos: selectedDoors.map(door => ({
              resourceIndexCode: door.indexCode,
              resourceType: 'door',
              channelNos: [1]
            }))
          })
        )
      );
    } catch (err) {
      return message.error(err.message);
    }
    const taskIds = [];
    res.forEach(item => {
      taskIds.push(item.data.taskId);
    });
    this.getProgress(taskIds);
  };

  getProgress = taskIds => {
    setTimeout(async () => {
      let res;
      try {
        res = await Promise.all(
          taskIds.map(taskId => authDownloadProgress({ taskId }))
        );
      } catch (err) {
        return message.error(err.message);
      }

      const allDoorsProgress = [];
      res.forEach(resItem => {
        if (
          resItem &&
          resItem.data &&
          Array.isArray(resItem.data.resourceDownloadProgress)
        ) {
          allDoorsProgress.push(...resItem.data.resourceDownloadProgress);
        }
      });

      const { doorsProgress } = this.state;
      const newDoorsProgress = cloneDeep(doorsProgress);

      newDoorsProgress.forEach(door => {
        const result = allDoorsProgress.find(
          item => item.resourceInfo.channelIndexCodes[0] === door.indexCode
        );
        door.percent = result.downloadPercent;
        door.time = result.leftTime;
        door.finishedCount = result.downloadPersonCount;
        door.total = result.totalPersonCount;
        door.errorCode = result.errorCode;
      });

      const isAllOver = doorsProgress.every(door => door.percent === 100);

      this.setState({ doorsProgress: newDoorsProgress });
      if (!isAllOver) {
        this.getProgress(taskIds);
      }
    }, 3000);
  };

  handleSelectedDoorsChange = doors => {
    this.setState({ doors });
  };

  getAuthConfigProgress = () => {
    const { taskId } = this.state;

    setTimeout(async () => {
      let res;
      try {
        res = await authConfigProgress({ taskId });
      } catch (err) {
        return message.error(err.message);
      }
      const percent = res.data.percent;
      if (percent < 100) {
        this.setState({ progress: percent });
        this.getAuthConfigProgress();
      } else {
        this.handleReFillRecords();
      }
    }, 1000);
  };

  handleReFillRecords = async () => {
    const { taskId } = this.state;
    let res;
    try {
      res = await http({ baseURL: realsunApiBaseURL }).getTable({
        resid: 682509589511,
        cmswhere: `taskId = '${taskId}'`
      });
    } catch (err) {
      this.setState({ progressLoading: false });
      return message.error(err.message);
    }

    try {
      await http({ baseURL: realsunApiBaseURL }).modifyRecords({
        resid: 682509589511,
        data: res.data.map(record => ({
          REC_ID: record.REC_ID,
          isAddToHik: 'Y'
        }))
      });
    } catch (err) {
      this.setState({ progressLoading: false });
      return message.error(err.message);
    }

    this.setState({ progressLoading: false, progress: 100 });
  };

  handleSelectedDoorsChange = selectedDoors => {
    this.setState({ selectedDoors });
  };

  render() {
    const { onComplete, ...otherProps } = this.props;
    const {
      regionIndexCodes,
      loading,
      selectedDoors,
      progressVisible,
      doorsProgress
    } = this.state;

    let downloadingCount = 0;
    let downloadOverCount = 0;

    if (progressVisible) {
      doorsProgress.forEach(item => {
        if (item.percent !== 100) {
          downloadingCount += 1;
        } else {
          downloadOverCount += 1;
        }
      });
    }

    return (
      <>
        <Modal
          width={1180}
          title="下载权限"
          onOk={this.handleSubmit}
          className="download-auth-modal"
          okButtonProps={{ disabled: !selectedDoors.length }}
          {...otherProps}
        >
          <Spin spinning={loading}>
            <div className="download-auth-modal__tip">
              <Icon type="info-circle" />
              <span>由于下载权限到门禁需要一定时间，建议按优先级分批下载</span>
            </div>
            <div className="download-auth-modal__title">待下载权限的门禁点</div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {!!regionIndexCodes.length && (
                <DoorsSelect
                  regionIndexCodes={regionIndexCodes}
                  onSelectedDoorsChange={this.handleSelectedDoorsChange}
                ></DoorsSelect>
              )}
            </div>
          </Spin>
        </Modal>
        <Modal
          visible={progressVisible}
          title="下载权限进度"
          closable={false}
          okText="完成"
          okButtonProps={{
            disabled: downloadOverCount !== doorsProgress.length
          }}
          width={800}
          onOk={() => {
            this.setState({ progressVisible: false });
            const { onComplete } = this.props;
            onComplete && onComplete();
          }}
        >
          <List
            header={
              <div>
                正在下载 {downloadingCount} 个，下载完成 {downloadOverCount}
              </div>
            }
            bordered
            dataSource={doorsProgress}
            renderItem={item => (
              <List.Item
                key={item.indexCode}
                className="download-auth-modal__progress-list"
              >
                <div className="download-auth-modal__progress-list-left">
                  <div style={{ width: 120 }}>{item.name}</div>
                  <div className="download-auth-modal__progress-bar">
                    <Progress
                      percent={item.percent}
                      style={{ width: 200 }}
                      status={(() => {
                        if (item.errorCode !== 0) {
                          return 'exception';
                        }
                      })()}
                    />
                    <div>
                      ({item.finishedCount}/{item.total})
                    </div>
                  </div>
                </div>

                <div>
                  {(() => {
                    if (item.errorCode !== 0) {
                      const errorObj = errorCodeMap[item.errorCode];
                      console.log({ errorObj });
                      return (
                        <Tooltip
                          title={errorObj ? errorObj.desc : item.errorCode}
                        >
                          {errorObj ? errorObj.name : item.errorCode}
                        </Tooltip>
                      );
                    }
                    return `大约剩余 ${item.time} 秒`;
                  })()}
                </div>
              </List.Item>
            )}
          />
        </Modal>
      </>
    );
  }
}

export default DownloadAuthModal;
