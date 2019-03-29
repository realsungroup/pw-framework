import React from 'react';
import './HomeDashboard.less';
import { Button, Tabs } from 'antd';
import { getItem } from 'Util20/util';
import DashboardPage from 'lz-components-and-utils/lib/DashboardPage';
import { FormattedMessage as FM } from 'react-intl';

const biBaseURL = window.pwConfig[process.env.NODE_ENV].biBaseURL;
const baseURL = window.pwConfig[process.env.NODE_ENV].baseURL;
const { TabPane } = Tabs;

const getHref = biBaseURL => {
  const userInfo = JSON.parse(getItem('userInfo'));
  const { AccessToken, UserCode } = userInfo;
  return `${biBaseURL}/home?u=${UserCode}&a=${AccessToken}`;
};

const getRows = dashboard => {
  let rows;
  try {
    rows = JSON.parse(dashboard.ReportConfig);
  } catch (err) {
    return <div>dashboard 配置信息有误</div>;
  }

  if (!Array.isArray(rows)) {
    return <div>dashboard 配置信息有误</div>;
  }
  return rows;
};

export default class HomeDashboard extends React.PureComponent {
  render() {
    const { defaultDashboards } = this.props;

    if (!defaultDashboards.length) {
      const url = getHref(biBaseURL);

      return (
        <div className="home-dashboard">
          <div className="home-dashboard__go-to-setting">
            <p className="home-dashboard__no-default-dashboard">
              暂无默认仪表盘
            </p>
            <Button href={url} target="black" type="primary">
              去设置默认仪表盘
            </Button>
          </div>
        </div>
      );
    }

    console.log({ defaultDashboards });
    return (
      <div className="home-dashboard">
        <Tabs className="home-dashboard__tabs" tabPosition="top">
          {defaultDashboards.map(dashboard => (
            <TabPane tab={dashboard.ReportTitle} key={dashboard.MtsHostID}>
              <Button
                href={getHref()}
                target="black"
                type="primary"
                className="home-dashboard__modify-dashboard"
              >
                编辑
              </Button>
              <div className="home-dashboard__dashboard-page-wrap">
                <DashboardPage
                  baseURL={baseURL}
                  rows={getRows(dashboard)}
                  mode="view"
                />
              </div>
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}
