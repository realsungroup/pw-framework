import React from 'react';
import {
  Card,
  Button,
  Icon,
  Popconfirm,
  Modal,
  DatePicker,
  Input,
  message,
  List,
  Radio,
  Form,
  Select,
  Tabs
} from 'antd';
import moment from 'moment';
import './NoticeAttendClass.less';
import http from 'Util20/api';
import InternalCourseCalendar from './InternalCourseCalendar';
import { TableData } from '../../../common/loadableCommon';
const TabPane = Tabs.TabPane;

const { RangePicker } = DatePicker;
const { Search } = Input;
const courseArrangmentResid = '615549231946'; //课程安排表id

const noNoticeID = '616168186243';
const NoticedID = '616168268408';
const allArrangeID = '616168233494';

const datetimeFormatString = 'YYYY-MM-DD HH:mm';
const dateFormatString = 'YYYY-MM-DD';
const activeStyle = {
  fontSize: 20,
  marginRight: 6,
  cursor: 'pointer',
  color: '#2593fb'
};

const unactiveStyle = {
  fontSize: 20,
  marginRight: 6,
  cursor: 'pointer'
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

class NoticeAttendClass extends React.Component {
  state = {
    mode: 'card', // 显示模式，有卡片模式、日历模式、表格模式，默认卡片模式
    courseArrangments: [], //内训课程安排
    searchKeyword: '', //搜索的关键词
    searchPeriod: ['', ''], //搜索时间段
    selectedCourseArrangment: {}, //选中的课程安排
    isShowModifyModal: false, //是否显示修改课程安排模态窗
    isShowModal: false,
    modifiedCourseArrangement: {}, //修改后的课程安排
    calendarEvents: [], //日历事件
    currentArrangeID: '616168186243',
    key: '',
    CourseArrangeID:""
  };

  async componentDidMount() {
    this.props.onHandleLoading(true);
    await this.getCourseArrangment();
    this.props.onHandleLoading(false);
  }

  onGetData = async key => {
    if (key) {
      this.setState({
        key: key,
        mode: 'card'
      });
    } else {
      key = this.state.key;
    }
    await this.getCourseArrangment(key);
  };
  getCourseArrangment = async key => {
    let res;
    let arrangeID = '616168186243';
    console.log('key', key);
    if (key === '0') {
      arrangeID = noNoticeID;
      this.setState({
        currentArrangeID: arrangeID
      });
    } else if (key === '1') {
      arrangeID = NoticedID;
      this.setState({
        currentArrangeID: arrangeID
      });
    } else if (key === '2') {
      arrangeID = allArrangeID;
      this.setState({
        currentArrangeID: arrangeID
      });
    } else {
      this.setState({
        currentArrangeID: arrangeID
      });
    }

    try {
      res = await http().getTable({
        resid: arrangeID
      });
    } catch (error) {
      message.error(error.message);
      return console.log(error);
    }
    if (res.error === 0) {
      let courseArrangments = res.data;
      let courses = courseArrangments
        .map(item => ({
          CourseID: item.CourseID,
          CourseName: item.CourseName
        }))
        .filter((item, index, self) => {
          return self.findIndex(i => item.CourseID === i.CourseID) === index;
        });
      let importantIndex = 0;
      let calendarEvents = courseArrangments.map(item => {
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
          event_title: item.CourseName,
          occur_begin: moment(item.StartDatetime).format(), // 事件发生时间
          occur_end: moment(item.EndDatetime).format(), // 事件发生结束时间
          event_important: ++importantIndex,
          category_name: item.CourseName
        };
      });
      // console.log(courseArrangments,calendarEvents);
      this.setState({ courseArrangments, courses, calendarEvents });
    } else {
      message.error(res.message);
    }
  };

  //删除课程安排
  deleteCourseArrangment = async arrangment => {
    let { courseArrangments } = this.state;
    let res;
    try {
      res = await http().removeRecords({
        resid: courseArrangmentResid,
        data: [arrangment]
      });
      message.success(res.message);
      courseArrangments.splice(
        courseArrangments.findIndex(item => {
          return item.REC_ID === arrangment.REC_ID;
        }),
        1
      );
      this.setState({ courseArrangments });
    } catch (error) {
      message.error(error.message);
    }
  };
  //修改课程安排
  modifyCourseArrangment = async data => {
    let res;
    try {
      res = await http().modifyRecords({
        resid: courseArrangmentResid,
        data: [data]
      });
      message.success(res.message);
      this.searchCourseArrangment();
    } catch (error) {
      message.error(error.message);
    }
  };
  //搜索课程安排
  searchCourseArrangment = async key => {
    let res,
      { searchPeriod, searchKeyword } = this.state;
    let isHasPeriod = searchPeriod[0] && searchPeriod[1];
    try {
      this.props.onHandleLoading(true);
      res = await http().getTable({
        resid: this.state.currentArrangeID,
        key: searchKeyword,
        cmswhere: isHasPeriod
          ? `StartDatetime > '${searchPeriod[0]}'  and StartDatetime < '${
              searchPeriod[1]
            }'`
          : ''
      });
      let courseArrangments = res.data;
      this.setState({ courseArrangments });
      this.props.onHandleLoading(false);
    } catch (error) {
      this.props.onHandleLoading(false);
    }
  };
  //设置确认选择的时间段
  onOk = async value => {
    this.setState(
      {
        searchPeriod: [
          value[0].format('YYYY-MM-DD HH:mm:ss'),
          value[1].format('YYYY-MM-DD HH:mm:ss')
        ],
        selectedRecentPeriod: 'all'
      },
      this.searchCourseArrangment
    );
  };

  //判断是否为清空操作
  onRangeSearchChange = (value, dateString) => {
    let rangePickerValue = value.length ? value : [null, null];
    this.setState({ rangePickerValue });
    if (!value.length) {
      this.setState(
        { searchPeriod: dateString, selectedRecentPeriod: 'all' },
        this.searchCourseArrangment
      );
    }
  };
  //点击通知
  onMessage = async item => {
    console.log('item', item);
    let res;
    item.C3_614449043675 = 'Y';
    try {
      res = await http().modifyRecords({
        resid: courseArrangmentResid,
        data: [item]
      });
      message.success('通知成功！');
      this.onGetData();
    } catch (error) {
      message.error(error.message);
    }
  };
  render() {
    let { mode, courseArrangments } = this.state;
    return (
      <div style={{ flex: 1, display: 'flex' }}>
        <div className="notice_attend_class">
          <Tabs defaultActiveKey="0" onChange={this.onGetData.bind(this)}>
            <TabPane
              tab={'未通知'}
              key="0"
              style={{ width: '100%', height: '100%' }}
            >
              <header className="notice_attend_class-header">
                <div className="notice_attend_class-header_Mode">
                  <span
                    style={{ fontSize: 22, fontWeight: 700, marginRight: 6 }}
                  >
                    显示模式:
                  </span>
                  <div>
                    <Icon
                      type="credit-card"
                      style={mode === 'card' ? activeStyle : unactiveStyle}
                      key="card"
                      theme={mode === 'card' ? 'filled' : null}
                      title="卡片模式"
                      onClick={() => {
                        this.setState({ mode: 'card' });
                      }}
                    />
                    <Icon
                      type="table"
                      style={mode === 'table' ? activeStyle : unactiveStyle}
                      key="card"
                      // theme={mode === 'table' ? 'filled' : null}
                      title="表格模式"
                      onClick={() => {
                        this.setState({ mode: 'table' });
                      }}
                    />
                    <Icon
                      key="calendar"
                      type="calendar"
                      style={mode === 'calendar' ? activeStyle : unactiveStyle}
                      theme={mode === 'calendar' ? 'filled' : null}
                      title="日历模式"
                      onClick={() => {
                        this.setState({ mode: 'calendar' });
                      }}
                    />
                  </div>
                </div>
                <div className="notice_attend_class-header_search">
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['开始日期', '结束日期']}
                    onOk={this.onOk}
                    onChange={this.onRangeSearchChange}
                    value={this.state.rangePickerValue}
                  />
                  <Search
                    placeholder="输入课程关键字搜索"
                    onSearch={value => {
                      this.setState(
                        { searchKeyword: value },
                        this.searchCourseArrangment
                      );
                    }}
                    enterButton
                    style={{ width: 200, marginLeft: 5 }}
                  />
                </div>
              </header>
              {this.state.mode === 'card' && (
                <div className="notice_attend_class-course_list">
                  {courseArrangments.length ? (
                    courseArrangments.map(item => (
                      <Card
                        title={
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <span>{item.CourseName}</span>
                            <span
                              className="notice_attend_class-course_list-course_type"
                              style={
                                item.innerArrangeType === '1'
                                  ? { backgroundColor: '#1787fb' }
                                  : { backgroundColor: '#57c22d' }
                              }
                            >
                              {item.C3_616254048241}
                            </span>
                          </div>
                        }
                        className="notice_attend_class_item"
                        key={item.REC_ID}
                        hoverable
                        actions={[
                          <Popconfirm
                            title="确认通知？"
                            onConfirm={this.onMessage.bind(this, item)}
                            icon={
                              <Icon
                                type="question-circle-o"
                                style={{ color: 'red' }}
                              />
                            }
                          >
                            <span>
                              <Icon type="message" />
                              通知
                            </span>
                          </Popconfirm>,
                          <span
                            onClick={() => {
                              this.setState({
                                CourseArrangeID:item.CourseArrangeID
                                // isShowLearnerInfo: true,
                                // selectedCourseArrangment: item
                              });
                              this.setState({
                                isShowModal: true
                              });
                              // this.props.onCheckPeople();
                            }}
                          >
                            <Icon type="team" />
                            查看人员
                          </span>
                        ]}
                      >
                        <div className="notice_attend_class_item_content">
                          <div className="content_item">
                            主讲:{item.Teacher}
                          </div>
                          <div className="content_item">
                            人数:{item.Attendees}
                          </div>
                          <div className="content_item">
                            地点:{item.CourseLocation}
                          </div>
                          <div className="content_item">
                            预计时间：{item.CoursePlanDate}
                          </div>
                          <div className="content_item">
                            开课时间：{item.StartDatetime}
                          </div>
                          <div className="content_item">
                            结束时间：{item.EndDatetime}
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <List
                      dataSource={courseArrangments}
                      style={{ width: '100%' }}
                    ></List>
                  )}
                </div>
              )}
              {this.state.mode === 'calendar' && (
                <div style={{ height: '100%' }}>
                  <InternalCourseCalendar events={this.state.calendarEvents} />
                </div>
              )}
              {this.state.mode === 'table' && (
                <div style={{ height: 'calc(100vh - 170px)' }}>
                  <TableData
                    resid={616073391736}
                    hasModify={false}
                    hasDelete={false}
                    hasAdd={false}
                    hasRowDelete={false}
                    hasRowVModify={false}
                    hasRowView={false}
                    subtractH={240}
                  ></TableData>
                </div>
              )}
            </TabPane>
            <TabPane
              tab={'已通知'}
              key="1"
              style={{ width: '100%', height: '100%' }}
            >
              <header className="notice_attend_class-header">
                <div className="notice_attend_class-header_Mode">
                  <span
                    style={{ fontSize: 22, fontWeight: 700, marginRight: 6 }}
                  >
                    显示模式:
                  </span>
                  <div>
                    <Icon
                      type="credit-card"
                      style={mode === 'card' ? activeStyle : unactiveStyle}
                      key="card"
                      theme={mode === 'card' ? 'filled' : null}
                      title="卡片模式"
                      onClick={() => {
                        this.setState({ mode: 'card' });
                      }}
                    />
                    <Icon
                      type="table"
                      style={mode === 'table' ? activeStyle : unactiveStyle}
                      key="card"
                      // theme={mode === 'table' ? 'filled' : null}
                      title="表格模式"
                      onClick={() => {
                        this.setState({ mode: 'table' });
                      }}
                    />
                    <Icon
                      key="calendar"
                      type="calendar"
                      style={mode === 'calendar' ? activeStyle : unactiveStyle}
                      theme={mode === 'calendar' ? 'filled' : null}
                      title="日历模式"
                      onClick={() => {
                        this.setState({ mode: 'calendar' });
                      }}
                    />
                  </div>
                </div>
                <div className="notice_attend_class-header_search">
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['开始日期', '结束日期']}
                    onOk={this.onOk}
                    onChange={this.onRangeSearchChange}
                    value={this.state.rangePickerValue}
                  />
                  <Search
                    placeholder="输入课程关键字搜索"
                    onSearch={value => {
                      this.setState(
                        { searchKeyword: value },
                        this.searchCourseArrangment
                      );
                    }}
                    enterButton
                    style={{ width: 200, marginLeft: 5 }}
                  />
                </div>
              </header>
              {this.state.mode === 'card' && (
                <div className="notice_attend_class-course_list">
                  {courseArrangments.length ? (
                    courseArrangments.map(item => (
                      <Card
                        title={
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <span>{item.CourseName}</span>
                            <span
                              className="notice_attend_class-course_list-course_type"
                              style={
                                item.innerArrangeType === '1'
                                  ? { backgroundColor: '#1787fb' }
                                  : { backgroundColor: '#57c22d' }
                              }
                            >
                              {item.C3_616254048241}
                            </span>
                          </div>
                        }
                        className="notice_attend_class_item"
                        key={item.REC_ID}
                        hoverable
                        actions={[
                          <Popconfirm
                            title="确认通知？"
                            onConfirm={this.onMessage.bind(this, item)}
                            icon={
                              <Icon
                                type="question-circle-o"
                                style={{ color: 'red' }}
                              />
                            }
                          >
                            <span>
                              <Icon type="message" />
                              通知
                            </span>
                          </Popconfirm>,
                          <span
                            onClick={() => {
                              this.setState({
                                CourseArrangeID:item.CourseArrangeID
                                // isShowLearnerInfo: true,
                                // selectedCourseArrangment: item
                              });
                              this.setState({
                                isShowModal: true
                              });
                              // this.props.onCheckPeople();
                            }}
                          >
                            <Icon type="team" />
                            查看人员
                          </span>
                        ]}
                      >
                        <div className="notice_attend_class_item_content">
                          <div className="content_item">
                            主讲:{item.Teacher}
                          </div>
                          <div className="content_item">
                            人数:{item.Attendees}
                          </div>
                          <div className="content_item">
                            地点:{item.CourseLocation}
                          </div>
                          <div className="content_item">
                            预计时间：{item.CoursePlanDate}
                          </div>
                          <div className="content_item">
                            开课时间：{item.StartDatetime}
                          </div>
                          <div className="content_item">
                            结束时间：{item.EndDatetime}
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <List
                      dataSource={courseArrangments}
                      style={{ width: '100%' }}
                    ></List>
                  )}
                </div>
              )}
              {this.state.mode === 'calendar' && (
                <div style={{ height: '100%' }}>
                  <InternalCourseCalendar events={this.state.calendarEvents} />
                </div>
              )}
              {this.state.mode === 'table' && (
                <div style={{ height: 'calc(100vh - 170px)' }}>
                  <TableData
                    resid={616073391736}
                    hasModify={false}
                    hasDelete={false}
                    hasAdd={false}
                    hasRowDelete={false}
                    hasRowVModify={false}
                    hasRowView={false}
                    subtractH={240}
                    height="100%"
                  ></TableData>
                </div>
              )}
            </TabPane>
            <TabPane
              tab={'全部'}
              key="2"
              style={{ width: '100%', height: '100%' }}
            >
              {' '}
              <header className="notice_attend_class-header">
                <div className="notice_attend_class-header_Mode">
                  <span
                    style={{ fontSize: 22, fontWeight: 700, marginRight: 6 }}
                  >
                    显示模式:
                  </span>
                  <div>
                    <Icon
                      type="credit-card"
                      style={mode === 'card' ? activeStyle : unactiveStyle}
                      key="card"
                      theme={mode === 'card' ? 'filled' : null}
                      title="卡片模式"
                      onClick={() => {
                        this.setState({ mode: 'card' });
                      }}
                    />
                    <Icon
                      type="table"
                      style={mode === 'table' ? activeStyle : unactiveStyle}
                      key="card"
                      // theme={mode === 'table' ? 'filled' : null}
                      title="表格模式"
                      onClick={() => {
                        this.setState({ mode: 'table' });
                      }}
                    />
                    <Icon
                      key="calendar"
                      type="calendar"
                      style={mode === 'calendar' ? activeStyle : unactiveStyle}
                      theme={mode === 'calendar' ? 'filled' : null}
                      title="日历模式"
                      onClick={() => {
                        this.setState({ mode: 'calendar' });
                      }}
                    />
                  </div>
                </div>
                <div className="notice_attend_class-header_search">
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['开始日期', '结束日期']}
                    onOk={this.onOk}
                    onChange={this.onRangeSearchChange}
                    value={this.state.rangePickerValue}
                  />
                  <Search
                    placeholder="输入课程关键字搜索"
                    onSearch={value => {
                      this.setState(
                        { searchKeyword: value },
                        this.searchCourseArrangment
                      );
                    }}
                    enterButton
                    style={{ width: 200, marginLeft: 5 }}
                  />
                </div>
              </header>
              {this.state.mode === 'card' && (
                <div className="notice_attend_class-course_list">
                  {courseArrangments.length ? (
                    courseArrangments.map(item => (
                      <Card
                        title={
                          <div
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <span>{item.CourseName}</span>
                            <span
                              className="notice_attend_class-course_list-course_type"
                              style={
                                item.innerArrangeType === '1'
                                  ? { backgroundColor: '#1787fb' }
                                  : { backgroundColor: '#57c22d' }
                                //  item.innerArrangeType === '2'
                                // ? { backgroundColor: '#57c22d' }
                                // : {
                                //     backgroundColor: '#f1882b'
                                //   }
                              }
                            >
                              {item.C3_616254048241}
                            </span>
                          </div>
                        }
                        className="notice_attend_class_item"
                        key={item.REC_ID}
                        hoverable
                        actions={[
                          <Popconfirm
                            title="确认通知？"
                            onConfirm={this.onMessage.bind(this, item)}
                            icon={
                              <Icon
                                type="question-circle-o"
                                style={{ color: 'red' }}
                              />
                            }
                          >
                            <span>
                              <Icon type="message" />
                              通知
                            </span>
                          </Popconfirm>,
                          <span
                            onClick={() => {
                              this.setState({
                                CourseArrangeID:item.CourseArrangeID
                                // isShowLearnerInfo: true,
                                // selectedCourseArrangment: item
                              });
                              this.setState({
                                isShowModal: true
                              });
                              // this.props.onCheckPeople();
                            }}
                          >
                            <Icon type="team" />
                            查看人员
                          </span>
                        ]}
                      >
                        <div className="notice_attend_class_item_content">
                          <div className="content_item">
                            主讲:{item.Teacher}
                          </div>
                          <div className="content_item">
                            人数:{item.Attendees}
                          </div>
                          <div className="content_item">
                            地点:{item.CourseLocation}
                          </div>
                          <div className="content_item">
                            预计时间：{item.CoursePlanDate}
                          </div>
                          <div className="content_item">
                            开课时间：{item.StartDatetime}
                          </div>
                          <div className="content_item">
                            结束时间：{item.EndDatetime}
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <List
                      dataSource={courseArrangments}
                      style={{ width: '100%' }}
                    ></List>
                  )}
                </div>
              )}
              {this.state.mode === 'calendar' && (
                <div style={{ height: '100%' }}>
                  <InternalCourseCalendar events={this.state.calendarEvents} />
                </div>
              )}
              {this.state.mode === 'table' && (
                <div style={{ height: 'calc(100vh - 170px)' }}>
                  <TableData
                    resid={616073391736}
                    hasModify={false}
                    hasDelete={false}
                    hasAdd={false}
                    hasRowDelete={false}
                    hasRowVModify={false}
                    hasRowView={false}
                    subtractH={240}
                  ></TableData>
                </div>
              )}
            </TabPane>
          </Tabs>
        </div>
        {this.state.isShowModal ? (
          <Modal
            visible={this.state.isShowModal}
            width="80%"
            onCancel={() =>
              this.setState({
                isShowModal: false,
                selectedCourseArrangment: {},
                modifiedCourseArrangement: {}
              })
            }
            destroyOnClose
            onOk={() => {
              let { modifiedCourseArrangement } = this.state;
              this.modifyCourseArrangment(modifiedCourseArrangement);
              this.setState({
                isShowModal: false,
                selectedCourseArrangment: {},
                modifiedCourseArrangement: {}
              });
            }}
            title="查看人员"
          >
            <TableData
              resid={616073391736}
              hasModify={false}
              hasDelete={false}
              hasAdd={false}
              hasRowDelete={false}
              hasRowModify={false}
              hasRowView={true}
              subtractH={240}
              cmswhere={`CourseArrangeID=${this.state.CourseArrangeID}`}
            ></TableData>
          </Modal>
        ) : null}
      </div>
    );
  }
}

export default NoticeAttendClass;
