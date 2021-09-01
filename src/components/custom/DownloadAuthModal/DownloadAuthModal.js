import React from 'react';
import { Modal, Form, message, Spin, DatePicker, Progress, Icon } from 'antd';
import http from 'Util20/api';
import PropTypes from 'prop-types';
import { addPersonGroupRight, authConfigProgress } from '../../../hikApi';
import { getAccessToken } from 'Util20/util';
import DoorsSelect from '../DoorsSelect';
import './DownloadAuthModal.less';

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

const { RangePicker } = DatePicker;

class DownloadAuthModal extends React.Component {
  static propTypes = {
    /**
     * 添加成功的回调
     */
    onSuccess: PropTypes.func.isRequired
  };

  state = {
    regionIndexCodes: [],
    loading: false,
    selectedDoors: [],
    progressVisible: false,
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
    console.log({ selectedDoors });
  };

  submitData = async values => {
    this.setState({ loading: true });
    const { doorGroupList, doors, personGroupList } = this.state;
    const { timeRange } = values;
    const accessToken = getAccessToken();

    const startTime = timeRange[0];
    const endTime = timeRange[1];

    const personGroupRightList = [];
    personGroupList.forEach(personGroup => {
      if (doorGroupList.length) {
        doorGroupList.forEach(doorGroup => {
          personGroupRightList.push({
            personGroupId: personGroup.groupId,
            doorType: 'group',
            groupId: doorGroup.groupId
          });
        });
      }
      if (doors.length) {
        doors.forEach(door => {
          personGroupRightList.push({
            personGroupId: personGroup.groupId,
            doorType: 'door',
            doorIndexCode: door.indexCode
          });
        });
      }
    });

    let res;
    try {
      res = await addPersonGroupRight({
        accessToken,
        personGroupRightList,
        startTime,
        endTime
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }

    this.setState(
      {
        loading: false,
        showProgress: true,
        progressLoading: true,
        taskId: res.data.taskId
      },
      this.getAuthConfigProgress
    );
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

  handleSuccess = () => {
    const { onSuccess } = this.props;
    this.setState({ showProgress: false });
    onSuccess && onSuccess();
  };

  handleSelectedDoorsChange = selectedDoors => {
    this.setState({ selectedDoors });
  };

  render() {
    const { onSuccess, ...otherProps } = this.props;
    const { regionIndexCodes, loading, selectedDoors, progressVisible } = this.state;

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
        <Modal visible={progressVisible}></Modal>
      </>
    );
  }
}

export default DownloadAuthModal;
