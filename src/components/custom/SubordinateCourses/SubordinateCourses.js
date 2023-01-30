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
  Divider,
  Empty,
  Tabs,
  Select,
  Input,
  Tooltip,
  Popconfirm
} from 'antd';
import moment from 'moment';
import Calendar from 'ic-components/lib/Calendar';
import 'ic-components/lib/Calendar/style/index.less';
import './SubordinateCourses.less';
import { TableData } from '../../common/loadableCommon';
import CourseInfo from '../EmployeeCourses/CourseInfo';
import http from 'Util20/api';

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
    tips: {},
    knowledge: [],
    plans: []
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

  // 获取反馈和行动计划
  getFeebackAndRate = async () => {
    const { rate, rateOut, courseArrangmentDetailToSearch } = this.state;
    let res; //课程反馈
    try {
      res = await http().getTable({
        resid: 478367996508,
        cmswhere: `C3_478368118696 = ${courseArrangmentDetailToSearch.CourseArrangeDetailID}`
      });
    } catch (err) {
      console.log(err.message);
      message.error(err.message);
    }
    if (res.data.length > 0) {
      if (
        courseArrangmentDetailToSearch.courseType === '外训' ||
        courseArrangmentDetailToSearch.courseType === '外聘内训'
      ) {
        const tempRateOut = { ...rateOut };
        const tempRate = { ...rate };
        const data = res.data[0];
        tempRate.rate1 = data.C3_615639978971; //讲师备课充分
        tempRate.rate2 = data.C3_615640010121; //本次培训的主题明确，逻辑清晰，内容充实，有针对性
        tempRate.rate2_1 = data.C3_722076452880;//有合适的课前调研，并且调研结果与课程内容联系紧密
        tempRate.rate2_2 = data.C3_722076492665;//课程时长设置合适，课程进度不紧迫不冗长
        tempRate.rate3_1 = data.C3_722079578079; //培训师具有足够的专业知识和经验
        tempRate.rate3_2 = data.C3_722079636630;//培训师备课充分，对授课内容非常熟悉，课件设计美观大方
        tempRate.rate3 = data.C3_615640043869; //我所学到的内容对实际工作或个人发展有帮助
        tempRate.rate4 = data.C3_615640107592; //培训师语言表达能力好，音量和语速适中，讲解清晰生动，能够运用肢体语言
        tempRate.rate5 = data.C3_615640157603; //培训师能够引入实际案例和例证，讲解透彻，激发学员思考
        tempRate.rate6 = data.C3_615640180269; //培训师能设置提问，小组讨论等互动环节，使学员积极参与其中
        tempRate.rate7 = data.C3_615640206802; //培训师能够及时，认真地回答学员提出的问题
        tempRate.rate8 = data.C3_615640235456; //时间控制合理使我感到舒适
        tempRate.rate9 = data.C3_722087822472;//我对本次课程整体满意
        tempRate.rate10 = data.C3_722087862632;//我愿意向朋友或同事推荐这门课程
        tempRate.rate11 = data.C3_722087899198;//在培训过程中，培训组织者给予我足够的后勤支持
        tempRate.rate12 = data.C3_722087926763;//培训场地设备设施完整无故障
        this.setState({
          rate: tempRate
        });
      } else {
        const tempRate = { ...rate };
        const data = res.data[0];
        tempRate.rate1 = data.C3_615639978971; //讲师备课充分
        tempRate.rate2 = data.C3_615640010121; //本次培训的主题明确，逻辑清晰，内容充实，有针对性
        tempRate.rate2_1 = data.C3_722076452880;//有合适的课前调研，并且调研结果与课程内容联系紧密
        tempRate.rate2_2 = data.C3_722076492665;//课程时长设置合适，课程进度不紧迫不冗长
        tempRate.rate3_1 = data.C3_722079578079; //培训师具有足够的专业知识和经验
        tempRate.rate3_2 = data.C3_722079636630;//培训师备课充分，对授课内容非常熟悉，课件设计美观大方
        tempRate.rate3 = data.C3_615640043869; //我所学到的内容对实际工作或个人发展有帮助
        tempRate.rate4 = data.C3_615640107592; //培训师语言表达能力好，音量和语速适中，讲解清晰生动，能够运用肢体语言
        tempRate.rate5 = data.C3_615640157603; //培训师能够引入实际案例和例证，讲解透彻，激发学员思考
        tempRate.rate6 = data.C3_615640180269; //培训师能设置提问，小组讨论等互动环节，使学员积极参与其中
        tempRate.rate7 = data.C3_615640206802; //培训师能够及时，认真地回答学员提出的问题
        tempRate.rate8 = data.C3_615640235456; //时间控制合理使我感到舒适
        tempRate.rate9 = data.C3_722087822472;//我对本次课程整体满意
        tempRate.rate10 = data.C3_722087862632;//我愿意向朋友或同事推荐这门课程
        tempRate.rate11 = data.C3_722087899198;//在培训过程中，培训组织者给予我足够的后勤支持
        tempRate.rate12 = data.C3_722087926763;//培训场地设备设施完整无故障
        const otherAdvice = {
          shortcommings: data.C3_622216725340,
          advantages: data.C3_622216706104
        };
        this.setState({
          rate: { ...tempRate, ...otherAdvice }
        });
      }
    } else {
      this.setState({
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
        }
      });
    }
    let res2; //行动计划
    try {
      res2 = await http().getTable({
        resid: 615571557694,
        cmswhere: `courseArrange = ${courseArrangmentDetailToSearch.CourseArrangeDetailID}`
      });
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
    console.info('res2', res2)
    if (res2.data.length) {
      let knowledge = res2.data[0].knowledge1.split(';');
      let plans = res2.data[0].action1.split(';');
      this.setState({
        knowledge,
        plans
      });
    } else {
      this.setState({
        knowledge: [],
        plans: []
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
  handleReturn = async => {
    console.log();
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
  };
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
                          (item.isSubmitFeel === 'ing' ? (
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
      courseDetailVisible,
      plans,
      knowledge
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
          destroyOnClose
        // destroyOnClose={true}
        >

          <Card>
            <Card type="inner" title="培训整体满意度" className="cardinner">
              <Row>
                <Col span={12}>我对本次课程整体满意</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate9} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>我愿意向朋友或同事推荐这门课程</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate10} disabled />
                </Col>
              </Row>
            </Card>
            {/* <Card type="inner" title="讲师专业水平" className="cardinner">
              <Row>
                <Col span={12}>讲师备课充分，对授课内容非常了解</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate1} disabled />
                </Col>
              </Row>
            </Card> */}
            <Card type="inner" title="课程内容满意度" className="cardinner">
              <Row>
                <Col span={12}>本次培训的主题明确，逻辑清晰，内容充实，有针对性</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate2} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>有合适的课前调研，并且调研结果与课程内容联系紧密</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate2_1} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>课程时长设置合适，课程进度不紧迫不冗长</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate2_2} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>我所学到的内容对实际工作或个人发展有帮助</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate3} disabled />
                </Col>
              </Row>
            </Card>
            <Card type="inner" title="培训师满意度" className="cardinner">
              <Row>
                <Col span={12}>
                  培训师语言表达能力好，音量和语速适中，讲解清晰生动，能够运用肢体语言
                  </Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate4} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  培训师能够引入实际案例和例证，讲解透彻，激发学员思考
                  </Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate5} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>培训师能设置提问，小组讨论等互动环节，使学员积极参与其中</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate6} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>培训师能够及时，认真地回答学员提出的问题</Col>
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
            <Card type="inner" title="培训组织与支持" className="cardinner">
              <Row>
                <Col span={12}>在培训过程中，培训组织者给予我足够的后勤支持</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate11} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>培训场地设备设施完整无故障</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate12} disabled />
                </Col>
              </Row>
            </Card>
            {this.state.courseArrangmentDetailToSearch.courseType === '内训' ? (
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
            ) : null
            }
          </Card>

          {this.state.courseArrangmentDetailToSearch.courseType ===
            '内训' ? null : (
              <>
                <Row>
                  <div>
                    <ul className="feedbackList">
                      <li key="tip">课程的收益与建议</li>
                      {knowledge.map((item, index) => {
                        return (
                          <li key={index}>
                            <rect>{index + 1}</rect>
                            <p>{item}</p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Row>
                <Row>
                  <div>
                    <ul className="feedbackList">
                      <li key="tip">
                        我的课后行动计划
                    </li>
                      {/* <li className="alter2" key="tip1">
                      <rect>序号</rect>
                      <p>具体行为</p>
                    </li> */}
                      {plans.map((item, index) => {
                        return (
                          <li key={index}>
                            <rect>{index + 1}</rect>
                            <p>{item}</p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Row>
              </>
            )}
          <Button
            style={{ position: 'absolute', bottom: '16px' }}
            onClick={this.handleReturn}
          >
            退回这个课程反馈
          </Button>
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
