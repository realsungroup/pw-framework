import React from 'react';
import {
  Modal,
  Form,
  Table,
  message,
  Spin,
  Select,
  Empty,
  Button,
  Input,
  DatePicker
} from 'antd';
import './AuthDownloadRecordDetailModal.less';
import {
  queryDownloadDetail,
  queryPersons,
  queryOrgsByName
} from '../../../hikApi';
import { errorCodeMap } from 'Util20/errorCodeMap';
import { keyBy, debounce, uniq } from 'lodash';
import { queryPersonsByName } from '../../../hikApi';

const { Option } = Select;
const { RangePicker } = DatePicker;

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

class AuthDownloadRecordDetailModal extends React.Component {
  state = {
    viewLoading: false,
    detailPagination: {
      current: 1,
      pageSize: 20,
      total: 0
    },
    personId: undefined,
    persons: [],
    fetchPersonsLoading: false,
    jobNo: undefined,

    orgIndexCode: undefined,
    orgs: [],
    fetchOrgsLoading: false,

    downloadResult: -1,

    downloadTime: undefined
  };

  componentDidMount = () => {
    this.handleFetchDetail(1);
  };

  handleFetchDetail = async (
    pageNo,
    pageSize = this.state.detailPagination.pageSize
  ) => {
    const { downloadResultId } = this.props;
    const {
      personId,
      jobNo,
      orgIndexCode,
      downloadResult,
      downloadTime
    } = this.state;
    this.setState({ viewLoading: true });
    let res;

    const obj = {
      pageNo,
      pageSize,
      downloadResultId
    };
    if (personId) {
      obj.personIds = [personId];
    }
    if (orgIndexCode) {
      obj.orgIds = [orgIndexCode];
    }
    if (downloadResult !== -1) {
      obj.downloadResult = downloadResult;
    }
    if (downloadTime) {
      obj.downloadTime = {
        startTime: `${downloadTime[0].format('YYYY-MM-DDTHH:mm:ss')}.000+08:00`,
        endTime: `${downloadTime[1].format('YYYY-MM-DDTHH:mm:ss')}.000+08:00`
      };
    }

    try {
      res = await queryDownloadDetail(obj);
    } catch (err) {
      this.setState({ viewLoading: false });
      return message.error(err.message);
    }

    let resDataList = res.data.list ? res.data.list : [];

    // 获取人员详细信息
    const personDetailRes = await queryPersons({
      personIds: resDataList
        .map(item => item.personId)
        .filter(Boolean)
        .join(','),
      pageNo: 1,
      pageSize: 1000
    });
    const personDetailResDataList =
      (personDetailRes && personDetailRes.data && personDetailRes.data.list) ||
      [];
    const personsMap = keyBy(personDetailResDataList, o => {
      return o.personId;
    });

    resDataList.forEach(item => {
      item.personDetail = personsMap[item.personId];
    });

    if (jobNo) {
      resDataList = resDataList.filter(
        item => item.personDetail.jobNo === jobNo
      );
    }

    this.setState({
      viewLoading: false,
      detailDataSource: resDataList,
      detailPagination: {
        ...this.state.detailPagination,
        current: pageNo,
        pageSize,
        total: res.data.total
      }
    });
  };

  detailColumns = [
    {
      title: '姓名',
      dataIndex: 'personDetail.personName',
      key: 'personDetail.personName'
    },
    {
      title: '工号',
      dataIndex: 'personDetail.jobNo',
      key: 'personDetail.jobNo'
    },
    {
      title: '所属组织',
      dataIndex: 'personDetail.orgPathName',
      key: 'personDetail.orgPathName'
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
        if (persondownloadResult === '0') {
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
        } else if (persondownloadResult === '1') {
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
      title: '描述',
      dataIndex: '描述',
      key: '描述',
      render: (text, record) => {
        const { personId } = record;
        if (
          record &&
          record.personDownloadDetail &&
          record.personDownloadDetail.faces &&
          record.personDownloadDetail.faces[0] &&
          record.personDownloadDetail.faces[0].operatorType
        ) {
          let msg;
          if (record.personDownloadDetail.faces[0].operatorType === 1) {
            msg = '下载';
          } else {
            msg = '删除';
          }
          return `人员${msg}成功:${personId}`;
        }

        return '';
      }
    }
  ];

  handleTableChange = pagination => {
    this.handleFetchDetail(pagination.current);
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

  handleReset = () => {
    this.setState({
      personId: undefined,
      job: undefined,
      orgIndexCode: undefined
    });
  };

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

  render() {
    const { ...otherProps } = this.props;
    const { viewLoading, personId, persons, fetchPersonsLoading } = this.state;

    return (
      <Modal
        visible={this.state.viewVisible}
        title="下载详情"
        width={1100}
        footer={null}
        {...otherProps}
      >
        <Spin spinning={viewLoading}>
          <div className="auth-download-record-detail-modal__search">
            <Form.Item
              label="姓名"
              className="auth-download-record-detail-modal__form-item"
            >
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

            <Form.Item
              label="工号"
              className="auth-download-record-detail-modal__form-item"
            >
              <Input
                value={this.state.jobNo}
                onChange={e => this.setState({ jobNo: e.target.value })}
              ></Input>
            </Form.Item>

            <Form.Item
              label="所属组织"
              className="auth-download-record-detail-modal__form-item"
            >
              <Select
                showSearch
                value={this.state.orgIndexCode}
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
                notFoundContent={
                  this.state.fetchOrgsLoading ? '加载中...' : <Empty></Empty>
                }
              >
                {this.state.orgs.map(org => (
                  <Option key={org.orgIndexCode} value={org.orgIndexCode}>
                    {org.orgNamePath}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="下载时间"
              className="auth-download-record-detail-modal__form-item"
            >
              <RangePicker
                value={this.state.downloadTime}
                onChange={dates => {
                  this.setState({ downloadTime: dates });
                }}
                showTime
                format="YYYY/MM/DD HH:mm"
              ></RangePicker>
            </Form.Item>

            <Form.Item
              label="下载结果"
              className="auth-download-record-detail-modal__form-item"
            >
              <Select
                showSearch
                maxTagCount={1}
                style={{ width: '100%' }}
                value={this.state.downloadResult}
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
                  }
                ].map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <div className="auth-download-record-detail-modal__btns-wrapper">
              <Button type="primary" onClick={() => this.handleFetchDetail(1)}>
                查询
              </Button>
              <Button onClick={this.handleReset}>重置</Button>
            </div>
          </div>

          <Table
            style={{ marginTop: 36 }}
            size="small"
            columns={this.detailColumns}
            dataSource={this.state.detailDataSource}
            bordered
            pagination={this.state.detailPagination}
            onChange={this.handleTableChange}
          ></Table>
        </Spin>
      </Modal>
    );
  }
}

export default Form.create()(AuthDownloadRecordDetailModal);
