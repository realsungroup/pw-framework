import React, { Component } from 'react';
import {
  Button,
  Input,
  message,
  Form,
  Select,
  DatePicker,
  Table,
  Modal,
  Empty
} from 'antd';
import './AuthAllQuery.less';
import {
  queryDoors,
  getAllRegions,
  queryDownloadRecords,
  queryDownloadDetail,
  queryPersonsByName,
  queryOrgsByName,
  queryDoorsByName,
  queryDevicesByName,
  queryRegionsByName,
  queryAuthItemList
} from '../../../hikApi';
import { errorCodeMap } from 'Util20/errorCodeMap';
import moment from 'moment';
import { debounce } from 'lodash';

const baseURLAPI = window.pwConfig[process.env.NODE_ENV].customURLs.hikBaseURL;

const { Option } = Select;
const { RangePicker } = DatePicker;

const faceStatusOptions = [
  {
    label: '全部',
    value: -1
  },
  {
    label: '已配置未下载',
    value: 0
  },
  {
    label: '更新待下载',
    value: 1
  },
  {
    label: '更新待删除',
    value: 2
  },
  {
    label: '已下载',
    value: 3
  },
  {
    label: '未配置',
    value: 4
  }
];

class AuthAllQuery extends Component {
  state = {
    personId: undefined,
    persons: [],
    fetchPersonsLoading: false,

    jobNo: undefined,

    orgIndexCode: undefined,
    orgs: [],
    fetchOrgsLoading: false,

    doorIndexCode: undefined,
    doors: [],
    fetchDoorsLoading: false,

    controlIndexCode: undefined,
    controls: [],
    fetchControlsLoading: false,

    regionIndexCode: undefined,
    regions: [],
    fetchRegionsLoading: false,

    faceStatus: -1,

    configTime: null,

    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    }
  };

  componentDidMount = async () => {
    // this.handleSearch(1);
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
        const { errorCode } = record;
        const errorCodeMapObj = errorCodeMap[errorCode];
        const msg = errorCodeMapObj ? errorCodeMapObj.name : errorCode;
        return <div>{msg}</div>;
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
              this.setState({ record, viewVisible: true }, () => {
                this.handleFetchDetail(1);
              });
            }}
          >
            查看详情
          </Button>
        );
      }
    }
  ];

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
      personId,
      jobNo,
      orgIndexCode,
      doorIndexCode,
      controlIndexCode,
      regionIndexCode,
      configTime
    } = this.state;
    if (!personId && !orgIndexCode && !doorIndexCode) {
      return message.error('为确保有效查询，请至少输入一项查询条件。');
    }

    this.setState({ loading: true });
    const conditions = {
      queryType: 'door',
      resourceInfos: []
    };
    if (personId) {
      conditions.personIds = [personId];
    }
    if (orgIndexCode) {
      conditions.orgIds = [orgIndexCode];
    }
    if (doorIndexCode) {
      conditions.resourceInfos.push({
        resourceIndexCode: doorIndexCode,
        resourceType: 'door'
      });
    }
    if (!conditions.resourceInfos.length) {
      delete conditions.resourceInfos;
    }
    if (configTime) {
      const startTime =
        configTime[0].format('YYYY-MM-DDTHH:mm') + ':08.000+08:00';
      const endTime =
        configTime[1].format('YYYY-MM-DDTHH:mm') + ':08.000+08:00';
      conditions.configTime = {
        startTime,
        endTime
      };
    }

    let res;
    try {
      res = await queryAuthItemList({
        pageNo,
        pageSize,
        ...conditions
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    // const { doors } = this.state;
    // res.data.list.forEach(item => {
    //   const doorIndexCode = item.resourceInfo.channelIndexCodes[0];
    //   const result = doors.find(item => item.indexCode === doorIndexCode);
    //   if (result) {
    //     item.doorName = result.name;
    //   } else {
    //     item.doorName = doorIndexCode;
    //   }
    // });
    // this.setState({
    //   dataSource: [...res.data.list],
    //   loading: false,
    //   pagination: {
    //     ...this.state.pagination,
    //     total: res.data.total,
    //     current: pageNo,
    //     pageSize
    //   }
    // });
  };

  handleFetchDetail = async (
    pageNo,
    pageSize = this.state.detailPagination.pageSize
  ) => {
    const { record } = this.state;
    this.setState({ viewLoading: true });
    let res;
    try {
      res = await queryDownloadDetail({
        pageNo,
        pageSize,
        downloadResultId: record.downloadResultId
      });
    } catch (err) {
      this.setState({ viewLoading: false });
      return message.error(err.message);
    }
    this.setState({
      viewLoading: false,
      detailDataSource: res.data.list,
      detailPagination: {
        ...this.state.detailPagination,
        pageNo,
        pageSize,
        total: res.total
      }
    });
  };

  handleReset = () => {
    this.setState({
      personId: undefined,
      jobNo: undefined,
      orgIndexCode: undefined,
      doorIndexCode: undefined,
      controlIndexCode: undefined,
      regionIndexCode: undefined,
      configTime: undefined
    });
  };

  handleTableChange = pagination => {
    this.handleSearch(pagination.current);
  };

  handleSearchPersons = debounce(async value => {
    if (!value) {
      return;
    }
    this.setState({ fetchPersonsLoading: true });
    let res;
    try {
      res = await queryPersonsByName(value);
    } catch (err) {
      this.setState({ fetchPersonsLoading: false });
      return message.error(err.message);
    }
    this.setState({ persons: res.data.list, fetchPersonsLoading: false });
  }, 200);

  handleSearchOrgs = debounce(async value => {
    if (!value) {
      return;
    }
    this.setState({ fetchOrgsLoading: true });
    let res;
    try {
      res = await queryOrgsByName(value);
    } catch (err) {
      this.setState({ fetchOrgsLoading: false });
      return message.error(err.message);
    }
    this.setState({ orgs: res.data.list, fetchOrgsLoading: false });
  }, 200);

  handleSearchDoors = debounce(async value => {
    if (!value) {
      return;
    }
    this.setState({ fetchDoorsLoading: true });
    let res;
    try {
      res = await queryDoorsByName(value);
    } catch (err) {
      this.setState({ fetchDoorsLoading: false });
      return message.error(err.message);
    }
    this.setState({ doors: res.data.list, fetchDoorsLoading: false });
  }, 200);

  handleSearchControls = debounce(async value => {
    if (!value) {
      return;
    }
    this.setState({ fetchControlsLoading: true });
    let res;
    try {
      res = await queryDevicesByName(value);
    } catch (err) {
      this.setState({ fetchControlsLoading: false });
      return message.error(err.message);
    }
    this.setState({ controls: res.data.list, fetchControlsLoading: false });
  }, 200);

  handleSearchRegions = debounce(async value => {
    if (!value) {
      return;
    }
    this.setState({ fetchRegionsLoading: true });
    let res;
    try {
      res = await queryRegionsByName(value);
    } catch (err) {
      this.setState({ fetchRegionsLoading: false });
      return message.error(err.message);
    }
    this.setState({ regions: res.data.list, fetchRegionsLoading: false });
  }, 200);

  render() {
    const {
      personId,
      persons,
      fetchPersonsLoading,
      jobNo,
      orgIndexCode,
      orgs,
      fetchOrgsLoading,

      doorIndexCode,
      doors,
      fetchDoorsLoading,

      controlIndexCode,
      controls,
      fetchControlsLoading,

      regionIndexCode,
      regions,
      fetchRegionsLoading,

      faceStatus,

      configTime
    } = this.state;
    return (
      <div className="auth-all-query">
        <div className="auth-all-query__search">
          <Form.Item label="姓名" className="auth-all-query__form-item">
            <Select
              showSearch
              value={personId}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.handleSearchPersons}
              onChange={personId =>
                this.setState({
                  personId
                })
              }
              notFoundContent={null}
              style={{ width: '100%' }}
              notFoundContent={
                fetchPersonsLoading ? '加载中...' : <Empty></Empty>
              }
            >
              {persons.map(person => (
                <Option key={person.personId} value={person.personId}>
                  {person.personName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="工号" className="auth-all-query__form-item">
            <Input
              value={jobNo}
              onChange={e => this.setState({ jobNo: e.target.value })}
            ></Input>
          </Form.Item>

          <Form.Item label="所属组织" className="auth-all-query__form-item">
            <Select
              showSearch
              value={orgIndexCode}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.handleSearchOrgs}
              onChange={orgIndexCode =>
                this.setState({
                  orgIndexCode
                })
              }
              notFoundContent={null}
              style={{ width: '100%' }}
              notFoundContent={fetchOrgsLoading ? '加载中...' : <Empty></Empty>}
            >
              {orgs.map(org => (
                <Option key={org.orgIndexCode} value={org.orgIndexCode}>
                  {org.orgNamePath}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="门禁点" className="auth-all-query__form-item">
            <Select
              showSearch
              value={doorIndexCode}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.handleSearchDoors}
              onChange={doorIndexCode =>
                this.setState({
                  doorIndexCode
                })
              }
              notFoundContent={null}
              style={{ width: '100%' }}
              notFoundContent={
                fetchDoorsLoading ? '加载中...' : <Empty></Empty>
              }
            >
              {doors.map(door => (
                <Option key={door.indexCode} value={door.indexCode}>
                  {door.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item label="控制器" className="auth-all-query__form-item">
            <Select
              showSearch
              value={controlIndexCode}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.handleSearchControls}
              onChange={controlIndexCode =>
                this.setState({
                  controlIndexCode
                })
              }
              notFoundContent={null}
              style={{ width: '100%' }}
              notFoundContent={
                fetchControlsLoading ? '加载中...' : <Empty></Empty>
              }
            >
              {controls.map(door => (
                <Option key={door.indexCode} value={door.indexCode}>
                  {door.name}
                </Option>
              ))}
            </Select>
          </Form.Item> */}

          {/* <Form.Item label="门禁点区域" className="auth-all-query__form-item">
            <Select
              showSearch
              value={regionIndexCode}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={this.handleSearchRegions}
              onChange={regionIndexCode =>
                this.setState({
                  regionIndexCode
                })
              }
              notFoundContent={null}
              style={{ width: '100%' }}
              notFoundContent={
                fetchRegionsLoading ? '加载中...' : <Empty></Empty>
              }
            >
              {regions.map(region => (
                <Option key={region.indexCode} value={region.indexCode}>
                  {region.regionNamePath}
                </Option>
              ))}
            </Select>
          </Form.Item> */}

          <Form.Item label="人脸" className="auth-all-query__form-item">
            <Select
              value={faceStatus}
              onChange={faceStatus =>
                this.setState({
                  faceStatus
                })
              }
              style={{ width: '100%' }}
            >
              {faceStatusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="人脸" className="auth-all-query__form-item">
            <RangePicker
              value={configTime}
              onChange={configTime => this.setState({ configTime })}
              showTime
            ></RangePicker>
          </Form.Item>

          <div className="auth-all-query__btns-wrapper">
            <Button type="primary" onClick={() => this.handleSearch(1)}>
              查询
            </Button>
            <Button onClick={this.handleReset}>重置</Button>
          </div>
        </div>

        <div className="auth-all-query__table">
          {/* <Table
            size="small"
            bordered
            columns={this.columns}
            dataSource={dataSource}
            loading={this.state.loading}
            rowKey="downloadResultId"
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
          ></Table> */}
        </div>
      </div>
    );
  }
}

export default AuthAllQuery;
