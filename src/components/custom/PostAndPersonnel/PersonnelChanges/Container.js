import React from 'react';
import { Tabs } from 'antd';
import PostChanges from './PostChanges';
import Dimission from './Dimission';
import Induction from './Induction';
import EmployeeMobilize from './EmployeeMobilize';
import ApplyReassignment from './ApplyReassignment';
import ApplyRecruitment from './ApplyRecruitment';

const { TabPane } = Tabs;
class Container extends React.Component {
  state = {
    currentTab: this.props.tabKey
  };
  handleTabChange = activeKey =>
    this.setState({
      currentTab: activeKey
    });
  render() {
    const { currentTab } = this.state;
    return (
      <div className="personnel-changes-container">
        <Tabs
          onChange={this.handleTabChange}
          style={{ backgroundColor: '#fff' }}
          activeKey={currentTab}
        >
          <TabPane tab="岗位变动" key="post">
            <PostChanges />
          </TabPane>
          <TabPane tab="离职情况" key="dimission">
            <Dimission />
          </TabPane>
          <TabPane tab="入职情况" key="induction">
            <Induction />
          </TabPane>
          <TabPane tab="员工调动" key="mobilize">
            <EmployeeMobilize />
          </TabPane>
          <TabPane tab="申请调岗" key="reassignment">
            <ApplyReassignment />
          </TabPane>
          <TabPane tab="申请招聘" key="recruitment">
            <ApplyRecruitment />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Container;
