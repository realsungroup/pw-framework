import React from "react";
import { TableDataC } from "../loadableCustom";
import { TableData } from "../../common/loadableCommon";
import { Button, Icon, Checkbox, message, Popover,List,Card  } from "antd";
import { saveMultipleRecord } from "../../../util/api";
import http from "../../../util20/api";

class FJList extends React.Component {
  state = { visible: false, date: "", dataSource: [], selectedRowKeys: "" };
  constructor(props) {
    super(props);
    const { subTableArr } = props;
    const hasSubTables = Array.isArray(subTableArr) && !!subTableArr.length;
    this.state = {
      loading: false,
      data:[]
    };
  }

  componentDidMount(){
    this.getData();
  };

  async getData(){
    let res = await http().getTable({ resid: this.props.resid });
    try {
      let data = res.data
      data.forEach(e => {
        e.check = false
      });
      this.setState({data});
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }
  
  // async getSubData(){
  //   let res = await http().getTable({ resid: this.props.resid });
  //   try {
  //     console.log(res.data)
  //     let data = res.data
  //     data.forEach(e => {
  //       e.check = false
  //     });
  //     this.setState({data});
  //   } catch (err) {
  //     console.error(err);
  //     return message.error(err.message);
  //   }
  // }
  
  onClick(no){
    let data = this.state.data
    data.forEach(e => {
      if(e.C3_609622254861==no)e.check=!e.check
    });
    this.setState({data});
  }

  render() {
    let subData = this.state.data
    return (
      <div style={{ display:"flex",flexDirection: 'row',background:"#fff"}}>
        <div style={{ width: "50%",padding: '16px 28px'}}> 
            <div style={{display:"flex",flex:3,padding: '5px 0',flexDirection: 'row',justifyContent: 'space-around' }}>
              <Button type="primary">创建计划</Button>
              <div style={{ flex:9, display:"flex",justifyContent: 'space-around',padding: '0 80px'}}>
                <span style={{fontSize:"24px",fontWeight:"bold"}}>
                  上海
                </span>
                <span style={{fontSize:"24px",fontWeight:"bold"}}>
                  财年:FY2019
                </span>
              </div>
              <div style={{ display:"flex",flex:2,flexDirection: 'column',justifyContent: 'space-around' }}>
                <span style={{fontSize:"10px"}}>
                  人数:10
                </span>
                <span style={{fontSize:"10px"}}>
                  总预算:10
                </span>
                <span style={{fontSize:"10px"}}>
                  总费用:10
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
                                        <Checkbox checked={item.check}></Checkbox>
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
                课程数数:10
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
              <Card title="课程名"
                key={i}
                extra={<Icon type="delete" style={{cursor:'pointer'}}/>} style={{marginBottom:"16px"}}
                actions={[<a href="#">修改</a>,<span></span>,]}
              >
                <div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"10px"}}>
                    课程数数
                  </span>
                  <span style={{fontSize:"10px"}}>
                    1000
                  </span>
                </div>
                <div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"10px"}}>
                    制定人
                  </span>
                  <span style={{fontSize:"10px"}}>
                    张三
                  </span>
                </div>
                <div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"10px"}}>
                    修改人
                  </span>
                  <span style={{fontSize:"10px"}}>
                    李四
                  </span>
                </div>
                <div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"10px"}}>
                    培训机构
                  </span>
                  <span style={{fontSize:"10px"}}>
                    王五培训
                  </span>
                </div>
                <div style={{ display:"flex",flexDirection: 'row',justifyContent: 'space-between' }}>
                  <span style={{fontSize:"10px"}}>
                    简介
                  </span>
                  <span style={{fontSize:"10px"}}>
                    阿斯蒂芬啦时代街坊邻居哦玩家坡底健身房
                  </span>
                </div>
              </Card>
            ))}
          </div>
          <div style={{display:"flex",flex:1,flexDirection: 'row',justifyContent: 'space-around',padding: '5px 0',marginTop:"20px"}}>
            <Button type="default" style={{ width: "calc(50% - 80px)" }}>添加课程</Button>
            <Button type="default" style={{ width: "calc(50% - 80px)" }}>自定义课程</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default FJList;