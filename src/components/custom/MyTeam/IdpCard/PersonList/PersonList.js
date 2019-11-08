import React from 'react';
import {
  message,
  Button,
  Modal,
  Spin,
  Tag,
  Input,
  Icon,
  Select,
  notification,
  Popconfirm
} from 'antd';
import './PersonList.less';
import http from 'Util20/api';
import TableData from '../../../../common/data/TableData';
import SelectPersonnel from '../../../../common/data/SelectPersonnel';
import SelectPersonSecond from '../../../SelectPersonSecond';
import PlanProgress from '../../../CreatePlan/PlanProgress';

/**
 * 管理员确认
 */

const personID = '618488751596'; //下属发展人员表ID
const groupID = '625831852694'; //分组表ID
const hrMangerID = '617725533684'; //发展计划总表

const { Option } = Select;
class PersonList extends React.Component {
  state = {
    mode: 'inline',
    theme: 'light',
    selectKey: '1',
    collapsed: false,
    visible: false, //选择人员模态框是否开启
    currentPlan: {},
    historyPlan: [],
    persons: [],
    loading: false,
    isShowProgress: false,
    taskList: [],
    status: '', //整个财年计划的状态
    selectedTags: [],
    inputVisible: false,
    inputValue: '',
    tags: [],
    selectedGroupValue: ''
  };

  componentDidMount = async () => {
    // console.log('status', this.props.record);
    this.getTags();
    if (this.props.role === 'Manger') {
      this.getEmployee();
    }
    this.setState({ status: this.props.record.status });
  };

