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
  Modal
} from 'antd';
import moment from 'moment';
import './EmployeeCourses.less';
import http from 'Util20/api';
import Calendar from 'ic-components/lib/Calendar';
import 'ic-components/lib/Calendar/style/index.less';

import CourseDetail from './CourseDetail';
import CourseApply from './CourseApply';
const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;

const resid = '615378031605';

const events = [
  {
    occur_id: 1, // 事件发生编号（唯一）
    category_color: 'rgb(67, 209, 227)',
    event_title: '事件1',
    event_short: '海市黄埔区茂名南路58号上海花园酒店',
    event_desc: '事件1：一楼大堂右侧',
    occur_begin: '2019-07-03T00:00:00.000Z', // 事件发生时间
    occur_end: '2019-07-11T23:59:59.999Z', // 事件发生结束时间
    event_hostheadurl: 'http://placekitten.com/30/30',
    event_image: 'http://placekitten.com/200/140',
    event_time: '00:00',
    event_endtime: '23:59',
    event_weather: 1,
    event_attach: ['附件', 'http://www.baidu.com'],
    event_important: 1,
    category_name: '分类1'
  },
  {
    occur_id: 2, // 事件发生编号（唯一）
    category_color: 'rgb(255, 160, 120)',
    event_title: '事件2',
    event_short: '上海市黄埔区茂名南路59号上海花园酒店',
    event_desc: '事件2：一楼大堂右侧',
    occur_begin: '2019-07-03T00:00:00.000Z', // 事件发生时间
    occur_end: '2019-07-22T10:59:59.999Z', // 事件发生结束时间
    event_hostheadurl: 'http://placekitten.com/32/32',
    event_image: 'http://placekitten.com/200/150',
    event_time: '08:30',
    event_endtime: '09:00',
    event_weather: 2,
    event_attach: ['附件', 'http://www.baidu.com'],
    event_important: 0,
    category_name: '分类1'
  }
];
class EmployeeCourses extends React.Component {
  state = {
    myCourses: [], //我的课程
    selectedCourse: null, //选中的课程
    calendarEvents: [],
    wid: '80%',
    applyVisible: false
  };
  componentDidMount() {
    this.getCourses();
  }
  getCourses = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: resid
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
            event_hostheadurl: 'http://placekitten.com/32/32',//事件前面的图片
            event_title: item.C3_613941384592,
            occur_begin: moment(item.C3_615393041304).format(), // 事件发生时间
            occur_end: moment(item.C3_615393093633).format(), // 事件发生结束时间
            event_important: ++importantIndex,
            category_name: item.C3_613941384592,
          };
        });
        console.log(calendarEvents);
        this.setState({ myCourses, selectedCourse, calendarEvents });
      }
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };
  handleTabsChange = key => {};
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
          defaultValue="all"
          // value={this.state.selectedRecentPeriod}
          style={{ width: 100, marginRight: 5 }}
          // onChange={e => {
          //   this.setState({
          //     selectedRecentPeriod: e,
          //     rangePickerValue: [null, null]
          //   });
          //   this.setPeriodBySelect(e);
          // }}
        >
          <Option value="all">财年</Option>
          <Option value="week">一周内</Option>
          <Option value="weeks">两周内</Option>
          <Option value="month">一个月内</Option>
          <Option value="months">两个月内</Option>
        </Select>
        <Select
          defaultValue="all"
          // value={this.state.selectedRecentPeriod}
          style={{ width: 120, marginRight: 5 }}
          // onChange={e => {
          //   this.setState({
          //     selectedRecentPeriod: e,
          //     rangePickerValue: [null, null]
          //   });
          //   this.setPeriodBySelect(e);
          // }}
        >
          <Option value="all">内训/外训</Option>
          <Option value="outside">外训</Option>
          <Option value="inside">内训</Option>
        </Select>
        <Select
          defaultValue="all"
          // value={this.state.selectedRecentPeriod}
          style={{ width: 120, marginRight: 5 }}
          // onChange={e => {
          //   this.setState({
          //     selectedRecentPeriod: e,
          //     rangePickerValue: [null, null]
          //   });
          //   this.setPeriodBySelect(e);
          // }}
        >
          <Option value="all">课程类别</Option>
          <Option value="outside">外训</Option>
          <Option value="inside">内训</Option>
        </Select>
        <Select
          defaultValue="all"
          // value={this.state.selectedRecentPeriod}
          style={{ width: 120, marginRight: 5 }}
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
          onSearch={value => console.log(value)}
          enterButton
        />
      </div>
      <div
        style={{
          width: '30%',
          display: 'flex',
          justifyContent: 'space-around'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              height: 14,
              width: 14,
              borderRadius: '50%',
              backgroundColor: '#57c22d',
              marginRight: 6
            }}
          ></span>
          已完成
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              height: 14,
              width: 14,
              borderRadius: '50%',
              backgroundColor: '#2593fc',
              marginRight: 6
            }}
          ></span>
          进行中
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              height: 14,
              width: 14,
              borderRadius: '50%',
              backgroundColor: '#aaa',
              marginRight: 6
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
      visible: false
    });
  };
  handleOk = () => {
    this.setState({
      visible: false
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
      applyVisible: false
    });
  };
  closeCourseDetailOpenApply = () => {
    this.setState({
      visible: false,
      applyVisible: true
    });
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

  render() {
    let selectedCourse = { ...this.state.selectedCourse },
      startColor = '#aaa',
      endColor = '#aaa';
    let now = moment();
    if (
      selectedCourse.C3_615393041304 &&
      now.isAfter(selectedCourse.C3_615393041304)
    ) {
      startColor = 'green';
    }
    if (
      selectedCourse.C3_615393093633 &&
      now.isAfter(selectedCourse.C3_615393093633)
    ) {
      endColor = 'green';
    }
    return (
      <div className="emploee_courses">
        <Tabs
          defaultActiveKey="MyCourses"
          onChange={this.handleTabsChange}
        >
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
                          <span className="timeline_action">填写申请单</span>
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
                          <span className="timeline_action">查看申请单</span>
                          <span className="timeline_action">查看审批记录</span>
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
                          <span className="timeline_action">
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
                          <span className="timeline_action">
                            查看课程反馈与行动计划
                          </span>
                        ) : null}
                        {selectedCourse.isSubmitFeel === 'ing' ? (
                          <span className="timeline_action">填写心得</span>
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
                          <span className="timeline_action">查看心得</span>
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
          <TabPane tab="课程日历" key="CoursesCalendar">
            <div style={{ flex: 1, height: '100%', overflow: 'auto' }}>
              <Calendar
                eventKeyword=""
                events={[
                  ...this.state.calendarEvents
                ]}
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
        >
          <CourseDetail
            onCloseDetailOpenAppply={this.closeCourseDetailOpenApply}
          />
        </Modal>
        <Modal
          title="申请表和反馈"
          visible={this.state.applyVisible}
          onOk={this.handleApplyOk}
          onCancel={this.handleApplyCancel}
          width={this.state.wid}
        >
          <CourseApply />
        </Modal>
      </div>
    );
  }
}

export default EmployeeCourses;
