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
  Icon
} from 'antd';
import SelectEmployeeToNotice from './SelectEmployeeToNotice';
import http from 'Util20/api';
import NoticeProgress from '../../CreatePlan/PlanProgress';

const ReviewEmployeeResid = '616073391736'; // 人员审核表id
const NoticeResid = '616099620782'; //通知表id
const courseArrangmentResid = '615549231946'; //课程安排表id
const NoticeTaskId = '616153300255'; //通知全部报名任务id
class ReviewEmployee extends React.Component {
  state = {
    noticeModalVisible: false, // 通知人员报名模态窗状态
    selectCourseArrangementVisible: false, // 选择课程安排模态窗状态
    courseArrangements: [], // 可选择的课程安排
    targetCourseArrangement: '', //选中的课程安排编号
    selectedEmployees: [], //要移动的人员
    isShowProgress: false, // 是否显示进度模态窗

    totalIndex: 0, // 任务总进度
    curIndex: 0, // 当前任务进度
    isTaskComplete: false, // 当前任务是否已完成
    isShowModal: false
  };
  componentDidMount() {
    this.getCourseArrangements();
  }

  componentWillUnmount = () => {
    this.timer = null;
    this.getTaskInfo = null;
  };

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
    console.log(employees);
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

  //确认人员名单 截止报名
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
      this.forceUpdate()
    } catch (error) {
      message.error(error.message);
      console.log(error.message);
    }
  };
  onMoveEmployees = async record => {
    let dataSource = [...record.dataSource];
    let selectedEmployees = record.selectedRowKeys.map(item =>
      dataSource.find(
        _dataSource => _dataSource.CourseArrangeDetailID === item.toString()
      )
    );
    this.setState({ selectCourseArrangementVisible: true, selectedEmployees });
  };

  //移动人员
  moveEmployees = async () => {
    let employees = [...this.state.selectedEmployees];
    let { targetCourseArrangement } = this.state;
    employees.forEach(item => {
      item.CourseArrangeID = targetCourseArrangement;
    });
    try {
      let res = await http().modifyRecords({
        resid: ReviewEmployeeResid,
        data: employees
      });
      message.success(res.message);
      this.setState(
        {
          selectCourseArrangementVisible: false,
          targetCourseArrangement: '',
          selectedEmployees: []
        },
        this.tableDataRef.handleRefresh
      );
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
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
      selectCourseArrangementVisible: false,
      targetCourseArrangement: '',
      selectedEmployees: []
    });
  };

  //公开课
  renderPublic() {
    let actionBarExtra = null;
    console.log(this.props.courseArrangement.isStopApply)
    if (this.props.courseArrangement.isStopApply === 'Y') {
      actionBarExtra = 
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
    } else {
      console.log(2)
      actionBarExtra = record => (
        
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
          <Button
            onClick={() => {
              this.setState({ noticeModalVisible: true });
            }}
          >
            通知报名
          </Button>
          <Button
            onClick={() => {
              this.setState({ isShowModal: true }, this.handleNotice);
            }}
          >
            通知全部报名
          </Button>
          <Popconfirm
            title="报名截止？"
            onConfirm={() => {
              this.comfirmList();
            }}
          >
            <Button>报名截止</Button>
          </Popconfirm>
        </div>

      </div>
      );
    }
    return (
      <TableData
        resid={ReviewEmployeeResid}
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        subtractH={240}
        hasBeBtns={true}
        hasAdd={false}
        hasRowView={false}
        hasRowDelete={true}
        hasRowEdit={false}
        hasDelete={false}
        hasModify={false}
        actionBarFixed={true}
        hasRowModify={false}
        hasRowSelection={true}
        cmswhere={`CourseArrangeID = ${this.props.courseArrangement.CourseArrangeID}`}
        key="public"
        actionBarExtra={actionBarExtra}
      />
    );
  }

  //计划课
  renderInplan() {
    return (
      <TableData
        resid={ReviewEmployeeResid}
        wrappedComponentRef={element => (this.tableDataRef = element)}
        refTargetComponentName="TableData"
        subtractH={240}
        hasBeBtns={true}
        hasAdd={false}
        hasRowView={false}
        hasRowDelete={true}
        hasRowEdit={false}
        hasDelete={false}
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
                      this.setState({ selectCourseArrangementVisible: false });
                      message.error('请选择至少一条记录');
                    }
                  }}
                >
                  移动人员
                </Button>
              </div>
            </div>
          );
        }}
      />
    );
  }

  render() {
    let courseArrangement = { ...this.props.courseArrangement };
    let table = null;
    if (courseArrangement.innerArrangeType === '2') {
      table = this.renderPublic();
    }
    // if (courseArrangement.innerArrangeType === '必修课') {
    //   table = this.renderCompulsory();
    // }
    // if (courseArrangement.innerArrangeType === '计划课') {
    //   table = this.renderInplan();
    // }
    if (courseArrangement.innerArrangeType === '1') {
      table = this.renderInplan();
    }

    return (
      <div className="review_employee" style={{ flex: 1 }}>
        {table}
        <Modal
          title="通知人员"
          visible={this.state.noticeModalVisible}
          width="80%"
          onCancel={this.closeModals}
          footer={null}
          destroyOnClose
        >
          <SelectEmployeeToNotice onNotice={this.noticeEmployee} />
        </Modal>
        <Modal
          title="选择课程安排"
          visible={this.state.selectCourseArrangementVisible}
          width="60%"
          onCancel={this.closeModals}
          onOk={this.moveEmployees}
        >
          <List>
            {this.state.courseArrangements.map(item => (
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
                  checked={
                    item.CourseArrangeID === this.state.targetCourseArrangement
                  }
                />
                <span>{item.CourseName}</span>
                <span>{`${item.StartDatetime} ~ ${item.EndDatetime}`}</span>
              </List.Item>
            ))}
          </List>
        </Modal>
        <Modal
          title="通知全部人员报名"
          visible={this.state.isShowModal}
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
        {/* {this.state.isShowProgress ? (
          <Progress
            onFinished={this.handleShowProgress}
            struct="100"
            options={{ resid: 611315248461, data: JSON.stringify({}) }}
            title="通知报名"
            showFields={['C3_609622263470', 'C3_609845305680']}
            // width='50%'
          />
        ) : null} */}
      </div>
    );
  }
}

export default ReviewEmployee;