  getEmployee = async () => {
    try {
      let res = await http().getTable({
        resid: '626379111634'
      });
      this._employee = [...res.data];
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  openNotification = success => {
    const args = {
      message: '通知',
      description: '已通知全部人员',
      icon: <Icon type="smile" style={{ color: '#108ee9', fontSize: 24 }} />,
      duration: 0
    };
    notification.open(args);
  };

  getTags = async () => {
    try {
      let res = await http().getTable({
        resid: groupID,
        cmswhere: `projectId = ${this.props.record.projectId}`
      });
      this.setState({
        tags: res.data
      });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };
  onNoticeEmployee = async (dataSource, selectKey) => {
    if (!selectKey.length > 0) {
      return message.error('请选择一条记录');
    }
    let res;
    let data = [];
    dataSource.map(item => {
      if (selectKey.includes(item.REC_ID)) {
        console.log('come in ');
        item.isMessage = 'Y';
        data.push(item);
      }
    });
    try {
      res = await http().modifyRecords({
        resid: personID,
        data
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  // 选择人员调用的回调函数
  handleSelectPerson = personList => {
    console.log({ personList });
    this.setState({ persons: personList });
  };

  // 点击完成调用的回调函数
  handleComplete = () => {
    let taskList = [];
    const { persons } = this.state;
    const { record } = this.props;
    let index_id = 0;
    persons.forEach(item => {
      let plans = {
        memberId: item.C3_305737857578, //员工编号
        year: record.year, //员工姓名
        projectId: record.projectId,
        _id: ++index_id,
        _state: 'editoradd'
      };
      taskList.push(plans);
    });

    this.setState({ isShowProgress: false, taskList });
    Modal.confirm({
      title: '选择分组',
      content: (
        <div>
          <Select
            placeholder="请选择一个分组"
            style={{ width: 200 }}
            onChange={v => this.setState({ selectedGroupValue: v })}
          >
            {this.state.tags.map(item => {
              return (
                <Option key={item.groupName} value={item.groupName}>
                  {item.groupName}
                </Option>
              );
            })}
          </Select>
        </div>
      ),
      onOk: () => {
        this.setState({
          isShowProgress: true,
          taskList: taskList.map(item => ({
            ...item,
            groupName: this.state.selectedGroupValue
          }))
        });
      },
      onCancel() {}
    });
  };
  //结束时调用的回调函数
  onFinishedPlanProgress = () => {
    this.setState({
      isShowProgress: false,
      visible: false,
      selectedGroupValue: ''
    });
    this.tableDataRef.handleRefresh();
  };

  onEmployeeWrite = async (dataSource, selectKey) => {
    if (!selectKey.length > 0) {
      return message.error('请选择一条记录');
    }
    let res;
    let data = [];
    dataSource.map(item => {
      if (selectKey.includes(item.REC_ID)) {
        console.log('come in ');
        item.sEmployeeWrite = 'Y';
        data.push(item);
      }
    });
    try {
      res = await http().modifyRecords({
        resid: personID,
        data
      });
      console.log('res.Error', res, res.Error);
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  onAddEmployee = () => {
    this.setState({
      visible: true
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  handleOk = () => {
    this.setState({
      visible: false
    });
  };
  onMangerWrite = async (dataSource, selectKey) => {
    if (!selectKey.length > 0) {
      return message.error('请选择一条记录');
    }
    let res;
    let data = [];
    dataSource.map(item => {
      if (selectKey.includes(item.REC_ID)) {
        console.log('come in ');
        item.sMangerWrite = 'Y';
        data.push(item);
      }
    });
    try {
      res = await http().modifyRecords({
        resid: personID,
        data
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  onCloseWrite = async (dataSource, selectKey) => {
    if (!selectKey.length > 0) {
      return message.error('请选择一条记录');
    }
    let res;
    let data = [];
    dataSource.map(item => {
      if (selectKey.includes(item.REC_ID)) {
        item.sEmployeeWrite = '';
        data.push(item);
      }
    });
    try {
      res = await http().modifyRecords({
        resid: personID,
        data
      });
      if (res.Error === 0) {
        message.success(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  handleChange(tag, checked) {
    const { selectedTag } = this.state;
    const nextSelectedTags = checked
      ? [...selectedTag, tag]
      : selectedTag.filter(t => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    this.setState({ selectedTag: nextSelectedTags });
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = async () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && !tags.find(tag => tag.groupName === inputValue)) {
      try {
        let res = await http().addRecords({
          resid: groupID,
          data: [
            { groupName: inputValue, projectId: this.props.record.projectId }
          ]
        });
        tags = [...tags, res.data[0]];
      } catch (error) {
        console.error(error);
        message.error(error.message);
      }
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: ''
    });
  };

  saveInputRef = input => (this.input = input);

  handleTagClick = tag => () => {
    let { selectedTags } = this.state;
    let isSelected = selectedTags.find(
      selectedTag => selectedTag.REC_ID === tag.REC_ID
    );
    if (isSelected) {
      selectedTags = selectedTags.filter(item => item.REC_ID !== tag.REC_ID);
    } else {
      selectedTags = [...selectedTags, tag];
    }
    this.setState({ selectedTags });
  };

  handleCloseTag = tagid => e => {
    e.stopPropagation();
    Modal.confirm({
      title: '您确定要删除该分组吗？',
      onCancel: () => {
        console.log('cancel');
      },
      onOk: () => {
        console.log('ok');
        this.deleteTag(tagid);
      }
    });
  };

  // 删除分组
  deleteTag = async tagid => {
    try {
      await http().removeRecords({
        resid: groupID,
        data: [{ REC_ID: tagid ,isDelete:'Y'}]
      });
      this.setState({
        tags: this.state.tags.filter(item => item.REC_ID !== tagid)
      });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  noticeAllEmployee = async () => {
    try {
      const res = await http().modifyRecords({
        resid: hrMangerID,
        data: [{ ...this.props.record, employWrite: 'Y' }]
      });
      this.openNotification(res.data[0].C3_626373935087 === 'Y');
    } catch (error) {
      console.error(error);
      notification.open({
        message: '出错',
        description: error.message,
        duration: 0
      });
    }
  };
  noticeEmployee = async () => {
    try {
      await http().modifyRecords({
        resid: '626379111634',
        data: this._employee.map(item => {
          return {
            REC_ID: item.REC_ID,
            sEmployeeWrite: 'Y'
          };
        })
      });
      const args = {
        message: '通知',
        description: '已通知全体下属',
        icon: <Icon type="smile" style={{ color: '#108ee9', fontSize: 24 }} />,
        duration: 0
      };
      notification.open(args);
    } catch (error) {
      console.error(error);
      notification.open({
        message: '出错',
        description: error.message,
        duration: 0
      });
    }
  };

  render() {
    const {
      visible,
      loading,
      isShowProgress,
      taskList,
      selectedTags,
      inputVisible,
      inputValue,
      tags
    } = this.state;
    const inCmswhere = selectedTags.length
      ? ` and groupName in (${selectedTags
          .map(item => `'${item.groupName}'`)
          .toString()})`
      : '';
    return (
      <div className="personlist-contain" style={{ height: '100%' }}>
        <header>
          <h5 style={{ marginRight: 8, marginBottom: 0, display: 'inline' }}>
            所属分组:
          </h5>
          {tags.map(tag => {
            const isSelected = selectedTags.find(
              item => item.REC_ID === tag.REC_ID
            );
            return (
              <Tag
                key={tag.REC_ID}
                className={isSelected ? 'checked-tag' : ''}
                onClick={this.handleTagClick(tag)}
              >
                <Icon type="close" onClick={this.handleCloseTag(tag.REC_ID)} />
                {tag.groupName}
              </Tag>
            );
          })}
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag
              onClick={this.showInput}
              style={{ background: '#fff', borderStyle: 'dashed' }}
            >
              <Icon type="plus" /> 添加新分组
            </Tag>
          )}
        </header>
        <div className="personlist-contain_tabledata_wraper">
          <TableData
            resid={personID}
            subtractH={220}
            hasBeBtns={false}
            hasRowSelection={true}
            wrappedComponentRef={element => (this.tableDataRef = element)}
            refTargetComponentName="TableData"
            hasAdd={false}
            hasModify={false}
            hasRowDelete={true}
            hasDelete={true}
            hasRowModify={false}
            hasRowView={this.state.status == '已完成' ? true : false}
            actionBarFixed={true}
            hasAdvSearch={true}
            height="100%"
            cmswhere={
              this.props.role === 'HR'
                ? `projectId = '${this.props.record &&
                    this.props.record.projectId}' ${inCmswhere}`
                : `projectId = '${this.props.record &&
                    this.props.record.projectId}' and directorId = '${this.props
                    .record && this.props.record.memberId}' ${inCmswhere}`
            }
            customRowBtns={[
              (record, btnSize) => {
                return this.state.status == '已完成' ? (
                  ''
                ) : (
                  <Button
                    onClick={() => {
                      this.props.onLookPerson(record);
                    }}
                    // style={{
                    //   marginTop: '8px',
                    //   fontSize: '14px',
                    //   height: '24px',
                    //   padding: '0 7px'
                    // }}
                  >
                    修改
                  </Button>
                );
              }
            ]}
            actionBarExtra={({ dataSource, selectedRowKeys, data }) => {
              return (
                <React.Fragment>
                  <Button
                    onClick={() => {
                      this.onAddEmployee();
                    }}
                  >
                    添加员工
                  </Button>
                  <Button
                    onClick={() => {
                      this.onEmployeeWrite(dataSource, selectedRowKeys);
                    }}
                  >
                    提醒员工
                  </Button>
                  <Button
                    onClick={() => {
                      this.onEmployeeWrite(dataSource, selectedRowKeys);
                    }}
                  >
                    开启员工填写
                  </Button>

                  {/* {this.props.role === 'HR' ? (
                  <Button
                    onClick={() => {
                      this.onMangerWrite(dataSource, selectedRowKeys);
                    }}
                  >
                    开启主管填写
                  </Button>
                ) : null} */}
                  <Button
                    onClick={() => {
                      this.onCloseWrite(dataSource, selectedRowKeys);
                    }}
                  >
                    关闭员工填写
                  </Button>
                  {this.props.role === 'HR' && (
                    <Popconfirm
                      title="确定开启全部员工填写？"
                      onConfirm={this.noticeAllEmployee}
                    >
                      <Button>开启全部员工填写</Button>
                    </Popconfirm>
                  )}
                  {this.props.role === 'Manger' && (
                    <Popconfirm
                      title="确定开启全体下属填写？"
                      onConfirm={this.noticeEmployee}
                    >
                      <Button>开启全体下属填写</Button>
                    </Popconfirm>
                  )}
                </React.Fragment>
              );
            }}
          />
        </div>
        <Modal
          title="选择人员"
          width="90%"
          height="90%"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={false}
        >
          <div className="fisrtStepSelected" style={{ height: '70vh' }}>
            {loading && (
              <div className="person-list__spin">
                <Spin />
              </div>
            )}
            <SelectPersonnel
              radioGroupConfig={[
                {
                  type: 'list',
                  title: '按级别添加',
                  resid: 449335746776,
                  nameField: 'C3_587136281870'
                },
                {
                  type: 'tree',
                  title: '按部门添加',
                  resid: 466282405067,
                  nameField: 'DEP_NAME',
                  idField: 'DEP_ID',
                  pidField: 'DEP_PID'
                },
                {
                  type: 'search',
                  title: '输入关键词搜索'
                },
                {
                  type: 'file',
                  title: '请选择要上传的文件'
                }
              ]}
              subResid={609599795438}
              secondFilterInputPlaceholder="输入关键词搜索"
              personFields={[
                '',
                'C3_227192472953',
                'C3_227192484125',
                'C3_227212499515'
              ]}
              personPrimaryKeyField="C3_227192472953"
              stepList={[
                {
                  stepTitle: '验证',
                  renderContent: current => {
                    return (
                      <SelectPersonSecond
                        persons={this.state.persons}
                        onCheckboxChange={this.handleCheckboxChange}
                      />
                    );
                  }
                }
              ]}
              completeText="完成"
              onSelectPerson={this.handleSelectPerson}
              onComplete={this.handleComplete}
            />

            {isShowProgress ? (
              <PlanProgress
                onFinished={this.onFinishedPlanProgress}
                struct="100"
                options={{
                  resid: 618488751596,
                  data: JSON.stringify(taskList)
                }}
                title="添加人员列表"
                // showFields={['C3_609622263470', 'C3_609845305680']}
                // width='50%'
              />
            ) : null}
          </div>
        </Modal>
      </div>
    );
  }
}

export default PersonList;
