import React from 'react';
import { Tabs } from 'antd';
import TreeRel from '../../common/ui/TreeRel';
import './ComprehensiveQuery.less';
import PerformanceQuery from './components/PerformanceQuery';
import PersonnelQuery from './components/PersonnelQuery';
import Attendance from './components/Attendance';


const { TabPane } = Tabs;
class ComprehensiveQuery extends React.Component {
  state = {
    node: [], //选中的人员信息
    isExpand: true, //左侧展开状态
    currentTab: 'personnel'
  };
  setSelect = node => {
    this.setState({
      node
    });
  };
  setShrink = isExpand => {
    this.setState({
      isExpand
    });
  };
  handleTabChange = activeKey =>
    this.setState({
      currentTab: activeKey
    });

  renderTabPane = currentTab => {
    let page = null;
    switch (currentTab) {
      case 'personnel':
        page = <PersonnelQuery />;
        break;
      case 'attendance':
        page = <Attendance />;
        break;
      case 'performance':
        page = <PerformanceQuery />;
        break;
      case 'rating':
        page = null;
        break;

      default:
        break;
    }
    return page;
  };
  render() {
    const { isExpand, currentTab } = this.state;
    return (
      <div id="comprehensive-query">
        <main style={{ left: isExpand ? 240 : 4 }} className="main-content">
          <header className="nav-header">
            <Tabs
              defaultActiveKey="1"
              onChange={this.handleTabChange}
              style={{ backgroundColor: '#fff' }}
              activeKey={currentTab}
            >
              <TabPane tab="人事信息" key="personnel"></TabPane>
              <TabPane tab="考勤查询" key="attendance"></TabPane>
              <TabPane tab="绩效查询" key="performance"></TabPane>
              <TabPane tab="评级评优查询" key="rating"></TabPane>
            </Tabs>
          </header>
          <div
            style={{
              margin: '24px 24px 24px 36px ',
              flex: 1
            }}
          >
            {this.renderTabPane(currentTab)}
          </div>
        </main>
        <TreeRel
          url="api/OrgChart/GetNodesData"
          resid="602348115218"
          ColumnOfID="C3_602347243263"
          ColumnOfPID="C3_602347244770"
          ProductIDs="1360564"
          autoExpandParent="true"
          onSelect={this.setSelect}
          onShrinkChange={this.setShrink}
        />
      </div>
    );
  }
}

export default ComprehensiveQuery;
