import React from "react";
import { TableDataC } from "../loadableCustom";
import { TableData } from "../../common/loadableCommon";
import { Button, Icon, Checkbox , message, Popover, List, Select, Modal, Input } from "antd";
import { saveMultipleRecord } from "../../../util/api";
import http from "../../../util20/api";

const Option = Select.Option;
const Search = Input.Search;

class CreatePlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      oldData: [],
      subData: [],
      levelData: [],
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
    this.getLevel();
    this.getSubData();
  };

  //获取员工列表
  async getData(key){
    let res = await http().getTable({ resid: this.props.resid,key });
    try {
      let data = res.data
      // console.log(res.data)
      data.forEach(e => {
        e.check = false
      });
      this.setState({data, oldData:data});
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  //获取员工级别
  async getLevel(){
    let res = await http().getTable({ resid: this.props.levelId });
    try {
      let levelData = res.data
      this.setState({levelData});
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  //获取课程表
  async getSubData(key){
    let res = await http().getTable({ resid: this.props.subResid,key});
    try {
      let subData = res.data
      // console.log(res.data)
      subData.forEach(e => {
        e.check = false
      });
      this.setState({subData});
    } catch (err) {
      console.log().error(err);
      return message.error(err.message);
    }
  }
  
  //选择员工
  onClick(i){
    let data = this.state.data
    data[i].check=!data[i].check
    this.setState({data});
  }

  //选择课程
  onClickCustom(i){
    let subData = this.state.subData
    subData[i].check=!subData[i].check
    this.setState({subData});
  }

  //保存计划
  async onClickSave(){
    let x=0,y=0,data=this.state.data,subData=this.state.subData,planData=[]
    subData.forEach((ele)=>{
      if(ele.check==true){
        y++
        data.forEach((e)=>{
          if(e.check==true){
            x++
            let obj = JSON.parse(JSON.stringify(ele))
            obj.C3_610308304458 = e.C3_609622254861
            planData.push(obj)
          }
        })
      }
    })
    console.log(planData)
    if(y==0)return message.error("至少选择一个课程");
    if(x==0)return message.error("至少选择一个员工");
    let res = await http().addRecords({ resid: this.props.kcbResid,data: planData});
    try {
      if(res.message=="操作成功")return message.success(res.message);
      return message.error(res.message);
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  render() {
    let levelData = this.state.levelData
    return (
      <div style={{padding:"16px",background:"#fff"}}>
        <div style={{ display:"flex",flexDirection: 'row'}}>
          <div style={{ width: "50%",padding: '16px 28px'}}>
            <div style={{padding: "24px"}}>
              <span style={{fontSize:"24px",fontWeight:"bold"}}>
                选择员工
              </span>
            </div>
            <List
              size="large"
              header={<div style={{display:"flex",justifyContent:"space-between"}}>
                <Select
                  style={{width:"100px"}}
                  defaultValue="All"
                  onChange={(e)=>{
                    let data = [],oldData = this.state.oldData
                    if(e=="All"){
                      data = oldData
                    }else{
                      oldData.forEach((ele)=>{
                        ele.check=false
                        if(ele.C3_609622292033 == e)data.push(ele)
                      })
                    }
                    this.setState({data})
                }}>
                  <Option value="All">全部级别</Option>
                  {levelData.map((item,i)=>
                    <Option value={item.C3_587136281870} key={i}>{item.C3_587136281870}</Option>
                  )}
                </Select>
                <Search
                  placeholder="搜索"
                  onSearch={value => this.getData(value)}
                  style={{ width: 200 }}
                />
              </div>}
              // footer={<div>Footer</div>}
              bordered
              style={{height:"calc(100vh - 400px)"}}
              dataSource={this.state.data}
              renderItem={(item,i) => (<List.Item style={{cursor:'pointer'}} onClick={this.onClick.bind(this,i)}>
                                    <div style={{ display:"flex",flex:1,flexDirection: 'row',alignItems:'center'}}>
                                      <div style={{display:"flex",flex:1}}>
                                        <Checkbox checked={item.check}/>
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
            <div style={{padding: "24px"}}>
              <span style={{fontSize:"24px",fontWeight:"bold"}}>
                选择课程
              </span>
            </div>
            <List
              size="large"
              header={<div style={{display:"flex",justifyContent:"space-between"}}>
                <Select
                  style={{width:"100px"}}
                  defaultValue="All"
                  onChange={(e)=>{}}>
                  <Option value="All">全部课程</Option>
                  <Option value="Rec">推荐课程</Option>
                </Select>
                <Select
                  style={{width:"100px"}}
                  defaultValue="series1"
                  onChange={(e)=>{}}>
                  <Option value="series1">系列1</Option>
                  <Option value="series2">系列2</Option>
                  <Option value="series3">系列3</Option>
                </Select>
                <Select
                  style={{width:"100px"}}
                  defaultValue="class1"
                  onChange={(e)=>{}}>
                  <Option value="class1">分类1</Option>
                  <Option value="class2">分类2</Option>
                  <Option value="class3">分类3</Option>
                </Select>
                <Search
                  placeholder="搜索"
                  onSearch={value => this.getSubData(value)}
                  style={{ width: 200 }}
                />
              </div>}
              bordered
              style={{height:"calc(100vh - 400px)"}}
              dataSource={this.state.subData}
              renderItem={(item,i) => (<List.Item style={{cursor:'pointer'}} onClick={this.onClickCustom.bind(this,i)}>
                                    <div style={{ display:"flex",flex:1,flexDirection: 'row',alignItems:'center'}}>
                                      <div style={{display:"flex",flex:1}}>
                                        <Checkbox checked={item.check}/>
                                      </div>
                                      <div style={{display:"flex",flex:10,flexDirection:"column"}}>
                                        <div style={{display:"flex",flex:1,flexDirection:"row",justifyContent:"space-between",marginBottom:"16px"}}>
                                          <div style={{display:"flex",flex:1}}>
                                            <span>{item.C3_609845305680==null?"无":item.C3_609845305680}</span>
                                          </div>
                                          <div style={{display:"flex",flex:1}}>
                                            <span>{item.C3_610390419677==null?"无":item.C3_610390419677}</span>
                                          </div>
                                          <div style={{display:"flex",flex:1,flexDirection:'row',alignItems:'center'}}>
                                            <div style={{width:"10px",height:"10px",borderRadius:"50%",background:"#4a90e2",marginRight:"16px"}}></div><span>{item.C3_610390410802==null?"无":item.C3_610390410802}</span>
                                          </div>
                                          <div style={{display:"flex",flex:1}}>
                                            <span>{item.C3_609845305931==null?"无":item.C3_609845305931}</span>
                                          </div>
                                        </div>
                                        <div style={{display:"flex",flex:1}}>
                                          <span>简介: {item.C3_609845305618==null?"无":item.C3_609845305618}</span>
                                        </div>
                                      </div>
                                      <div style={{display:"flex",flex:1}}>
                                        <Icon type = "ellipsis" style={{fontSize:"18px",border:"2px solid #555",borderRadius:"50%",padding:"3px"}}/>
                                      </div>
                                    </div>
                                  </List.Item>)}/>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"center"}}>
          <Button type="primary" style={{width:"100px"}} onClick={this.onClickSave.bind(this)}>保存</Button>
        </div>
      </div>
    );
  }
}

export default CreatePlan;