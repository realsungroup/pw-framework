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
  Tag
} from 'antd';
import moment from 'moment';
import './CourseArrangementInternal.less';
import http from 'Util20/api';
import InternalCourseCalendar from './InternalCourseCalendar';
import { TableData } from '../../../common/loadableCommon';

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
const courseArrangmentResid = '615549231946'; //课程安排表id
const courseDetailId = '615054661547';
const InternalCoursesResid = '616155060405';

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

class CourseArrangementInternal extends React.Component {
  state = {
    mode: 'card', // 显示模式，有卡片模式、日历模式、表格模式，默认卡片模式
    courseArrangements: [], //内训课程安排
    internalCourses: [], //内训课程
    searchKeyword: '', //搜索的关键词
    searchPeriod: ['', ''], //搜索时间段
    selectedCourseArrangement: {}, //选中的课程安排
    isShowModifyModal: false, //是否显示修改课程安排模态窗
    isShowAddCourseArrangment: false, //是否显示添加课程安排模态窗
    modifiedCourseArrangement: {}, //修改后的课程安排
    calendarEvents: [], //日历事件
    isSelectedCourse: false,
    selectedCourse: {},
    //添加时输入的课程安排数据
    inputCourseArrangement: {
      teacher: '',
      startDate: '',
      endDate: '',
      courseType: '必修课',
      places: undefined,
      location: ''
      // price: undefined,
      // classHour: undefined,
    }
  };

  async componentDidMount() {
    this.props.onHandleLoading(true);
    await this.getCourseArrangment();
    this.getInternalCourses();
    this.props.onHandleLoading(false);
  }

