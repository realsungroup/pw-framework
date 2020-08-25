import React from 'react';
import './ReviewEmployee.less';
import { TableData } from '../../../common/loadableCommon';
import {
  Button,
  Modal,
  Popconfirm,
  message,
  Tag,
  List,
  Radio,
  Progress,
  notification,
  Icon,
  Tooltip
} from 'antd';
import SelectEmployeeToNotice from './SelectEmployeeToNotice';
import SelectEmployeeToAdd from './SelectEmployeeToAdd';
import http from 'Util20/api';
import PlanProgress from '../../CreatePlan/PlanProgress';

const ReviewEmployeeResid = '616073391736'; // 人员审核表id
const NoticeResid = '616099620782'; //通知表id
const courseArrangmentResid = '615549231946'; //课程安排表id
const NoticeTaskId = '616153300255'; //通知全部报名任务id

/**
 * @author 邓铭
 * @description 选择人员
 */
class ReviewEmployee extends React.Component {
  state = {
    noticeModalVisible: false, // 通知人员报名模态窗状态
    selectCourseArrangementVisible: false, // 选择课程安排模态窗状态
    courseArrangements: [], // 可选择的课程安排
    targetCourseArrangement: '', //选中的课程安排编号
    selectedEmployees: [], //要移动的人员
    isShowProgress: false, // 是否显示进度模态窗
    isShowMoveProgress: false,
    totalIndex: 0, // 任务总进度
    curIndex: 0, // 当前任务进度
    isTaskComplete: false, // 当前任务是否已完成
    isShowModal: false,
    addEmployeesVisible: false
  };
  componentDidMount() {
    this.getCourseArrangements();
  }

  componentWillUnmount = () => {
    this.timer = null;
    this.getTaskInfo = null;
  };

  /**
   * 通知报名
   */
  handleNotice = async record => {
    this.setState({
      record: record
    });
    let res;
    try {
      res = await http().PostRunAutoImport({
        id: NoticeTaskId,
        parms: {
          arrangeID: this.props.courseArrangement.CourseArrangeID
        }
      });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      message.error('正在通知全部人员，请耐心等候');
    }
    this.setState({ isShowModal: true });
    this.getTaskInfo();
  };

  /**
   * 进度条
   */
  renderTaskProgress = () => {
    const { totalIndex, curIndex } = this.state;
    let percent = 0;
    if (this.state.isTaskComplete) {
      percent = 100;
    } else if (totalIndex) {
      percent = Math.floor((curIndex / totalIndex) * 100);
    }
    return (
      <div className="total-plan__seed_personnel">
        <Progress width={240} type="circle" percent={percent} />
        <div style={{ marginTop: 20 }}>
          {curIndex} / {totalIndex}
        </div>
      </div>
    );
  };

