import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, message,Popconfirm, Modal ,Icon,Table,Spin,Tabs,Input} from 'antd';
import './EnterpriseInfo.less';
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
  },{
    id:'logo',
    name:'logo',
    type:'img'
  }
]
const enterpriseInfoId=692379457919;
const jobListId=695212874956;
const imgListId=695211797012;

class EnterpriseInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  
  state={
    imgList:[],
    currentImage:{recid:''},
    enterpriseInfo:{
      activatedRules:''
    }
  }
  handleChange=(v,id)=>{
    let o =this.state.enterpriseInfo;
    o[id]=v;
    this.setState({enterpriseInfo:o});
  }
  componentDidMount=()=>{
    this.getEnterpriseInfo();
    this.getImgList();
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
  render() {
    return (
      <div
        className="enterpriseInfo"
      >
       <Tabs defaultActiveKey="1" className="tabs_container">
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
              <TableData
                resid={jobListId}
                subtractH={190}
                hasAdd={true}
                hasModify={false}
                hasDelete={false}
                hasRowEdit={false}
                hasRowModify={true}
                hasRowView={true}
                hasRowDelete={true}
                actionBarWidth={100}
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
