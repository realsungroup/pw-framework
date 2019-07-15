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
  Select
} from 'antd';
import { TableData } from '../../common/loadableCommon';
import './ArrangingCourses.less';
import http from 'Util20/api';
import moment from 'moment';
import CalendarMode from './CalendarMode'

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option } = Select;
const courseArrangmentResid = '613959525708'; //课程安排表id
const courseDetailId = '615054661547';
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
    mode: 'card' // 显示模式，有卡片模式、日历模式、表格模式，默认卡片模式
  };

  componentDidMount = async () => {
    this.props.onHandleLoading(true);
    await this.getCourseArrangment();
    // await this.getCourses();
    this.props.onHandleLoading(false);
  };

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

      //去重方法2 ：使用 Array的 filter + findIndex 实现
      let courses = courseArrangment
        .map(item => ({
          CourseID: item.CourseID,
          CourseName: item.CourseName
        }))
        .filter((item, index, self) => {
          return self.findIndex(i => item.CourseID === i.CourseID) === index;
        });
      this.setState({ courseArrangment, courses });
    } else {
      message.error(res.message);
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
      let courseArrangment = res.data;
      this.setState({ courseArrangment });
      this.props.onHandleLoading(false);
    } catch (error) {
      this.props.onHandleLoading(false);
    }
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
  moveLearner = async data => {
    let res;
    try {
      res = await http().modifyRecords({
        resid: courseDetailId,
        data
      });
      message.success(res.message);
      this.tableDataRef.handleRefresh();
    } catch (error) {
      message.error(error.message);
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
    let { courseArrangment, selectedCourseArrangment, mode } = this.state;
    const { getFieldDecorator, setFieldsValue } = this.props.form;
    return (
      <div style={{ flex: 1, display: 'flex' }}>
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
              </span>
            </div>
            <div className="arranging_courses-header_search">
              <Select
                defaultValue="all"
                value={this.state.selectedRecentPeriod}
                style={{ width: 100, marginRight: 5 }}
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
            <div className="arranging_courses-course_list">
              {courseArrangment.length ? (
                courseArrangment.map(item => (
                  <Card
                    title={item.CourseName}
                    className="arranging_courses_item"
                    key={item.REC_ID}
                    extra={
                      <Icon
                        type="bell"
                        onClick={() => {
                          this.setState({
                            isShowBells: true,
                            selectedCourseArrangment: item
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
                            selectedCourseArrangment: item
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
                          this.setState({
                            isShowLearnerInfo: true,
                            selectedCourseArrangment: item
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
                      <div className="content_item">人数:{item.Attendees}</div>
                      <div className="content_item">
                        地点:{item.CourseLocation}
                      </div>
                      <div className="content_item">
                        时间：{item.StartDatetime}
                      </div>
                      <div className="content_item">
                        实际费用:{  `${item.actualCost}元`}
                      </div>
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
          )}
          {this.state.mode === 'calendar' && <div style={{height:'100%'}}><CalendarMode/></div>}
          {this.state.mode === 'table' && (
            <div style={{width:'100%',flex:1}}>
              <TableData
                resid="613959487818"
                // height={440}
                subtractH={200}
                hasRowView={false}
                hasModify={false}
                hasDelete={false}
                hasRowSelection={true}
              ></TableData>
            </div>
          )}
        </div>
        {this.state.isShowModifyModal ? (
          <Modal
            visible={this.state.isShowModifyModal}
            onCancel={() =>
              this.setState({
                isShowModifyModal: false,
                selectedCourseArrangment: {}
              })
            }
            destroyOnClose
            onOk={() => {
              this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                  console.log(values);
                  let { selectedCourseArrangment } = this.state;
                  let courseArrangment = {
                    ...selectedCourseArrangment,
                    StartDatetime: values.modifyStartDatetime.format(
                      'YYYY-MM-DD HH:mm:ss'
                    ),
                    CourseLocation: values.modifyCourseLocation,
                    classType: values.classType,
                    actualCost: parseFloat(values.actualCost)
                  };
                  this.modifyCourseArrangment(courseArrangment);
                  this.setState({
                    isShowModifyModal: false,
                    selectedCourseArrangment: {}
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

              <Form.Item label="时间">
                {getFieldDecorator('modifyStartDatetime', {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: '请选择上课时间!'
                    }
                  ],
                  initialValue: this.state.selectedCourseArrangment
                    .StartDatetime
                    ? moment(this.state.selectedCourseArrangment.StartDatetime)
                    : null
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
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
              <Form.Item label="课程类型">
                {getFieldDecorator('classType', {
                  initialValue: this.state.selectedCourseArrangment.classType
                })(
                  <Select placeholder="请选择课程类型">
                    <Option value="外训" key='外训'>外训</Option>
                    <Option value="外聘内训" key='外聘内训'>外聘内训</Option>
                  </Select>
                )}
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
            hasRowSelection={true}
            cmswhere={`CourseArrangeID = '${selectedCourseArrangment.CourseArrangeID}'`}
            actionBarExtra={records => (
              <Button
                onClick={() => {
                  if (!records.selectedRowKeys.length) {
                    return message.error('请选择一条记录');
                  }
                  let {
                    courseArrangment,
                    selectedCourseArrangment
                  } = this.state;
                  let targetCourseArrangment = courseArrangment.filter(item => {
                    return (
                      item.CourseID === selectedCourseArrangment.CourseID &&
                      item.REC_ID !== selectedCourseArrangment.REC_ID
                    );
                  });
                  let keys = records.selectedRowKeys;
                  let selectedMoveLearners = [];
                  keys.forEach(item => {
                    let learner = records.dataSource.find(i => {
                      return i.REC_ID === item;
                    });
                    if(learner){
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
          ></TableData>
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
          onOk={async () => {
            let {
              selectedTargetCourseArrangment,
              selectedMoveLearners
            } = this.state;
            selectedMoveLearners.forEach(item => {
              item.CourseArrangeID = selectedTargetCourseArrangment;
            });
            console.log(selectedTargetCourseArrangment)
            await this.moveLearner(selectedMoveLearners);
            this.setState({
              isShowMoveLearner: false,
              selectedMoveLearners: [],
              selectedTargetCourseArrangment: ''
            });
          }}
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
        </Modal>
        {this.state.isShowAddCourseArrangment ? (
          <Modal
            title="添加课程安排"
            onCancel={() =>
              this.setState({
                isShowAddCourseArrangment: false,
                selectedCourseArrangment: {}
              })
            }
            destroyOnClose={true}
            onOk={() => {
              this.props.form.validateFieldsAndScroll((err, values) => {
                console.log(values);
                console.log(parseFloat(values.actualCost));
                if (!err) {
                  let courseArrangment = { ...values };
                  courseArrangment.actualCost = parseFloat(
                    courseArrangment.actualCost
                  );
                  this.addCourseArrangment(courseArrangment);
                  this.setState({
                    isShowAddCourseArrangment: false,
                    selectedCourseArrangment: {}
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
                    {this.state.courses.map(item => (
                      <Option key={item.CourseID} value={item.CourseID}>
                        {item.CourseName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="时间">
                {getFieldDecorator('StartDatetime', {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: '请选择上课时间!'
                    }
                  ]
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
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
              <Form.Item label="课程类型">
                {getFieldDecorator('classType', {})(
                  <Select placeholder="请选择课程类型">
                    <Option value="外训" key='外训'>外训</Option>
                    <Option value="外聘内训" key='外聘内训'>外聘内训</Option>
                  </Select>
                )}
              </Form.Item>
            </Form>
          </Modal>
        ) : null}
      </div>
    );
  }
}

export default Form.create({})(ArrangingCourses);
