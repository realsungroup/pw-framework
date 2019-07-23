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
import './EmployeeApplyCourse.less';

const { Option } = Select;
const CourseDetailResid = '615054661547';
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
      <Form.Item label="课程名">
        {getFieldDecorator('courseName', {
          rules: [{ required: true, message: '请输入课程名' }]
        })(<Input placeholder="课程名" />)}
      </Form.Item>
      <Form.Item label="费用">
        {getFieldDecorator('cost', {
          rules: [{ required: true, message: '请输入费用' }]
        })(<Input placeholder="费用" type="number" />)}
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
          提交
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
    searchKey: ''
  };

  componentDidMount() {
    this.getCourses();
  }

  //获取课程
  getCourses = async () => {
    try {
      let res = await http().getTable({
        resid: '610308370365'
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

  submitSelfDefineCourse = async course => {
    try {
      let res = await http().addRecords({
        resid: CourseDetailResid,
        data: [
          {
            C3_613941384592: course.courseName,
            C3_613941385069: course.cost
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
  //提交申请
  submitApply = async () => {
    let { selectedCourse } = this.state;
    try {
      let res = await http().addRecords({
        resid: CourseDetailResid,
        data: [
          {
            C3_614182469763: selectedCourse.C3_609845305868
          }
        ]
      });
      message.success('提交成功');
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
                this.setState({ applyByCourseVisible: true });
              }}
            >
              选课申请
            </Button>,
            <Button
              onClick={() => {
                this.setState({ applyByUnexistCourseVisible: true });
              }}
            >
              自定义课程申请
            </Button>,
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
                    title="确认提交申请？"
                    onConfirm={this.submitApply}
                  >
                    <Button icon="save" type="link">
                      提交申请
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
                    <span>{selectedCourse.teacher}</span>
                  </div>
                  <div className="course_info-item">
                    <label>讲师</label>
                    <span>{selectedCourse.teacher}</span>
                  </div>
                  <div className="course_info-item">
                    <label>讲师</label>
                    <span>{selectedCourse.teacher}</span>
                  </div>
                  <div className="course_info-item">
                    <label>讲师</label>
                    <span>{selectedCourse.teacher}</span>
                  </div>
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
                    <Select defaultValue="all">
                      <Option key="all" value="all">
                        培训类型
                      </Option>
                      <Option key="外训" value="外训">
                        外训
                      </Option>
                      <Option key="内训" value="内训">
                        内训
                      </Option>
                      <Option key="外聘内训" value="外聘内训">
                        外聘内训
                      </Option>
                    </Select>
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
                  </header>
                }
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
        <Modal
          visible={this.state.applyByUnexistCourseVisible}
          title="自定义课程申请"
          width="50%"
          onCancel={this.closeModal}
          footer={null}
        >
          <SelfDefineCourseForm
            closeModal={this.closeModal}
            onSubmit={this.submitSelfDefineCourse}
          />
        </Modal>
      </div>
    );
  }
}

export default EmployeeApplyCourse;
