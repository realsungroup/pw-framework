import React, { Component } from 'react';
import {Steps,Button,Icon,Input,Tabs,Spin} from 'antd';
import './IDLTransfer.less';
import TableData from '../../common/data/TableData';

const { TabPane } = Tabs;
const { Step } = Steps;
 class  IDLTransfer extends  Component{
   constructor(props){
    super(props);
    this.state ={
      step:0,
      // selectedRecord:[],
      // hint:'关于张三的转岗申请已经提交成功。',
      page:'2',
      // result:'error'
    };
   }
   subData = async() =>{
      this.setState({step:1})
   }
   callBack = (k) =>{
    this.setState({page:k})
   }
   render(){
     return (
       <div className='IDLTransfer'>
         <Tabs activeKey={this.state.page} onChange={(k)=>this.callBack(k)}>
          <TabPane tab="发起新的申请" key="1">
            <div className='wrap'>
            {/* <Steps current={this.state.step} style={{width:'100%',cursor:'default'}}>
              <Step title="填写调岗申请单" />
              <Step title="查看提交结果" />
            </Steps>
            
            {
              this.state.step==0?(<footer>
                <Button type='primary' onClick={()=>this.subData()}>提交</Button>
              </footer>):null
            }
            {
              this.state.step==1?(
                <div className='result'>
                  {this.state.result=='success'?<Icon type="check-circle" theme="filled" style={{color:'#52c41a'}}/>:
                  <Icon type="close-circle" theme="filled" style={{color:'#f5222d'}}/>
                  }
                  
                  <h2>{this.state.hint}</h2>
                  {this.state.result=='success'?<><Button style={{marginRight:'16px',width:'120px'}} onClick={()=>{this.setState({step:0})}}>再申请一人</Button>
                  <Button style={{marginRight:'16px',width:'120px'}} onClick={()=>{this.setState({step:0,page:'2'})}} type='primary'>查看申请记录</Button></>:<>
                  <Button style={{marginRight:'16px',width:'120px'}} onClick={()=>{this.setState({step:0})}}>返回查看</Button>
                  <Button style={{marginRight:'16px',width:'120px'}} onClick={()=>{this.setState({step:1})}} type='primary'>再试一次</Button>
                  </>}
                  
                </div>
              ):null
            } */}
            </div>
          </TabPane>
          <TabPane tab="查看申请记录" key="2">
            <div className='wrap'>
              <div className='sider'>
                <p className={this.state.selection}>审核中</p>
                <p>被退回</p>
                <p>已通过</p>
              </div>
              <div style={{float:'left',width:'calc(100% - 144px)',marginLeft:'24px',height:'100%'}}>
              <TableData
                  resid={464171754083}
                  hasRowView={false}
                  hasAdd={false}
                  hasRowSelection={false}
                  hasRowDelete={false}
                  hasRowModify={false}
                  hasModify={false}
                  hasDelete={false}
                  style={{ height: '100%'}}
                  hasRowView={true}
                />
                </div>
              
            </div>
          </TabPane>
        </Tabs>
       </div>
     );
   }
 }


 export default  IDLTransfer;