import React, { Component } from 'react';
import {
  Button,
  Input,
  message,
  Form,
  Select,
  DatePicker,
  Table,
  Modal
} from 'antd';
import './AuthDownloadRecord.less';
import {
  queryDoors,
  getAllRegions,
  queryDownloadRecords,
  queryDownloadDetail
} from '../../../hikApi';
import { errorCodeMap } from 'Util20/errorCodeMap';
import moment from 'moment';
import AuthDownloadRecordDetailModal from '../AuthDownloadRecordDetailModal';

const baseURLAPI = window.pwConfig[process.env.NODE_ENV].customURLs.hikBaseURL;

const { Option } = Select;
const { RangePicker } = DatePicker;

const taskOptTypeMap = {
  0: '初始化下载',
  1: '异动下载',
  2: '指定下载',
  3: '快速下载',
  4: '自动下载',
  5: '同步下载'
};

class AuthDownloadRecord extends Component {
  state = {
    taskId: '',

    // 门禁点
    doors: [],
    doorIndexCode: undefined,
    doorsFetching: false,

    // 区域
    regions: [],
    regionsFetching: false,

    downloadResult: -1,

    startTimes: null,
    endTimes: null,
    loading: false,
    dataSource: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      showTotal: total => `总共 ${total} 条数据`
    },
    viewVisible: false,
    detailDataSource: [],
    viewLoading: false,
    detailPagination: {
      current: 1,
      pageSize: 20,
      total: 0
    }
  };

  componentDidMount = async () => {
    await this.handleFetchDoors();
  };

  detailColumns = [
    {
      title: '姓名',
      dataIndex: 'personName',
      key: 'personName'
    },
    {
      title: '工号',
      dataIndex: 'jobNo',
      key: 'jobNo'
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
      key: 'orgName'
    },
    {
      title: '下载时间',
      dataIndex: 'downloadTime',
      key: 'downloadTime'
    },
    {
      title: '下载结果',
      dataIndex: '下载结果',
      key: '下载结果',
      render: (text, record) => {
        const { persondownloadResult } = record;
        let point, status;
        if (persondownloadResult === 0) {
          point = (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#3fca8e',
                marginRight: 8
              }}
            ></div>
          );
          status = <div>成功</div>;
        } else if (persondownloadResult === 1) {
          point = (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ff5b00',
                marginRight: 8
              }}
            ></div>
          );
          status = <div>失败</div>;
        }
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {point}
            {status}
          </div>
        );
      }
    },
    {
      title: '下载结果',
      dataIndex: '下载结果',
      key: '下载结果',
      render: (text, record) => {
        const { errorCode } = record;
        const errorCodeMapObj = errorCodeMap[errorCode];
        const msg = errorCodeMapObj ? errorCodeMapObj.name : errorCode;
        return <div>{msg}</div>;
      }
    }
  ];

  columns = [
    {
      title: '任务编号',
      dataIndex: 'downloadResultId',
      key: 'downloadResultId'
    },
    {
      title: '门禁点',
      dataIndex: 'doorName',
      key: 'doorName'
    },
    // {
    //   title: '所在区域',
    //   dataIndex: 'doorName',
    //   key: 'doorName'
    // },
    {
      title: '下载结果',
      dataIndex: '下载结果',
      key: '下载结果',
      render: (text, record) => {
        const {
          downloadResult,
          downloadPersonCount,
          successedPersonCount,
          failedPersonCount
        } = record;
        let point, count;
        if (downloadResult === 0) {
          point = (
            <>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#3fca8e',
                  marginRight: 4
                }}
              ></div>
              <div>成功</div>
            </>
          );
          count = (
            <div>
              ({downloadPersonCount}/{downloadPersonCount})
            </div>
          );
        } else if (downloadResult === 1) {
          point = (
            <>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#ff5b00',
                  marginRight: 4
                }}
              ></div>
              <div>失败</div>
            </>
          );
          count = (
            <div>
              ({downloadPersonCount}/{downloadPersonCount})
            </div>
          );
        } else if (downloadResult === 2) {
          point = (
            <>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#ebebeb',
                  marginRight: 4
                }}
              ></div>
              <div>部分成功</div>
            </>
          );
          count = (
            <div>
              ({successedPersonCount}/{failedPersonCount}/{downloadPersonCount})
            </div>
          );
        }

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {point}
            {count}
          </div>
        );
      }
    },
    {
      title: '下载开始时间',
      dataIndex: 'startTime',
      key: 'startTime'
    },
    {
      title: '下载结束时间',
      dataIndex: 'endTime',
      key: 'endTime'
    },
    {
      title: '描述',
      dataIndex: '描述',
      key: '描述',
      render: (text, record) => {
        const { taskOptType, errorCode } = record;
        const errorCodeMapObj = errorCodeMap[errorCode];
        const msg = errorCodeMapObj ? errorCodeMapObj.name : errorCode;
        const type = taskOptTypeMap[`${taskOptType}`];
        return (
          <div>
            [{type}]{msg}
          </div>
        );
      }
    },
    {
      title: '操作',
      dataIndex: '操作',
      key: '操作',
      render: (text, record) => {
        return (
          <Button
            size="small"
            type="primary"
            onClick={() => {
              this.setState({ record, viewVisible: true });
            }}
          >
            查看详情
          </Button>
        );
      }
    }
  ];

  handleFetchDoors = async () => {
    const { doors } = this.state;
    if (!doors.length) {
      this.setState({ doorsFetching: true });
      let res;
      try {
        res = await queryDoors({ pageNo: 1, pageSize: 1000 });
      } catch (err) {
        this.setState({ doorsFetching: false });
        return message.error(err.message);
      }
      this.setState(
        {
          doorsFetching: false,
          doors: res.data.list
        },
        () => {
          this.handleSearch(1);
        }
      );
    }
  };

  handleFetchRegions = async () => {
    const { regions } = this.state;
    if (!regions.length) {
      this.setState({ regionsFetching: true });
      let res;
      try {
        res = await getAllRegions();
      } catch (err) {
        this.setState({ regionsFetching: false });
        return message.error(err.message);
      }
      this.setState({
        regionsFetching: false,
        regions: res.data.regions
      });
    }
  };

  handleSearch = async (pageNo, pageSize = this.state.pagination.pageSize) => {
    const {
      taskId,
      doorIndexCode,
      regionIndexCode,
      downloadResult,
      startTimes,
      endTimes
    } = this.state;
    this.setState({ loading: true });
    const conditions = {
      taskTypes: [4] // 人脸
    };
    if (taskId) {
      conditions.taskId = taskId;
    }
    if (doorIndexCode) {
      conditions.resourceInfos = [
        {
          resourceIndexCode: doorIndexCode,
          resourceType: 'door'
        }
      ];
    }
    if (regionIndexCode) {
      conditions.resourceInfos = Array.isArray(conditions.resourceInfos)
        ? conditions.resourceInfos
        : [];
      conditions.resourceInfos.push({
        resourceIndexCode: regionIndexCode,
        resourceType: 'region'
      });
    }

    if (downloadResult !== -1) {
      conditions.downloadResult = downloadResult;
    }
    if (startTimes) {
      const startTime =
        startTimes[0].format('YYYY-MM-DDTHH:mm') + ':08.000+08:00';
      const endTime =
        startTimes[1].format('YYYY-MM-DDTHH:mm') + ':08.000+08:00';
      conditions.downloadStartTime = {
        startTime,
        endTime
      };
    }
    if (endTimes) {
      const startTime =
        endTimes[0].format('YYYY-MM-DDTHH:mm') + ':08.000+08:00';
      const endTime = endTimes[1].format('YYYY-MM-DDTHH:mm') + ':08.000+08:00';
      conditions.downloadEndTime = {
        startTime,
        endTime
      };
    }

    let res;
    try {
      res = await queryDownloadRecords({
        pageNo,
        pageSize,
        ...conditions
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    const { doors } = this.state;
    res.data.list.forEach(item => {
      const doorIndexCode = item.resourceInfo.channelIndexCodes[0];
      const result = doors.find(item => item.indexCode === doorIndexCode);
      if (result) {
        item.doorName = result.name;
      } else {
        item.doorName = doorIndexCode;
      }
    });
    this.setState({
      dataSource: [...res.data.list],
      loading: false,
      pagination: {
        ...this.state.pagination,
        total: res.data.total,
        current: pageNo,
        pageSize
      }
    });
  };

  handleReset = () => {
    this.setState({
      doorIndexCode: undefined,
      regionIndexCode: undefined,
      downloadResult: -1,
      startTimes: null,
      endTimes: null
    });
  };

  handleTableChange = pagination => {
    this.handleSearch(pagination.current);
  };

  render() {
    const {
      taskId,
      doors,
      doorIndexCode,
      doorsFetching,
      regions,
      regionIndexCode,
      regionsFetching,
      downloadResult,
      startTimes,
      endTimes,
      dataSource,
      record
    } = this.state;
    return (
      <div className="auth-download-record">
        <div className="auth-download-record__search">
          <Form.Item
            label="任务编号"
            className="auth-download-record__form-item"
          >
            <Input
              value={taskId}
              onChange={e => this.setState({ taskId: e.target.value })}
            ></Input>
          </Form.Item>

          <Form.Item label="门禁点" className="auth-download-record__form-item">
            <Select
              showSearch
              maxTagCount={1}
              style={{ width: '100%' }}
              value={doorIndexCode}
              loading={doorsFetching}
              onChange={value => {
                this.setState({ doorIndexCode: value });
              }}
              filterOption={(input, option) => {
                return (
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                );
              }}
              onFocus={this.handleFetchDoors}
            >
              {doors.map(item => (
                <Option key={item.indexCode} value={item.indexCode}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="所在区域"
            className="auth-download-record__form-item"
          >
            <Select
              showSearch
              maxTagCount={1}
              style={{ width: '100%' }}
              value={regionIndexCode}
              loading={regionsFetching}
              onChange={value => {
                this.setState({ regionIndexCode: value });
              }}
              filterOption={(input, option) => {
                return (
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                );
              }}
              onFocus={this.handleFetchRegions}
            >
              {regions.map(item => (
                <Option key={item.indexCode} value={item.indexCode}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="下载结果"
            className="auth-download-record__form-item"
          >
            <Select
              showSearch
              maxTagCount={1}
              style={{ width: '100%' }}
              value={downloadResult}
              onChange={value => this.setState({ downloadResult: value })}
            >
              {[
                {
                  label: '全部',
                  value: -1
                },
                {
                  label: '成功',
                  value: 0
                },
                {
                  label: '失败',
                  value: 1
                },
                {
                  label: '部分失败',
                  value: 2
                }
              ].map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="下载开始时间"
            className="auth-download-record__form-item"
          >
            <RangePicker
              value={startTimes}
              onChange={dates => {
                this.setState({ startTimes: dates });
              }}
              showTime
              format="YYYY/MM/DD HH:mm"
            ></RangePicker>
          </Form.Item>

          <Form.Item
            label="下载结束时间"
            className="auth-download-record__form-item"
          >
            <RangePicker
              value={endTimes}
              onChange={dates => {
                this.setState({ endTimes: dates });
              }}
              showTime
              format="YYYY/MM/DD HH:mm"
            ></RangePicker>
          </Form.Item>

          <div className="auth-download-record__btns-wrapper">
            <Button type="primary" onClick={() => this.handleSearch(1)}>
              查询
            </Button>
            <Button onClick={this.handleReset}>重置</Button>
          </div>
        </div>

        <div className="auth-download-record__table">
          <Table
            bordered
            columns={this.columns}
            dataSource={dataSource}
            loading={this.state.loading}
            rowKey="downloadResultId"
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
          ></Table>
        </div>
        {this.state.viewVisible && (
          <AuthDownloadRecordDetailModal
            downloadResultId={record.downloadResultId}
            visible={this.state.viewVisible}
            onCancel={() => this.setState({ viewVisible: false })}
          ></AuthDownloadRecordDetailModal>
        )}
      </div>
    );
  }
}

export default AuthDownloadRecord;
