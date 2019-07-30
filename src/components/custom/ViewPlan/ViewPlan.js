import React from 'react';
import { Spin, Steps, message } from 'antd';
import ReviewApplicationForm from './ReviewApplicationForm';
import ViewFeedBack from './ViewFeedBack';
import ViewTips from './ViewTips'
import './ViewPlan.less';

const { Step } = Steps;
class ViewPlan extends React.Component {
  state = {
    loading: false,
    current: 0
  };
  render() {
    let { current } = this.state;
		let page = null;
		switch (current) {
      case 0:
        page = <ReviewApplicationForm/>
        break;
      case 1:
        page = <ViewFeedBack/>
        break;
      case 2:
        page = <ViewTips/>;
        break;
      default:
        page = null;
        break;
    }
    return (
      <Spin spinning={this.state.loading}>
        <div className="view_plan">
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
              title="申请单审核"
              description=""
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.setState({ current: 0 });
              }}
            />
            <Step
              title="查看反馈"
              description=""
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.setState({ current: 1 });
              }}
            />
            <Step
              title="查看心得"
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

export default ViewPlan;
