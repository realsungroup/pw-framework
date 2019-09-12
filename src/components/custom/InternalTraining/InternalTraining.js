import React, { Component } from 'react';
import { Spin, Steps, message, Modal } from 'antd';
import './InternalTraining.less';
// import { TableData } from '../../common/loadableCommon';
import CourseArrangementInternal from './CourseArrangementInternal';
import ReviewEmployee from './ReviewEmployee';
import NoticeAttendClass from './NoticeAttendClass';
import SeeFeedback from './SeeFeedback/SeeFeedback';

const { Step } = Steps;

class InternalTraining extends Component {
  state = {
    loading: false,
    current: 0,
    selectedCourseArrangement: null //选中的课程安排
  };

  handleLoading = loading => this.setState({ loading });

  handleCurrent = current => this.setState({ current });

  handleConfirmList = () => {
    console.log('onConfirmListonConfirmList');
    this.setState({
      selectedCourseArrangement: {
        ...this.state.selectedCourseArrangement,
        isStopApply: 'Y'
      }
    });
  };

  handleSelectCourseArrangement = selectedCourseArrangement => {
    this.setState({
      selectedCourseArrangement: { ...selectedCourseArrangement }
    });
  };
  render() {
    let { current } = this.state;
    let page = null;
    switch (current) {
      case 0:
        page = (
          <CourseArrangementInternal
            onHandleLoading={this.handleLoading}
            onHandleCurrent={this.handleCurrent}
            onHandleSelectCourseArrangement={this.handleSelectCourseArrangement}
          />
        );
        break;
      case 1:
        page = (
          <ReviewEmployee
            courseArrangement={this.state.selectedCourseArrangement}
            onConfirmList={this.handleConfirmList}
          />
        );

        break;
      case 2:
        page = (
          <NoticeAttendClass
            onHandleLoading={this.handleLoading}
            onCheckPeople={this.onCheckPeople}
          />
        );
        break;
      case 3:
        page = <SeeFeedback />;
        break;
      default:
        page = null;
        break;
    }
    return (
      <Spin spinning={this.state.loading}>
        <div className="course_resource">
          <Steps
            current={current}
            style={{
              marginBottom: 10,
              padding: 10,
              backgroundColor: 'white',
              flexGrow: 0
            }}
          >
            <Step
              title="课程安排"
              description=""
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.setState({ current: 0 });
              }}
            />
            <Step
              title="选择人员"
              description=""
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (this.state.current !== 1) {
                  message.info('请点击“学员审核”进入');
                }
              }}
            />
            <Step
              title="通知上课"
              description=""
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.setState({ current: 2 });
              }}
            />

            <Step
              title="查看反馈"
              description=""
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.setState({ current: 3 });
              }}
            />
            <Modal
              title="查看人员"
              visible={this.state.checkPeopleVisible}
              width="80%"
              onCancel={this.closeModals}
              footer={null}
              destroyOnClose
            ></Modal>
          </Steps>
          {page}
        </div>
      </Spin>
    );
  }
}

export default InternalTraining;
