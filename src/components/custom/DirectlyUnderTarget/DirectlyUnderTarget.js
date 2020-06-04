import React from 'react';
import './DirectlyUnderTarget.less';
import { Tabs } from 'antd';
import AchievementsFeedback from './AchievementsFeedback';
import AdjustTarget from './AdjustTarget';
import ApprovalTarget from './ApprovalTarget';
import InterviewRecords from './InterviewRecords';
const { TabPane } = Tabs;
const tabBarStyle = { background: '#ffffff', marginBottom: 0 };

/**
 * 直属目标管理
 */
class DirectlyUnderTarget extends React.Component {
  render() {
    return (
      <Tabs
        defaultActiveKey="1"
        className="directly-under-target"
        size="small"
        tabBarStyle={tabBarStyle}
      >
        <TabPane tab="核准目标" key="1">
          <ApprovalTarget />
        </TabPane>
        <TabPane tab="调整目标" key="2">
          <AdjustTarget />
        </TabPane>
        <TabPane tab="面谈记录" key="3">
          <InterviewRecords />
        </TabPane>
        <TabPane tab="绩效反馈" key="4">
          <AchievementsFeedback />
        </TabPane>
      </Tabs>
    );
  }
}

export default DirectlyUnderTarget;
