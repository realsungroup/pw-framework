import React from 'react';
import {
  Select,
  Button,
  Modal,
  Form,
  Input,
  message,
  Switch,
  InputNumber,
  Spin,
  Table,
  Tabs,
  DatePicker,
  notification
} from 'antd';
import { TableData } from 'pw-components';
import DoorsSelect from '../DoorsSelect';
import { getRootRegion, queryDoors } from '../../../hikApi';
import http from 'Util20/api';
import ManualCollectData from './ManualCollectData';
import TargetTableSelect from './TargetTableSelect';
import './CollectTaskDefine.less';
import {
  runCollectDataTaskByTaskId,
  collectDataTaskByTaskIdIsRun
} from '../../../collectApi';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

export const getDefaultBaseURL = () => {
  const env = process.env.NODE_ENV;
  let baseURL;
  if (env === 'development') {
    baseURL = 'http://kingofdinner.realsun.me:17001/';
  } else {
    baseURL = 'http://192.168.6.161:9091/';
  }
  return baseURL;
};
class CollectTaskDefine extends React.Component {
  state = {
    mode: 'add', // 'add' 添加 | 'modify' 修改 | 'view' 查看
    visible: false,
    indexCode: '',
    selectedDoors: [],
    record: null,
    tableDataKey: 1,
    allDoors: [],
    manualCollectLoadingMap: {},
    timeModalVisible: false,
    selectedRecord: null,
    receiveStartTime: null,
    receiveEndTime: null,
    timeModalLoading: false
  };

  columns = [
    {
      title: '门禁点',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '所在区域',
      dataIndex: 'regionPathName',
      key: 'regionPathName'
    }
  ];

