import React from 'react';
import { Modal, Form, message, Spin, DatePicker, Progress } from 'antd';
import PersonGroupSelect from '../PersonGroupSelect';
import RightPointSelect from '../RightPointSelect';
import './AddPersonGroupRightModal.less';
import http from 'Util20/api';
import PropTypes from 'prop-types';
import { addPersonGroupRight, authConfigProgress } from '../../../hikApi';
import { getAccessToken } from 'Util20/util';

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

const { RangePicker } = DatePicker;

class AddPersonGroupRightModal extends React.Component {
  static propTypes = {
    /**
     * 添加成功的回调
     */
    onSuccess: PropTypes.func.isRequired
  };

  state = {
    regionIndexCodes: [],
    personGroupList: [],
    loading: false,
    activeKey: '门禁分组',
    doorGroupList: [],
    doors: [],
    showPorgress: false,
    progress: 0,
    progressLoading: true
  };


  componentDidMount = () => {
    if (this.props.visible) {
      this.getRegionIndexCodes();
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.visible !== this.props.visible &&
      this.props.visible === true &&
      !this.state.regionIndexCodes.length
    ) {
      this.getRegionIndexCodes();
    }
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
    const { validateFields } = this.props.form;
    const { doorGroupList, doors, personGroupList } = this.state;
    validateFields((err, values) => {
      if (err) {
        return message.error('请选择权限有效期');
      }
      if (!personGroupList.length) {
        return message.error('请选择人员分组');
      }
      if (!doorGroupList.length && !doors.length) {
        return message.error('请选择权限点位');
      }
      this.submitData(values);
    });
  };

  submitData = async values => {
    this.setState({ loading: true });
    const { doorGroupList, doors, personGroupList } = this.state;
    const { timeRange } = values;
    const accessToken = getAccessToken();

    const startTime = timeRange[0].format(`YYYY-MM-DD`) + 'T00:00:00';
    const endTime = timeRange[1].format('YYYY-MM-DD') + 'T23:59:59';

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

  render() {
    const { onSuccess, ...otherProps } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { loading, activeKey, regionIndexCodes } = this.state;
    return (
      <>
        <Modal
          width={1180}
          title="添加门禁分组"
          onOk={this.handleSubmit}
          {...otherProps}
        >
          <Spin spinning={loading}>
            <h2>权限参数</h2>
            <Form>
              <Form.Item label="权限有效期">
                {getFieldDecorator('timeRange', {
                  rules: [
                    {
                      required: true,
                      message: `请选择权限有效期`
                    }
                  ]
                })(<RangePicker />)}
              </Form.Item>
            </Form>
            <h2>人员分组</h2>
            <PersonGroupSelect
              onGroupSelect={personGroupList =>
                this.setState({ personGroupList })
              }
            ></PersonGroupSelect>
            <h2 style={{ marginTop: 10 }}>权限点位</h2>
            <RightPointSelect
              onChange={(activeKey, list) => {
                if (activeKey === '门禁分组') {
                  this.setState({ activeKey, doorGroupList: list });
                } else {
                  this.setState({ activeKey, doors: list });
                }
              }}
              activeKey={activeKey}
              regionIndexCodes={regionIndexCodes}
            ></RightPointSelect>
          </Spin>
        </Modal>
        <Modal
          visible={this.state.showProgress}
          title="进度"
          okButtonProps={{ disabled: this.state.progressLoading }}
          cancelButtonProps={{ disabled: this.state.progressLoading }}
          onOk={this.handleSuccess}
          onCancel={this.handleSuccess}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Progress type="circle" percent={this.state.progress} />
          </div>
        </Modal>
      </>
    );
  }
}

export default Form.create()(AddPersonGroupRightModal);
