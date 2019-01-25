import React from 'react';
import HalfPanel from '../../components/HalfPanel';
import Workbench from './Workbench';
import Panel from '../../components/Panel';
import ReminderList from './ReminderList';
import './HomeBody.less';

export default class HomeBody extends React.PureComponent {
  render() {
    return (
      <div className="home-body">
        <HalfPanel
          title="任务栏"
          prefix={<i className="iconfont icon-renwulan" />}
        >
          <Panel className="home-body__left-panel">
            <ReminderList />
          </Panel>
        </HalfPanel>
        <HalfPanel
          title="工作台"
          prefix={<i className="iconfont icon-gongzuotai" />}
        >
          <Workbench />
        </HalfPanel>
      </div>
    );
  }
}
