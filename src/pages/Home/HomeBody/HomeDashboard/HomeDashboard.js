import React from 'react';
import './HomeDashboard.less';
import { Button } from 'antd';

export default class HomeDashboard extends React.PureComponent {
  render() {
    const { defaultDashboard } = this.props;
    if (defaultDashboard) {
      return (
        <div className="home-dashboard">
          <p className="home-dashboard__go-to-setting">
            <p className="home-dashboard__no-default-dashboard">
              暂无默认仪表盘
            </p>
            <Button type="primary">去设置默认仪表盘</Button>
          </p>
        </div>
      );
    }

    return (
      <div className="home-dashboard">{/* <DashboardPage rows={} /> */}</div>
    );
  }
}
