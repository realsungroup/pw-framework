import React from 'react';
import EmployeeInformation from '../components/EmployeeInformation';
import ProbationObjectives from '../components/ProbationObjectives';
import OrientationTraining from '../components/OrientationTraining';
import InternalTraining from '../components/InternalTraining';
import OnTheJobTraining from '../components/OnTheJobTraining';
import MentorshipRecord from '../components/MentorshipRecord';
import IndividualSummary from '../components/IndividualSummary';
import TableData from '../../../common/data/TableData';
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
  DatePicker,
  Input,
  Popconfirm
} from 'antd';
import http from 'Util20/api';
import { getItem } from 'Util20/util';
import './ProbationForms.less';
import moment from 'moment';

const { Link } = Anchor;
const { Option } = Select;
const { confirm } = Modal;

const resid1 = '619694861346'; //新员工个人信息表
const resid2 = '618591416723'; //工作目标表
const resid3 = '618591427140'; //入职培训表
const resid4 = '619640552055'; //内训课程上课记录表
const resid5 = '618591446269'; //在岗培训表
const resid6 = '618591459355'; //辅导记录表
const resid8 = '619268906732'; //评估周期
const resid9 = '619808533610';
// const resid10 = '622983009643'; //入职培训管理表

const internalCourse = '616155060405'; //内训课程表
const tutorshipResid = '619281130628'; //辅导员表
const authResid = '619703562233';

class ProbationForms extends React.Component {
  state = {
    flagHitBack:false,
    flagAlreadyHit:0,
    employeeInformation: {}, //个人信息
    probationObjectives: [], //工作目标
    orientationTraining: [], //入职培训
    internalTraining: [], //内训课程
    onTheJobTraining: [], //在岗培训
    mentorshipRecord: [], //辅导记录
    addInternalCourseData: {}, //添加用到的内训课程数据
    modifyInternalCourseData: {}, //修改用到的内训课程数据
    addOnJobTrainingData: {}, //添加用到的在岗培训数据
    modifyOnJobTrainingData: {}, //修改用到的在岗培训数据
    addProbationObjective: {
      objective: '', //目标内容
      quota: '' //结果指标
    }, //添加工作目标用到的数据
    modifyProbationObjectiveData: {}, //修改工作目标用到的数据
    modifyProbationObjectiveIndex: undefined, //修改的工作目标的下标
    assessmentCycle: [], //评估周期
    internalCourses: [], //内训课程
    tutorships: [], //辅导员
    viewableTable: {
      objectiveResid: undefined, //工作目标表
      mentorRecordResid: undefined, //辅导记录表
      orientationResid: undefined, //入职培训表
      internalResid: undefined, // 内训课程表
      onJobResid: undefined //在岗培训表
    },
    tableAuth: {
      objective: {}, //工作目标表权限
      mentorRecord: {}, //辅导记录表权限
      orientation: {}, //入职培训表权限
      internal: {}, // 内训课程表权限
      onJob: {} //在岗培训表权限
    },
    trainerData: [],
    loading: false,
    addOnJobTrainingVisible: false,
    addInternalCourseVisible: false,
    modifyInternalCourseVisible: false,
    modifyOnJobTrainingVisible: false,
    modifyProbationObjectiveVisible: false,
  };
  async componentDidMount() {
    this.setState({ loading: true });
    let memberId;
    if (this.props.roleName === '员工') {
      memberId = JSON.parse(getItem('userInfo')).UserInfo.EMP_USERCODE;
    } else {
      memberId = this.props.memberId;
    }
    await this.getAuth();
    await this.getRecords(memberId);
    await this.getCircle();
    this.getInternalCourses();
    // this.getTutorships();
    this.setState({ loading: false });
    this.getOrientationTraining();
  }

