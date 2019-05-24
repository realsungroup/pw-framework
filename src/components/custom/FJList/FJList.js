import React from 'react';
import { TableData } from '../../common/loadableCommon';
import {
  Button,
  Icon,
  Radio,
  message,
  Select,
  List,
  Card,
  Modal,
  Input,
  Popconfirm,
  Tabs,
  Form
} from 'antd';
import http from '../../../util20/api';
import InfiniteScroll from 'react-infinite-scroller';
import qs from 'qs';
import { Link } from 'react-router-dom';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const Option = Select.Option;

class FJList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      subData: [],
      subbData: [],
      totalData: [],
      addCustom: [],
      kcxlData: [],
      kclbData: [],
      levelSelect: '',
      xlSelect: '',
      lbSelect: '',
      listIndex: 0,
      listNo: '',
      pNo: '',
      cnspmxb: '',
      visibleAdd: false,
      visibleEdit: false,
      visibleCustom: false,
      showHistory: false,
      showTab: false,
      addData: {},
      editData: {},
      plist: [],
      pageIndex: 0, // 当前页数
      totalPage: 0, // 总页数
      pageSize: 15, // 每页数量
      loading: false,
      hasMore: true,
      tabsKey: '1'
    };
  }

  componentDidMount() {
    const qsObj = qs.parse(window.location.search.substring(1));
    this.planid = qsObj.planid;
    this.getData();
    this.totalData();
    this.getLevel();
    this.getKcxl();
    this.getKclb();
    this.getSubbData();
    window.parent.pwCallback.modifyTitle('制定计划');
    // 监听父窗口发送的 message 事件
    window.addEventListener(
      'message',
      e => {
        if (!e || !e.source || !e.source.pwCallback) {
          return;
        }
        // 当事件类型为 "goBack"（即返回上一页时）
        // 1. 调用 history.goBack() 方法放回上一页
        // 2. 调用父级 window 对象下的 pwCallback.modifyTitle 方法，来修改窗口左上角的标题，其内容为上一页页面的标题
        if (e.data.type === 'goBack') {
          this.props.history.goBack();
          e.source.pwCallback.modifyTitle &&
            e.source.pwCallback.modifyTitle('财年计划');
        }
      },
      false
    );
  }

  //获取员工列表
  async getData() {
    let pageIndex = this.state.pageIndex;
    let pageSize = this.state.pageSize;
    let key = this.state.key;
    this.setState({ loading: true });
    let res = await http().getTable({
      resid: this.props.resid,
      key,
      pageIndex,
      pageSize
    });
    try {
      this.setState({ loading: false });
      if (res.error === 0) {
        if (res.data.length > 0) {
          let data = this.state.data;
          data = data.concat(res.data);
          data.forEach(e => {
            e.check = false;
          });
          data[this.state.listIndex].check = true;
          this.setState({
            data,
            listNo: data[0].C3_609622254861,
            pageIndex: ++this.state.pageIndex
          });
          this.getSubData(data[this.state.listIndex].C3_609622254861);
        }
      } else {
        message.error(res.message);
      }
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
  }

  //获取单个员工
  async getDataForOne() {
    let cmswhere =
      "C3_609622254861='" +
      this.state.data[this.state.listIndex].C3_609622254861 +
      "'";
    let res = await http().getTable({ resid: this.props.resid, cmswhere });
    try {
      if (res.error === 0) {
        if (res.data.length > 0) {
          let data = this.state.data;
          res.data[0].check = true;
          data[this.state.listIndex] = res.data[0];
          this.setState({ data });
          this.getSubData(data[this.state.listIndex].C3_609622254861);
        }
      } else {
        message.error(res.message);
      }
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
  }

  //获取统计数据
  async totalData() {
    let cmswhere = "C3_609616660273='" + this.planid + "'";
    let res = await http().getTable({ resid: this.props.totalResid, cmswhere });
    try {
      if (res.error === 0) {
        let totalData = res.data[0];
        this.setState({ totalData });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  //获取员工推荐课程
  async getSubData(e) {
    let res = await http().getTable({
      resid: this.props.subResid,
      cmswhere: "C3_609616893275 = '" + e + "'"
    });
    try {
      if (res.error === 0) {
        let subData = res.data;
        // console.log(subData)
        this.setState({ subData });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.log().error(err);
      return message.error(err.message);
    }
  }

  //获取课程表
  async getSubbData(key) {
    let cmswhere = '';
    if (this.state.levelSelect) {
      cmswhere += "C3_610763348502='" + this.state.levelSelect + "'";
    }
    if (this.state.xlSelect) {
      if (cmswhere != '') cmswhere += ' AND ';
      cmswhere += "C3_609845305368='" + this.state.xlSelect + "'";
    }
    if (this.state.lbSelect) {
      if (cmswhere != '') cmswhere += ' AND ';
      cmswhere += "C3_609845305305='" + this.state.lbSelect + "'";
    }
    if (this.state.kcState == 'Rec' && cmswhere == '')
      return this.setState({ subData: [] });
    let res = await http().getTable({
      resid: this.props.subbResid,
      key,
      cmswhere
    });
    try {
      if (res.error === 0) {
        let subbData = res.data;
        if (subbData.length > 0) {
          subbData.forEach(e => {
            e.check = false;
          });
          // subbData[0].check = true
        }
        this.setState({ subbData, addData: subbData[0] });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.log().error(err);
      return message.error(err.message);
    }
  }

  //单选员工
  onClick(listNo, i) {
    console.log(i);
    let data = this.state.data;
    data.forEach(e => {
      e.check = false;
      if (e.C3_609622254861 == listNo) e.check = true;
    });
    this.setState({ data, listNo, listIndex: i });
    this.getSubData(listNo);
  }

  //添加课程
  async addCourse() {
    this.setState({ visibleAdd: false, visibleEdit: false });
    let addData = this.state.addData;
    addData.C3_609616893275 = this.state.data[
      this.state.listIndex
    ].C3_609622254861;
    addData.C3_609616868478 = addData.C3_609845305680;
    addData.C3_609616906353 = addData.C3_609845305931;
    addData.C3_611314815828 = addData.C3_609845305993;
    addData.C3_611314816141 = addData.C3_609845305868;
    addData.C3_611314816469 = addData.C3_609845305618;
    addData.C3_611314815656 = addData.C3_609845463949;
    addData.C3_611314815266 = addData.C3_610390419677;
    addData.C3_611314815485 = addData.C3_610390410802;
    addData.C3_609616805633 = this.planid;
    let res;
    try {
      res = await http().addRecords({
        resid: this.props.subResid,
        data: [{ ...addData }]
      });
      if (res.Error === 0) {
        this.getDataForOne();
        this.totalData();
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
  async addCustom() {
    let addCustom = this.state.addCustom;
    if (
      addCustom.C3_609616868478 == '' ||
      addCustom.C3_609616868478 == undefined
    )
      return message.error('课程名不能为空');
    if (
      addCustom.C3_609616906353 == '' ||
      addCustom.C3_609616906353 == undefined
    )
      return message.error('费用不能为空');
    this.setState({ visibleCustom: false });
    addCustom.C3_609616893275 = this.state.data[
      this.state.listIndex
    ].C3_609622254861;
    addCustom.C3_611406136484 = 'Y';
    addCustom.C3_609616805633 = this.planid;
    let res = await http().addRecords({
      resid: this.props.subResid,
      data: [{ ...addCustom }]
    });
    try {
      if (res.Error === 0) {
        this.getDataForOne();
        this.totalData();
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
  async delCourse(i) {
    let res = await http().removeRecords({
      resid: this.props.subResid,
      data: [this.state.subData[i]]
    });
    try {
      if (res.Error === 0) {
        this.getDataForOne();
        this.totalData();
        message.success(res.message);
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  //修改课程
  async editCourse(i) {
    let data = this.state.cnspmxb;
    let editData = this.state.editData;
    if (data.C3_609616868478 == '' || data.C3_609616868478 == undefined)
      return message.error('课程名不能为空');
    if (data.C3_609616906353 == '' || data.C3_609616906353 == undefined)
      return message.error('费用不能为空');
    this.setState({ visibleAdd: false, visibleEdit: false });
    if (data.C3_611406136484 != 'Y') {
      data.C3_609616868478 = editData.C3_609845305680;
      data.C3_611314815828 = editData.C3_609845305993;
      data.C3_611314815266 = editData.C3_610390419677;
      data.C3_611314815485 = editData.C3_610390410802;
      data.C3_609616906353 = editData.C3_609845305931;
      data.C3_611314816469 = editData.C3_609845305618;
    }
    let res;
    try {
      res = await http().modifyRecords({
        resid: this.props.subResid,
        data: [data]
      });
      if (res.Error === 0) {
        this.getDataForOne();
        this.totalData();
        return message.success(res.message);
      } else {
        message.error(res.message);
      }
    } catch (err) {
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

  //选择课程
  onClickCustom(i) {
    let subbData = this.state.subbData;
    subbData.forEach(e => {
      e.check = false;
    });
    subbData[i].check = true;
    this.setState({ subbData, addData: subbData[i] });
  }

  //选择修改课程
  onEditCustom(i) {
    let subbData = this.state.subbData;
    subbData.forEach(e => {
      e.check = false;
    });
    subbData[i].check = true;
    this.setState({ subbData, editData: subbData[i] });
  }

  render() {
    let subData = this.state.subData;
    let totalData = this.state.totalData;
    let subbData = this.state.subbData;
    let kcxlData = this.state.kcxlData;
    let kclbData = this.state.kclbData;
    return (
      <div
        style={{ display: 'flex', flexDirection: 'row', background: '#fff' }}
      >
        <div style={{ width: '50%', padding: '16px 28px' }}>
          <div
            style={{
              display: 'flex',
              flex: 3,
              padding: '5px 0',
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            <Link
              to={{
                pathname: '/fnmodule',
                search:
                  '?resid=创建计划&recid=610555514606&type=前端功能入口&title=创建计划&planid=' +
                  this.planid
              }}
              target="_self"
            >
              <Button type="primary" style={{ marginRight: '10px' }}>
                创建计划
              </Button>
            </Link>

            <div
              style={{
                flex: 9,
                display: 'flex',
                justifyContent: 'space-around',
                padding: '0 10px'
              }}
            >
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {totalData.C3_609616006519 == 'SH' ? '上海' : '无锡'}
              </span>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                财年: {totalData.C3_609615869581}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flex: 3,
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '14px' }}>
                人数: {totalData.C3_609615996253}
              </span>
              <span style={{ fontSize: '14px' }}>
                总预算: {totalData.C3_609616030566}
              </span>
              <span style={{ fontSize: '14px' }}>
                总费用: {totalData.C3_609616051191}
              </span>
            </div>
          </div>
          <div style={{ height: 'calc(100vh - 170px)', overflow: 'auto' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Search
                      placeholder="搜索"
                      onSearch={value =>
                        this.setState(
                          { key: value, data: [], pageIndex: 0 },
                          () => this.getData()
                        )
                      }
                      style={{ width: 200 }}
                    />
                  </div>
                }
                // footer={<div>Footer</div>}
                bordered
                dataSource={this.state.data}
                renderItem={(item, i) => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    onClick={this.onClick.bind(this, item.C3_609622254861, i)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ display: 'flex', flex: 1 }}>
                          <Radio checked={item.check} />
                        </div>
                        <div style={{ display: 'flex', flex: 2 }}>
                          <Icon type="user" style={{ fontSize: '24px' }} />
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flex: 4,
                            flexDirection: 'column'
                          }}
                        >
                          <div>
                            <span>
                              {item.C3_609622254861 == null
                                ? '无'
                                : item.C3_609622254861}
                            </span>
                          </div>
                          <div>
                            <span>
                              {item.C3_609622263470 == null
                                ? '无'
                                : item.C3_609622263470}
                            </span>
                          </div>
                          <div>
                            <span>
                              课程数：
                              {item.C3_611409498941 == null
                                ? '无'
                                : item.C3_611409498941}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flex: 4,
                            flexDirection: 'column'
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center'
                            }}
                          >
                            <div
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#4a90e2',
                                marginRight: '16px'
                              }}
                            />
                            <span>
                              {item.C3_609622277252 == null
                                ? '无'
                                : item.C3_609622277252}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center'
                            }}
                          >
                            <div
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#4a90e2',
                                marginRight: '16px'
                              }}
                            />
                            <span>
                              {item.C3_609622292033 == null
                                ? '无'
                                : item.C3_609622292033}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center'
                            }}
                          >
                            <div
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#4a90e2',
                                marginRight: '16px'
                              }}
                            />
                            <span>
                              总费用：
                              {item.C3_611409509831 == null
                                ? '无'
                                : item.C3_611409509831}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flex: 1 }}>
                          {/* <Popover placement="topLeft"
                                                onClick={(e)=>e.stopPropagation()}
                                                content={<div style={{display:"flex",flexDirection: 'column'}}>
                                                                  <Button><Icon type = "file" style={{fontSize:"18px"}}/>历年绩效</Button>
                                                                  <Button><Icon type = "smile" style={{fontSize:"18px"}}/>员工发展</Button>
                                                                  <Button><Icon type = "swap" style={{fontSize:"18px"}}/>历史计划</Button>
                                                                </div>} trigger="click" >
                                                <Icon type = "right-circle" style={{fontSize:"18px"}}/>
                                              </Popover> */}
                          <Icon
                            type="right-circle"
                            rotate={item.check ? 270 : 0}
                            style={{ fontSize: '18px' }}
                          />
                        </div>
                      </div>
                      {item.check && (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            marginTop: '10px'
                          }}
                        >
                          <span
                            style={{ fontSize: '16px', fontWeight: 'bold' }}
                            onClick={e => {
                              this.setState({
                                showTab: true,
                                tabsKey: '1',
                                pNo: item.C3_609622254861
                              });
                              e.stopPropagation();
                            }}
                          >
                            历年绩效
                          </span>
                          <div
                            style={{
                              width: '2px',
                              height: '20px',
                              background: '#ddd'
                            }}
                          />
                          <span
                            style={{ fontSize: '16px', fontWeight: 'bold' }}
                            onClick={e => {
                              this.setState({
                                showTab: true,
                                tabsKey: '2',
                                pNo: item.C3_609622254861
                              });
                              e.stopPropagation();
                            }}
                          >
                            历史计划
                          </span>
                          <div
                            style={{
                              width: '2px',
                              height: '20px',
                              background: '#ddd'
                            }}
                          />
                          <span
                            style={{ fontSize: '16px', fontWeight: 'bold' }}
                            onClick={e => {
                              this.setState({
                                showTab: true,
                                tabsKey: '3',
                                pNo: item.C3_609622254861
                              });
                              e.stopPropagation();
                            }}
                          >
                            员工个人发展
                          </span>
                        </div>
                      )}
                    </div>
                  </List.Item>
                )}
              />
            </InfiniteScroll>
          </div>
        </div>
        <div style={{ width: '50%', padding: '16px 28px' }}>
          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: '5px 0'
            }}
          >
            <div style={{ flex: 9 }}>
              <Button
                type="primary"
                onClick={() => this.setState({ showHistory: true })}
              >
                历史记录
              </Button>
            </div>
            <div
              style={{
                display: 'flex',
                flex: 2,
                flexDirection: 'column',
                justifyContent: 'space-around',
                height: '63px'
              }}
            >
              {/* <span style={{fontSize:"14px"}}>
                课程数:10
              </span>
              <span style={{fontSize:"14px"}}>
                个人预算:10
              </span>
              <span style={{fontSize:"14px"}}>
                个人费用:10
              </span> */}
            </div>
          </div>
          {subData.length > 0 ? (
            <div style={{ height: 'calc(100vh - 170px)', overflowY: 'scroll' }}>
              {subData.map((item, i) => (
                <Card
                  title={item.C3_609616868478}
                  style={{ display: 'flex', flex: 1 }}
                  key={i}
                  extra={
                    <Popconfirm
                      placement="topRight"
                      title={'确认要删除么?'}
                      onConfirm={this.delCourse.bind(this, i)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <Icon type="delete" style={{ cursor: 'pointer' }} />
                    </Popconfirm>
                  }
                  style={{ marginBottom: '16px' }}
                  actions={[
                    <a
                      href="#"
                      onClick={() =>
                        this.setState(
                          {
                            editData: { ...subData[i] },
                            visibleEdit: true,
                            cnspmxb: item
                          },
                          () => {
                            subbData.forEach(e => {
                              e.check = false;
                              if (e.C3_609845305680 == item.C3_609616868478)
                                e.check = true;
                            });
                            this.setState({ subbData });
                          }
                        )
                      }
                    >
                      修改
                    </a>,
                    <a />
                  ]}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontSize: '12px' }}>费用</span>
                    <span style={{ fontSize: '12px' }}>
                      {item.C3_609616906353}
                    </span>
                  </div>
                  {item.C3_611406136484 != 'Y' && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>课时</span>
                      <span style={{ fontSize: '12px' }}>
                        {item.C3_611314815828}
                      </span>
                    </div>
                  )}
                  {item.C3_611406136484 != 'Y' && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>讲师</span>
                      <span style={{ fontSize: '12px' }}>
                        {item.C3_611314815266}
                      </span>
                    </div>
                  )}
                  {item.C3_611406136484 != 'Y' && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>培训地</span>
                      <span style={{ fontSize: '12px' }}>
                        {item.C3_611314815485}
                      </span>
                    </div>
                  )}
                  {item.C3_611406136484 != 'Y' && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>课程介绍</span>
                      <span style={{ fontSize: '12px' }}>
                        {item.C3_611314816469}
                      </span>
                    </div>
                  )}
                  {item.C3_611406136484 != 'Y' && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>课程大纲</span>
                      <a target="_blank" href={item.C3_611314815656}>
                        <Icon type="fund" style={{ fontSize: '22px' }} />
                      </a>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <List
              size="large"
              bordered
              style={{
                height: 'calc(100vh - 170px)',
                overflowY: 'scroll',
                display: 'flex',
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              dataSource={subData}
            />
          )}
          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
              padding: '5px 0',
              marginTop: '20px'
            }}
          >
            <Button
              type="default"
              style={{ width: 'calc(50% - 80px)' }}
              onClick={() => this.setState({ visibleAdd: true })}
            >
              添加课程
            </Button>
            <Button
              type="default"
              style={{ width: 'calc(50% - 80px)' }}
              onClick={() => this.setState({ visibleCustom: true })}
            >
              自定义课程
            </Button>
          </div>
          <Modal
            title="历史记录"
            width={'80%'}
            destroyOnClose={true}
            visible={this.state.showHistory}
            onOk={() => this.setState({ showHistory: false })}
            onCancel={() => this.setState({ showHistory: false })}
          >
            <TableData
              height={'calc(100vh - 300px)'}
              resid={611316474296}
              cmswhere={`C3_609617197183 = '${this.state.pNo}'`}
              recordFormFormWidth={'90%'}
              hasBeBtns={false}
              hasModify={false}
              hasDelete={false}
              hasAdd={false}
              hasRowDelete={false}
              hasRowModify={false}
              hasRowView={false}
              subtractH={190}
            />
          </Modal>
          <Modal
            title="课程大纲"
            destroyOnClose={true}
            visible={this.state.showOutline}
            onOk={() => this.setState({ showOutline: false })}
            onCancel={() => this.setState({ showOutline: false })}
          />
          <Modal
            destroyOnClose={true}
            width={'80%'}
            visible={this.state.showTab}
            onOk={() => this.setState({ showTab: false })}
            onCancel={() => this.setState({ showTab: false })}
          >
            <Tabs defaultActiveKey={this.state.tabsKey}>
              <TabPane tab="历年绩效" key="1">
                <TableData
