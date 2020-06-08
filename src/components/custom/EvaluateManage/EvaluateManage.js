import React from 'react';
import './EvaluateManage.less';
import { Tabs, message } from 'antd';
import GradeAppraising from './GradeAppraising';
import Evaluate from './Evaluate';
import Invite from './Invite';
import DirectEvaluate from './DirectEvaluate';
import http from 'Util20/api';

const { TabPane } = Tabs;
const tabBarStyle = { background: '#ffffff', marginBottom: 0 };
const yearResid = 436471186474;

/**
 * 评价管理
 */
class EvaluateManage extends React.Component {
  state = {
    years: [], //财年
    currentYear: {} //当前财年
  };

  componentDidMount() {
    this.fectchYears();
  }

  fectchYears = async () => {
    try {
      const res = await http().getTable({
        resid: yearResid
      });
      this.setState({
        years: res.data,
        currentYear: res.data.find(item => {
          return item.C3_420162027612 === 'Y';
        })
      });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  render() {
    const { years, currentYear } = this.state;
    return (
      <Tabs
        defaultActiveKey="3"
        className="evaluate-manage"
        size="small"
        tabBarStyle={tabBarStyle}
      >
        <TabPane tab="互评邀请" key="1">
          <Invite />
        </TabPane>
        <TabPane tab="互评评价" key="2">
          <Evaluate />
        </TabPane>
        <TabPane tab="直评管理" key="3">
          <DirectEvaluate years={years} currentYear={currentYear} />
        </TabPane>
        <TabPane tab="评级评优" key="4">
          <GradeAppraising />
        </TabPane>
      </Tabs>
    );
  }
}

export default EvaluateManage;
