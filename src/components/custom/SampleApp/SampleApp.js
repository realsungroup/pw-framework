import React, { Component } from 'react';
import './SampleApp.less';

class SampleApp extends Component {
  constructor(props) {
    super(props);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')).UserInfo.EMP_STRING1;
  }
  componentDidMount = () => {

  };
  state = {

  };

  render() {
    return (
      <div className="sampleApp">
        测试用入口，当前登录用户是{this.userInfo}
      </div>
    );
  }
}
export default SampleApp;
