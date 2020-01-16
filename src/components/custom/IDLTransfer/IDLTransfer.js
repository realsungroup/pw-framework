import React, { Component } from 'react';
import {Steps,Button,Icon,Select,Input,Tabs,Spin,TreeSelect,Modal, DatePicker} from 'antd';
import './IDLTransfer.less';
import TableData from '../../common/data/TableData';
import http from 'Util20/api';
import moment from 'moment';

const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;
 class  IDLTransfer extends  Component{
   constructor(props){
    super(props);
    this.state ={
      depaOrg:null,//部门的原始数据
      step:0,//申请步骤
      selectedRecord:[],//选中的人
      hint:'关于张三的转岗申请已经提交成功。',//提交结果提示
      page:'1',//tab页
      result:'success',//是否提交成功
      selection:'1',//申请记录筛选选择
      cms:`status = '审核中'`,//申请记录筛选条件
      checkPoint:[['原部门主管','张三'],['原部门经理','李四']],//需要审批的节点
      isSub:false,//是否已经提交过申请
      loading:false,
      department:[],//部门数据,
      company:[{name:'无锡',value:'100'},{name:'上海',value:'2000'}],//公司数据，
      companyV:'100',//选中的公司值
      depaV:null,//选中的部门值
      selectMem:[],//选中的人员
      searchDepaV:false,//搜索部门模态框是否可见
      searchSuperV:false,//搜索主管模态框是否可见
      newDepa:{},//新部门信息
      newSuper:{},//新主管信息
      job:'',//新职位
      searchJobV:false,//搜索职位模态框是否可见
      lvList:[],//级别下拉选择列表
      lv:'',//级别
      proId:'',//项目代码
      bucode:'',
      changeType:'',//变更类型
      activeDate:'',//生效日期
      depaSele:[{
        C3_461011945566:'',
        C3_461011949004:'',
        C3_461011961036:'',
        C3_461011968036:''
      }],//原部门的一级部门二级部门三级部门四级部门的数据
      changeReason:'',//变动原因,
      depaFilter:'菲尼萨光电通讯科技(无锡)有限公司',//选择部门时的公司筛选
    };
   }
   componentDidMount(){
     this.getLv();
     this.getDepartment('100');
   }
   //获取申请人信息
   getAppInfo=()=>{
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    var usercode=userInfo.UserInfo.EMP_USERCODE;
    return usercode;
   }
   //获取级别信息
   getLv=async()=>{
     this.setState({loading:true});
    var res='';
    try{
      res = await http().getTable({
        resid: 449335746776,
      });
      var n=0;
      var arr=[];
      while (n<res.data.length){
        arr.push({value:res.data[n].C3_449335790387,key:res.data[n].C3_449335790387})
        n++;
      }
      this.setState({lvList:arr,loading:false});
    }catch(e){
      this.setState({loading:false})
      console.log(e)
    }
   }
  //  获取部门的树的数据并整理数据
   getDepartment = async(v)=>{
     this.setState({department:[],loading:true});
    var res='';
    try{
      res = await http().getTable({
        resid: 632327119162,
        cmswhere:`C3_419448448137 = '${v}'`
      });
      this.setState({depaOrg:res.data})
      console.log(res.data)
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
  // 第一页切换部门
   onChange = value => {
    this.setState({ depaV:value ,selectMem:[]});
  };
  // 第一页切换公司
  handleChange = (v) =>{
    this.setState({companyV:v,depaV:null});
    this.getDepartment(v);
  }
  // 向后台提交数据
   subData = async() =>{
     this.setState({loading:true});
      var toSub=[];
      var n=0;
      var date=this.state.activeDate;
      date=moment().format('YYYY-MM-DD');
      var usercode = this.getAppInfo();
      while (n<this.state.selectMem.length){
        var obj={
          effortDate:date,//生效日期
          changeReason:this.state.changeType,//变动类型
          nDepartCode:this.state.newDepa.DEP_ID,//变动后部门编号
          nDept_code:this.state.proId,//变动后项目代码
          nDriectorCode:this.state.newSuper.C3_305737857578,//变动后主管编号
          nJobCode:this.state.job.C3_417821542057,//变动后职务编号
          nLevel:this.state.lv,//变动后级别
          nBuCode:this.state.bucode,//变动后bucode

          personID:this.state.selectMem[n].C3_305737857578,//人员编号
          applyPersonId:usercode,//申请人编号
          changeReason:this.state.changeReason,//变动原因
          subApply:'Y',//提交状态
        }
        toSub.push(obj);
        n++;
      }

      var res;
      try{
        res = await http().addRecords({
          resid: 632255761674,
          data:toSub
        });
        this.setState({loading:false,result:'success'});

        console.log(res);
      }catch(e){
        this.setState({loading:false,result:'error'});
        console.log(e)
      }
      console.log(toSub)
      this.setState({step:2,isSub:true})
   }
  //  翻tab
   callBack = (k) =>{
    this.setState({page:k,isSub:false})
   }
  //  第一页跳转第二页
   subMemData = (dataSource, selectedRowKeys) =>{
    var data=[];
    dataSource.map(item => {
      if (selectedRowKeys.includes(item.REC_ID)) {
        data.push(item);
      }
    });
    var data2=[]
    // 存部门的第一部门第二部门第三部门第四部门
    var arr=[this.state.depaV];
    this.state.depaOrg.map(item => {
      if (arr.includes(item.DEP_ID)) {
        data2.push(item);
      }
    });console.log(data2)
    this.setState({selectMem:data,step:1,depaSele:data2})
   }
  //  关闭部门查询模态框
   clzDepaSearch=()=>{
     this.setState({searchDepaV:false})
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
              <div className={this.state.depaV?'sider load':'load sider focusWindow'} style={{width:'200px',paddingRight:'24px',marginTop:'24px',height:'calc(100vh - 132px)'}}>
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
                  onChange={this.onChange}
                />
              </div>
              </Spin>
              ):null
            }
            {
              this.state.step==0&&this.state.depaV?
              (
                <div className='load' style={{float:'left',width:'calc(100% - 224px)',marginLeft:'24px',marginTop:'24px',height:'calc(100% - 64px)'}}>
                  <TableData
                    resid={609599795438}
                    hasRowView={false}
                    hasAdd={false}
                    cmswhere={`HRUSER_DEPID = '${this.state.depaV}'`}
                    hasRowSelection={false}
                    hasRowDelete={false}
                    hasRowModify={false}
                    hasModify={false}
                    hasDelete={false}
                    style={{ height: '100%'}}
                    hasRowView={false}
                    hasRowSelection={true}
                    actionBarExtra={({ dataSource, selectedRowKeys }) => {
                      return (
                        <Button type='primary' disabled={!(selectedRowKeys.length>0)} onClick={()=>{this.subMemData(dataSource,selectedRowKeys)}}>下一步</Button>
                      );
                    }}
                  />
                </div>
              )
              :null
            }
            {
              this.state.step==1?(
                <Spin spinning={this.state.loading}>
              <div style={{width:'100%',height:'calc(100vh - 156px)',position:'relative'}} className='load'>
                
                <div className='form'>
                  
                  <h3>变更后：</h3>
                  <b>生效日期：</b>
                  <span style={{width:'auto'}}>

                  <DatePicker
                    value={this.state.activeDate}
                    onChange={(v)=>this.setState({activeDate:v})}
                  />
                  </span>
                  <br/>
                  <br/>
                  <b>变更类型：</b>
                  <span style={{width:'auto'}}>
                  <Select placeholder='请选择变更类型' style={{ width: 240 }} value={this.state.changeType} onChange={(v)=>{this.setState({changeType:v})}}>

                    <Option value='部门变更' key='0'>部门变更</Option>
                    <Option value='汇报关系变更' key='1'>汇报关系变更</Option>
                    <Option value='价格变更' key='2'>价格变更</Option>
                    <Option value='职位变更' key='3'>职位变更</Option>


                  </Select>
                  </span>
                  <br/>
                  <br/>
              <b style={this.state.newDepa.C3_419339113187?{}:{color:'#f5222d'}}>变更后部门代码：</b><span style={{width:'248px',marginRight:'16px',minWidth:'0'}}>{this.state.newDepa.C3_419339113187?this.state.newDepa.C3_419339113187:<span style={{color:'#f5222d'}}>请点击右侧按钮选择部门</span>}</span>
                  <Button icon="search" onClick={()=>this.setState({searchDepaV:true})}>选择部门</Button>
                  <div>
                  <b>变更后部门名：</b><span>{this.state.newDepa.DEP_NAME?this.state.newDepa.DEP_NAME:'- -'}</span>
                  <b>变更后部门英文名：</b><span>{this.state.newDepa.DEP_NAME_EN?this.state.newDepa.DEP_NAME_EN:'- -'}</span>
                  <b>变更后一级部门名：</b><span>{this.state.newDepa.C3_461011984661?this.state.newDepa.C3_461011984661:'- -' }</span>
                  {/* <b>变更后一级部门代码：</b><span>{this.state.newDepa.DEP_NAME}</span> */}
                  <b>变更后二级部门名：</b><span>{this.state.newDepa.C3_461011984896?this.state.newDepa.C3_461011984896:'- -' }</span>
                  {/* <b>变更后二级部门代码：</b><span>{this.state.newDepa.DEP_NAME}</span>  */}
                  <b>变更后三级部门名：</b><span>{this.state.newDepa.C3_461011985099?this.state.newDepa.C3_461011985099:'- -' }</span>
                  {/* <b>变更后三级部门代码：</b><span>{this.state.newDepa.DEP_NAME}</span> */}
                  <b>变更后四级部门名：</b><span>{this.state.newDepa.C3_461011985365?this.state.newDepa.C3_461011985365:'- -' }</span>
                  {/* <b>变更后四级部门代码：</b><span>{this.state.newDepa.DEP_NAME}</span> */}
                  </div>
                  <b >变更后项目代码：</b>
                  <Input value={this.state.proId} onChange={(v)=>{this.setState({proId:v.target.value})}}/>
                  <br/>
                  <br/>
                  <b>变更后主管：</b><span style={{minWidth:'248px',marginRight:'16px',minWidth:'0'}}>{this.state.newSuper.C3_227192484125?(this.state.newSuper.C3_227192484125+' - '+this.state.newSuper.C3_305737857578):<span style={{color:'#f5222d'}}>请点击右侧按钮选择主管</span>}</span>
                  <Button icon="search" onClick={()=>this.setState({searchSuperV:true})}>选择主管</Button>
                  <br/>
                  <br/>

                  <b>变更后职位：</b>
                  <span style={{minWidth:'248px',marginRight:'16px',minWidth:'0'}}>{this.state.job?(this.state.job.C3_417736870556+'/'+this.state.job.C3_417736857223+' - '+this.state.job.C3_417821542057):<span style={{color:'#f5222d'}}>请点击右侧按钮选择职位</span>}</span>
                  <Button icon="search" onClick={()=>this.setState({searchJobV:true})}>选择职位</Button>
                  
                  <br/>
                  <br/>

                  <b>变更后级别：</b>
                  <span style={{width:'auto'}}>
                  <Select placeholder='请选择级别' style={{ width: 240 }} value={this.state.lv} onChange={(v)=>{this.setState({lv:v})}}>
                    {this.state.lvList.map((item)=>{return(
                    <Option value={item.value} key={item.key}>{item.value}</Option>

                    )})}
                  </Select>
                  </span>
                  <br/>
                  <br/>

                  <b>bucode：</b>
                  <Input value={this.state.bucode} onChange={(v)=>{this.setState({bucode:v.target.value})}}/>
                  <br/>
                  <br/>
                    <b style={{width:'auto'}}>变动原因：({this.state.changeReason.length}/500字)</b>
                  <Input.TextArea maxLength={500} style={{resize:'none'}} value={this.state.changeReason} onChange={(v)=>{this.setState({changeReason:v.target.value})}}/>
                </div>
                <div className='memberList'>
                  <h3>变更前部门：</h3>
                  <div>
                    <b>一级部门：</b><span>{this.state.depaSele[0]?this.state.depaSele[0].C3_461011984661:'- -'}</span>
                    <b>二级部门：</b><span>{this.state.depaSele[0]?this.state.depaSele[0].C3_461011984896:'- -'}</span>
                    <b>三级部门：</b><span>{this.state.depaSele[0]?this.state.depaSele[0].C3_461011985099:'- -'}</span>
                    <b>四级部门：</b><span>{this.state.depaSele[0]?this.state.depaSele[0].C3_461011985365:'- -'}</span>
                  </div>
                  <h3>待变更人员：<b>{this.state.selectMem.length}</b></h3>
                  <ul>
                    {this.state.selectMem.map((item,key)=>{return(
                      <li>
                      <h4>{key+1}</h4>
                      <p>
                      <b>姓名：</b><span>{item.C3_227192484125}</span>
                      </p>
                      <p>
                      <b>英文名：</b><span>{item.C3_419343735913}</span>
                      </p>
                      <p><b>工号：</b><span>{item.C3_448032387764}</span></p>
                      
                      <p><b>当前主管：</b><span>{item.C3_417993433650}</span></p>
                      
                    <p><b>当前职位：</b><span>{item.C3_417990929305}</span></p>
                      
                      <p><b>当前级别：</b><span>{item.C3_587728697204}</span></p>
                      
                    </li>
                    )})}
                  </ul>
                </div>
                <Modal
                  title="部门列表"
                  visible={this.state.searchDepaV}
                  footer={null}
                  onCancel={this.clzDepaSearch}
                  width={'80vw'}
                  height={'80vh'}
                >
                   <Select placeholder='请选择级别' style={{ width: 240 }} value={this.state.depaFilter} onChange={(v)=>{this.setState({depaFilter:v})}}>
                   <Option value='菲尼萨光电通讯科技(无锡)有限公司' key='0'>菲尼萨光电通讯科技(无锡)有限公司</Option>
                    <Option value='菲尼萨光电通讯(上海)有限公司' key='1'>菲尼萨光电通讯(上海)有限公司</Option>
                  </Select>
                  <br/>
                  <br/>
                  <div style={{width:'100%',height:'calc(80vh - 104px)',position:'relative'}}>
                   <TableData
                  resid={632327119162}
                  cmswhere={`C3_419339113187 != '' and C3_419448436728 = '${this.state.depaFilter}'`}
                  hasRowView={false}
                  subtractH={220}
                  hasAdd={false}
                  hasRowSelection={false}
                  hasRowDelete={false}
                  hasRowModify={false}
                  hasModify={false}
                  hasDelete={false}
                  style={{ height: '100%'}}
                  hasRowView={false}
                  customRowBtns={[
                    (record) => {
                      return (
                        <Button onClick={()=>{this.setState({newDepa:record,searchDepaV:false})}}>选择</Button>
                      );
                    }
                  ]}
                />
                </div>
                </Modal>
                <Modal
                  title="人员列表"
                  visible={this.state.searchSuperV}
                  footer={null}
                  onCancel={()=>{this.setState({searchSuperV:false})}}
                  width={'80vw'}
                  height={'80vh'}
                >
                  <div style={{width:'100%',height:'calc(80vh - 104px)',position:'relative'}}>
                   <TableData
                  resid={609599795438}
                  hasRowView={false}
                  subtractH={220}
                  hasAdd={false}
                  hasRowSelection={false}
                  hasRowDelete={false}
                  hasRowModify={false}
                  hasModify={false}
                  hasDelete={false}
                  style={{ height: '100%'}}
                  hasRowView={false}
                  customRowBtns={[
                    (record) => {
                      return (
                        <Button onClick={()=>{this.setState({newSuper:record,searchSuperV:false})}}>选择</Button>
                      );
                    }
                  ]}
                />
                </div>
                </Modal>
                <Modal
                  title="职位列表"
                  visible={this.state.searchJobV}
                  footer={null}
                  onCancel={()=>{this.setState({searchJobV:false})}}
                  width={'80vw'}
                  height={'80vh'}
                >
                  <div style={{width:'100%',height:'calc(80vh - 104px)',position:'relative'}}>
                   <TableData
                  resid={417736675691}
                  hasRowView={false}
                  subtractH={220}
                  hasAdd={false}
                  hasRowSelection={false}
                  hasRowDelete={false}
                  hasRowModify={false}
                  hasModify={false}
                  hasDelete={false}
                  style={{ height: '100%'}}
                  hasRowView={false}
                  customRowBtns={[
                    (record) => {
                      return (
                        <Button onClick={()=>{this.setState({job:record,searchJobV:false})}}>选择</Button>
                      );
                    }
                  ]}
                />
                </div>
                </Modal>
                <footer>
                  <Button onClick={()=>this.setState({step:0})}>上一步</Button>
                  <Button style={this.state.isSub?{}:{display:'none'}} type='primary' onClick={()=>this.setState({step:2})}>下一步</Button>
                  <Button style={!this.state.isSub?{}:{display:'none'}} type='primary' onClick={()=>this.subData()}>提交</Button>
                </footer>
              </div>
              </Spin>
              ):null
            }
            {
              this.state.step==2?(
                <div className='result'>
                  {this.state.result=='success'?<Icon type="check-circle" theme="filled" style={{color:'#52c41a'}}/>:
                  <Icon type="close-circle" theme="filled" style={{color:'#f5222d'}}/>
                  }
                 
                  <h2>{this.state.hint}</h2>
                  {/* {this.state.result=='success'?(<>
                  <p>本次申请需要以下人员审批：</p>
                  <ul>
                    {this.state.checkPoint.map(item =>{return(
                    <li><b>{item[0]}：</b><span>{item[1]}</span></li>
                     ) })}
                  </ul>
              </>):null} */}
                  {this.state.result=='success'?<><Button style={{marginRight:'16px',width:'120px'}} onClick={()=>{this.setState({step:0,isSub:false})}}>再申请一人</Button>
                  <Button style={{marginRight:'16px',width:'120px'}} onClick={()=>{this.setState({step:0,page:'2',isSub:false})}} type='primary'>查看审批记录</Button></>:<>
                  <Button style={{marginRight:'16px',width:'120px'}} onClick={()=>{this.setState({step:1})}}>返回查看</Button>
                  <Button style={{marginRight:'16px',width:'120px'}} onClick={()=>{this.setState({step:2})}} type='primary'>再试一次</Button>
                  </>}
                  
                </div>
              ):null
            }
            </div>
          </TabPane>
          <TabPane tab="查看审批记录" key="2">
            <div className='wrap' >
              <div className='sider'>
                <p className={this.state.selection=='1'?'current':null} onClick={()=>{this.setState({selection:'1',cms:`status = '审核中'`})}}>审核中</p>
                <p className={this.state.selection=='2'?'current':null} onClick={()=>{this.setState({selection:'2',cms:`status = '被拒绝'`})}}>被拒绝</p>
                <p className={this.state.selection=='3'?'current':null} onClick={()=>{this.setState({selection:'3',cms:`status = '已通过'`})}}>已通过</p>
                <p className={this.state.selection=='4'?'current':null} onClick={()=>{this.setState({selection:'4',cms:'all'})}}>全部</p>
              </div>
              <div style={{float:'left',width:'calc(100% - 144px)',marginLeft:'24px',height:'100%'}}>
              <TableData
                  resid={632314958317}
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