  //获取课程安排
  getCourseArrangment = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: courseArrangmentResid
      });
    } catch (error) {
      message.error(error.message);
      return console.log(error);
    }
    if (res.error === 0) {
      let courseArrangements = res.data;
      let courses = courseArrangements
        .map(item => ({
          CourseID: item.CourseID,
          CourseName: item.CourseName
        }))
        .filter((item, index, self) => {
          return self.findIndex(i => item.CourseID === i.CourseID) === index;
        });
      let importantIndex = 0;
      let calendarEvents = courseArrangements.map(item => {
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
      console.log(courseArrangements, calendarEvents);
      this.setState({ courseArrangements, courses, calendarEvents });
    } else {
      message.error(res.message);
    }
  };

  getInternalCourses = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: InternalCoursesResid
      });
      console.log(res.data);
      this.setState({ internalCourses: res.data });
    } catch (error) {
      message.error(error.message);
      return console.log(error);
    }
  };

  //添加课程安排
  saveCourseArrangement = async (courseArrangement, CourseID) => {
    try {
      let res = await http().addRecords({
        resid: courseArrangmentResid,
        data: [
          {
            CourseID,
            CourseLocation: courseArrangement.location,
            EndDatetime: courseArrangement.endDate,
            StartDatetime: courseArrangement.startDate,
            innerArrangeType: courseArrangement.courseType,
            classType: '内训',
            places: courseArrangement.places,
            Teacher: courseArrangement.teacher
          }
        ]
      });
      message.success('添加成功');
      let courseArrangements = [res.data[0], ...this.state.courseArrangements];
      this.setState({
        isShowAddCourseArrangment: false,
        isSelectedCourse: false,
        selectedCourse: {},
        inputCourseArrangement: {
          teacher: '',
          startDate: '',
          endDate: '',
          courseType: '必修课',
          places: undefined,
          location: ''
        },
        courseArrangements
      });
    } catch (error) {
      message.error(error.message);
      console.log(error.message);
    }
  };

  //删除课程安排
  deleteCourseArrangment = async arrangment => {
    let { courseArrangements } = this.state;
    let res;
    try {
      res = await http().removeRecords({
        resid: courseArrangmentResid,
        data: [arrangment]
      });
      message.success(res.message);
      courseArrangements.splice(
        courseArrangements.findIndex(item => {
          return item.REC_ID === arrangment.REC_ID;
        }),
        1
      );
      this.setState({ courseArrangements });
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
        resid: courseArrangmentResid,
        key: searchKeyword,
        cmswhere: isHasPeriod
          ? `StartDatetime > '${searchPeriod[0]}'  and StartDatetime < '${
              searchPeriod[1]
            }'`
          : ''
      });
      let courseArrangements = res.data;
      this.setState({ courseArrangements });
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
  render() {
    let { mode, courseArrangements, selectedCourseArrangement } = this.state;
    let modifiedCourseArrangement = { ...this.state.modifiedCourseArrangement };
    let internalCourses = [...this.state.internalCourses];
    let selectedCourse = { ...this.state.selectedCourse };
    let inputCourseArrangement = { ...this.state.inputCourseArrangement };
    return (
      <div className="internal_rrangement">
        <div className="arranging_courses">
          <header className="arranging_courses-header">
            <div className="arranging_courses-header_Mode">
              <Button
                onClick={() => {
                  this.setState({ isShowAddCourseArrangment: true });
                  return this.handleAddCourseArrangment;
                }}
                style={{ marginRight: 8 }}
              >
                添加课程安排
              </Button>
              <span style={{ fontSize: 22, fontWeight: 700, marginRight: 6 }}>
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
            <div className="arranging_courses-header_search">
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
            <div className="arranging_courses-course_list">
              {courseArrangements.length ? (
                courseArrangements.map(item => (
                  <Card
                    title={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>{item.CourseName}</span>
                        <span
                          className="arranging_courses-course_list-course_type"
                          style={
                            item.innerArrangeType === '必修课'
                              ? { backgroundColor: '#1787fb' }
                              : item.innerArrangeType === '公开课'
                              ? { backgroundColor: '#57c22d' }
                              : {
                                  backgroundColor: '#f1882b'
                                }
                          }
                        >
                          {item.innerArrangeType.substring(0, 1)}
                        </span>
                      </div>
                    }
                    className="arranging_courses_item"
                    key={item.REC_ID}
                    hoverable
                    extra={
                      <Icon
                        type="bell"
                        onClick={() => {
                          this.setState({
                            isShowBells: true,
                            selectedCourseArrangement: item
                          });
                        }}
                        theme={item.isNotice ? 'twoTone' : ''}
                        style={{ fontSize: 20 }}
                      ></Icon>
                    }
                    actions={[
                      <span
                        onClick={() =>
                          this.setState({
                            isShowModifyModal: true,
                            selectedCourseArrangement: item,
                            modifiedCourseArrangement: item
                          })
                        }
                      >
                        <Icon type="edit" />
                        修改
                      </span>,
                      <Popconfirm
                        title="确认删除？"
                        onConfirm={this.deleteCourseArrangment.bind(this, item)}
                        icon={
                          <Icon
                            type="question-circle-o"
                            style={{ color: 'red' }}
                          />
                        }
                      >
                        <span style={{ color: '#fc4f54' }} type="danger">
                          <Icon type="delete" />
                          删除
                        </span>
                      </Popconfirm>,
                      <span
                        onClick={() => {
                          // this.setState({
                          //   isShowLearnerInfo: true,
                          //   selectedCourseArrangement: item
                          // });
                          this.props.onHandleSelectCourseArrangement(item);
                          this.props.onHandleCurrent(1);
                        }}
                      >
                        <Icon type="team" />
                        学员审核
                      </span>
                    ]}
                  >
                    <div className="arranging_courses_item_content">
                      <div className="content_item">主讲:{item.Teacher}</div>
                      <div className="content_item">人数:{item.Attendees}</div>
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
                  dataSource={courseArrangements}
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
        </div>
        {this.state.isShowModifyModal ? (
          <Modal
            visible={this.state.isShowModifyModal}
            onCancel={() =>
              this.setState({
                isShowModifyModal: false,
                selectedCourseArrangement: {},
                modifiedCourseArrangement: {}
              })
            }
            destroyOnClose
            onOk={() => {
              let { modifiedCourseArrangement } = this.state;
              this.modifyCourseArrangment(modifiedCourseArrangement);
              this.setState({
                isShowModifyModal: false,
                selectedCourseArrangement: {},
                modifiedCourseArrangement: {}
              });
            }}
            title={`修改课程安排：${selectedCourseArrangement.CourseName}`}
          >
            <Form {...formItemLayout}>
              <Form.Item label="课程">
                <Select
                  placeholder="请选择一门课程"
                  showSearch={true}
                  optionFilterProp="children"
                  showArrow={true}
                  onChange={e => {
                    this.setState({
                      modifiedCourseArrangement: {
                        ...modifiedCourseArrangement,
                        CourseID: e
                      }
                    });
                  }}
                  filterOption={(input, option) => {
                    return (
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  value={modifiedCourseArrangement.CourseName}
                >
                  {this.state.courses.map(item => (
                    <Option key={item.CourseID} value={item.CourseID}>
                      {item.CourseName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="预计日期">
                <DatePicker
                  id="CoursePlanDate"
                  value={
                    modifiedCourseArrangement.CoursePlanDate &&
                    moment(modifiedCourseArrangement.CoursePlanDate)
                  }
                  format={dateFormatString}
                  onChange={e => {
                    this.setState({
                      modifiedCourseArrangement: {
                        ...modifiedCourseArrangement,
                        CoursePlanDate: e.format(dateFormatString)
                      }
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="开课时间">
                <DatePicker
                  id="StartDatetime"
                  showTime
                  value={moment(modifiedCourseArrangement.StartDatetime)}
                  format={datetimeFormatString}
                  onChange={e => {
                    this.setState({
                      modifiedCourseArrangement: {
                        ...modifiedCourseArrangement,
                        StartDatetime: e.format(datetimeFormatString)
                      }
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="结束时间">
                <DatePicker
                  id="EndDatetime"
                  showTime
                  value={moment(modifiedCourseArrangement.EndDatetime)}
                  format={datetimeFormatString}
                  onChange={e => {
                    this.setState({
                      modifiedCourseArrangement: {
                        ...modifiedCourseArrangement,
                        EndDatetime: e.format(datetimeFormatString)
                      }
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="地点">
                <Input
                  id="CourseLocation"
                  type="text"
                  value={modifiedCourseArrangement.CourseLocation}
                  onChange={e => {
                    this.setState({
                      modifiedCourseArrangement: {
                        ...modifiedCourseArrangement,
                        CourseLocation: e.target.value
                      }
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="课程类型">
                <Select
                  id="classType"
                  placeholder="请选择课程类型"
                  onChange={v => {
                    this.setState({
                      modifiedCourseArrangement: {
                        ...modifiedCourseArrangement,
                        classType: v
                      }
                    });
                  }}
                  value={modifiedCourseArrangement.classType}
                >
                  <Option value="外训">外训</Option>
                  <Option value="内训">内训</Option>
                  <Option value="外聘内训">外聘内训</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        ) : null}
        <Modal
          visible={this.state.isShowAddCourseArrangment}
          onCancel={() =>
            this.setState({
              isShowAddCourseArrangment: false,
              selectedCourseArrangement: {},
              isSelectedCourse: false
            })
          }
          onOk={() =>
            this.setState({
              isShowAddCourseArrangment: false,
              selectedCourseArrangement: {}
            })
          }
          width="80%"
          title="添加课程安排"
          // centered={true}
          destroyOnClose
          footer={null}
        >
          <div style={{ height: '80vh', overflow: 'auto' }}>
            {this.state.isSelectedCourse ? (
              <Card
                title={selectedCourse.C3_609845305680}
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                bodyStyle={{flex:1}}
                actions={[
                  <Button
                    onClick={() => {
                      this.setState({
                        isSelectedCourse: false,
                        selectedCourse: {},
                        inputCourseArrangement: {
                          teacher: '',
                          startDate: '',
                          endDate: '',
                          courseType: '必修课',
                          places: undefined,
                          location: ''
                        }
                      });
                    }}
                    icon="rollback"
                    type="link"
                  >
                    返回选择课程
                  </Button>,
                  <Button
                    // type="primary"
                    onClick={() => {
                      this.saveCourseArrangement(
                        this.state.inputCourseArrangement,
                        this.state.selectedCourse.C3_609845305868
                      );
                    }}
                    icon="save"
                    type="link"
                  >
                    保存
                  </Button>
                ]}
              >
                <div className="add_arrangement_input_row">
                  <div className="add_arrangement_input_item">
                    <label className="add_arrangement_input_item-label">
                      地点:
                    </label>
                    <Input
                      placeholder="请输入地点"
                      value={inputCourseArrangement.location}
                      onChange={e => {
                        this.setState({
                          inputCourseArrangement: {
                            ...inputCourseArrangement,
                            location: e.target.value
                          }
                        });
                      }}
                    />
                  </div>
                  <div className="add_arrangement_input_item">
                    <label className="add_arrangement_input_item-label">
                      讲师:
                    </label>
                    <Input
                      placeholder="请输入讲师"
                      value={inputCourseArrangement.teacher}
                      onChange={e => {
                        this.setState({
                          inputCourseArrangement: {
                            ...inputCourseArrangement,
                            teacher: e.target.value
                          }
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="add_arrangement_input_row">
                  <div className="add_arrangement_input_item">
                    <label className="add_arrangement_input_item-label">
                      课程类别:
                    </label>
                    <Select
                      value={inputCourseArrangement.courseType}
                      onChange={e => {
                        this.setState({
                          inputCourseArrangement: {
                            ...inputCourseArrangement,
                            courseType: e
                          }
                        });
                      }}
                    >
                      <Option key="必修" value="必修课">
                        必修课
                      </Option>
                      <Option key="计划" value="计划课">
                        计划课
                      </Option>
                      <Option key="公开" value="公开课">
                        公开课
                      </Option>
                    </Select>
                  </div>
                  <div className="add_arrangement_input_item">
                    <label className="add_arrangement_input_item-label">
                      名额:
                    </label>
                    <Input
                      placeholder="请输入名额"
                      value={inputCourseArrangement.places}
                      onChange={e => {
                        this.setState({
                          inputCourseArrangement: {
                            ...inputCourseArrangement,
                            places: parseFloat(e.target.value)
                          }
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="add_arrangement_input_row">
                  <div className="add_arrangement_input_item">
                    <label className="add_arrangement_input_item-label">
                      开始时间:
                    </label>
                    <DatePicker
                      showTime
                      id="startDate"
                      value={
                        inputCourseArrangement.startDate &&
                        moment(inputCourseArrangement.startDate)
                      }
                      format={datetimeFormatString}
                      onChange={e => {
                        this.setState({
                          inputCourseArrangement: {
                            ...inputCourseArrangement,
                            startDate: e.format(datetimeFormatString)
                          }
                        });
                      }}
                    />
                  </div>
                  <div className="add_arrangement_input_item">
                    <label className="add_arrangement_input_item-label">
                      结束时间:
                    </label>
                    <DatePicker
                      showTime
                      id="endDate"
                      value={
                        inputCourseArrangement.endDate &&
                        moment(inputCourseArrangement.endDate)
                      }
                      format={datetimeFormatString}
                      onChange={e => {
                        this.setState({
                          inputCourseArrangement: {
                            ...inputCourseArrangement,
                            endDate: e.format(datetimeFormatString)
                          }
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="add_arrangement_input_row">
                  {/* <div
                    style={{ flex: 1, display: 'flex', alignItems: 'center' }}
                  >
                    <label style={{ flexShrink: 0, width: 80 }}>课时:</label>
                    <Input
                      placeholder="请输入课时"
                      value={inputCourseArrangement.classHour}
                      onChange={e => {
                        this.setState({
                          inputCourseArrangement: {
                            ...inputCourseArrangement,
                            classHour: parseFloat(e.target.value)
                          }
                        });
                      }}
                    />
                  </div> */}
                  {/* <div
                    style={{ flex: 1, display: 'flex', alignItems: 'center' }}
                  >
                    <label style={{ flexShrink: 0, width: 80 }}>价格:</label>
                    <Input
                      placeholder="请输入价格"
                      value={inputCourseArrangement.price}
                      onChange={e => {
                        this.setState({
                          inputCourseArrangement: {
                            ...inputCourseArrangement,
                            price: parseFloat(e.target.value)
                          }
                        });
                      }}
                    />
                  </div> */}
                </div>
                <div>
                  <p>
                    课程大纲:
                    {selectedCourse.C3_609845305618}
                  </p>
                </div>
                {/* <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 12
                  }}
                >
                  <Button
                    onClick={() => {
                      this.setState({
                        isSelectedCourse: false,
                        selectedCourse: {},
                        inputCourseArrangement: {
                          teacher: '',
                          startDate: '',
                          endDate: '',
                          courseType: '必修课',
                          places: undefined,
                          location: ''
                        }
                      });
                    }}
                  >
                    返回选择课程
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      this.saveCourseArrangement(
                        this.state.inputCourseArrangement,
                        this.state.selectedCourse.C3_609845305868
                      );
                    }}
                  >
                    保存
                  </Button>
                </div> */}
              </Card>
            ) : (
              <List
                bordered
                dataSource={internalCourses}
                renderItem={item => {
                  return (
                    <List.Item
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        this.setState({
                          isSelectedCourse: true,
                          selectedCourse: item
                        });
                      }}
                    >
                      <Radio>
                        <span style={{ marginRight: 12 }}>
                          {item.C3_609845305680}
                        </span>
                      </Radio>
                    </List.Item>
                  );
                }}
              />
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

export default CourseArrangementInternal;
