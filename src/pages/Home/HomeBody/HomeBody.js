import React from 'react';
import HalfPanel from '../../components/HalfPanel';
import Workbench from './Workbench';
import Panel from '../../components/Panel';
import ReminderList from './ReminderList';
import './HomeBody.less';
import { FormattedMessage as FM } from 'react-intl';

export default class HomeBody extends React.PureComponent {
  render() {
    return (
      <div className="home-body">
        <HalfPanel
          title={<FM id="HomeBody.Taskbar" defaultMessage="任务栏" />}
          prefix={<i className="iconfont icon-renwulan" />}
        >
          <Panel className="home-body__left-panel">
            <ReminderList />
          </Panel>
        </HalfPanel>
        <HalfPanel
          title={<FM id="HomeBody.Bench" defaultMessage="工作台" />}
          prefix={<i className="iconfont icon-gongzuotai" />}
        >
          <Workbench />
        </HalfPanel>
      </div>
    );
  }
}
