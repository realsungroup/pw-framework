import React from 'react';
import { Icon, Tabs, Button, Modal } from 'antd';
import './AssessConfig.less';
import ConfigByPersonGroup from './ConfigByPersonGroup';

const { TabPane } = Tabs;

class AssessConfig extends React.Component {
  constructor(props) {
    super();
    this.state = {};
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
  }

  render() {
    const {} = this.state;
    return (
      <div className="OrganizationManagement">
        <Tabs defaultActiveKey="personGroup">
          <TabPane tab="按人员分组配置权限" key="personGroup">
            <ConfigByPersonGroup />
          </TabPane>
          {/* <TabPane tab="按组织分配权限" key="org"></TabPane>
          <TabPane tab="按人员配置权限" key="person"></TabPane>
          <TabPane tab="按门禁点配置权限" key="entrancePoint"></TabPane> */}
        </Tabs>
      </div>
    );
  }
}

export default AssessConfig;
