import React from 'react';
import './EvaluateManage.less';
import { Tabs } from 'antd';
import GradeAppraising from './GradeAppraising';
import Evaluate from './Evaluate';
import Invite from './Invite';
import DirectEvaluate from './DirectEvaluate';
const { TabPane } = Tabs;
const tabBarStyle = { background: '#ffffff', marginBottom: 0 };

/**
 * 评价管理
 */
class EvaluateManage extends React.Component {
  render() {
    return (
      <Tabs
        defaultActiveKey="1"
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
          <DirectEvaluate />
        </TabPane>
        <TabPane tab="评级评优" key="4">
          <GradeAppraising />
        </TabPane>
      </Tabs>
    );
  }
}

export default EvaluateManage;