  //申请转正
  positiveApply = async () => {
    try {
      this.setState({ loading: true });
      await http().modifyRecords({
        resid: resid1,
        data: [
          {
            REC_ID: this.state.employeeInformation.REC_ID,
            C3_622649502021: 'Y'
          }
        ]
      });
      message.success('转正申请成功');
    } catch (error) {
      message.error(error.message);
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  };

  // 同意辅导员申请
    agreeApply=async()=>{
      this.setState({ loading: true });
      try {
        let res = await http().modifyRecords({
          resid: resid1,
          data:[{
            REC_ID: this.state.employeeInformation.REC_ID,
            instructorIsPass:'Y'

          }]
        });
        this.setState({ loading: false ,flagAlreadyHit:1});
        var memID=this.state.employeeInformation.instructorDirectorId;
        var dept;
        var userID;
        var userMemberId;
        var toAdd;
        var name;
        let res2 = await http().getTable({
          resid:'609599795438',
          cmswhere: `C3_305737857578 = '${memID}'`
        });
        dept=res2.data[0].C3_422840479020||res2.data[0].C3_422840472843||res2.data[0].C3_422840463535||res2.data[0].C3_422840460773;
        userID=res2.data[0].C3_227192472953;
        userMemberId=res2.data[0].C3_305737857578;
        name=res2.data[0].C3_227192484125;
        toAdd=[{
          dept:dept,
          userID:userID,
          userMemberId:userMemberId,
          name:name,
        }]

        let res3 = await http().getTable({
          resid:'619281130628',
          cmswhere:`userMemberId = '${memID}'`
        })
        if(res3.data.length==0){
          let res4 = await http().addRecords({
            resid:'619281130628',
            data:toAdd
          })
        }

        // 辅导员表ID619281130628

        // 辅导员工号C3_227192472953

        // 辅导员人员编号C3_305737857578

        // 辅导员部门C3_422840479020

        //辅导员姓名C3_227192484125
        message.success('成功同意辅导员');

      } catch (error) {
        this.setState({ loading: false });
        message.error(error.message);
        console.log(error);

      }
    }
  // 不同意辅导员申请
  disagreeApply=async()=>{
    this.setState({ loading: true });
    try {
      let res = await http().modifyRecords({
        resid: resid1,
        data:[{REC_ID: this.state.employeeInformation.REC_ID,instructorIsPass:'N'}]
      });
      this.setState({ loading: false ,flagAlreadyHit:2});
      message.success('成功驳回辅导员');

    } catch (error) {
      this.setState({ loading: false });
      message.error(error.message);
      console.log(error);

    }
  }
  // 点击保存
  handleSubmit = async (chara) => {
    // console.log(this.state.employeeInformation.instructorDirectorId,this.state.employeeInformation.instructorDirectorName)
    // console.log(this.state.employeeInformation.instructorID,this.state.employeeInformation.instructor)

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
          },
          subData: item[resid9].map(i => {
            return {
              resid: resid9,
              maindata: {
                ...i,
                _state: 'editoradd',
                _id: index++
              }
            };
          })
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
      if (this.props.roleName !== '员工') {
        this.props.setIsShowTable(true);
      }
      await http().modifyRecords({
        resid: resid1,
        data:[{REC_ID: this.state.employeeInformation.REC_ID,instructorIsPass:''}]
      });
      if(chara=="主管"){
        this.setState({
          employeeInformation: {
            ...this.state.employeeInformation,
            instructorIsPass:'0',
          },
          flagAlreadyHit:0

        });
      }
      message.success('提交成功');
    } catch (error) {
      message.error(error.message);
      console.log(error);
      this.setState({ loading: false });
    }
  };
  getAuth = async () => {
    let { viewableTable } = this.state;
    try {
      let res = await http().getTable({
        resid: authResid,
        cmswhere: `roleType = '${this.props.roleName}'`
      });
      let data = {};
      res.data.forEach(item => {
        switch (item.resourceType) {
          case '工作目标':
            data.objectiveResid = item.resourceID;
            break;
          case '入职培训':
            data.orientationResid = item.resourceID;
            break;
          case '内训课程':
            data.internalResid = item.resourceID;
            break;
          case '在岗培训':
            data.onJobResid = item.resourceID;
            break;
          case '辅导记录':
            data.mentorRecordResid = item.resourceID;
            break;
          default:
            break;
        }
      });
      this.setState({
        viewableTable: {
          ...viewableTable,
          ...data
        }
      });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };
  //获取主子表记录
  getRecords = async memberId => {
    try {
      const { viewableTable } = this.state;
      let subresid = '';
      Object.keys(viewableTable).forEach(item => {
        if (viewableTable[item]) {
          subresid += viewableTable[item] + ',';
        }
      });
      subresid += resid9;
      const res = await http().getRecordAndSubTables({
        resid: resid1,
        // subresid: `${resid2},${resid3},${resid4},${resid5},${resid6},`,
        subresid,
        cmswhere: `memberId = '${memberId}'`,
        getsubresource: 1
      });
      const SubResource = res.SubResource;
      const data = res.data[0];
      console.log(res)

      data &&
        this.setState({
          employeeInformation: data,
          probationObjectives: data[viewableTable.objectiveResid],
          // orientationTraining: data[viewableTable.orientationResid],
          internalTraining: data[viewableTable.internalResid],
          onTheJobTraining: data[viewableTable.onJobResid],
          mentorshipRecord: data[viewableTable.mentorRecordResid],
          tableAuth: {
            onJob: SubResource[viewableTable.onJobResid],
            mentorRecord: SubResource[viewableTable.mentorRecordResid],
            objective: SubResource[viewableTable.objectiveResid],
            internal: SubResource[viewableTable.internalResid]
          }
        });
        if(data.instructorDirectorName){
          this.setState({
            employeeInformation: {
              ...this.state.employeeInformation,
              isSemi:true,
            },
            flagHitBack:true
          });
        }else{
          this.setState({
            employeeInformation: {
              ...this.state.employeeInformation,
              isSemi:false,
            }
          });
        }
        if(data.instructorIsPass=='Y'){
          this.setState({flagAlreadyHit:1});
        }else if(data.instructorIsPass=='N'){
          this.setState({flagAlreadyHit:2});
        }else{
          this.setState({flagAlreadyHit:0});

        }

    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  //获取内训课程
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


  //获取入职培训表数据
  getOrientationTraining = async () => {
    try {
      let res = await http().getTable({
        resid: resid3,
        // cmswhere:`menberId ='${memberId}'`
      });
      this.setState({ orientationTraining: res.data})
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
  //获取辅导员
  // getTutorships = async () => {
  //   try {
  //     const res = await http().getTable({
  //       resid: tutorshipResid
  //     });
  //     this.setState({ tutorships: res.data });
  //   } catch (error) {
  //     message.error(error.message);
  //     console.log(error);
  //   }
  // };

  //根据工号搜索培训师
  fetchUser = async value => {
    this.setState({ trainerData: [], fetching: true });
    try {
      const res = await http().getTable({
        resid: '609599795438',
        cmswhere: `C3_227192472953 = '${value}'`
      });
      const trainerData = res.data.map(user => ({
        label: `${user.C3_227192484125}`,
        key: user.C3_305737857578
      }));

      this.setState({
        trainerData
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    } finally {
      this.setState({ fetching: false });
    }
  };

  //添加目标
  addObjective = () => {
    const memberId = this.state.employeeInformation.memberId;
    const assessmentCycle = this.state.assessmentCycle;
    let subData = [];
    assessmentCycle.forEach(item => {
      subData.push({
        period: item,
        memberId
      });
    });
    const probationObjectives = [
      ...this.state.probationObjectives,
      { [resid9]: subData }
    ];
    this.setState({ probationObjectives, addProbationObjective: {} });
    message.success('已添加，不要忘记点下方保存哦');
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
    message.success('已删除');
  };
  //修改目标
  modifyObjective = (index, data) => {
    const probationObjectives = [...this.state.probationObjectives];
    probationObjectives[index] = data;
    this.setState({
      probationObjectives,
      modifyProbationObjectiveVisible: false,
      modifyProbationObjectiveData: {},
      modifyProbationObjectiveIndex: undefined
    });
    // message.success('已修改，不要忘记点下方保存哦');
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

  //确认辅导记录
  confirmMentor = async index => {
    try {
      const mentorshipRecord = [...this.state.mentorshipRecord];
      await http().modifyRecords({
        resid: resid6,
        data: [
          {
            ...mentorshipRecord[index],
            isConfirm: 'Y'
          }
        ]
      });
      mentorshipRecord[index].isConfirm = 'Y';
      this.setState({ mentorshipRecord });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  //处理工作目标内容变化
  handleObjectvieChange = ({ objective, quota }) => {
    this.setState({
      addProbationObjective: {
        objective,
        quota
      }
    });
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

  //分配辅导员
  setTutorship = ({ name, userMemberId },bol) => {

    this.setState({
      employeeInformation: {
        ...this.state.employeeInformation,
        instructorID: userMemberId,
        instructor: name,
        instructorDirectorName:undefined,
        instructorDirectorId:undefined
      }
    });
  };

  setTutorshipSemi = ({ name, userMemberId },bol) => {
    this.setState({
      employeeInformation: {
        ...this.state.employeeInformation,
        instructorDirectorId: userMemberId,
        instructorDirectorName: name,
        instructorID: undefined,
        instructor: undefined,
      }
    });
  };

  isSemi=(v)=>{
    this.setState({
      employeeInformation: {
        ...this.state.employeeInformation,
        isSemi:v
      }
    });
  }
  //添加内训课程
  addInternalCourse = async () => {
    try {
      let res = await http().addRecords({
        resid: resid4,
        data: [
          {
            C3_614182469763: this.state.addInternalCourseData.courseId,
            C3_613941384832: this.state.employeeInformation.memberId,
            C3_615393041304: this.state.addInternalCourseData.trainDate,
            C3_613941386081: this.state.addInternalCourseData.teacher
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
  //添加在岗培训课程
  addOnJobTraining = async () => {
    try {
      let res = await http().addRecords({
        resid: resid5,
        data: [
          {
            ...this.state.addOnJobTrainingData,
            memberId: this.state.employeeInformation.memberId
          }
        ]
      });
      this.setAddOnJobTrainingVisible(false);
      this.setState({
        onTheJobTraining: [...this.state.onTheJobTraining, res.data[0]],
        addOnJobTrainingData: {}
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
  //删除在岗培训
  deleteOnJobTraining = async REC_ID => {
    try {
      http().removeRecords({
        resid: resid5,
        data: [{ REC_ID }]
      });
      const onTheJobTraining = this.state.onTheJobTraining.filter(item => {
        return item.REC_ID !== REC_ID;
      });
      this.setState({
        onTheJobTraining
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
      const { internalTraining } = this.state;
      const index = internalTraining.findIndex(item => {
        return item.REC_ID === res.data[0].REC_ID;
      });
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
  //修改在岗培训
  modifyOnJobTraining = async () => {
    try {
      let res = await http().modifyRecords({
        resid: resid5,
        data: [{ ...this.state.modifyOnJobTrainingData }]
      });
      const { onTheJobTraining } = this.state;
      const index = onTheJobTraining.findIndex(item => {
        return item.REC_ID === res.data[0].REC_ID;
      });
      onTheJobTraining[index] = res.data[0];
      this.setState({
        onTheJobTraining,
        modifyOnJobTrainingVisible: false
      });
      message.success('修改成功');
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  //控制添加在岗培训显示模态窗状态
  setAddOnJobTrainingVisible = visible =>
    this.setState({
      addOnJobTrainingVisible: visible
    });
  //控制修改在岗培训显示模态窗状态
  setModifyOnJobTrainingVisible = visible =>
    this.setState({
      modifyOnJobTrainingVisible: visible
    });
  //控制修改工作目标显示模态窗状态
  setModifyProbationObjectiveVisible = visible =>
    this.setState({
      modifyProbationObjectiveVisible: visible
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

  openModifyProbationObjectiveModal = (data, index) => {
    this.setState({
      modifyProbationObjectiveVisible: true,
      modifyProbationObjectiveData: data,
      modifyProbationObjectiveIndex: index
    });
  };

  openModifyOnJobTrainingModal = data => {
    this.setState({
      modifyOnJobTrainingVisible: true,
      modifyOnJobTrainingData: data
    });
  };

  //是否同意转正
  isAgree = isAgree => {
    confirm({
      title: isAgree ? '确认同意转正?' : '确认不同意转正?',
      onOk: async () => {
        try {
          let data;
          if (this.props.roleName === '主管') {
            data = [
              {
                REC_ID: this.state.employeeInformation.REC_ID,
                isRegular: isAgree ? 'Y' : 'N'
              }
            ];
          }
          if (this.props.roleName === '经理') {
            data = [
              {
                REC_ID: this.state.employeeInformation.REC_ID,
                isManagerRegular: isAgree ? 'Y' : 'N'
              }
            ];
          }
          await http().modifyRecords({
            resid: resid1,
            data
          });
          message.success('操作成功');
          this.props.goBack();
        } catch (error) {
          message.error(error.message);
          console.log(error);
        }
      },
      onCancel() {}
    });
  };

  //邀请培训师确认
  inviteConfirm = async data => {
    this.setState({ loading: true });
    try {
      await http().modifyRecords({
        resid: resid5,
        data: [data]
      });
      message.success('已邀请');
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
    this.setState({ loading: false });
  };

  render() {
    const { roleName } = this.props;
    const { loading, employeeInformation } = this.state;
    const editable = employeeInformation.regStatus === '待转正';
    return (
      <Spin spinning={loading}>
        <div id="probation-forms">
          {this.props.roleName !== '员工' && (
            <div className="probation-forms_goback" onClick={this.props.goBack}>
              <Icon type="rollback" style={{ color: '#999' }} />
            </div>
          )}
          <header>
            <h1>新员工试用期考核表</h1>
            <p>New Employee Probation Appraisal Form</p>
          </header>
          <main className="probation-forms_main">
            <div className="probation-forms_main_tables">
              <EmployeeInformation
                employeeInformation={employeeInformation}
                tutorships={this.state.tutorships}
                setTutorship={this.setTutorship}
                setTutorshipSemi={this.setTutorshipSemi}
                isSemi={this.isSemi}
                roleName={roleName}
                editable={editable}
              />
              <ProbationObjectives
                probationObjectives={this.state.probationObjectives}
                addObjective={this.addObjective}
                removeObjective={this.removeObjective}
                modifyObjective={this.modifyObjective}
                roleName={roleName}
                openModifyProbationObjectiveModal={
                  this.openModifyProbationObjectiveModal
                }
                auth={this.state.tableAuth.objective}
                editable={editable}
              />
              <OrientationTraining
                orientationTraining={this.state.orientationTraining.map(
                  (item, index) => ({ ...item, no: index + 1 })
                )
              }
                roleName={roleName}
                editable={editable}
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
                roleName={roleName}
                auth={this.state.tableAuth.internal}
                editable={editable}
              />
              <OnTheJobTraining
                onTheJobTraining={this.state.onTheJobTraining.map(
                  (item, index) => ({ ...item, no: index + 1 })
                )}
                setAddOnJobTrainingVisible={this.setAddOnJobTrainingVisible}
                deleteOnJobTraining={this.deleteOnJobTraining}
                openModifyOnJobTrainingModal={this.openModifyOnJobTrainingModal}
                roleName={roleName}
                auth={this.state.tableAuth.onJob}
                inviteConfirm={this.inviteConfirm}
                editable={editable}
              />
              <MentorshipRecord
                mentorshipRecord={this.state.mentorshipRecord}
                addMentor={this.addMentor}
                removeMentor={this.removeMentor}
                modifyMentor={this.modifyMentor}
                confirmMentor={this.confirmMentor}
                roleName={roleName}
                auth={this.state.tableAuth.mentorRecord}
                editable={editable}
              />
              <IndividualSummary
                summary={employeeInformation.smmary}
                summaryChange={this.summaryChange}
                roleName={roleName}
                editable={editable}
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
          {!loading &&
            (roleName === 'HR' ||
              employeeInformation.regStatus !== '已转正') && (
              <footer className="probation-forms_footer">
                {(roleName === 'HR' ||
                  employeeInformation.regStatus === '待转正') && (
                  <div>
                  <Button
                    type="primary"
                    style={{ marginRight: 16 }}
                    onClick={()=>{this.handleSubmit(roleName)}}
                  >
                    保存
                  </Button>
                  {(roleName==='HR')&&(this.state.flagHitBack==true)&&(this.state.flagAlreadyHit==0)?(<span><Button style={{marginRight:'8px'}} onClick={this.agreeApply}>同意自定义辅导员</Button><Button onClick={this.disagreeApply} type='danger'>
                    驳回自定义辅导员
                  </Button>
                  </span>):''}
                  {<span style={{color:'red'}}>{this.state.flagAlreadyHit==2?'该记录的自定义辅导员申请已经驳回':''}</span>}
                  </div>
                )}
                {roleName === '员工' &&
                  employeeInformation.regStatus === '待转正' && (
                    <Popconfirm
                      title="确认提交转正申请？"
                      onConfirm={this.positiveApply}
                    >
                      <Button type="primary" style={{ marginRight: 16 }}>
                        申请转正
                      </Button>
                    </Popconfirm>
                  )}
                {employeeInformation.regStatus === '转正中' &&
                  ((roleName === '主管' &&
                    employeeInformation.isRegular !== 'Y') ||
                    (roleName === '经理' &&
                      employeeInformation.isManagerRegular !== 'Y')) && (
                    <React.Fragment>
                      <Button
                        type="primary"
                        style={{ marginRight: 16 }}
                        onClick={() => this.isAgree(true)}
                      >
                        同意转正
                      </Button>
                      <Button
                        type="danger"
                        style={{ marginRight: 16 }}
                        onClick={() => this.isAgree(false)}
                      >
                        不同意转正
                      </Button>
                    </React.Fragment>
                  )}
              </footer>
            )}
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
                  this.setState({
                    addInternalCourseData: {
                      ...this.state.addInternalCourseData,
                      trainDate: val && val.format('YYYY-MM-DD HH:mm:ss')
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
                value={this.state.modifyInternalCourseData.C3_614182469763}
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
                          C3_614182469763: item.C3_609845305868
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
            <Col span={12}>
              {this.state.modifyInternalCourseData.C3_613941386081}
            </Col>
          </Row>
          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              培训日期:
            </Col>
            <Col span={12}>
              <DatePicker
                showTime
                value={
                  this.state.modifyInternalCourseData.C3_615393041304
                    ? moment(
                        this.state.modifyInternalCourseData.C3_615393041304
                      )
                    : undefined
                }
                onChange={val => {
                  this.setState({
                    modifyInternalCourseData: {
                      ...this.state.modifyInternalCourseData,
                      C3_615393041304: val && val.format('YYYY-MM-DD HH:mm:ss')
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
          onOk={() => this.addOnJobTraining()}
          destroyOnClose
          okText="添加"
        >
          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              课程:
            </Col>
            <Col span={12}>
              <Input
                placeholder="请输入"
                onChange={e =>
                  this.setState({
                    addOnJobTrainingData: {
                      ...this.state.addOnJobTrainingData,
                      course: e.target.value
                    }
                  })
                }
              />
            </Col>
          </Row>
          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              培训师:
            </Col>
            <Col span={12}>
              <Select
                style={{ width: 150 }}
                placeholder="请输入培训师工号"
                showSearch
                filterOption={false}
                onSearch={this.fetchUser}
                onChange={v => {
                  this.setState({
                    addOnJobTrainingData: {
                      ...this.state.addOnJobTrainingData,
                      trainer: v.label,
                      trainerMemberId: v.key
                    }
                  });
                }}
                labelInValue
                loading={this.state.fetching}
              >
                {this.state.trainerData.map(d => (
                  <Option key={d.key}>{d.label}</Option>
                ))}
              </Select>
            </Col>
          </Row>

          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              培训日期:
            </Col>
            <Col span={12}>
              <DatePicker
                showTime
                onChange={val => {
                  this.setState({
                    addOnJobTrainingData: {
                      ...this.state.addOnJobTrainingData,
                      trainDate: val && val.format('YYYY-MM-DD HH:mm:ss')
                    }
                  });
                }}
              />
            </Col>
          </Row>
        </Modal>
        <Modal
          title="修改在岗培训课程"
          visible={this.state.modifyOnJobTrainingVisible}
          onCancel={() => this.setModifyOnJobTrainingVisible(false)}
          onOk={() => this.modifyOnJobTraining()}
          destroyOnClose
          okText="修改"
        >
          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              课程:
            </Col>
            <Col span={12}>
              <Input
                placeholder="请输入"
                value={this.state.modifyOnJobTrainingData.course}
                onChange={e =>
                  this.setState({
                    modifyOnJobTrainingData: {
                      ...this.state.modifyOnJobTrainingData,
                      course: e.target.value
                    }
                  })
                }
              />
            </Col>
          </Row>
          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              培训师:
            </Col>
            <Col span={12}>
              <Select
                style={{ width: 150 }}
                placeholder="请输入培训师工号"
                showSearch
                filterOption={false}
                onSearch={this.fetchUser}
                value={{
                  label: this.state.modifyOnJobTrainingData.trainer,
                  key: this.state.modifyOnJobTrainingData.trainerMemberId
                }}
                onChange={v => {
                  this.setState({
                    modifyOnJobTrainingData: {
                      ...this.state.modifyOnJobTrainingData,
                      trainer: v.label,
                      trainerMemberId: v.key
                    }
                  });
                }}
                labelInValue
                loading={this.state.fetching}
              >
                {this.state.trainerData.map(d => (
                  <Option key={d.key}>{d.label}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              培训日期:
            </Col>
            <Col span={12}>
              <DatePicker
                showTime
                value={
                  this.state.modifyOnJobTrainingData.trainDate
                    ? moment(this.state.modifyOnJobTrainingData.trainDate)
                    : undefined
                }
                onChange={val => {
                  this.setState({
                    modifyOnJobTrainingData: {
                      ...this.state.modifyOnJobTrainingData,
                      trainDate: val && val.format('YYYY-MM-DD HH:mm:ss')
                    }
                  });
                }}
              />
            </Col>
          </Row>
        </Modal>
        <Modal
          title="历史修改记录"
          visible={this.state.modifyProbationObjectiveVisible}
          onCancel={() => {
            this.setModifyProbationObjectiveVisible(false);
            this.setState({
              modifyProbationObjectiveData: {},
              modifyProbationObjectiveIndex: undefined
            });
          }}
          width="90%"
          style={{ top: 50 }}
          onOk={() => {
            this.setModifyProbationObjectiveVisible(false);
          }}
          destroyOnClose
        >
          <TableData
            key="historyRecord"
            resid="619960233127"
            subTableArrProps={[
              {
                subResid: 619960210668,
                subTableName: '工作目标评估历史',
                tableProps: {
                  hasAdd: false,
                  hasModify: false,
                  hasDelete: false,
                  hasRowModify: false,
                  hasRowView: true,
                  hasRowDelete: false,
                  height: 400,
                  subtractH: 196,
                  actionBarWidth: 100
                }
              }
            ]}
            cmswhere={`memberId = '${this.state.employeeInformation.memberId}'`}
            subtractH={220}
            height={600}
            actionBarWidth={200}
            hasBeBtns={true}
            hasAdd={false}
            hasRowView={true}
            hasRowDelete={false}
            hasRowEdit={false}
            hasDelete={false}
            hasModify={false}
            hasRowModify={false}
            hasRowSelection={false}
          />
        </Modal>
      </Spin>
    );
  }
}

export default ProbationForms;
