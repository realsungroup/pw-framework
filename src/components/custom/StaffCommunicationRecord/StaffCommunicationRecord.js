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
    val: null,
    userType: ''
  };

  componentDidMount = () => {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let groupID = userInfo.UserInfo.GroupList;
    let grouplist = groupID
      .replace('(', '')
      .replace(')', '')
      .replace(/'/g, '');
    let listArr = grouplist.split(', ');
    if (listArr[0]) {
      listArr.forEach((id, index) => {
        if (id === '650125891992') {
          this.setState({
            userType: 'admin'
          });
        }
      });
    }
  };
  render() {
    return (
      <div className="container-box">
        <Tabs defaultActiveKey="1" className="tabs_container">
          <TabPane tab="投诉" key="1">
            <StaffComplain userType={this.state.userType} />
          </TabPane>
          <TabPane tab="求助或申诉" key="2">
            <HelpAppeal userType={this.state.userType} />
          </TabPane>
          <TabPane tab="合理化建议" key="3">
            <Advice userType={this.state.userType} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default StaffCommunicationRecord;
