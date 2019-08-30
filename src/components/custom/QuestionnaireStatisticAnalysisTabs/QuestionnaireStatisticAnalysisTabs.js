import React from 'react';
import { Tabs } from 'antd';
import './QuestionnaireStatisticAnalysisTabs.less';
import QuestionnaireStatisticAnalysis from './QuestionnaireStatisticAnalysis';
import qs from 'qs';
import TotalStatical from './TotalStatical';
const TabPane = Tabs.TabPane;
const qsObj = qs.parse(window.location.search.substring(1));
console.log('问卷ID', qsObj);

const residArr = [
  // {
  //   title: '选项统计',
  //   resid: 611518608474,
  //   hasDepartmentFilter: false,
  //   hasLevelFilter: false
  // },
  {
    title: '按部门，级别统计',
    resid: 611939431391,
    hasDepartmentFilter: true,
    hasLevelFilter: true
  },
  // {
  //   title: '按部门统计',
  //   resid: 611939470252,
  //   hasDepartmentFilter: true,
  //   hasLevelFilter: false
  // },
  // {
  //   title: '按级别统计',
  //   resid: 611939502903,
  //   hasDepartmentFilter: false,
  //   hasLevelFilter: true
  // }
];

/**
 * 问卷统计分析 tabs
 */
class QuestionnaireStatisticAnalysisTabs extends React.Component {
  componentDidMount = () => {
    window.parent.pwCallback &&
      window.parent.pwCallback.modifyTitle('问卷统计分析');
    // 监听父窗口发送的 message 事件
    window.addEventListener(
      'message',
      e => {
        if (!e || !e.source || !e.source.pwCallback) {
          return;
        }
        // 当事件类型为 "goBack"（即返回上一页时）
        // 1. 调用 history.goBack() 方法放回上一页
        // 2. 调用父级 window 对象下的 pwCallback.modifyTitle 方法，来修改窗口左上角的标题，其内容为上一页页面的标题
        if (e.data.type === 'goBack') {
          this.props.history.goBack();
          e.source.pwCallback.modifyTitle &&
            e.source.pwCallback.modifyTitle(qsObj.fromTitle || '问卷首页');
        }
      },
      false
    );
  };

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
        <TabPane
          tab="下载"
          key={qsObj.questionnaireRecid}
          style={{ height: 600, overflow: 'auto' }}
        >
          <TotalStatical queryId={qsObj.questionnaireRecid} />
        </TabPane>
      </Tabs>
    );
  }
}

export default QuestionnaireStatisticAnalysisTabs;
