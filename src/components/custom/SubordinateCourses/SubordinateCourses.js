import React from 'react';
import {
  Button,
  Modal,
  Card,
  Row,
  Col,
  Icon,
  Drawer,
  Rate,
  message,
  DatePicker,
  InputNumber,
  Divider,
  Empty,
  Tabs,
  Select,
  Input
} from 'antd';
import moment from 'moment';
import Calendar from 'ic-components/lib/Calendar';
import 'ic-components/lib/Calendar/style/index.less';
import './SubordinateCourses.less';
import { TableData } from '../../common/loadableCommon';
import CourseInfo from '../EmployeeCourses/CourseInfo';
import http from 'Util20/api';
import { log } from 'util';

const dateFormat = 'YYYY-MM-DD';
const TIPS_RESID = '614964195659'; //心得表id
const CourseArrangementDetailRESID = '616518104225';
const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;

class SubordinateCourses extends React.Component {
  state = {
    courseDetailVisible: false, //查看课程详情模态窗显示状态
    applyDrawerVisible: false, //申请单抽屉显示状态
    feedbackDrawerVisible: false, //反馈和行动计划抽屉显示状态
    tipsDrawerVisible: false, //心得抽屉显示状态
    summaryVisible: false, //汇总模态窗显示状态
    selectedCourseArrangmentDetail: {},
    courseArrangmentDetailToSearch: {}, //查询申请等附件时用到
    employeePersonalCourses: [], //员工的课程
    calendarEvents: [], //日历事件
    searchKeyword: '', // 搜索的关键字
    searchCourseType: 'all', //搜索的课程类型
    planView: [],
    // 内训评分
    rate: {
      rate1: null,
      rate2: null,
      rate3: null,
      rate4: null,
      rate5: null,
      rate6: null,
      rate7: null,
      rate8: null,
      advantange: '',
      shortcomming: ''
    },
    //外训评分
    rateOut: {
      rate1: null,
      rate2: null,
      rate3: null,
      rate4: null
    },
    tips: {}
  };

  getEmployeePersonalCourses = async () => {
    let { selectedCourseArrangmentDetail } = this.state;
    try {
      let res = await http().getTable({
        resid: CourseArrangementDetailRESID,
        cmswhere: `C3_613941384832 = ${selectedCourseArrangmentDetail.C3_613941384832}`
      });
      let calendarEvents = res.data.map(item => {
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
          category_name: item.C3_613941384592
        };
      });
      this.setState({ employeePersonalCourses: res.data, calendarEvents });
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };
  //获取反馈与行动计划
  getFeebackAndRate = async () => {
    const { rate, rateOut, courseArrangmentDetailToSearch } = this.state;
    let res; //课程反馈
    try {
      res = await http().getTable({
        resid: 478367996508,
        cmswhere: `C3_478368118696 =${courseArrangmentDetailToSearch.CourseArrangeDetailID}`
      });
    } catch (err) {
      console.log(err.message);
      message.error(err.message);
    }
    if (res.data.length > 0) {
      if (res.data[0].C3_615639406401 === '外训') {
        const tempRateOut = { ...rateOut };
        tempRateOut.rate1 = res.data[0].C3_478370015482; //机构服务满意度
        tempRateOut.rate2 = res.data[0].C3_478370045169; //讲师满意度
        tempRateOut.rate3 = res.data[0].C3_615580966131; //内容关联度
        tempRateOut.rate4 = res.data[0].C3_478370100284; //是否推荐同事参加考试课程
        this.setState({
          rateOut: tempRateOut
        });
        // console.log('后端返回的外训评分', this.state.rateOut);
      } else {
        const tempRate = { ...rate };
        tempRate.rate1 = res.data[0].C3_615639978971; //讲师备课充分
        tempRate.rate2 = res.data[0].C3_615640010121; //我认为课程主题准确，结构清晰，内容充实
        tempRate.rate3 = res.data[0].C3_615640043869; //所学的内容对实际工作有很大帮助
        tempRate.rate4 = res.data[0].C3_615640107592; //讲师语言表达能力好,讲解清楚生动,运用肢体语言
        tempRate.rate5 = res.data[0].C3_615640157603; // 讲师能够引入实际案例和例证,讲解透彻,激发学员思考
        tempRate.rate6 = res.data[0].C3_615640180269; //我能够积极参与到课堂中去
        tempRate.rate7 = res.data[0].C3_615640206802; //我的提问能够得到讲师认真,满意的答复
        tempRate.rate8 = res.data[0].C3_615640235456; //时间控制合理使我感到舒适
        tempRate.advantange = res.data[0].C3_622216706104;
        tempRate.shortcomming = res.data[0].C3_622216725340;
        this.setState({
          rate: tempRate
        });
        console.log('后盾返回的内训评分', res.data[0]);
      }
    }
    if (courseArrangmentDetailToSearch.courseType !== '内训') {
      let res2; //行动计划
      try {
        res2 = await http().getTable({
          resid: 615571557694,
          cmswhere: `courseArrange =${courseArrangmentDetailToSearch.CourseArrangeDetailID}`
        });
      } catch (err) {
        message.error(err.message);
        console.log(err);
      }
      console.log('后端返回的行动计划', res2);
      this.setState({
        planView: res2.data
      });
    }
  };

