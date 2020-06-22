import React from 'react';
import './SubordinateAchievements.less';
import { Tree, Tabs, message } from 'antd';
import ByOrganization from './ByOrganization';
import ByYear from './ByYear';
import http, { makeCancelable } from 'Util20/api';

const { TabPane } = Tabs;
const tabBarStyle = { background: '#ffffff', marginBottom: 0 };
const yearResid = 436471186474;
const baseURL =   window.pwConfig[process.env.NODE_ENV].customURLs.AchievementsBaseURL;

/**
 * 查看下属绩效
 */
class SubordinateAchievements extends React.Component {
  state = {
    years: [],
    currentYear: {}
  };
  componentDidMount() {
    this.fectchYears();
  }
  fectchYears = async () => {
    try {
      const res = await http({baseURL}).getTable({
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
    const {residConfig} = this.props;
    return (
      <Tabs
        defaultActiveKey="3"
        className="subordinate-achievements-tabs"
        size="small"
        tabBarStyle={tabBarStyle}
      >
        <TabPane tab="按组织架构查看" key="1">
          <ByOrganization
            idField="C3_305737857578" //主表id字段名
            pidField="C3_417993417686" //父节点id字段名
            procedureConfig={{
              procedure: 'pw_staffs',
              paranames: 'dates',
              paratypes: 'string'
            }}
            resid={residConfig.人事汇报关系}
            years={years}
            currentYear={currentYear}
            baseURL={baseURL}
          />
        </TabPane>
        <TabPane tab="按财年查看" key="2">
          <ByYear
            years={years}
            currentYear={currentYear}
            resid={residConfig.财年评级评优}
            baseURL={baseURL}
          />
        </TabPane>
      </Tabs>
    );
  }
}

export default SubordinateAchievements;
