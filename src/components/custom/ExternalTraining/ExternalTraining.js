import React from 'react';
import ETnotice from './ETnotice';
import { Steps, Spin } from 'antd';

const { Step } = Steps;
class ExternalTraining extends React.Component {
  state = {
    loading: false,
    current: 0
  };
  render() {
    let { loading, current } = this.state;
    return (
      <Spin spinning={loading}>
        <Steps
          current={current}
          style={{
            width: '100%',
            marginBottom: 10,
            padding: 10,
            backgroundColor: 'white'
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
      </Spin>
    );
  }
}

export default ExternalTraining;
