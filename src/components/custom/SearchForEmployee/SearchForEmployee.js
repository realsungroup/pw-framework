import React, { Component } from 'react';
import './SearchForEmployee.less';
import { Select,List, Avatar, Modal, Button, Input, Menu, Icon ,Spin,notification,Tooltip,Popconfirm,Radio} from 'antd';
import http from '../../../util20/api';
import MoveTo from 'moveto';
import ApplayInformnation from '../ApplayInformnation'; //中间申请表的内容
import TableData from '../../common/data/TableData';
import InterviewAssessment from '../InterviewAssessment';
import ReferenceCheck from '../ReferenceCheck';
import OfferLetter from'../OfferLetter';
import { assementForm, referenceCheck } from './config.js'; //面试评估表和背景调查表的配置
import { withRecordForm } from '../../common/hoc/withRecordForm';
 //高阶组件,点击评估详情弹出后台对应不同的窗体需要用到高阶组件withRecordForm
import dealControlArr from '../../../util20/controls'; //处理数据
import { getDataProp } from '../../../util20/formData2ControlsData'; //处理数据

const openNotification = () => {
  notification.open({
    message: 'A new Record has been added!',
    description:
      'Click "Modify" to edit the details.',
    onClick: () => {

    },
  });
};
const { Option } = Select;
const { confirm } = Modal;

