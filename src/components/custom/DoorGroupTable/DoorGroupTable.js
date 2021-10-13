import React from 'react';
import {
  DatePicker,
  Modal,
  Table,
  Input,
  Icon,
  Collapse,
  message,
  Spin,
  Tooltip,
  Progress
} from 'antd';
import './DoorGroupTable.less';
import PropTypes from 'prop-types';
import moment from 'moment';
import http from 'Util20/api';
import {
  queryDoors,
  removeRightById,
  authConfigProgress
} from '../../../hikApi';
import DoorGroupListModal from './DoorGroupListModal';

const realsunApiBaseURL =
  window.pwConfig[process.env.NODE_ENV].realsunApiBaseURL;

const customPanelStyle = {
  background: '#fff'
};

const { Search } = Input;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

class DoorGroupTable extends React.Component {
  static propTypes = {
    /**
     * 选中的人员分组 id
     */
    selectedPersonGroupId: PropTypes.string.isRequired,

    /**
     * 人员分组列表
     */
    personGroupList: PropTypes.array,

    /**
     * 模式
     */
    mode: PropTypes.oneOf(['personGroup', 'org'])
  };

  static propTypes = {
    mode: 'personGroup'
  };

  // 所有的门禁点
  allDoors = [];

  // 所有的门禁分组
  allDoorGroups = [];

  state = {
    selectedRowKeys: [],
    searchGroupValue: '',
    searchDoorValue: '',
    isModifyModalOpen: false,
    selectedRecord: null,
    date: [],

    groupList: [],
    doorList: [],
    loading: false,
    doorGroupTableVisible: false,
    doorGroupListDataSource: [],
    doorGroupListModalTitle: '',
    doorGroupName: '',
    doorName: '',
    percent: 0,
    progressVisible: false
  };

