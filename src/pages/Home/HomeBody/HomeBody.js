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
    defaultDashboards: [],
    loading: false,
    activeKey: '仪表盘'
  };

  componentDidMount = () => {
    this.getData();
  };

  getData = async () => {
    this.setState({ loading: true });
    this.p1 = makeCancelable(http().getUserDefaultDashboards());
    let res;
    try {
      res = await this.p1.promise;
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    const defaultDashboards = res.data || [];
    const activeKey = defaultDashboards.length ? '仪表盘' : '工作台';

    this.setState({ defaultDashboards, activeKey, loading: false });
  };

  handleTabsChange = activeKey => {
    this.setState({ activeKey });
  };

  render() {
    const { defaultDashboards, activeKey } = this.state;

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
            <HomeDashboard defaultDashboards={defaultDashboards} />
          </TabPane>
          <TabPane
            tab={<FM id="HomeBody.Bench" defaultMessage="工作台" />}
            key="工作台"
          >
            <Workbench />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