// 右侧导航栏列表的清单
const MenuList = [
  {
    label: '个人资料',
    value: '个人资料',
    icon: 'user'
  },
  {
    label: '教育背景',
    value: '教育背景',
    icon: 'trophy'
  },
  {
    label: '工作经历',
    value: '工作经历',
    icon: 'apartment'
  },
  {
    label: '家庭成员关系',
    value: '家庭成员关系',
    icon: 'apartment'
  },
  {
    label: '专业培训',
    value: '专业培训',
    icon: 'usergroup-add'
  },
  {
    label: '相关技能',
    value: '相关技能',
    icon: 'schedule'
  },
  {
    label: '其他',
    value: '其他',
    icon: 'user-add'
  }
];
class SearchForEmployee extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    
	this.getPersonList();
    // 清楚缓存
    http().clearCache();

    var usrChara = localStorage.getItem('userInfo');
    usrChara=JSON.parse(usrChara)
    usrChara=usrChara.UserInfo.GroupList;
    var arr=[];
    var n=0;
    var bol=false;
    var str='';
    while(n<usrChara.length){
      if(usrChara.slice(n, n+1)=="\'"){

        if(bol==true){
          bol=false;
          arr.push(str);
          str='';
        }else{
          bol=true;
        }
      }
      if(bol==true){
        str+=usrChara.slice(n+1, n+2)
      }
      n++;
    }
		// 判别是不是平板用户
	let usrCode = '623876173360'
  n=0;

  while(n<arr.length){
    var j=usrCode+"\'"
    if(j==arr[n]){
      this.setState({userChara:'IDLUser'});
    }
    n++;
  }
  };
  state = {
	showAdd:true,
    showRef:false,
    loading:true,
    personList: [], //人员列表
    currentPersonInfo: {}, //当前选中人员的信息
    currentPersonId: '', //当前选中人员ID
    recordFormName: 'default',
    typeVisible: false,
    activeKey: '工作申请表',
    showAssessment:false,
    curName:'',
    selectedRecord:{}//选中的记录
  };
  // 点击某个人时候设置样式
  handlePersonOnClick = item => {
    this.setState({loading:'true'});
    let { personList, activeKey } = this.state;
    let tempPersonList = [...personList];
    tempPersonList.forEach(item => {
      item.isSelected = false;
    });
    item.isSelected = true;

    // 并获取该人的详细信息
    this.setState({ personList: tempPersonList, currentPersonId: item.ID,curName:item.ChName });
    //
    console.log('id',item.ID,this.state.curName)
    if(activeKey === '工作申请表'){
      this.getPersonalInfo(613149356409,item.ID);
    } else {
      // this.tableDataRef.handleRefresh();
      this.setState({loading:false});
    }


  };
 
  // 人员筛选器
  filtMem=async(v)=>{
    
      this.getPersonList(null,v);

  };
  // 添加面试评估表与背景调查表记录
  addRec = async (resid,key) => {
    this.setState({loading:true});
    var id=this.state.currentPersonId
    let res;
    try {
      res = await http().addRecords({
        resid: resid,
        data:[{ID:id,candidateName:this.state.curName,CandidateName:this.state.curName,CandidateId:id,C3_622921647557:'待通知（初试）'}]
      });
      openNotification();
      this.tableDataRef.handleRefresh();
      this.setState({loading:false});

    } catch (err) {
      console.log(err);
      this.setState({loading:false});

    }
  }
  // 给当前选中的人添加类名控制样式
  getSelectClass = isSelected => {
    if (isSelected) {
      return 'idlindex__content-person__active';
    } else {
      return;
    }
  };
   // 查找data中的REC_ID
   findRec=(id)=>{
    var arr =this.state.personList;
    console.log(arr)
    var n=0;
    while (n<arr.length){
      if(arr[n].ID==id){
        return arr[n].REC_ID;
      }
      n++;
    }
  }
  // 通过审批流
  onPaStream = async(id,rec)=>{
    var rec_id=this.findRec(id);
    confirm({
      title: '求职者可以入职?',
      onOk:() =>
        this.passStr(id,rec_id)
          
      ,
      onCancel() {},
    });

  }
  passStr=async(id,rec)=>{
    let res;
    try {
      res = await http().modifyRecords({
        resid: 613152690063,
        cmswhere: `ID = '${id}'`,
        data:[{
          isPass:'已通过',
          cStatus:'已通过',
          REC_ID:rec
        }]
      });
      this.getPersonList();
      this.setState({loading:false});
      Modal.success({
        title: '提交成功！',
      });
      
    } catch (err) {
      this.setState({loading:false});
      console.log(err);
      Modal.error({
        title: '提交失败！',
        content:err
      })
    }
  
  }
  onFail = async(id,rec)=>{
    var rec_id=this.findRec(id);

    confirm({
      title: '求职者无法入职?',
      onOk:() =>
        this.failStr(id,rec_id)
          
      ,
      onCancel() {},
    });

  }
  // 监听Tabs页的变化
  failStr=async(id,rec)=>{
    let res;
    try {
      res = await http().modifyRecords({
        resid: 613152690063,
        cmswhere: `ID = '${id}'`,
        data:[{
          isPass:'未通过',
          cStatus:'未通过',
          REC_ID:rec

        }]
      });
      this.getPersonList();
      this.setState({loading:false});
      Modal.success({
        title: '提交成功！',
      });
      
    } catch (err) {
      this.setState({loading:false});
      console.log(err);
      Modal.error({
        title: '提交失败！',
        content:err
      })
    }
  }
  handleClick = activeKey => {
    // console.log(activeKey);
    this.setState({
      activeKey
    });
    if(activeKey === '工作申请表'){
      this.setState({loading:true})
      this.getPersonalInfo(613149356409,this.state.currentPersonId);
    }
  };
  // 获取人员列表
  getPersonList = async (key,filter,bol) => {
	  this.setState({loading:true})
	  this.setState({ currentPersonInfo: '' });
	  this.setState({
	    personList: '',
	    currentPersonId: null,
	    curName:''});
	  var usrChara = localStorage.getItem('userInfo');
	      usrChara=JSON.parse(usrChara)
	      usrChara=usrChara.UserInfo.GroupList;
	      var arr=[];
	      var n=0;
	      var bol=false;
	      var str='';
	      while(n<usrChara.length){
	        if(usrChara.slice(n, n+1)=="\'"){
	  
	          if(bol==true){
	            bol=false;
	            arr.push(str);
	            str='';
	          }else{
	            bol=true;
	          }
	        }
	        if(bol==true){
	          str+=usrChara.slice(n+1, n+2)
	        }
	        n++;
	      }
	  // 判别hr角色
	  var hrCode='623876215000';
	      // var hrCode='demo';
	      n=0;
	      this.setState({userChara:'others'});
	  var bol=false;
	      while(n<arr.length){
	        var j=hrCode+"\'"
	        if(j==arr[n]){
	          this.setState({userChara:'HR'});
			  bol=true;
	        }
	        n++;
	      }
		
	  let postID;
	  if(bol==true){
		  postID='613152690063'
	  }else{
		  postID='625315169261'
	  }
    let res;
	
	if(filter){
		console.log('有筛选',filter)
		try {
		  res = await http().getTable({
		    resid: postID,
		    key: key,
			cmswhere: `cStatus = '${filter}'`
		  });
		  console.log('筛选',res)
		  if(res.data.length>0){
			  this.setState({showAdd:true});
		  }else{
			  this.setState({showAdd:false});
		  }
		  if (0 < res.total) {
		    res.data.map(item => {
		      return (item.isSelected = false);
		    });
		    res.data[0].isSelected = true;
		    // console.log(res.data);
        this.getPersonalInfo(613149356409,res.data[0].ID);
        // var arr=res.data;
        // var n=0;
        // while(n<arr.length){
        //   if(arr[n].isPass='未通过'||'已通过'){
        //     arr.splice(n,1)
        //   }
        //   n++;
        // }
		    this.setState({
		      personList: res.data,
		      currentPersonId: res.data[0].ID,
          curName:res.data[0].ChName,
          
		  	loading:false
        });
			console.log(this.state.currentPersonId)
		  } else {
		  	this.setState({loading:false});
			
		    console.log('获取人员列表失败');
		  }
		} catch (err) {
			this.setState({loading:false});
		  console.log(err);
		}
	}else{
		console.log('没有筛选',filter)
		try {
		  res = await http().getTable({
		    resid: postID,
		    key: key,
		  });
		  if(res.data.length>0){
		  			  this.setState({showAdd:true});
		  }else{
		  			  this.setState({showAdd:false});
		  }
		  if (0 < res.total) {
		    res.data.map(item => {
		      return (item.isSelected = false);
		    });
		    res.data[0].isSelected = true;
		    // console.log(res.data);
		    this.getPersonalInfo(613149356409,res.data[0].ID);
		    this.setState({
          personList: res.data,
		      currentPersonId: res.data[0].ID,
		      curName:res.data[0].ChName,
		  	loading:false
        });    
		  } else {
		  	this.setState({loading:false})
		    console.log('获取人员列表失败');
		  }
		} catch (err) {
			this.setState({loading:false});
		  console.log(err);
		}
	}
    // 排序
    this.setState({orgList:this.state.personList})

      this.orderList('default');

  };
  
  // 排序人员列表
  orderList=(v)=>{
      if(v=='default'){
  
        var arr=this.state.personList;
        var arr2=[];
        var n=0;
        while(n<arr.length){
          if((arr[n].isPass=='待通过')||(!arr[n].isPass)){
            arr2.push(arr[n]);
            arr.splice(n,1)
          }
          n++;
        }
        n=0;
        while(n<arr.length){
          
          arr2.push(arr[n]);
          
          n++;
        }
        this.setState({personList:arr2});
      }else if(v=='time'){
        this.setState({personList:this.state.orgList});
  
      }
      n=0;
      while(n<arr2.length){
        arr2[n].isSelected=false;
        n++;
      }
      if(arr2[0]){
        arr2[0].isSelected=true;
        this.getPersonalInfo(613149356409,arr2[0].ID);
		    this.setState({
		      currentPersonId: arr2[0].ID,
		      curName:arr2[0].ChName,
		  	loading:false
        });  
      }

      
    }
    
    
  // 获取当前人员人员详细信息
  getPersonalInfo = async (resid,id) => {
    let res;
    try {
      res = await http().getTable({
        resid: resid,
        cmswhere: `ID=${id}`
      });
      console.log(res)
      this.setState({currentPersonInfo: res.data[0] });
      this.setState({loading:false});
    } catch (err) {
      this.setState({loading:false});
    }
  };
  //获取formData数据
  getFormData = async record => {
    // 1.看懂高阶组件接收的东西，打开一个模态窗。
    let res;
    try {
      res = await http().getFormData({
        resid: 613152706922,
        formname: record.accessCategority
      });

    } catch (err) {
      return console.error(err.message);

    }
    // console.log('获取到窗体的数据', res);
    const formMidData = dealControlArr(res.data.columns);
    // console.log('中间数据', formMidData);
    const terminalData = getDataProp(formMidData, record, false, true); //得到了最终的data
    // console.log('最终的数据', terminalData);
    /**
     *第一步： 在withRecordForm组件中传过来一个方法叫openRecordForm,
     *第二步：this.props.openRecordForm 所接收的参数看文档。
     *第三步:this.props.openRecordForm 其中所接收的一个参数是data,需要从后端取出来然后自己处理，所以回到第1步先处理数据。
     */
    //2.打开这个模态窗
    this.props.openRecordForm({
      title: '面试评估表',
      operation: 'modify',
      formProps: {
        displayMode: 'classify'
      },
      record: record,
      info: {
        dataMode: 'main',
        resid: 613152706922,
        hostrecid: record.REC_ID
      },
      data: terminalData,
      onSuccess: () => {
        alert('success');
      },
      onCancel: () => {
        this.props.closeRecordForm();
      }
    });
  };
  clsAss =()=>{
    this.setState({showAssessment:false});
  }
  handleSearchClick = value => {
    //  console.log(value);
    this.getPersonList(value);
  };
  handleSearchClickID = async value => {
    //  console.log(value);
    if(!value){
      Modal.error({
        title: '请输入身份证号！',
      });
    }else{
    let res;
    try {
		  res = await http().getTable({
		    resid: 613152690063,
		    cmswhere: `IDCardNumber='${value}'`,
		  });
		  if(res.data.length>0){
		  			  this.setState({showAdd:true});
		  }else{
		  			  this.setState({showAdd:false});
		  }
		  if (0 < res.total) {
		    res.data.map(item => {
		      return (item.isSelected = false);
		    });
		    res.data[0].isSelected = true;
		    // console.log(res.data);
		    this.getPersonalInfo(613149356409,res.data[0].ID);
		    this.setState({
		      personList: res.data,
		      currentPersonId: res.data[0].ID,
		      curName:res.data[0].ChName,
		  	loading:false
		    });
		  } else {
		  	this.setState({loading:false})
		    console.log('获取人员列表失败');
		  }
		} catch (err) {
			this.setState({loading:false});
		  console.log(err);
    }
  }
  };
  renderContent = () => {
    let { activeKey, currentPersonInfo, selectedRecord } = this.state;
    // eslint-disable-next-line default-case
    switch (activeKey) {
      case '工作申请表':
        return (
          <React.Fragment>

            <ApplayInformnation personDetail={currentPersonInfo} />
          </React.Fragment>
        );
      case '面试评估表':
        return (
          <rect style={{
            width:'100%',
            background:'#fff'
          }}>
          <div className={this.state.showAssessment?'':'hidden'}>
          <InterviewAssessment record={selectedRecord} clsAss={this.clsAss} data={currentPersonInfo}>
          </InterviewAssessment>
          </div>
			
            <TableData
			resid={this.state.userChara=='HR'?613152706922:624364641591}
              // key={this.state.userChara=='HR'?613152706922:624364641591}
              {...assementForm}
              hasAdd={false}
              hasRowDelete= {this.state.userChara=='HR'?true:false}
              hasRowModify={false}
              style ={{height:"100%"}}
              // cmswhere = {`CandidateId = ${this.state.currentPersonId}`}
              // resid={613152706922}
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              // cmswhere = {`ID = ${this.state.currentPersonId}`}
              // actionBarExtra={( dataSource, selectedRowKeys, data, recordFormData)=>{
              //   return <Button>添加面试官</Button>
              // }}
              actionBarExtra={(this.state.userChara=='HR'&&this.state.showAdd==true)?(records => (
                <Button type='primary' onClick={v => {this.addRec(613152706922)}} style={{margin:'16px'}} >Add a new record</Button>

              )):''}
              customRowBtns={[
                (record, btnSize) => {
                  return (

                    <div>
                      <Button
                        onClick={() => {
                          this.setState({showAssessment:true, selectedRecord:record});

                        }}
                        style={{marginTop:'8px',fontSize:'14px',padding:'0 13px'}}
                      >
                        Modify
                      </Button>

                    </div>
                  );
                }
              ]}
            />

            </rect>
        );
      case '背景调查表':
        return (
          <div style={{width:'100%',background:'#fff'}}>
            <div className={this.state.showRef==true?'':'hidden'}style={{width:'100vw',height:'100vh',background:'#fff',position:'fixed',top:'0',left:'0',zIndex:'999'}}>
              <Icon type="close-circle" style={{zIndex:'1000',cursor:'pointer',position:'fixed',right:'16px',top:'16px'}} onClick={()=>{this.setState({showRef:false})}}/>
              <ReferenceCheck record={selectedRecord}></ReferenceCheck>
            </div>
            <Button onClick={()=>{window.open('http://wux-hr03.china.ads.finisar.com/rispweb/upfiles/Reference Check Letter-HR.doc')}} style={{marginLeft:'8px',marginBottom:'8px'}}>下载模板HR</Button>
            <Button onClick={()=>{window.open('http://wux-hr03.china.ads.finisar.com/rispweb/upfiles/Reference Check Letter-Colleague.doc')}} style={{marginLeft:'8px',marginBottom:'8px'}}>下载模板Colleague</Button>
            <Button onClick={()=>{window.open('http://wux-hr03.china.ads.finisar.com/rispweb/upfiles/Reference Check Letter-Supervisor.doc')}} style={{marginLeft:'8px',marginBottom:'8px'}}>下载模板Supervisor</Button>
            <div style = {{width:"100%",height:"100%"}}>
              <TableData
              {...referenceCheck}
                key={613152614705}
                hasAdd={false}
                hasRowModify={false}
                hasModify={false}
                hasRowView={false}
                customRowBtns={[
                  (record, btnSize) => {
                    return (

                      <div>
                        <Button
                          onClick={() => {
                            this.setState({showRef:true,selectedRecord:record})
                            // this.getFormData(record);

                          }}
                          style={{marginTop:'8px',fontSize:'14px',height:'24px',padding:'0 7px'}}
                        >
                          修改
                        </Button>

                      </div>
                    );
                  }
                ]}
                actionBarExtra={this.state.showAdd==true?(records => (
                    <Button type='primary' onClick={v => {this.addRec(613152614705)}}>新建</Button>
                )):''}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                // cmswhere = {`CandidateId = ${this.state.currentPersonId}`}
              />
            </div>
          </div>
        );
        case '工作邀请函':
          return(
            <div className='offerLetter'>
            <OfferLetter personDetail={this.state.currentPersonId} ></OfferLetter>

            </div>
          )
    }
  };
  // 移动
  hanleMoveTo = id => {
    const moveTo = new MoveTo({
      duration: 365,
      tolerance: 195,
      container: document.querySelector('.applay__informnation')
    });
    // console.log(id);
    const tempid = document.getElementById(id);
    moveTo.move(tempid);
  };
  render() {
    const { personList} = this.state;
    // console.log(currentPersonInfo);
    return (
      <div className="idlindex">
      <Spin spinning={this.state.loading}>

        <div className="idlindex__header">
          <div className="idlindex__header-search">
            {this.state.userChara!='IDLUser'?(<Input.Search
              placeholder="请输入关键词进行搜索"
              onSearch={value => this.handleSearchClick(value)}
            />):(<Input.Search
              placeholder="请输入身份证号码进行搜索"
              onSearch={value => this.handleSearchClickID(value)}
            />)}
          </div>
          <div className="idlindex__header-nav">
            <Menu
              mode="horizontal"
              selectedKeys={[this.state.activeKey]}
              onClick={e => {
                this.handleClick(e.key);
              }}
            >
              <Menu.Item style={{ width: '25%' }} key="工作申请表">
                工作申请表
              </Menu.Item>
              <Menu.Item style={ this.state.userChara!='IDLUser'?{width: '25%' }:{display:'none'}} key="面试评估表">
                面试评估表
              </Menu.Item>
              <Menu.Item style={this.state.userChara=='HR'?{ width: '25%' }:{display:'none'}} key="背景调查表">
                背景调查表
              </Menu.Item>
              <Menu.Item style={this.state.userChara=='HR'?{ width: '25%' }:{display:'none'}} key="工作邀请函" >
                工作邀请函
              </Menu.Item>
            </Menu>
          </div>
        </div>
        <div className="idlindex__content">
          <div className="idlindex__content-person">
            {/* 面试候选人名单 */}
            {this.state.userChara=='IDLUser'?'':(<Select defaultValue="全部" onChange={v=>{this.filtMem(v)}} style={{ width: 'calc(100% - 10px)',marginBottom:'16px'}} >
			      <Option value="">全部</Option>
			      <Option value="待面试评估">待评估面试</Option>
			      <Option value="待背景调查">待背景调查</Option>
			      <Option value="待发送offer">待发送offer</Option>
			      <Option value="未通过">未通过</Option>
			      <Option value="已通过">已通过</Option>
			    </Select>)}
          <div>
      {/* <Radio.Group defaultValue="default" buttonStyle="solid" style={{marginBottom:'8px'}}>
        <Radio.Button value="default" onClick={()=>{this.orderList('default',true)}}>待办优先</Radio.Button>
        <Radio.Button value="time" onClick={()=>{this.orderList('time',true)}}>最近优先</Radio.Button>
      </Radio.Group> */}
    </div>
            <List
              itemLayout="horizontal"
              dataSource={personList}
              renderItem={item => (
                <List.Item
                  className={this.getSelectClass(item.isSelected)}
                  
                >
                  <div style={{position:'relative',cursor:'pointer',zIndex:1,width:'100%'}} onClick={() => {
                    this.handlePersonOnClick(item);
                  }}>
                  <List.Item.Meta
                    
                    title={item.ChName}
                    description={item.appPosition}
                  />
                  </div>
                  <div className={this.state.userChara=='HR'?'':'hidden'}>
                  {(item.isPass=='待通过'||(!item.isPass))?(<Popconfirm placement="right" title={'是否通过面试'} okText="通过" cancelText="未通过"trigger="hover"
                  onConfirm={()=>{this.onPaStream(item.ID,item.REC_ID)}}
                  onCancel={()=>{this.onFail(item.ID)}}
                  >
                  <div style={{ width:'40px',height:'40px',borderRadius:'50%',marginRight:'8px',cursor:'pointer' }}>
                    
                  <Icon type="question-circle"theme='filled'style={{fontSize:'32px',marginTop:'3px',marginLeft:'3px',color:'#ffa940'}}/>
                  </div>
                  </Popconfirm>):null}
                  </div>
                  {item.isPass=='未通过'?(<Tooltip placement="right" title={'该人员未通过本次招聘'}trigger="hover"
                  
                  >
                  <div style={{ width:'40px',height:'40px',borderRadius:'50%',marginRight:'8px',cursor:'pointer' }}>
                    
                  <Icon type="close-circle"theme='filled'style={{fontSize:'32px',marginTop:'3px',marginLeft:'3px',color:'#ff4d4f'}}/>
                  </div>
                  </Tooltip>):null}
                  {item.isPass=='已通过'?(<Tooltip placement="right" title={'该人员已通过本次招聘'}trigger="hover"
                  
                  >
                  <div style={{ width:'40px',height:'40px',borderRadius:'50%',marginRight:'8px',cursor:'pointer' }}>
                    
                  <Icon type="check-circle"theme='filled'style={{fontSize:'32px',marginTop:'3px',marginLeft:'3px',color:'#73d13d'}}/>
                  </div>
                  </Tooltip>):null}
                </List.Item>
              )}
            />
          </div>
          <div className="idlindex__content-form">{this.renderContent()}</div>
        </div>
        </Spin>
      </div>
    );
  }
}
export default withRecordForm()(SearchForEmployee);
