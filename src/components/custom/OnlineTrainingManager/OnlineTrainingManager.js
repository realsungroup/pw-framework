import React from 'react';
import './OnlineTrainingManager.less';
import { Tabs } from 'antd';
import EntryTraining from './EntryTraining';
import InternalTraining from './InternalTraining';
import InternalTrainingAuth from './InternalTrainingAuth';
import TestPaperManager from './TestPaperManager';

const { TabPane } = Tabs;
const tabBarStyle = { background: '#ffffff', marginBottom: 0 };
class OnlineTrainingManager extends React.Component {
  render() {
    return (
      <Tabs
        defaultActiveKey="1"
        size="small"
        tabBarStyle={tabBarStyle}
        className="online-training-manager"
      >
        <TabPane tab="入职培训" key="1" style={{ height: '100%' }}>
          <EntryTraining />
        </TabPane>
        <TabPane tab="在线内训" key="2">
          <InternalTraining />
        </TabPane>
        <TabPane tab="在线内训授权" key="3">
          <InternalTrainingAuth />
        </TabPane>
        <TabPane tab="在线培训试卷管理" key="4">
          <TestPaperManager />
        </TabPane>
      </Tabs>
    );
  }
}

export default OnlineTrainingManager;
