import React, { Component } from 'react';
import {Table,Steps,Button,Select,Tabs,Spin,Modal,message,Input,DatePicker} from 'antd';
import './IDLTransferVerifyAction.less';
import TableData from '../../common/data/TableData';
import http from 'Util20/api';
import moment from 'moment';
import { async } from 'q';

function compare(property) {
  return function (a, b) {
      return (a[property] - b[property])
  }
}
    // 排序
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
const attr=[
  '部门名',
  '职务名',
  '级别',
  '主管',
  '项目代码',
  'BU CODE',
  '一级部门',
  '二级部门',
  '三级部门',
  '四级部门'
]
const showAfter=[
  'nDepart',//部门名
  'nJobName',//职务名
  'nLevel',//级别
  'nDriectorName',//主管
  'nProj_Code',//项目代码
  'nBuCode',//bucode
  'nFirstDepart',//一级部门
  'nSecondDepart',//二级部门
  'nThirdDepart',//三级部门
  'nFourthDepart',//四级部门
]
 class  IDLTransferVerifyAction extends  Component{
   constructor(props){
    super(props);
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    var jobNum = userInfo.UserInfo.EMP_ID;
    this.state ={
      approveRec:[],//临时储存的审批记录
      mode:props.mode,
      loading:false,
      conUnpass:false,
      selection:1,
      canApprove:false,//是否为当前审批人
      userId:jobNum,
      cms:`C3_634660565837 = 'Waiting' and C3_634660565295 = '${jobNum}'`,
      
      visible:false,
      C3_632503844784:'',//记录编号
      toCheck:[
        
      ],
      member:[],//同一审批单的人员
      C3_632503853105:'',//审批说明
      toCheckFront:{
        C3_632503853105:null,
        effortDate:null,//生效日期
        changeReason:'- -',//变动原因
      },
      curStep:0,
      // '原部门主管审批','原部门经理审批','原部门总监审批','现部门经理审批','现部门总监审批','现部门主管审批','HR专员审批','HR总监审批'
      stream:[],
      memberDetail:{

      }
    }
    
  }
   componentDidMount(){
    
   }
  
   getMem=async(v)=>{
     this.setState({loading:true});
     try{
     let res = await http().getTable({
        resid: 632314958317,
        cmswhere:`C3_632503844784='${v}'`
      });
      this.setState({member:res.data})
      console.log('resqq',res)
      }catch(e){
        console.log(e);
        this.setState({loading:false});
      }
      try{ 
        let res2 = await  http().getTable({
        resid: 634660498796,
        cmswhere:`C3_634660564341='${v}'`
      });
      this.setState({approveRec:res2})
      var n=0;
      var arr=[];
      var c=0;
      while(n<res2.data.length){
        arr.push(
          {
            stepName:res2.data[n].C3_634660565034,
            stepPeople:res2.data[n].C3_634660565583,
            stepTime:res2.data[n].edit_time,
            order:res2.data[n].C3_634660566076,
        }
          );
        if(res2.data[n].C3_634660565837=='Y'){
          var cc=res2.data[n].C3_635250483297;
          if(cc>c){
            c=cc
          }
          
        }
        n++;
      }
      console.log('arr',arr)
      arr=arr.sort(compare('order'))  

      // 判断是否为当前审批人
      var c2=c+1;
    var jobNum = this.state.userId;
    n=0;
    while(n<res2.data.length){
      if(res2.data[n].C3_634660566076==c2){
        if(jobNum==res2.data[n].C3_634660565295){
          this.setState({canApprove:true});
          
        }else{
          this.setState({canApprove:false});
          this.setState({curAPe:res2.data[n].C3_634660565583})
        }
      }
      n++;
    }
    c=Number(c)-1;
      this.setState({loading:false,curStep:c,stream:arr});
    }catch(e){
      console.log(e);
      this.setState({loading:false});
      }
   }
   approveGroup=async(dataSource,selectedRowKeys)=>{
      var data=[];
      var freshData=[]
      n=0
      while(n<selectedRowKeys.length){
        var c=0;
        while(c<dataSource.length){
          if(dataSource[n].REC_ID==selectedRowKeys[c]){
            freshData.push({REC_ID:dataSource[n].C3_634660564341});
          }
          c++;
        }
        n++;
      }
      dataSource.map(item => {
        if (selectedRowKeys.includes(item.REC_ID)) {
          data.push(item);
        }
      });
      var n=0;
      while(n<data.length){
        data[n].C3_634660565837='Y'
        n++;
      }
    this.setState({loading:true});
    var res;
    try{
      res = await http().modifyRecords({
        resid: 637176902794,
        data: data
      });
      
      var res4 = await http().modifyRecords({
        resid: 632255761674,
        data:freshData
      });
    this.setState({loading:false});
    if (res.Error === 0 && res4.Error === 0) {
      message.success(res.message);
      this.tableDataRef.handleRefresh();
      
    }
    }catch(e){
      console.log(e)
    this.setState({loading:false});

    }
   }
   approve=async(v)=>{
     this.setState({loading:true});
     var res='';
     var arr=this.state.approveRec.data;
     var n=0;
     var c=Number(this.state.curStep);
      c=c+2;
      var obj
    while(n<arr.length){      
      if(c==arr[n].C3_635250483297){
        arr[n].C3_634660565837=v
       obj=arr[n]
      }
      n++;
    }
console.log(obj)
     try {
      res = await http().modifyRecords({
        resid: 637176902794,
        data: [obj]
      });
      if(v=='N'){
        this.unPass();
      }else{
        console.log(c)
        // if(arr.length==c){
          
        //   this.passStream();
        // }else{
      
          var res4='';
          var date=this.state.toCheckFront.effortDate;
         if(date){date=moment(date).format('YYYY-MM-DD');}
                try {
                res4 = await http().modifyRecords({
                  resid: 632255761674,
                  data: [{
                    REC_ID:this.state.toCheckFront.REC_ID,
                    effortDate:date,
                  }]
                });
                if (res.Error === 0) {
                  message.success(res.message);
                  this.tableDataRef.handleRefresh();
                  
                }
                console.log('res', res);
              } catch (error) {
                message.error(error.message);
                this.setState({loading:false});

              }
        }
      // }
      this.setState({conUnpass:false,visible:false,loading:false});
    }catch(e){
        console.log(e);
        this.setState({loading:false});
      }
   }
   passStream=async()=>{
    var res='';
    var date=this.state.toCheckFront.effortDate;
     if(date){date=moment(date).format('YYYY-MM-DD');}
    try {
     res = await http().modifyRecords({
       resid: 632255761674,
       data: [{
         REC_ID:this.state.toCheckFront.REC_ID,
         Approve:'已通过',
         effortDate:date,
       }]
     });
     console.log('res', res);
     if (res.Error === 0) {
       message.success(res.message);
       this.tableDataRef.handleRefresh();
       
     }
   } catch (error) {
     message.error(error.message);
     this.setState({loading:false});

   }
   }
   unPass=async()=>{
  
     var res='';
     try {
      res = await http().modifyRecords({
        resid: 632255761674,
        data: [{
          REC_ID:this.state.toCheckFront.REC_ID,
          Approve:'未通过',
          ApproveRemark:this.state.C3_632503853105
        }]
      });
      console.log('res', res);
      if (res.Error === 0) {
        message.success(res.message);
        this.tableDataRef.handleRefresh();
        
      }
    } catch (error) {
      message.error(error.message);
      this.setState({loading:false});

    }
   }
  showOverlay=async(r)=>{
    console.log('r',r)
    var res='';
    var v = r.C3_634660564341;
    try{
      res = await http().getTable({
        resid: 632255761674,
        cmswhere:`changeID = '${v}'`
      });
      var n=0;
      var arr=[];
      while(n<attr.length){
        var a=res.data[0][showAfter[n]]||'- -'
        arr.push(a)
        n++;
      }
      var obj=res.data[0];
      var date=obj.effortDate;
        if(date){date=moment(date);}
        obj.effortDate=date;
        this.getMem(r.C3_634660564341);
      this.setState({memberDetail:null,visible:true,toCheck:arr,toCheckFront:obj,C3_632503844784:obj.changeID});
  
    }catch(e){
      console.log(e);this.setState({laoding:false})
    }
   
  }
  judgeMulti=async(dataSource,selectedRowKeys,bol)=>{
    var j=bol?'已通过':'未通过';
    var arr=[];
    if (selectedRowKeys.length) {
      this.setState({loading:true});

      dataSource.map(item => {
      selectedRowKeys.map(items => {
        if (item.REC_ID === items) {
          var obj=item;
          obj.Approve=j;
          arr.push(item);
        }
      });
    });
    var res='';
     try {
      res = await http().modifyRecords({
        resid: 632314958317,
        data: arr
      });
      if (res.Error === 0) {
        message.success(res.message);
        this.tableDataRef.handleRefresh();

        this.setState({loading:false});
        
      }
    } catch (error) {
      message.error(error.message);
      this.setState({loading:false});

    }
  }else{
      message.error('请选勾选记录！');

    }
  }
   render(){
     return (
      <div className='IDLTransferVerifyAction'>
        <Spin spinning={this.state.loading}>
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
          footer={this.state.selection=='1'?
            <>
            <Button type='danger' style={{marginLeft:'8px'}} onClick={()=>{this.setState({conUnpass:true})}}>不通过审核</Button>
            <Button type='primary' onClick={()=>this.approve('Y')}>保存并通过审核</Button>
            </>:null}
          onCancel={()=>this.setState({visible:false})}
          >
          <div className='toCheck' style={{height:'80vh'}}>
            <div className='steps' style={{width:'calc(100% - 48px)',marginLeft:'24px'}}>
              {this.state.loading?null:<Steps size="small" status={this.state.cms==`C3_634660565837 = 'N' and C3_634660565295 = '${this.state.userId}'`?'error':(this.state.cms==`C3_634660565837 = 'Y' and C3_634660565295 = '${this.state.userId}'`?'process':'process')} current={(this.state.curStep)+1}>
              {this.state.stream.map((item,key)=>{
                return(
                  <Step title={item.stepName} description={<span>{item.stepPeople}<br/>{item.stepTime}</span>}/>

                )
              })}
            </Steps>}
            
            {/* <div className='showContent' style={{height:'calc(80vh - 120px)',overflowY:'auto',marginTop:24,width:480,marginLeft:'calc(50% - 240px)'}}> */}
            <div className='showContent' style={{marginTop:24,width:'100%',marginLeft:'0'}}>

                <b>生效时间：</b><DatePicker
                    value={this.state.toCheckFront.effortDate}
                    onChange={(v)=>this.setState({
                      toCheckFront: {
                          ...this.state.toCheckFront,
                          effortDate: v
                        }
                        })}
                  />
                  <b>变动类型：{this.state.toCheckFront.changeType}</b>
                {/* <b>调动对象姓名：</b><span>{this.state.toCheckFront.C3_632503839336}</span>
                <b>调动对象工号：</b><span>{this.state.toCheckFront.C3_632503839068}</span> */}
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
                {/* <Table style={{height:'calc(60vh - 168px)',overflowY:'auto'}} pagination={false} bordered dataSource={this.state.toCheck} columns={columns} size="small"/> */}
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
                    <div style={{float:'left',marginLeft:'40px',position:'relative',top:'-24px'}}>
                      <ul style={{listStyle:'none',padding:'0',width:200}}>
                      <li style={{lineHeight:'24px'}}><b>姓名: </b>{this.state.toCheckFront.person}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前部门名: </b>{this.state.toCheckFront.depart}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前职务名: </b>{this.state.toCheckFront.jobName}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前级别: </b>{this.state.toCheckFront.level}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前主管: </b>{this.state.toCheckFront.driectorName}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前项目代码: </b>{this.state.toCheckFront.proj_code}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前BU CODE: </b>{this.state.toCheckFront.bucode}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前一级部门: </b>{this.state.toCheckFront.firstDepart}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前二级部门: </b>{this.state.toCheckFront.secondDepart}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前三级部门: </b>{this.state.toCheckFront.thirdDepart}</li>
                      <li style={{lineHeight:'24px'}}><b>变更前四级部门: </b>{this.state.toCheckFront.fourthDepart}</li>
                      </ul>
                    </div>
                {this.state.toCheckFront.ApproveRemark?
                (<><br/><b>审批说明:</b>
                  <p>{this.state.toCheckFront.ApproveRemark}</p></>)
                :null}
                 <div style={{float:'left',marginLeft:'40px',position:'relative',top:'-24px'}}>
                
                <b>是否有Headcount：</b><span>{this.state.toCheckFront.C3_637425449725?this.state.toCheckFront.C3_637425449725:'--'}</span>
                <div style={{clear:'both'}}></div>
                <b>Headcount变更类型：</b><span>{this.state.toCheckFront.C3_637425577105?this.state.toCheckFront.C3_637425577105:'--'}</span>
                <div style={{clear:'both'}}></div>
                <b>替代人：</b><span>{this.state.toCheckFront.C3_637617454519?this.state.toCheckFront.C3_637617454519:'--'}</span>
                <div style={{clear:'both'}}></div>
                <b>招聘人员备注：</b><span>{this.state.toCheckFront.C3_637425470106?this.state.toCheckFront.C3_637425470106:'--'}</span>
                <div style={{clear:'both'}}></div>
                <b>招聘人员确认人姓名：</b><span>{this.state.toCheckFront.C3_637425935795?this.state.toCheckFront.C3_637425935795:'--'}</span>
                <div style={{clear:'both'}}></div>
              </div>
                </Spin>
                </div>
            </div>
            </div>
          </div>
        </Modal>
        <div className='sider'>
                <p className={this.state.selection=='1'?'current':null} onClick={()=>{this.setState({selection:'1',cms:`C3_634660565837 = 'Waiting' and C3_634660565295 = '${this.state.userId}'`})}}>未审批</p>
                <p className={this.state.selection=='2'?'current':null} onClick={()=>{this.setState({selection:'2',cms:`C3_634660565837 = 'Y' and C3_634660565295 = '${this.state.userId}'`})}}>已审批通过</p>
                <p className={this.state.selection=='3'?'current':null} onClick={()=>{this.setState({selection:'3',cms:`C3_634660565837 = 'N' and C3_634660565295 = '${this.state.userId}'`})}}>已审批未通过</p>
                {/* <p className={this.state.selection=='4'?'current':null} onClick={()=>{this.setState({selection:'4',cms:'all'})}}>全部</p> */}
              </div>
              <div style={{float:'left',width:'calc(100% - 144px)',marginLeft:'24px',height:'calc(100vh - 60px)'}}>
             
              <TableData
                  resid={this.state.selection=='1'?'637176902794':'634660498796'}
                  cmswhere={this.state.cms}
                  hasRowView={false}
                  hasAdd={false}
                  hasRowSelection={this.state.selection=='1'?true:false}
                  refTargetComponentName="TableData"
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  hasRowDelete={false}
                  hasRowModify={false}
                  hasModify={false}
                  hasDelete={false}
                  style={{ height: '100%'}}
                  hasRowView={false}
                  actionBarWidth={100}
                  actionBarFixed={true}
                  actionBarExtra={({ dataSource, selectedRowKeys }) => {
                    return (
                      this.state.selection=='1'?
                      <Button type='primary' disabled={!(selectedRowKeys.length>0)} onClick={()=>{this.approveGroup(dataSource,selectedRowKeys)}}>审批</Button>
                      
                      :null
                    );
                  }}
                  customRowBtns={[
                    record => {
                      return (
                        <Button
                          onClick={() => {
                            this.showOverlay(record);
                          }}
                        >
                          {this.state.cms==`C3_634660565837 = 'Waiting' and C3_634660565295 = '${this.state.userId}'`?'审批':'确认信息'}
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


 export default  IDLTransferVerifyAction;