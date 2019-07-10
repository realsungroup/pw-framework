import React, { Component } from 'react';
import { Spin, Steps } from 'antd';
import './InternalTraining.less';
// import { TableData } from '../../common/loadableCommon';
import CourseArrangementInternal from './CourseArrangementInternal';

const { Step } = Steps;

class InternalTraining extends Component {
  state = {
    loading: false,
    current: 0
  };

  handleLoading = loading => this.setState({ loading });

  handleCurrent = current => this.setState(current);
  render() {
    let { current } = this.state;
    let page = null;
    switch (current) {
      case 0:
        page = (
          <CourseArrangementInternal
            onHandleLoading={this.handleLoading}
            onHandleCurrent={this.handleCurrent}
          />
        );
        break;
      case 1:
        page = <div />;
        break;
      case 2:
        page = <div />;
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
              title="人员审核"
              description=""
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.setState({ current: 1 });
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
          </Steps>
          {page}
        </div>
      </Spin>
    );
  }
}

export default InternalTraining;
