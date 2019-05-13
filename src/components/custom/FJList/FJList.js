import React from "react";
import { TableDataC } from "../loadableCustom";
import { TableData } from "../../common/loadableCommon";
import { Button, Icon, Radio , message, Popover, List, Card, Modal, Input, Popconfirm, Tabs } from "antd";
import { saveMultipleRecord } from "../../../util/api";
import http from "../../../util20/api";

const { TextArea } = Input;
const TabPane = Tabs.TabPane;

class FJList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      subData: [],
      totalData: [],
      addCustom: [],
      listIndex: 0,
      listNo:"",
      visibleAdd: false,
      visibleEdit: false,
      visibleCustom: false,
      showHistory:false,
      showTab:false,
      addData:{},
      editData:{},
      plist:[]
    };
  }

  componentDidMount(){
    this.getData();
    this.totalData();
  };

  //获取员工列表
  async getData(){
    let res = await http().getTable({ resid: this.props.resid });
    try {
      if (res.error === 0) {
        let data = res.data
        data.forEach(e => {
          e.check = false
        });
        data[0].check = true
        this.setState({data,listNo:data[0].C3_609622254861});
        this.getSubData(data[0].C3_609622254861);
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }
  
  //获取统计数据
  async totalData(){
    let res = await http().getTable({ resid: this.props.totalResid });
    try {
      if (res.error === 0) {
        let totalData = res.data[0]
        this.setState({totalData});
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }
  
  //获取员工推荐课程
  async getSubData(e){
    let res = await http().getTable({ resid: this.props.subResid, cmswhere:"C3_610657579164 = '"+ e +"'"});
    try {
      if (res.error === 0) {
        let subData = res.data
        // console.log(subData)
        this.setState({subData});
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.log().error(err);
      return message.error(err.message);
    }
  }
  
  //单选员工
  onClick(listNo){
    let data = this.state.data
    data.forEach(e => {
      e.check = false
      if(e.C3_609622254861==listNo)e.check=true
    });
    this.setState({data,listNo});
    this.getSubData(listNo);
  }

  //添加课程
  async addCourse(){
    this.setState({visibleAdd:false,visibleEdit:false})
    let addData = this.state.addData
    addData.C3_610657579164 = this.state.listNo
    let res 
    try {
      res = await http().addRecords({ resid: this.props.subResid, data:[{...addData}]});
      if (res.Error === 0) {
        this.getSubData(this.state.listNo)
        return message.success(res.message);
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  //添加自定义课程
  async addCustom(){
    this.setState({visibleCustom:false})
    let addCustom = this.state.addCustom
    addCustom.C3_610657579164 = this.state.listNo
    let res = await http().addRecords({ resid: this.props.subResid, data:[{...addCustom}]});
    try {
      if (res.Error === 0) {
        this.getSubData(this.state.listNo)
        return message.success(res.message);
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }
  
  //删除课程
  async delCourse(i){
    let res = await http().removeRecords({ resid: this.props.subResid, data:[this.state.subData[i]]});
    try {
      if (res.Error === 0) {
        message.success(res.message);
        this.getSubData(this.state.listNo)
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  //修改课程
  async editCourse(i){
    this.setState({visibleAdd:false,visibleEdit:false})
    let res = await http().modifyRecords({ resid: this.props.subResid, data:[this.state.editData]});
    try {
      if (res.Error === 0) {
        this.getSubData(this.state.listNo)
        return message.success(res.message);
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  render() {
    let subData = this.state.subData
    let totalData = this.state.totalData
    return (
      <div style={{ display:"flex",flexDirection: 'row',background:"#fff"}}>
        <div style={{ width: "50%",padding: '16px 28px'}}> 
            <div style={{display:"flex",flex:3,padding: '5px 0',flexDirection: 'row',justifyContent: 'space-around' }}>
              <Button type="primary"
                style={{marginRight:"10px"}}
                onClick={() => {
                  window.location.href = "/fnmodule?resid=610555442186&recid=610555514606&type=前端功能入口&title=创建计划";
                }}>
                创建计划
              </Button>
              <div style={{ flex:9, display:"flex",justifyContent: 'space-around',padding: '0 10px'}}>
                <span style={{fontSize:"24px",fontWeight:"bold"}}>
                  {totalData.C3_609616006519=="SH"?"上海":"无锡"}
                </span>
                <span style={{fontSize:"24px",fontWeight:"bold"}}>
                  财年: {totalData.C3_609615869581}
                </span>
              </div>
              <div style={{ display:"flex",flex:3,flexDirection: 'column',justifyContent: 'space-around',alignItems:'center' }}>
                <span style={{fontSize:"14px"}}>
                  人数: {totalData.C3_609615996253}
                </span>
                <span style={{fontSize:"14px"}}>
                  总预算: {totalData.C3_609616030566}
                </span>
                <span style={{fontSize:"14px"}}>
                  总费用: {totalData.C3_609616051191}
                </span>
              </div>
            </div>
            <List
              size="large"
              // header={<div>Header</div>}
              // footer={<div>Footer</div>}
              style={{height:"calc(100vh - 330px)",overflowY: 'scroll'}}
              bordered
              dataSource={this.state.data}
              renderItem={item => (<List.Item style={{cursor:'pointer'}} onClick={this.onClick.bind(this,item.C3_609622254861)}>
                                    <div style={{ display:"flex",flex:1,flexDirection: 'row',alignItems:'center'}}>
                                      <div style={{display:"flex",flex:1}}>
                                        <Radio  checked={item.check}></Radio >
                                      </div>
                                      <div style={{display:"flex",flex:2}}>
                                        <Icon type = "user" style={{fontSize:"24px"}}/>
                                      </div>
                                      <div style={{display:"flex",flex:4,flexDirection: 'column'}}>
                                        <div>
                                          <span>{item.C3_609622254861==null?"无":item.C3_609622254861}</span>
                                        </div>
                                        <div>
                                          <span>{item.C3_609622263470==null?"无":item.C3_609622263470}</span>
                                        </div>
                                      </div>
                                      <div style={{display:"flex",flex:4,flexDirection: 'column'}}>
                                        <div style={{display:"flex",flexDirection:'row',alignItems:'center'}}>
                                          <div style={{width:"10px",height:"10px",borderRadius:"50%",background:"#4a90e2",marginRight:"16px"}}></div><span>{item.C3_609622277252==null?"无":item.C3_609622277252}</span>
                                        </div>
                                        <div style={{display:"flex",flexDirection:'row',alignItems:'center'}}>
                                        <div style={{width:"10px",height:"10px",borderRadius:"50%",background:"#4a90e2",marginRight:"16px"}}></div><span>{item.C3_609622292033==null?"无":item.C3_609622292033}</span>
                                        </div>
                                      </div>
                                      <div style={{display:"flex",flex:1}}>
                                        {/* <Popover placement="topLeft"
                                          onClick={(e)=>e.stopPropagation()}
                                          content={<div style={{display:"flex",flexDirection: 'column'}}>
                                                            <Button><Icon type = "file" style={{fontSize:"18px"}}/>历年绩效</Button>
                                                            <Button><Icon type = "smile" style={{fontSize:"18px"}}/>员工发展</Button>
                                                            <Button><Icon type = "swap" style={{fontSize:"18px"}}/>历史计划</Button>
                                                          </div>} trigger="click" >
                                          <Icon type = "right-circle" style={{fontSize:"18px"}}/>
                                        </Popover> */}
                                        <Icon type = "right-circle" style={{fontSize:"18px"}} onClick={(e)=>{this.setState({showTab:true});e.stopPropagation()}}/>
                                      </div>
                                    </div>
                                  </List.Item>)}/>
        </div>
        <div style={{ width: "50%",padding: '16px 28px'}}>
          <div style={{display:"flex",flex:1,flexDirection: 'row',justifyContent: 'space-between',padding: '5px 0'}}>
            <div style={{ flex:9 }}>
              <Button type="primary" onClick={()=>this.setState({showHistory:true})}>
                历史记录
              </Button>
            </div>
            <div style={{ display:"flex",flex:2,flexDirection: 'column',justifyContent: 'space-around' }}>
              <span style={{fontSize:"14px"}}>
                课程数:10
              </span>
              <span style={{fontSize:"14px"}}>
                个人预算:10
              </span>
              <span style={{fontSize:"14px"}}>
                个人费用:10
              </span>
            </div>
          </div>
          <div style={{height:"calc(100vh - 330px)",overflowY: 'scroll'}}>
            {subData.map((item,i)=>(
              <Card
                title={item.C3_610657578726}
                key={i}
                extra={ <Popconfirm placement="topRight" title={"确认要删除么?"} onConfirm={this.delCourse.bind(this,i)} okText="确认" cancelText="取消">
                          <Icon type="delete" style={{cursor:'pointer'}}/>
                        </Popconfirm>} 
                style={{marginBottom:"16px"}}
                actions={[<a href="#" onClick={()=>this.setState({editData:{...this.state.subData[i]},visibleEdit:true,})}>修改</a>,<a></a>]}
              >
                <div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"12px"}}>
                    费用
                  </span>
                  <span style={{fontSize:"12px"}}>
                    {item.C3_610657578976}
                  </span>
                </div>
                {item.C3_611078361190!="Y"&&item.C3_611078361190!="Y"&&<div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"12px"}}>
                    课时
                  </span>
                  <span style={{fontSize:"12px"}}>
                    {item.C3_610657579039}
                  </span>
                </div>}
                {item.C3_611078361190!="Y"&&<div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"12px"}}>
                    讲师
                  </span>
                  <span style={{fontSize:"12px"}}>
                    {item.C3_610657579289}
                  </span>
                </div>}
                {item.C3_611078361190!="Y"&&<div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"12px"}}>
                    培训地
                  </span>
                  <span style={{fontSize:"12px"}}>
                    {item.C3_610657579226}
                  </span>
                </div>}
                {item.C3_611078361190!="Y"&&<div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"12px"}}>
                    课程介绍
                  </span>
                  <span style={{fontSize:"12px"}}>
                    {item.C3_610657578664}
                  </span>
                </div>}
                <div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"12px"}}>
                    课程大纲
                  </span>
                  <a target="_blank" href="https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2924217925,3098709361&fm=173&app=49&f=JPEG?w=218&h=146&s=A6B05B844E83A015F200B120030060D9">
                    <Button type="primary" size="small"></Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
          <div style={{display:"flex",flex:1,flexDirection: 'row',justifyContent: 'space-around',padding: '5px 0',marginTop:"20px"}}>
            <Button type="default" style={{ width: "calc(50% - 80px)" }} onClick={()=>this.setState({visibleAdd:true})}>添加课程</Button>
            <Button type="default" style={{ width: "calc(50% - 80px)" }} onClick={()=>this.setState({visibleCustom:true})}>自定义课程</Button>
          </div>
          <Modal
            title="历史记录"
            destroyOnClose={true}
            visible={this.state.showHistory}
            onOk={()=>this.setState({showHistory:false})}
            onCancel={()=>this.setState({showHistory:false})}
          >

          </Modal>
          <Modal
            title="课程大纲"
            destroyOnClose={true}
            visible={this.state.showOutline}
            onOk={()=>this.setState({showOutline:false})}
            onCancel={()=>this.setState({showOutline:false})}
          >

          </Modal>
          <Modal
            destroyOnClose={true}
            width={"80%"}
            visible={this.state.showTab}
            onOk={()=>this.setState({showTab:false})}
            onCancel={()=>this.setState({showTab:false})}
          >
            <Tabs defaultActiveKey="1">
              <TabPane tab="Tab 1" key="1">
                <TableData
                  height={"calc(100vh - 300px)"}
                  resid={610657610335}
                  recordFormFormWidth= {'90%'}
                  hasBeBtns= {false}
                  hasModify= {false}
                  hasDelete= {false}
                  hasAdd= {false}
                  hasRowDelete= {false}
                  hasRowModify= {false}
                  hasRowView= {false}
                  subtractH={190}
                />
              </TabPane>
              <TabPane tab="Tab 2" key="2">
                <TableData
                  // resid={resid}
                  // dataMode="main"
                  // subtractH={190}
                  // height={520}
                  // hasBeBtns
                />
              </TabPane>
              <TabPane tab="Tab 3" key="3">
                <TableData
                  // resid={resid}
                  // dataMode="main"
                  // subtractH={190}
                  // height={520}
                  // hasBeBtns
                />
              </TabPane>
            </Tabs>
          </Modal>
          <Modal
            title="添加课程"
            destroyOnClose={true}
            visible={this.state.visibleAdd}
            onOk={this.addCourse.bind(this)}
            onCancel={()=>this.setState({visibleAdd:false})}
          >
            <div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
              <div style={{display:"flex",flex:1,alignItems:"center"}}>
                <span style={{flex:1,textAlign:"right",paddingRight:"16px"}}>课程名称:</span>
              </div>
              <div style={{flex:3}}>
                <Input
                  onChange={(e)=>{
                    let addData = this.state.addData
                    addData.C3_610657578726=e.target.value
                    this.setState({addData})
                }}/>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
              <div style={{display:"flex",flex:1,alignItems:"center"}}>
                <span style={{flex:1,textAlign:"right",paddingRight:"16px"}}>费用:</span>
              </div>
              <div style={{flex:3}}>
                <Input 
                  onChange={(e)=>{
                    let addData = this.state.addData
                    addData.C3_610657578976=e.target.value
                    this.setState({addData})
                }}/>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
              <div style={{display:"flex",flex:1,alignItems:"center"}}>
                <span style={{flex:1,textAlign:"right",paddingRight:"16px"}}>课时:</span>
              </div>
              <div style={{flex:3}}>
                <Input
                  onChange={(e)=>{
                    let addData = this.state.addData
                    addData.C3_610657579039=e.target.value
                    this.setState({addData})
                }}/>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
              <div style={{display:"flex",flex:1,alignItems:"center"}}>
                <span style={{flex:1,textAlign:"right",paddingRight:"16px"}}>讲师:</span>
              </div>
              <div style={{flex:3}}>
                <Input 
                  onChange={(e)=>{
                    let addData = this.state.addData
                    addData.C3_610657579289=e.target.value
                    this.setState({addData})
                }}/>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
              <div style={{display:"flex",flex:1,alignItems:"center"}}>
                <span style={{flex:1,textAlign:"right",paddingRight:"16px"}}>培训地:</span>
              </div>
              <div style={{flex:3}}>
                <Input 
                  onChange={(e)=>{
                    let addData = this.state.addData
                    addData.C3_610657579226=e.target.value
                    this.setState({addData})
                }}/>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
              <div style={{display:"flex",flex:1,alignItems:"center"}}>
                <span style={{flex:1,textAlign:"right",paddingRight:"16px"}}>课程介绍:</span>
              </div>
              <div style={{flex:3}}>
                <Input 
                  autosize={{ minRows: 2, maxRows: 2 }}
                  onChange={(e)=>{
                    let addData = this.state.addData
                    addData.C3_610657578664=e.target.value
                    this.setState({addData})
                }}/>
              </div>
            </div>
          </Modal>
          <Modal
            title="添加自定义课程"
            destroyOnClose={true}
            visible={this.state.visibleCustom}
            onOk={this.addCustom.bind(this)}
            onCancel={()=>this.setState({visibleCustom:false})}
          >
            <div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
              <div style={{display:"flex",flex:1,alignItems:"center"}}>
                <span style={{flex:1,textAlign:"right",paddingRight:"16px"}}>课程名称:</span>
              </div>
              <div style={{flex:3}}>
                <Input
                  onChange={(e)=>{
                    let addCustom = this.state.addCustom
                    addCustom.C3_611078361190="Y"
                    addCustom.C3_610657578726=e.target.value
                    this.setState({addCustom})
                }}/>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
              <div style={{display:"flex",flex:1,alignItems:"center"}}>
                <span style={{flex:1,textAlign:"right",paddingRight:"16px"}}>费用:</span>
              </div>
              <div style={{flex:3}}>
                <Input onChange={(e)=>{
                  let addCustom = this.state.addCustom
                  addCustom.C3_610657578976=e.target.value
                  this.setState({addCustom})
                }}/>
              </div>
            </div>
          </Modal>
          <Modal
            title="修改课程"
            destroyOnClose={true}
            visible={this.state.visibleEdit}
            onOk={this.editCourse.bind(this)}
            onCancel={()=>this.setState({visibleEdit:false})}
          >
            <div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
              <div style={{display:"flex",flex:1,alignItems:"center"}}>
                <span style={{flex:1,textAlign:"right",paddingRight:"16px"}}>课程名称:</span>
              </div>
              <div style={{flex:3}}>
                <Input 
                  defaultValue = {this.state.editData.C3_610657578726}
                  onChange={(e)=>{
                    let editData = this.state.editData
                    editData.C3_610657578726=e.target.value
                    this.setState({editData})
                }}/>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
              <div style={{display:"flex",flex:1,alignItems:"center"}}>
                <span style={{flex:1,textAlign:"right",paddingRight:"16px"}}>费用:</span>
              </div>
              <div style={{flex:3}}>
                <Input 
                  defaultValue = {this.state.editData.C3_610657578976}
                  onChange={(e)=>{
                    let editData = this.state.editData
                    editData.C3_610657578976=e.target.value
                    this.setState({editData})
                }}/>
              </div>
            </div>
            {this.state.editData.C3_611078361190!="Y"&&<div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
              <div style={{display:"flex",flex:1,alignItems:"center"}}>
                <span style={{flex:1,textAlign:"right",paddingRight:"16px"}}>课时:</span>
              </div>
              <div style={{flex:3}}>
                <Input 
                  defaultValue = {this.state.editData.C3_610657579039}
                  onChange={(e)=>{
                    let editData = this.state.editData
                    editData.C3_610657579039=e.target.value
                    this.setState({editData})
                }}/>
              </div>
            </div>}
            {this.state.editData.C3_611078361190!="Y"&&<div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
              <div style={{display:"flex",flex:1,alignItems:"center"}}>
                <span style={{flex:1,textAlign:"right",paddingRight:"16px"}}>讲师:</span>
              </div>
              <div style={{flex:3}}>
                <Input 
                  defaultValue = {this.state.editData.C3_610657579289}
                  onChange={(e)=>{
                    let editData = this.state.editData
                    editData.C3_610657579289=e.target.value
                    this.setState({editData})
                }}/>
              </div>
            </div>}
            {this.state.editData.C3_611078361190!="Y"&&<div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
              <div style={{display:"flex",flex:1,alignItems:"center"}}>
                <span style={{flex:1,textAlign:"right",paddingRight:"16px"}}>培训地:</span>
              </div>
              <div style={{flex:3}}>
                <Input 
                  defaultValue = {this.state.editData.C3_610657579226}
                  onChange={(e)=>{
                    let editData = this.state.editData
                    editData.C3_610657579226=e.target.value
                    this.setState({editData})
                }}/>
              </div>
            </div>}
            {this.state.editData.C3_611078361190!="Y"&&<div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
              <div style={{display:"flex",flex:1,alignItems:"center"}}>
                <span style={{flex:1,textAlign:"right",paddingRight:"16px"}}>课程介绍:</span>
              </div>
              <div style={{flex:3}}>
                <Input 
                  defaultValue = {this.state.editData.C3_610657578664}
                  autosize={{ minRows: 2, maxRows: 2 }}
                  onChange={(e)=>{
                    let editData = this.state.editData
                    editData.C3_610657578664=e.target.value
                    this.setState({editData})
                }}/>
              </div>
            </div>}
          </Modal>
        </div>
      </div>
    );
  }
}

export default FJList;