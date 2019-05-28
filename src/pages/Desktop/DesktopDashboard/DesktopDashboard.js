import React from 'react';
import './DesktopDashboard.less';
import { Button, Tabs, message } from 'antd';
import { getItem } from 'Util20/util';
import http from 'Util20/api';

import { FormattedMessage as FM } from 'react-intl';
import DashboardTabPane from './DashboardTabPane';

const biBaseURL = window.pwConfig[process.env.NODE_ENV].biBaseURL;
const baseURL = window.pwConfig[process.env.NODE_ENV].baseURL;
const { TabPane } = Tabs;

/**
 * 获取带有斜杠的 url
 * @param {string} url 地址
 */
const getWidthSlashUrl = url => {
  let separator = '';
  if (url.charAt(url.length - 1) !== '/') {
    separator = '/';
  }
  return url + separator;
};

/**
 * 获取编辑仪表盘跳转的地址
 * @param {string} dashboardName 仪表盘名称
 * @param {number} dashboardId 仪表盘 id
 * @param {number} dashboardClassifyId 仪表盘所属的分组 id
 * @param {string} a accessToken
 * @param {string} u UserCode
 */
const getHref = (dashboardName, dashboardId, dashboardClassifyId, a, u) => {
  return `${getWidthSlashUrl(
    biBaseURL
  )}dashboard?o=edit&dashboardId=${dashboardId}&dashboardName=${dashboardName}&dashboardClassifyId=${dashboardClassifyId}&u=${u}&a=${a}`;
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

export default class DesktopDashboard extends React.PureComponent {
  state = {
    defaultDashboards: []
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    let res;
    try {
      res = await http().getUserDefaultDashboards();
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    const defaultDashboards = res.data || [];

    this.setState({ defaultDashboards });
  };

  render() {
    const { defaultDashboards } = this.state;

    const userInfo = JSON.parse(getItem('userInfo'));
    const { AccessToken, UserCode } = userInfo;

    if (!defaultDashboards.length) {
      const url = `${getWidthSlashUrl(
        biBaseURL
      )}home?a=${AccessToken}&u=${UserCode}`;
      return (
        <div className="home-dashboard">
          <div className="desktop-dashboard__go-to-setting">
            <p className="desktop-dashboard__no-default-dashboard">
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
        {defaultDashboards.map(dashboard => {
          const dashboardId = dashboard.MtsHostID;
          const dashboardName = dashboard.ReportTitle;
          const dashboardClassifyId = dashboard.MTS_RPT_GROUPID;
          return (
            <div>
              {dashboard.IsUserDefault && (
                <Button
                  href={getHref(
                    dashboardName,
                    dashboardId,
                    dashboardClassifyId,
                    AccessToken,
                    UserCode
                  )}
                  target="black"
                  type="primary"
                  className="desktop-dashboard__modify-dashboard"
                >
                  编辑
                </Button>
              )}
              <div className="desktop-dashboard__dashboard-page-wrap">
                <DashboardTabPane rows={getRows(dashboard)} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
