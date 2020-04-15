import React, { Component } from 'react';
import { Button, Popconfirm, message, Spin, Tabs } from 'antd';
import { TableData } from 'Common/loadableCommon';
import './Compact.less';
const filterTab1=[
  {
    label:'在职人员',
    resid:'440237518278'
  },
  {
    label:'离职人员',
    resid:'437092525908'
  },{
    label:'全部人员',
    resid:'436624135588'
  }
]
const filterTab2A=[
  {
    label:'待处理',
    cms:`C3_532015901062 != 'N' and C3_532015901062 != 'Y' `
  },
  {
    label:'已处理',
    cms:`C3_532015901062 = 'Y' `
  },{
    label:'不签约',
    cms:`C3_532015901062 = 'Y' `
  }
]
const filterTab2B=[
  {
    label:'DL',
    cms:`C3_640119278050= 'DL'`
  },
  {
    label:'IDL',
    cms:`C3_640119278050= 'IDL'`
  }
]
class Compact extends Component {
  constructor(props) {
    super(props);
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let jobId = userInfo.UserInfo.EMP_ID;
    this.state = {
      jobId:jobId,
      key1:'_0A',
      ke2:'_0B',
      residTab1:440237518278,
      cms:`C3_532015901062 != 'N' and C3_532015901062 != 'Y' and C3_532015785778 = '${jobId}'`,
      cms2:`C3_640119278050= 'DL'`
    };
  }
  render() {
    const {TabPane} = Tabs
    return (
      <div className="Compact">
         <Tabs
            defaultActiveKey="1"
            style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}
          >
            <TabPane
              tab="合同信息"
              key="1"
              style={{ width: '100%', height: 'calc(100vh - 64px)' }}
            >
              <div className='filterLine'>
              {filterTab1.map((item,key) => {
                return (
                  <span className={(this.state.residTab1==item.resid)?'filter current':'filter'} key={'_'+key} onClick={()=>{this.setState({residTab1:item.resid})}}>
                    {item.label}
                  </span>
                )
              })}
              </div>
                  <div className='Tab1Outer'>
                   <TableData
                   resid={this.state.residTab1}
                   subtractH={220}
                   tableComponent="ag-grid"
                   sideBarAg={true}
                   hasAdvSearch={true}
                   hasAdd={true}
                   hasRowView={false}
                   hasRowDelete={false}
                   hasRowEdit={false}
                   hasDelete={false}
                   hasModify={true}
                   hasBeBtns={false}
                   hasRowModify={false}
                   hasRowSelection={false}
                   actionBarExtra={({ dataSource, selectedRowKeys }) => {
                    return (
                     <Button>查看历史信息</Button>
                    );
                  }}
                 />
                 </div>
            </TabPane>
            <TabPane
              tab="人员续签"
              key="2"
              style={{ width: '100%', height: 'calc(100vh - 64px)' }}
            >
            <div className='filterLine'>
              {filterTab2A.map((item,key) => {
                return (
                  <span className={(this.state.key1=='_'+key+'A')?'filter current':'filter'} key={'_'+key+'A'} onClick={()=>{this.setState({key1:'_'+key+'A',cms1:item.cms+`and C3_532015785778 = '${this.state.jobId}'`})}}>
                    {item.label}
                  </span>
                )
              })}
              </div>
              <div className='filterLine'>
              {filterTab2B.map((item,key) => {
                return (
                  <span className={(this.state.key2=='_'+key+'B')?'filter current':'filter'} key={'_'+key+'B'} onClick={()=>{this.setState({key2:'_'+key+'B',cms2:item.cms});console.log(key)}}>
                    {item.label}
                  </span>
                )
              })}
              </div>
              <div className='Tab1Outer'>

              <TableData
                   resid={488995522229}
                   subtractH={220}
                   hasAdd={true}
                   hasRowView={false}
                   hasRowDelete={false}
                   hasRowEdit={false}
                   hasDelete={true}
                   hasModify={false}
                   hasBeBtns={false}
                   hasRowModify={false}
                   hasRowSelection={false}
                   cmswhere={this.state.cms1+` and `+this.state.cms2}
                   actionBarExtra={({ dataSource, selectedRowKeys }) => {
                    return (
                    <>
                      {this.state.key1=='_2A'?
                        <>
                          <Button type='primary'>已签约</Button>
                          <Button type='danger'>未签约</Button>
                        </>:null
                      }
                      {this.state.key1=='_1A'?
                        <>
                          <Button>查看合同信息</Button>
                          <Button type='primary'>发送通知邮件</Button>
                        </>:null
                      }
                    </> 
                    );
                  }}
                 />
              </div>

            </TabPane>
        </Tabs>

      </div>
    );
  }
}

export default Compact;
