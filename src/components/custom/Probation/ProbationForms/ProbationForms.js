import React from 'react';
import EmployeeInformation from '../components/EmployeeInformation';
import ProbationObjectives from '../components/ProbationObjectives';
import OrientationTraining from '../components/OrientationTraining';
import InternalTraining from '../components/InternalTraining';
import OnTheJobTraining from '../components/OnTheJobTraining';
import MentorshipRecord from '../components/MentorshipRecord';
import IndividualSummary from '../components/IndividualSummary';
import {
  Button,
  Anchor,
  Icon,
  message,
  Spin,
  Modal,
  Select,
  Row,
  Col,
  DatePicker
} from 'antd';
import http from 'Util20/api';
import './ProbationForms.less';
import moment from 'moment';

const { Link } = Anchor;
const { Option } = Select;
const resid1 = '618591396440'; //新员工个人信息表
const resid2 = '618591416723'; //工作目标表
const resid3 = '618591427140'; //入职培训表
const resid4 = '618591437750'; //内训课程上课记录表
const resid5 = '618591446269'; //在岗培训表
const resid6 = '618591459355'; //辅导记录表
const resid7 = '618591476071'; //个人总结表
const resid8 = '619268906732'; //评估周期

const internalCourse = '616155060405'; //内训课程表

class ProbationForms extends React.Component {
  state = {
    employeeInformation: {}, //个人信息
    probationObjectives: [], //工作目标
    orientationTraining: [], //入职培训
    internalTraining: [], //内训课程
    onTheJobTraining: [], //在岗培训
    mentorshipRecord: [], //辅导记录

    addInternalCourseData: {}, //添加用到的内训课程数据
    modifyInternalCourseData: {}, //修改用到的内训课程数据

    assessmentCycle: [], //评估周期
    internalCourses: [], //内训课程

    loading: false,
    addOnJobTrainingVisible: false,
    addInternalCourseVisible: false,
    modifyInternalCourseVisible: false
  };
  async componentDidMount() {
    this.setState({ loading: true });
    await this.getRecords();
    await this.getCircle();
    this.getInternalCourses();
    this.setState({ loading: false });
  }

