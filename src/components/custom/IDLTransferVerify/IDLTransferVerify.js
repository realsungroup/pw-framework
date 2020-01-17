import React, { Component } from 'react';
import {Table,Steps,Button,Select,Tabs,Spin,Modal,message,Input,DatePicker} from 'antd';
import './IDLTransferVerify.less';
import TableData from '../../common/data/TableData';
import http from 'Util20/api';
import moment from 'moment';

const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;
const columns = [
  {
    title: '属性',
    dataIndex: 'attributes',
  },
  {
    title: '变更前',
    dataIndex: 'before',
  },
  {
    title: '变更后',
    dataIndex: 'after',
  },
];
const showBefore=[
  'C3_632503853570',//部门名
  'C3_632503844117',//职务名
  'C3_632503845505',//级别
  'C3_632503843378',//主管
  'C3_632503855976',//项目代码
  'C3_632503858946',//bucode
  'C3_632503839577',//一级部门
  'C3_632503840613',//二级部门
  'C3_632503840359',//三级部门
  'C3_632503841599',//四级部门
]
const attr=[
  '部门名',
  '职务名',
  '级别',
  '主管',
  '项目代码',
  'bucode',
  '一级部门',
  '二级部门',
  '三级部门',
  '四级部门'
]
const showAfter=[
  'C3_632503853332',//部门名
  'C3_632503845264',//职务名
  'C3_632503845755',//级别
  'C3_632503843620',//主管
  'C3_632503856450',//项目代码
  'C3_632503859143',//bucode
  'C3_632503841349',//一级部门
  'C3_632503841101',//二级部门
  'C3_632503841849',//三级部门
  'C3_632503842108',//四级部门
]
 class  IDLTransferVerify extends  Component{
   constructor(props){
    super(props);
    this.state ={
      loading:false,
      conUnpass:false,
      selection:1,
      cms:`status = '审核中'`,
      visible:false,
      toCheck:[
        
      ],
      C3_632503853105:'',//审批说明
      toCheckFront:{
        C3_632503853105:null,
        C3_632503840116:null,//生效日期
        C3_632503839336:'- -',//对象姓名
        C3_632503839068:'- -',//对象工号
        C3_632503846004:'- -',//变动原因
      },
      stream:['原部门主管审批','原部门经理审批','原部门总监审批','现部门经理审批','现部门总监审批','HR专员审批','HR总监审批'],
    }
    
  }
   componentDidMount(){
     
   }
   
   unPass=async()=>{
     this.setState({
       loading:true,visible:false
     });
     var res='';
     try {
      res = await http().modifyRecords({
        resid: 632314958317,
        data: [{
          REC_ID:this.state.toCheckFront.REC_ID,
          status:'未通过',
          C3_632503853105:this.state.C3_632503853105
        }]
      });
      console.log('res', res);
      if (res.Error === 0) {
        message.success(res.message);
        this.tableDataRef.handleRefresh();

        this.setState({loading:false});
        
      }
    } catch (error) {
      message.error(error.message);
      this.setState({loading:false});

    }
   }
  showOverlay=(r)=>{
    var n=0;
    var arr=[];
    while(n<attr.length){
      var b=r[showBefore[n]]||'- -';
      var a=r[showAfter[n]]||'- -'
      arr.push({
        key:n,
        attributes:attr[n],
        before:b,
        after:a,
      })
      n++;
    }
    var obj=r;
    var date=obj.C3_632503840116;
      date=moment(date);
      obj.C3_632503840116=date;
    this.setState({visible:true,toCheck:arr,toCheckFront:obj});

  }
   render(){
     return (
      <div className='IDLTransferVerify'>
        <Spin spinning={this.state.loading}>
        <Modal
          width={'60vw'}
          visible={this.state.conUnpass}
          onCancel={()=>this.setState({conUnpass:false})}
          footer={
            <>
            <Button onClick={()=>{this.setState({conUnpass:false})}}>取消</Button>
            <Button type='primary' onClick={()=>{this.unPass();this.setState({conUnpass:false})}}>确认</Button>
            </>
          }
        >
          <h3>请输入审核未通过的理由</h3><p>({this.state.C3_632503853105.length}/200字)</p>
          <Input.TextArea maxLength={200} style={{marginTop:16,width:'60vw',height:120,resize:'none'}} value={this.state.C3_632503853105} onChange={(v)=>{this.setState({C3_632503853105:v.target.value})}} placeholder='最多输入200字'/>
        </Modal>
        <Modal 
          width={'90vw'}
          visible={this.state.visible}
          footer={this.state.toCheckFront.status=='审核中'?(
            <>
            <Button type='danger' style={{marginLeft:'8px'}} onClick={()=>{this.setState({conUnpass:true})}}>不通过审核</Button>
            <Button type='primary'>保存并审核</Button>

            </>
          ):null}
          onCancel={()=>this.setState({visible:false})}
          >
          <div className='toCheck' style={{height:'60vh'}}>
            <div className='steps' style={{width:'calc(100% - 48px)',marginLeft:'24px'}}>
            <Steps size="small" current={0}>
              {this.state.stream.map(item=>{
                return(
                  <Step title={item} />

                )
              })}
            </Steps>
            <div className='showContent'>

                <b>生效时间：</b><DatePicker
                    value={this.state.toCheckFront.C3_632503840116}
                    onChange={(v)=>this.setState({
                      toCheckFront: {
                          ...this.state.toCheckFront,
                          C3_632503840116: v
                        }
                        })}
                  />
                <b>调动对象姓名：</b><span>{this.state.toCheckFront.C3_632503839336}</span>
                <b>调动对象工号：</b><span>{this.state.toCheckFront.C3_632503839068}</span>
                <br/>
                <br/>
                <b>变动原因：</b>
                 <span>{this.state.toCheckFront.C3_632503846004}</span>
                 <br/>
                 {this.state.toCheckFront.C3_632503853105?(<div>
                <b>审核反馈信息：</b>
                <span>{this.state.toCheckFront.C3_632503853105}</span>
              </div>):null}
                <div className='tableWrap'>
                <Table style={{height:'calc(60vh - 168px)',overflowY:'auto'}} pagination={false} bordered dataSource={this.state.toCheck} columns={columns} size="small"/>
                </div>
            </div>
            </div>
          </div>
        </Modal>
        <div className='sider'>
                <p className={this.state.selection=='1'?'current':null} onClick={()=>{this.setState({selection:'1',cms:`status = '审核中'`})}}>审核中</p>
                <p className={this.state.selection=='2'?'current':null} onClick={()=>{this.setState({selection:'2',cms:`status = '未通过'`})}}>未通过</p>
                <p className={this.state.selection=='3'?'current':null} onClick={()=>{this.setState({selection:'3',cms:`status = '已通过'`})}}>已通过</p>
                <p className={this.state.selection=='4'?'current':null} onClick={()=>{this.setState({selection:'4',cms:'all'})}}>全部</p>
              </div>
              <div style={{float:'left',width:'calc(100% - 144px)',marginLeft:'24px',height:'calc(100vh - 60px)'}}>
             
              <TableData
                  resid={632314958317}
                  cmswhere={this.state.cms=='all'?'':this.state.cms}
                  hasRowView={false}
                  hasAdd={false}
                  refTargetComponentName="TableData"
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  hasRowSelection={false}
                  hasRowDelete={false}
                  hasRowModify={false}
                  hasModify={false}
                  hasDelete={false}
                  style={{ height: '100%'}}
                  hasRowView={false}
                  customRowBtns={[
                    record => {
                      return (
                        <Button
                          onClick={() => {
                            this.showOverlay(record);
                          }}
                        >
                          确认信息
                        </Button>
                      );
                    }
                  ]}
                />
                </div>
            </Spin>
       </div>
     );
   }
 }


 export default  IDLTransferVerify;