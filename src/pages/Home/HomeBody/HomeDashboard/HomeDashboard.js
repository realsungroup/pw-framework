import React from 'react';
import './HomeDashboard.less';
import { Button } from 'antd';
import { getItem } from 'Util20/util';

const biBaseURL = window.pwConfig[process.env.NODE_ENV].biBaseURL;

const getHref = biBaseURL => {
  const userInfo = JSON.parse(getItem('userInfo'));
  const { AccessToken, UserCode } = userInfo;
  return `${biBaseURL}/home?u=${UserCode}&a=${AccessToken}`;
};

export default class HomeDashboard extends React.PureComponent {
  render() {
    const { defaultDashboard } = this.props;

    if (defaultDashboard) {
      const url = getHref(biBaseURL);

      return (
        <div className="home-dashboard">
          <p className="home-dashboard__go-to-setting">
            <p className="home-dashboard__no-default-dashboard">
              暂无默认仪表盘
            </p>
            <Button href={biBaseURL} target="black" type="primary">
              去设置默认仪表盘
            </Button>
          </p>
        </div>
      );
    }

    return (
      <div className="home-dashboard">{/* <DashboardPage rows={} /> */}</div>
    );
  }
}
