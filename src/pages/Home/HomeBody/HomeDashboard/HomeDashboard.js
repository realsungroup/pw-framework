import React from 'react';
import './HomeDashboard.less';
import { Button, Tabs } from 'antd';
import { getItem } from 'Util20/util';

import { FormattedMessage as FM } from 'react-intl';
import DashboardTabPane from './DashboardTabPane';

const biBaseURL = window.pwConfig[process.env.NODE_ENV].biBaseURL;
const baseURL = window.pwConfig[process.env.NODE_ENV].baseURL;
const { TabPane } = Tabs;

/**
 * 获取编辑仪表盘跳转的地址
 * @param {string} dashboardName 仪表盘名称
 * @param {number} dashboardId 仪表盘 id
 * @param {number} dashboardClassifyId 仪表盘所属的分组 id
 */
const getHref = (dashboardName, dashboardId, dashboardClassifyId) => {
  const userInfo = JSON.parse(getItem('userInfo'));
  const { AccessToken, UserCode } = userInfo;
  let separator = '';
  if (biBaseURL.charAt(biBaseURL.length - 1) !== '/') {
    separator = '/';
  }
  return `${biBaseURL}${separator}dashboard?o=edit&dashboardId=${dashboardId}&dashboardName=${dashboardName}&dashboardClassifyId=${dashboardClassifyId}&u=${UserCode}&a=${AccessToken}`;
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
  state = {};

  render() {
    const { defaultDashboards } = this.props;

    if (!defaultDashboards.length) {
      const url = `${biBaseURL}/home`;

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

    return (
      <div className="home-dashboard">
        <Tabs className="home-dashboard__tabs" tabPosition="top">
          {defaultDashboards.map(dashboard => {
            const dashboardId = dashboard.MtsHostID;
            const dashboardName = dashboard.ReportTitle;
            const dashboardClassifyId = dashboard.MTS_RPT_GROUPID;
            return (
              <TabPane tab={dashboardName} key={dashboardId}>
                {dashboard.IsUserDefault && (
                  <Button
                    href={getHref(
                      dashboardName,
                      dashboardId,
                      dashboardClassifyId
                    )}
                    target="black"
                    type="primary"
                    className="home-dashboard__modify-dashboard"
                  >
                    编辑
                  </Button>
                )}

                <div className="home-dashboard__dashboard-page-wrap">
                  <DashboardTabPane rows={getRows(dashboard)} />
                </div>
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }
}
