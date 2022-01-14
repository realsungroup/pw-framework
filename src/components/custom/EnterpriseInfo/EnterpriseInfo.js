import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, message,Popconfirm, Modal,Icon ,Spin,Tabs,Input,Select} from 'antd';
import './EnterpriseInfo.less';
import moment from 'moment';
import http from '../../../util20/api';
import TextArea from 'antd/lib/input/TextArea';
const TabPane = Tabs.TabPane;
const formData=[
  {
    id:'enterpriseName',
    name:'企业名称'
  },
  {
    id:'enterpriseAddress',
    name:'企业地址'
  },{
    id:'enterpriseHR',
    name:'企业（人力资源部门）联系人'
  },{
    id:'enterprisePhone',
    name:'联系人手机号码（电话）'
  },{
    id:'introduction',
    name:'简介',
    type:'textarea'
  }
  ,{
    id:'laowu',
    name:'劳务公司名',
  }
  ,{
    id:'logo',
    name:'logo',
    type:'img'
  }
]
const { Option } = Select;
const enterpriseInfoId=695213315996;
const jobListId=695212874956;
const imgListId=695211797012;
const periodId=695485129013;

class EnterpriseInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  
  state={
    showJobDetail:false,
    imgList:[],
    currentImage:{recid:''},
    enterpriseInfo:{
      activatedRules:''
    },
    canEditTime:[],
    expand:false,
    currentJob:{
      job:'',
      enterpriseRecid:'',
      activated:'',
      number:'',
      salary:'',
      dormitory:'',
      jobAddress:''
    }
  }
  handleChange=(v,id)=>{
    let o =this.state.enterpriseInfo;
    o[id]=v;
    this.setState({enterpriseInfo:o});
  }
  componentDidMount=async()=>{
    let bol = await this.getEditDate();
    if(bol){
      this.getEnterpriseInfo();
      this.getImgList();
    }
  }
  getEditDate=async()=>{
    try{
      let res = await http().getTable({
        resid:periodId
      });
      let myTime=new Date();
      myTime=moment(myTime).format();
      let n=0;
      let bol=false;
      let arr=[]
      while(n<res.data.length){
            let stTime=moment(res.data[n].stTime).format();
            let edTime=moment(res.data[n].edTime).format();
            if(myTime>=stTime&&myTime<=edTime){
              bol=true;
            }
            arr.push({stTime:moment(stTime).format('YYYY-MM-DD HH:SS:MM'),edTime:moment(edTime).format('YYYY-MM-DD HH:SS:MM')})
        n++;
      };
      this.setState({loading:false,canEditTime:arr});
      if(bol){
        this.setState({canEdit:true});
        return true
      }else{
      this.setState({loading:false,expand:true});
        return false
      }
      
    }catch(e){
      console.log(e.message);
      return false
    }
  }
  uploadFile = (file, url, mode) => {
    return new Promise((resolve, reject) => {
      let fd = new FormData();
      fd.append('file', file, file.name);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.onload = () => {
        const data = JSON.parse(xhr.response);
        if (xhr.status === 200 && (data.error === 0 || data.error === '0')) {
          let imgUrl;
          if (mode === 'local') {
            imgUrl = data.httpfilename;
          } else if (mode === 'cloud') {
            imgUrl = data.data;
          }
          resolve(imgUrl);
        } else {
          reject(data);
        }
      };
      xhr.send(fd);
    });
  };
  imgUp(e,bol) {
    this.setState({ imgfile: e });

    let files = e.target.files || e.dataTransfer.files;

    if (!files.length) return;
    let type = files[0].type; //文件的类型，判断是否是图片
    let size = files[0].size; //文件的大小，判断图片的大小
    if (size > 5242880) {
      alert("请选择5M以内的图片！");
      return false;
    }
    this.setState({ loading: true })
    this.uploadFile(files[0], `http://kingofdinner.realsun.me:1201/api/AliyunOss/PutOneImageObject?bucketname=nutritiontower&srctype=${type[1]}`, "cloud").then((result) => {
    let o =this.state.enterpriseInfo;
    o.logo=result
    if(!bol){
      this.setState({ loading: false, enterpriseInfo:o })
    }else{
      this.addImg(result)
    }
    }, (err) => {
      this.setState({ loading: false })
    })
  }
  addImg=async(v)=>{
    this.setState({loading:true});
    console.log('进来了',v)
    let res;
    try{
      res=await http().addRecords({
        resid:imgListId,
        data:[{
          enterpriseRecid:this.state.enterpriseId,
          image:v
        }]
      })
    console.log('res',res)

    this.getImgList();
    }catch(e){
      console.log(e.message);
    }
  }
  getEnterpriseInfo=async()=>{
    this.setState({loading:true});
    let res;
    try{
      res = await http().getTable({
        resid:enterpriseInfoId
      });
      if(res.data.length>0){
        this.setState({enterpriseInfo:res.data[0],enterpriseId:res.data[0].recid,loading:false});
      }
    }catch(e){
      console.log(e.message);
    }
  }
  submitEnterpriseInfo=async()=>{
    this.setState({loading:true});
    let res;
    try{
      res = await http().modifyRecords({
        resid:enterpriseInfoId,
        data:[this.state.enterpriseInfo]
      });
      message.success('修改成功');
      this.setState({loading:false});
    }catch(e){
      console.log(e.message);
    }
  }
  getImgList=async()=>{
    this.setState({loading:true});
    let res;
    try{
      res = await http().getTable({
        resid:imgListId
      });
      if(res.data.length>0){
        this.setState({imgList:res.data,loading:false});
      }
    }catch(e){
      console.log(e.message);
    }
  }
  delImg=async()=>{
    this.setState({loading:true});
    let res;
    try{
      res = await http().removeRecords({
        resid:imgListId,
        data:[this.state.currentImage]
      });
    this.setState({currentImage:{recid:''}});
    this.getImgList();
    }catch(e){
      console.log(e.message);
    }
  }
  changeActivate=async(b)=>{
    this.setState({loading:true});
    let res;
    let arr=this.state.imgList;
    let n=0;
    while(n<arr.length){
      arr[n].activated='';
      if(arr[n].recid===this.state.currentImage.recid){
        if(b){
          arr[n].activated='Y'
        }
      }
      n++;
    }
    try{
      res = await http().modifyRecords({
        resid:imgListId,
        data:arr
      });
    this.getImgList();
    this.getEnterpriseInfo();
    }catch(e){
      console.log(e.message);
    }
  }
  modiJob=(v)=>{
    if(!v){
      let o={};
      o.enterpriseRecid=this.state.enterpriseId;
      o.jobAddress=this.state.enterpriseInfo.enterpriseAddress;
      this.setState({showJobDetail:true,currentJob:o,isNewJob:true});
    }else{
      this.setState({showJobDetail:true,currentJob:v,isNewJob:false});
    }
  }
  subJob=async()=>{
    this.setState({loading:true});
    let res;
    try{
      if(this.state.isNewJob){
        res=await http().addRecords({
          resid:jobListId,
          data:[this.state.currentJob]
        });
        this.setState({loading:false,showJobDetail:false});
        this.tableDataRef.handleRefresh();
      }else{
        res=await http().modifyRecords({
          resid:jobListId,
          data:[this.state.currentJob]
        });
        this.setState({loading:false,showJobDetail:false});
        this.tableDataRef.handleRefresh();
      }
    }catch(e){
      console.log(e.message);
      message.error(e.message);
    }
    
  }
  render() {
    return (
      <div
        className="enterpriseInfo"
      >
          <div className={this.state.canEdit?'canEditTime':'canEditTime_alter'}>
            <dl>
              <dt style={this.state.expand?{}:{marginBottom:0,borderBottom:'0px solid #fff'}} 
              onClick={()=>{if(this.state.canEdit){this.setState({expand:!this.state.expand})}}}>可修改信息的时间 <Icon style={this.state.canEdit?{float:'right',marginTop:'.25rem'}:{display:'none'}} type={this.state.expand?'up':'down'}/></dt>
              {
                this.state.canEditTime.map(
                  (item,key)=>{return(
                    <dd key={key} style={this.state.expand?{boxSizing:'content-box',height:'2.4rem',lineHeight:'1.2rem',paddingBottom:'.5rem'}:{height:0,marginBottom:0,borderBottom:'0px solid #fff'}}>
                      {item.stTime}-{item.edTime}
                    </dd>
                  )
                  }
                )
              }
            </dl>
          </div>
       <Tabs defaultActiveKey="1" className="tabs_container" style={this.state.canEdit?{}:{display:'none'}}>
         
          <TabPane tab="企业基本信息" key="1">
            <Spin spinning={this.state.loading}>
            <div className='form'>
                {
                  formData.map(
                    (item,key)=>{return(
                      <div key={item.id}>
                        <span>{item.name}</span>
                        <div>
                        {
                          item.type==='textarea'?
                          <TextArea
                            value={this.state.enterpriseInfo[item.id]}
                            onChange={(v)=>{this.handleChange(v.target.value,item.id)}}
                          />
                          :null
                        }
                        {
                          item.type==='img'?<>
                          <input ref="ss" name="ss" type="file" onChange={v => { this.imgUp(v) }} accept='image' />
                          <div></div>
                          {this.state.enterpriseInfo[item.id]?<img src={this.state.enterpriseInfo[item.id]}/>:<div>暂无图片</div>}</>:null
                        }
                        {
                          !item.type?
                              <Input
                              value={this.state.enterpriseInfo[item.id]}
                              onChange={(v)=>{this.handleChange(v.target.value,item.id)}}
                            />
                              :null
                        }

                        </div>
                       
                      </div>
                    )}
                  )
                }
                <div>
                  <span>
                  <Button
                  style={{width:104}}
                  type='primary'
                  onClick={()=>{
                    this.submitEnterpriseInfo();
                  }}
                >
                  提交
                </Button>
                  </span>
                
                </div>
               
            </div>
            </Spin>
          </TabPane>
          <TabPane tab="职位" key="2">
          <div className='outer'>
          <Modal
              visible={this.state.showJobDetail}
              title={this.state.isNewJob?"添加职位":"修改职位"}
              width={800}
              footer={null}
              onCancel={()=>{this.setState({showJobDetail:false})}}
              destroyOnClose
            >
              <div className='jobInfo'>
                <div>
                  <span>岗位名称：</span><Input value={this.state.currentJob.job} 
                  onChange={(v)=>{this.setState({
                    currentJob: {
                      ...this.state.currentJob,
                      job: v.target.value
                    }
                  });}}/>
                </div>
                <div>
                  <span>是否生效：</span>
                  <Select
                style={{ width: 120, marginRight: 16 }}
                size="small"
                onChange={(v)=>{this.setState({
                  currentJob: {
                    ...this.state.currentJob,
                    activated: v
                  }
                });}}
                value={this.state.currentJob.activated}
              >
                <Select.Option value="">否</Select.Option>
                <Select.Option value="是">是</Select.Option>
              </Select>
                </div>
                <div>
                  <span>招聘人数：</span><Input value={this.state.currentJob.number} type='number'
                  onChange={(v)=>{this.setState({
                    currentJob: {
                      ...this.state.currentJob,
                      number: v.target.value
                    }
                  });}}/>
                </div>
                <div>
                  <span>工资待遇（一般平均每月税后收入范围）（单位：元/月）：</span><Input value={this.state.currentJob.salary} 
                  onChange={(v)=>{this.setState({
                    currentJob: {
                      ...this.state.currentJob,
                      salary: v.target.value
                    }
                  });}}/>
                </div>
                <div>
                  <span>是否提供（或安排）住宿：</span>
                  <Select
                style={{ width: 120, marginRight: 16 }}
                size="small"
                onChange={(v)=>{this.setState({
                  currentJob: {
                    ...this.state.currentJob,
                    dormitory: v
                  }
                });}}
                value={this.state.currentJob.dormitory}
              >
                <Select.Option value="">否</Select.Option>
                <Select.Option value="是">是</Select.Option>
              </Select>
                </div>
                <div>
                  <span>工作地址：</span><Input value={this.state.currentJob.jobAddress} 
                  onChange={(v)=>{this.setState({
                    currentJob: {
                      ...this.state.currentJob,
                      jobAddress: v.target.value
                    }
                  });}}/>
                </div>
                <Button
                  type='primary'
                  size='small'
                  onClick={()=>{this.subJob();}}
                >
                  提交
                </Button>
              </div>
              
            </Modal>
              <TableData
                key={'_01'}
                resid={jobListId}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                subtractH={190}
                hasAdd={false}
                hasRowSelection={false}
                hasModify={false}
                hasDelete={false}
                hasRowEdit={false}
                hasRowModify={false}
                hasRowView={false}
                hasRowDelete={true}
                actionBarWidth={140}
                actionBarExtra={() => {
                  return (
                    <Button
                      type="primary"
                      onClick={() => {
                        this.modiJob();
                      }}
                    >
                      添加
                    </Button>
                  );
                }}
                customRowBtns={[
                  (record) => {
                    return (
                      <Button
                        type="primary"
                        onClick={() => {this.modiJob(record)}}
                      >
                        修改
                      </Button>
                    );
                  }
                ]}
              />
            </div>
          </TabPane>
          <TabPane tab="招聘简章" key="3">
            <Spin spinning={this.state.loading}>
            <div className='rules'>
            <div className='fixed'>
            <input style={{display:'none'}} ref="ruleImg" name="ruleImg" type="file" onChange={v => { this.imgUp(v,true); }} accept='image' />
              <Button onClick={()=>{
                this.refs.ruleImg.click();
              }}>
                添加
              </Button>
            <Popconfirm
                title="确认启用吗？"
                onConfirm={()=>{this.changeActivate(true);}}
              >
              <Button type='primary'>
                启用
              </Button>
              </Popconfirm>
              <Popconfirm
                title="确认禁用吗？"
                onConfirm={()=>{this.changeActivate(false);}}
              >
              <Button type='danger'>
                禁用
              </Button>
              </Popconfirm>
              <Popconfirm
                title="确认删除吗？"
                onConfirm={()=>{this.delImg();}}
              >
              <Button type='danger'>
                删除
              </Button>
              </Popconfirm>
            </div>
            <ul>
              {
                this.state.imgList.map(item=>{
                  return(
                      <li key={item.recid}
                      onClick={()=>{this.setState({currentImage:item})}}
                      className={this.state.currentImage.recid===item.recid?'current':''}
                      >
                        <span
                        style={this.state.enterpriseInfo.activatedRules?(item.image===this.state.enterpriseInfo.activatedRules?{color:'#1890ff',fontWeight:'bold'}:{}):{}}
                        >{this.state.enterpriseInfo.activatedRules?(item.image===this.state.enterpriseInfo.activatedRules?'启用中':'未启用'):'未启用'}</span>
                        <img src={item.image}/>
                      </li>
                  )})
              }
              </ul>
            </div>
            </Spin>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default EnterpriseInfo;
