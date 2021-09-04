import React from 'react';
import {
  Layout,
  Tabs,
  DatePicker,
  Modal,
  Table,
  Input,
  Icon,
  Collapse,
  message
} from 'antd';
import './DoorGroupTable.less';
import PropTypes from 'prop-types';
import moment from 'moment';

const customPanelStyle = {
  background: '#fff'
};

const { Search } = Input;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

class DoorGroupTable extends React.Component {
  static propTypes = {
    /**
     * 选中的人员分组 key,会根据数组的第一个REC_ID查询数据
     */
    selectedRowKeys: PropTypes.array
  };

  state = {
    selectedRowKeys: [],
    searchGroupValue: '',
    searchDoorValue: '',
    isDeleteModalOpen: false,
    isModifyModalOpen: false,
    selectedRecord: null,
    date: [],
    groupData: [
      {
        groupName: '测试1',
        describe: '用来测试的数据',
        plane: '默认模板',
        effectDate: '2021/12/12-2021/12/12'
      },
      {
        groupName: '测试1',
        describe: '用来测试的数据',
        plane: '默认模板',
        effectDate: '2021.12.12-2021.12.12'
      }
    ],
    doorData: [
      {
        point: '测试1',
        area: '用来测试的数据',
        plane: '默认模板',
        effectDate: '2021.12.12-2021.12.12'
      },
      {
        groupName: '测试1',
        describe: '用来测试的数据',
        plane: '默认模板',
        effectDate: '2021.12.12-2021.12.12'
      }
    ]
  };

  /**
   * 钩子函数，用来监听props变化
   * @param {*} props
   * @param {*} state
   * @returns
   */
  static getDerivedStateFromProps(props, state) {
    const { selectedRowKeys } = props;
    if (props.selectedRowKeys !== state.selectedRowKeys) {
      return { selectedRowKeys };
    }
    return null;
  }

  /**
   * 搜索门禁分组组件
   */
  renderSearchGroup = () => {
    return (
      <Search
        placeholder="搜索门禁分组名称"
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
   * 根据选中列的最后一项，确定右侧表格展示何种数据
   * @param {String} recid
   */
  getDataBySelectedRowKeys = async recid => {
    console.log(recid);
    let res1, res2;
    try {
      // res1 = await http().getTable({
      //   resid:1
      // })
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  /**
   * 删除授权
   * @param {object} record
   */
  removeAssess = () => {
    const { selectedRecord } = this.state;
    console.log(selectedRecord);
    this.closeAllModal();
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
      isModifyModalOpen: false,
      isDeleteModalOpen: false
    });
  };

  render() {
    const columnsGroup = [
      {
        title: '门禁分组',
        dataIndex: 'groupName',
        key: 'groupName',
        ellipsis: true,
        width: '20%'
      },
      {
        title: '分组详情',
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
        width: '30%'
      }
    ];
    const columnsDoor = [
      {
        title: '门禁点',
        dataIndex: 'point',
        key: 'point',
        ellipsis: true,
        width: '20%'
      },
      {
        title: '所在区域',
        dataIndex: 'area',
        key: 'area',
        ellipsis: true,
        width: '30%'
      }
    ];
    const columnsAll = [
      {
        title: '权限有效期',
        dataIndex: 'effectDate',
        key: 'effectDate',
        width: 180,
        width: '20%'
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width: '15%',
        render: (text, record) => {
          return (
            <div>
              <span style={{ marginRight: '12px' }}>
                <Icon
                  type="delete"
                  onClick={() => {
                    this.setState({
                      isDeleteModalOpen: true,
                      selectedRecord: record
                    });
                  }}
                />
              </span>
              <span>
                <Icon
                  type="dashboard"
                  onClick={() => {
                    this.setState(
                      {
                        isModifyModalOpen: true,
                        selectedRecord: record,
                        date: record.effectDate
                          .split('-')
                          .map(item => moment(item, 'YYYY-MM-DD hh:mm:ss'))
                      },
                      () => {
                        console.log(record.effectDate.split('-'), date);
                      }
                    );
                  }}
                />
              </span>
            </div>
          );
        }
      }
    ];
    const tableFooter = {
      pagination: {
        pageSize: 5
      }
    };
    const {
      groupData,
      doorData,
      isModifyModalOpen,
      isDeleteModalOpen,
      selectedRecord,
      date
    } = this.state;
    const { selectedRowKeys = [], personGroupList = [] } = this.props;

    // 对props的值作处理
    let selectedPersonGroupList = [{ name: '' }];
    if (selectedRowKeys.length >= 1) {
      selectedPersonGroupList = personGroupList.filter(
        item =>
          item.REC_ID.toString() === selectedRowKeys[selectedRowKeys.length - 1]
      );
      this.getDataBySelectedRowKeys(
        selectedRowKeys[selectedRowKeys.length - 1]
      );
    }

    return (
      <div className="">
        <Collapse defaultActiveKey={['1', '2']}>
          <Panel
            header={`门禁分组`}
            key="1"
            extra={this.renderSearchGroup()}
            style={customPanelStyle}
          >
            <Table
              columns={[...columnsGroup, ...columnsAll]}
              dataSource={groupData}
              {...tableFooter}
            />
          </Panel>
          <Panel
            header={`门禁点(${doorData.length})`}
            key="2"
            extra={this.renderSearchDoor()}
            style={customPanelStyle}
          >
            <Table
              columns={[...columnsDoor, ...columnsAll]}
              dataSource={doorData}
              {...tableFooter}
            />
          </Panel>
        </Collapse>

        {/* 删除权限 */}
        <Modal
          visible={isDeleteModalOpen}
          onCancel={this.closeAllModal}
          onOk={this.removeAssess}
        >
          <span>{`确定删除${selectedPersonGroupList.length >= 1 &&
            selectedPersonGroupList[0].name}的${selectedRecord &&
            selectedRecord.groupName}权限？`}</span>
        </Modal>

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
      </div>
    );
  }
}

export default DoorGroupTable;