  componentDidMount = async () => {
    this.setState({ loading: true });
    let res, queryDoorsRes;
    try {
      res = await getRootRegion();
      queryDoorsRes = await queryDoors({ pageNo: 1, pageSize: 1000 });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    this.setState({
      indexCode: res.data.indexCode,
      loading: false,
      allDoors: queryDoorsRes.data.list
    });
  };

  handleSelectedDoorsChange = selectedDoors => {
    this.setState({ selectedDoors });
  };

  handleOk = () => {
    const { validateFields } = this.props.form;
    const { selectedDoors } = this.state;

    validateFields((err, values) => {
      if (err) {
        return;
      }
      if (!selectedDoors.length) {
        return message.error('请选择门禁点');
      }

      this.submitData(values);
    });
  };

  submitData = async values => {
    const { mode, selectedDoors, record } = this.state;
    this.setState({ loading: true });

    if (mode === 'add') {
      try {
        await http({ baseURL: realsunApiBaseURL }).addRecords({
          resid: 681055931420,
          data: [
            {
              ...values,
              enabled: values.enabled ? 'Y' : 'N',
              doorIndexCodes: selectedDoors
                .map(item => item.indexCode)
                .join(',')
            }
          ]
        });
      } catch (err) {
        this.setState({ loading: false });
        return message.error(err.message);
      }
      message.success('添加成功');
    } else {
      try {
        await http({ baseURL: realsunApiBaseURL }).modifyRecords({
          resid: 681055931420,
          data: [
            {
              REC_ID: record.REC_ID,
              ...values,
              enabled: values.enabled ? 'Y' : 'N',
              doorIndexCodes: selectedDoors
                .map(item => item.indexCode)
                .join(',')
            }
          ]
        });
      } catch (err) {
        this.setState({ loading: false });
        return message.error(err.message);
      }
      message.success('修改成功');
    }

    this.setState({
      loading: false,
      visible: false,
      tableDataKey: this.state.tableDataKey + 1,
      selectedDoors: []
    });
  };

  getSelectedDoors = () => {
    const { record, allDoors } = this.state;
    const { doorIndexCodes } = record;
    const doorIndexCodesList = doorIndexCodes.split(',');

    const doors = doorIndexCodesList
      .map(indexCode => {
        const result = allDoors.find(item => item.indexCode === indexCode);
        if (result) {
          return result;
        }
      })
      .filter(Boolean);
    return doors;
  };

  handleManualCollect = async record => {
    const taskId = record.taskid;
    this.setState({
      manualCollectLoadingMap: {
        ...this.state.manualCollectLoadingMap,
        [taskId]: true
      }
    });

    // 查询是否该任务是否在运行
    let res;
    try {
      res = await http({ baseURL: realsunApiBaseURL }).getTable({
        resid: 681055931420,
        cmswhere: `taskid = '${taskId}'`
      });
    } catch (err) {
      this.setState({
        manualCollectLoadingMap: {
          ...this.state.manualCollectLoadingMap,
          [taskId]: false
        }
      });
      return message.error(err.message);
    }

    if (
      res &&
      Array.isArray(res.data) &&
      res.data.length &&
      res.data[0].taskid === taskId
    ) {
      const taskRecord = res.data[0];
      this.setState({
        manualCollectLoadingMap: {
          ...this.state.manualCollectLoadingMap,
          [taskId]: false
        }
      });
      if (!taskRecord.progress) {
        // 显示选择时间段的 Modal
        this.setState({ selectedRecord: record }, () => {
          this.setState({ timeModalVisible: true });
        });
      } else {
        message.info(`当前任务正在运行，请稍等。进度：${taskRecord.progress}%`);
      }
    }
  };

  handleSubmitTime = async () => {
    const { selectedRecord, receiveStartTime, receiveEndTime } = this.state;
    const { taskid: taskId } = selectedRecord;

    if (!receiveStartTime || !receiveEndTime) {
      return message.error('请选择数据入库时间范围');
    }

    this.setState({ timeModalLoading: true });
    const startTime = `${receiveStartTime.format('YYYY-MM-DDTHH:mm:ss')}+08:00`;
    const endTime = `${receiveEndTime.format('YYYY-MM-DDTHH:mm:ss')}+08:00`;
    let res;
    try {
      res = await runCollectDataTaskByTaskId(taskId, startTime, endTime);
    } catch (err) {
      this.setState({ timeModalLoading: false });
      return message.error(err.message);
    }
    this.setState({ timeModalLoading: false, timeModalVisible: false });
    message.success(
      `操作成功！有 ${res &&
        res.data &&
        Array.isArray(res.data.records) &&
        res.data.records.length} 条数据`
    );
  };

  render() {
    const {
      visible,
      indexCode,
      loading,
      mode,
      record,
      tableDataKey,
      selectedDoors
    } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <div style={{ width: '100%', height: '100%', background: '#fff' }}>
        <Tabs defaultActiveKey="任务定义表">
          <TabPane tab="任务定义表" key="任务定义表">
            <div className="collect-task-define">
              <TableData
                baseURL={realsunApiBaseURL}
                key={tableDataKey}
                resid="681055931420"
                subtractH={170}
                hasAdd={false}
                hasModify={false}
                hasRowModify={false}
                hasRowView={false}
                height={660}
                actionBarExtra={(
                  dataSource,
                  selectedRowKeys,
                  data,
                  recordFormData,
                  size
                ) => {
                  return (
                    <>
                      <Button
                        size="small"
                        onClick={() =>
                          this.setState({ visible: true, mode: 'add' })
                        }
                      >
                        添加
                      </Button>
                    </>
                  );
                }}
                customRowBtns={[
                  (record, btnSize) => {
                    return (
                      <>
                        <Button
                          type="primary"
                          size={btnSize}
                          onClick={() =>
                            this.setState({
                              visible: true,
                              mode: 'view',
                              record
                            })
                          }
                        >
                          查看
                        </Button>
                        <Button
                          type="primary"
                          size={btnSize}
                          onClick={() => {
                            this.setState({ record }, () => {
                              const selectedDoors = this.getSelectedDoors();
                              this.setState({
                                selectedDoors,
                                visible: true,
                                mode: 'modify'
                              });
                            });
                          }}
                        >
                          修改
                        </Button>
                        <Button
                          type="primary"
                          size={btnSize}
                          onClick={() => this.handleManualCollect(record)}
                          loading={
                            this.state.manualCollectLoadingMap[record.taskid]
                          }
                        >
                          手动采集
                        </Button>
                      </>
                    );
                  }
                ]}
              ></TableData>
            </div>
          </TabPane>
          <TabPane tab="手动采集数据" key="手动采集数据">
            <ManualCollectData></ManualCollectData>
          </TabPane>
        </Tabs>

        <Modal
          width={1180}
          visible={visible}
          title="添加"
          onCancel={() => this.setState({ visible: false })}
          onOk={this.handleOk}
          confirmLoading={loading}
          destroyOnClose
          footer={mode === 'view' ? null : undefined}
        >
          <Form>
            <Form.Item label="任务名称">
              {mode === 'view' ? (
                <div>{record.taskName}</div>
              ) : (
                getFieldDecorator('taskName', {
                  initialValue: mode === 'add' ? undefined : record.taskName,
                  rules: [
                    {
                      required: true,
                      message: `请输入任务名称`
                    }
                  ]
                })(<Input style={{ width: 400 }} />)
              )}
            </Form.Item>

            <Form.Item label="刷卡目标表" style={{ width: 400 }}>
              {mode === 'view' ? (
                <div>{record.tableresid}</div>
              ) : (
                getFieldDecorator('tableresid', {
                  initialValue: mode === 'add' ? undefined : record.tableresid,
                  rules: [
                    {
                      required: true,
                      message: `请选择刷卡目标表`
                    }
                  ]
                })(<TargetTableSelect />)
              )}
            </Form.Item>
            <Form.Item label="目标表api地址">
              {mode === 'view' ? (
                <div>{record.baseUrl}</div>
              ) : (
                getFieldDecorator('baseUrl', {
                  initialValue:
                    mode === 'add' ? getDefaultBaseURL() : record.baseUrl,
                  rules: [
                    {
                      required: true,
                      message: `请输入目标表api地址`
                    }
                  ]
                })(<Input style={{ width: 400 }} />)
              )}
            </Form.Item>
            <Form.Item label="是否开启">
              {mode === 'view' ? (
                <div>{record.enabled ? 'Y' : 'N'}</div>
              ) : (
                getFieldDecorator('enabled', {
                  valuePropName: 'checked',
                  initialValue: (() => {
                    if (mode === 'add') {
                      return undefined;
                    }
                    if (record.enabled === 'Y') {
                      return true;
                    } else {
                      return false;
                    }
                  })()
                })(<Switch checkedChildren="开" unCheckedChildren="关" />)
              )}
            </Form.Item>
            <Form.Item label="任务间隔时间秒（秒）">
              {mode === 'view' ? (
                <div>{record.taskInterval}</div>
              ) : (
                getFieldDecorator('taskInterval', {
                  initialValue:
                    mode === 'add' ? undefined : record.taskInterval,
                  rules: [
                    {
                      required: true,
                      message: `请输入任务间隔时间秒`
                    }
                  ]
                })(<InputNumber style={{ width: 400 }} />)
              )}
            </Form.Item>

            <Form.Item label="开始时间偏移量（分钟）">
              {mode === 'view' ? (
                <div>{record.startMinutesOffset}</div>
              ) : (
                getFieldDecorator('startMinutesOffset', {
                  initialValue:
                    mode === 'add' ? undefined : record.startMinutesOffset,
                  rules: [
                    {
                      required: true,
                      message: `请输入开始时间偏移量`
                    }
                  ]
                })(<InputNumber style={{ width: 400 }} />)
              )}
            </Form.Item>

            <Form.Item label="事件类型列表">
              {mode === 'view' ? (
                <div>{record.eventTypes}</div>
              ) : (
                getFieldDecorator('eventTypes', {
                  initialValue: mode === 'add' ? '196893' : record.eventTypes,
                  rules: [
                    {
                      required: true,
                      message: `请输入事件类型列表`
                    }
                  ]
                })(<Input style={{ width: 400 }} />)
              )}
            </Form.Item>

            <h3>门禁点</h3>
            {(() => {
              if (mode === 'view') {
                return (
                  <Table
                    columns={this.columns}
                    size="small"
                    rowSelection={null}
                    dataSource={this.getSelectedDoors()}
                    pagination={false}
                    rowKey="indexCode"
                  ></Table>
                );
              }
              return (
                !!indexCode && (
                  <DoorsSelect
                    regionIndexCodes={[indexCode]}
                    onSelectedDoorsChange={this.handleSelectedDoorsChange}
                    selectedDoors={mode === 'add' ? [] : selectedDoors}
                    max={10}
                    isShowSelectedDoors
                  ></DoorsSelect>
                )
              );
            })()}
          </Form>
        </Modal>

        <Modal
          visible={this.state.timeModalVisible}
          title="选择数据入库时间范围"
          onCancel={() => this.setState({ timeModalVisible: false })}
          onOk={this.handleSubmitTime}
          confirmLoading={this.state.timeModalLoading}
        >
          <Form.Item label="数据入库时间范围">
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              style={{ width: 400 }}
              value={[this.state.receiveStartTime, this.state.receiveEndTime]}
              onChange={dates => {
                if (dates) {
                  this.setState({
                    receiveStartTime: dates[0],
                    receiveEndTime: dates[1]
                  });
                } else {
                  this.setState({
                    receiveStartTime: null,
                    receiveEndTime: null
                  });
                }
              }}
            />
          </Form.Item>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(CollectTaskDefine);
