import React from 'react';
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
} from 'antd';
import http from '../../../util20/api';
import PlanProgress from './PlanProgress';

const Option = Select.Option;
const Search = Input.Search;

class CreatePlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      totalData: {}, //统计数据
      data: [], //员工列表数据
      oldData: [], //暂存员工列表
      totalAmount: 0, //后台返回的员工总数量
      hasMore: true, //是否有更多数据
      selectedLevel: '', //下拉选中的级别
      selectedEmployeeLevels: new Set(),
      selectedEmployee: [], //选择了的员工
      selectedCourse: [], //选择了的课程
      subData: [], //课程表数据
      levelData: [], //员工级别列表
      kcxlData: [], //课程系列列表
      kclbData: [], //课程类别列表
      levelSelect: '', //选中级别
      xlSelect: '', //选中的系列
      lbSelect: '', //选中的类别
      kcState: 'All', //选中课程状态
      pageIndex: 0, // 当前页数
      totalPage: 0, // 总页数
      pageSize: 15, // 每页数量
      key: '', //模糊查询关键字
      isShowProgress: false,
      taskList: []
    };
  }

  async componentDidMount() {
    //const qsObj = qs.parse(window.location.search.substring(1));
    this.planid = this.props.planid;
    this.setState({ loading: true });
    await this.totalData();
    this.getData();
    this.getSubData();
    this.getLevel();
    this.getKcxl();
    this.getKclb();
    this.setState({ loading: false });
  }
  async totalData() {
    let cmswhere = `C3_609616660273= '${this.planid}'`;
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
      pageSize,
      cmswhere: `C3_613828994025 = '${this.state.totalData.C3_609616006519}'`
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
          let hasMore = this.state.hasMore;
          if (this.state.oldData.length === this.state.totalAmount) {
            hasMore = false;
          }
          this.setState({
            data,
            hasMore,
            oldData: data,
            pageIndex: ++this.state.pageIndex
          });
        } else {
          this.setState({ hasMore: false });
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

  //获取员工级别列表
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
    let { selectedCourse } = this.state;
    let cmswhere = '';
    //如果选择了人员级别，则加上级别的条件语句
    if (this.state.kcState !== 'All' && this.state.selectedLevel) {
      cmswhere += "C3_610763348502='" + this.state.selectedLevel + "'";
    }
    //如果选择了一个课程系列，则加上系列的条件语句
    if (this.state.xlSelect) {
      if (cmswhere !== '') {
        cmswhere += ' AND ';
      }
      cmswhere += "C3_609845305368='" + this.state.xlSelect + "'";
    }
    //如果选择了一个课程类别，则加上类别的条件语句
    if (this.state.lbSelect) {
      if (cmswhere !== '') {
        cmswhere += ' AND ';
      }
      cmswhere += "C3_609845305305='" + this.state.lbSelect + "'";
    }
    if (this.state.kcState === 'Rec' && cmswhere === '') {
      return this.setState({ subData: [] });
    }

    let res = await http().getTable({
      resid: this.props.subResid,
      key,
      cmswhere
    });
    try {
      if (res.error === 0) {
        let subData = res.data;
        subData.forEach(e => {
          if (
            selectedCourse.find(i => {
              return i.REC_ID === e.REC_ID;
            })
          ) {
            e.check = true;
          } else {
            e.check = false;
          }
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

  //获取课程系列列表
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

  //获取课程类别列表
  async getKclb() {
    let res;
    try {
      res = await http().getTable({ resid: this.props.kclbResid });
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
    let { data, selectedEmployee } = this.state;
    if (data[i].check === true) {
      //删除选中的员工
      selectedEmployee.splice(
        selectedEmployee.findIndex(item => item.REC_ID === data[i].REC_ID),
        1
      );
    } else {
      selectedEmployee = [...selectedEmployee, data[i]];
    }
    data[i].check = !data[i].check;
    this.setState(
      {
        data,
        selectedEmployee,
        selectedLevel: data[i].C3_609622292033
      },
      () => this.getSubData()
    );
  }

  //选择课程
  onClickCustom(i) {
    let { subData, selectedCourse } = this.state;
    if (subData[i].check) {
      selectedCourse.splice(
        selectedCourse.findIndex(item => item.REC_ID === subData[i].REC_ID),
        1
      );
    } else {
      selectedCourse = [...selectedCourse, subData[i]];
    }
    subData[i].check = !subData[i].check;
    this.setState({ subData, selectedCourse });
  }
  handleShowProgress = () => {
    let { isShowProgress } = this.state;
    this.setState({ isShowProgress: !isShowProgress });
  };
  //保存计划
  async onClickSave() {
    let x = 0,
      y = 0,
      data = this.state.data,
      subData = this.state.subData,
      planData = [];
    let { selectedCourse, selectedEmployee } = this.state;
    let taskList = [];
    selectedCourse.forEach(item => {
      selectedEmployee.forEach(i => {
        let employee_course = { ...item, ...i };
        delete employee_course.REC_ID;
        taskList.push(employee_course);
      });
    });
    this.setState({ isShowProgress: true, taskList });
    // let res;
    // try {
    //   res = await http().addRecords({
    //     resid: this.props.kcbResid,
    //     data: taskList,
    //     isEditOrAdd: true
    //   });
    //   if (res.Error === 0) {
    //     message.success(res.message);
    //   } else {
    //     message.error(res.message);
    //   }
    // } catch (err) {
    //   console.error(err);
    //   return message.error(err.message);
    // }

    // subData.forEach(ele => {
    //   if (ele.check === true) {
    //     y++;
    //     data.forEach(e => {
    //       if (e.check === true) {
    //         x++;
    //         let obj = JSON.parse(JSON.stringify(ele));
    //         obj.C3_609616893275 = e.C3_609622254861;
    //         obj.C3_609616805633 = this.planid;
    //         obj.C3_609616868478 = obj.C3_609845305680;
    //         obj.C3_609616906353 = obj.C3_609845305931;
    //         obj.C3_611314815266 = obj.C3_610390419677;
    //         obj.C3_611314815485 = obj.C3_610390410802;
    //         obj.C3_611314815656 = obj.C3_609845463949;
    //         obj.C3_611314815828 = obj.C3_609845305993;
    //         obj.C3_611314816141 = obj.C3_609845305868;
    //         obj.C3_611314816469 = obj.C3_609845305618;
    //         obj.C3_611314817188 = obj.C3_609845305368;
    //         obj.C3_611314817359 = obj.C3_609845305305;
    //         delete obj.REC_ID;
    //         planData.push(obj);
    //       }
    //     });
    //   }
    // });
    // if (y === 0) {
    //   return message.error('至少选择一个课程');
    // }
    // if (x === 0) {
    //   return message.error('至少选择一个员工');
    // }
    // let { totalData } =this.state;
    // if (totalCost + totalData.C3_609616051191 > totalData.C3_609616030566){
    //   return message.error("已超出费用总预算");
    // }
    //let res;
    // try {
    //   res = await http().addRecords({
    //     resid: this.props.kcbResid,
    //     data: planData,
    //     isEditOrAdd: true
    //   });
    //   if (res.Error === 0) {
    //     message.success(res.message);
    //   } else {
    //     message.error(res.message);
    //   }
    // } catch (err) {
    //   console.error(err);
    //   return message.error(err.message);
    // }
  }

  render() {
    let levelData = this.state.levelData;
    let kcxlData = this.state.kcxlData;
    let kclbData = this.state.kclbData;
    let { totalData, taskList } = this.state;
    return (
      <div style={{ padding: '16px', background: '#fff' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '50%', padding: '10px 28px' }}>
            {/* <div style={{ paddingBottom: '24px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                选择员工
              </span>
            </div> */}
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
                  人数: {totalData.C3_609615996253}
                </span>

                <span style={{ fontSize: '14px' }}>
                  总费用: {totalData.C3_609616051191}
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
                  总预算: {totalData.C3_609616030566}
                </span>
                <span style={{ fontSize: '14px' }}>
                  人均预算: {totalData.C3_611074040082}
                </span>
              </div>
            </div>
            <div style={{ height: 'calc(100vh - 150px)', overflow: 'auto' }}>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.getData.bind(this)}
                hasMore={this.state.hasMore}
                useWindow={false}
              >
                <List
                  size="large"
                  loading={this.state.loading}
                  header={
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Select
                        style={{ width: '100px' }}
                        defaultValue="All"
                        onChange={e => {
                          let data = [],
                            level,
                            oldData = this.state.oldData;
                          if (e === 'All') {
                            data = oldData;
                            level = '';
                          } else {
                            level = e;
                            oldData.forEach(ele => {
                              ele.check = false;
                              if (ele.C3_609622292033 === e) {
                                data.push(ele);
                              }
                            });
                          }
                          this.setState({ data, selectedLevel: level }, () => {
                            this.getSubData();
                          });
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
                        onSearch={value => {
                          this.setState(
                            { key: value, data: [], pageIndex: 0 },
                            () => this.getData()
                          );
                        }}
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
                      onClick={this.onClick.bind(this, i)}
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
                          <Checkbox checked={item.check} />
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
                      </div>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </div>
          <div style={{ width: '50%', padding: '10px 28px' }}>
            {/* <div style={{ paddingBottom: '24px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
                选择课程
              </span>
            </div> */}
            <div
              style={{
                display: 'flex',
                flex: 2,
                flexDirection: 'column',
                justifyContent: 'space-around',
                height: '52px'
              }}
            />
            <List
              size="large"
              header={
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Select
                    style={{ width: '100px' }}
                    defaultValue="All"
                    onChange={e => {
                      if (e === 'Rec') {
                        //如果未选择员工级别，课程数据则为空
                        if (this.state.selectedLevel === '') {
                          message.error('未选择级别，无法推荐课程');
                          return this.setState({ kcState: e, subData: [] });
                        }
                        this.setState({ kcState: e }, () => this.getSubData());
                      } else {
                        this.setState(
                          {
                            //selectedLevel: '',
                            kcState: 'All'
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
                    style={{ width: '100px' }}
                    defaultValue=""
                    onChange={e => {
                      if (
                        this.state.kcState === 'Rec' &&
                        this.state.selectedLevel === ''
                      ) {
                        message.error('未选择级别，无法推荐课程');
                        return this.setState({ subData: [] });
                      }
                      this.setState({ xlSelect: e }, () => this.getSubData());
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
                      if (
                        this.state.kcState === 'Rec' &&
                        this.state.selectedLevel === ''
                      ) {
                        message.error('未选择级别，无法推荐课程');
                        return this.setState({ subData: [] });
                      }
                      this.setState({ lbSelect: e }, () => this.getSubData());
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
                    onSearch={value => this.getSubData(value)}
                    style={{ width: 200 }}
                  />
                </div>
              }
              bordered
              style={{ height: 'calc(100vh - 170px)', overflowY: 'scroll' }}
              dataSource={this.state.subData}
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
                      <Checkbox checked={item.check} />
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
                              marginRight: '16px',
                              width: '50%'
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
                          let subData = this.state.subData;
                          subData[i].showDetail = !subData[i].showDetail;
                          this.setState({ subData });
                        }}
                      >
                        <Icon type="ellipsis" style={{ color: '#0B92E2' }} />
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="primary"
            style={{ width: '100px' }}
            onClick={this.onClickSave.bind(this)}
          >
            保存
          </Button>
        </div>
        {this.state.isShowProgress ? (
          <PlanProgress
            taskList={taskList}
            handleShowProgress={this.handleShowProgress}
          />
        ) : null}
      </div>
    );
  }
}

export default CreatePlan;
