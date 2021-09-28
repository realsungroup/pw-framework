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
  getAllRegions,
  queryDownloadRecords,
  queryDownloadDetail,
  queryPersonsByName,
  queryOrgsByName,
  queryDoorsByName,
  queryDevicesByName,
  queryRegionsByName,
  queryAuthItemList,
  queryPersons,
  queryDoors
} from '../../../hikApi';
import { errorCodeMap } from 'Util20/errorCodeMap';
import moment from 'moment';
import { debounce, uniq } from 'lodash';

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
      pageSize: 20,
      total: 0,
      showTotal: total => `共 ${total} 条`
    },

    dataSource: [],
    allDoors: [],

    scroll: { y: 100 }
  };

  componentDidMount = async () => {
    let res;
    try {
      res = await queryDoors({
        pageNo: 1,
        pageSize: 1000
      });
    } catch (err) {
      return message.error(err.message);
    }

    this.setState({ allDoors: res.data.list });
    this.setScroll();
  };

  setScroll = () => {
    const wH = window.innerHeight;
    const otherH = 54 + 160 + 24 + 64 + 70;
    const y = wH - otherH;
    this.setState({ scroll: { y } });
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
      title: '姓名',
      dataIndex: 'personName',
      key: 'personName',
      width: 200
    },
    {
      width: 200,
      title: '工号',
      dataIndex: 'jobNo',
      key: 'jobNo'
    },
    {
      width: 200,
      title: '所属组织',
      dataIndex: 'orgPathName',
      key: 'orgPathName'
    },
    { width: 200, title: '门禁点', dataIndex: 'doorName', key: 'doorName' },
    {
      width: 200,
      title: '权限有效期',
      dataIndex: '权限有效期',
      key: '权限有效期',
      render: (text, record) => {
        const { startTime, endTime } = record;
        const newStartTime = startTime
          ? moment(startTime).format('YYYY/MM/DD')
          : null;
        const newEndTIme = endTime
          ? moment(endTime).format('YYYY/MM/DD')
          : null;

        return (
          <div>
            {newStartTime} - {newEndTIme}
          </div>
        );
      }
    },
    {
      width: 200,
      title: '门禁点区域',
      dataIndex: 'doorRegion',
      key: 'doorRegion'
    },
    {
      width: 200,
      title: '配置时间',
      dataIndex: 'configTime',
      key: 'configTime'
    },
    {
      width: 200,
      title: '人脸',
      dataIndex: '人脸',
      key: '人脸',
      render: (text, record) => {
        const { faceStatus } = record;
        const result = faceStatusOptions.find(
          option => option.value === faceStatus
        );
        if (result) {
          return <div>{result.label}</div>;
        }
        return '';
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
      configTime,
      faceStatus
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
    if (faceStatus !== -1) {
      conditions.faceStatus = [faceStatus];
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

    let personIds = [];
    let doorIndexCodes = [];
    res.data.list.forEach(item => {
      personIds.push(item.personId);
      doorIndexCodes.push(item.channelIndexCode);
    });
    personIds = uniq(personIds);
    doorIndexCodes = uniq(doorIndexCodes);
    let personRes;
    try {
      personRes = await queryPersons({
        personIds: personIds.join(','),
        pageNo: 1,
        pageSize: 1000
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    const personList = personRes.data.list;
    const doorList = this.state.allDoors;

    res.data.list.forEach(item => {
      const { personId, channelIndexCode } = item;
      const personResult = personList.find(item => item.personId === personId);
      if (personResult) {
        item.personName = personResult.personName;
        item.jobNo = personResult.jobNo;
        item.orgPathName = personResult.orgPathName;
      }

      const doorResult = doorList.find(
        door => door.indexCode === channelIndexCode
      );
      if (doorResult) {
        item.doorName = doorResult.name;
        item.doorRegion = doorResult.regionPathName;
      }
    });

    this.setState({
      dataSource: res.data.list,
      pagination: {
        ...this.state.pagination,
        current: pageNo,
        pageSize,
        total: res.data.total
      },
      loading: false
    });
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

      configTime,
      dataSource
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

          <Form.Item label="配置时间" className="auth-all-query__form-item">
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
          <Table
            bordered
            columns={this.columns}
            dataSource={dataSource}
            loading={this.state.loading}
            rowKey="downloadResultId"
            pagination={{ ...this.state.pagination }}
            onChange={this.handleTableChange}
            scroll={{ ...this.state.scroll, x: 1600 }}
          ></Table>
        </div>
      </div>
    );
  }
}

export default AuthAllQuery;