<<<<<<< HEAD
                  // height={"calc(100vh - 300px)"}
                  resid={420130498195}
                  recordFormFormWidth={"90%"}
=======
                  height={'calc(100vh - 300px)'}
                  resid={610657610335}
                  recordFormFormWidth={'90%'}
>>>>>>> 41417848884ac18efba33e1ac3aa5a701675d7b2
                  hasBeBtns={false}
                  cmswhere={`C3_420148203323 = '${this.state.pNo}'`}
                  hasModify={false}
                  hasDelete={false}
                  hasAdd={false}
                  hasRowDelete={false}
                  hasRowModify={false}
                  hasRowView={false}
                  // subtractH={190}
                />
              </TabPane>
              <TabPane tab="历史计划" key="2">
                <TableData
                  height={'calc(100vh - 300px)'}
                  resid={611315248461}
                  cmswhere={`C3_609616893275 = '${this.state.pNo}'`}
                  recordFormFormWidth={'90%'}
                  hasBeBtns={false}
                  hasModify={false}
                  hasDelete={false}
                  hasAdd={false}
                  hasRowDelete={false}
                  hasRowModify={false}
                  hasRowView={false}
                  subtractH={190}
                />
              </TabPane>
              <TabPane tab="员工个人发展" key="3">
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
            width="60%"
            destroyOnClose={true}
            visible={this.state.visibleAdd}
            onOk={this.addCourse.bind(this)}
            onCancel={() => this.setState({ visibleAdd: false })}
          >
            <List
              size="large"
              header={
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Select
                    style={{ width: '100px' }}
                    defaultValue="Rec"
                    onChange={e => {
                      if (e == 'Rec') {
                        this.setState(
                          { levelSelect: this.state.lkState, kcState: e },
                          () => this.getSubbData()
                        );
                      } else {
                        this.setState(
                          {
                            levelSelect: '',
                            kcState: 'All'
                          },
                          () => this.getSubbData()
                        );
                      }
                    }}
                  >
                    <Option value="All">全部课程</Option>
                    <Option value="Rec">推荐课程</Option>
                  </Select>
                  <Select
                    style={{ width: '100px' }}
                    defaultValue=""
                    onChange={e => {
                      this.setState({ xlSelect: e }, () => this.getSubbData());
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
                    style={{ width: '100px' }}
                    defaultValue=""
                    onChange={e => {
                      this.setState({ lbSelect: e }, () => this.getSubbData());
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
                    onSearch={value => this.getSubbData(value)}
                    style={{ width: 200 }}
                  />
                </div>
              }
              bordered
              style={{ height: 'calc(100vh - 350px)', overflowY: 'scroll' }}
              dataSource={this.state.subbData}
              renderItem={(item, i) => (
                <List.Item
                  style={{ cursor: 'pointer' }}
                  onClick={this.onClickCustom.bind(this, i)}
                >
                  <div
                    style={{
                      display: 'flex',
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', flex: 1 }}>
                      <Radio checked={item.check} />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flex: 10,
                        flexDirection: 'column'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: '16px'
                        }}
                      >
                        <div style={{ display: 'flex', flex: 1 }}>
                          <span>
                            {item.C3_609845305680 == null
                              ? '无'
                              : item.C3_609845305680}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flex: 1 }}>
                          <span>
                            {item.C3_610390419677 == null
                              ? '无'
                              : item.C3_610390419677}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}
                        >
                          <div
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: '#4a90e2',
                              marginRight: '16px'
                            }}
                          />
                          <span>
                            {item.C3_610390410802 == null
                              ? '无'
                              : item.C3_610390410802}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flex: 1 }}>
                          <span>
                            {item.C3_609845305931 == null
                              ? '无'
                              : item.C3_609845305931}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flex: 1 }}>
                        <span>
                          简介:{' '}
                          {item.C3_609845305618 == null
                            ? '无'
                            : item.C3_609845305618}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flex: 1 }}>
                      <a target="_blank" href={item.C3_609845463949}>
                        <Icon type="fund" style={{ fontSize: '22px' }} />
                      </a>
                    </div>
                  </div>
                </List.Item>
              )}
            />
            {/* <div style={{display:"flex",flexDirection:"row",margin:"10px"}}>
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
            </div> */}
          </Modal>
          <Modal
            title="添加自定义课程"
            destroyOnClose={true}
            visible={this.state.visibleCustom}
            onOk={this.addCustom.bind(this)}
            onCancel={() => this.setState({ visibleCustom: false })}
          >
            <div
              style={{ display: 'flex', flexDirection: 'row', margin: '10px' }}
            >
              <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                <span
                  style={{ flex: 1, textAlign: 'right', paddingRight: '16px' }}
                >
                  课程名称:
                </span>
              </div>
              <div style={{ flex: 3 }}>
                <Input
                  onChange={e => {
                    let addCustom = this.state.addCustom;
                    addCustom.C3_609616868478 = e.target.value;
                    this.setState({ addCustom });
                  }}
                />
              </div>
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'row', margin: '10px' }}
            >
              <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                <span
                  style={{ flex: 1, textAlign: 'right', paddingRight: '16px' }}
                >
                  费用:
                </span>
              </div>
              <div style={{ flex: 3 }}>
                <Input
                  onChange={e => {
                    let addCustom = this.state.addCustom;
                    addCustom.C3_609616906353 = e.target.value;
                    this.setState({ addCustom });
                  }}
                />
              </div>
            </div>
          </Modal>
          <Modal
            title="修改课程"
            width={this.state.cnspmxb.C3_611406136484 == 'Y' ? '520px' : '60%'}
            destroyOnClose={true}
            visible={this.state.visibleEdit}
            onOk={this.editCourse.bind(this)}
            onCancel={() => this.setState({ visibleEdit: false })}
          >
            {this.state.cnspmxb.C3_611406136484 != 'Y' ? (
              <List
                size="large"
                header={
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Select
                      style={{ width: '100px' }}
                      defaultValue="Rec"
                      onChange={e => {
                        if (e == 'Rec') {
                          this.setState(
                            { levelSelect: this.state.lkState, kcState: e },
                            () => this.getSubbData()
                          );
                        } else {
                          this.setState(
                            {
                              levelSelect: '',
                              kcState: 'All'
                            },
                            () => this.getSubbData()
                          );
                        }
                      }}
                    >
                      <Option value="All">全部课程</Option>
                      <Option value="Rec">推荐课程</Option>
                    </Select>
                    <Select
                      style={{ width: '100px' }}
                      defaultValue=""
                      onChange={e => {
                        this.setState({ xlSelect: e }, () =>
                          this.getSubbData()
                        );
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
                      style={{ width: '100px' }}
                      defaultValue=""
                      onChange={e => {
                        this.setState({ lbSelect: e }, () =>
                          this.getSubbData()
                        );
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
                      onSearch={value => this.getSubbData(value)}
                      style={{ width: 200 }}
                    />
                  </div>
                }
                bordered
                style={{ height: 'calc(100vh - 350px)', overflowY: 'scroll' }}
                dataSource={this.state.subbData}
                renderItem={(item, i) => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    onClick={this.onEditCustom.bind(this, i)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', flex: 1 }}>
                        <Radio checked={item.check} />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flex: 10,
                          flexDirection: 'column'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: '16px'
                          }}
                        >
                          <div style={{ display: 'flex', flex: 1 }}>
                            <span>
                              {item.C3_609845305680 == null
                                ? '无'
                                : item.C3_609845305680}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flex: 1 }}>
                            <span>
                              {item.C3_610390419677 == null
                                ? '无'
                                : item.C3_610390419677}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center'
                            }}
                          >
                            <div
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#4a90e2',
                                marginRight: '16px'
                              }}
                            />
                            <span>
                              {item.C3_610390410802 == null
                                ? '无'
                                : item.C3_610390410802}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flex: 1 }}>
                            <span>
                              {item.C3_609845305931 == null
                                ? '无'
                                : item.C3_609845305931}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flex: 1 }}>
                          <span>
                            简介:{' '}
                            {item.C3_609845305618 == null
                              ? '无'
                              : item.C3_609845305618}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flex: 1 }}>
                        <a target="_blank" href={item.C3_609845463949}>
                          <Icon type="fund" style={{ fontSize: '22px' }} />
                        </a>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    margin: '10px'
                  }}
                >
                  <div
                    style={{ display: 'flex', flex: 1, alignItems: 'center' }}
                  >
                    <span
                      style={{
                        flex: 1,
                        textAlign: 'right',
                        paddingRight: '16px'
                      }}
                    >
                      课程名称:
                    </span>
                  </div>
                  <div style={{ flex: 3 }}>
                    <Input
                      defaultValue={this.state.cnspmxb.C3_609616868478}
                      onChange={e => {
                        let cnspmxb = JSON.parse(
                          JSON.stringify(this.state.cnspmxb)
                        );
                        cnspmxb.C3_609616868478 = e.target.value;
                        this.setState({ cnspmxb });
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    margin: '10px'
                  }}
                >
                  <div
                    style={{ display: 'flex', flex: 1, alignItems: 'center' }}
                  >
                    <span
                      style={{
                        flex: 1,
                        textAlign: 'right',
                        paddingRight: '16px'
                      }}
                    >
                      费用:
                    </span>
                  </div>
                  <div style={{ flex: 3 }}>
                    <Input
                      defaultValue={this.state.cnspmxb.C3_609616906353}
                      onChange={e => {
                        let cnspmxb = JSON.parse(
                          JSON.stringify(this.state.cnspmxb)
                        );
                        cnspmxb.C3_609616906353 = e.target.value;
                        this.setState({ cnspmxb });
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </Modal>
          <Modal
            title="创建计划"
            width="80%"
            destroyOnClose={true}
            visible={this.state.showPlanModal}
            onOk={() => this.setState({ showPlanModal: false })}
            onCancel={() => this.setState({ showPlanModal: false })}
          />
        </div>
      </div>
    );
  }
}

export default FJList;
