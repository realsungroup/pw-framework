import React from 'react';
import {
  Button,
  Modal,
  Card,
  Radio,
  Input,
  DatePicker,
  Select,
  List,
  message,
  Popconfirm,
  Form
} from 'antd';
import { TableData } from '../../../common/loadableCommon';
import http from 'Util20/api';
import TextArea from 'antd/lib/input/TextArea';
import './EmployeeApplyCourse.less';

const { Option } = Select;
const CourseDetailResid = '613959487818';
const CourseArrangeResid = '613959525708';
const form = props => {
  const {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    isFieldTouched
  } = props.form;
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
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 8
      }
    }
  };
  return (
    <Form {...formItemLayout}>
      <Form.Item label="课程名称">
        {getFieldDecorator('courseName', {
          rules: [{ required: true, message: '请输入课程名称' }]
        })(<Input placeholder="课程名称" />)}
      </Form.Item>
      <Form.Item label="培训机构">
        {getFieldDecorator('TrainingOrganization', {
          rules: [{ required: true, message: '请填写培训机构' }]
        })(<Input placeholder="请填写培训机构" />)}
      </Form.Item>
      <Form.Item label="费用">
        {getFieldDecorator('cost', {
          rules: [{ required: true, message: '请输入费用' }]
        })(<Input placeholder="费用" type="number" />)}
      </Form.Item>
      <Form.Item label="当前财年">
        {getFieldDecorator('currentYear', {
          rules: [{ required: true, message: '请输入当前财年' }]
        })(<Input placeholder="请输入当前财年，例如：FY2020" />)}
      </Form.Item>
      <Form.Item label="季度">
        {getFieldDecorator('quarter', {
          rules: [{ required: true, message: '请输入季度' }]
        })(<Input placeholder="请输入季度，例如：Q1" />)}
      </Form.Item>
      <Form.Item label="开始上课日期">
        {getFieldDecorator('beginClassTime', {
          rules: [{ required: true, message: '请选择上课日期' }]
        })(<DatePicker placeholder="请选择上课日期" />)}
      </Form.Item>
      <Form.Item label="上课结束日期">
        {getFieldDecorator('endClassTime', {
          rules: [{ required: true, message: '请选择结束日期' }]
        })(<DatePicker placeholder="请选择结束日期" />)}
      </Form.Item>
      <Form.Item label="上课地点">
        {getFieldDecorator('TranningLocation', {
          rules: [{ required: true, message: '请填写上课地点' }]
        })(<Input placeholder="请填写上课地点" />)}
      </Form.Item>
      <Form.Item label="培训类别">
        {getFieldDecorator('TranningType', {
          rules: [{ required: true, message: '请选择培训类别' }]
        })(
          <Select defaultValue="外训" placeholder="请选择培训类别">
            <Option value="内训">内训</Option>
            <Option value="外训">外训</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="课程概要">
        {getFieldDecorator('courseIntroduction', {
          rules: [{ required: true, message: '请填写课程概要' }]
        })(<TextArea placeholder="请填写课程概要" />)}
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button style={{ marginRight: 12 }} onClick={props.closeModal}>
          取消
        </Button>
        <Button
          onClick={() => {
            props.form.validateFields((errors, values) => {
              console.log(errors, values);
              if (!errors) {
                console.log(values);
                props.onSubmit(values);
              }
            });
          }}
          type="primary"
        >
          保存
        </Button>
      </Form.Item>
    </Form>
  );
};
const SelfDefineCourseForm = Form.create({})(form);
class EmployeeApplyCourse extends React.Component {
  state = {
    courses: [],
    applyByCourseVisible: false, // 选课申请模态窗状态
    applyByQualificationCertificateVisible: false, // 资格证书申请模态窗状态
    applyByUnexistCourseVisible: false, // 自定义课程申请模态窗状态
    isSelectedCourse: false,
    selectedCourse: {},
    searchKey: '',
    courseArrangeID: '',
    UserCode: ''
  };

  componentDidMount() {
    this.getCourses();
    let usercode = localStorage.getItem('userInfo');
    let usrChara = JSON.parse(usercode);
    let userCode = usrChara.UserInfo.EMP_USERCODE;
    this.setState({ UserCode: userCode });
  }

  //获取课程
  getCourses = async () => {
    try {
      let res = await http().getTable({
        resid: '629291566545'
      });
      this.setState({ courses: [...res.data] });
    } catch (error) {
      console.error(error.message);
      message.error(error.message);
    }
  };

  searchCourses = async () => {
    let { searchKey } = this.state;
    try {
      let res = await http().getTable({
        resid: '610308370365',
        key: searchKey
      });
      this.setState({
        courses: [...res.data]
      });
    } catch (error) {
      console.error(error.message);
      message.error(error.message);
    }
  };

  submitCourse = async course => {
    // this.submitSelfDefineCourse(course);
    this.submitCentrolList(course);
  };
  //明细表添加记录
  submitSelfDefineCourse = async course => {
    try {
      let res = await http().addRecords({
        resid: CourseDetailResid,
        data: [
          {
            C3_613941384592: course.courseName,
            C3_613941385069: course.cost,
            C3_615393041304: course.beginClassTime,
            C3_615393093633: course.endClassTime,
            C3_613941386325: course.TranningLocation,
            courseIntroduction: course.courseIntroduction,
            courseType: course.TranningType,
            trainingClub: course.TrainingOrganization,
            CourseArrangeID: course.CourseArrangeID,
            C3_613941384328: course.currentYear,
            C3_613956470258: 'Y',
            C3_613941384832: this.state.UserCode
            // C3_613941386081:classTime
          }
        ]
      });
      message.success(res.message);
      this.tableDataRef.handleRefresh();
      this.setState({ applyByUnexistCourseVisible: false });
    } catch (error) {
      console.error(error.message);
      message.error(error.message);
    }
  };

  //主表添加记录
  submitCentrolList = async course => {
    try {
      let res = await http().addRecords({
        resid: CourseArrangeResid,
        data: [
          {
            CourseName: course.courseName,
            actualCost: course.cost,
            StartDatetime: course.beginClassTime,
            EndDatetime: course.endClassTime,
            CourseLocation: course.TranningLocation,
            courseInformation: course.courseIntroduction,
            classType: course.TranningType,
            organization: course.TrainingOrganization,
            isCustom: 'Y',
            FisYear: course.currentYear,
            quarter: course.quarter
          }
        ]
      });
      const data = res.data[0];
      this.setState({
        applyByUnexistCourseVisible: false
      });
      this.submitSelfDefineCourse({
        ...course,
        CourseArrangeID: data.CourseArrangeID
      });
      message.success(res.message);
    } catch (error) {
      console.error(error.message);
      message.error(error.message);
    }
  };

  //内训课课程申请添加至课程安排主表
  submitInternelCourse = async course => {
    let { selectedCourse } = this.state;
    try {
      let res = await http().addRecords({
        resid: CourseArrangeResid,
        data: [
          {
            CourseName: selectedCourse.C3_609845305680,
            courseInformation: selectedCourse.C3_609845305618,
            classType: selectedCourse.C3_612436740323,
            FisYear: selectedCourse.C3_609845305743
          }
        ]
      });
      const data = res.data[0];
      this.setState({
        applyByUnexistCourseVisible: false,
        courseArrangeID: data.CourseArrangeID
      });
      this.submitApply();
      message.success(res.message);
    } catch (error) {
      console.error(error.message);
      message.error(error.message);
    }
  };

  //提交申请
  submitApply = async () => {
    let { selectedCourse } = this.state;
    let { courseArrangeID } = this.state;
    console.log('selectedCourse', selectedCourse);
    try {
      let res = await http().addRecords({
        resid: CourseDetailResid,
        data: [
          {
            C3_614182469763: selectedCourse.C3_609845305868,
            CourseArrangeID: courseArrangeID
          }
        ]
      });
      message.success('保存成功，请到右侧‘课程管理’分页内提交报销单');
      this.tableDataRef.handleRefresh();
      this.setState({
        applyByCourseVisible: false,
        selectedCourse: {}
      });
    } catch (error) {
      console.error(error.message);
      message.error(error.message);
    }
  };

  closeModal = () => {
    this.setState({
      applyByCourseVisible: false,
      applyByQualificationCertificateVisible: false,
      applyByUnexistCourseVisible: false
    });
  };
  render() {
    let { courses, selectedCourse } = this.state;
    return (
      <div>
        <TableData
          resid="616600487064"
          subtractH={220}
          hasBeBtns={true}
          hasAdd={false}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          hasRowView={false}
          hasRowDelete={false}
          hasRowEdit={false}
          hasDelete={false}
          hasModify={false}
          actionBarFixed={true}
          hasRowModify={false}
          height="90vh"
          actionBarExtra={[
            <Button
              onClick={() => {
                this.setState({ applyByUnexistCourseVisible: true });
              }}
            >
              填写报销单
            </Button>

            // <Button>资格证书申请</Button>
          ]}
        />
        <Modal
          visible={this.state.applyByCourseVisible}
          onCancel={() =>
            this.setState({
              applyByCourseVisible: false,
              isSelectedCourse: false
            })
          }
          onOk={() =>
            this.setState({
              applyByCourseVisible: false,
              isSelectedCourse: false
            })
          }
          width="80%"
          title="添加课程安排"
          centered={true}
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
                bodyStyle={{ flex: 1 }}
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
                          courseType: '普通内训课',
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
                  <Popconfirm
                    title="确认保存申请？"
                    onConfirm={this.submitInternelCourse}
                  >
                    <Button icon="save" type="link">
                      保存申请
                    </Button>
                  </Popconfirm>
                ]}
              >
                <div className="course_info">
                  <div className="course_info-item">
                    <label>体系：</label>
                    <span>{selectedCourse.C3_609845305368}</span>
                  </div>
                  <div className="course_info-item">
                    <label>类别：</label>
                    <span>{selectedCourse.C3_609845305305}</span>
                  </div>
                  <div className="course_info-item">
                    <label>讲师</label>
                    <span>{selectedCourse.C3_610390419677}</span>
                  </div>
                  <div className="course_info-item">
                    <label>财年</label>
                    <span>{selectedCourse.C3_609845305743}</span>
                  </div>
                  <div className="course_info-item">
                    <label>机构</label>
                    <span>{selectedCourse.C3_612436740323}</span>
                  </div>
                  {/* <div className="course_info-item">
                    <label>讲师</label>
                    <span>{selectedCourse.teacher}</span>
                  </div> */}
                  <div className="course_info-item" style={{ flex: 1 }}>
                    <label>简介</label>
                    <span>{selectedCourse.C3_609845305618}</span>
                  </div>
                </div>
              </Card>
            ) : (
              <List
                bordered
                dataSource={courses}
                header={
                  <header style={{ display: 'flex' }}>
                    <Input.Search
                      style={{ width: 250, marginLeft: 12 }}
                      placeholder="输入课程关键字搜索"
                      onChange={e =>
                        this.setState(
                          { searchKey: e.target.value },
                          this.searchCourses
                        )
                      }
                      value={this.state.searchKey}
                      onSearch={key =>
                        this.setState({ searchKey: key }, this.searchCourses)
                      }
                    />
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={() => {
                        this.setState({ applyByUnexistCourseVisible: true });
                      }}
                    >
                      自定义课程申请
                    </Button>
                  </header>
                }
                renderItem={item => {
                  return (
                    <List.Item
                      key={item.REC_ID}
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
        <Modal
          visible={this.state.applyByUnexistCourseVisible}
          title="填写报销单"
          width="50%"
          onCancel={this.closeModal}
          footer={null}
          centered
        >
          <SelfDefineCourseForm
            closeModal={this.closeModal}
            onSubmit={this.submitCourse}
          />
        </Modal>
      </div>
    );
  }
}

export default EmployeeApplyCourse;
