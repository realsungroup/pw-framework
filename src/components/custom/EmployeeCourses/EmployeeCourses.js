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
import './EmployeeCourses.less';
import http from 'Util20/api';
import CourseDetail from './CourseDetail';
import CourseApply from './CourseApply';
const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;

const resid = '615378031605';

class EmployeeCourses extends React.Component {
  state = {
    myCourses: [], //我的课程
    selectedCourse: null, //选中的课程
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
      myCourses[0].checked = true;
      let selectedCourse = { ...myCourses[0] };
      this.setState({ myCourses, selectedCourse });
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
        style={{ marginBottom: '12px' }}
        key={item.REC_ID}
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
          <span>{item.C3_613961012148}</span>
          <span>
            <Button
              type="link"
              icon="info-circle"
              onClick={() => {
                this.handleDetailClick();
              }}
            >
              课程详情
            </Button>
          </span>
        </div>
      </Card>
    ));
  };
  render() {
    let selectedCourse = { ...this.state.selectedCourse };
    return (
      <div className="emploee_courses">
        <Tabs defaultActiveKey="MyCourses" onChange={this.handleTabsChange}>
          <TabPane tab="我的课程" key="MyCourses">
            {this.renderHeader()}
            <main
              style={{ display: 'flex', height: '90vh', paddingTop: '18px' }}
            >
              <div style={{ flex: 1, marginRight: '12px', overflow: 'scroll' }}>
                {this.renderCoursesList()}
                <Pagination defaultCurrent={1} total={50} />
              </div>
              <div style={{ width: '30%', padding: '0 12px' }}>
                {selectedCourse.courseType === '外训' ? (
                  <Timeline>
                    <Timeline.Item color="green">
                      计划提交{selectedCourse.C3_615392983685}
                    </Timeline.Item>
                    <Timeline.Item color="green">
                      计划审批{selectedCourse.C3_615394023182}
                    </Timeline.Item>
                    <Timeline.Item>
                      {' '}
                      申请单提交{selectedCourse.C3_615377538264}
                    </Timeline.Item>
                    <Timeline.Item color="#aaa">
                      {' '}
                      申请单审批{selectedCourse.C3_615377747279}
                    </Timeline.Item>
                    <Timeline.Item color="#aaa">
                      {' '}
                      上课开始{selectedCourse.C3_615393041304}
                    </Timeline.Item>
                    <Timeline.Item color="#aaa">
                      {' '}
                      上课结束{selectedCourse.C3_615393093633}
                    </Timeline.Item>
                    <Timeline.Item color="#aaa">
                      {' '}
                      课程反馈{selectedCourse.C3_615377481222}
                    </Timeline.Item>
                    <Timeline.Item color="#aaa"> 课程完成</Timeline.Item>
                  </Timeline>
                ) : (
                  <Timeline>
                    <Timeline.Item color="green">报名</Timeline.Item>
                    <Timeline.Item color="green">上课开始</Timeline.Item>
                    <Timeline.Item>签到</Timeline.Item>
                    <Timeline.Item color="#aaa">上课结束</Timeline.Item>
                    <Timeline.Item color="#aaa">课程反馈</Timeline.Item>
                    <Timeline.Item color="#aaa">课程完成</Timeline.Item>
                  </Timeline>
                )}
              </div>
            </main>
          </TabPane>
          <TabPane tab="课程日历" key="CoursesCalendar">
            课程日历
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
