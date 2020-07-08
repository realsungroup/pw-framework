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
          <div style={{width:'100vw',height:'calc(100vh - 92px)',overflow:'auto'}}>
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
            hasAdd: false,
            isWrap:true,
            hasModify:false,
            hasRowSelection:false,
            hasDelete: false,
            advSearch:{
              isRequestFormData:false,
            },

          }}
         
          subTablesProps={{
            576415161967: {
              hasAdd: true,
              hasDelete: true,
            hasModify:false,
            advSearch:{
              isRequestFormData:false,
            },
            }
          }}
        ></MainTableSubTables>
          </div> 
        
        </TabPane>
        <TabPane tab='headcount审批流更改' key='2'>
          <div style={{width:'100vw',height:'calc(100vh - 92px)',overflow:'auto'}}>
          <MainTableSubTables
        baseURL= {this.baseURL}
        downloadBaseURL={this.dlEmployDownloadURL}
        isWrap={true}
          resid={576924862772}
          style={{
            // height: 600,
            overflow: 'auto',
            margin: '0 auto'
          }}
          mainTableProps={{
            hasAdd: false,
            isWrap:true,
            advSearch:{
              isRequestFormData:false,
            },
          }}
          subTablesProps={{
            576268771221: {
              hasAdd: true,
              hasDelete: true,
              advSearch:{
                isRequestFormData:false,
              },
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
