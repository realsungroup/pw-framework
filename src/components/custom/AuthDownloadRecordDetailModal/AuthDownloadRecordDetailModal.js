import React from 'react';
import { Modal, Form, Table, message, Spin } from 'antd';
import DoorsSelect from '../DoorsSelect';
import './AuthDownloadRecordDetailModal.less';
import http from 'Util20/api';
import PropTypes from 'prop-types';
import { queryDownloadDetail, queryPersons } from '../../../hikApi';
import { errorCodeMap } from 'Util20/errorCodeMap';
import { keyBy } from 'lodash';

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

class AuthDownloadRecordDetailModal extends React.Component {
  state = {
    viewLoading: false,
    detailPagination: {
      current: 1,
      pageSize: 20,
      total: 0
    }
  };

  componentDidMount = () => {
    this.handleFetchDetail(1);
  };

  handleFetchDetail = async (
    pageNo,
    pageSize = this.state.detailPagination.pageSize
  ) => {
    const { downloadResultId } = this.props;
    this.setState({ viewLoading: true });
    let res;
    try {
      res = await queryDownloadDetail({
        pageNo,
        pageSize,
        downloadResultId
      });
    } catch (err) {
      this.setState({ viewLoading: false });
      return message.error(err.message);
    }

    const resDataList = res.data.list ? res.data.list : [];

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

  render() {
    const { ...otherProps } = this.props;
    const { viewLoading } = this.state;

    return (
      <Modal
        visible={this.state.viewVisible}
        title="下载详情"
        width={1100}
        footer={null}
        {...otherProps}
      >
        <Spin spinning={viewLoading}>
          <Table
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
