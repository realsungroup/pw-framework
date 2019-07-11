import React from 'react';
import './ReviewEmployee.less';
import { TableData } from '../../../common/loadableCommon';
import { Button, Modal, Popconfirm, message } from 'antd';
import SelectEmployeeToNotice from './SelectEmployeeToNotice';
import http from 'Util20/api';

const ReviewEmployeeResid = '616073391736';
const NoticeResid = '616099620782';

class ReviewEmployee extends React.Component {
  state = {
    noticeModalVisible: false
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
      console.log(error.message)
      message.error(error.message)
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
              : {
                  backgroundColor: '#f1882b'
                }
          }
        >
          {courseArrangement.innerArrangeType.substring(0, 1)}
        </span>
      </div>
    );
  }
  closeModals = () => {
    this.setState({ noticeModalVisible: false });
  };
  //必修课
  renderCompulsory() {
    return (
      <TableData
        resid={ReviewEmployeeResid}
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
        key="compulsory"
        actionBarExtra={
          <div style={{ display: 'flex' }}>{this.renderCourseName()}</div>
        }
      />
    );
  }

  //公开课
  renderPublic() {
    return (
      <TableData
        resid={ReviewEmployeeResid}
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
        key="public"
        actionBarExtra={
          <div style={{ display: 'flex' }}>
            {this.renderCourseName()}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                onClick={() => {
                  this.setState({ noticeModalVisible: true });
                }}
                type="primary"
              >
                通知报名
              </Button>
              {this.props.courseArrangement.isStopApply === 'Y' ? <p>报名已截止</p> :<Popconfirm
                title="报名截止？"
                onConfirm={() => {
                  this.comfirmList();
                }}
              >
                <Button>报名截止</Button>
              </Popconfirm>}
            </div>
          </div>
        }
      />
    );
  }

  //计划课
  renderInplan() {
    return (
      <TableData
        resid={ReviewEmployeeResid}
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
        key="inplan"
        actionBarExtra={<div>{this.renderCourseName()}</div>}
      />
    );
  }

  render() {
    //classType innerArrangeType
    let courseArrangement = { ...this.props.courseArrangement };
    console.log(courseArrangement);
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
      </div>
    );
  }
}

export default ReviewEmployee;
