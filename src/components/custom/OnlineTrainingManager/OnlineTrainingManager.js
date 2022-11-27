import React from 'react';
import './OnlineTrainingManager.less';
import { Tabs, message } from 'antd';
import EntryTraining from './EntryTraining';
import InternalTraining from './InternalTraining';
import TestCourse from './TestCourse';
import InternalTrainingAuth from './InternalTrainingAuth';
import TestPaperManager from './TestPaperManager';
import http, { makeCancelable } from 'Util20/api';
import TableData from 'Common/data/TableData';

const { TabPane } = Tabs;
const tabBarStyle = { background: '#ffffff', marginBottom: 0 };

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.OnlineTrainingManagerBaseURL;

const baseURLDownload =
  window.pwConfig[process.env.NODE_ENV].customURLs.staffComDownloadURL;

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

  handleTabsChange = key => {
    if (key == '1' || key == '2') {
      this.fetchCoursePaper();
    }
  };

  render() {
    const { coursePapers } = this.state;
    return (
      <Tabs
        defaultActiveKey="1"
        size="small"
        tabBarStyle={tabBarStyle}
        className="online-training-manager"
        onChange={this.handleTabsChange}
      >
        <TabPane tab="DL入职培训" key="1" style={{ height: '100%' }}>
          <EntryTraining
            baseURL={baseURL}
            coursePapers={coursePapers}
            downloadBaseURL={baseURLDownload}
          />
        </TabPane>
        <TabPane tab="在线内训" key="2">
          <InternalTraining
            baseURL={baseURL}
            coursePapers={coursePapers}
            downloadBaseURL={baseURLDownload}
          />
        </TabPane>
        <TabPane tab="IDL入职培训" key="8">
          <InternalTraining
            baseURL={baseURL}
            coursePapers={coursePapers}
            downloadBaseURL={baseURLDownload}
            isEnter={true}
          />
        </TabPane>
        <TabPane tab="考试课程" key="3">
          <TestCourse
            baseURL={baseURL}
            coursePapers={coursePapers}
            downloadBaseURL={baseURLDownload}
          />
        </TabPane>
        <TabPane tab="在线内训授权" key="4">
          <InternalTrainingAuth
            baseURL={baseURL}
            downloadBaseURL={baseURLDownload}
          />
        </TabPane>
        <TabPane tab="在线培训试卷管理" key="5">
          <TestPaperManager
            baseURL={baseURL}
            downloadBaseURL={baseURLDownload}
          />
        </TabPane>
        <TabPane tab="考试回答记录" key="6">
          <TableData
            resid="644178448621"
            subtractH={220}
            hasRowView={false}
            hasModify={false}
            hasRowDelete={false}
            hasDelete={true}
            hasAdd={false}
            tableComponent="ag-grid"
            sideBarAg={true}
            hasRowSelection={true}
            baseURL={baseURL}
            advSearch={{
              formName: 'defaultSearch'
            }}
            downloadBaseURL={baseURLDownload}
          />
        </TabPane>
        <TabPane tab="课程附件管理" key="7">
          <TableData
            resid="636485756984"
            subtractH={220}
            hasRowView={false}
            hasRowDelete={false}
            hasModify={true}
            hasDelete={true}
            hasAdd={true}
            baseURL={baseURL}
            isSetColumnWidth={false}
            noWidthFields="C3_636485664255"
            advSearch={{
              formName: 'defaultSearch'
            }}
            downloadBaseURL={baseURLDownload}
          />
        </TabPane>
        <TabPane tab="DL入职培训统计" key="9">
          <TableData
            resid="637950044474"
            subtractH={220}
            hasRowView={false}
            hasRowDelete={false}
            hasModify={true}
            hasDelete={true}
            hasAdd={true}
            baseURL={baseURL}
            advSearch={{
              formName: 'defaultSearch'
            }}
            downloadBaseURL={baseURLDownload}
          />
        </TabPane>
        <TabPane tab="IDL入职培训统计" key="10">
          <TableData
            resid="722868900449"
            subtractH={220}
            hasRowView={false}
            hasRowDelete={false}
            hasModify={true}
            hasDelete={true}
            hasAdd={true}
            baseURL={baseURL}
            advSearch={{
              formName: 'defaultSearch'
            }}
            downloadBaseURL={baseURLDownload}
          />
        </TabPane>
      </Tabs>
    );
  }
}

export default OnlineTrainingManager;
