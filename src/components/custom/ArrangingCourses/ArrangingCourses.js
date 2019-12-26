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
  Upload,
  Pagination
} from 'antd';
import debounce from 'lodash/debounce';
import { uploadFile } from '../../../util/api';
import SelectEmployeeToAdd from './SelectEmployeeToAdd';
import { TableData } from '../../common/loadableCommon';
import './ArrangingCourses.less';
import http from 'Util20/api';
import moment from 'moment';
import CalendarMode from './CalendarMode';
import PlanProgress from '../CreatePlan/PlanProgress';

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
const courseArrangmentResid = '613959525708'; //课程安排表id
const courseDetailId = '615054661547';
const OutCourseId = '624970414826'; //外训课程表ID
const YEAR_RESID = '420161931474'; //财年表id

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

const selectStyle = { width: 100, marginRight: 5 };

class ArrangingCourses extends React.Component {
  state = {
    loading: false,
    courseArrangment: [], //课程安排
    isShowModifyModal: false, //是否显示修改课程安排模态窗
    isShowLearnerInfo: false, //是否显示学员信息模态窗
    isShowBells: false, //是否显示课程安排模态窗
    isShowMoveLearner: false, //是否显示移动人员模态窗
    isShowAddCourseArrangment: false, //是否显示添加课程安排模态窗
    selectedCourseArrangment: {}, //选中的课程安排
    targetCourseArrangment: [], //移动人员时可选择的课程安排
    selectedTargetCourseArrangment: '', //移动人员时选中的目标课程安排id
    selectedMoveLearners: [], //移动人员时选中的人员
    courses: [], //课程
    searchKeyword: '', //搜索的关键词
    searchPeriod: ['', ''], //搜索时间段
    selectedRecentPeriod: 'all', //下拉选项的值
    rangePickerValue: [null, null], // 日期选择器的值
    mode: 'table', // 显示模式，有卡片模式、日历模式、表格模式，默认卡片模式
    courseList: [],
    dataSearch: [],
    fileList: [],
    isShowProgress: false, // 是否显示进度模态窗
    isShowMoveProgress: false,
    classTime: '',
    pagination: { total: 0, current: 1 },
    years: [], //所有财年
    currentYear: {}, //当前财年
    selectedYear: '' //选中的财年
  };
  constructor() {
    super();
    this.handleSearch = debounce(this.handleSearch, 800);
  }

  componentDidMount = async () => {
    this.props.onHandleLoading(true);
    await this.getYears();
    await this.getCourseArrangment();
    // await this.getCourses();
    this.props.onHandleLoading(false);
    this.getOutCourse(OutCourseId);
  };

