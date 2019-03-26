import React from 'react';
import './HomeDashboard.less';


export default class HomeDashboard extends React.PureComponent {
  render() {
    const { defaultDashboard } = this.props;
    if (!defaultDashboard) {
      return <div className="home-dashboard">设置默认仪表盘</div>;
    }

    return <div className="home-dashboard">home-dashboard</div>;
  }
}
