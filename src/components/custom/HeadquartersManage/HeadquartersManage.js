import React from 'react';
import './HeadquartersManage.less';
import MainTableSubTables from '../../common/data/MainTableSubTables/';
import { Modal, Button, message, Tabs, Popconfirm, Input, Form } from 'antd';
const TabPane = Tabs.TabPane;

class HeadquartersManage extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.headquartersBaseURL;
    this.dlEmployDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.headquartersDownloadURL;
  }
  state = {
    activeKey:1
  };
  handleTabsChange = activeKey => {
    this.setState({ activeKey });
  };
  render() {
    return (
      <div style={{width:'100vw',height:'100vh',background:'#fff'}}>
        <Tabs onChange={this.handleTabsChange}>
        <TabPane tab='offer审批流更改' key='1'>
          <div style={{width:'100vw',height:'100vh'}}>
          <MainTableSubTables
        baseURL= {this.baseURL}
        downloadBaseURL={this.dlEmployDownloadURL}
          resid={576926312667}
          style={{
            // height: 600,
            overflow: 'auto',
            margin: '0 auto'
          }}
          mainTableProps={{
            hasAdd: false
          }}
          subTablesProps={{
            576415161967: {
              hasAdd: true,
              hasDelete: true
            }
          }}
        ></MainTableSubTables>
          </div> 
        
        </TabPane>
        <TabPane tab='headcount审批流更改' key='2'>
          <div style={{width:'100vw',height:'100vh'}}>
          <MainTableSubTables
        baseURL= {this.baseURL}
        downloadBaseURL={this.dlEmployDownloadURL}
          resid={576924862772}
          style={{
            // height: 600,
            overflow: 'auto',
            margin: '0 auto'
          }}
          mainTableProps={{
            hasAdd: false
          }}
          subTablesProps={{
            576268771221: {
              hasAdd: true,
              hasDelete: true
            }
          }}
        ></MainTableSubTables>
          </div> 
        
        </TabPane>
        </Tabs>
      </div>
        
    );
  }
}

export default HeadquartersManage;
