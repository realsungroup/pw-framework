import React from 'react';
import './OnlineTrainingManager.less';
import { Tabs, message } from 'antd';
import EntryTraining from './EntryTraining';
import InternalTraining from './InternalTraining';
import InternalTrainingAuth from './InternalTrainingAuth';
import TestPaperManager from './TestPaperManager';
import http, { makeCancelable } from 'Util20/api';
import TableData from 'Common/data/TableData';

const { TabPane } = Tabs;
const tabBarStyle = { background: '#ffffff', marginBottom: 0 };

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.OnlineTrainingManagerBaseURL;
class OnlineTrainingManager extends React.Component {
  state = { coursePapers: [] };
  componentDidMount() {
    this.fetchCoursePaper();
  }
  fetchCoursePaper = async () => {
    try {
      const res = await http({ baseURL }).getUserAppLinks({
        parentresid: 636548884907
      });
      this.setState({ coursePapers: res.data });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };
  render() {
    const { coursePapers } = this.state;
    return (
      <Tabs
        defaultActiveKey="4"
        size="small"
        tabBarStyle={tabBarStyle}
        className="online-training-manager"
      >
        <TabPane tab="入职培训" key="1" style={{ height: '100%' }}>
          <EntryTraining baseURL={baseURL} coursePapers={coursePapers} />
        </TabPane>
        <TabPane tab="在线内训" key="2">
          <InternalTraining baseURL={baseURL} coursePapers={coursePapers} />
        </TabPane>
        <TabPane tab="在线内训授权" key="3">
          <InternalTrainingAuth baseURL={baseURL} />
        </TabPane>
        <TabPane tab="在线培训试卷管理" key="4">
          <TestPaperManager baseURL={baseURL} />
        </TabPane>
        <TabPane tab="考试回答记录" key="5">
          <TableData
            resid="644009541954"
            subtractH={220}
            hasRowView={false}
            hasModify={false}
            hasDelete={false}
            hasAdd={false}
            tableComponent="ag-grid"
            sideBarAg={true}
            hasRowSelection={true}
            baseURL={baseURL}
          />
        </TabPane>
      </Tabs>
    );
  }
}

export default OnlineTrainingManager;
