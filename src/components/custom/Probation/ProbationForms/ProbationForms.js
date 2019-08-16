import React from 'react';
import EmployeeInformation from '../components/EmployeeInformation';
import ProbationObjectives from '../components/ProbationObjectives';
import OrientationTraining from '../components/OrientationTraining';
import InternalTraining from '../components/InternalTraining';
import OnTheJobTraining from '../components/OnTheJobTraining';
import MentorshipRecord from '../components/MentorshipRecord';
import IndividualSummary from '../components/IndividualSummary';
import { Button, Anchor, Icon, message } from 'antd';
import http from 'Util20/api';
import './ProbationForms.less';

const { Link } = Anchor;
const resid1 = '618591396440'; //新员工个人信息表
const resid2 = '618591416723'; //工作目标表
const resid3 = '618591427140'; //入职培训表
const resid4 = '618591437750'; //内训课程表
const resid5 = '618591446269'; //在岗培训表
const resid6 = '618591459355'; //辅导记录表
const resid7 = '618591476071'; //个人总结表
const resid8 = '619268906732'; //评估周期

class ProbationForms extends React.Component {
  state = {
    employeeInformation: {}, //个人信息
    probationObjectives: [], //工作目标
    orientationTraining: [], //入职培训
    internalTraining: [], //内训课程
    onTheJobTraining: [], //在岗培训
    mentorshipRecord: [], //辅导记录

    assessmentCycle: [] //评估周期
  };
  componentDidMount() {
    this.getRecords();
    this.getCircle();
  }

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
    mentorshipRecord.splice(index, 1);
    this.setState({ mentorshipRecord });
  };
  //修改辅导记录
  modifyMentor = (index, mentor) => {
    const mentorshipRecord = [...this.state.mentorshipRecord];
    mentorshipRecord[index] = mentor;
    this.setState({ mentorshipRecord });
  };

  summaryChange = summary => {
    this.setState({
      employeeInformation: {
        ...this.state.employeeInformation,
        smmary: summary
      }
    });
  };
  render() {
    const { roleName } = this.props;
    return (
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
            <OrientationTraining />
            <InternalTraining />
            <OnTheJobTraining />
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
          <Button type="primary" style={{ marginRight: 16 }}>
            提交
          </Button>
          <Button type="primary" style={{ marginRight: 16 }}>
            同意转正
          </Button>
          <Button type="danger" style={{ marginRight: 16 }}>
            不同意转正
          </Button>
        </footer>
      </div>
    );
  }
}

export default ProbationForms;