  //获取财年
  getYears = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: YEAR_RESID
      });
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

  // 添加人员
  addEmployees = async employees => {
    let index_id = 0;
    let taskList = employees.map(item => {
      return {
        CourseArrangeID: this.state.courseAddId,
        C3_613941384832: item.C3_305737857578,
        _id: ++index_id,
        _state: 'editoradd'
      };
    });
    this.setState({ taskList, isShowProgress: true });
  };

  // 上传文件
  handleFileChange = info => {
    console.log(info);
    let { file, fileList } = info;
    // if (file.status === 'removed') {
    //   this.setState({
    //     fileList: fileList.filter(item => item.uid !== file.uid)
    //   });
    // } else {
    this.setState({ fileList });
    // }
  };
  //获取课程安排
  getCourseArrangment = async (pageIndex = 1, isSearch = false) => {
    let res;
    const {
      pagination,
      searchKeyword,
      searchPeriod,
      selectedYear
    } = this.state;
    const isHasPeriod = searchPeriod[0] && searchPeriod[1];
    this.props.onHandleLoading(true);
    let cmswhere = "organization != '内训'";
    if (isHasPeriod) {
      cmswhere += ` and StartDatetime > '${
        searchPeriod[0]
      }'  and StartDatetime < '${searchPeriod[1]}'`;
    }
    if (selectedYear !== 'all') {
      cmswhere += `and FisYear = '${selectedYear}'`;
    }
    try {
      res = await http().getTable({
        resid: courseArrangmentResid,
        pageSize: 50,
        pageIndex: pageIndex - 1,
        key: searchKeyword,
        cmswhere
      });
    } catch (error) {
      message.error(error.message);
      return console.log(error);
    }
    if (res.error === 0) {
      let courseArrangment = res.data;
      //去重方法1 ： 使用 Set + Array.from + JSON.stringify + JSON.parse
      // let courses = courseArrangment.map(item => {
      //   return JSON.stringify({
      //     CourseID: item.CourseID,
      //     CourseName: item.CourseName
      //   });
      // });
      // courses = Array.from(new Set(courses));
      // courses = courses.map(item => {
      //   return JSON.parse(item);
      // });
      let importantIndex = 0;
      let calendarEvents = courseArrangment.map(item => {
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
      //去重方法2 ：使用 Array的 filter + findIndex 实现
      let courses = courseArrangment
        .map(item => ({
          CourseID: item.CourseID,
          CourseName: item.CourseName
        }))
        .filter((item, index, self) => {
          return self.findIndex(i => item.CourseID === i.CourseID) === index;
        });
      console.log(res.data);
      this.setState({
        courseArrangment,
        courses,
        calendarEvents,
        pagination: { ...pagination, total: res.total }
      });
      if (isSearch) {
        this.setState({
          pagination: { ...this.state.pagination, current: 1 }
        });
      }
      this.props.onHandleLoading(false);
    } else {
      message.error(res.message);
    }
  };
  //获取外训课程清单
  getOutCourse = async OutCourseId => {
    let res;
    try {
      res = await http().getTable({
        resid: OutCourseId
      });
    } catch (error) {
      message.error(error.message);
      return console.log(error);
    }
    console.log(res);
    this.setState({
      courseList: res.data
    });
  };
  //搜索课程安排
  searchCourseArrangment = () => {
    this.getCourseArrangment(1, true);
  };
  //添加课程安排
  addCourseArrangment = async data => {
    let res;
    try {
      res = await http().addRecords({
        resid: courseArrangmentResid,
        data: [data]
      });
      message.success(res.message);
      this.getCourseArrangment();
    } catch (error) {
      message.error(error.message);
    }
  };
  modifyCourseArrangment = async data => {
    let res;
    try {
      res = await http().modifyRecords({
        resid: courseArrangmentResid,
        data: [data]
      });
      message.success(res.message);
      this.getCourseArrangment();
    } catch (error) {
      message.error(error.message);
    }
  };
  // 添加记录
  addMem = async () => {
    if (this.state.toAddID) {
      this.setState({ fetching: true });
      var courseID = this.state.courseAddId;
      var memberID = this.state.toAddID;
      let res;
      try {
        res = await http().addRecords({
          resid: courseDetailId,
          data: [
            {
              CourseArrangeID: courseID,
              C3_613941384832: memberID
            }
          ]
        });
        this.setState({ toAddID: null, showAddMem: false, fetching: false });
        this.tableDataRef.handleRefresh();
        message.success('人员添加成功！');
      } catch (err) {
        Modal.error({
          title: 'Alert!',
          content: err.message,
          okText: 'OK'
        });
        this.setState({ fetching: false });
      }
    } else {
      message.error('请搜索并选择人员！');
    }
  };
  // 搜索员工
  handleSearch = async value => {
    if (value) {
      this.setState({ fetching: true });

      let res;
      try {
        res = await http().getTable({
          resid: 610307713776,
          key: value
        });
        console.log(res);
        const dataSearch = res.data.map(data => ({
          text: `${data.C3_609622263470}`,
          value: data.C3_609622254861
        }));

        this.setState({ dataSearch: dataSearch, fetching: false });
      } catch (err) {
        Modal.error({
          title: 'Alert!',
          content: err.message,
          okText: 'OK'
        });
        this.setState({ fetching: false });
      }

      // fetch(value, data => this.setState({ data }));
    } else {
      this.setState({ dataSearch: [] });
    }
  };
  // 搜索后选择
  handleChangeS = (value, obj) => {
    this.setState({
      value,
      postName: obj.props.children,
      dataSearch: [],
      toAddID: value,
      fetching: false
    });
  };

  //删除课程安排
  deleteCourseArrangment = async arrangment => {
    let { courseArrangment } = this.state;
    let res;
    try {
      res = await http().removeRecords({
        resid: courseArrangmentResid,
        data: [arrangment]
      });
      message.success(res.message);
      courseArrangment.splice(
        courseArrangment.findIndex(item => {
          return item.REC_ID === arrangment.REC_ID;
        }),
        1
      );
      this.setState({ courseArrangment });
      // this.getCourseArrangment();
    } catch (error) {
      message.error(error.message);
    }
  };
  //移动人员
  moveLearner = async () => {
    let { selectedTargetCourseArrangment, selectedMoveLearners } = this.state;
    selectedMoveLearners.forEach((item, index) => {
      item.CourseArrangeID = selectedTargetCourseArrangment;
      item._id = index;
      item._state = 'editoradd';
    });
    this.setState({
      taskList: selectedMoveLearners,
      isShowMoveProgress: true
    });
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
  // 发邮件通知培训机构
  onHandleMessage = async (dataSource, selectedRowKeys) => {
    this.setState({ loading: true });
    if (selectedRowKeys.length) {
      const data = dataSource;
      const Reldata = [];
      data.map(item => {
        selectedRowKeys.map(items => {
          if (item.REC_ID === items) {
            item.isNoticeTrainingOrgan = 'Y';
            Reldata.push(item);
          }
        });
      });
      let res;
      try {
        res = await http().modifyRecords({
          resid: courseArrangmentResid,
          data: Reldata,
          isEditoRAdd: false
        });

        if (res.Error === 0) {
          this.tableDataRef.handleRefresh();
          message.success('操作成功！');
          this.setState({ loading: false });
        } else {
          this.setState({ loading: false });
          message.error(res.message);
        }
      } catch (error) {
        this.setState({ loading: false });
        message.error(error.message);
      }
    } else {
      this.setState({ loading: false });
      message.error('请勾选记录！');
    }
  };
  // 初始化fileList
  resetFileList = v => {
    console.log('v', v);
    if (v.CourseOutline) {
      var arr = [
        {
          url: v.CourseOutline,
          status: 'done',
          name: '附件',
          uid: 1
        }
      ];

      this.setState({ fileList: arr });
    } else {
      this.setState({ fileList: [] });
    }
  };

  giveUp = async (resid, recordId) => {
    try {
      const res = await http().modifyRecords({
        resid: resid,
        data: [{ REC_ID: recordId, isGiveUp: 'Y' }]
      });
      message.success('已放弃');
      this.tableDataRef.handleRefresh();
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  //结束时调用的回调函数
  onFinishedPlanProgress = async () => {
    await http().modifyRecords({
      resid: courseArrangmentResid,
      data: [{ REC_ID: this.state.courseAddId }]
    });
    this.setState({
      isShowProgress: false,
      showAddMem: false
    });
    this.tableDataRef.handleRefresh();
  };
  alertHRM = async (resid, recordId, r) => {
    console.log(r);
    try {
      const res = await http().modifyRecords({
        resid: resid,
        data: [{ REC_ID: recordId, againNoticeHrmanage: 'Y' }]
      });
      message.success('已发送邮件');
      this.tableDataRef.handleRefresh();
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };
  onMoveFinished = async () => {
    try {
      await http().modifyRecords({
        resid: courseArrangmentResid,
        data: [
          { REC_ID: this.state.courseAddId },
          { REC_ID: this.state.selectedTargetCourseArrangment }
        ]
      });
      this.tableDataRef.handleRefresh();
    } catch (error) {
      message.error(error.message);
    }
    this.setState(
      {
        isShowMoveLearner: false,
        selectedMoveLearners: [],
        selectedTargetCourseArrangment: '',
        isShowMoveProgress: false
      },
      this.tableDataRef.handleRefresh
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
  //设置搜索的最近时间段
  setPeriodBySelect = e => {
    let searchPeriod = [],
      formatString = 'YYYY-MM-DD HH:mm:ss';
    switch (e) {
      case 'all':
        searchPeriod = ['', ''];
        break;
      case 'week':
        searchPeriod = [
          moment().format(formatString),
          moment()
            .add(1, 'w')
            .format(formatString)
        ];
        break;
      case 'weeks':
        searchPeriod = [
          moment().format(formatString),
          moment()
            .add(2, 'w')
            .format(formatString)
        ];
        break;
      case 'month':
        searchPeriod = [
          moment().format(formatString),
          moment()
            .add(1, 'M')
            .format(formatString)
        ];
        break;
      case 'months':
        searchPeriod = [
          moment().format(formatString),
          moment()
            .add(2, 'M')
            .format(formatString)
        ];
        break;
      default:
        break;
    }
    this.setState({ searchPeriod }, this.searchCourseArrangment);
  };
  render() {
    let {
      courseArrangment,
      selectedCourseArrangment,
      mode,
      isShowProgress,
      isShowMoveProgress,
      taskList,
      pagination,
      years,
      selectedYear
    } = this.state;
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    return (
      <div className="external-training">
        <div className="external-training_arranging_courses">
          <header className="external-training_arranging_courses-header">
            <div className="external-training_arranging_courses-header_Mode">
              <Button
                onClick={() => {
                  this.setState({ isShowAddCourseArrangment: true });
                  return this.handleAddCourseArrangment;
                }}
                style={{ marginRight: 8 }}
              >
                添加课程安排
              </Button>
              <Button
                style={{ marginRight: 8 }}
                onClick={() => {
                  this.setState({ isShowSendMail: true });
                }}
              >
                邀请培训机构开课
              </Button>
              <span style={{ fontSize: 22, fontWeight: 700, marginRight: 6 }}>
                显示模式:
              </span>
              <span>
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
                {
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
                }
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
              </span>
            </div>
            <div className="external-training_arranging_courses-header_search">
              <Select
                className="emploee-courses_courses-manage-header-selector"
                value={selectedYear}
                style={selectStyle}
                onChange={e => {
                  this.setState(
                    {
                      selectedYear: e
                    },
                    this.searchCourseArrangment
                  );
                }}
              >
                <Option key="all" value="all">
                  全部财年
                </Option>
                {years.map(item => (
                  <Option key={item.REC_ID} value={item.C3_420161949106}>
                    {item.C3_420161949106}
                  </Option>
                ))}
              </Select>
              <Select
                defaultValue="all"
                value={this.state.selectedRecentPeriod}
                style={selectStyle}
                onChange={e => {
                  this.setState({
                    selectedRecentPeriod: e,
                    rangePickerValue: [null, null]
                  });
                  this.setPeriodBySelect(e);
                }}
              >
                <Option value="all">全部</Option>
                <Option value="week">一周内</Option>
                <Option value="weeks">两周内</Option>
                <Option value="month">一个月内</Option>
                <Option value="months">两个月内</Option>
              </Select>
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
                style={{ width: 200, marginLeft: 5 }}
              />
            </div>
          </header>
          {this.state.mode === 'card' && (
            <div className="external-training_arranging_courses-course_list">
              <div className="external-training_arranging_courses-course_list-wrapper">
                {courseArrangment.length ? (
                  courseArrangment.map(item => (
                    <Card
                      title={item.CourseName}
                      className="arranging_courses_item"
                      key={item.REC_ID}
                      extra={
                        <div>
                          <Icon
                            style={{ color: '#faad14' }}
                            type="like"
                            theme="filled"
                          />
                          点赞数：{item.countLike}
                        </div>
                      }
                      actions={[
                        <span
                          onClick={() =>
                            this.setState(
                              {
                                isShowModifyModal: true,
                                selectedCourseArrangment: item
                                // fileList:{url:item.CourseOutline,status:'done',name:'附件',uid:1}
                              },
                              () => {
                                this.resetFileList(item);
                              }
                            )
                          }
                        >
                          <Icon type="edit" />
                          修改
                        </span>,
                        <Popconfirm
                          title="确认删除？"
                          onConfirm={this.deleteCourseArrangment.bind(
                            this,
                            item
                          )}
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
                          onClick={a => {
                            this.setState({
                              isShowLearnerInfo: true,
                              selectedCourseArrangment: item,
                              courseAddId: item.REC_ID
                            });
                          }}
                        >
                          <Icon type="team" />
                          学员信息
                        </span>
                      ]}
                    >
                      <div className="arranging_courses_item_content">
                        <div className="content_item">主讲:{item.Teacher}</div>
                        <div className="content_item">
                          人数:{item.Attendees}
                        </div>
                        <div className="content_item">
                          开始时间：{item.StartDatetime}
                        </div>
                        <div className="content_item">
                          结束时间：{item.EndDatetime}
                        </div>
                        <div className="content_item">
                          地点:{item.CourseLocation}
                        </div>
                        <div className="content_item">
                          实际费用:{`${item.actualCost}元`}
                        </div>
                        <div className="content_item">季度:{item.quarter}</div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <List
                    dataSource={courseArrangment}
                    style={{ width: '100%' }}
                  ></List>
                )}
              </div>
              <Pagination
                className="external-training__arranging-courses__pagination"
                total={pagination.total}
                showTotal={(total, range) =>
                  `${range[0]}~${range[1]}，共${total}条数据`
                }
                onChange={(page, pageSize) => {
                  this.getCourseArrangment(page);
                }}
                pageSize={50}
              />
            </div>
          )}
          {this.state.mode === 'calendar' && (
            <div style={{ height: '100%' }}>
              <CalendarMode events={this.state.calendarEvents} />
            </div>
          )}
          {this.state.mode === 'table' && (
            <div
              style={{ width: '100%', flex: 1, height: '100%' }}
              className="arc_ag"
            >
              <TableData
                resid="613959487818"
                subtractH={220}
                hasRowView={false}
                hasModify={false}
                hasDelete={false}
                hasAdd={false}
                tableComponent="ag-grid"
                sideBarAg={true}
                hasRowSelection={true}
              />
            </div>
          )}
        </div>
        {this.state.isShowModifyModal ? (
          <Modal
            visible={this.state.isShowModifyModal}
            onCancel={() =>
              this.setState({
                isShowModifyModal: false,
                selectedCourseArrangment: {},
                fileList: []
              })
            }
            destroyOnClose
            onOk={() => {
              this.props.form.validateFieldsAndScroll((err, values) => {
                let startDate = Date.parse(values.modifyStartDatetime);
                let endDate = Date.parse(values.modifyEndDatetime);
                let timer = (endDate - startDate) / 86400000;
                let classTime = Math.floor(timer) * 8 + 8;
                console.log('课时', classTime);
                if (!err) {
                  console.log('values', values);
                  let { selectedCourseArrangment } = this.state;
                  var fileUrl = null;
                  if (this.state.fileList[0]) {
                    fileUrl = this.state.fileList[0].url;
                  }
                  let courseArrangment = {
                    ...selectedCourseArrangment,
                    StartDatetime: values.modifyStartDatetime.format(
                      'YYYY-MM-DD HH:mm:ss'
                    ),
                    EndDatetime: values.modifyEndDatetime.format(
                      'YYYY-MM-DD HH:mm:ss'
                    ),
                    CourseLocation: values.modifyCourseLocation,
                    classType: values.classType,
                    actualCost: parseFloat(values.actualCost),
                    quarter: values.quarter,
                    Teacher: values.modifyTeacher,
                    isArrangeSelf: values.isArrangeSelf,
                    CourseOutline: fileUrl
                    // classTime:classTime
                  };
                  this.modifyCourseArrangment(courseArrangment);
                  this.setState({
                    isShowModifyModal: false,
                    selectedCourseArrangment: {},
                    fileList: []
                  });
                } else {
                  console.log(err);
                }
              });
            }}
            title={`修改课程安排：${selectedCourseArrangment.CourseName}`}
          >
            <Form {...formItemLayout}>
              <Form.Item label="课程">
                {getFieldDecorator('modifyCourseID', {
                  rules: [
                    {
                      required: true,
                      message: '请选择一门课程!'
                    }
                  ],
                  initialValue: selectedCourseArrangment.CourseName
                })(
                  <Select
                    placeholder="请选择一门课程"
                    showSearch={true}
                    optionFilterProp="children"
                    showArrow={true}
                    onChange={e => {
                      this.setState({
                        selectedCourseArrangment: {
                          ...this.state.selectedCourseArrangment,
                          CourseID: e
                        }
                      });
                      setFieldsValue({ modifyCourseID: e });
                    }}
                    filterOption={(input, option) => {
                      return (
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {this.state.courses.map(item => (
                      <Option key={item.CourseID} value={item.CourseID}>
                        {item.CourseName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="开始时间">
                {getFieldDecorator('modifyStartDatetime', {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: '请选择课程开始时间!'
                    }
                  ],
                  initialValue: this.state.selectedCourseArrangment
                    .StartDatetime
                    ? moment(this.state.selectedCourseArrangment.StartDatetime)
                    : null
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
              </Form.Item>
              <Form.Item label="结束时间">
                {getFieldDecorator('modifyEndDatetime', {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: '请选择课程结束时间!'
                    }
                  ],
                  initialValue: this.state.selectedCourseArrangment.EndDatetime
                    ? moment(this.state.selectedCourseArrangment.EndDatetime)
                    : null
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
              </Form.Item>

              <Form.Item label="讲师">
                {getFieldDecorator('modifyTeacher', {
                  rules: [
                    {
                      required: true,
                      message: '请输入讲师姓名!'
                    }
                  ],
                  initialValue: this.state.selectedCourseArrangment.Teacher
                })(<Input />)}
              </Form.Item>

              <Form.Item label="地点">
                {getFieldDecorator('modifyCourseLocation', {
                  rules: [
                    {
                      required: true,
                      message: '请输入上课地点!'
                    }
                  ],
                  initialValue: this.state.selectedCourseArrangment
                    .CourseLocation
                })(<Input />)}
              </Form.Item>

              <Form.Item label="实际费用">
                {getFieldDecorator('actualCost', {
                  initialValue: this.state.selectedCourseArrangment.actualCost
                })(<Input type="number" />)}
              </Form.Item>

              <Form.Item label="季度">
                {getFieldDecorator('quarter', {
                  initialValue: this.state.selectedCourseArrangment.quarter
                })(<Input />)}
              </Form.Item>
              <Form.Item label="课程类型">
                {getFieldDecorator('classType', {
                  initialValue: this.state.selectedCourseArrangment.classType
                })(
                  <Select placeholder="请选择课程类型">
                    <Option value="外训" key="外训">
                      外训
                    </Option>
                    <Option value="外聘内训" key="外聘内训">
                      外聘内训
                    </Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="是否为另添加课程">
                {getFieldDecorator('isArrangeSelf', {
                  initialValue: this.state.selectedCourseArrangment
                    .isArrangeSelf
                })(
                  <Select>
                    <Option value="Y" key="Y">
                      Y
                    </Option>
                    <Option value="N" key="N">
                      N
                    </Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="课程大纲">
                <Upload
                  onChange={this.handleFileChange}
                  fileList={this.state.fileList}
                  customRequest={async file => {
                    const res = await uploadFile(file.file);
                    let { fileList } = this.state;
                    fileList[fileList.length - 1] = {
                      name: file.file.name,
                      url: res,
                      status: 'done',
                      uid: -fileList.length
                    };
                    this.setState({
                      fileList
                    });
                  }}
                >
                  <Button>
                    <Icon type="upload" /> 上传课程大纲
                  </Button>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        ) : null}
        <Modal
          visible={this.state.isShowLearnerInfo}
          onCancel={() =>
            this.setState({
              isShowLearnerInfo: false,
              selectedCourseArrangment: {}
            })
          }
          onOk={() =>
            this.setState({
              isShowLearnerInfo: false,
              selectedCourseArrangment: {}
            })
          }
          width="99%"
          title="学员信息"
          centered={true}
          destroyOnClose
        >
          <TableData
            resid={courseDetailId}
            key={selectedCourseArrangment.REC_ID}
            wrappedComponentRef={element => (this.tableDataRef = element)}
            refTargetComponentName="TableData"
            height={440}
            subtractH={240}
            hasRowView={false}
            hasModify={false}
            hasDelete={false}
            hasAdd={false}
            hasRowDelete={false}
            hasRowSelection={true}
            customRowBtns={[
              (record, btnSize) => {
                return (
                  <>
                    <Popconfirm
                      title="确认放弃吗？"
                      onConfirm={() => {
                        this.giveUp(courseDetailId, record.REC_ID);
                      }}
                    >
                      <Button type="danger">放弃</Button>
                    </Popconfirm>
                    {record.againNoticeHrmanage != 'Y' ? (
                      <Popconfirm
                        title="确认提醒HR经理人审批申请单？"
                        onConfirm={() => {
                          this.alertHRM(courseDetailId, record.REC_ID, record);
                        }}
                      >
                        <Button style={{ marginLeft: '4px' }}>
                          提醒HR经理人审批申请单
                        </Button>
                      </Popconfirm>
                    ) : (
                      <span style={{ marginLeft: '4px', color: 'red' }}>
                        已提醒HR经理人审批申请单
                      </span>
                    )}
                  </>
                );
              }
            ]}
            cmswhere={`CourseArrangeID = '${selectedCourseArrangment.CourseArrangeID}'`}
            actionBarExtra={records => (
              <div>
                <Button
                  onClick={
                    this.state.showAddMem
                      ? () => {
                          this.setState({ showAddMem: false });
                        }
                      : () => {
                          this.setState({ showAddMem: true });
                        }
                  }
                >
                  添加人员
                </Button>

                <Modal
                  visible={this.state.showAddMem ? true : false}
                  width="80%"
                  title="添加人员"
                  centered={true}
                  destroyOnClose
                  confirmLoading={this.state.fetching}
                  onCancel={() =>
                    this.setState({
                      showAddMem: false
                    })
                  }
                  footer={null}
                >
                  <SelectEmployeeToAdd onAdd={this.addEmployees} />
                  {isShowProgress ? (
                    <PlanProgress
                      onFinished={this.onFinishedPlanProgress}
                      struct="100"
                      options={{
                        resid: courseDetailId,
                        data: JSON.stringify(taskList)
                      }}
                      title="添加人员列表"
                      // showFields={['C3_609622263470', 'C3_609845305680']}
                      // width='50%'
                    />
                  ) : null}
                </Modal>
                <Button
                  onClick={() => {
                    if (!records.selectedRowKeys.length) {
                      return message.error('请选择一条记录');
                    }
                    let {
                      courseArrangment,
                      selectedCourseArrangment
                    } = this.state;
                    let targetCourseArrangment = courseArrangment.filter(
                      item => {
                        return (
                          item.CourseID === selectedCourseArrangment.CourseID &&
                          item.REC_ID !== selectedCourseArrangment.REC_ID
                        );
                      }
                    );
                    let keys = records.selectedRowKeys;
                    let selectedMoveLearners = [];
                    keys.forEach(item => {
                      let learner = records.dataSource.find(i => {
                        return i.REC_ID === item;
                      });
                      if (learner) {
                        selectedMoveLearners.push(learner);
                      }
                    });
                    this.setState({
                      isShowMoveLearner: true,
                      targetCourseArrangment,
                      selectedMoveLearners
                    });
                  }}
                >
                  移动人员至
                </Button>
              </div>
            )}
          ></TableData>
        </Modal>
        <Modal
          visible={this.state.isShowBells}
          onCancel={() =>
            this.setState({
              isShowBells: false,
              selectedCourseArrangment: {}
            })
          }
          onOk={() =>
            this.setState({
              isShowBells: false,
              selectedCourseArrangment: {}
            })
          }
          width="99%"
          title="课程提醒"
          centered
          destroyOnClose
        >
          <TableData
            resid="614184482830"
            key={selectedCourseArrangment.CourseArrangeID}
            height={450}
            subtractH={200}
            hasRowView={false}
            hasModify={false}
            hasDelete={false}
            hasRowSelection={true}
            cmswhere={`C3_614184177086 = '${selectedCourseArrangment.CourseArrangeID}'`}
          />
        </Modal>
        <Modal
          title="移动人员"
          visible={this.state.isShowMoveLearner}
          mask={false}
          onCancel={() =>
            this.setState({
              isShowMoveLearner: false,
              selectedMoveLearners: [],
              selectedTargetCourseArrangment: ''
            })
          }
          destroyOnClose
          width="80%"
          onOk={this.moveLearner}
        >
          <Radio.Group style={{ width: '100%' }}>
            <List
              dataSource={this.state.targetCourseArrangment}
              onChange={e => {
                let selectedTargetCourseArrangment = e.target.value;
                this.setState({ selectedTargetCourseArrangment });
              }}
              renderItem={item => (
                <div
                  style={{ display: 'flex', width: '100%', marginBottom: 8 }}
                  key={item.CourseArrangeID}
                >
                  <Radio checked={item.checked} value={item.CourseArrangeID} />
                  <div style={{ flex: 1 }}>{item.CourseName}</div>
                  <div style={{ flex: 1 }}>{item.StartDatetime}</div>
                  <div style={{ flex: 1 }}>{item.CourseLocation}</div>
                </div>
              )}
            ></List>
          </Radio.Group>
          {isShowMoveProgress ? (
            <PlanProgress
              onFinished={this.onMoveFinished}
              struct="100"
              options={{
                resid: courseDetailId,
                data: JSON.stringify(taskList)
              }}
              title="移动人员"
            />
          ) : null}
        </Modal>
        {this.state.isShowAddCourseArrangment ? (
          <Modal
            title="添加课程安排"
            onCancel={() =>
              this.setState({
                isShowAddCourseArrangment: false,
                selectedCourseArrangment: {},
                fileList: []
              })
            }
            destroyOnClose={true}
            onOk={() => {
              this.props.form.validateFieldsAndScroll((err, values) => {
                let startDate = Date.parse(values.modifyStartDatetime);
                let endDate = Date.parse(values.modifyEndDatetime);
                let timer = (endDate - startDate) / 86400000;
                let classTime = Math.floor(timer) * 8 + 8;
                console.log(values);
                console.log(parseFloat(values.actualCost));
                if (!err) {
                  let courseArrangment = { ...values };
                  courseArrangment.actualCost = parseFloat(
                    courseArrangment.actualCost
                  );
                  // courseArrangment.classTime = classTime;
                  if (this.state.fileList[0]) {
                    courseArrangment.CourseOutline = this.state.fileList[0].url;
                  }

                  this.addCourseArrangment(courseArrangment);
                  this.setState({
                    isShowAddCourseArrangment: false,
                    selectedCourseArrangment: {},
                    fileList: []
                  });
                } else {
                  console.log(err);
                }
              });
            }}
            visible={this.state.isShowAddCourseArrangment}
          >
            <Form {...formItemLayout}>
              <Form.Item label="课程">
                {getFieldDecorator('CourseID', {
                  rules: [
                    {
                      required: true,
                      message: '请选择门课程!'
                    }
                  ]
                })(
                  <Select
                    placeholder="请选择一门课程"
                    showSearch={true}
                    optionFilterProp="children"
                    showArrow={true}
                    filterOption={(input, option) => {
                      return (
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {this.state.courseList.map(item => (
                      <Option
                        key={item.C3_609845305868}
                        value={item.C3_609845305868}
                      >
                        {item.C3_609845305680}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="开始时间">
                {getFieldDecorator('StartDatetime', {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: '请选择课程开始时间!'
                    }
                  ]
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
              </Form.Item>

              <Form.Item label="结束时间">
                {getFieldDecorator('EndDatetime', {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: '请选择课程结束时间!'
                    }
                  ]
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
              </Form.Item>

              <Form.Item label="讲师">
                {getFieldDecorator('Teacher', {})(<Input />)}
              </Form.Item>

              <Form.Item label="地点">
                {getFieldDecorator('CourseLocation', {
                  rules: [
                    {
                      required: true,
                      message: '请输入上课地点!'
                    }
                  ]
                })(<Input />)}
              </Form.Item>

              <Form.Item label="实际费用">
                {getFieldDecorator('actualCost', {})(<Input type="number" />)}
              </Form.Item>
              <Form.Item label="季度">
                {getFieldDecorator('quarter', {})(<Input />)}
              </Form.Item>
              <Form.Item label="课程类型">
                {getFieldDecorator('classType', {})(
                  <Select placeholder="请选择课程类型">
                    <Option value="外训" key="外训">
                      外训
                    </Option>
                    <Option value="外聘内训" key="外聘内训">
                      外聘内训
                    </Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="是否为另添加课程">
                {getFieldDecorator('isArrangeSelf', {})(
                  <Select placeholder="Y">
                    <Option value="Y" key="Y">
                      Y
                    </Option>
                    <Option value="N" key="N">
                      N
                    </Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="课程大纲">
                <Upload
                  onChange={this.handleFileChange}
                  fileList={this.state.fileList}
                  customRequest={async file => {
                    const res = await uploadFile(file.file);
                    let { fileList } = this.state;
                    fileList[fileList.length - 1] = {
                      name: file.file.name,
                      url: res,
                      status: 'done',
                      uid: -fileList.length
                    };
                    this.setState({
                      fileList
                    });
                  }}
                >
                  <Button>
                    <Icon type="upload" /> 上传课程大纲
                  </Button>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        ) : null}
        {this.state.isShowSendMail == true ? (
          <Modal
            title="请选择想要开的课程"
            onCancel={() =>
              this.setState({
                isShowSendMail: false
              })
            }
            destroyOnClose={true}
            footer={null}
            visible={this.state.isShowSendMail}
            width={'80%'}
          >
            <TableData
              resid={courseArrangmentResid}
              height={450}
              subtractH={240}
              hasRowView={false}
              hasModify={false}
              hasDelete={false}
              hasRowDelete={false}
              hasRowModify={false}
              hasRowSelection={true}
              hasAdd={false}
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              actionBarExtra={({
                dataSource: dataSource,
                selectedRowKeys: selectedRowKeys
              }) => {
                return (
                  <Popconfirm
                    title="确认发送邮件"
                    onConfirm={() => {
                      this.onHandleMessage(dataSource, selectedRowKeys);
                    }}
                  >
                    <Button>发送通知邮件</Button>
                  </Popconfirm>
                );
              }}
            ></TableData>
          </Modal>
        ) : null}
      </div>
    );
  }
}

export default Form.create({})(ArrangingCourses);
