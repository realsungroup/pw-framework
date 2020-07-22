import React from 'react';
import './StaffCommunicationRecord.less';
import { Modal, Button, message, Tabs, Popconfirm, Input, Form } from 'antd';
// import http from '../../../../util20/api';
import StaffComplain from './StaffComplain'
const TabPane = Tabs.TabPane;

class StaffCommunicationRecord extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.wuxiHr03BaseURL;
    this.dlEmployDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.wuxiHr03DownloadBaseURL;
  }
  state = {
    SquareCardArr: [],
    val: null,
  };
  
  render() {
    return (
      <div className = 'container-box'>
        <Tabs 
        defaultActiveKey = "1"
        className= 'tabs_container'
        >
          <TabPane tab="投诉" key="1">
          <StaffComplain />
          </TabPane>
          <TabPane tab="求助或申诉" key="2">
<div>13</div>
          </TabPane>
          <TabPane tab="合理化建议" key="3">

          </TabPane>
          
        </Tabs>
       
      </div>
    );
  }
}

export default StaffCommunicationRecord;
