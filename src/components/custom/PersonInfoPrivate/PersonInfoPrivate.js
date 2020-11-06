import React from 'react';
import {Spin,Button,Icon} from 'antd';
import http from 'Util20/api';
import PersonInfoInFile from '../PersonInfoInFile/';

/**
 * 档案管理内的个人信息
 */
class PersonInfoPrivate extends React.Component {

    constructor(props) {
      // resid:612530416359
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
     
     console.log(userInfo)
      var usercode=userInfo.UserInfo.EMP_USERCODE;
      console.log(usercode)
      super(props);
      this.state = {
        showDetail:false,
        selectedRecord:'',
        usercode:usercode
      }
     
    } 
    componentDidMount(){
    
    }
   

  render() {
    return (
     <div style={{width:'100%',height:'100%'}}>
          <PersonInfoInFile edit={true} memberId={this.state.usercode} private={true}></PersonInfoInFile>
    
      </div>

    );
  }
}
export default PersonInfoPrivate;