  //获取心得
  getTips = async () => {
    const { courseArrangmentDetailToSearch } = this.state;
    try {
      let res = await http().getTable({
        resid: TIPS_RESID,
        cmswhere: `C3_615479417558 = ${courseArrangmentDetailToSearch.CourseArrangeDetailID}`
      });
      if (res.data.length) {
        this.setState({ tips: { ...res.data[0] } });
      }
    } catch (error) {
      message.error(error.message);
      console.log(error.message);
    }
  };

  //搜索课程安排明细
  searchCourseArrangment = async key => {
    let res,
      {
        searchCourseType,
        searchKeyword,
        selectedCourseArrangmentDetail
      } = this.state;
    let hasCourseType = searchCourseType !== 'all',
      cmswhere = `C3_613941384832 = ${selectedCourseArrangmentDetail.C3_613941384832}`;
    cmswhere += hasCourseType ? `AND courseType = '${searchCourseType}'` : '';
    try {
      res = await http().getTable({
        resid: CourseArrangementDetailRESID,
        key: searchKeyword,
        cmswhere: cmswhere
      });
      let employeePersonalCourses = res.data;
      this.setState({ employeePersonalCourses });
    } catch (error) {
      console.error(error.message);
      message.error(error.message);
    }
  };
  handleReturn= async =>{
    console.log()
    // let res; //课程反馈
    // try {
    //   res = await http().getTable({
    //     resid: 478367996508,
    //     cmswhere: `C3_478368118696 =${courseArrangmentDetailToSearch.CourseArrangeDetailID}`
    //   });
    // } catch (err) {
    //   console.log(err.message);
    //   message.error(err.message);
    // }
  }
  handleOk = () => {
    this.setState({
      courseDetailVisible: false,
      summaryVisible: false,
      applyDrawerVisible: false,
      courseArrangmentDetailToSearch: {},
      employeePersonalCourses: [],
      selectedCourseArrangmentDetail: {}
    });
  };

  handleCancel = () => {
    this.setState({
      courseDetailVisible: false,
      summaryVisible: false,
      applyDrawerVisible: false,
      courseArrangmentDetailToSearch: {},
      selectedCourseArrangmentDetail: {},
      employeePersonalCourses: []
    });
  };

