import React from 'react';
import './DirectlyUnderTarget.less';
import { Tabs, message } from 'antd';
import AchievementsFeedback from './AchievementsFeedback';
import AdjustTarget from './AdjustTarget';
import ApprovalTarget from './ApprovalTarget';
import InterviewRecords from './InterviewRecords';
import http from 'Util20/api';

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.AchievementsBaseURL;
const { TabPane } = Tabs;
const tabBarStyle = { background: '#ffffff', marginBottom: 0 };

/**
 * 直属目标管理
 */
class DirectlyUnderTarget extends React.Component {
  state = {
    years: [], //财年
    currentYear: {} //当前财年
  };
  constructor(props) {
    super(props);
    this.ref1 = React.createRef();
    this.ref2 = React.createRef();
    this.ref3 = React.createRef();
    this.ref4 = React.createRef();
  }
  componentDidMount() {
    this.fectchYears();
  }

  fectchYears = async () => {
    const { residConfig } = this.props;
    try {
      const res = await http().getTable({
        resid: residConfig.财年
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

  handleTabChange = key => {
    switch (key) {
      case '1':
        this.ref1.current && this.ref1.current.fetchMainData();
        break;
      case '2':
        this.ref2.current && this.ref2.current.fetchMainData();
        break;
      case '3':
        this.ref3.current && this.ref3.current.fetchMainData();
        break;

      default:
        break;
    }
  };
  render() {
    const { residConfig } = this.props;
    const { years, currentYear } = this.state;

    return (
      <Tabs
        defaultActiveKey="1"
        className="directly-under-target"
        size="small"
        tabBarStyle={tabBarStyle}
        onChange={this.handleTabChange}
      >
        <TabPane tab="核准目标" key="1">
          <ApprovalTarget
            residConfig={residConfig}
            years={years}
            currentYear={currentYear}
            baseURL={baseURL}
            ref={this.ref1}
          />
        </TabPane>
        <TabPane tab="调整目标" key="2">
          <AdjustTarget
            residConfig={residConfig}
            years={years}
            currentYear={currentYear}
            baseURL={baseURL}
            ref={this.ref2}
          />
        </TabPane>
        <TabPane tab="面谈记录" key="3">
          <InterviewRecords
            residConfig={residConfig}
            years={years}
            currentYear={currentYear}
            baseURL={baseURL}
            ref={this.ref3}
          />
        </TabPane>
        <TabPane tab="绩效反馈" key="4">
          <AchievementsFeedback
            residConfig={residConfig}
            baseURL={baseURL}
            ref={this.ref4}
          />
        </TabPane>
      </Tabs>
    );
  }
}

export default DirectlyUnderTarget;
