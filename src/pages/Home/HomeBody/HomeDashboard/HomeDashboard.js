import React from 'react';
import './HomeDashboard.less';
import { Button } from 'antd';
import { getItem } from 'Util20/util';
import DashboardPage from 'lz-components-and-utils/lib/DashboardPage';

const biBaseURL = window.pwConfig[process.env.NODE_ENV].biBaseURL;
const baseURL = window.pwConfig[process.env.NODE_ENV].baseURL;

const getHref = biBaseURL => {
  const userInfo = JSON.parse(getItem('userInfo'));
  const { AccessToken, UserCode } = userInfo;
  return `${biBaseURL}/home?u=${UserCode}&a=${AccessToken}`;
};

export default class HomeDashboard extends React.PureComponent {
  render() {
    const { defaultDashboard } = this.props;

    if (!defaultDashboard) {
      const url = getHref(biBaseURL);

      return (
        <div className="home-dashboard">
          <p className="home-dashboard__go-to-setting">
            <p className="home-dashboard__no-default-dashboard">
              暂无默认仪表盘
            </p>
            <Button href={url} target="black" type="primary">
              去设置默认仪表盘
            </Button>
          </p>
        </div>
      );
    }

    let rows;
    try {
      rows = JSON.parse(defaultDashboard.ReportConfig);
    } catch (err) {
      return <div>dashboard 配置信息有误</div>;
    }

    if (!Array.isArray(rows)) {
      return <div>dashboard 配置信息有误</div>;
    }

    return (
      <div className="home-dashboard">
        <DashboardPage baseURL={baseURL} rows={rows} mode="view" />
      </div>
    );
  }
}
