import React, { Component } from 'react';
import {Steps,Button,Icon,Select,Input,Tabs,Spin,TreeSelect,Modal, DatePicker,Switch,Checkbox,message} from 'antd';
import './IDLTransferHr.less';
import TableData from '../../common/data/TableData';
import qs from 'qs';
import http from 'Util20/api';
import moment from 'moment';
import IDLTransferVerify from '../IDLTransferVerify';
import IDLTransferVerifyAction from '../IDLTransferVerifyAction';
import { async } from 'q';
import Sider from 'antd/lib/layout/Sider';


const { Step } = Steps;
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
  'depart',//部门名
  'jobName',//职务名
  'nLevel',//级别
  'nDriectorName',//主管
  'nProj_Code',//项目代码
  'nBuCode',//bucode
  'nFirstDepart',//一级部门
  'nSecondDepart',//二级部门
  'nThirdDepart',//三级部门
  'nFourthDepart',//四级部门
]
const subresid = 632314794466;//子表resid
 class  IDLTransferHr extends  Component{
   constructor(props){
     super(props)
    this.state ={
      cms:`hrPreAprrove = 'waiting'`,
      loading:false,
      visible:false,
      stream:[],
      C3_632503853105:'',
      toCheckFront:{
        C3_632503853105:null,
        effortDate:null,//生效日期
        changeReason:'- -',//变动原因
      },
      toCheck:[
        
      ],
      member:[],//同一审批单的人员
      conUnpass:false,
   }
  }
   //生成审批流
   StreamGenerate=async(resid,recid)=>{
    try{
      let res = await http().CreateAuditFlowData({
         resid,
         recid
       });
       var n=1;
       var arr=[];
       while(n<(res.data.length+1)){
         var c=0;
         while(c<res.data.length){
           if(res.data[c].auditNo==n){
            arr.push({stepName:res.data[c].auditCName,stepPeople:res.data[c].auditUserCode,stepPeopleID:res.data[c].auditUserCode,auditNo:res.data[c].auditNo,auditRecno:res.data[c].auditRecno})
           }
           c++;
         }
         n++;
       }
       n=0;
       var str=``;
      //  C3_305737857578 编号
      //  C3_448032387764 工号
       while(n<arr.length){
         if(n==0){
          str=`C3_305737857578 = '${arr[n].stepPeople}'`;

         }else{
        str+=` or C3_305737857578 = '${arr[n].stepPeople}'`;

         }
        n++;
       }
       console.log('str',str)

    
       try{
        let res2 = await http().getTable({
           resid: 609599795438,
           cmswhere:str
         });
         n=0;
         var arr2=arr
         while(n<arr2.length){
           var c=0;
           while(c<res2.data.length){
             if(arr2[n].stepPeople==res2.data[c].C3_305737857578){
              arr2[n].stepPeople=res2.data[c].C3_227192484125
             }
             c++;
           }
    
           n++;
         }
         this.setState({stream:arr2})
         }catch(e){
           console.log(e);
           this.setState({loading:false});
         }
      
       }catch(e){
         console.log(e);
       }
   }
   //获取审批单上的人员名单
  getMem=async(v)=>{
    this.setState({loading:true});
    try{
    let res = await http().getTable({
       resid: 632314958317,
       cmswhere:`C3_632503844784='${v}'`
     });
     this.setState({member:res.data,loading:false})
     console.log('resqq',res)
     }catch(e){
       console.log(e);
       this.setState({loading:false});
     }
    }
    approve=async(v)=>{
      this.setState({loading:true})
      console.log(v);
      var res='';
      if(v=='N'){
       
     try {
      res = await http().modifyRecords({
        resid: 632255761674,
        data: [{
          REC_ID:this.state.toCheckFront.REC_ID,
          Approve:'未通过',
          ApproveRemark:this.state.C3_632503853105,
          hrPreAprrove:'N'
        }]
      });
      console.log('res', res);
      if (res.Error === 0) {
        message.success(res.message);
        this.setState({visible:false,conUnpass:false,loading:false})
        this.tableDataRef.handleRefresh();
        
      }
    } catch (error) {
      message.error(error.message);
      this.setState({loading:false});

    }
      }else{
        try {
          var date=this.state.toCheckFront.effortDate;
if(date){date=moment(date).format('YYYY-MM-DD');}
        res = await http().modifyRecords({
          resid: 632255761674,
          data: [{
            REC_ID:this.state.toCheckFront.REC_ID,
            Approve:'审核中',
            ApproveRemark:this.state.C3_632503853105,
            hrPreAprrove:'Y',
            effortDate:date
          }]
        });
        var streamRec=[];
        // C3_634660564341 变动编号
        // C3_635250483297 审批阶段序号
        // C3_634660566076 审批序号
        // C3_635255573464 审批人编号
        // C3_634660565034 审批阶段名称
        // C3_634660565583 审批人
        var n=0;
        while(n<this.state.stream.length){
            streamRec.push({
              C3_634660564341:this.state.toCheckFront.changeID,
              C3_635250483297:this.state.stream[n].auditRecno,
              C3_634660566076:this.state.stream[n].auditNo,
              C3_635255573464:this.state.stream[n].stepPeopleID,
              C3_634660565034:this.state.stream[n].stepName,
              C3_634660565583:this.state.stream[n].stepPeople
            })
            n++;
        }
        var res2 = await http().addRecords({
          resid: 634660498796,
          data:streamRec
          
        });
        
        if ((res.Error === 0) && (res2.Error === 0)) {

          
          message.success(res.message);
          this.setState({visible:false,loading:false});
          this.tableDataRef.handleRefresh();
          
        }
      } catch (error) {
        message.error(error.message);
        this.setState({loading:false});
  
      }
      }
    }
  showOverlay=(v)=>{
    console.log(v)
    this.setState({memberDetail:null,stream:[]})
    var n= 0;
    var arr=[];
    while(n<attr.length){
      var a=v[showAfter[n]]||'- -'
      arr.push(a)
      n++;
    }
    var obj=v;
    var date=obj.effortDate;
      if(date){date=moment(date);}
      obj.effortDate=date;
      var resid='';
      if(obj.changeType=='部门变更'){
        resid='634822081509';
      }else if(obj.changeType=='汇报关系变更'){
        resid='634822110774';
      }else if(obj.changeType=='职位变更'){
        resid='634822131537';
      }else if(obj.changeType=='级别变更'){
        resid='634820028458';
      }
      this.StreamGenerate(resid,obj.changeID)
      this.getMem(obj.changeID);
      
    this.setState({toCheck:arr,toCheckFront:v,visible:true});
  }
   componentDidMount(){
     
   }
   render(){
     return (
       <div className='IDLTransferHR'>
         <sider>
           <ul>
             <li className={this.state.cms==`hrPreAprrove = 'waiting'`?'cur':''} onClick={()=>{this.setState({cms:`hrPreAprrove = 'waiting'`})}}>HR预审未审批</li>
             <li className={this.state.cms==`hrPreAprrove = 'Y'`?'cur':''} onClick={()=>{this.setState({cms:`hrPreAprrove = 'Y'`})}}>HR预审已通过</li>
             <li className={this.state.cms==`hrPreAprrove = 'N'`?'cur':''} onClick={()=>{this.setState({cms:`hrPreAprrove = 'N'`})}}>HR预审未通过</li>
           </ul>
          </sider>
          <content>
          <Modal
          width={'60vw'}
          visible={this.state.conUnpass}
          onCancel={()=>this.setState({conUnpass:false})}
          footer={
            <>
            <Button onClick={()=>{this.setState({conUnpass:false})}}>取消</Button>
            <Button type='primary' onClick={()=>{this.approve('N')}}>确认</Button>
            </>
          }
        >
          <h3>请输入审核未通过的理由</h3><p>({this.state.C3_632503853105.length}/200字)</p>
          <Input.TextArea maxLength={200} style={{marginTop:16,width:'60vw',height:120,resize:'none'}} value={this.state.C3_632503853105} onChange={(v)=>{this.setState({C3_632503853105:v.target.value})}} placeholder='最多输入200字'/>
        </Modal>
          <Modal 
          width={'90vw'}
          visible={this.state.visible}
          footer={ this.state.cms==`hrPreAprrove = 'waiting'`?
          (this.state.stream.length==0?'审批流计算中，不可预审。请耐心等待...':
            <>
            <Button type='danger' loading={this.state.loading} style={{marginLeft:'8px'}} onClick={()=>{this.setState({conUnpass:true})}}>不通过审核</Button>
            <Button type='primary' loading={this.state.loading} onClick={()=>this.approve('Y')}>保存并通过审核</Button>
            </>):null}
          onCancel={()=>this.setState({visible:false})}
          >
          <div className='toCheck' style={{height:'60vh'}}>
            <div className='steps' style={{width:'calc(100% - 48px)',marginLeft:'24px'}}>
              {(this.state.stream.length==0)?'正在计算审批流':<Steps size="small" current={0}>
              {this.state.stream.map((item,key)=>{
                return(
                  <Step title={item.stepName} description={<span>{item.stepPeople}</span>}/>

                )
              })}
            </Steps>}
            
            <div className='showContent' style={{marginTop:24,width:480,marginLeft:'calc(50% - 240px)'}}>

                <b>生效时间：</b><DatePicker
                    value={this.state.toCheckFront.effortDate}
                    onChange={(v)=>this.setState({
                      toCheckFront: {
                          ...this.state.toCheckFront,
                          effortDate: v
                        }
                        })}
                  />
                <br/>
                <br/>
                <b>变动原因：</b>
                 <span>{this.state.toCheckFront.changeReason}</span>
                 <br/>
                 {this.state.toCheckFront.C3_632503853105?(<div>
                <b>审核反馈信息：</b>
                <span>{this.state.toCheckFront.C3_632503853105}</span>
              </div>):null}
                <div className='tableWrap'>
                
                <b>变动后信息：</b>
               

                <Spin spinning={this.state.loading}>
                <div style={{clear:'both'}}></div>
                <ul style={{float:'left',listStyle:'none',padding:'0',paddingRight:'8px'}}>
                  {attr.map(item=>{return(<li style={{lineHeight:'24px'}}>{item}</li>)})}
                </ul>
                <ul style={{float:'left',listStyle:'none',padding:'0'}}>
                  {this.state.toCheck.map(item=>{return(<li style={{lineHeight:'24px'}}>{item}</li>)})}
                </ul>
                <div style={{float:'left',marginLeft:'40px',position:'relative',top:'-24px'}}>
                  <b>变动人员：</b>
                <div style={{clear:'both'}}></div>
                  {this.state.member.map((item)=>{return(<p onClick={()=>{this.setState({memberDetail:item});console.log(222)}} style={{lineHeight:'24px',color:'#1890ff',cursor:'pointer',margin:'0'}}>{item.C3_632503839336+'-'+item.C3_632503839068}</p>)})}
                </div>
                {
                  this.state.memberDetail?(
                    <div style={{float:'left',marginLeft:'40px',position:'relative',top:'-24px'}}>
                      <ul style={{listStyle:'none',padding:'0'}}>
                      <li style={{lineHeight:'24px'}}><b>姓名: </b>{this.state.memberDetail.C3_632503839336}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前部门名: </b>{this.state.memberDetail.C3_632503853570}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前职务名: </b>{this.state.memberDetail.C3_632503844117}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前级别: </b>{this.state.memberDetail.C3_632503845505}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前主管: </b>{this.state.memberDetail.C3_632503843378}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前项目代码: </b>{this.state.memberDetail.C3_632503855976}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前bucode: </b>{this.state.memberDetail.C3_632503858946}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前一级部门: </b>{this.state.memberDetail.C3_632503839577}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前二级部门: </b>{this.state.memberDetail.C3_632503840613}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前三级部门: </b>{this.state.memberDetail.C3_632503840359}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前四级部门: </b>{this.state.memberDetail.C3_632503841599}</li>
                      </ul>
                    </div>
                  ):null
                }
                <div style={{clear:'both'}}></div>
                {this.state.toCheckFront.ApproveRemark?
                (<><br/><b>审批说明:</b>
                  <p>{this.state.toCheckFront.ApproveRemark}</p></>)
                :null}
                
                </Spin>
                </div>
            </div>
            </div>
          </div>
        </Modal>
            <TableData
                  resid={632255761674}
                  cmswhere={this.state.cms}
                  hasRowView={false}
                  hasAdd={false}
                  refTargetComponentName="TableData"
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  hasRowDelete={false}
                  hasRowModify={false}
                  hasModify={false}
                  hasDelete={false}
                  style={{ height: '100%'}}
                  hasRowView={false}
                  actionBarWidth={120}
                  actionBarFixed={true}

                  customRowBtns={[
                    record => {
                      return (
                        <Button
                        style={{width:'104px'}}
                          onClick={() => {
                            this.showOverlay(record);
                          }}
                        >
                          {this.state.cms==`hrPreAprrove = 'waiting'`?'审批':'确认信息'}
                        </Button>
                      );
                    }
                  ]}
                />

          </content>
       </div>
     );
   }
 }


 export default  IDLTransferHr;