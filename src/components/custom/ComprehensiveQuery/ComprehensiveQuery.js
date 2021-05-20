import React from 'react';
import { Tabs, Icon } from 'antd';
import TreeRel from '../../common/ui/TreeRel';
import './ComprehensiveQuery.less';
import PerformanceQuery from './components/PerformanceQuery';
import ViewRate from './components/ViewRate';
import { getItem } from 'Util20/util';
import PersonInfo from './components/PersonnelQuery/PersonInfo';
import WorkInfo from './components/Attendance/WorkInfo';

import DimissionQuery from './components/DimissionQuery';
import InductionQuery from './components/InductionQuery';
import JobAndEmployee from './components/JobAndEmployee';
import TrainingQuery from './components/TrainingQuery';
import Statistics from './components/Statistics';

const { TabPane } = Tabs;

/**
 * 综合查询
 * @author 邓铭
 */

class ComprehensiveQuery extends React.Component {
  state = {
    node: {}, //选中的人员信息
    isExpand: true, //左侧展开状态
    currentTab: this.props.tabKey, //当前的tab页
    hideTree: false//隐藏树组件
  };

  constructor(props) {
    super(props);
    this.UserCode = JSON.parse(getItem('userInfo')).UserInfo.EMP_USERCODE;
  }

  setSelect = node => {
    this.setState({ node });
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
  isExpand = (val) => {
    this.setState({ hideTree: val })
  }
  renderTabPane = currentTab => {
    let page = null;
    switch (currentTab) {
      case 'personnel':
        page = <PersonInfo person={this.state.node} />;
        break;
      case 'attendance':
        page = <WorkInfo person={this.state.node} showAnnualLeaveDetail={this.props.showAnnualLeaveDetail} showTiaoXiuDetail={this.props.showTiaoXiuDetail} />;
        break;
      case 'performance':
        page = <PerformanceQuery person={this.state.node} isExpand={(v) => this.isExpand(v)} />;
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
      case 'statistics':
        page = <Statistics person={this.state.node} />;
        break;
      default:
        break;
    }
    return page;
  };
  render() {
    const { isExpand, currentTab } = this.state;
    const { showPingji, showJixiao, showRenshi, showChaoshi } = this.props;
    return (
      <div id="comprehensive-query">
        <main style={{ left: isExpand ? 260 : 24 }} className="main-content">
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
              {showRenshi && <TabPane tab="人事信息" key="personnel"></TabPane>}
              <TabPane tab="考勤查询" key="attendance"></TabPane>
              {showJixiao && <TabPane tab="绩效查询" key="performance"></TabPane>}
              {showPingji && <TabPane tab="评级评优查询" key="rating"></TabPane>}
              {showChaoshi && <TabPane tab="下属超时工时统计" key="statistics"></TabPane>}
              {/* {process.env.NODE_ENV === 'development' && (
                <TabPane tab="培训查询" key="training"></TabPane>
              )}
              {process.env.NODE_ENV === 'development' && (
                <TabPane tab="岗位与人员调动" key="jobAndEmployee"></TabPane>
              )}
              {process.env.NODE_ENV === 'development' && (
                <TabPane tab="离职情况" key="dimission"></TabPane>
              )}
              {process.env.NODE_ENV === 'development' && (
                <TabPane tab="入职情况" key="induction"></TabPane>
              )} */}
            </Tabs>
          </header>
          <div className="comprehensive-query_main-content-wrap">
            {this.renderTabPane(currentTab)}
          </div>
        </main>
        <div style={this.state.hideTree ? { 'display': 'none' } : {}}>
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
      </div>
    );
  }
}

export default ComprehensiveQuery;