  /**
   * 获取进度
   */
  getTaskInfo = async () => {
    let res;
    try {
      res = await http().getAutoImportStatus();
    } catch (err) {
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo();
        }
      }, 1000);
      return message.error(err.message);
    }
    if (res.error !== 0) {
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo();
        }
      }, 1000);
      return message.error(res.message);
    }
    // 当前任务已完成
    if (res.IsComplete) {
      this.setState({
        totalIndex: res.data.Total,
        curIndex: res.data.Index,
        isTaskComplete: false
      });
      message.success('通知完成');
      // 当前任务未完成
    } else {
      this.setState({
        totalIndex: res.data.Total,
        curIndex: res.data.Index,
        isTaskComplete: false
      });
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo();
        }
      }, 1000);
    }
  };

  // 获取课程安排
  getCourseArrangements = async () => {
    console.log('courseArrangement', this.props.courseArrangement);
    let courseArrangement = this.props.courseArrangement;
    try {
      let res = await http().getTable({
        resid: courseArrangmentResid,
        cmswhere: `CourseID = ${this.props.courseArrangement.CourseID}`
      });
      let courseArrangements = res.data.filter(item => {
        return item.CourseArrangeID !== courseArrangement.CourseArrangeID;
      });

      this.setState({ courseArrangements: [...courseArrangements] });
    } catch (error) {
      message.error(error.message);
      console.log(error.message);
    }
  };

  // 通知人员报名
  noticeEmployee = async employees => {
    let res;
    try {
      let employee = employees.map(item => {
        return {
          C3_616098931926: item.C3_305737857578,
          isNotice: 'Y',
          arrangeID: this.props.courseArrangement.CourseArrangeID
        };
      });
      res = await http().addRecords({
        resid: NoticeResid,
        data: employee,
        isEditOrAdd: true
      });
      message.success(res.message);
      this.setState({ noticeModalVisible: false });
    } catch (error) {
      console.log(error.message);
      message.error(error.message);
    }
  };

  /**
   * 添加员工
   */
  addEmployees = async employees => {
    let index_id = 0;
    let taskList = employees.map(item => {
      return {
        CourseArrangeID: this.props.courseArrangement.CourseArrangeID,
        C3_613941384832: item.C3_305737857578,
        _id: ++index_id,
        _state: 'editoradd'
      };
    });
    this.setState({ taskList, isShowProgress: true });
  };

  /**
   * 删除员工
   */
  deleteRecord = async record => {
    try {
      await http().removeRecords({
        resid: ReviewEmployeeResid,
        data: [{ REC_ID: record.REC_ID }]
      });
      this.tableDataRef.handleRefresh();
      await http().modifyRecords({
        resid: courseArrangmentResid,
        data: [{ REC_ID: this.props.courseArrangement.REC_ID }]
      });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  /**
   * 确认人员名单 截止报名
   */
  comfirmList = () => {
    try {
      http().modifyRecords({
        resid: '615549231946',
        data: [
          {
            isStopApply: 'Y',
            REC_ID: this.props.courseArrangement.REC_ID
          }
        ]
      });
      message.success('确认名单成功');
      this.props.onConfirmList();
      this.forceUpdate();
    } catch (error) {
      message.error(error.message);
      console.log(error.message);
    }
  };

  /**
   * 打开移动人员模态窗
   */
  onMoveEmployees = async record => {
    let dataSource = [...record.dataSource];
    let selectedEmployees = record.selectedRowKeys.map(item =>
      dataSource.find(
        _dataSource => _dataSource.CourseArrangeDetailID === item.toString()
      )
    );
    this.setState({ selectCourseArrangementVisible: true, selectedEmployees });
  };

  /**
   * 移动人员
   */
  moveEmployees = async () => {
    let employees = [...this.state.selectedEmployees];
    let { targetCourseArrangement } = this.state;
    if (!targetCourseArrangement) {
      return message.info('请选择课程安排');
    }
    employees.forEach((item, index) => {
      item.CourseArrangeID = targetCourseArrangement;
      item._id = index;
      item._state = 'editoradd';
    });

    this.setState({ taskList: employees, isShowMoveProgress: true });
  };

  /**
   * 移动人员完成后的回调 修改记录触发计算公式计算人数
   */
  onMoveFinished = async () => {
    await http().modifyRecords({
      resid: courseArrangmentResid,
      data: [
        { REC_ID: this.props.courseArrangement.REC_ID },
        { REC_ID: this.state.targetCourseArrangement }
      ]
    });
    this.setState(
      {
        selectCourseArrangementVisible: false,
        isShowMoveProgress: false,
        targetCourseArrangement: '',
        selectedEmployees: []
      },
      this.tableDataRef.handleRefresh
    );
  };
  renderCourseName() {
    let { courseArrangement } = this.props;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: 20, fontWeight: 800 }}>
          {courseArrangement.CourseName}
        </span>
        <span
          className="course_type"
          style={
            courseArrangement.innerArrangeType === '1'
              ? { backgroundColor: '#1787fb' }
              : { backgroundColor: '#57c22d' }
          }
        >
          {courseArrangement.C3_616254048241}
        </span>
      </div>
    );
  }
  // 关闭所有模态窗
  closeModals = () => {
    this.setState({
      noticeModalVisible: false,
      addEmployeesVisible: false,
      selectCourseArrangementVisible: false,
      targetCourseArrangement: '',
      selectedEmployees: []
    });
  };

  /**
   * 添加人员结束时调用的回调函数
   */
  onFinishedPlanProgress = async () => {
    this.setState({
      isShowProgress: false,
      addEmployeesVisible: false
    });
    await http().modifyRecords({
      resid: courseArrangmentResid,
      data: [{ REC_ID: this.props.courseArrangement.REC_ID }]
    });
    this.tableDataRef.handleRefresh();
  };

  renderPublic() {
    let actionBarExtra = null;
    if (this.props.courseArrangement.isStopApply === 'Y') {
      actionBarExtra = (
        <div className="review_employee-table_action_bar_extra">
          {this.renderCourseName()}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: 6
            }}
          >
            <Tag color="red">报名已截止</Tag>
          </div>
        </div>
      );
    } else {
      actionBarExtra = record => (
        <div className="review_employee-table_action_bar_extra">
          {this.renderCourseName()}

          <div className="review_employee-table_action_bar_extra-buttons">
            <Tooltip
              placement="bottomLeft"
              title="不发送通知邮件直接将员工加入通知上课的列表"
            >
              <Button
                onClick={() => {
                  this.setState({ addEmployeesVisible: true });
                }}
              >
                添加上课人员
              </Button>
            </Tooltip>
            <Tooltip
              placement="bottomLeft"
              title="将一堂课里的人员移动到另一堂课"
            >
              <Button
                onClick={() => {
                  if (record.selectedRowKeys.length) {
                    this.onMoveEmployees(record);
                  } else {
                    this.setState({
                      selectCourseArrangementVisible: false
                    });
                    message.error('请选择至少一条记录');
                  }
                }}
              >
                移动人员
              </Button>
            </Tooltip>

            <Tooltip placement="bottomLeft" title="选择指定员工通知他们报名">
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ noticeModalVisible: true });
                }}
              >
                通知特定人员报名
              </Button>
            </Tooltip>
            <Popconfirm
              title="通知全部人员报名"
              onConfirm={() => {
                this.setState({ isShowModal: true }, this.handleNotice);
              }}
            >
              <Tooltip
                placement="bottomLeft"
                title="点击后全体员工将收到这门课的报名通知"
              >
                <Button type="primary">通知全部人员报名</Button>
              </Tooltip>
            </Popconfirm>
            <Popconfirm
              title="报名截止？"
              onConfirm={() => {
                this.comfirmList();
              }}
            >
              <Tooltip placement="bottomLeft" title="点击后员工无法再报名">
                <Button type="danger">报名截止</Button>{' '}
              </Tooltip>
            </Popconfirm>
          </div>
        </div>
      );
    }
    return (
      <div className="outerCardPersonDetail">
        <TableData
          resid={ReviewEmployeeResid}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          subtractH={240}
          hasBeBtns={false}
          hasAdd={false}
          hasRowView={true}
          customRowBtns={[
            (record, btnSize) => {
              return (
                <Popconfirm
                  title="您确认删除吗？"
                  onConfirm={() => {
                    this.deleteRecord(record);
                  }}
                >
                  <Button type="danger" style={{ fontSize: btnSize }}>
                    删除
                  </Button>
                </Popconfirm>
              );
            }
          ]}
          hasRowDelete={false}
          actionBarWidth={100}
          hasRowEdit={false}
          hasDelete={true}
          hasModify={false}
          actionBarFixed={true}
          hasRowModify={false}
          hasRowSelection={true}
          cmswhere={`CourseArrangeID = ${this.props.courseArrangement.CourseArrangeID}`}
          key="public"
          actionBarExtra={actionBarExtra}
        />
      </div>
    );
  }

  //计划课
  renderInplan() {
    return (
      <div className="innerCardPersonDetail">
        <TableData
          resid={ReviewEmployeeResid}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          subtractH={220}
          hasBeBtns={true}
          hasAdd={false}
          hasRowView={false}
          hasRowDelete={true}
          hasRowEdit={false}
          hasDelete={true}
          hasModify={false}
          actionBarFixed={true}
          hasRowModify={false}
          hasRowSelection={true}
          cmswhere={`CourseArrangeID = ${this.props.courseArrangement.CourseArrangeID}`}
          key="inplan"
          actionBarExtra={record => {
            return (
              <div className="review_employee-table_action_bar_extra">
                {this.renderCourseName()}
                <div className="review_employee-table_action_bar_extra-buttons">
                  <Button
                    onClick={() => {
                      if (record.selectedRowKeys.length) {
                        this.onMoveEmployees(record);
                      } else {
                        this.setState({
                          selectCourseArrangementVisible: false
                        });
                        message.error('请选择至少一条记录');
                      }
                    }}
                  >
                    移动人员
                  </Button>
                  <Tooltip
                    placement="bottomLeft"
                    title="选择指定员工通知他们报名"
                  >
                    <Button
                      type="primary"
                      onClick={() => {
                        this.setState({ noticeModalVisible: true });
                      }}
                    >
                      通知特定人员报名
                    </Button>
                  </Tooltip>
                  <Popconfirm
                    title="通知全部人员报名"
                    onConfirm={() => {
                      this.setState({ isShowModal: true }, this.handleNotice);
                    }}
                  >
                    <Tooltip
                      placement="bottomLeft"
                      title="点击后全体员工将收到这门课的报名通知"
                    >
                      <Button type="primary">通知全部人员报名</Button>
                    </Tooltip>
                  </Popconfirm>
                </div>
              </div>
            );
          }}
        />
      </div>
    );
  }

  render() {
    const {
      isShowProgress,
      taskList,
      isShowMoveProgress,
      noticeModalVisible,
      addEmployeesVisible,
      selectCourseArrangementVisible,
      courseArrangements,
      targetCourseArrangement,
      isShowModal
    } = this.state;
    return (
      <div className="review_employee" style={{ flex: 1 }}>
        {this.renderPublic()}
        <Modal
          title="通知人员"
          visible={noticeModalVisible}
          width="80%"
          onCancel={this.closeModals}
          footer={null}
          destroyOnClose
        >
          <SelectEmployeeToNotice onNotice={this.noticeEmployee} />
        </Modal>
        <Modal
          title="添加人员"
          visible={addEmployeesVisible}
          width="80%"
          onCancel={this.closeModals}
          footer={null}
          destroyOnClose
        >
          <SelectEmployeeToAdd onAdd={this.addEmployees} />
          {isShowProgress ? (
            <PlanProgress
              onFinished={this.onFinishedPlanProgress}
              struct="100"
              options={{
                resid: ReviewEmployeeResid,
                data: JSON.stringify(taskList)
              }}
              title="添加人员列表"
              // showFields={['C3_609622263470', 'C3_609845305680']}
              // width='50%'
            />
          ) : null}
        </Modal>
        <Modal
          title="选择课程安排"
          visible={selectCourseArrangementVisible}
          width="60%"
          onCancel={this.closeModals}
          onOk={this.moveEmployees}
        >
          <List>
            {courseArrangements.map(item => (
              <List.Item
                key={item.CourseArrangeID}
                onClick={() => {
                  this.setState({
                    targetCourseArrangement: item.CourseArrangeID
                  });
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  cursor: 'pointer'
                }}
              >
                <Radio
                  checked={item.CourseArrangeID === targetCourseArrangement}
                />
                <span>{item.CourseName}</span>
                <span>{`${item.StartDatetime} ~ ${item.EndDatetime}`}</span>
              </List.Item>
            ))}
            {isShowMoveProgress ? (
              <PlanProgress
                onFinished={this.onMoveFinished}
                struct="100"
                options={{
                  resid: ReviewEmployeeResid,
                  data: JSON.stringify(taskList)
                }}
                title="移动人员列表"
              />
            ) : null}
          </List>
        </Modal>
        <Modal
          title="通知全部人员报名"
          visible={isShowModal}
          okText="完成"
          cancelText="关闭"
          closable={false}
          onOk={() => {
            this.setState({
              isShowModal: false,
              totalIndex: 0,
              curIndex: 0,
              isTaskComplete: false
            });
          }}
          onCancel={() => {
            this.setState({
              isShowModal: false,
              totalIndex: 0,
              curIndex: 0,
              isTaskComplete: false
            });
          }}
        >
          {this.renderTaskProgress()}
        </Modal>
      </div>
    );
  }
}

export default ReviewEmployee;
