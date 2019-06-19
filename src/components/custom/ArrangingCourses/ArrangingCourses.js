import React from 'react';
import {
  Card,
  Button,
  Icon,
  Spin,
  Popconfirm,
  Modal,
  DatePicker,
  Input,
  message,
  List,
  Radio
} from 'antd';
import { TableData } from '../../common/loadableCommon';
import './ArrangingCourses.less';
import http from 'Util20/api';

const { RangePicker } = DatePicker;
const { Search } = Input;

function onChange(value, dateString) {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
}

function onOk(value) {
  console.log('onOk: ', value);
}
const courseArrangmentResid = '613959525708'; //课程安排表id
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
    targetCourseArrangment: [] //移动人员时可选择的课程安排
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    await this.getCourseArrangment();
    this.setState({ loading: false });
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
      this.setState({ courseArrangment });
    } else {
      message.error(res.message);
    }
  };

  //删除课程安排
  deleteCourseArrangment = async arrangment => {
    console.log(arrangment);
    let { courseArrangment } = this.state;
    courseArrangment.splice(
      courseArrangment.findIndex(item => {
        return item.REC_ID === arrangment.REC_ID;
      }),
      1
    );
    message.success('删除成功');
    this.setState({ courseArrangment });
  };
  handleAddCourseArrangment = () => {};
  render() {
    let { loading, courseArrangment, selectedCourseArrangment } = this.state;
    return (
      <div style={{ flex: 1, display: 'flex' }}>
        {/* <Spin spinning={loading} style={{ flex: 1, display: 'flex',width:'100%'}}></Spin> */}
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
              <span style={{ fontSize: 22, fontWeight: 700 }}>显示模式: </span>
              <Icon
                type="calendar"
                style={{ fontSize: 20, color: '#80aef7' }}
              />
            </div>
            <div className="arranging_courses-header_search">
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder={['开始日期', '结束日期']}
                onChange={onChange}
                onOk={onOk}
              />
              <Search
                placeholder="输入课程关键字搜索"
                onSearch={value => console.log(value)}
                style={{ width: 200, marginLeft: 5 }}
              />
            </div>
          </header>
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
                        console.log(item);
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
        </div>
        <Modal
          visible={this.state.isShowModifyModal}
          onCancel={() =>
            this.setState({
              isShowModifyModal: false,
              selectedCourseArrangment: {}
            })
          }
          onOk={() =>
            this.setState({
              isShowModifyModal: false,
              selectedCourseArrangment: {}
            })
          }
          title={selectedCourseArrangment.CourseName}
        ></Modal>
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
            resid="613959487818"
            key={selectedCourseArrangment.REC_ID}
            height={440}
            subtractH={200}
            hasRowView={false}
            hasModify={false}
            hasDelete={false}
            hasRowSelection={true}
            cmswhere={`CourseArrangeID = '${this.state.selectedCourseArrangment.CourseArrangeID}'`}
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
                  console.log(courseArrangment);
                  let targetCourseArrangment = courseArrangment.filter(item => {
                    return item.CourseID === selectedCourseArrangment.CourseID;
                  });
                  console.log(targetCourseArrangment);
                  this.setState({
                    isShowMoveLearner: true,
                    targetCourseArrangment
                  });
                  console.log(records);
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
            cmswhere={`C3_614184177086 = '${this.state.selectedCourseArrangment.CourseArrangeID}'`}
          ></TableData>
        </Modal>
        <Modal
          title="移动人员"
          visible={this.state.isShowMoveLearner}
          mask={false}
          onCancel={() =>
            this.setState({
              isShowMoveLearner: false
            })
          }
          onOk={() =>
            this.setState({
              isShowMoveLearner: false
            })
          }
        >
          <Radio.Group>
            <List
              dataSource={this.state.targetCourseArrangment}
              renderItem={item => (
                <div>
                  <Radio
                    onClick={() => {console.log(item.REC_ID)}}
                    checked={item.checked}
                    // value={item.REC_ID}
										key={item.REC_ID}
                  >
                    {item.CourseName}
                  </Radio>
                </div>
              )}
            ></List>
          </Radio.Group>
        </Modal>
        <Modal
          title="添加课程安排"
          onCancel={() =>
            this.setState({
              isShowAddCourseArrangment: false
            })
          }
          onOk={() =>
            this.setState({
              isShowAddCourseArrangment: false
            })
          }
          visible={this.state.isShowAddCourseArrangment}
        ></Modal>
      </div>
    );
  }
}

export default ArrangingCourses;
