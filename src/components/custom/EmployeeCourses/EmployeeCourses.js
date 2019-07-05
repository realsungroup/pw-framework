import React from 'react';
import {
  Tabs,
  Select,
  Input,
  Card,
  Radio,
  Button,
  Divider,
  Timeline,
  Pagination,
  message,
  Modal,
  Popconfirm
} from 'antd';
import moment from 'moment';
import './EmployeeCourses.less';
import http from 'Util20/api';
import { TableData } from '../../common/loadableCommon';
import Calendar from 'ic-components/lib/Calendar';
import 'ic-components/lib/Calendar/style/index.less';

import CourseDetail from './CourseDetail';
import CourseApply from './CourseApply';
import FeedBackAndPlan from './FeedBackAndPlan/FeedBackAndPlan';

const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;
const resid = '615378031605'; //课程明细表id
const TIPS_RESID = '614964195659'; //心得表id
const YEAR_RESID = '420161931474'; //财年表id
const REVIEW_RECOR_RESID = '615663201836'; // 申请单审批记录表id  C3_615657103208 课程安排明细编号
const TABBARSTYLE = { display: 'flex', justifyContent: 'space-around' };

class EmployeeCourses extends React.Component {
  state = {
    myCourses: [], //我的课程
    selectedCourse: null, //选中的课程
    calendarEvents: [], //日历事件
    wid: '80%',
    applyVisible: false, //申请模态框
    feebackVisible: false, // 反馈和行动计划模态框
    applyModalMode: 'view', // 申请单的操作，默认为查看
    feedbackModalMode: 'view', // 反馈的操作，默认为查看
    tipsModalMode: 'view', // 心得的操作，默认为查看
    ReviewRecordModalVisible: false, //申请单审批记录模态窗显示状态
    tipsModalVisible: false, // 心得模态窗显示状态
    //提交心得时的数据
    tip: {
      title: '',
      tips: ''
    },
    selcetedTip: {}, //要显示的心得体会
    currentYear: {}, //当前财年
    years: [], //所有财年
    selectedYear: '', //下拉选中的财年
    selcetedCourseType: 'all', //下拉选中的课程类型
    searchKey: '' //搜索的关键字
  };
  componentDidMount = async () => {
    await this.getYears();
    this.getCourses();
  };
  //获取所有课程
  getCourses = async () => {
    let res,
      { currentYear } = this.state;
    try {
      res = await http().getTable({
        resid: resid,
        cmswhere: `C3_613941384328 = '${currentYear.C3_420161949106}'`
      });
      console.log(res);
      let myCourses = res.data;
      if (myCourses.length > 0) {
        myCourses[0].checked = true;
        let selectedCourse = { ...myCourses[0] };
        let importantIndex = 0;
        let calendarEvents = myCourses.map(item => {
          return {
            occur_id: item.REC_ID,
            category_color: `rgb(${parseInt(
              Math.random() * 255 + 0,
              10
            )}, ${parseInt(Math.random() * 255 + 0, 10)}, ${parseInt(
              Math.random() * 255 + 0,
              10
            )})`,
            event_hostheadurl: 'http://placekitten.com/32/32', //事件前面的图片
            event_title: item.C3_613941384592,
            occur_begin: moment(item.C3_615393041304).format(), // 事件发生时间
            occur_end: moment(item.C3_615393093633).format(), // 事件发生结束时间
            event_important: ++importantIndex,
            category_name: item.C3_613941384592
          };
        });
        this.setState({ myCourses, selectedCourse, calendarEvents });
      }
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  //获取财年
  getYears = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: YEAR_RESID
      });
      console.log(res.data);
      let years = [...res.data];
      let currentYear = years.find(item => item.C3_478179065325 === 'Y');
      this.setState({
        years,
        currentYear,
        selectedYear: currentYear.C3_420161949106
      });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };
  //搜索课程
  searchMyCourse = async () => {
    let res;
    try {
      let { selcetedCourseType, selectedYear, searchKey } = this.state;
      let cmswhere = `C3_613941384328 = '${selectedYear}' `;
      if (selcetedCourseType !== 'all') {
        cmswhere += `AND courseType = '${selcetedCourseType}'`;
      }
      res = await http().getTable({
        resid: resid,
        cmswhere,
        key: searchKey
      });
      // message.success(res.message);
      let myCourses = [...res.data];
      if (myCourses.length > 0) {
        myCourses[0].checked = true;
        let selectedCourse = { ...myCourses[0] };
        this.setState({ myCourses, selectedCourse });
      } else {
        this.setState({ myCourses: [], selectedCourse: null });
      }
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };
  //根据选中的课程获取心得
  getTip = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: TIPS_RESID,
        cmswhere: `C3_615479417558 = ${this.state.selectedCourse.CourseArrangeDetailID}`
      });

      if (res.data.length > 0) {
        this.setState({
          selcetedTip: { ...res.data[0] },
          tipsModalVisible: true
          // tipsModalMode: 'view'
        });
      }
      return res;
    } catch (error) {
      console.log(error.message);
      message.error(error.message);
      throw error;
    }
  };

  //点击选中课程
  handleSelectCourse = item => {
    let myCourses = [...this.state.myCourses];
    myCourses.forEach(course => {
      course.checked = false;
    });
    myCourses.find(course => {
      return course.REC_ID === item.REC_ID;
    }).checked = true;
    let selectedCourse = { ...item };
    this.setState({ myCourses, selectedCourse });
  };
  renderHeader = () => (
    <header className="emploee_courses-header">
      <div style={{ flex: 1 }}>
        <Select
          className="emploee_courses-header-selector"
          value={this.state.selectedYear}
          onChange={e => {
            this.setState(
              {
                selectedYear: e
              },
              this.searchMyCourse
            );
          }}
        >
          {this.state.years.map(item => (
            <Option key={item.REC_ID} value={item.C3_420161949106}>
              {item.C3_420161949106}
            </Option>
          ))}
        </Select>
        <Select
          defaultValue="all"
          className="emploee_courses-header-selector"
          value={this.state.selcetedCourseType}
          onChange={e => {
            this.setState(
              {
                selcetedCourseType: e
              },
              this.searchMyCourse
            );
          }}
        >
          <Option value="all">内训/外训</Option>
          <Option value="外训">外训</Option>
          <Option value="内训">内训</Option>
        </Select>
        <Select
          defaultValue="all"
          className="emploee_courses-header-selector"
          // value={this.state.selectedRecentPeriod}
          // onChange={e => {
          //   this.setState({
          //     selectedRecentPeriod: e,
          //     rangePickerValue: [null, null]
          //   });
          //   this.setPeriodBySelect(e);
          // }}
        >
          <Option value="all">状态</Option>
          <Option value="outside">外训</Option>
          <Option value="inside">内训</Option>
        </Select>
        <Search
          className="emploee_courses-header-search"
          placeholder="请输入"
          onSearch={value =>
            this.setState({ searchKey: value }, this.searchMyCourse)
          }
          enterButton
          allowClear
        />
      </div>
      <div className="emploee_courses-header-status_description">
        <div className="emploee_courses-header-status_description-item">
          <span
            style={{
              backgroundColor: '#57c22d'
            }}
          ></span>
          已完成
        </div>
        <div className="emploee_courses-header-status_description-item">
          <span
            style={{
              backgroundColor: '#2593fc'
            }}
          ></span>
          进行中
        </div>
        <div className="emploee_courses-header-status_description-item">
          <span
            style={{
              backgroundColor: '#aaa'
            }}
          ></span>
          待完成
        </div>
      </div>
    </header>
  );
  handleDetailClick = () => {
    this.setState({
      visible: true
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
      feebackVisible: false,
      feedbackModalMode: 'view'
    });
  };
  handleOk = () => {
    this.setState({
      visible: false,
      feebackVisible: false
    });
  };
  handleOpenAppAndFeeback = () => {
    this.setState({
      applyVisible: true
    });
  };
  handleApplyOk = () => {
    this.setState({
      applyVisible: false
    });
  };
  handleApplyCancel = () => {
    this.setState({
      applyVisible: false,
      applyModalMode: 'view'
    });
  };
  closeCourseDetailOpenApply = () => {
    this.setState({
      visible: false,
      applyVisible: true
    });
  };
  // 关闭详情 打开反馈模态框
  closeCourseDetailOpenFeeback = () => {
    this.setState({
      visible: false,
      feebackVisible: true
    });
  };

  //提交申请单
  submitApply = async () => {
    let res,
      record = { ...this.state.selectedCourse };
    try {
      res = await http().modifyRecords({
        resid: resid,
        data: [{ REC_ID: record.REC_ID, C3_615488174421: 'Y' }]
      });
      message.success(res.message);
      let myCourses = [...this.state.myCourses],
        selectedCourse = { ...res.data[0], checked: true };
      myCourses[
        myCourses.findIndex(item => item.REC_ID === selectedCourse.REC_ID)
      ] = selectedCourse;
      this.setState({
        applyVisible: false,
        applyModalMode: 'view',
        myCourses,
        selectedCourse
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  //打开填写心得模态窗
  openWriteTip = async () => {
    this.setState({
      tipsModalVisible: true,
      tipsModalMode: 'modify'
    });
    let res;
    try {
      res = await this.getTip();
      if (res.data.length > 0) {
        let tip = {
          title: res.data[0].C3_614964239022,
          tips: res.data[0].C3_614964225030
        };
        this.setState({ tip });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  onSaveTip = async () => {
    let res,
      tip = { ...this.state.tip };
    if (tip.title.trim() === '') {
      return message.error('标题不能为空');
    }
    if (tip.tips.trim() === '') {
      return message.error('心得感悟不能为空');
    }
    try {
      res = await this.saveTip(tip, false);
      this.setState({
        tipsModalVisible: false,
        tipsModalMode: 'view',
        tip: { title: '', tips: '' }
      });
      message.success(res.message);
    } catch (error) {
      message.error(error.message);
    }
  };
  //调用后端接口保存心得
  saveTip = async (tip, isSubmit) => {
    let res;
    try {
      res = await http().addRecords({
        resid: TIPS_RESID,
        data: [
          {
            C3_614964239022: tip.title,
            C3_614964225030: tip.tips,
            C3_614964322197: isSubmit ? 'Y' : '',
            C3_615479417558: this.state.selectedCourse.CourseArrangeDetailID
          }
        ],
        isEditOrAdd: true
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  //提交心得
  submitTip = async () => {
    let tip = { ...this.state.tip },
      res;
    if (tip.title.trim() === '') {
      return message.error('标题不能为空');
    }
    if (tip.tips.trim() === '') {
      return message.error('心得感悟不能为空');
    }
    try {
      res = await this.saveTip(tip, true);
      message.success(res.message);
      await this.getCourseById();
      this.setState({
        tipsModalVisible: false,
        tipsModalMode: 'view',
        tip: { title: '', tips: '' }
      });
    } catch (error) {
      console.log(error.message);
      message.error(error.message);
    }
  };

  //根据课程明细id获取，用于提交心得后刷新数据
  getCourseById = async () => {
    let res,
      { selectedCourse } = this.state;
    try {
      res = await http().getTable({
        resid,
        cmswhere: `CourseArrangeDetailID = '${selectedCourse.CourseArrangeDetailID}'`
      });
      if (res.data.length > 0) {
        let myCourses = [...this.state.myCourses],
          selectedCourse = { ...res.data[0], checked: true };
        myCourses[
          myCourses.findIndex(item => item.REC_ID === selectedCourse.REC_ID)
        ] = selectedCourse;
        this.setState({ myCourses, selectedCourse });
      } else {
        message.error('获取课程失败！');
      }
    } catch (error) {
      console.log(error.message);
      message.error(error.message);
    }
  };

  renderCoursesList = () => {
    let { myCourses } = this.state;
    return myCourses.map(item => (
      <Card
        extra={<Radio checked={item.checked} />}
        title={item.C3_613941384592}
        style={{ marginBottom: '12px', cursor: 'pointer' }}
        key={item.REC_ID}
        bodyStyle={{ padding: 8 }}
        onClick={this.handleSelectCourse.bind(this, item)}
      >
        <div className="emploee_courses-main-course_content">
          <div className="course_item">
            讲师:<span style={{ paddingLeft: 12 }}>{item.C3_613941386081}</span>
          </div>
          <div className="course_item">
            人数:<span style={{ paddingLeft: 12 }}>{item.C3_613941386325}</span>
          </div>
          <div className="course_item">
            地点:<span style={{ paddingLeft: 12 }}>{item.C3_613941386325}</span>
          </div>
          <div className="course_item">
            时间:<span style={{ paddingLeft: 12 }}>{item.courseTime}</span>
          </div>
        </div>
        <Divider style={{ margin: '12px 0' }} />
        <div className="emploee_courses-main-course_footer">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: '#2470e8',
                marginRight: 6
              }}
            ></span>
            {item.C3_613961012148}
          </div>
          <div>
            <Button
              type="link"
              icon="info-circle"
              onClick={() => {
                this.handleDetailClick();
              }}
            >
              课程详情
            </Button>
          </div>
        </div>
      </Card>
    ));
  };
  getColor(key) {
    let color = '#aaa';
    switch (key) {
      case 'Y':
        color = 'green';
        break;
      case 'N':
        color = '#aaa';
        break;
      case 'ing':
        color = 'blue';
        break;
      default:
        color = '#aaa';
        break;
    }
    return color;
  }

  //关闭心得模态窗
  onCloseTipModal = () =>
    this.setState({
      tipsModalVisible: false,
      tipsModalMode: 'view',
      tip: {
        title: '',
        tips: ''
      },
      selcetedTip: {}
    });
  render() {
    let selectedCourse = { ...this.state.selectedCourse },
      startColor = '#aaa',
      endColor = '#aaa';
    let now = moment();
    //开始时间
    if (
      selectedCourse.C3_615393041304 &&
      now.isAfter(selectedCourse.C3_615393041304)
    ) {
      startColor = 'green';
    }
    //结束时间
    if (
      selectedCourse.C3_615393093633 &&
      now.isAfter(selectedCourse.C3_615393093633)
    ) {
      endColor = 'green';
    }
    return (
      <div className="emploee_courses">
        <Tabs defaultActiveKey="MyCourses" tabBarStyle={TABBARSTYLE}>
          <TabPane tab="课程管理" key="MyCourses">
            {this.renderHeader()}
            <main className="emploee_courses-main">
              <div style={{ flex: 1, marginRight: '12px', overflow: 'scroll' }}>
                {this.renderCoursesList()}
                <Pagination defaultCurrent={1} total={50} />
              </div>
              {/* 右侧TimeLine */}
              <div style={{ width: '30%', padding: '0 12px' }}>
                {selectedCourse && selectedCourse.courseType === '外训' ? (
                  <Timeline>
                    <Timeline.Item
                      color={this.getColor(selectedCourse.isSubmitPlan)}
                    >
                      <div>
                        <span> 计划提交</span>
                        <span style={{ paddingLeft: 12 }}>
                          {selectedCourse.C3_615392983685}
                        </span>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      color={this.getColor(selectedCourse.C3_613956470258)}
                    >
                      <div>
                        <span>计划审批</span>
                        <span style={{ paddingLeft: 12 }}>
                          {selectedCourse.C3_615394023182}
                        </span>
                      </div>
                      <div>
                        {selectedCourse.C3_613956470258 === 'Y' &&
                        selectedCourse.C3_615377523072 === 'ing' ? (
                          <span
                            className="timeline_action"
                            onClick={() => {
                              this.setState({
                                applyVisible: true,
                                applyModalMode: 'modify'
                              });
                            }}
                          >
                            填写申请单
                          </span>
                        ) : null}
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      color={this.getColor(selectedCourse.C3_615377523072)}
                    >
                      <div>
                        <span>申请单提交</span>
                        <span style={{ paddingLeft: 12 }}>
                          {selectedCourse.C3_615377538264}
                        </span>
                      </div>
                      {selectedCourse.C3_615377523072 === 'Y' ? (
                        <div>
                          <span
                            className="timeline_action"
                            onClick={() => {
                              this.setState({ applyVisible: true });
                            }}
                          >
                            查看申请单
                          </span>
                          <span
                            className="timeline_action"
                            onClick={() => {
                              this.setState({ ReviewRecordModalVisible: true });
                            }}
                          >
                            查看审批记录
                          </span>
                        </div>
                      ) : null}
                    </Timeline.Item>
                    <Timeline.Item
                      color={this.getColor(selectedCourse.C3_613961439740)}
                    >
                      <div>
                        <span>申请单审批</span>
                        <span style={{ paddingLeft: 12 }}>
                          {selectedCourse.C3_615377747279}
                        </span>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item color={startColor}>
                      <div>
                        <span>上课开始</span>
                        <span style={{ paddingLeft: 12 }}>
                          {selectedCourse.C3_615393041304}
                        </span>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item color={endColor}>
                      <div>
                        <span>上课结束</span>
                        <span style={{ paddingLeft: 12 }}>
                          {selectedCourse.C3_615393093633}
                        </span>
                      </div>
                      <div>
                        {/* 课程反馈与行动计划 是否为进行中 */}
                        {selectedCourse.C3_615377473913 === 'ing' ? (
                          <span
                            className="timeline_action"
                            onClick={() =>
                              this.setState({
                                feebackVisible: true,
                                feedbackModalMode: 'modify'
                              })
                            }
                          >
                            填写课程反馈与行动计划
                          </span>
                        ) : null}
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      color={this.getColor(selectedCourse.C3_615377473913)}
                    >
                      <div>
                        <span>课程反馈与行动计划</span>
                        <span style={{ paddingLeft: 12 }}>
                          {selectedCourse.C3_615377481222}
                        </span>
                      </div>
                      <div>
                        {selectedCourse.C3_615377473913 === 'Y' ? (
                          <span
                            className="timeline_action"
                            onClick={() =>
                              this.setState({ feebackVisible: true })
                            }
                          >
                            查看课程反馈与行动计划
                          </span>
                        ) : null}
                        {selectedCourse.isSubmitFeel === 'ing' ? (
                          <span
                            className="timeline_action"
                            onClick={this.openWriteTip}
                          >
                            填写心得
                          </span>
                        ) : null}
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      color={this.getColor(selectedCourse.isSubmitFeel)}
                    >
                      <div>
                        <span>心得体会</span>
                        <span style={{ paddingLeft: 12 }}>
                          {selectedCourse.C3_615377481222}
                        </span>
                      </div>
                      <div>
                        {selectedCourse.isSubmitFeel === 'Y' ? (
                          <span
                            className="timeline_action"
                            onClick={() => {
                              this.setState({ tipsModalMode: 'view' });
                              this.getTip();
                            }}
                          >
                            查看心得
                          </span>
                        ) : null}
                      </div>
                    </Timeline.Item>
                  </Timeline>
                ) : null}
                {selectedCourse && selectedCourse.courseType === '内训' ? (
                  <Timeline>
                    <Timeline.Item
                      color={this.getColor(selectedCourse.isApply)}
                    >
                      <div>
                        <span>报名</span>
                        <span style={{ paddingLeft: 12 }}>
                          {selectedCourse.C3_615392983685}
                        </span>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item color={startColor}>
                      <div>
                        <span>上课开始</span>
                        <span style={{ paddingLeft: 12 }}>
                          {selectedCourse.C3_615393041304}
                        </span>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      color={this.getColor(selectedCourse.isSignIn)}
                    >
                      <div>
                        <span>签到</span>
                        <span style={{ paddingLeft: 12 }}>
                          {selectedCourse.C3_615392983685}
                        </span>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item color={endColor}>
                      <div>
                        <span>上课结束</span>
                        <span style={{ paddingLeft: 12 }}>
                          {selectedCourse.C3_615393093633}
                        </span>
                      </div>
                      <div>
                        {/* 课程反馈与行动计划 是否为进行中 */}
                        {selectedCourse.isInnerFeedback === 'ing' ? (
                          <span className="timeline_action">填写课程反馈</span>
                        ) : null}
                      </div>
                    </Timeline.Item>
                    <Timeline.Item color={this.getColor(selectedCourse)}>
                      <div>
                        <span>课程反馈</span>
                        <span style={{ paddingLeft: 12 }}>
                          {selectedCourse.C3_615377481222}
                        </span>
                      </div>
                      <div>
                        {selectedCourse.isInnerFeedback === 'Y' ? (
                          <span className="timeline_action">查看课程反馈</span>
                        ) : null}
                      </div>
                    </Timeline.Item>
                  </Timeline>
                ) : null}
              </div>
            </main>
          </TabPane>
          <TabPane tab="课程日历" key="CoursesCalendar" forceRender>
            <div style={{ flex: 1, height: '100%', overflow: 'auto' }}>
              <Calendar
                eventKeyword=""
                events={[...this.state.calendarEvents]}
                defaultActiveTab="month"
              />
            </div>
          </TabPane>
        </Tabs>
        <Modal
          title="课程详情"
          visible={this.state.visible}
          width={this.state.wid}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          centered
        >
          <CourseDetail
            onCloseDetailOpenAppply={this.closeCourseDetailOpenApply}
            onCloseDetailOpenFeeback={this.closeCourseDetailOpenFeeback}
          />
        </Modal>
        <Modal
          title="申请单"
          visible={this.state.applyVisible}
          onCancel={this.handleApplyCancel}
          destroyOnClose
          width={this.state.wid}
          footer={
            this.state.applyModalMode === 'modify'
              ? [
                  <Button
                    onClick={() => {
                      this.setState({
                        applyVisible: false,
                        applyModalMode: 'view'
                      });
                    }}
                  >
                    关闭
                  </Button>,
                  <Popconfirm
                    title="确认提交？"
                    okText="确认"
                    cancelText="取消"
                    onConfirm={this.submitApply}
                  >
                    <Button type="primary">提交</Button>
                  </Popconfirm>
                ]
              : [
                  <Button
                    onClick={() => {
                      this.setState({
                        applyVisible: false,
                        applyModalMode: 'view'
                      });
                    }}
                  >
                    关闭
                  </Button>
                ]
          }
        >
          <CourseApply
            mode={this.state.applyModalMode}
            course={this.state.selectedCourse}
          />
        </Modal>
        <Modal
          title="反馈和行动计划"
          visible={this.state.feebackVisible}
          width={this.state.wid}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={
            this.state.feedbackModalMode === 'modify'
              ? null
              : [
                  <Button
                    onClick={() => {
                      this.setState({
                        feebackVisible: false,
                        feedbackModalMode: 'view'
                      });
                    }}
                  >
                    关闭
                  </Button>
                ]
          }
        >
          <FeedBackAndPlan mode={this.state.feedbackModalMode} />
        </Modal>
        {/* 审批记录模态窗 */}
        <Modal
          title="申请单审批记录"
          visible={this.state.ReviewRecordModalVisible}
          width="70%"
          onOk={() => {
            this.setState({ ReviewRecordModalVisible: false });
          }}
          onCancel={() => {
            this.setState({ ReviewRecordModalVisible: false });
          }}
          centered
        >
          {this.state.selectedCourse ? (
            <TableData
              resid={REVIEW_RECOR_RESID}
              subtractH={240}
              hasBeBtns={true}
              hasAdd={false}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              actionBarFixed={true}
              hasRowModify={false}
              height="70vh"
              cmswhere={`C3_615657103208 = ${this.state.selectedCourse.CourseArrangeDetailID} `}
            />
          ) : null}
        </Modal>
        {/* 心得模态窗 */}
        <Modal
          title="心得"
          visible={this.state.tipsModalVisible}
          destroyOnClose
          width="70%"
          onCancel={this.onCloseTipModal}
          footer={
            this.state.tipsModalMode === 'modify'
              ? [
                  <Button onClick={this.onCloseTipModal}>关闭</Button>,
                  <Button onClick={this.onSaveTip}>保存</Button>,
                  <Button type="primary" onClick={this.submitTip}>
                    提交
                  </Button>
                ]
              : [<Button onClick={this.onCloseTipModal}>关闭</Button>]
          }
        >
          {this.state.tipsModalMode === 'modify' ? (
            <div style={{ padding: 12 }}>
              <div>
                <label>
                  <strong>标题</strong>
                </label>
                <Input
                  type="text"
                  value={this.state.tip.title}
                  onChange={e => {
                    let tip = { ...this.state.tip, title: e.target.value };
                    this.setState({ tip });
                  }}
                />
              </div>
              <div>
                <label>
                  <strong>心得感悟</strong>
                </label>
                <div>要求：请写下您在培训中的收获，2~3点，不少于100字</div>
                <Input.TextArea
                  rows={15}
                  value={this.state.tip.tips}
                  onChange={e => {
                    let tip = { ...this.state.tip, tips: e.target.value };
                    this.setState({ tip });
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={{ padding: 12 }}>
              {/* 标题 */}
              <h2 style={{ textAlign: 'center' }}>
                {this.state.selcetedTip.C3_614964239022}
              </h2>
              <Divider />
              {/* 内容 */}
              <pre>{this.state.selcetedTip.C3_614964225030}</pre>
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default EmployeeCourses;
