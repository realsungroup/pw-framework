import React from 'react';
import ETnoticeMain from './ETnoticeMain';
import { Steps, Spin } from 'antd';
import ArrangingCourses from '../ArrangingCourses';
import ReviewRequisition from './RequisitionReview';
import FeedbackReview from './FeedbackReview';
import ViewActions from './ViewActions';
import './ExternalTraining.less';

/**
 * @author 邓铭
 * @description 外训管理
 */
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
        // 步骤条1 课程安排
        page = <ArrangingCourses onHandleLoading={this.handleLoading} />;
        break;
      case 1:
        // 步骤条2 申请单通知
        page = <ETnoticeMain key={1} id={1} />;
        break;
      case 2:
        // 步骤条3 上课通知
        page = <ETnoticeMain key={2} id={2} />;
        break;
      case 3:
        // 步骤条4 查看行动计划
        page = <ViewActions />;
        break;
      case 4:
        // 步骤条5 心得审核
        page = <FeedbackReview />;
        break;
      default:
        page = null;
        break;
    }
    return (
      <Spin spinning={this.state.loading}>
        <div className="external_training">
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
              title="上课通知"
              description=""
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.setState({ current: 2 });
              }}
            />
            <Step
              title="查看行动计划与报销单"
              description=""
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.setState({ current: 3 });
              }}
            />
            <Step
              title="心得审核"
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
