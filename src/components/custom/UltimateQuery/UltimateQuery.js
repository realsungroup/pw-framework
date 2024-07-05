import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Modal, Button, message, Tabs, Popconfirm } from 'antd';
import './UltimateQuery.less';
import http from '../../../util20/api';
import Selected from '../Selected/Selected';
const config = {
  classes:[
      {id:1,title:"人员信息"}
  ],
  founcs:[
  {
      name: 'TableData', 
      title: '人员信息查询',
      class:1,
      props: {
        resid: 722083677725,
        baseURL: 'http://10.108.2.66:9091/',
        downloadBaseURL: 'http://10.108.2.66:80/',
      }
  }
]}
const TabPane = Tabs.TabPane;
class UltimateQuery extends Component {
  state = {
    curSelectedFonc:{
      name: 'TableData', 
      title: '人员信息查询',
      class:1,
      props: {
        resid: 722083677725,
        baseURL: 'http://10.108.2.66:9091/',
        downloadBaseURL: 'http://10.108.2.66:80/',
      }
  },
    record: {}
  };
  componentDidMount(){
  }
 
  render() {
    const{curSelectedFonc}=this.state;
    return (
      <div className='ultimate-query'>
        <div className='side-bar'></div>
        <div className='main-frame'>
          {curSelectedFonc.name==='TableData'?
          <TableData 
            resid={curSelectedFonc.props.resid} 
            baseURL={curSelectedFonc.props.baseURL} 
            downloadBaseURL={curSelectedFonc.props.downloadBaseURL}
            hasRowModify={false}
            hasAdd={false}
            hasRowDelete={false}
            hasRowView={true}
            height={"100vh"}
            subtractH={240}
            hasBeBtns={false}
            hasDelete={false}
            hasModify={false}
            hasAdvSearch={false}
          />:null}
        </div>
      </div>
    );
  }
}
export default UltimateQuery;
