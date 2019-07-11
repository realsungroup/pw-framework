import React from 'react';
import './ReviewEmployee.less';
import { TableData } from '../../../common/loadableCommon';
import { Button, Modal, Popconfirm, message, Tag, List, Radio } from 'antd';
import SelectEmployeeToNotice from './SelectEmployeeToNotice';
import http from 'Util20/api';

const ReviewEmployeeResid = '616073391736';
const NoticeResid = '616099620782';
const courseArrangmentResid = '615549231946'; //课程安排表id

class ReviewEmployee extends React.Component {
  state = {
    noticeModalVisible: false, // 通知人员报名模态窗状态
    selectCourseArrangementVisible: false, // 选择课程安排模态窗状态
    courseArrangements: [], // 可选择的课程安排
    targetCourseArrangement: '', //选中的课程安排编号
    selectedEmployees: [] //要移动的人员
  };

  componentDidMount() {
    this.getCourseArrangements();
  }
  getCourseArrangements = async () => {
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
    } catch (error) {
      message.error(error.message);
      console.log(error.message);
    }
  };
  onMoveEmployees = async record => {
    console.log(record);
    let dataSource = [...record.dataSource];
    let selectedEmployees = record.selectedRowKeys.map(item =>
      dataSource.find(
        _dataSource => _dataSource.CourseArrangeDetailID === item.toString()
      )
    );
    this.setState({ selectCourseArrangementVisible: true, selectedEmployees });
  };

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
      <div style={{ display: 'flex' }}>
        <span style={{ fontSize: 20, fontWeight: 800 }}>
          {courseArrangement.CourseName}
        </span>
        <span
          className="course_type"
          style={
            courseArrangement.innerArrangeType === '必修课'
              ? { backgroundColor: '#1787fb' }
              : courseArrangement.innerArrangeType === '公开课'
              ? { backgroundColor: '#57c22d' }
              : { backgroundColor: '#f1882b' }
          }
        >
          {courseArrangement.innerArrangeType.substring(0, 1)}
        </span>
      </div>
    );
  }
  closeModals = () => {
    this.setState({
      noticeModalVisible: false,
      selectCourseArrangementVisible: false,
      targetCourseArrangement: '',
      selectedEmployees: []
    });
  };
  //必修课
  renderCompulsory() {
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
        key="compulsory"
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

  //公开课
  renderPublic() {
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
                  // onClick={this.onMoveEmployees.bind(this, records)}
                >
                  移动人员
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ noticeModalVisible: true });
                  }}
                  // type="primary"
                >
                  通知报名
                </Button>
                {this.props.courseArrangement.isStopApply === 'Y' ? (
                  <Tag color="red">报名已截止</Tag>
                ) : (
                  <Popconfirm
                    title="报名截止？"
                    onConfirm={() => {
                      this.comfirmList();
                    }}
                  >
                    <Button>报名截止</Button>
                  </Popconfirm>
                )}
              </div>
            </div>
          );
        }}
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
    //classType innerArrangeType
    let courseArrangement = { ...this.props.courseArrangement };
    let table = null;
    if (courseArrangement.innerArrangeType === '公开课') {
      table = this.renderPublic();
    }
    if (courseArrangement.innerArrangeType === '必修课') {
      table = this.renderCompulsory();
    }
    if (courseArrangement.innerArrangeType === '计划课') {
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
      </div>
    );
  }
}

export default ReviewEmployee;
