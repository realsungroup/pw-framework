import React, { Component } from 'react';
import {Steps,Button,Icon,Select,Input,Tabs,Spin,TreeSelect} from 'antd';
import './IDLTransfer.less';
import TableData from '../../common/data/TableData';
import http from 'Util20/api';

const { Option } = Select;
const { TabPane } = Tabs;

const { Step } = Steps;
 class  IDLTransfer extends  Component{
   constructor(props){
    super(props);
    this.state ={
      step:0,//申请步骤
      selectedRecord:[],//选中的人
      hint:'关于张三的转岗申请已经提交成功。',//提交结果提示
      page:'1',//tab页
      result:'error',//是否提交成功
      selection:'1',//申请记录筛选选择
      cms:`C3_464172157606 = '女'`,//申请记录筛选条件
      checkPoint:[['原部门主管','张三'],['原部门经理','李四']],//需要审批的节点
      isSub:false,//是否已经提交过申请
      loading:false,
      department:[],//部门数据,
      company:[{name:'无锡',value:'100'},{name:'上海',value:'2000'}],//公司数据，
      companyV:'100',
      depaV:null
    };
   }
   componentDidMount(){
     this.getDepartment('100');
   }
   
   getDepartment = async(v)=>{
     this.setState({department:[],loading:true});
    var res='';
    try{
      res = await http().getTable({
        resid: 632327119162,
        cmswhere:`C3_419448448137 = '${v}'`
      });
      var n=0;
      var obj=res.data;
      var arr=[];
      // 设置arr初始值
      n=0;
      while(n<obj.length){
      if(obj[n].C3_417731575935!='Y'&&(obj[n].C3_419448436728)){
        //一级部门C3_461011945566
        //二级部门C3_461011949004
        //三级部门C3_461011961036
        //四级部门C3_461011968036
        var level=0;
        if(obj[n].C3_461011961036==obj[n].DEP_ID){
          level=3;
        }else if(obj[n].C3_461011949004==obj[n].DEP_ID){
          level=2;

        }else if(obj[n].C3_461011945566==obj[n].DEP_ID){
          level=1;
          
        }else if(obj[n].C3_461011968036==obj[n].DEP_ID){
          level=4
        }
        arr.push({
          title:obj[n].DEP_NAME,
          value:obj[n].DEP_ID,
          key:obj[n].DEP_ID,
          level:level,
          C3_461011945566:obj[n].C3_461011945566,
          C3_461011949004:obj[n].C3_461011949004,
          C3_461011961036:obj[n].C3_461011961036,
          C3_461011968036:obj[n].C3_461011968036,
        })
      }
        n++;
      }
      obj=[];
      var obj1=[];
      var obj2=[];
      var obj3=[];
      var obj4=[];
      n=0;
      while(n<arr.length){
        if(arr[n].level==0){
          obj.push(arr[n]);
        }else if(arr[n].level==1){
          obj1.push(arr[n]);
        }else if(arr[n].level==2){
          obj2.push(arr[n]);
        }else if(arr[n].level==3){
          obj3.push(arr[n]);
        }else if(arr[n].level==4){
          obj4.push(arr[n]);
        }
        n++;
      }
      var c;
      n=0;
      while(n<obj3.length){
        c=0;
        while(c<obj4.length){
          if(obj3[n].value==obj4[c].C3_461011961036){

            if(obj3[n].children){
              obj3[n].children.push(obj4[c]);
            }else{
              obj3[n].children=[obj4[c]];
            }
          }
          c++;
        }
        n++;
      }
      n=0;
      while(n<obj2.length){
        c=0;

        while(c<obj3.length){
          if(obj2[n].value==obj3[c].C3_461011949004){

            if(obj2[n].children){
              obj2[n].children.push(obj3[c]);
            }else{
              obj2[n].children=[obj3[c]];
            }
          }
          c++;
        }
        n++;
      }
      n=0;
      while(n<obj1.length){
        c=0;

        while(c<obj2.length){

          if(obj1[n].value==obj2[c].C3_461011945566){
            if(obj1[n].children){
              obj1[n].children.push(obj2[c]);
            }else{
              obj1[n].children=[obj2[c]];
            }
          }
          c++;
        }
        n++;
      }
      n=0;
      while(n<obj.length){
        c=0;

        while(c<obj1.length){
          if(obj[n].value==obj1[c].C3_461011961036){
            if(obj[n].children){
              obj[n].children.push(obj1[c]);
            }else{
              obj[n].children=[obj1[c]];
            }
          }
          c++;
        }
        n++;
      }
      this.setState({loading:false,department:obj1});

    }catch(e){
      this.setState({loading:false});
      console.log(e)}
   }
   onChange = value => {
    console.log(value);
    this.setState({ depaV:value });
  };
  handleChange = (v) =>{
    this.setState({companyV:v,depaV:null});
    this.getDepartment(v);
  }
   subData = async() =>{
      this.setState({step:2,isSub:true})
   }
   callBack = (k) =>{
    this.setState({page:k,isSub:false})
   }
   render(){
     return (
       <div className='IDLTransfer'>
         <Tabs activeKey={this.state.page} onChange={(k)=>this.callBack(k)}>
          <TabPane tab="发起新的申请" key="1">
            <div className='wrap' style={{padding:'16px'}}>
            <Steps current={this.state.step} style={{width:'100%',cursor:'default'}}>
              <Step title="选择调动人员" />
              <Step title="填写调岗申请单" />
              <Step title="查看提交结果" />
            </Steps>
            {
              this.state.step==0?(
              <Spin style={{width:'100%',height:'100%'}}spinning={this.state.loading}>
              <div className='sider focusWindow' style={{width:'200px',paddingRight:'24px',marginTop:'24px',height:'calc(100vh - 132px)'}}>
                请选择公司:
                <Select value={this.state.companyV} onChange={(v)=>this.handleChange(v)} defaultValue='100' style={{ width: '100%',marginBottom:'8px',marginTop:'8px' }}>
                  {
                    this.state.company.map(item=>{return(
                    <Option value={item.value}>{item.name}</Option>

                    )})
                  }
                </Select>               
                请选择部门:
                <TreeSelect
                  style={{ width: '100%',marginTop:'8px' }}
                  value={this.state.depaV}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.state.department}
                  placeholder="请先选择部门"
                  showSearch={true}
                  searchPlaceholder='输入部门编号搜索'
                  // treeDefaultExpandAll
                  onChange={this.onChange}
                />
              </div>
              <footer>
                <Button type='primary' onClick={()=>this.setState({step:1})}>下一步</Button>
              </footer>
              </Spin>
              ):null
            }
            {
              this.state.step==1?(<footer>
                <Button onClick={()=>this.setState({step:0})}>上一步</Button>
                <Button style={this.state.isSub?{}:{display:'none'}} type='primary' onClick={()=>this.setState({step:2})}>下一步</Button>
                <Button style={!this.state.isSub?{}:{display:'none'}} type='primary' onClick={()=>this.subData()}>提交</Button>
              </footer>):null
            }
            {
              this.state.step==2?(
                <div className='result'>
                  {this.state.result=='success'?<Icon type="check-circle" theme="filled" style={{color:'#52c41a'}}/>:
                  <Icon type="close-circle" theme="filled" style={{color:'#f5222d'}}/>
                  }
                 
                  <h2>{this.state.hint}</h2>
                  {this.state.result=='success'?(<>
                  <p>本次申请需要以下人员审批：</p>
                  <ul>
                    {this.state.checkPoint.map(item =>{return(
                    <li><b>{item[0]}：</b><span>{item[1]}</span></li>
                     ) })}
                  </ul>
              </>):null}
                  {this.state.result=='success'?<><Button style={{marginRight:'16px',width:'120px'}} onClick={()=>{this.setState({step:0,isSub:false})}}>再申请一人</Button>
                  <Button style={{marginRight:'16px',width:'120px'}} onClick={()=>{this.setState({step:0,page:'2',isSub:false})}} type='primary'>查看申请记录</Button></>:<>
                  <Button style={{marginRight:'16px',width:'120px'}} onClick={()=>{this.setState({step:1})}}>返回查看</Button>
                  <Button style={{marginRight:'16px',width:'120px'}} onClick={()=>{this.setState({step:2})}} type='primary'>再试一次</Button>
                  </>}
                  
                </div>
              ):null
            }
            </div>
          </TabPane>
          <TabPane tab="查看申请记录" key="2">
            <div className='wrap' >
              <div className='sider'>
                <p className={this.state.selection=='1'?'current':null} onClick={()=>{this.setState({selection:'1',cms:`C3_464172157606 = '女'`})}}>审核中</p>
                <p className={this.state.selection=='2'?'current':null} onClick={()=>{this.setState({selection:'2'})}}>被退回</p>
                <p className={this.state.selection=='3'?'current':null} onClick={()=>{this.setState({selection:'3'})}}>已通过</p>
                <p className={this.state.selection=='4'?'current':null} onClick={()=>{this.setState({selection:'4',cms:'all'})}}>全部</p>
              </div>
              <div style={{float:'left',width:'calc(100% - 144px)',marginLeft:'24px',height:'100%'}}>
              <TableData
                  resid={464171754083}
                  cmswhere={this.state.cms=='all'?'':this.state.cms}
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