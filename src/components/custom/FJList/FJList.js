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
  Skeleton
} from 'antd';
import http from 'Util20/api';
import InfiniteScroll from 'react-infinite-scroller';
import './FJList.less';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const Option = Select.Option;

class FJList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [], //员工列表
      subData: [], //推荐课程
      subbData: [], //课程表
      totalData: [], //统计数据
      addCustom: {}, //添加自定义课程数据
      kcxlData: [], //课程系列列表
      kclbData: [], //课程类别列表
      levelSelect: '', //课程级别
      xlSelect: '', //所选折课程系列
      lbSelect: '', //所选折课程类别
      listIndex: 0, //选中的员工索引
      listNo: '', //选中的员工编号
      cnspmxb: '', //选中课程数据
      visibleAdd: false, //添加模态框状态
      visibleEdit: false, //编辑模态框状态
      visibleCustom: false, //自定义课程模态框状态
      showHistory: false, //计划详情模态框状态
      showTab: false, //类别模态框状态
      addData: {}, //添加课程数据
      editData: {}, //编辑课程数据
      pageIndex: 0, // 当前页数
      totalPage: 0, // 总页数
      pageSize: 15, // 每页数量
      tabsKey: '1', //选项卡页面索引
      editCourseOldMoney: 0 //点击修改课程的时候保存之前的课程的金额
    };
  }

  async componentDidMount() {
    //const qsObj = qs.parse(window.location.search.substring(1));
    this.planid = this.props.planid;
    this.year = this.props.year;
    await this.totalData();
    // this.getData(0, true);
    this.getLevel();
    this.getKcxl();
    this.getKclb();
    this.getSubbData();
  }

  // 获取员工列表（根据财年、二级部门）
  async getData(arg1, isFirstPage = false) {
    if (
      this.state.loading ||
      (!isFirstPage && this.state.pageIndex + 1 > this.state.totalPage)
    ) {
      return;
    }
    let pageIndex = this.state.pageIndex;
    let pageSize = this.state.pageSize;
    let key = this.state.key;
    this.setState({ loading: true });
    let res = await http().getTable({
      resid: this.props.resid,
      key: key ? key : null,
      cmswhere: ` C3_613828994025 = '${this.state.totalData.C3_609616006519}'`,
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
            pageIndex: ++this.state.pageIndex,
            totalPage: Math.ceil(res.total / this.state.pageSize)
          });
          this.getSubData(data[this.state.listIndex].C3_609622254861);
        }
      } else {
        message.error(res.message);
      }
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
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
          console.log('获取单个员工', data);
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

  //获取员工推荐课程（根据员工编号和财年计划id）
  async getSubData(e) {
    let res = await http().getTable({
      resid: this.props.subResid,
      cmswhere: `C3_609616893275 = '${e}'`
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
    let cmswhere = `C3_609845305743 = '${this.state.totalData.C3_609615869581}' `;
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
            e.showDetail = false;
          });
        }
        this.setState({
          subbData
          // addData: subbData[0]  //为什么一进页面就要添加adddata,这样导致添加课程时不需要选择都能确认
        });
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
    let data = this.state.data;
    data.forEach(e => {
      e.check = false;
      if (e.C3_609622254861 == listNo) {
        e.check = true;
      }
    });
    this.setState({ data, listNo, listIndex: i });
    this.getSubData(listNo);
  }

  //添加课程
  async addCourse() {
    if (JSON.stringify(this.state.addData) == '{}') {
      message.error('未选择课程！');
      return;
    }
    // console.log(this.state.addData.C3_609845305931);
    // console.log(this.state.data[this.state.listIndex].C3_611409509831);
    if (
      this.state.data[this.state.listIndex].C3_611409509831 +
        this.state.addData.C3_609845305931 >
      this.state.totalData.C3_611074040082
    ) {
      message.error('已超出人均预算');
    }
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
    if (
      this.state.totalData.C3_611074040082 <
      // this.state.data[this.state.listIndex].C3_611409509831 +
      Number(this.state.addCustom.C3_609616906353)
    ) {
      message.error('已超出人均预算');
    }
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
    let res;
    try {
      res = await http().addRecords({
        resid: this.props.subResid,
        data: [{ ...addCustom }]
      });
      if (res.Error === 0) {
        this.getDataForOne();
        this.totalData();
        return message.success(res.message);
      } else {
        message.error(res.message);
      }
    } catch (err) {
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
    let allMoney = this.state.totalData.C3_611074040082;
    let newMoney;
    if (this.state.cnspmxb.C3_611406136484 != 'Y') {
      newMoney =
        this.state.data[this.state.listIndex].C3_611409509831 -
        this.state.editCourseOldMoney +
        Number(
          this.state.editData.C3_609845305931
            ? this.state.editData.C3_609845305931
            : this.state.editData.C3_609616906353
        );
    } else {
      newMoney =
        this.state.data[this.state.listIndex].C3_611409509831 -
        this.state.editCourseOldMoney +
        Number(this.state.cnspmxb.C3_609616906353);
    }
    if (allMoney < newMoney) {
      message.error('已超出人均预算');
    }
    let data = this.state.cnspmxb;
    let editData = this.state.editData;
    if (data.C3_609616868478 == '' || data.C3_609616868478 == undefined)
      return message.error('课程名不能为空');
    // if (data.C3_609616906353 == '' || data.C3_609616906353 == undefined)
    //   return message.error('费用不能为空');
    let middleData = { ...data };
    this.setState({ visibleAdd: false, visibleEdit: false });
    if (data.C3_611406136484 != 'Y') {
      middleData.C3_609616868478 = editData.C3_609845305680;
      middleData.C3_611314815828 = editData.C3_609845305993;
      middleData.C3_611314815266 = editData.C3_610390419677;
      middleData.C3_611314816141 = editData.C3_609845305868;
      middleData.C3_611314815485 = editData.C3_610390410802;
      middleData.C3_609616906353 = editData.C3_609845305931;
      middleData.C3_611314816469 = editData.C3_609845305618;
    }
    let res;
    try {
      res = await http().modifyRecords({
        resid: this.props.subResid,
        data: [middleData]
      });
    } catch (err) {
      return message.error(err.message);
    }
    if (res.Error === 0) {
      this.getDataForOne();
      this.totalData();
      return message.success(res.message);
    } else {
      message.error(res.message);
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
    console.log(i);
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
    console.log(subbData, subbData[i]);
    this.setState({ subbData, editData: subbData[i] });
  }

  render() {
    let subData = this.state.subData;
    let totalData = this.state.totalData;
    let subbData = this.state.subbData;
    let kcxlData = this.state.kcxlData;
    let kclbData = this.state.kclbData;
    return (
      <div className="fj-list">
        <div>
          <div
            style={{
              display: 'flex',
              flex: 3,
              padding: '5px 0',
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            <div
              style={{
                flex: 2,
                display: 'flex',
                justifyContent: 'space-around',
                padding: '0 10px'
              }}
            >
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {totalData.C3_609616006519 == 'SHG' ? '上海' : '无锡'}
              </span>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                财年: {totalData.C3_609615869581}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '14px' }}>
                人数:
                <span className="fjlist-header-number">
                  {totalData.C3_609615996253}
                </span>
              </span>

              <span style={{ fontSize: '14px' }}>
                总费用:
                <span className="fjlist-header-number">
                  {totalData.C3_609616051191}
                </span>
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '14px' }}>
                总预算:
                <span className="fjlist-header-number">
                  {totalData.C3_609616030566}
                </span>
              </span>
              <span style={{ fontSize: '14px' }}>
                人均预算:
                <span className="fjlist-header-number">
                  {totalData.C3_611074040082}
                </span>
              </span>
            </div>
          </div>
          <div style={{ height: 'calc(100% - 60px)' }}>
            <Skeleton loading={!totalData.C3_609616006519}>
              <TableData
                resid={this.props.resid}
                tableComponent="ag-grid"
                rowSelectionAg="single"
                sideBarAg={true}
                hasAdvSearch={false}
                hasAdd={true}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasBeBtns={false}
                hasRowModify={false}
                hasRowSelection={false}
                // cmswhere={` C3_613828994025 = '${totalData.C3_609616006519}'`}
              />
            </Skeleton>

            {/* <InfiniteScroll
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
                      onSearch={value => {
                        console.log(value);
                        this.setState(
                          { key: value, data: [], pageIndex: 0 },
                          () => this.getData()
                        );
                      }}
                      style={{ width: 200 }}
                    />
                  </div>
                }
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
                              {item.C3_611666091289 == null
                                ? '无'
                                : item.C3_611666091289}
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
                                listNo: item.C3_609622254861
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
                                listNo: item.C3_609622254861
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
                                listNo: item.C3_609622254861
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
            </InfiniteScroll> */}
          </div>
        </div>
        {/* <div style={{ width: '50%', padding: '16px 28px' }}>
          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: '5px 0'
            }}
          >
            <div
              style={{
                display: 'flex',
                flex: 2,
                flexDirection: 'column',
                justifyContent: 'space-around',
                height: '42px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: '5px 0'
                }}
              >
                <Button
                  type="default"
                  style={{ width: 'calc(50% - 80px)' }}
                  onClick={() => {
                    this.setState({ showHistory: true });
                  }}
                >
                  计划明细
                </Button>
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
             
            </div>
          </div>

          {subData.length > 0 ? (
            <div style={{ height: 'calc(100vh - 170px)', overflowY: 'scroll' }}>
              {subData.map((item, i) => (
                <Card
                  title={
                    item.C3_611406136484 != 'Y' ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <div
                          style={{
                            height: '20px',
                            width: '5px',
                            display: 'inline-block',
                            marginRight: '10px',
                            background: '#0B92E2'
                          }}
                        ></div>
                        {item.C3_609616868478}
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <div
                          style={{
                            height: '20px',
                            width: '5px',
                            display: 'inline-block',
                            marginRight: '10px',
                            background: '#EE8735'
                          }}
                        ></div>
                        {item.C3_609616868478}
                      </div>
                    )
                  }
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
                  // headStyle={{
                  //   background: 'red'
                  // }}
                  style={{ marginBottom: '16px' }}
                  actions={[
                    <a
                      href="#"
                      onClick={res =>
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
                            this.setState({
                              subbData,
                              editCourseOldMoney: item.C3_609616906353
                            });
                          }
                        )
                      }
                    >
                      修改
                    </a>,
                    <a></a>
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
        </div> */}

        <Modal
          title="计划详情"
          width={'80%'}
          destroyOnClose={true}
          visible={this.state.showHistory}
          onOk={() => this.setState({ showHistory: false })}
          onCancel={() => this.setState({ showHistory: false })}
        >
          <TableData
            height={450}
            resid={611315248461}
            cmswhere={`C3_609616805633 = '${this.planid}'`}
            recordFormFormWidth={'90%'}
            hasBeBtns={false}
            subtractH={240}
            hasModify={false}
            hasDelete={false}
            hasAdd={false}
            hasRowDelete={false}
            hasRowModify={false}
            hasRowView={false}
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
          centered
          style={{ top: 50 }}
        >
          <Tabs defaultActiveKey={this.state.tabsKey}>
            <TabPane tab="历年绩效" key="1">
              <TableData
                resid={420130498195}
                recordFormFormWidth={'90%'}
                hasBeBtns={false}
                cmswhere={`C3_420148203323 = '${this.state.listNo}'`}
                hasModify={false}
                hasDelete={false}
                hasAdd={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasRowView={false}
                height={450}
                subtractH={200}
              />
            </TabPane>
            <TabPane tab="历史计划" key="2">
              <TableData
                resid={611315248461}
                cmswhere={`C3_609616893275 = '${this.state.listNo}'`}
                recordFormFormWidth={'90%'}
                hasBeBtns={false}
                hasModify={false}
                hasDelete={false}
                hasAdd={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasRowView={false}
                height={450}
                subtractH={200}
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Select
                  style={{ width: '100px' }}
                  defaultValue="Rec"
                  onChange={e => {
                    if (e == 'Rec') {
                      this.setState(
                        {
                          levelSelect: this.state.lkState,
                          kcState: e,
                          addData: {}
                        },
                        () => this.getSubbData()
                      );
                    } else {
                      this.setState(
                        {
                          levelSelect: '',
                          kcState: 'All',
                          addData: {}
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
                    console.log(e);
                    this.setState({ xlSelect: e, addData: {} }, () =>
                      this.getSubbData()
                    );
                  }}
                >
                  <Option value="">全部系列</Option>
                  {kcxlData.map((item, i) => (
                    <Option value={item.C3_460380572730} key={i}>
                      {item.C3_460380572730}
                    </Option>
                  ))}
                </Select>
                <Select
                  style={{ width: '100px' }}
                  defaultValue=""
                  onChange={e => {
                    this.setState({ lbSelect: e, addData: {} }, () =>
                      this.getSubbData()
                    );
                  }}
                >
                  <Option value="">全部类别</Option>
                  {kclbData.map((item, i) => (
                    <Option value={item.C3_460380239253} key={i}>
                      {item.C3_460380239253}
                    </Option>
                  ))}
                </Select>
                <Search
                  placeholder="搜索"
                  onSearch={value => {
                    this.setState(
                      {
                        addData: {}
                      },
                      () => this.getSubbData(value)
                    );
                  }}
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
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: '16px'
                      }}
                    >
                      <div style={{ width: '50%' }}>
                        <span>
                          课程名称:{' '}
                          {item.C3_609845305680 == null
                            ? '无'
                            : item.C3_609845305680}
                        </span>
                      </div>
                      <div style={{ width: '50%' }}>
                        <span>
                          讲师:{' '}
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
                          alignItems: 'center',
                          width: '50%'
                        }}
                      >
                        {/* <div
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: '#4a90e2',
                              marginRight: '16px'
                            }}
                          /> */}
                        <span>
                          培训地:{' '}
                          {item.C3_610390410802 == null
                            ? '无'
                            : item.C3_610390410802}
                        </span>
                      </div>
                      <div style={{ width: '50%' }}>
                        <span>
                          课程费用:{' '}
                          {item.C3_609845305931 == null
                            ? '无'
                            : item.C3_609845305931}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flex: 1 }}>
                      {item.showDetail && (
                        <span>
                          简介:{' '}
                          {item.C3_609845305618 == null
                            ? '无'
                            : item.C3_609845305618}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flex: 1,
                      flexDirection: 'column'
                    }}
                  >
                    <a target="_blank" href={item.C3_609845463949}>
                      <Icon type="fund" style={{ fontSize: '22px' }} />
                    </a>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid #0B92E2',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      onClick={e => {
                        e.stopPropagation();
                        subbData[i].showDetail = !subbData[i].showDetail;
                        this.setState({ subbData });
                      }}
                    >
                      <Icon type="ellipsis" style={{ color: '#0B92E2' }} />
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
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
                type="number"
                onChange={e => {
                  console.log(e.target.value);
                  console.log(this.state.addCustom);
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
                          flexWrap: 'wrap',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: '16px'
                        }}
                      >
                        <div style={{ width: '50%' }}>
                          <span>
                            课程名称:{' '}
                            {item.C3_609845305680 == null
                              ? '无'
                              : item.C3_609845305680}
                          </span>
                        </div>
                        <div style={{ width: '50%' }}>
                          <span>
                            讲师:{' '}
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
                            alignItems: 'center',
                            width: '50%'
                          }}
                        >
                          {/* <div
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: '#4a90e2',
                                marginRight: '16px'
                              }}
                            /> */}
                          <span>
                            培训地:{' '}
                            {item.C3_610390410802 == null
                              ? '无'
                              : item.C3_610390410802}
                          </span>
                        </div>
                        <div style={{ width: '50%' }}>
                          <span>
                            课程费用:{' '}
                            {item.C3_609845305931 == null
                              ? '无'
                              : item.C3_609845305931}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flex: 1 }}>
                        {item.showDetail && (
                          <span>
                            简介:{' '}
                            {item.C3_609845305618 == null
                              ? '无'
                              : item.C3_609845305618}
                          </span>
                        )}
                      </div>
                      {/* <div style={{ display: 'flex', flex: 1 }}>
                          {item.showDetail?<span>
                            简介:{' '}
                            {item.C3_609845305618 == null
                              ? '无'
                              : item.C3_609845305618}
                          </span>:<span style={{ height:"21px" }}>{' '}</span>}
                        </div> */}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column'
                      }}
                    >
                      <a target="_blank" href={item.C3_609845463949}>
                        <Icon type="fund" style={{ fontSize: '22px' }} />
                      </a>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid #0B92E2',
                          borderRadius: '50%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          subbData[i].showDetail = !subbData[i].showDetail;
                          this.setState({ subbData });
                        }}
                      >
                        <Icon type="ellipsis" style={{ color: '#0B92E2' }} />
                      </div>
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
                <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
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
                <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
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
                    type="number"
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
    );
  }
}

export default FJList;