  handleColseDrawers = () => {
    this.setState({
      applyDrawerVisible: false,
      feedbackDrawerVisible: false,
      tipsDrawerVisible: false
    });
  };
  renderSummary() {
    let { employeePersonalCourses } = this.state;
    return (
      <Tabs defaultActiveKey="card">
        <TabPane tab="汇总" key="card">
          <header className="screening_bar">
            <div className="screening_bar-selectors">
              <Select
                defaultValue=""
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
                <Option value="">财年</Option>
                {/* <Option value="all">全部</Option>
                <Option value="week">一周内</Option>
                <Option value="weeks">两周内</Option>
                <Option value="month">一个月内</Option>
                <Option value="months">两个月内</Option> */}
              </Select>
              <Select
                defaultValue="all"
                value={this.state.searchCourseType}
                style={{ width: 100, marginRight: 5 }}
                onChange={e => {
                  console.log(e);
                  this.setState(
                    {
                      searchCourseType: e
                    },
                    this.searchCourseArrangment
                  );
                }}
              >
                <Option value="all">培训类型</Option>
                <Option value="外训">外训</Option>
                <Option value="内训">内训</Option>
                <Option value="外聘内训">外聘内训</Option>
              </Select>
            </div>
            <div>
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
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between'
            }}
          >
            {employeePersonalCourses.length ? (
              employeePersonalCourses.map(item => {
                return (
                  <Card
                    title={`${item.courseType} / ${item.C3_613941384592}`}
                    size="small"
                    style={{
                      width: '49%',
                      padding: 12,
                      marginBottom: 24
                    }}
                    headStyle={{ padding: 0 }}
                  >
                    <div className="subordinate_courses_item_content">
                      <div className="content_item">
                        主讲:{item.C3_613941386081}
                      </div>
                      <div className="content_item">人数:{item.Attendees}</div>
                      <div className="content_item">
                        地点:{item.C3_613941386325}
                      </div>
                      <div className="content_item">
                        开始时间：{item.C3_615393041304}
                      </div>
                      <div className="content_item">
                        结束时间：{item.C3_615393093633}
                      </div>
                      <div className="content_item">
                        实际费用:{item.actualCost && `${item.actualCost}元`}
                      </div>
                      <div className="content_item">
                        附件:
                        {/* 内训没有申请单 */}
                        {item.courseType !== '内训' &&
                          (item.C3_615377523072 === 'Y' ? (
                            <Button
                              type="link"
                              onClick={() => {
                                this.setState({
                                  applyDrawerVisible: true,
                                  courseArrangmentDetailToSearch: { ...item }
                                });
                              }}
                            >
                              申请单
                            </Button>
                          ) : (
                            <Button type="link" disabled>
                              申请单
                            </Button>
                          ))}
                        {/* 外训有反馈和行动计划 */}
                        {item.courseType === '外训' &&
                          (item.C3_615377473913 === 'Y' ? (
                            <Button
                              type="link"
                              onClick={() => {
                                this.setState(
                                  {
                                    feedbackDrawerVisible: true,
                                    courseArrangmentDetailToSearch: { ...item }
                                  },
                                  this.getFeebackAndRate
                                );
                              }}
                            >
                              行动计划表
                            </Button>
                          ) : (
                            <Button type="link" disabled>
                              行动计划表
                            </Button>
                          ))}
                        {/* 内训和外聘内训没有行动计划 */}
                        {item.courseType !== '外训' &&
                          (item.isInnerFeedBack === 'Y' ? (
                            <Button
                              type="link"
                              onClick={() => {
                                this.setState(
                                  {
                                    feedbackDrawerVisible: true,
                                    courseArrangmentDetailToSearch: { ...item }
                                  },
                                  this.getFeebackAndRate
                                );
                              }}
                            >
                              反馈表
                            </Button>
                          ) : (
                            <Button type="link" disabled>
                              反馈表
                            </Button>
                          ))}
                        {/* 外训才有心得 */}
                        {item.courseType === '外训' &&
                          (item.isSubmitFeel === 'Y' ? (
                            <Button
                              type="link"
                              onClick={() => {
                                this.setState(
                                  {
                                    tipsDrawerVisible: true,
                                    courseArrangmentDetailToSearch: { ...item }
                                  },
                                  this.getTips
                                );
                              }}
                            >
                              课程心得
                            </Button>
                          ) : (
                            <Button type="link" disabled>
                              课程心得
                            </Button>
                          ))}
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Empty description=""></Empty>
            )}
          </div>
        </TabPane>
        <TabPane tab="日历" key="calendar">
          <div style={{ height: '100%' }}>
            <Calendar
              eventKeyword=""
              events={[...this.state.calendarEvents]}
              defaultActiveTab="month"
              height={'calc(100vh - 116px)'}
            />
          </div>
        </TabPane>
      </Tabs>
    );
  }
  renderCourseDetail(course, courseType) {
    return (
      <div className="courseDetail">
        <CourseInfo
          course={course}
          mode="view"
          extraCost={course.extraCharge}
        />
        <Card
          title="课程选项"
          type="inner"
          size="small"
          className="courseDetail__card"
        >
          {course.courseType !== '内训' || course.C3_615377523072 === 'Y' ? (
            <Row className="courseDetail__courseOptional">
              <Col span={3}>
                <Icon type="paper-clip" />
              </Col>
              <Col span={5}>
                <Button
                  type="link"
                  onClick={() => {
                    this.setState({ applyDrawerVisible: true });
                  }}
                >
                  申请单
                </Button>
              </Col>
              <Col span={16}>{course.C3_615377538264}</Col>
            </Row>
          ) : null}
          {/* 课程反馈，行动计划已提交才显示 */}
          {course.C3_615377473913 === 'Y' && course.courseType === '外训' ? (
            <Row className="courseDetail__courseOptional">
              <Col span={3}>
                <Icon type="paper-clip" />
              </Col>
              <Col span={5}>
                <Button
                  type="link"
                  onClick={() => {
                    this.setState({ feedbackDrawerVisible: true });
                    this.getFeebackAndRate();
                  }}
                >
                  行动计划表
                </Button>
              </Col>
              <Col span={16}>{course.C3_615377481222}</Col>
            </Row>
          ) : null}
          {course.isInnerFeedBack === 'Y' && course.courseType !== '外训' ? (
            <Row className="courseDetail__courseOptional">
              <Col span={3}>
                <Icon type="paper-clip" />
              </Col>
              <Col span={5}>
                <Button
                  type="link"
                  onClick={() => {
                    this.setState({ feedbackDrawerVisible: true });
                    this.getFeebackAndRate();
                  }}
                >
                  反馈表
                </Button>
              </Col>
              <Col span={16}>{course.C3_615377481222}</Col>
            </Row>
          ) : null}
          {course.courseType === '外训' && course.isSubmitFeel === 'Y' ? (
            <Row className="courseDetail__courseOptional">
              <Col span={3}>
                <Icon type="paper-clip" />
              </Col>
              <Col span={5}>
                <Button
                  type="link"
                  onClick={() => {
                    this.setState({ tipsDrawerVisible: true });
                    this.getTips();
                  }}
                >
                  课程心得
                </Button>
              </Col>
              <Col span={16}>{course.submitFeelTime}</Col>
            </Row>
          ) : null}
        </Card>
      </div>
    );
  }
  render() {
    let {
      selectedCourseArrangmentDetail,
      tips,
      courseArrangmentDetailToSearch,
      summaryVisible,
      courseDetailVisible
    } = this.state;
    return (
      <div className="cataner">
        <TableData
          resid={CourseArrangementDetailRESID}
          subtractH={200}
          hasRowView={false}
          hasRowDelete={false}
          hasRowModify={false}
          hasModify={false}
          hasDelete={false}
          hasAdd={false}
          // hasRowSelection={true}
          customRowBtns={[

            record => {
              return (
                <Button
                  onClick={() => {
                    console.log(record);
                    this.setState({
                      courseDetailVisible: true,
                      selectedCourseArrangmentDetail: record,
                      courseArrangmentDetailToSearch: record
                    });
                  }}
                >
                  查看
                </Button>
              );
            },
            record => {
              return (
                <Button
                  onClick={() => {
                    this.setState(
                      {
                        summaryVisible: true,
                        selectedCourseArrangmentDetail: record
                      },
                      this.getEmployeePersonalCourses
                    );
                  }}
                >
                  汇总
                </Button>
              );
            }
          ]}
        />
        <Modal
          title={`${summaryVisible ? '员工课程汇总' : ''}${
            courseDetailVisible ? '课程详情' : ''
          }`}
          width="100%"
          visible={summaryVisible || courseDetailVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          top={10}
          destroyOnClose
          centered
        >
          {summaryVisible && this.renderSummary()}
          {courseDetailVisible &&
            this.renderCourseDetail(selectedCourseArrangmentDetail)}
        </Modal>
        <Drawer
          width={640}
          placement="right"
          closable={false}
          visible={this.state.applyDrawerVisible}
          onClose={this.handleColseDrawers}
        >
          <Card
            title="申请人信息"
            type="inner"
            size="small"
            className="courseApply__card"
          >
            <Row>
              <Col span={8}>
                申请人:{courseArrangmentDetailToSearch.C3_613941385305}
              </Col>
              <Col span={8}>
                员工号:{courseArrangmentDetailToSearch.C3_615642868855}
              </Col>
              <Col span={8}>
                职务:{courseArrangmentDetailToSearch.C3_615642934644}
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                所在部门:{courseArrangmentDetailToSearch.C3_615642887103}
              </Col>
              <Col span={8}>
                直接主管:{courseArrangmentDetailToSearch.C3_615642911765}
              </Col>
              <Col span={8}>
                部门负责人:{courseArrangmentDetailToSearch.C3_615642922917}
              </Col>
            </Row>
          </Card>
          <CourseInfo
            course={courseArrangmentDetailToSearch}
            extraCost={courseArrangmentDetailToSearch.extraCharge}
            mode="view"
          />
        </Drawer>
        <Drawer
          width="60%"
          placement="right"
          closable={false}
          visible={this.state.feedbackDrawerVisible}
          onClose={this.handleColseDrawers}
        >
          {this.state.courseArrangmentDetailToSearch.courseType === '内训' ? (
            <Card>
              <Card type="inner" title="讲师专业水平" className="cardinner">
                <Row>
                  <Col span={12}>讲师备课充分，对授课内容非常了解</Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate1} disabled />
                  </Col>
                </Row>
              </Card>
              <Card type="inner" title="课程内容安排" className="cardinner">
                <Row>
                  <Col span={12}>我认为课程主题准确，结构清晰，内容充实</Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate2} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>所学的内容对实际工作有很大帮助</Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate3} disabled />
                  </Col>
                </Row>
              </Card>
              <Card type="inner" title="授课技巧" className="cardinner">
                <Row>
                  <Col span={12}>
                    讲师语言表达能力好,讲解清楚生动,运用肢体语言
                  </Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate4} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    讲师能够引入实际案例和例证,讲解透彻,激发学员思考
                  </Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate5} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>我能够积极参与到课堂中去</Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate6} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>我的提问能够得到讲师认真,满意的答复</Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate7} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>时间控制合理使我感到舒适</Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate8} disabled />
                  </Col>
                </Row>
              </Card>

              <div>
                <div>
                  <h3>我很有收获的内容</h3>
                  <p>{this.state.rate.advantange}</p>
                </div>
                <div>
                  <h3>我希望改进的内容</h3>
                  <p>{this.state.rate.shortcomming}</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card type="inner" title="讲师专业水平" className="cardinner">
              <Row>
                <Col span={12}>培训机构服务满意度</Col>
                <Col span={12}>
                  <Rate value={this.state.rateOut.rate1} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>培训讲师满意度</Col>
                <Col span={12}>
                  <Rate value={this.state.rateOut.rate2} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>培训内容和工作内容关联度</Col>
                <Col span={12}>
                  <Rate value={this.state.rateOut.rate3} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>是否推荐同事参加该课程</Col>
                <Col span={12}>
                  <Rate value={this.state.rateOut.rate4} disabled />
                </Col>
              </Row>
            </Card>
          )}
          {this.state.courseArrangmentDetailToSearch.courseType ===
          '内训' ? null : (
            <Card title="行动计划" style={{ marginTop: 10 }}>
              <Row>
                <Col span={2}>序号</Col>
                <Col span={8}>具体行动</Col>
                <Col span={5}>开始时间</Col>
                <Col span={5}>结束时间</Col>
                <Col span={4}>进度</Col>
              </Row>
              {this.state.planView.map((item, index) => {
                return (
                  <Row key={index}>
                    <Col span={2}>{index + 1}</Col>
                    <Col span={8}>{item.actions}</Col>
                    <Col span={5}>
                      <DatePicker
                        value={moment(`${item.startTime}`, dateFormat)}
                        disabled
                      />
                    </Col>
                    <Col span={5}>
                      <DatePicker
                        value={moment(`${item.endTime}`, dateFormat)}
                        disabled
                      />
                    </Col>
                    <Col span={4}>
                      <InputNumber value={item.progress} disabled />
                    </Col>
                  </Row>
                );
              })}
            </Card>
          )}
          <Button style={{position:'absolute',bottom:'16px'}} onClick={this.handleReturn}>退回这个课程反馈</Button>
        </Drawer>
        <Drawer
          width={'60%'}
          placement="right"
          closable={false}
          visible={this.state.tipsDrawerVisible}
          onClose={this.handleColseDrawers}
        >
          {tips.C3_614964239022 ? (
            <div style={{ padding: 12 }}>
              {/* 标题 */}
              <h2 style={{ textAlign: 'center' }}>{tips.C3_614964239022}</h2>
              <Divider />
              {/* 内容 */}
              {tips.Filepath ? (
                tips.Filepath.split(',').map((item, index) => (
                  <p>
                    <a href={item} target="_blank">
                      附件{index + 1}
                    </a>
                  </p>
                ))
              ) : (
                <p>无附件</p>
              )}
            </div>
          ) : (
            <Empty description="未提交心得"></Empty>
          )}
        </Drawer>
      </div>
    );
  }
}

export default SubordinateCourses;
