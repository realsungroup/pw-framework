import React from "react";
import InfiniteScroll from 'react-infinite-scroller';
import {
  Button,
  Icon,
  Checkbox,
  message,
  Popover,
  List,
  Select,
  Modal,
  Input
} from "antd";
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
      kcxlData: [],
      kclbData: [],
      levelSelect: "",
      xlSelect: "",
      lbSelect: "",
      kclbState: "",
      lkState: "",
      kcState: "",
      pageIndex: 0, // 当前页数
      totalPage: 0, // 总页数
      pageSize: 15, // 每页数量
      loading: false,
      hasMore: true,
      key:""
    };
  }

  componentDidMount() {
    this.getData();
    this.getLevel();
    this.getKcxl();
    this.getKclb();
  }

  //获取员工列表
  async getData() {
    let pageIndex = this.state.pageIndex
    let pageSize = this.state.pageSize
    let key = this.state.key
    this.setState({loading: true})
    let res = await http().getTable({ resid: this.props.resid, key ,pageIndex,pageSize});
    try {
      this.setState({loading: false})
      if (res.error === 0) {
        if(res.data.length>0){
          let data = this.state.data
          data = data.concat(res.data)
          // console.log(res.data)
          data.forEach(e => {
            e.check = false;
          });
          this.setState({ data, oldData: data,pageIndex:++this.state.pageIndex });
        }
      } else {
        message.error(res.message);
      }
    } catch (err) {
      this.setState({loading: false})
      console.error(err);
      return message.error(err.message);
    }
  }

  //获取员工级别
  async getLevel() {
    let res = await http().getTable({ resid: this.props.levelId });
    try {
      if (res.error === 0) {
        let levelData = res.data;
        this.setState({ levelData });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  //获取课程表
  async getSubData(key) {
    let cmswhere = "";
    if (this.state.levelSelect) {
      cmswhere += "C3_610763348502='" + this.state.levelSelect + "'";
    }
    if (this.state.xlSelect) {
      if(cmswhere!="")cmswhere+=" AND "
      cmswhere += "C3_609845305368='" + this.state.xlSelect + "'";
    }
    if (this.state.lbSelect) {
      if(cmswhere!="")cmswhere+=" AND "
      cmswhere += "C3_609845305305='" + this.state.lbSelect + "'";
    }
    if (this.state.kcState == "Rec" && cmswhere == "")
      return this.setState({ subData: [] });
    if (this.state.kcState == "All") cmswhere = "";
    let res = await http().getTable({
      resid: this.props.subResid,
      key,
      cmswhere
    });
    try {
      if (res.error === 0) {
        let subData = res.data;
        subData.forEach(e => {
          e.check = false;
        });
        this.setState({ subData });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.log().error(err);
      return message.error(err.message);
    }
  }

  //获取课程系列
  async getKcxl() {
    let res = await http().getTable({ resid: this.props.kcxlResid });
    try {
      if (res.error === 0) {
        let kcxlData = res.data;
        this.setState({ kcxlData });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  //获取课程类别
  async getKclb() {
    let res = await http().getTable({ resid: this.props.kclbResid });
    try {
      if (res.error === 0) {
        let kclbData = res.data;
        this.setState({ kclbData });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  //选择员工
  onClick(i) {
    let data = this.state.data;
    if (data[i].check == true) {
      this.setState({ levelSelect: "", lkState: "", subData: [] });
    } else {
      this.setState(
        {
          levelSelect: data[i].C3_609622292033,
          lkState: data[i].C3_609622292033
        },
        () => this.getSubData()
      );
    }
    data[i].check = !data[i].check;
    this.setState({ data });
  }

  //选择课程
  onClickCustom(i) {
    let subData = this.state.subData;
    subData[i].check = !subData[i].check;
    this.setState({ subData });
  }

  //保存计划
  async onClickSave() {
    let x = 0,
      y = 0,
      data = this.state.data,
      subData = this.state.subData,
      planData = [];
    subData.forEach(ele => {
      if (ele.check == true) {
        y++;
        data.forEach(e => {
          if (e.check == true) {
            x++
            let obj = JSON.parse(JSON.stringify(ele))
            obj.C3_609616893275 = e.C3_609622254861
            obj.C3_609616868478 = obj.C3_609845305680
            obj.C3_609616906353 = obj.C3_609845305931
            obj.C3_611314815828 = obj.C3_609845305993
            obj.C3_611314816141 = obj.C3_609845305868
            obj.C3_611314816469 = obj.C3_609845305618
            obj.C3_611314815656 = obj.C3_609845463949
            obj.C3_611314815266 = obj.C3_610390419677
            obj.C3_611314815485 = obj.C3_610390410802
            planData.push(obj)
          }
        });
      }
    });
    if (y == 0) return message.error("至少选择一个课程");
    if (x == 0) return message.error("至少选择一个员工");
    let res;
    try {
      res = await http().addRecords({
        resid: this.props.kcbResid,
        data: planData
      });
      if (res.Error === 0) {
        message.success(res.message);
        window.location.href =
          "/fnmodule?resid=610555787304&recid=610555815210&type=前端功能入口&title=财年计划管理";
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  render() {
    let levelData = this.state.levelData;
    let kcxlData = this.state.kcxlData;
    let kclbData = this.state.kclbData;
    return (
      <div style={{ padding: "16px", background: "#fff" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "50%", padding: "10px 28px" }}>
            <div style={{ paddingBottom: "24px" }}>
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                选择员工
              </span>
            </div>
            <div style={{height:"calc(100vh - 330px)",overflow: "auto"}}>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.getData.bind(this)}
                hasMore={true}
                useWindow={false}
              >
                <List
                  size="large"
                  loading={this.state.loading}
                  header={
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <Select
                        style={{ width: "100px" }}
                        defaultValue="All"
                        onChange={e => {
                          let data = [],
                            oldData = this.state.oldData;
                          if (e == "All") {
                            data = oldData;
                          } else {
                            oldData.forEach(ele => {
                              ele.check = false;
                              if (ele.C3_609622292033 == e) data.push(ele);
                            });
                          }
                          this.setState({ data });
                        }}
                      >
                        <Option value="All">全部级别</Option>
                        {levelData.map((item, i) => (
                          <Option value={item.C3_587136281870} key={i}>
                            {item.C3_587136281870}
                          </Option>
                        ))}
                      </Select>
                      <Search
                        placeholder="搜索"
                        onSearch={value => this.setState({key:value,data:[],pageIndex:0},()=>this.getData())}
                        style={{ width: 200 }}
                      />
                    </div>
                  }
                  // footer={<div>Footer</div>}
                  bordered
                  dataSource={this.state.data}
                  renderItem={(item, i) => (
                    <List.Item
                      style={{ cursor: "pointer" }}
                      onClick={this.onClick.bind(this, i)}
                    >
                      <div
                        style={{
                          display: "flex",
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center"
                        }}
                      >
                        <div style={{ display: "flex", flex: 1 }}>
                          <Checkbox checked={item.check} />
                        </div>
                        <div style={{ display: "flex", flex: 2 }}>
                          <Icon type="user" style={{ fontSize: "24px" }} />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flex: 4,
                            flexDirection: "column"
                          }}
                        >
                          <div>
                            <span>
                              {item.C3_609622254861 == null
                                ? "无"
                                : item.C3_609622254861}
                            </span>
                          </div>
                          <div>
                            <span>
                              {item.C3_609622263470 == null
                                ? "无"
                                : item.C3_609622263470}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flex: 4,
                            flexDirection: "column"
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center"
                            }}
                          >
                            <div
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                background: "#4a90e2",
                                marginRight: "16px"
                              }}
                            />
                            <span>
                              {item.C3_609622277252 == null
                                ? "无"
                                : item.C3_609622277252}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center"
                            }}
                          >
                            <div
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                background: "#4a90e2",
                                marginRight: "16px"
                              }}
                            />
                            <span>
                              {item.C3_609622292033 == null
                                ? "无"
                                : item.C3_609622292033}
                            </span>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </div>
          <div style={{ width: "50%", padding: "10px 28px" }}>
            <div style={{ paddingBottom: "24px" }}>
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                选择课程
              </span>
            </div>
            <List
              size="large"
              header={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Select
                    style={{ width: "100px" }}
                    defaultValue="Rec"
                    onChange={e => {
                      if (e == "Rec") {
                        this.setState(
                          { levelSelect: this.state.lkState, kcState: e },
                          () => this.getSubData()
                        );
                      } else {
                        this.setState(
                          {
                            levelSelect: "",
                            xlSelect: "",
                            lbSelect: "",
                            kcState: "All"
                          },
                          () => this.getSubData()
                        );
                      }
                    }}
                  >
                    <Option value="All">全部课程</Option>
                    <Option value="Rec">推荐课程</Option>
                  </Select>
                  <Select
                    style={{ width: "100px" }}
                    defaultValue=""
                    onChange={e => {
                      this.setState({ xlSelect: e }, () => this.getSubData());
                    }}
                  >
                    <Option value="">全部系列</Option>
                    {kcxlData.map((item, i) => (
                      <Option value={item.C3_460380578456} key={i}>
                        {item.C3_460380572730}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    style={{ width: "100px" }}
                    defaultValue=""
                    onChange={e => {
                      this.setState({ lbSelect: e }, () => this.getSubData());
                    }}
                  >
                    <Option value="">全部类别</Option>
                    {kclbData.map((item, i) => (
                      <Option value={item.C3_460380249034} key={i}>
                        {item.C3_460380239253}
                      </Option>
                    ))}
                  </Select>
                  <Search
                    placeholder="搜索"
                    onSearch={value => this.getSubData(value)}
                    style={{ width: 200 }}
                  />
                </div>
              }
              bordered
              style={{ height: "calc(100vh - 350px)", overflowY: "scroll" }}
              dataSource={this.state.subData}
              renderItem={(item, i) => (
                <List.Item
                  style={{ cursor: "pointer" }}
                  onClick={this.onClickCustom.bind(this, i)}
                >
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <div style={{ display: "flex", flex: 1 }}>
                      <Checkbox checked={item.check} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: 10,
                        flexDirection: "column"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: "16px"
                        }}
                      >
                        <div style={{ display: "flex", flex: 1 }}>
                          <span>
                            {item.C3_609845305680 == null
                              ? "无"
                              : item.C3_609845305680}
                          </span>
                        </div>
                        <div style={{ display: "flex", flex: 1 }}>
                          <span>
                            {item.C3_610390419677 == null
                              ? "无"
                              : item.C3_610390419677}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center"
                          }}
                        >
                          <div
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: "#4a90e2",
                              marginRight: "16px"
                            }}
                          />
                          <span>
                            {item.C3_610390410802 == null
                              ? "无"
                              : item.C3_610390410802}
                          </span>
                        </div>
                        <div style={{ display: "flex", flex: 1 }}>
                          <span>
                            {item.C3_609845305931 == null
                              ? "无"
                              : item.C3_609845305931}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", flex: 1 }}>
                        <span>
                          简介:{" "}
                          {item.C3_609845305618 == null
                            ? "无"
                            : item.C3_609845305618}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flex: 1 }}>
                      <a
                        target="_blank"
                        href={item.C3_609845463949}
                      >
                        <Icon
                          type="ellipsis"
                          style={{
                            fontSize: "18px",
                            border: "2px solid #555",
                            borderRadius: "50%",
                            padding: "3px"
                          }}
                        />
                      </a>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            style={{ width: "100px" }}
            onClick={this.onClickSave.bind(this)}
          >
            保存
          </Button>
        </div>
      </div>
    );
  }
}

export default CreatePlan;
