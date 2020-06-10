import React from 'react';
import './DirectlyUnderTarget.less';
import { Tabs, message } from 'antd';
import AchievementsFeedback from './AchievementsFeedback';
import AdjustTarget from './AdjustTarget';
import ApprovalTarget from './ApprovalTarget';
import InterviewRecords from './InterviewRecords';
import http from 'Util20/api';

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
  render() {
    const { residConfig } = this.props;
    const { years, currentYear } = this.state;

    return (
      <Tabs
        defaultActiveKey="1"
        className="directly-under-target"
        size="small"
        tabBarStyle={tabBarStyle}
      >
        <TabPane tab="核准目标" key="1">
          <ApprovalTarget
            residConfig={residConfig}
            years={years}
            currentYear={currentYear}
          />
        </TabPane>
        <TabPane tab="调整目标" key="2">
          <AdjustTarget
            residConfig={residConfig}
            years={years}
            currentYear={currentYear}
          />
        </TabPane>
        <TabPane tab="面谈记录" key="3">
          <InterviewRecords
            residConfig={residConfig}
            years={years}
            currentYear={currentYear}
          />
        </TabPane>
        <TabPane tab="绩效反馈" key="4">
          <AchievementsFeedback residConfig={residConfig} />
        </TabPane>
      </Tabs>
    );
  }
}

export default DirectlyUnderTarget;