  handleSubmit = async () => {
    try {
      let subdata = [];
      this.setState({ loading: true });
      let {
        employeeInformation,
        probationObjectives,
        orientationTraining,
        internalTraining,
        onTheJobTraining,
        mentorshipRecord
      } = this.state;
      let index = 1;
      probationObjectives.forEach(item => {
        subdata.push({
          resid: resid2,
          maindata: {
            ...item,
            _state: 'editoradd',
            _id: index++
          }
        });
      });
      orientationTraining.forEach(item => {
        subdata.push({
          resid: resid3,
          maindata: { ...item, _state: 'editoradd', _id: index++ }
        });
      });
      internalTraining.forEach(item => {
        subdata.push({
          resid: resid4,
          maindata: { ...item, _state: 'editoradd', _id: index++ }
        });
      });
      onTheJobTraining.forEach(item => {
        subdata.push({
          resid: resid5,
          maindata: { ...item, _state: 'editoradd', _id: index++ }
        });
      });
      mentorshipRecord.forEach(item => {
        subdata.push({
          resid: resid6,
          maindata: { ...item, _state: 'editoradd', _id: index++ }
        });
      });
      await http().saveRecordAndSubTables({
        data: [
          {
            resid: resid1,
            maindata: {
              ...employeeInformation,
              _state: 'modified',
              _id: 1
            },
            subdata
          }
        ]
      });
      this.setState({ loading: false });
      this.props.setIsShowTable(true);
      message.success('提交成功');
    } catch (error) {
      message.error(error.message);
      console.log(error);
      this.setState({ loading: false });
    }
  };
  //获取主子表记录
  getRecords = async () => {
    try {
      const res = await http().getRecordAndSubTables({
        resid: resid1,
        subresid: `${resid2},${resid3},${resid4},${resid5},${resid6},${resid7},`
      });
      const data = res.data[0];
      this.setState({
        employeeInformation: data,
        probationObjectives: data[resid2],
        orientationTraining: data[resid3],
        internalTraining: data[resid4],
        OnTheJobTraining: data[resid5],
        mentorshipRecord: data[resid6]
      });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  getInternalCourses = async () => {
    try {
      let res = await http().getTable({
        resid: internalCourse
      });
      this.setState({ internalCourses: res.data });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };
  //获取评估周期
  getCircle = async () => {
    try {
      const res = await http().getTable({
        resid: resid8
      });
      this.setState({ assessmentCycle: res.data.map(item => item.assess) });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  //添加目标
  addObjective = () => {
    const probationObjectives = [...this.state.probationObjectives, {}];
    this.setState({ probationObjectives });
  };
  //删除目标
  removeObjective = index => {
    let probationObjectives = [...this.state.probationObjectives];
    if (probationObjectives[index].REC_ID) {
      try {
        http().removeRecords({
          resid: resid2,
          data: [{ REC_ID: probationObjectives[index].REC_ID }]
        });
      } catch (error) {
        message.error(error.message);
        console.log(error);
      }
    }
    probationObjectives.splice(index, 1);
    this.setState({ probationObjectives });
  };
  //修改目标
  modifyObjective = (index, objective) => {
    const probationObjectives = [...this.state.probationObjectives];
    probationObjectives[index] = objective;
    this.setState({ probationObjectives });
  };

  //添加辅导记录
  addMentor = () => {
    const mentorshipRecord = [...this.state.mentorshipRecord, {}];
    this.setState({ mentorshipRecord });
  };

  //删除辅导记录
  removeMentor = index => {
    let mentorshipRecord = [...this.state.mentorshipRecord];
    if (mentorshipRecord[index].REC_ID) {
      try {
        http().removeRecords({
          resid: resid6,
          data: [{ REC_ID: mentorshipRecord[index].REC_ID }]
        });
      } catch (error) {
        message.error(error.message);
        console.log(error);
      }
    }
    mentorshipRecord.splice(index, 1);
    this.setState({ mentorshipRecord });
  };

  //修改辅导记录
  modifyMentor = (index, mentor) => {
    const mentorshipRecord = [...this.state.mentorshipRecord];
    mentorshipRecord[index] = mentor;
    this.setState({ mentorshipRecord });
  };

  //个人总结内容变化
  summaryChange = summary => {
    this.setState({
      employeeInformation: {
        ...this.state.employeeInformation,
        smmary: summary
      }
    });
  };

  //添加内训课程
  addInternalCourse = async () => {
    try {
      let res = await http().addRecords({
        resid: resid4,
        data: [
          {
            courseId: this.state.addInternalCourseData.courseId,
            menberId: this.state.employeeInformation.memberId,
            trainDate: this.state.addInternalCourseData.trainDate,
            trainer: this.state.addInternalCourseData.teacher
          }
        ]
      });
      this.setAddInternalCourseVisible(false);
      this.setState({
        internalTraining: [...this.state.internalTraining, res.data[0]],
        addInternalCourseData: {}
      });
      message.success('添加成功');
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  //删除内训课程
  deleteInternalCourse = async REC_ID => {
    try {
      http().removeRecords({
        resid: resid4,
        data: [{ REC_ID }]
      });
      const internalTraining = this.state.internalTraining.filter(item => {
        return item.REC_ID !== REC_ID;
      });
      this.setState({
        internalTraining
      });
      message.success('删除成功');
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };
  //修改内训课程
  modifyInternalCourse = async () => {
    try {
      let res = await http().modifyRecords({
        resid: resid4,
        data: [{ ...this.state.modifyInternalCourseData }]
      });
      const internalTraining = this.state.internalTraining;
      let index = this.state.internalTraining.findIndex(item => {
        return item.REC_ID === res.data[0].REC_ID;
      });
      console.log(index);
      internalTraining[index] = res.data[0];
      this.setState({
        internalTraining,
        modifyInternalCourseVisible: false
      });
      message.success('修改成功');
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  //控制添加显示模态窗状态
  setAddOnJobTrainingVisible = visible =>
    this.setState({
      addOnJobTrainingVisible: visible
    });

  //控制修改内训课程模态窗状态
  setModifyInternalCourseVisible = visible =>
    this.setState({
      modifyInternalCourseVisible: visible
    });
  //控制添加内训课程模态窗状态
  setAddInternalCourseVisible = visible =>
    this.setState({
      addInternalCourseVisible: visible
    });

  openModifyInternalCourseModal = data => {
    this.setState({
      modifyInternalCourseVisible: true,
      modifyInternalCourseData: data
    });
  };

  render() {
    const { roleName } = this.props;
    const { loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div id="probation-forms">
          <div className="probation-forms_goback" onClick={this.props.goBack}>
            <Icon type="rollback" style={{ color: '#999' }} />
          </div>
          <header>
            <h1>新员工试用期考核表</h1>
            <p>New Employee Probation Appraisal Form</p>
          </header>
          <main className="probation-forms_main">
            <div className="probation-forms_main_tables">
              <EmployeeInformation
                employeeInformation={this.state.employeeInformation}
              />
              <ProbationObjectives
                probationObjectives={this.state.probationObjectives}
                addObjective={this.addObjective}
                removeObjective={this.removeObjective}
                modifyObjective={this.modifyObjective}
                assessmentCycle={this.state.assessmentCycle}
              />
              <OrientationTraining
                orientationTraining={this.state.orientationTraining}
              />
              <InternalTraining
                setAddInternalCourseVisible={this.setAddInternalCourseVisible}
                internalTraining={this.state.internalTraining.map(
                  (item, index) => ({ ...item, no: index + 1 })
                )}
                deleteInternalCourse={this.deleteInternalCourse}
                openModifyInternalCourseModal={
                  this.openModifyInternalCourseModal
                }
              />
              <OnTheJobTraining
                onTheJobTraining={this.state.onTheJobTraining}
                setAddOnJobTrainingVisible={this.setAddOnJobTrainingVisible}
              />
              <MentorshipRecord
                mentorshipRecord={this.state.mentorshipRecord}
                addMentor={this.addMentor}
                removeMentor={this.removeMentor}
                modifyMentor={this.modifyMentor}
              />
              <IndividualSummary
                summary={this.state.employeeInformation.smmary}
                summaryChange={this.summaryChange}
              />
            </div>
            <aside className="probation-forms_main_sider">
              <Anchor bounds={15}>
                <Link href="#employee-imformation" title="个人信息" />
                <Link href="#probation-objectives" title="试用期工作目标" />
                <Link href="#orientation-training" title="入职培训（必修）" />
                <Link href="#internal-training" title="内训课程" />
                <Link href="#on-the-job-training" title="在岗培训" />
                <Link href="#mentorshi-record" title="辅导记录" />
                <Link href="#individual-summary" title="试用期个人小结" />
              </Anchor>
            </aside>
          </main>
          <footer style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="primary"
              style={{ marginRight: 16 }}
              onClick={this.handleSubmit}
            >
              提交
            </Button>
            {roleName === '主管' && (
              <React.Fragment>
                <Button type="primary" style={{ marginRight: 16 }}>
                  同意转正
                </Button>
                <Button type="danger" style={{ marginRight: 16 }}>
                  不同意转正
                </Button>
              </React.Fragment>
            )}
          </footer>
        </div>
        <Modal
          title="添加内训课程"
          visible={this.state.addInternalCourseVisible}
          onCancel={() => this.setAddInternalCourseVisible(false)}
          onOk={() => {
            this.addInternalCourse();
          }}
          destroyOnClose
          okText="添加"
        >
          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              课程:
            </Col>
            <Col span={12}>
              <Select
                showSearch
                style={{ width: 300 }}
                placeholder="请选择课程"
                optionFilterProp="children"
                onSearch={val => {}}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.state.internalCourses.map(item => (
                  <Option
                    value={item.C3_609845305868}
                    key={item.C3_609845305868}
                    onClick={() => {
                      this.setState({
                        addInternalCourseData: {
                          ...this.state.addInternalCourseData,
                          courseId: item.C3_609845305868,
                          teacher: item.C3_610390419677
                        }
                      });
                    }}
                  >
                    {item.C3_609845305680}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              培训师:
            </Col>
            <Col span={12}>{this.state.addInternalCourseData.teacher}</Col>
          </Row>
          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              培训日期:
            </Col>
            <Col span={12}>
              <DatePicker
                showTime
                onChange={val => {
                  console.log(val.format('YYYY-MM-DD HH:mm:ss'));
                  this.setState({
                    addInternalCourseData: {
                      ...this.state.addInternalCourseData,
                      trainDate: val.format('YYYY-MM-DD HH:mm:ss')
                    }
                  });
                }}
              />
            </Col>
          </Row>
        </Modal>
        <Modal
          title="修改内训课程"
          visible={this.state.modifyInternalCourseVisible}
          onCancel={() => this.setModifyInternalCourseVisible(false)}
          onOk={() => {
            this.modifyInternalCourse();
          }}
          destroyOnClose
          okText="修改"
        >
          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              课程:
            </Col>
            <Col span={12}>
              <Select
                showSearch
                style={{ width: 300 }}
                placeholder="请选择课程"
                optionFilterProp="children"
                onSearch={val => {}}
                value={this.state.modifyInternalCourseData.courseId}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.state.internalCourses.map(item => (
                  <Option
                    value={item.C3_609845305868}
                    key={item.C3_609845305868}
                    onClick={() => {
                      this.setState({
                        modifyInternalCourseData: {
                          ...this.state.modifyInternalCourseData,
                          courseId: item.C3_609845305868,
                          trainer: item.C3_610390419677
                        }
                      });
                    }}
                  >
                    {item.C3_609845305680}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              培训师:
            </Col>
            <Col span={12}>{this.state.modifyInternalCourseData.trainer}</Col>
          </Row>
          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              培训日期:
            </Col>
            <Col span={12}>
              <DatePicker
                showTime
                value={
                  this.state.modifyInternalCourseData.trainDate
                    ? moment(this.state.modifyInternalCourseData.trainDate)
                    : undefined
                }
                onChange={val => {
                  this.setState({
                    modifyInternalCourseData: {
                      ...this.state.modifyInternalCourseData,
                      trainDate: val.format('YYYY-MM-DD HH:mm:ss')
                    }
                  });
                }}
              />
            </Col>
          </Row>
        </Modal>
        <Modal
          title="添加在岗培训课程"
          visible={this.state.addOnJobTrainingVisible}
          onCancel={() => this.setAddOnJobTrainingVisible(false)}
          onOk={() => this.setAddOnJobTrainingVisible(false)}
          destroyOnClose
          okText="添加"
        >
          <Row>
            <Col span={4} offset={4}>
              课程
            </Col>
            <Col span={12}>
              <Select
                showSearch
                style={{ width: 300 }}
                placeholder="请选择课程"
                optionFilterProp="children"
                onChange={val => {}}
                onSearch={val => {}}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.state.internalCourses.map(item => (
                  <Option value={item.C3_609845305680} key={item.REC_ID}>
                    {item.C3_609845305680}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row>
            <Col span={4} offset={4}>
              培训师
            </Col>
            <Col span={12}></Col>
          </Row>
          <Row>
            <Col span={4} offset={4}>
              培训日期
            </Col>
            <Col span={12}>
              <DatePicker showTime />
            </Col>
          </Row>
        </Modal>
      </Spin>
    );
  }
}

export default ProbationForms;