  componentDidMount = async () => {
    const { mode, selectedPersonGroupId, orgIndexCode } = this.props;
    await Promise.all([this.getAllDoors(), this.getAllDoorGroups()]);
    if (mode === 'personGroup') {
      if (selectedPersonGroupId) {
        this.getData();
      }
    } else {
      if (orgIndexCode) {
        this.getDataByOrgIndexCode();
      }
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { mode } = this.props;

    if (mode === 'personGroup') {
      if (
        prevProps.selectedPersonGroupId !== this.props.selectedPersonGroupId
      ) {
        this.getData();
      }
    } else {
      if (prevProps.orgIndexCode !== this.props.orgIndexCode) {
        this.getDataByOrgIndexCode();
      }
    }
  };

  getAllDoors = async () => {
    let res;
    try {
      res = await queryDoors({
        pageNo: 1,
        pageSize: 1000
      });
    } catch (err) {
      return message.error(err.message);
    }
    this.allDoors = res.data.list;
  };

  getAllDoorGroups = async () => {
    let res;
    try {
      res = await http({ baseURL: realsunApiBaseURL }).getTable({
        resid: 683210011323,
        subresid: 682507735244
      });
    } catch (err) {
      return message.error(err.message);
    }
    this.allDoorGroups = res.data;
  };

  getData = async () => {
    this.setState({ loading: true });
    const { selectedPersonGroupId } = this.props;
    let res;
    try {
      res = await http({ baseURL: realsunApiBaseURL }).getTable({
        resid: 684097503067,
        cmswhere: `personGroupId = '${selectedPersonGroupId}'`
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    const groupList = [];
    const doorList = [];
    res.data.forEach(item => {
      if (item.doorType === 'group') {
        groupList.push(item);
      } else if (item.doorType === 'door') {
        doorList.push(item);
      }
    });

    this.processGroupListDetails(groupList);
    this.processDoorListDetails(doorList);

    this.setState({
      groupList,
      doorList,
      loading: false,
      doorGroupName: '',
      doorName: '',
      percent: 0
    });
  };

  getDataByOrgIndexCode = async () => {
    this.setState({ loading: true });
    const { orgIndexCode } = this.props;
    let res;
    try {
      res = await http({ baseURL: realsunApiBaseURL }).getTable({
        resid: 686951200660,
        cmswhere: `orgIndexCode = '${orgIndexCode}'`
      });
    } catch (err) {
      this.setState({ loading: false });
      return message.error(err.message);
    }
    const groupList = [];
    const doorList = [];
    res.data.forEach(item => {
      if (item.doorType === 'group') {
        groupList.push(item);
      } else if (item.doorType === 'door') {
        doorList.push(item);
      }
    });

    this.processGroupListDetails(groupList);
    this.processDoorListDetails(doorList);

    this.setState({
      groupList,
      doorList,
      loading: false,
      doorGroupName: '',
      doorName: '',
      percent: 0
    });
  };

  processGroupListDetails = groupList => {
    const allDoorGroups = this.allDoorGroups;
    groupList.forEach(groupRecord => {
      const result = allDoorGroups.find(
        item => String(item.groupId) === groupRecord.groupId
      );
      if (result) {
        groupRecord.groupDetail = result;
      }
    });
    return groupList;
  };

  processDoorListDetails = async doorList => {
    const allDoors = this.allDoors;
    doorList.forEach(doorRecord => {
      const result = allDoors.find(
        item => item.indexCode === doorRecord.doorIndexCode
      );
      if (result) {
        doorRecord.doorDetail = { ...result };
      }
    });
  };

  /**
   * 搜索门禁点组件
   */
  renderSearchDoor = () => {
    return (
      <Search
        placeholder="搜索门禁点名称"
        onClick={e => {
          if (e && e.stopPropagation) {
            e.stopPropagation();
          } else {
            window.event.cancelBubble = true;
          }
        }}
      ></Search>
    );
  };

  /**
   * 修改权限有效期
   * @param {object} record
   */
  modifyAssessDate = () => {
    const { selectedRecord } = this.state;
    console.log(selectedRecord);
    this.closeAllModal();
  };

  /**
   * 关闭所有模态框
   */
  closeAllModal = () => {
    this.setState({
      isModifyModalOpen: false
    });
  };

  commonColumns = [
    {
      title: '权限有效期',
      dataIndex: '权限有效期',
      key: '权限有效期',
      render: (text, record) => {
        const { startTime, endTime } = record;
        return `${moment(startTime).format('YYYY/MM/DD')} - ${moment(
          endTime
        ).format('YYYY/MM/DD')}`;
      }
    },
    {
      title: '操作',
      dataIndex: '操作',
      key: '操作',
      ellipsis: true,
      render: (text, record) => {
        return (
          <div>
            <span style={{ marginRight: '12px' }}>
              <Tooltip title="删除权限">
                <Icon
                  type="delete"
                  onClick={() => {
                    const { onRemove } = this.props;
                    onRemove && onRemove(record);
                  }}
                />
              </Tooltip>
            </span>
            <span>
              <Tooltip title="修改有效期">
                <Icon
                  type="dashboard"
                  onClick={() => {
                    const { onModifyDate } = this.props;
                    onModifyDate && onModifyDate(record);
                  }}
                />
              </Tooltip>
            </span>
          </div>
        );
      }
    }
  ];

  groupColumns = [
    {
      title: '门禁分组',
      dataIndex: 'groupDetail.name',
      key: 'groupDetail.name',
      ellipsis: true
    },
    {
      title: '分组详情',
      dataIndex: '分组详情',
      key: '分组详情',
      ellipsis: true,
      render: (text, record, index) => {
        let count = 0,
          subdata = [];
        if (Array.isArray(record.groupDetail.subdata)) {
          count = record.groupDetail.subdata.length;
          subdata = record.groupDetail.subdata;
        }
        return (
          <a
            href="javascript:;"
            onClick={() =>
              this.setState({
                doorGroupTableVisible: true,
                doorGroupListDataSource: subdata,
                doorGroupListModalTitle: record.groupDetail.name
              })
            }
          >
            {`${count}(${subdata.map(item => `${item.name}`).join(',')})`}
          </a>
        );
      }
    },
    ...this.commonColumns
  ];

  doorColumns = [
    {
      title: '门禁点',
      dataIndex: 'doorDetail.name',
      key: 'doorDetail.name',
      ellipsis: true
    },
    {
      title: '所在区域',
      dataIndex: 'doorDetail.regionPathName',
      key: 'doorDetail.regionPathName',
      ellipsis: true
    },
    ...this.commonColumns
  ];

  getRowSelection = () => {
    const { mode, selectedRowKeys, onRowSelectionChange } = this.props;
    if (mode !== 'org') {
      return;
    }
    return {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        onRowSelectionChange &&
          onRowSelectionChange(selectedRowKeys, selectedRows);
      }
    };
  };

  render() {
    const tableFooter = {
      pagination: {
        pageSize: 5
      }
    };
    const {
      groupList,
      doorList,
      isModifyModalOpen,
      date,
      loading,
      doorGroupTableVisible,
      doorGroupListDataSource,
      doorGroupListModalTitle,
      doorGroupName,
      doorName,
      percent,
      progressVisible
    } = this.state;

    return (
      <div className="door-group-table">
        <Spin spinning={loading}>
          <Collapse defaultActiveKey={['1', '2']}>
            <Panel
              header={
                <div
                  style={{
                    display: 'inline-block',
                    height: 32,
                    lineHeight: '32px'
                  }}
                >
                  门禁分组
                </div>
              }
              key="1"
              extra={(() => {
                return (
                  <Search
                    placeholder="搜索门禁分组名称"
                    onChange={e =>
                      this.setState({ doorGroupName: e.target.value })
                    }
                    onClick={e => e.stopPropagation()}
                  ></Search>
                );
              })()}
              style={customPanelStyle}
            >
              <Table
                columns={this.groupColumns}
                dataSource={groupList.filter(item => {
                  if (!doorGroupName) {
                    return true;
                  }
                  if (item.groupDetail.name.includes(doorGroupName)) {
                    return true;
                  }
                  return false;
                })}
                {...tableFooter}
                rowSelection={this.getRowSelection()}
                rowKey="REC_ID"
              />
            </Panel>
            <Panel
              header={
                <div
                  style={{
                    display: 'inline-block',
                    height: 32,
                    lineHeight: '32px'
                  }}
                >
                  门禁点
                </div>
              }
              key="2"
              extra={(() => {
                return (
                  <Search
                    placeholder="搜索门禁点名称"
                    onChange={e => this.setState({ doorName: e.target.value })}
                    onClick={e => e.stopPropagation()}
                  ></Search>
                );
              })()}
              style={customPanelStyle}
            >
              <Table
                columns={this.doorColumns}
                dataSource={doorList.filter(item => {
                  if (!doorName) {
                    return true;
                  }
                  if (item.doorDetail.name.includes(doorName)) {
                    return true;
                  }
                  return false;
                })}
                {...tableFooter}
                rowSelection={this.getRowSelection()}
                rowKey="REC_ID"
              />
            </Panel>
          </Collapse>
        </Spin>

        {/* 修改有效期 */}
        <Modal
          visible={isModifyModalOpen}
          onCancel={this.closeAllModal}
          onOk={this.modifyAssessDate}
        >
          <div style={{ margin: '8px 8px 16px 8px' }}>
            <span>设置权限有效期</span>
            <div>
              <RangePicker
                defaultValue={date}
                onChange={(date, dateString) => {
                  console.log(date, dateString);
                }}
              ></RangePicker>
            </div>
          </div>
        </Modal>
        <DoorGroupListModal
          visible={doorGroupTableVisible}
          onCancel={() => this.setState({ doorGroupTableVisible: false })}
          dataSource={doorGroupListDataSource}
          title={doorGroupListModalTitle}
          destroyOnClose
        ></DoorGroupListModal>
      </div>
    );
  }
}

export default DoorGroupTable;
