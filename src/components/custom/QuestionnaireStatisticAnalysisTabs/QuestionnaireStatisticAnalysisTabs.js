import React from 'react';
import { Tabs } from 'antd';
import './QuestionnaireStatisticAnalysisTabs.less';
import QuestionnaireStatisticAnalysis from './QuestionnaireStatisticAnalysis';
const TabPane = Tabs.TabPane;

const residArr = [
  {
    title: '选项统计',
    resid: 611518608474,
    hasDepartmentFilter: false,
    hasLevelFilter: false
  },
  {
    title: '按部门，级别统计',
    resid: 611939431391,
    hasDepartmentFilter: true,
    hasLevelFilter: true
  },
  {
    title: '按部门统计',
    resid: 611939470252,
    hasDepartmentFilter: true,
    hasLevelFilter: false
  },
  {
    title: '按级别统计',
    resid: 611939502903,
    hasDepartmentFilter: false,
    hasLevelFilter: true
  }
];

/**
 * 问卷统计分析 tabs
 */
class QuestionnaireStatisticAnalysisTabs extends React.Component {
  render() {
    return (
      <Tabs style={{ background: '#fff', height: '100%' }}>
        {residArr.map(item => (
          <TabPane tab={item.title} key={item.resid}>
            <QuestionnaireStatisticAnalysis
              resid={item.resid}
              hasDepartmentFilter={item.hasDepartmentFilter}
              hasLevelFilter={item.hasLevelFilter}
            />
          </TabPane>
        ))}
      </Tabs>
    );
  }
}

export default QuestionnaireStatisticAnalysisTabs;
