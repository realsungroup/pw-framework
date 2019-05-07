import React from "react";
import { TableDataC } from "../loadableCustom";
import { TableData } from "../../common/loadableCommon";
import { Button, Icon, Radio , message, Popover, List, Card, Modal, Input } from "antd";
import { saveMultipleRecord } from "../../../util/api";
import http from "../../../util20/api";

const { TextArea } = Input;

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
      let data = res.data
      // console.log(res.data)
      data.forEach(e => {
        e.check = false
      });
      data[0].check = true
      this.setState({data});
      this.getSubData(data[0].C3_609622254861);
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }
  
  //获取统计数据
  async totalData(){
    let res = await http().getTable({ resid: this.props.totalResid });
    try {
      let totalData = res.data[0]
      this.setState({totalData});
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }
  
  //获取员工推荐课程
  async getSubData(e){
    let res = await http().getTable({ resid: this.props.subResid, cmswhere:'C3_610308304458='+e});
    try {
      let subData = res.data
      this.setState({subData});
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
    // this.setState({visibleAdd:false,visibleEdit:false})
    let addData = this.state.addData
    addData.C3_610308304458 = this.state.subData[this.state.listIndex].C3_610308304458
    let res = await http().addRecords({ resid: this.props.subResid, data:[{...addData}]});
    this.getSubData(this.state.listNo)
    try {
      if(res.message=="操作成功")return message.success(res.message);
      return message.error(res.message);
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  //添加自定义课程
  async addCustom(){
    this.setState({visibleCustom:false})
    let addCustom = this.state.addCustom
    addCustom.C3_610308304458 = this.state.subData[this.state.listIndex].C3_610308304458
    let res = await http().addRecords({ resid: this.props.subResid, data:[{...addCustom}]});
    this.getSubData(this.state.listNo)
    try {
      if(res.message=="操作成功")return message.success(res.message);
      return message.error(res.message);
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }
  
  //删除课程
  async delCourse(i){
    let res = await http().removeRecords({ resid: this.props.subResid, data:[this.state.subData[i]]});
    this.getSubData(this.state.listNo)
    try {
      if(res.message=="操作成功"){
        return message.success(res.message)
      }else
      return message.error(res.message);
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  //修改课程
  async editCourse(i){
    let res = await http().modifyRecords({ resid: this.props.subResid, data:[this.state.editData]});
    this.getSubData(this.state.listNo)
    try {
      if(res.message=="操作成功"){
        return message.success(res.message)
      }else
      return message.error(res.message);
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
              <Button type="primary">创建计划</Button>
              <div style={{ flex:9, display:"flex",justifyContent: 'space-around',padding: '0 80px'}}>
                <span style={{fontSize:"24px",fontWeight:"bold"}}>
                  {totalData.C3_609616006519=="SH"?"上海":"无锡"}
                </span>
                <span style={{fontSize:"24px",fontWeight:"bold"}}>
                  财年: {totalData.C3_609615869581}
                </span>
              </div>
              <div style={{ display:"flex",flex:3,flexDirection: 'column',justifyContent: 'space-around',alignItems:'center' }}>
                <span style={{fontSize:"10px"}}>
                  人数: {totalData.C3_609615996253}
                </span>
                <span style={{fontSize:"10px"}}>
                  总预算: {totalData.C3_609616030566}
                </span>
                <span style={{fontSize:"10px"}}>
                  总费用: {totalData.C3_609616051191}
                </span>
              </div>
            </div>
            <List
              size="large"
              // header={<div>Header</div>}
              // footer={<div>Footer</div>}
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
                                        <Popover placement="topLeft"
                                          onClick={(e)=>e.stopPropagation()}
                                          content={<div style={{display:"flex",flexDirection: 'column'}}>
                                                            <Button><Icon type = "file" style={{fontSize:"18px"}}/>历年绩效</Button>
                                                            <Button><Icon type = "smile" style={{fontSize:"18px"}}/>员工发展</Button>
                                                            <Button><Icon type = "swap" style={{fontSize:"18px"}}/>历史计划</Button>
                                                          </div>} trigger="click" >
                                          <Icon type = "right-circle" style={{fontSize:"18px"}}/>
                                        </Popover>
                                      </div>
                                    </div>
                                  </List.Item>)}/>
        </div>
        <div style={{ width: "50%",padding: '16px 28px'}}>
          <div style={{display:"flex",flex:1,flexDirection: 'row',justifyContent: 'space-between',padding: '5px 0'}}>
            <div style={{ flex:9 }}></div>
            <div style={{ display:"flex",flex:2,flexDirection: 'column',justifyContent: 'space-around' }}>
              <span style={{fontSize:"10px"}}>
                课程数:10
              </span>
              <span style={{fontSize:"10px"}}>
                个人预算:10
              </span>
              <span style={{fontSize:"10px"}}>
                个人费用:10
              </span>
            </div>
          </div>
          <div>
            {subData.map((item,i)=>(
              <Card
                title={item.C3_609845305680}
                key={i}
                extra={<Icon type="delete" style={{cursor:'pointer'}} onClick={this.delCourse.bind(this,i)}/>} style={{marginBottom:"16px"}}
                actions={[<a href="#" onClick={()=>this.setState({editData:{...this.state.subData[i]},visibleEdit:true,})}>修改</a>,<span></span>,]}
              >
                <div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"10px"}}>
                    费用
                  </span>
                  <span style={{fontSize:"10px"}}>
                    {item.C3_609845305931}
                  </span>
                </div>
                <div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"10px"}}>
                    课时
                  </span>
                  <span style={{fontSize:"10px"}}>
                    {item.C3_609845305993}
                  </span>
                </div>
                <div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"10px"}}>
                    讲师
                  </span>
                  <span style={{fontSize:"10px"}}>
                    {item.C3_610390419677}
                  </span>
                </div>
                <div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"10px"}}>
                    培训地
                  </span>
                  <span style={{fontSize:"10px"}}>
                    {item.C3_610390410802}
                  </span>
                </div>
                <div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"10px"}}>
                    课程介绍
                  </span>
                  <span style={{fontSize:"10px"}}>
                    {item.C3_609845305618}
                  </span>
                </div>
              </Card>
            ))}
          </div>
          <div style={{display:"flex",flex:1,flexDirection: 'row',justifyContent: 'space-around',padding: '5px 0',marginTop:"20px"}}>
            <Button type="default" style={{ width: "calc(50% - 80px)" }} onClick={()=>this.setState({visibleAdd:true})}>添加课程</Button>
            <Button type="default" style={{ width: "calc(50% - 80px)" }} onClick={()=>this.setState({visibleCustom:true})}>自定义课程</Button>
          </div>
          <Modal
            title="添加课程"
            destroyOnClose={true}
            visible={this.state.visibleAdd}
            onOk={this.addCourse.bind(this)}
            onCancel={()=>this.setState({visibleAdd:false})}
          >
            <div style={{margin:"10px"}}>
              <Input placeholder="课程名称"
                onChange={(e)=>{
                let addData = this.state.addData
                addData.C3_609845305680=e.target.value
                this.setState({addData})
              }}/>
            </div>
            <div style={{margin:"10px"}}>
              <Input placeholder="费用" onChange={(e)=>{
                let addData = this.state.addData
                addData.C3_609845305931=e.target.value
                this.setState({addData})
              }}/>
            </div>
            <div style={{margin:"10px"}}>
              <Input placeholder="课时" onChange={(e)=>{
                let addData = this.state.addData
                addData.C3_609845305993=e.target.value
                this.setState({addData})
              }}/>
            </div>
            <div style={{margin:"10px"}}>
              <Input placeholder="讲师" onChange={(e)=>{
                let addData = this.state.addData
                addData.C3_610390419677=e.target.value
                this.setState({addData})
              }}/>
            </div>
            <div style={{margin:"10px"}}>
              <Input placeholder="培训地" onChange={(e)=>{
                let addData = this.state.addData
                addData.C3_610390410802=e.target.value
                this.setState({addData})
              }}/>
            </div>
            <div style={{margin:"10px"}}>
              <TextArea  placeholder="课程介绍" autosize={{ minRows: 2, maxRows: 2 }} onChange={(e)=>{
                let addData = this.state.addData
                addData.C3_609845305618=e.target.value
                this.setState({addData})
              }}/>
            </div>
          </Modal>
          <Modal
            title="添加自定义课程"
            destroyOnClose={true}
            visible={this.state.visibleCustom}
            onOk={this.addCustom.bind(this)}
            onCancel={()=>this.setState({visibleCustom:false})}
          >
            <div style={{margin:"10px"}}>
              <Input placeholder="课程名称"
                onChange={(e)=>{
                let addCustom = this.state.addCustom
                addCustom.C3_609845305680=e.target.value
                this.setState({addCustom})
              }}/>
            </div>
            <div style={{margin:"10px"}}>
              <Input placeholder="费用" onChange={(e)=>{
                let addCustom = this.state.addCustom
                addCustom.C3_609845305931=e.target.value
                this.setState({addCustom})
              }}/>
            </div>
          </Modal>
          <Modal
            title="修改课程"
            destroyOnClose={true}
            visible={this.state.visibleEdit}
            onOk={this.editCourse.bind(this)}
            onCancel={()=>this.setState({visibleEdit:false})}
          >
            <div style={{margin:"10px"}}>
              <Input placeholder="课程名称"
                defaultValue = {this.state.editData.C3_609845305680}
                onChange={(e)=>{
                let editData = this.state.editData
                editData.C3_609845305680=e.target.value
                this.setState({editData})
              }}/>
            </div>
            <div style={{margin:"10px"}}>
              <Input placeholder="费用"
                defaultValue = {this.state.editData.C3_609845305931}
                onChange={(e)=>{
                let editData = this.state.editData
                editData.C3_609845305931=e.target.value
                this.setState({editData})
              }}/>
            </div>
            <div style={{margin:"10px"}}>
              <Input placeholder="课时" 
                defaultValue = {this.state.editData.C3_609845305993}
                onChange={(e)=>{
                let editData = this.state.editData
                editData.C3_609845305993=e.target.value
                this.setState({editData})
              }}/>
            </div>
            <div style={{margin:"10px"}}>
              <Input placeholder="讲师" 
                defaultValue = {this.state.editData.C3_610390419677}
                onChange={(e)=>{
                let editData = this.state.editData
                editData.C3_610390419677=e.target.value
                this.setState({editData})
              }}/>
            </div>
            <div style={{margin:"10px"}}>
              <Input placeholder="培训地"
                defaultValue = {this.state.editData.C3_610390410802}
                onChange={(e)=>{
                let editData = this.state.editData
                editData.C3_610390410802=e.target.value
                this.setState({editData})
              }}/>
            </div>
            <div style={{margin:"10px"}}>
              <TextArea placeholder="课程介绍"
                defaultValue = {this.state.editData.C3_609845305618}
                autosize={{ minRows: 2, maxRows: 2 }}
                onChange={(e)=>{
                let editData = this.state.editData
                editData.C3_609845305618=e.target.value
                this.setState({editData})
              }}/>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default FJList;