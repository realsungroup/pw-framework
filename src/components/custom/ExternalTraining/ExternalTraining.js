import React from 'react';
import ETnoticeMain from './ETnoticeMain';
import { Steps, Spin } from 'antd';
import ArrangingCourses from '../ArrangingCourses';
import ReviewRequisition from './RequisitionReview';

const { Step } = Steps;
class ExternalTraining extends React.Component {
  state = {
    loading: false,
    current: 0
  };
  handleLoading = loading => {
    this.setState({ loading });
  };
  render() {
    let { current } = this.state;
    let page = null;
    switch (current) {
      case 0:
        page = <ArrangingCourses onHandleLoading={this.handleLoading} />;
        break;
      case 1:
        page = <ETnoticeMain />;
        break;
      case 2:
        page = <ReviewRequisition />;
        break;
      case 4:
        page = <ReviewRequisition />;
        break;
      default:
        page =null
        break;
    }
    return (
      <Spin spinning={this.state.loading}>
        <div
          className="cataner"
          style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
        >
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
              title="申请单通知"
              description=""
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.setState({ current: 1 });
              }}
            />
            <Step
              title="申请单审核"
              description=""
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.setState({ current: 2 });
              }}
            />
            <Step
              title="上课通知"
              description=""
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.setState({ current: 3 });
              }}
            />
            <Step
              title="反馈审核"
              description=""
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.setState({ current: 4 });
              }}
            />
          </Steps>
          {page}
        </div>
      </Spin>
    );
  }
}

export default ExternalTraining;
