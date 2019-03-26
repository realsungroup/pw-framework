import React from 'react';
import Workbench from './Workbench';
import HomeDashboard from './HomeDashboard';
import './HomeBody.less';
import { FormattedMessage as FM } from 'react-intl';
import { Tabs } from 'antd';
import http, { makeCancelable } from 'Util20/api';
import { message } from 'antd';

const TabPane = Tabs.TabPane;

export default class HomeBody extends React.PureComponent {
  state = {
    defaultDashboard: null,
    loading: false,
    activeKey: '仪表盘'
  };

  componentDidMount = () => {
    this.getData();
  };

  getData = async () => {
    this.setState({ loading: true });
    this.p1 = makeCancelable(http().getDefaultDashboard());
    let res;
    try {
      res = await this.p1.promise;
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    const defaultDashboard = res.data || null;
    const activeKey = defaultDashboard ? '仪表盘' : '工作台';

    this.setState({ defaultDashboard, activeKey, loading: false });
  };

  handleTabsChange = activeKey => {
    this.setState({ activeKey });
  };

  render() {
    const { defaultDashboard, activeKey } = this.state;

    return (
      <div className="home-body">
        <Tabs
          activeKey={activeKey}
          onChange={this.handleTabsChange}
          className="home-body__tabs"
        >
          <TabPane
            tab={<FM id="HomeBody.Dashboard" defaultMessage="仪表盘" />}
            key="仪表盘"
          >
            <HomeDashboard defaultDashboard={defaultDashboard} />
          </TabPane>
          <TabPane
            tab={<FM id="HomeBody.Bench" defaultMessage="工作台" />}
            key="工作台"
          >
            <Workbench />
          </TabPane>
        </Tabs>
        {/* <HalfPanel
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
        </HalfPanel> */}
      </div>
    );
  }
}
