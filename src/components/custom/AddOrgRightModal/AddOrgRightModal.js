import React from 'react';
import { Modal, Form, message, Spin, DatePicker, Progress } from 'antd';
import OrgsSelect from '../OrgsSelect';
import RightPointSelect from '../RightPointSelect';
import './AddOrgRightModal.less';
import http from 'Util20/api';
import PropTypes from 'prop-types';
import { addOrgRight, authConfigProgress } from '../../../hikApi';
import { getAccessToken } from 'Util20/util';

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

const { RangePicker } = DatePicker;

class AddOrgRightModal extends React.Component {
  static propTypes = {
    /**
     * 添加成功的回调
     */
    onSuccess: PropTypes.func.isRequired
  };

  state = {
    regionIndexCodes: [],
    loading: false,
    activeKey: '门禁分组',
    doorGroupList: [],
    doors: [],
    showPorgress: false,
    progress: 0,
    taskIds: [],

    orgList: []
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
    const { doorGroupList, doors, orgList } = this.state;
    validateFields((err, values) => {
      if (err) {
        return message.error('请选择权限有效期');
      }
      if (!orgList.length) {
        return message.error('请选择组织');
      }
      if (!doorGroupList.length && !doors.length) {
        return message.error('请选择权限点位');
      }
      this.submitData(values);
    });
  };

  submitData = async values => {
    this.setState({ loading: true });
    const { doorGroupList, doors, orgList } = this.state;
    const { timeRange } = values;
    const accessToken = getAccessToken();

    const startTime = timeRange[0].format(`YYYY-MM-DD`) + 'T00:00:00';
    const endTime = timeRange[1].format('YYYY-MM-DD') + 'T23:59:59';

    const orgRightList = [];
    orgList.forEach(org => {
      if (doorGroupList.length) {
        doorGroupList.forEach(doorGroup => {
          orgRightList.push({
            orgIndexCode: org.orgIndexCode,
            doorType: 'group',
            groupId: doorGroup.groupId
          });
        });
      }
      if (doors.length) {
        doors.forEach(door => {
          orgRightList.push({
            orgIndexCode: org.orgIndexCode,
            doorType: 'door',
            doorIndexCode: door.indexCode
          });
        });
      }
    });

    let res;
    try {
      res = await addOrgRight({
        accessToken,
        orgRightList,
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
        taskIds: res.data.taskList.map(res => res.taskId)
      },
      this.getAuthConfigProgress
    );
  };

  handleSelectedDoorsChange = doors => {
    this.setState({ doors });
  };

  getAuthConfigProgress = () => {
    const { taskIds } = this.state;
    setTimeout(async () => {
      let resList;
      try {
        resList = await Promise.all(
          taskIds.map(taskId => authConfigProgress({ taskId }))
        );
      } catch (err) {
        return message.error(err.message);
      }

      const total = resList.length * 100;
      let current = 0;
      resList.forEach(res => {
        current += res.data.percent;
      });
      const percent = Math.floor((current / total) * 100);

      if (percent < 100) {
        this.setState({ progress: percent });
        this.getAuthConfigProgress();
      } else {
        this.handleReFillRecords();
      }
    }, 1000);
  };

  handleReFillRecords = async () => {
    const { taskIds } = this.state;
    let res;
    try {
      res = await http({ baseURL: realsunApiBaseURL }).getTable({
        resid: 682509417953,
        cmswhere: `taskId = '${taskIds.join(',')}'`
      });
    } catch (err) {
      this.setState({ progress: 0 });
      return message.error(err.message);
    }

    try {
      await http({ baseURL: realsunApiBaseURL }).modifyRecords({
        resid: 682509417953,
        data: res.data.map(record => ({
          REC_ID: record.REC_ID,
          isAddToHik: 'Y'
        }))
      });
    } catch (err) {
      this.setState({ progress: 0 });
      return message.error(err.message);
    }

    this.setState({ progress: 100 });
  };

  handleSuccess = () => {
    const { onSuccess } = this.props;
    this.setState({ showProgress: false, progress: 0 });
    onSuccess && onSuccess();
  };

  render() {
    const { onSuccess, orgIndexCodes, ...otherProps } = this.props;
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
            <h2>人员组织及下级组织</h2>
            <OrgsSelect
              onOrgSelectChange={orgList => this.setState({ orgList })}
              orgIndexCodes={orgIndexCodes}
            ></OrgsSelect>

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
          okButtonProps={{ disabled: this.state.progress !== 100 }}
          cancelButtonProps={{ disabled: this.state.progress !== 100 }}
          onOk={this.handleSuccess}
          onCancel={this.handleSuccess}
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
              <Progress type="circle" percent={this.state.progress} />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 8
              }}
            >
              {this.state.progress === 100 ? '添加成功' : '添加中，请稍等...'}
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default Form.create()(AddOrgRightModal);
