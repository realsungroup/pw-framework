import React from 'react';
import {
  Button,
  Icon,
  Checkbox,
  message,
  List,
  Select,
  Modal,
  Input,
  Spin,
  Tabs,
} from 'antd';
import http from '../../../util20/api';
import PlanProgress from './PlanProgress';
import { TableData } from '../../common/loadableCommon';
import './CreatePlan.less';
import { getItem } from '../../../util20/util';
const Option = Select.Option;
const Search = Input.Search;
const TabPane = Tabs.TabPane;
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
      levelSelect: '', //选中级别
      xlSelect: '', //选中的系列
      lbSelect: '', //选中的类别
      kcState: 'All', //选中课程状态
      pageIndex: 0, // 当前页数
      totalPage: 0, // 总页数
      pageSize: 100, // 每页数量
      key: '', //模糊查询关键字
      showHistory: false, //计划详情模态框状态
      isShowProgress: false,
      taskList: [],
      indeterminate: false,
      isAllChecked: false,
      userCode: JSON.parse(getItem('userInfo')).UserInfo.EMP_USERCODE,
      departments: [] //部门
    };
  }

  async componentDidMount() {
    //const qsObj = qs.parse(window.location.search.substring(1));
    this.planid = this.props.planid;
    this.setState({ loading: true });
    await this.totalData();
    this.getDepartment();
    this.getData();
    this.getSubData();
    this.getLevel();
  }

  /**
   * 获取统计数据
   */
  totalData = async () => {
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
  };

  /**
   * 获取部门
   */
  getDepartment = async () => {
    try {
      const res = await http().getTable({
        resid: '631365359849',
        cmswhere: `C3_611264173184 = '${this.state.totalData.C3_609615869581}' and C3_613828994025 = '${this.state.totalData.C3_609616006519}' and C3_611071869988 = '${this.state.userCode}'`
      });
      this.setState({ departments: res.data });
    } catch (error) {
      console.error(error);
      return message.error(error.message);
    }
  };

  /**
   * 获取员工列表
   */
  async getData() {
    let pageIndex = this.state.pageIndex;
    let key = this.state.key;
    this.setState({ loading: true });
    try {
      let res = await http().getTable({
        resid: this.props.resid,
        key,
        pageIndex,
        cmswhere: `C3_613828994025 = '${this.state.totalData.C3_609616006519}'`
      });
      this.setState({ loading: false });
      if (res.error === 0) {
        if (res.data.length > 0) {
          let data = this.state.data;
          let resData = res.data;
          resData.forEach(e => {
            e.check = false;
          });
          if (pageIndex === 0) {
            data = resData;
          } else {
            data = data.concat(resData);
          }
          let hasMore = true;
          if (this.state.oldData.length === this.state.totalAmount) {
            hasMore = false;
          }
          this.setState({
            data,
            hasMore,
            oldData: data,
            pageIndex: ++this.state.pageIndex
          });
        }
      } else {
        message.error(res.message);
      }
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    this.setState({ loading: false });
  }

  /**
   * 获取级别列表
   */
  async getLevel() {
    let res = await http().getTable({ resid: this.props.levelId });
    try {
      if (res.error === 0) {
        let levelData = res.data;
        levelData.sort((o1, o2) => {
          let level1 = o1.C3_587136281870;
          let level2 = o2.C3_587136281870;
          if (level1[0] === level2[0]) {
            let num1 = parseInt(level1.slice(1));
            let num2 = parseInt(level2.slice(1));
            return num1 - num2;
          } else {
            if (level1 < level2) {
              return -1;
            } else if (level1 > level2) {
              return 1;
            } else {
              return 0;
            }
          }
        });
        this.setState({ levelData });
      } else {
        message.error(res.message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  }

  /**
   * 获取课程表
   */
  async getSubData(key) {
    this.setState({ loading2: true });
    let { selectedCourse } = this.state;
    let cmswhere = `C3_609845305743 = '${this.state.totalData.C3_609615869581}' `;
    //如果选择了人员级别，则加上级别的条件语句
    if (this.state.kcState !== 'All' && this.state.selectedLevel) {
      cmswhere += "AND C3_610763348502='" + this.state.selectedLevel + "'";
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
    try {
      let res = await http().getTable({
        resid: this.props.subResid,
        key,
        cmswhere
      });

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

        this.setState({ subData, loading2: false });
      } else {
        this.setState({ loading2: false });
        message.error(res.message);
      }
    } catch (err) {
      console.log().error(err);
      this.setState({ loading2: false });
      return message.error(err.message);
    }
  }

  /**
   * 选择员工
   */
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
    let indeterminate = false;
    let isAllChecked = false;
    if (selectedEmployee.length && selectedEmployee.length !== data.length) {
      indeterminate = true;
    } else if (selectedEmployee.length === data.length) {
      isAllChecked = true;
    }
    this.setState({
      data,
      selectedEmployee,
      indeterminate,
      isAllChecked,
      selectedLevel: data[i].C3_609622292033
    });
  }

  /**
   * 全选checkbox onChange事件
   */
  onCheckAll = e => {
    let { data } = this.state;
    if (e.target.checked) {
      data = data.map(item => {
        return { ...item, check: true };
      });
      this.setState({
        data,
        selectedEmployee: data,
        indeterminate: false,
        isAllChecked: true
      });
    } else {
      data = data.map(item => {
        return { ...item, check: false };
      });
      this.setState({
        data,
        selectedEmployee: [],
        indeterminate: false,
        isAllChecked: false
      });
    }
  };

  /**
   * 选择课程
   */
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
    let data = [...this.state.data];
    let subData = [...this.state.subData];
    data.forEach(i => {
      i.check = false;
    });
    subData.forEach(i => {
      i.check = false;
    });
    this.setState(
      {
        isShowProgress: !isShowProgress,
        selectedCourse: [],
        selectedEmployee: [],
        data,
        subData,
        pageIndex: 0
      },
      () => {
        this.totalData();
        this.getData();
      }
    );
  };

  /**
   * 保存计划
   */
  async onClickSave() {
    let { selectedCourse, selectedEmployee } = this.state;
    if (selectedCourse.length < 1 || selectedEmployee.length < 1) {
      return message.error('请选择员工及课程！');
    }
    let taskList = [];
    let { totalData } = this.state;
    let index_id = 0;
    selectedEmployee.forEach(item => {
      selectedCourse.forEach((i, index) => {
        let employee_course = {
          C3_609616893275: item.C3_609622254861, //员工编号
          C3_611314816141: i.C3_609845305868, //课程编号
          C3_609616805805: this.props.year,
          C3_609616805633: totalData.C3_609616660273,
          C3_609622263470: item.C3_609622263470, //员工姓名
          C3_609845305680: i.C3_609845305680, //课程名称
          _id: ++index_id,
          _state: 'editoradd'
        };
        taskList.push(employee_course);
      });
    });
    this.setState({ isShowProgress: true, taskList });
  }

  render() {
    let levelData = this.state.levelData;
    let {
      totalData,
      taskList,
      indeterminate,
      isAllChecked,
      departments
    } = this.state;
    return (
      <div style={{ padding: '16px', background: '#fff' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '50%', padding: '10px 28px' }}>
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
                  <span className="create_plan-header-number">
                    {totalData.C3_609615996253}
                  </span>
                </span>

                <span style={{ fontSize: '14px' }}>
                  总费用:
                  <span className="create_plan-header-number">
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
                  <span className="create_plan-header-number">
                    {totalData.C3_609616030566}
                  </span>
                </span>
                <span style={{ fontSize: '14px' }}>
                  人均预算:
                  <span className="create_plan-header-number">
                    {totalData.C3_611074040082}
                  </span>
                </span>
              </div>
            </div>
            <div style={{ height: 'calc(100vh - 150px)', overflow: 'auto' }}>
              <List
                size="small"
                loading={this.state.loading}
                pagination={{ position: 'bottom', size: 100 }}
                header={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Checkbox
                      indeterminate={indeterminate}
                      onChange={this.onCheckAll}
                      checked={isAllChecked}
                    >
                      全选
                    </Checkbox>
                    <div>
                      <Select
                        style={{ width: '100px', marginRight: 8 }}
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
                      <Select
                        style={{ width: '140px', marginRight: 8 }}
                        defaultValue="All"
                        onChange={key => {
                          let data = [],
                            oldData = this.state.oldData;
                          if (key === 'All') {
                            data = [...oldData];
                          } else {
                            data = oldData.filter(
                              item => item.C3_609622277252 === key
                            );
                          }
                          this.setState({ data });
                        }}
                      >
                        <Option value="All">全部部门</Option>
                        {departments.map((item, i) => (
                          <Option value={item.depart} key={i}>
                            {item.depart}
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
                  </div>
                }
                bordered
                dataSource={this.state.data}
                renderItem={(item, i) => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    onClick={this.onClick.bind(this, i)}
                    key={item.REC_ID}
                    className="memberCard"
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
                    <div className="hoverEle">
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
                  </List.Item>
                )}
              />
              {/* </InfiniteScroll> */}
            </div>
          </div>
          <div style={{ width: '50%', padding: '10px 28px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                height: '60px'
              }}
            >
              <Button
                type="default"
                style={{ marginRight: 8 }}
                onClick={() => {
                  this.setState({ showHistory: true });
                }}
              >
                计划明细
              </Button>
              <Button
                type="primary"
                style={{ width: '100px' }}
                onClick={this.onClickSave.bind(this)}
              >
                保存
              </Button>
            </div>
            <Spin spinning={this.state.loading2}>
              <List
                size="large"
                header={
                  <div className="creatFilter">
                    <ul>
                      <li
                        className={this.state.lbSelect == '' ? 'current' : ''}
                        onClick={() => {
                          this.setState({ lbSelect: '' }, () =>
                            this.getSubData()
                          );
                        }}
                      >
                        全部系列
                      </li>
                      <li
                        className={
                          this.state.lbSelect == '管理与发展' ? 'current' : ''
                        }
                        onClick={() => {
                          this.setState(
                            { lbSelect: '管理与发展', xlSelect: '' },
                            () => this.getSubData()
                          );
                        }}
                      >
                        管理与发展
                      </li>
                      <li
                        className={
                          this.state.lbSelect == '专业技能' ? 'current' : ''
                        }
                        onClick={() => {
                          this.setState(
                            { lbSelect: '专业技能', xlSelect: '' },
                            () => this.getSubData()
                          );
                        }}
                      >
                        专业技能
                      </li>
                      <li
                        className={
                          this.state.lbSelect == '职业技能' ? 'current' : ''
                        }
                        onClick={() => {
                          this.setState(
                            { lbSelect: '职业技能', xlSelect: '' },
                            () => this.getSubData()
                          );
                        }}
                      >
                        职业技能
                      </li>
                    </ul>
                    <div className="clearfix"></div>
                    <ul className="filter2">
                      <li className={this.state.lbSelect == '' ? '' : 'hidden'}>
                        <ol>
                          <li
                            className={this.state.xlSelect == '' ? 'cur' : ''}
                            onClick={() => {
                              this.setState({ xlSelect: '' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            全部
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '团队管理' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '团队管理' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            团队管理
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '自我发展' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '自我发展' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            自我发展
                          </li>

                          <li
                            className={
                              this.state.xlSelect == '研发设计与管理工具'
                                ? 'cur'
                                : ''
                            }
                            onClick={() => {
                              this.setState(
                                { xlSelect: '研发设计与管理工具' },
                                () => this.getSubData()
                              );
                            }}
                          >
                            研发设计与管理工具
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '工程技术类' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '工程技术类' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            工程技术类
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '生产制造' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '生产制造管理' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            生产制造管理
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '质量管理' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '质量管理' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            质量管理
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '人力资源与行政管理'
                                ? 'cur'
                                : ''
                            }
                            onClick={() => {
                              this.setState(
                                { xlSelect: '人力资源与行政管理' },
                                () => this.getSubData()
                              );
                            }}
                          >
                            人力资源与行政管理
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '财务' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '财务' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            财务
                          </li>

                          <li
                            className={
                              this.state.xlSelect == '项目管理' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '项目管理' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            项目管理
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '英语提高' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '英语提高' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            英语提高
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '软件学习' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '软件学习' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            软件学习
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '体系类' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '体系类' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            体系类
                          </li>
                        </ol>
                      </li>

                      <li
                        className={
                          this.state.lbSelect == '专业技能' ? '' : 'hidden'
                        }
                      >
                        <ol>
                          <li
                            className={this.state.xlSelect == '' ? 'cur' : ''}
                            onClick={() => {
                              this.setState({ xlSelect: '' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            全部
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '研发设计与管理工具'
                                ? 'cur'
                                : ''
                            }
                            onClick={() => {
                              this.setState(
                                { xlSelect: '研发设计与管理工具' },
                                () => this.getSubData()
                              );
                            }}
                          >
                            研发设计与管理工具
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '工程技术类' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '工程技术类' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            工程技术类
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '生产制造' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '生产制造管理' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            生产制造管理
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '质量管理' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '质量管理' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            质量管理
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '人力资源与行政管理'
                                ? 'cur'
                                : ''
                            }
                            onClick={() => {
                              this.setState(
                                { xlSelect: '人力资源与行政管理' },
                                () => this.getSubData()
                              );
                            }}
                          >
                            人力资源与行政管理
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '财务' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '财务' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            财务
                          </li>
                        </ol>
                      </li>

                      <li
                        className={
                          this.state.lbSelect == '管理与发展' ? '' : 'hidden'
                        }
                      >
                        <ol>
                          <li
                            className={this.state.xlSelect == '' ? 'cur' : ''}
                            onClick={() => {
                              this.setState({ xlSelect: '' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            全部
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '团队管理' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '团队管理' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            团队管理
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '自我发展' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '自我发展' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            自我发展
                          </li>
                        </ol>
                      </li>

                      <li
                        className={
                          this.state.lbSelect == '职业技能' ? '' : 'hidden'
                        }
                      >
                        <ol>
                          <li
                            className={this.state.xlSelect == '' ? 'cur' : ''}
                            onClick={() => {
                              this.setState({ xlSelect: '' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            全部
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '项目管理' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '项目管理' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            项目管理
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '英语提高' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '英语提高' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            英语提高
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '软件学习' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '软件学习' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            软件学习
                          </li>
                          <li
                            className={
                              this.state.xlSelect == '体系类' ? 'cur' : ''
                            }
                            onClick={() => {
                              this.setState({ xlSelect: '体系类' }, () =>
                                this.getSubData()
                              );
                            }}
                          >
                            体系类
                          </li>
                        </ol>
                      </li>
                    </ul>
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
                        alignItems: 'center',
                        width: '100%'
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
                            marginBottom: '16px'
                          }}
                        >
                          <div style={{ marginBottom: 4 }}>
                            <span>
                              课程名称:
                              {item.C3_609845305680 == null
                                ? '无'
                                : item.C3_609845305680}
                            </span>
                          </div>
                          <div>
                            <span>
                              课程费用:
                              {item.C3_609845305931 == null
                                ? '无'
                                : item.C3_609845305931}
                            </span>
                          </div>
                        </div>
                        <div>
                          {item.showDetail ? null : (
                            <span>
                              简介:
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
            </Spin>
          </div>
        </div>

        {this.state.isShowProgress ? (
          <PlanProgress
            onFinished={this.handleShowProgress}
            struct="100"
            options={{ resid: 611315248461, data: JSON.stringify(taskList) }}
            title="多选人员课程列表"
            showFields={['C3_609622263470', 'C3_609845305680']}
            // width='50%'
          />
        ) : null}
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
                resid={624564627997}
                hasModify={false}
                hasDelete={false}
                hasAdd={false}
                // dataMode="main"
                // subtractH={190}
                // height={520}
                // hasBeBtns
              />
            </TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  }
}

export default CreatePlan;
