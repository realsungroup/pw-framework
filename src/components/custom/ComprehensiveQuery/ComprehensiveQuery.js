import React from 'react';
import { Tabs, Icon } from 'antd';
import TreeRel from '../../common/ui/TreeRel';
import './ComprehensiveQuery.less';
import PerformanceQuery from './components/PerformanceQuery';
import ViewRate from './components/ViewRate';
import { getItem } from 'Util20/util';
import PersonnelQuery from './components/PersonnelQuery';
import Attendance from './components/Attendance';

import DimissionQuery from './components/DimissionQuery';
import InductionQuery from './components/InductionQuery';
import JobAndEmployee from './components/JobAndEmployee';
import TrainingQuery from './components/TrainingQuery';

const { TabPane } = Tabs;
class ComprehensiveQuery extends React.Component {
  state = {
    node: {}, //选中的人员信息
    isExpand: true, //左侧展开状态
    currentTab: this.props.tabKey
  };

  constructor(props) {
    super(props);
    this.UserCode = JSON.parse(getItem('userInfo')).UserInfo.EMP_USERCODE;
  }
  componentDidMount() {}
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
        page = <PersonnelQuery node={this.state.node} />;
        break;
      case 'attendance':
        page = <Attendance node={this.state.node} />;
        break;
      case 'performance':
        page = <PerformanceQuery person={this.state.node} />;
        break;
      case 'rating':
        page = <ViewRate person={this.state.node} />;
        break;
      case 'training':
        page = <TrainingQuery person={this.state.node} />;
        break;
      case 'jobAndEmployee':
        page = <JobAndEmployee person={this.state.node} />;
        break;
      case 'dimission':
        page = <DimissionQuery person={this.state.node} />;
        break;
      case 'induction':
        page = <InductionQuery person={this.state.node} />;
        break;

      default:
        break;
    }
    return page;
  };
  render() {
    const { isExpand, currentTab } = this.state;
    return !(process.env.NODE_ENV === 'production') ? (
      <div id="comprehensive-query">
        <main style={{ left: isExpand ? 240 : 4 }} className="main-content">
          <div
            className="comprehensive-query_goback-btn"
            onClick={this.props.goBack}
          >
            <Icon type="rollback" style={{ color: '#999' }} />
          </div>
          <header className="nav-header">
            <Tabs
              onChange={this.handleTabChange}
              style={{ backgroundColor: '#fff' }}
              activeKey={currentTab}
            >
              <TabPane tab="人事信息" key="personnel"></TabPane>
              <TabPane tab="考勤查询" key="attendance"></TabPane>
              <TabPane tab="绩效查询" key="performance"></TabPane>
              <TabPane tab="评级评优查询" key="rating"></TabPane>
              <TabPane tab="培训查询" key="training"></TabPane>
              <TabPane tab="岗位与人员调动" key="jobAndEmployee"></TabPane>
              <TabPane tab="离职情况" key="dimission"></TabPane>
              <TabPane tab="入职情况" key="induction"></TabPane>
            </Tabs>
          </header>
          <div className="comprehensive-query_main-content-wrap">
            {this.renderTabPane(currentTab)}
          </div>
        </main>
        <TreeRel
          url="api/OrgChart/GetNodesData"
          resid="609599795438"
          ColumnOfID="C3_305737857578"
          ColumnOfPID="C3_417993417686"
          ProductIDs={this.UserCode}
          autoExpandParent="true"
          nameOfID="C3_227192484125"
          locationOfID="C3_423229407315"
          nameEnOfID="C3_227192496109"
          onSelect={this.setSelect}
          onShrinkChange={this.setShrink}
        />
      </div>
    ) : (
      <div>生产环境内容</div>
    );
  }
}

export default ComprehensiveQuery;
