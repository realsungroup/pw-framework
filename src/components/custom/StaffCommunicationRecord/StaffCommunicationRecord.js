import React from 'react';
import './StaffCommunicationRecord.less';
import { Tabs } from 'antd';
// import http from '../../../../util20/api';
import StaffComplain from './StaffComplain';
import HelpAppeal from './HelpAndAppeal';
import Advice from './Advice';

const TabPane = Tabs.TabPane;

class StaffCommunicationRecord extends React.Component {
  constructor(props) {
    super(props);
   
  }
  state = {
    SquareCardArr: [],
    val: null
  };

  render() {
    return (
      <div className="container-box">
        <Tabs defaultActiveKey="1" className="tabs_container">
          <TabPane tab="投诉" key="1">
            <StaffComplain />
          </TabPane>
          <TabPane tab="求助或申诉" key="2">
            <HelpAppeal />
          </TabPane>
          <TabPane tab="合理化建议" key="3">
            <Advice />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default StaffCommunicationRecord;
