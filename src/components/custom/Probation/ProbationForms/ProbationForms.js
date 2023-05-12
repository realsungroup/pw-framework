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
  Input,
  Popconfirm
} from 'antd';
import http from 'Util20/api';
import { getItem } from 'Util20/util';
import './ProbationForms.less';
import debounce from 'lodash/debounce';
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
  Header,
  Media,
  VerticalAlign,
  PageNumberFormat,
  PageNumber,
  Footer
} from 'docx';
import { saveAs } from 'file-saver';
import {
  employeeInfo,
  employeeInfo2,
  employeeObjectives,
  employeeOrientationtraining,
  employeeInternaltraining,
  employeeOnjobtraining,
  employeeMentorshipRecord,
  IIVILogo
} from './config';

function buf2hex(buffer) {
  // buffer is an ArrayBuffer
  return Array.prototype.map
    .call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2))
    .join('');
}

const { Link } = Anchor;
const { Option } = Select;
const { confirm } = Modal;

const resid1 = '619694861346'; //新员工个人信息表
const resid2 = '618591416723'; //工作目标表
const resid3 = '618591427140'; //入职培训表
const resid4 = '618591437750'; //内训课程上课记录表
const resid5 = '618591446269'; //在岗培训表
const resid6 = '618591459355'; //辅导记录表
const resid8 = '619268906732'; //评估周期
const resid9 = '619808533610';
const memberSemiId = 'C3_625051545181'; //录用编号
// const resid10 = '622983009643'; //入职培训管理表

const internalCourse = '625082518213'; //内训课程表
const tutorshipResid = '619281130628'; //辅导员表
const authResid = '619703562233';

class ProbationForms extends React.Component {
  constructor(props) {
    super(props);
    this.fetchUser = debounce(this.fetchUser, 800);
  }
  state = {
    loadingConfirm: false,
    flagHitBack: false,
    flagAlreadyHit: 0,
    employeeInformation: {}, //个人信息
    probationObjectives: [], //工作目标
    orientationTraining: [], //入职培训
    internalTraining: [], //内训课程
    onTheJobTraining: [], //在岗培训
    mentorshipRecord: [], //辅导记录
    actualInternalTraining: [], //实际上过的内训课程
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
    approveNodes: []
  };

  async componentDidMount() {
    this.setState({ loading: true });
    let memberId;
    let employedId;
    if (this.props.roleName === '员工') {
      memberId = JSON.parse(getItem('userInfo')).UserInfo.EMP_USERCODE;
    } else {
      memberId = this.props.memberId;
      employedId = this.props.employedId;
    }
    this.setState({ memIDOrg: memberId });

    await this.getAuth();
    await this.getCircle();
    await this.getRecords(memberId, employedId);
    this.getInternalCourses();
    // this.getTutorships();
    this.setState({ loading: false });
    this.getOrientationTraining(memberId, employedId);
    // this.fetchEmployeeInternalCourses(memberId);
    this.fetchActualInternalCourses(memberId);
  }
  fetchEmployeeInternalCourses = async memIDOrg => {
    try {
      const res = await http().getTable({
        resid: 626260756738,
        cmswhere: `C3_613941384832 = '${memIDOrg}'`
      });
      // res.data.length && this.setState({  });
    } catch (error) {
      console.error(error);
    }
  };

  fetchActualInternalCourses = async memberId => {
    try {
      const res = await http().getTable({
        resid: '626260756738',
        cmswhere: `C3_613941384832 = '${memberId}'`
      });
      this.setState({ actualInternalTraining: res.data });
    } catch (error) {
      message.error(error.message);
    }
  };

  fetchApproveNodes = async id => {
    try {
      const res = await http().getTable({
        resid: 618591268064,
        cmswhere: `C3_659451908745 = '${id}'`
      });
      let n = 0;
      let arr = res.data;
      while (n < arr.length) {
        if (arr[n].C3_659447231160 == '部门主管审批') {
          arr[n].C3_659447231160 = '直接主管审批';
        }
        n++;
      }
      res.data.length && this.setState({ approveNodes: arr });
    } catch (error) {
      console.error(error);
    }
  };
  /**
   * 申请转正
   */
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
      this.setState({
        employeeInformation: {
          ...this.state.employeeInformation,
          C3_622649502021: 'Y',
          loading: false
        }
      });
    } catch (error) {
      message.error(error.message);
      console.log(error);
      this.setState({ loading: false });
    }

  };

  /**
   * 同意辅导员申请
   */
  agreeApply = async () => {
    this.setState({ loading: true });

    try {
      var dept;
      var userID;
      var userMemberId;
      var toAdd;
      var name;
      var memID = this.state.employeeInformation.instructorDirectorId;
      if (memID) {
        let res2 = await http().getTable({
          resid: '609599795438',
          cmswhere: `C3_305737857578 = '${memID}'`
        });
        dept =
          res2.data[0].C3_422840479020 ||
          res2.data[0].C3_422840472843 ||
          res2.data[0].C3_422840463535 ||
          res2.data[0].C3_422840460773;
        userID = res2.data[0].C3_227192472953;
        userMemberId = res2.data[0].C3_305737857578;
        name = res2.data[0].C3_227192484125;
        toAdd = [
          {
            dept: dept,
            userID: userID,
            userMemberId: userMemberId,
            name: name
          }
        ];

        let res3 = await http().getTable({
          resid: '619281130628',
          cmswhere: `userMemberId = '${memID}'`
        });
        if (res3.data.length == 0) {
          let res4 = await http().addRecords({
            resid: '619281130628',
            data: toAdd
          });
          if (res4.data.length > 0) {
            let memberId = this.props.memberId;
            let employedId = this.props.employedId;
            message.success('成功同意辅导员1');
          }
        }
      }
      var memID2 = this.state.employeeInformation.instructorDirectorId2;
      if (memID2) {
        let res5 = await http().getTable({
          resid: '609599795438',
          cmswhere: `C3_305737857578 = '${memID2}'`
        });
        dept =
          res5.data[0].C3_422840479020 ||
          res5.data[0].C3_422840472843 ||
          res5.data[0].C3_422840463535 ||
          res5.data[0].C3_422840460773;
        userID = res5.data[0].C3_227192472953;
        userMemberId = res5.data[0].C3_305737857578;
        name = res5.data[0].C3_227192484125;
        toAdd = [
          {
            dept: dept,
            userID: userID,
            userMemberId: userMemberId,
            name: name
          }
        ];
        console.log('memID2', memID2, 'toAdd', toAdd);
        let res6 = await http().getTable({
          resid: '619281130628',
          cmswhere: `userMemberId = '${memID2}'`
        });
        if (res6.data.length == 0) {
          let res7 = await http().addRecords({
            resid: '619281130628',
            data: toAdd
          });
          if (res7.data.length > 0) {
            let memberId = this.props.memberId;
            let employedId = this.props.employedId;
            message.success('成功同意辅导员2');
          }
        }
      }
      await this.props.goBack();
    } catch (error) {
      this.setState({ loading: false });
      message.error(error.message);
      console.log(error);
    }
  };

  getFDY = async recid => {
    let res = await http().getTable({
      resid: '619281130628',
      cmswhere: `REC_ID = '${recid}'`
    });
    return res;
  };
  /**
   * 不同意辅导员申请
   */
  disagreeApply = async () => {
    this.setState({ loading: true });
    try {
      let res = await http().modifyRecords({
        resid: resid1,
        data: [
          {
            REC_ID: this.state.employeeInformation.REC_ID,
            instructorIsPass: 'N'
          }
        ]
      });
      this.setState({ loading: false, flagAlreadyHit: 2 });
      message.success('成功驳回辅导员');
    } catch (error) {
      this.setState({ loading: false });
      message.error(error.message);
      console.log(error);
    }
  };

  /**
   * 点击保存
   */
  handleSubmit = async chara => {
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
      const _memberSemiId = employeeInformation[memberSemiId];
      probationObjectives.forEach(item => {
        subdata.push({
          resid: resid2,
          maindata: {
            ...item,
            [memberSemiId]: _memberSemiId,
            _state: 'editoradd',
            _id: index++
          },
          subData: item[resid9].map(i => {
            return {
              resid: resid9,
              maindata: {
                ...i,
                [memberSemiId]: _memberSemiId,
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
          maindata: {
            ...item,
            _state: 'editoradd',
            [memberSemiId]: _memberSemiId,
            _id: index++
          }
        });
      });
      internalTraining.forEach(item => {
        subdata.push({
          resid: resid4,
          maindata: {
            ...item,
            [memberSemiId]: _memberSemiId,
            _state: 'editoradd',
            _id: index++
          }
        });
      });
      onTheJobTraining.forEach(item => {
        delete item.C3_625069822489;
        delete item.C3_638372958685;
        delete item.sendAffirmEmail;
        delete item.isAffirm;
        subdata.push({
          resid: resid5,
          maindata: {
            ...item,
            [memberSemiId]: _memberSemiId,
            _state: 'editoradd',
            _id: index++
          }
        });
      });
      mentorshipRecord.forEach(item => {
        delete item.instructEmailIsSend;
        delete item.C3_664472776773;
        delete item.C3_625594433726;
        delete item.isConfirm;
        subdata.push({
          resid: resid6,
          maindata: {
            ...item,
            [memberSemiId]: _memberSemiId,
            _state: 'editoradd',
            _id: index++
          }
        });
      });
      delete employeeInformation.isNoticeHrEmail;
      console.log('提交的数据', [
        {
          resid: resid1,
          maindata: {
            ...employeeInformation,
            instructor:
              this.state.employeeInformation.instructor &&
                this.state.employeeInformation.instructor.indexOf('-') > -1
                ? this.state.employeeInformation.instructor.split('-')[0]
                : this.state.employeeInformation.instructor,
            instructorDirectorName:
              this.state.employeeInformation.instructorDirectorName &&
                this.state.employeeInformation.instructorDirectorName.indexOf(
                  '-'
                ) > -1
                ? this.state.employeeInformation.instructorDirectorName.split(
                  '-'
                )[0]
                : this.state.employeeInformation.instructorDirectorName,
            C3_637084539039:
              this.state.employeeInformation.C3_637084539039 &&
                this.state.employeeInformation.C3_637084539039.indexOf('-') > -1
                ? this.state.employeeInformation.C3_637084539039.split('-')[0]
                : this.state.employeeInformation.C3_637084539039,
            instructorDirectorName2:
              this.state.employeeInformation.instructorDirectorName2 &&
                this.state.employeeInformation.instructorDirectorName2.indexOf(
                  '-'
                ) > -1
                ? this.state.employeeInformation.instructorDirectorName2.split(
                  '-'
                )[0]
                : this.state.employeeInformation.instructorDirectorName2,
            _state: 'modified',
            _id: 1
          },
          subdata
        }
      ]);

      await http().saveRecordAndSubTables({
        data: [
          {
            resid: resid1,
            maindata: {
              ...employeeInformation,
              instructor:
                this.state.employeeInformation.instructor &&
                  this.state.employeeInformation.instructor.indexOf('-') > -1
                  ? this.state.employeeInformation.instructor.split('-')[0]
                  : this.state.employeeInformation.instructor,
              instructorDirectorName:
                this.state.employeeInformation.instructorDirectorName &&
                  this.state.employeeInformation.instructorDirectorName.indexOf(
                    '-'
                  ) > -1
                  ? this.state.employeeInformation.instructorDirectorName.split(
                    '-'
                  )[0]
                  : this.state.employeeInformation.instructorDirectorName,
              C3_637084539039:
                this.state.employeeInformation.C3_637084539039 &&
                  this.state.employeeInformation.C3_637084539039.indexOf('-') > -1
                  ? this.state.employeeInformation.C3_637084539039.split('-')[0]
                  : this.state.employeeInformation.C3_637084539039,
              instructorDirectorName2:
                this.state.employeeInformation.instructorDirectorName2 &&
                  this.state.employeeInformation.instructorDirectorName2.indexOf(
                    '-'
                  ) > -1
                  ? this.state.employeeInformation.instructorDirectorName2.split(
                    '-'
                  )[0]
                  : this.state.employeeInformation.instructorDirectorName2,
              insRej2:
                chara == '主管' ? '' : this.state.employeeInformation.insRej2,
              instructorIsPass:
                chara == '主管' &&
                  this.state.employeeInformation.instructorIsPass == 'N'
                  ? ''
                  : this.state.employeeInformation.instructorIsPass,
              InstructorBackEmail:
                chara == '主管'
                  ? ''
                  : this.state.employeeInformation.InstructorBackEmail,
              C3_625225123202:
                chara == '主管' &&
                  this.state.employeeInformation.instructorIsPass == 'N'
                  ? ''
                  : this.state.C3_625225123202,
              insCheck2:
                chara == '主管' &&
                  this.state.employeeInformation.instructorIsPass == 'N'
                  ? ''
                  : this.state.insCheck2,
              _state: 'modified',
              _id: 1
            },
            subdata
          }
        ]
      });
      let memberId;
      let employedId;
      if (this.props.roleName === '员工') {
        memberId = JSON.parse(getItem('userInfo')).UserInfo.EMP_USERCODE;
      } else {
        memberId = this.props.memberId;
        employedId = this.props.employedId;
      }
      await this.getRecords(memberId, employedId);
      this.setState({ loading: false });
      // if (this.props.roleName !== '员工') {
      //   this.props.setIsShowTable(true);
      // }
      // await http().modifyRecords({
      //   resid: resid1,
      //   data: [
      //     {
      //       REC_ID: this.state.employeeInformation.REC_ID,
      //       instructorIsPass: ''
      //     }
      //   ]
      // });
      if (chara == '主管') {
        delete this.state.employeeInformation.C3_656696089140;
        delete this.state.employeeInformation.probationNoticeEmail;
        this.setState({
          employeeInformation: {
            ...this.state.employeeInformation,
            instructorIsPass: '0'
          },
          flagAlreadyHit: 0
        });
      }
      message.success('提交成功');
    } catch (error) {
      message.error(error.message);
      console.log(error);
      this.setState({ loading: false });
    }
  };

  /**
   * 根据角色获取对应后台表及权限
   */
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

  /**
   * 获取试用期主子表记录
   */
  getRecords = async (memberId, employedId) => {
    try {
      const { viewableTable } = this.state;
      let subresid = '';
      // 可用子表id
      Object.keys(viewableTable).forEach(item => {
        if (viewableTable[item]) {
          subresid += viewableTable[item] + ',';
        }
      });
      subresid += resid9;
      let res;
      if (memberId != '0') {
        res = await http().getRecordAndSubTables({
          resid: resid1,
          subresid,
          cmswhere: `memberId = '${memberId}'`,
          getsubresource: 1
        });
      } else {
        res = await http().getRecordAndSubTables({
          resid: resid1,
          subresid,
          cmswhere: `C3_625051545181 = '${employedId}'`,
          getsubresource: 1
        });
      }
      if (res.data.length > 0) {
        const SubResource = res.SubResource;
        var toFid = employedId || res.data[0].C3_625051545181;

        let data = {};
        if (memberId === '0') {
          data = res.data.find(item => item.C3_625051545181 === toFid);
        } else {
          data = res.data[0];
        }
        if (!data) {
          return Modal.info({
            title: '提示',
            content: '没有试用期信息。',
            onOk: () => { }
          });
        }
        let probationObjectives = data[viewableTable.objectiveResid].filter(
          item => item.C3_625051545181 === toFid
        );
        if (probationObjectives.length < 3) {
          let count = 3 - probationObjectives.length;
          const memberId = data.memberId;
          const assessmentCycle = this.state.assessmentCycle;
          for (let i = 0; i < count; i++) {
            let subData = [];
            assessmentCycle.forEach(item => {
              subData.push({
                period: item,
                memberId
              });
            });
            probationObjectives.push({ [resid9]: subData });
          }
        }
        if (data) {
          if (data.instructorDirectorName) {
            data.isSemi = true;
            this.setState({ flagHitBack: true });
          } else {
            data.isSemi = false;
          }
          if (data.instructorDirectorName2) {
            data.isSemi2 = true;
            this.setState({ flagHitBack: true });
          } else {
            data.isSemi2 = false;
          }
          if (data.instructorIsPass == 'Y') {
            this.setState({ flagAlreadyHit: 1 });
          } else if (data.instructorIsPass == 'N') {
            this.setState({ flagAlreadyHit: 2 });
          } else {
            this.setState({ flagAlreadyHit: 0 });
          }
          this.fetchApproveNodes(data.C3_625051545181);
          this.setState({
            employeeInformation: data,
            probationObjectives: probationObjectives,
            // orientationTraining: data[viewableTable.orientationResid],
            internalTraining: data[viewableTable.internalResid].filter(
              item => item.C3_625051545181 === toFid
            ),
            onTheJobTraining: data[viewableTable.onJobResid].filter(
              item => item.C3_625051545181 === toFid
            ),
            mentorshipRecord: data[viewableTable.mentorRecordResid].filter(
              item => item.C3_625051545181 === toFid
            ),
            tableAuth: {
              onJob: SubResource[viewableTable.onJobResid],
              mentorRecord: SubResource[viewableTable.mentorRecordResid],
              objective: SubResource[viewableTable.objectiveResid],
              internal: SubResource[viewableTable.internalResid]
            }
          });
        }
      } else {
        message.info('没有试用期记录');
      }
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  /**
   * 获取内训课程
   */
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

  /**
   * 获取入职培训表数据
   */
  getOrientationTraining = async (memberId, employedId) => {
    if (memberId == '0') {
      try {
        const res = await http().getTable({
          resid: 622983009643
        });
        const trainDate = this.state.employeeInformation.joinCompanyDate
          ? this.state.employeeInformation.joinCompanyDate.substring(0, 10)
          : '';
        this.setState({
          orientationTraining: res.data.map(item => {
            return {
              ...item,
              trainDate,
              trainer: item.trainingPerson || ''
            };
          })
        });
      } catch (error) {
        message.error(error.message);
        console.log(error);
      }
    } else {
      try {
        let res = await http().getTable({
          resid: resid3,
          cmswhere: `menberId = '${memberId}'`
        });
        this.setState({ orientationTraining: res.data });
      } catch (error) {
        message.error(error.message);
        console.log(error);
      }
    }
  };

  /**
   * 获取评估周期
   */
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

  /**
   * 根据工号搜索培训师
   */
  fetchUser = async value => {
    if (!value) {
      return;
    }
    this.setState({ trainerData: [], fetching: true });
    try {
      const res = await http().getTable({
        resid: '609599795438',
        // cmswhere: `C3_227192472953 = '${value}'`
        key: value
      });
      const trainerData = res.data.map(user => ({
        label: `${user.C3_227192484125}`,
        key: user.C3_305737857578,
        memberId: user.C3_227192472953
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

  /**
   * 添加目标
   */
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
  };

  /**
   * 删除目标
   */
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

  /**
   * 修改目标
   */
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

  /**
   * 添加辅导记录
   */
  addMentor = () => {
    const mentorshipRecord = [
      ...this.state.mentorshipRecord,
      { isSendInstructEmail: 'Y' }
    ];
    this.setState({ mentorshipRecord });
  };

  /**
   * 删除辅导记录
   */
  removeMentor = async index => {
    let mentorshipRecord = [...this.state.mentorshipRecord];
    if (mentorshipRecord[index].REC_ID) {
      try {
        await http().removeRecords({
          resid: resid6,
          data: [{ REC_ID: mentorshipRecord[index].REC_ID }]
        });
        message.success('已删除');
        mentorshipRecord.splice(index, 1);
        this.setState({ mentorshipRecord });
      } catch (error) {
        message.error(error.message);
        console.log(error);
      }
    }
  };

  /**
   * 修改辅导记录
   */
  modifyMentor = (index, mentor) => {
    const mentorshipRecord = [...this.state.mentorshipRecord];
    mentorshipRecord[index] = mentor;
    this.setState({ mentorshipRecord });
  };

  /**
   * 确认辅导记录
   */
  confirmMentor = async index => {
    let fdy = localStorage.getItem('userInfo');
    this.setState({ loadingConfirm: true });
    fdy = JSON.parse(fdy);
    fdy = fdy.Data;
    try {
      const mentorshipRecord = [...this.state.mentorshipRecord];
      // console.log(this.state.employeeInformation.instructorID);
      await http().modifyRecords({
        resid: resid6,
        data: [
          {
            REC_ID: mentorshipRecord[index].REC_ID,
            isConfirm: 'Y',
            editorId: this.state.employeeInformation.instructorID,
            PWC: fdy
          }
        ]
      });
      mentorshipRecord[index].isConfirm = 'Y';
      this.setState({ mentorshipRecord });
    } catch (error) {
      message.error(error.message);
      console.log(error);
      this.setState({ loadingConfirm: false });
    }

    setTimeout(() => {
      http().modifyRecords({
        resid: resid1,
        data: [
          {
            REC_ID: this.state.employeeInformation.REC_ID
          }
        ]
      });
      this.setState({ loadingConfirm: false });
    }, 3000);
  };

  /**
   * 处理工作目标内容变化
   */
  handleObjectvieChange = ({ objective, quota }) => {
    this.setState({
      addProbationObjective: {
        objective,
        quota
      }
    });
  };

  /**
   * 个人总结内容变化
   */
  summaryChange = summary => {
    this.setState({
      employeeInformation: {
        ...this.state.employeeInformation,
        smmary: summary
      }
    });
  };

  /**
   * 主管评价内容变化
   */
  directorEvaluateChange = directorEvaluate => {
    console.log('123v' + directorEvaluate);
    this.setState({
      employeeInformation: {
        ...this.state.employeeInformation,
        directorEvaluate: directorEvaluate
      }
    });
  };

  /**
   * 经理评价内容变化
   */
  managerEvaluateChange = managerEvaluate => {
    this.setState({
      employeeInformation: {
        ...this.state.employeeInformation,
        ManagerEvaluate: managerEvaluate
      }
    });
  };

  /**
   * 经理评价内容变化
   */
  hrManagerEvaluateChange = hrManagerEvaluate => {
    this.setState({
      employeeInformation: {
        ...this.state.employeeInformation,
        hrManagerEvaluate: hrManagerEvaluate
      }
    });
  };

  /**
   * 分配辅导员
   */
  setTutorship = ({ name, userMemberId }, bol) => {
    this.setState({
      employeeInformation: {
        ...this.state.employeeInformation,
        instructorID: userMemberId,
        instructor: name,
        instructorDirectorName: undefined,
        instructorDirectorId: undefined
      }
    });
  };

  setTutorshipSemi = async ({ name, userMemberId }, bol) => {
    let res = await http().getTable({
      resid: 619281130628,
      cmswhere: `userMemberId = '${userMemberId}'`
    });
    if (res.data.length > 0) {
      message.error('该人员已经在辅导员表中，请不要勾选自定义辅导员的单选框');
    } else {
      this.setState({
        employeeInformation: {
          ...this.state.employeeInformation,
          instructorDirectorId: userMemberId,
          instructorDirectorName: name,
          instructorID: undefined,
          instructor: undefined
        }
      });
    }
  };

  setTutorship2 = ({ name, userMemberId }, bol) => {
    this.setState({
      employeeInformation: {
        ...this.state.employeeInformation,
        C3_637084526216: userMemberId,
        C3_637084539039: name,
        instructorDirectorName2: undefined,
        instructorDirectorId2: undefined
      }
    });
  };

  setTutorshipSemi2 = async ({ name, userMemberId }, bol) => {
    let res = await http().getTable({
      resid: 619281130628,
      cmswhere: `userMemberId = '${userMemberId}'`
    });
    if (res.data.length > 0) {
      message.error('该人员已经在辅导员表中，请不要勾选自定义辅导员的单选框');
    } else {
      this.setState({
        employeeInformation: {
          ...this.state.employeeInformation,
          instructorDirectorId2: userMemberId,
          instructorDirectorName2: name,
          C3_637084526216: undefined,
          C3_637084539039: undefined
        }
      });
    }
  };

  isSemi = v => {
    this.setState({
      employeeInformation: {
        ...this.state.employeeInformation,
        isSemi: v
      }
    });
  };
  isSemi2 = v => {
    this.setState({
      employeeInformation: {
        ...this.state.employeeInformation,
        isSemi2: v
      }
    });
  };
  /**
   * 添加在岗培训课程
   */
  addOnJobTraining = async () => {
    let data = {
      ...this.state.addOnJobTrainingData,
      memberId: this.state.employeeInformation.memberId
    };
    this.setAddOnJobTrainingVisible(false);
    this.setState({
      onTheJobTraining: [...this.state.onTheJobTraining, data],
      addOnJobTrainingData: {}
    });
  };

  /**
   * 修改在岗培训
   */
  modifyOnJobTraining = async () => {
    const { onTheJobTraining } = this.state;
    const data = { ...this.state.modifyOnJobTrainingData };
    onTheJobTraining[data.no - 1] = data;
    this.setState({
      onTheJobTraining,
      modifyOnJobTrainingVisible: false
    });
  };

  /**
   * 删除在岗培训
   */
  deleteOnJobTraining = async (REC_ID, no) => {
    try {
      let onTheJobTraining = [...this.state.onTheJobTraining];
      if (REC_ID) {
        http().removeRecords({
          resid: resid5,
          data: [{ REC_ID }]
        });
        onTheJobTraining = onTheJobTraining.filter(item => {
          return item.REC_ID !== REC_ID;
        });
      } else {
        onTheJobTraining.splice(no - 1, 1);
      }
      message.success('已删除');
      this.setState({
        onTheJobTraining
      });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  /**
   * 添加内训课程
   */
  addInternalCourse = async () => {
    let internalTraining = {
      courseId: this.state.addInternalCourseData.courseId,
      trainer: this.state.addInternalCourseData.teacher,
      course: this.state.addInternalCourseData.courseName
    };
    this.setAddInternalCourseVisible(false);
    this.setState({
      internalTraining: [...this.state.internalTraining, internalTraining],
      addInternalCourseData: {}
    });
  };

  /**
   * 删除内训课程
   */
  deleteInternalCourse = async (REC_ID, no) => {
    let internalTraining = [...this.state.internalTraining];
    try {
      if (REC_ID) {
        http().removeRecords({
          resid: resid4,
          data: [{ REC_ID }]
        });
        internalTraining = internalTraining.filter(item => {
          return item.REC_ID !== REC_ID;
        });
      } else {
        internalTraining.splice(no - 1, 1);
      }

      this.setState({
        internalTraining
      });
      message.success('已删除');
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  /**
   * 修改内训课程
   */
  modifyInternalCourse = async () => {
    const { internalTraining } = this.state;
    const data = { ...this.state.modifyInternalCourseData };
    internalTraining[data.no - 1] = data;
    this.setState({
      internalTraining,
      modifyInternalCourseVisible: false
    });
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
  // 控制显示内训详情模态窗状态
  setInterDetailVis = visible =>
    this.setState({
      interDetailVis: visible
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

  /**
   * 是否同意转正
   */
  isAgree = isAgree => {
    confirm({
      title: isAgree ? '确认同意转正?' : '确认不同意转正?',
      onOk: async () => {
        try {
          let data;
          switch (this.props.roleName) {
            case '主管':
              data = [
                {
                  REC_ID: this.state.employeeInformation.REC_ID,
                  isRegular: isAgree ? 'Y' : 'N',
                  directorEvaluate: this.state.employeeInformation
                    .directorEvaluate
                }
              ];
              break;
            case '经理':
              data = [
                {
                  REC_ID: this.state.employeeInformation.REC_ID,
                  isManagerRegular: isAgree ? 'Y' : 'N',
                  ManagerEvaluate: this.state.employeeInformation
                    .ManagerEvaluate
                }
              ];
              break;
            case 'HR经理':
              data = [
                {
                  REC_ID: this.state.employeeInformation.REC_ID,
                  hrManagerApprove: isAgree ? 'Y' : 'N',
                  hrManagerEvaluate: this.state.employeeInformation
                    .hrManagerEvaluate
                }
              ];
              break;
            case '总监':
              data = [
                {
                  REC_ID: this.state.employeeInformation.REC_ID,
                  driectorApprove: isAgree ? 'Y' : 'N',
                  ManagerEvaluate: this.state.employeeInformation
                    .ManagerEvaluate
                }
              ];
              break;

            default:
              break;
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
      onCancel() { }
    });
  };

  /**
   * 邀请培训师确认
   */
  inviteConfirm = async data => {
    if (!data.REC_ID) {
      return message.info('请先保存');
    }
    data.C3_623863682701 = '';
    this.setState({ loading: true });
    try {
      const res = await http().modifyRecords({
        resid: resid5,
        data: [data]
      });
      const _data = [...this.state.onTheJobTraining];
      const index = _data.findIndex(item => {
        return item.REC_ID === data.REC_ID;
      });
      _data[index] = res.data[0];
      this.setState({ onTheJobTraining: _data });
      message.success('已邀请');
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
    this.setState({ loading: false });
  };

  exportWord = () => {
    const {
      employeeInformation,
      actualInternalTraining,
      internalTraining
    } = this.state;
    let _internalTrainnings = [];
    if (!actualInternalTraining.length) {
      _internalTrainnings = [...internalTraining];
    } else {
      _internalTrainnings = [
        ...actualInternalTraining.map(item => {
          return {
            course: item.C3_613941384592,
            trainer: item.C3_613941386081,
            trainDate: item.C3_615393041304 || '',
            courseId: item.C3_614182469763
          };
        })
      ];
      internalTraining.forEach(item => {
        if (!_internalTrainnings.find(_i => _i.courseId == item.courseId)) {
          _internalTrainnings.push(item);
        }
      });
    }
    const doc = new Document({
      styles: {
        tableStyles: [
          {
            id: 'tableCell',
            name: 'TableCell',
            run: {
              color: '999999',
              italics: true
            }
          }
        ]
      }
    });
    const logo26 = Media.addImage(
      doc,
      Uint8Array.from(atob(IIVILogo), c => c.charCodeAt(0)),
      96,
      40
    );
    doc.addSection({
      headers: {
        default: new Header({
          children: [new Paragraph({ children: [logo26] })]
        })
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  children: [PageNumber.CURRENT]
                })
              ]
            })
          ]
        })
      },
      properties: {
        pageNumberStart: 1,
        pageNumberFormatType: PageNumberFormat.DECIMAL
      },
      children: [
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              bold: true,
              text: '新员工试用期考核表',
              color: '000000'
            })
          ]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              bold: true,
              text: 'New Employee Probation Appraisal Form',
              color: '000000'
            })
          ]
        }),
        new Paragraph({
          children: [new TextRun('')]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({
              bold: true,
              text: '个 人 信 息  Employee Information',
              color: '000000'
            })
          ]
        }),
        new Table({
          width: {
            size: 9070,
            type: WidthType.DXA
          },
          rows: [
            new TableRow({
              children: employeeInfo.map(item => {
                return new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: item.text, bold: true })],
                      alignment: AlignmentType.CENTER
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER
                });
              }),
              tableHeader: true
            }),
            new TableRow({
              children: employeeInfo.map(item => {
                let text = employeeInformation[item.field] || '';
                if (item.isDate && text) {
                  text = text.substring(0, 10);
                }
                return new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun(text)],
                      alignment: AlignmentType.CENTER
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER
                });
              })
            }),
            new TableRow({
              children: employeeInfo2.map(item => {
                return new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: item.text, bold: true })],
                      alignment: AlignmentType.CENTER
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER
                });
              }),

              tableHeader: true
            }),
            new TableRow({
              children: employeeInfo2.map(item => {
                let text = employeeInformation[item.field] || '';
                if (item.isDate && text) {
                  text = text.substring(0, 10);
                }
                return new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun(text)],
                      alignment: AlignmentType.CENTER
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER
                });
              })
            })
          ]
        }),
        new Paragraph({
          children: [new TextRun('')]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({
              bold: true,
              text: '试 用 期 工 作 目 标  Probation Objectives',
              color: '000000'
            })
          ]
        }),
        new Table({
          // width: {
          //   size: 4535,
          //   type: WidthType.DXA
          // },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: '序号',
                          bold: true
                        })
                      ]
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER,
                  width: {
                    size: 5.3,
                    type: WidthType.PERCENTAGE
                  }
                }),
                ...employeeObjectives.map(item => {
                  return new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: item.text,
                            bold: true
                          })
                        ]
                      })
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 21,
                      type: WidthType.PERCENTAGE
                    }
                  });
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: '三个月-目标绩效完成评估',
                          bold: true
                        })
                      ]
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER,
                  width: {
                    size: 21,
                    type: WidthType.PERCENTAGE
                  }
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: '三个月-评分',
                          bold: true
                        })
                      ]
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER,
                  width: {
                    size: 5.3,
                    type: WidthType.PERCENTAGE
                  }
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: '五个月-目标绩效完成评估',
                          bold: true
                        })
                      ]
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER,
                  width: {
                    size: 21,
                    type: WidthType.PERCENTAGE
                  }
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: '五个月-评分',
                          bold: true
                        })
                      ]
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER,
                  width: {
                    size: 5.3,
                    type: WidthType.PERCENTAGE
                  }
                })
              ],
              tableHeader: true
            }),
            ...this.state.probationObjectives.map((objective, index) => {
              return new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: index + 1 + '',
                        alignment: AlignmentType.CENTER
                      })
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 5.3,
                      type: WidthType.PERCENTAGE
                    }
                  }),
                  ...employeeObjectives.map(item => {
                    return new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.LEFT,
                          children: [
                            new TextRun({
                              text: objective[item.field] || ''
                            })
                          ]
                        })
                      ],
                      verticalAlign: VerticalAlign.TOP,
                      width: {
                        size: 21,
                        type: WidthType.PERCENTAGE
                      }
                    });
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text:
                          (objective['619808533610'][0] &&
                            objective['619808533610'][0].assessment) ||
                          '',
                        alignment: AlignmentType.LEFT
                      })
                    ],
                    verticalAlign: VerticalAlign.TOP,
                    width: {
                      size: 21,
                      type: WidthType.PERCENTAGE
                    }
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text:
                          (objective['619808533610'][0] &&
                            objective['619808533610'][0].score) ||
                          '',
                        alignment: AlignmentType.CENTER
                      })
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 5.3,
                      type: WidthType.PERCENTAGE
                    }
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text:
                          (objective['619808533610'][1] &&
                            objective['619808533610'][1].assessment) ||
                          '',
                        alignment: AlignmentType.LEFT
                      })
                    ],
                    verticalAlign: VerticalAlign.TOP,
                    width: {
                      size: 21,
                      type: WidthType.PERCENTAGE
                    }
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        text:
                          (objective['619808533610'][1] &&
                            objective['619808533610'][1].score) ||
                          '',
                        alignment: AlignmentType.CENTER
                      })
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 5.3,
                      type: WidthType.PERCENTAGE
                    }
                  })
                ]
              });
            })
          ]
        }),
        new Paragraph({
          children: [new TextRun('')]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({
              bold: true,
              text: '入 职 培 训（必 修）  Orientation Training',
              color: '000000'
            })
          ]
        }),
        new Table({
          width: {
            size: 9070,
            type: WidthType.DXA
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: '序号',
                          bold: true
                        })
                      ]
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER,
                  width: {
                    size: 480,
                    type: WidthType.DXA
                  }
                }),
                ...employeeOrientationtraining.map(item => {
                  return new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: item.text,
                            bold: true
                          })
                        ]
                      })
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 2863,
                      type: WidthType.DXA
                    }
                  });
                })
              ],
              tableHeader: true
            }),
            ...this.state.orientationTraining.map((objective, index) => {
              return new TableRow({
                cantSplit: true,
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: index + 1 + '',
                        alignment: AlignmentType.CENTER
                      })
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 480,
                      type: WidthType.DXA
                    }
                  }),
                  ...employeeOrientationtraining.map(item => {
                    return new TableCell({
                      children: [
                        new Paragraph({
                          text: objective[item.field],
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      width: {
                        size: 2863,
                        type: WidthType.DXA
                      },
                      verticalAlign: VerticalAlign.CENTER
                    });
                  })
                ]
              });
            })
          ]
        }),
        new Paragraph({
          children: [new TextRun('')]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({
              bold: true,
              text: '内 训 课 程  Internal Training',
              color: '000000'
            })
          ]
        }),
        new Table({
          width: {
            size: 9070,
            type: WidthType.DXA
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: '序号',
                          bold: true
                        })
                      ]
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER,
                  width: {
                    size: 480,
                    type: WidthType.DXA
                  }
                }),
                ...employeeInternaltraining.map(item => {
                  return new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: item.text,
                            bold: true
                          })
                        ]
                      })
                    ],
                    width: {
                      size: 2863,
                      type: WidthType.DXA
                    }
                  });
                })
              ],
              verticalAlign: VerticalAlign.CENTER,
              tableHeader: true
            }),
            ..._internalTrainnings.map((objective, index) => {
              return new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: index + 1 + '',
                        alignment: AlignmentType.CENTER
                      })
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 480,
                      type: WidthType.DXA
                    }
                  }),
                  ...employeeInternaltraining.map(item => {
                    let text = objective[item.field] || '';
                    if (item.isDate && text) {
                      text = text.substring(0, 10);
                    }
                    return new TableCell({
                      children: [
                        new Paragraph({
                          text,
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      width: {
                        size: 2863,
                        type: WidthType.DXA
                      },
                      verticalAlign: VerticalAlign.CENTER
                    });
                  })
                ],
                cantSplit: true
              });
            })
          ]
        }),
        new Paragraph({
          children: [new TextRun('')]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({
              bold: true,
              text: '在 岗 培 训  On-the-job Training',
              color: '000000'
            })
          ]
        }),
        new Table({
          width: {
            size: 9070,
            type: WidthType.DXA
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: '序号',
                          bold: true
                        })
                      ]
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER,
                  width: {
                    size: 480,
                    type: WidthType.DXA
                  }
                }),
                ...employeeOnjobtraining.map(item => {
                  return new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: item.text,
                            bold: true
                          })
                        ]
                      })
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 2147,
                      type: WidthType.DXA
                    }
                  });
                })
              ],
              tableHeader: true
            }),
            ...this.state.onTheJobTraining.map((objective, index) => {
              return new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: index + 1 + '',
                        alignment: AlignmentType.CENTER
                      })
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 480,
                      type: WidthType.DXA
                    }
                  }),
                  ...employeeOnjobtraining.map(item => {
                    return new TableCell({
                      children: [
                        new Paragraph({
                          text: objective[item.field]
                            ? objective[item.field]
                            : '',
                          alignment: AlignmentType.CENTER
                        })
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                      width: {
                        size: 2147,
                        type: WidthType.DXA
                      }
                    });
                  })
                ],
                cantSplit: true
              });
            })
          ]
        }),
        new Paragraph({
          children: [new TextRun('')]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({
              bold: true,
              text: '辅 导 记 录  Mentorship Record',
              color: '000000'
            })
          ]
        }),
        new Table({
          width: {
            size: 9070,
            type: WidthType.DXA
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: '序号',
                          bold: true
                        })
                      ]
                    })
                  ],
                  verticalAlign: VerticalAlign.CENTER,
                  width: {
                    size: 480,
                    type: WidthType.DXA
                  }
                }),
                ...employeeMentorshipRecord.map(item => {
                  return new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: item.text,
                            bold: true
                          })
                        ]
                      })
                    ],
                    width: {
                      size: 2867,
                      type: WidthType.DXA
                    }
                  });
                })
              ],
              verticalAlign: VerticalAlign.CENTER,
              tableHeader: true
            }),
            ...this.state.mentorshipRecord.map((objective, index) => {
              return new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        text: index + 1 + '',
                        alignment: AlignmentType.CENTER
                      })
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                    width: {
                      size: 480,
                      type: WidthType.DXA
                    }
                  }),
                  ...employeeMentorshipRecord.map(item => {
                    let text = '';
                    text = objective[item.field] ? objective[item.field] : '';
                    if (item.text === '状态') {
                      text =
                        objective[item.field] === 'Y' ? '已确认' : '待确认';
                    }
                    if (item.isDate && text) {
                      text = text.substring(0, 10);
                    }
                    const maxLen = 30;
                    const num = Math.ceil(text.length / maxLen);
                    const children = [];
                    for (let index = 1; index <= num; index++) {
                      const start = (index - 1) * maxLen;
                      const end = index * maxLen;
                      children.push(
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: text.substring(start, end),
                              break: 1
                            })
                          ],
                          alignment: AlignmentType.CENTER
                        })
                      );
                    }
                    return new TableCell({
                      children,
                      width: {
                        size: 2867,
                        type: WidthType.DXA
                      },
                      verticalAlign: VerticalAlign.CENTER
                    });
                  })
                ],
                cantSplit: true
              });
            })
          ]
        }),
        new Paragraph({
          children: [new TextRun('')]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({
              bold: true,
              text: '试 用 期 个 人 小 结  Individual Summary',
              color: '000000'
            })
          ]
        }),

        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: employeeInformation.smmary || '' })
                      ]
                    })
                  ],
                  width: {
                    size:
                      employeeInformation.smmary &&
                        employeeInformation.smmary.length > 61
                        ? 9070
                        : 9070,
                    type: WidthType.DXA
                  }
                })
              ],
              cantSplit: true,
              height: {
                height: 1000
              }
            })
          ]
        }),
        new Paragraph({
          children: [new TextRun('')]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({
              bold: true,
              text: '试 用 期 主 管 评 价 Supervisor Evaluation',
              color: '000000'
            })
          ]
        }),
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun(employeeInformation.directorEvaluate || '')
                      ]
                    })
                  ],
                  width: {
                    size:
                      employeeInformation.directorEvaluate &&
                        employeeInformation.directorEvaluate.length > 61
                        ? 9070
                        : 9070,
                    type: WidthType.DXA
                  }
                })
              ],
              cantSplit: true,
              height: {
                height: 1000
              }
            })
          ]
        }),
        new Paragraph({
          children: [new TextRun('')]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({
              bold: true,
              text: '试 用 期 经 理 / 总 监 评 价  Manager Evaluation',
              color: '000000'
            })
          ]
        }),

        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun(employeeInformation.ManagerEvaluate || '')
                      ]
                    })
                  ],
                  width: {
                    size:
                      employeeInformation.ManagerEvaluate &&
                        employeeInformation.ManagerEvaluate.length > 61
                        ? 9070
                        : 9070,
                    type: WidthType.DXA
                  }
                })
              ],
              cantSplit: true,
              height: {
                height: 1000
              }
            })
          ]
        }),
        new Paragraph({
          children: [new TextRun('')]
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          children: [
            new TextRun({
              bold: true,
              text: '试 用 期 HR 经 理 评 价  HR Manager Evaluation',
              color: '000000'
            })
          ]
        }),
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun(employeeInformation.hrManagerEvaluate || '')
                      ]
                    })
                  ],
                  width: {
                    size:
                      employeeInformation.hrManagerEvaluate &&
                        employeeInformation.hrManagerEvaluate.length > 61
                        ? 9070
                        : 9070,
                    type: WidthType.DXA
                  }
                })
              ],
              cantSplit: true,
              height: {
                height: 1000
              }
            })
          ]
        })
      ]
    });
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, '新员工试用期考核表.docx');
    });
  };
  render() {
    const { roleName } = this.props;
    const { loading, employeeInformation, approveNodes } = this.state;
    const editable = employeeInformation.regStatus === '待转正';
    return (
      <Spin spinning={loading}>
        <div id="probation-forms-print">
          <div id="probation-forms">
            {this.props.roleName !== '员工' && (
              <div
                className="probation-forms_goback toHide"
                onClick={this.props.goBack}
              >
                <Icon type="rollback" style={{ color: '#999' }} />
              </div>
            )}
            <header>
              <h1>新员工试用期考核表</h1>
              <p>New&nbsp;Employee&nbsp;Probation&nbsp;Appraisal&nbsp;Form</p>
            </header>
            <main className="probation-forms_main">
              <div className="probation-forms_main_tables">
                <EmployeeInformation
                  employeeInformation={employeeInformation}
                  tutorships={this.state.tutorships}
                  setTutorship={this.setTutorship}
                  setTutorship2={this.setTutorship2}
                  setTutorshipSemi={this.setTutorshipSemi}
                  setTutorshipSemi2={this.setTutorshipSemi2}
                  isSemi={this.isSemi}
                  isSemi2={this.isSemi2}
                  roleName={roleName}
                  editable={editable}
                  approveNodes={approveNodes}
                />
                <ProbationObjectives
                  probationObjectives={this.state.probationObjectives}
                  addObjective={this.addObjective}
                  removeObjective={this.removeObjective}
                  modifyObjective={this.modifyObjective}
                  roleName={roleName}
                  majorName={employeeInformation.director}
                  openModifyProbationObjectiveModal={
                    this.openModifyProbationObjectiveModal
                  }
                  auth={this.state.tableAuth.objective}
                  editable={editable}
                />
                <OrientationTraining
                  orientationTraining={this.state.orientationTraining.map(
                    (item, index) => ({ ...item, no: index + 1 })
                  )}
                  roleName={roleName}
                  editable={editable}
                />
                <InternalTraining
                  setInterDetailVis={this.setInterDetailVis}
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
                  openModifyOnJobTrainingModal={
                    this.openModifyOnJobTrainingModal
                  }
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
                  loadingConfirm={this.state.loadingConfirm}
                  roleName={roleName}
                  auth={this.state.tableAuth.mentorRecord}
                  editable={editable}
                />
                <IndividualSummary
                  summary={employeeInformation.smmary}
                  directorEvaluate={employeeInformation.directorEvaluate}
                  managerEvaluate={employeeInformation.ManagerEvaluate}
                  hrManagerEvaluate={employeeInformation.hrManagerEvaluate}
                  endTime={employeeInformation.endTime}
                  summaryChange={this.summaryChange}
                  directorEvaluateChange={this.directorEvaluateChange}
                  managerEvaluateChange={this.managerEvaluateChange}
                  hrManagerEvaluateChange={this.hrManagerEvaluateChange}
                  roleName={roleName}
                  editable={editable}
                  C3_622649502021={employeeInformation.C3_622649502021}
                />
              </div>
              <aside className="probation-forms_main_sider toHide">
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
          </div>
        </div>

        {!loading && (
          <footer
            className="probation-forms_footer"
            style={roleName === '辅导员' ? { display: 'none' } : {}}
          >
            {/* 待转正状态 */}
            {(roleName === 'HR' ||
              employeeInformation.regStatus === '待转正') &&
              employeeInformation.C3_622649502021 != 'Y' && (
                <div>
                  <Button
                    type="primary"
                    style={{ marginRight: 16 }}
                    onClick={() => {
                      //辅导记录为空不可以提交
                      const isFilled =
                        this.state.mentorshipRecord.length === 0
                          ? false
                          : this.state.mentorshipRecord.find(item => {
                            return (
                              item.instructionRecord === undefined ||
                              item.editDate === undefined
                            );
                          });
                      if (isFilled) {
                        message.info('请将辅导记录和日期填写完整');
                        return;
                      } else {
                        this.handleSubmit(roleName);
                      }
                    }}
                  >
                    保存
                  </Button>
                  {roleName === 'HR' &&
                    this.state.flagHitBack == true &&
                    this.state.flagAlreadyHit == 0 ? (
                      <span>
                        <Button
                          style={{ marginRight: '8px' }}
                          onClick={this.agreeApply}
                        >
                          同意自定义辅导员
                      </Button>
                        <Button onClick={this.disagreeApply} type="danger">
                          驳回自定义辅导员
                      </Button>
                      </span>
                    ) : (
                      ''
                    )}
                  {
                    <span style={{ color: 'red' }}>
                      {this.state.flagAlreadyHit == 2
                        ? '该记录的自定义辅导员申请已经驳回'
                        : ''}
                    </span>
                  }
                </div>
              )}
            {/* 角色为员工且转正申请未提交 */}
            {/* {roleName === '员工' && */}
            {employeeInformation.regStatus === '待转正' &&
              employeeInformation.C3_622649502021 != 'Y' && (
                <>
                  <Popconfirm
                    title="确认提交转正申请？"
                    onConfirm={this.positiveApply}
                  >
                    <Button
                      type="primary"
                      loading={this.state.loading}
                      style={{ marginRight: 16 }}
                    >
                      申请转正
                    </Button>
                  </Popconfirm>
                  <span>
                    填写内容后请点击“<b style={{ color: '#1890ff' }}>保存</b>
                    ”，所有试用期内容完成后并保存后再“
                    <b style={{ color: '#1890ff' }}>申请转正</b>”。
                  </span>
                </>
              )}
            {/* 角色为员工且转正申请已经提交 */}
            {roleName === '员工' &&
              employeeInformation.regStatus === '待转正' &&
              employeeInformation.C3_622649502021 == 'Y' && (
                <span style={{ color: 'red' }}>转正申请已经提交</span>
              )}
            {/* 转正中 */}
            {employeeInformation.regStatus === '转正中' &&
              ((roleName === '主管' && employeeInformation.isRegular !== 'Y') ||
                (roleName === '经理' &&
                  employeeInformation.isManagerRegular !== 'Y') ||
                (roleName === 'HR经理' &&
                  employeeInformation.hrManagerApprove !== 'Y') ||
                (roleName === '总监' &&
                  employeeInformation.driectorApprove !== 'Y')) && (
                <React.Fragment>
                  <Button
                    type="primary"
                    style={{ marginRight: 16 }}
                    onClick={() => {
                      let canSubmit = true;
                      if (
                        this.props.roleName === '主管' &&
                        (employeeInformation.directorEvaluate === '' ||
                          employeeInformation.directorEvaluate === null)
                      ) {
                        canSubmit = false;
                        message.info('请填写试用期主管评价');
                      } else if (
                        this.props.roleName === '经理' &&
                        (employeeInformation.ManagerEvaluate === '' ||
                          employeeInformation.ManagerEvaluate === null)
                      ) {
                        canSubmit = false;
                        message.info('请填写试用期经理/总监评价');
                      } else if (
                        this.props.roleName === 'HR经理' &&
                        (employeeInformation.hrManagerEvaluate === '' ||
                          employeeInformation.hrManagerEvaluate === null)
                      ) {
                        canSubmit = false;
                        message.info('请填写试用期HR经理评价');
                      }
                      // return;
                      canSubmit && this.isAgree(true);
                    }}
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

            <Button style={{ marginLeft: 8 }} onClick={this.exportWord}>
              导出Word
            </Button>
          </footer>
        )}

        <Modal
          title="内训课程详细"
          visible={this.state.interDetailVis}
          onCancel={() => this.setInterDetailVis(false)}
          footer={null}
          destroyOnClose
          width={'calc(80vw + 48px)'}
        >
          <TableData
            resid={626260756738}
            cmswhere={`C3_613941384832 = ${this.state.memIDOrg}`}
            width={'80vw'}
            hasRowDelete={false}
            hasRowModify={false}
            hasRowSelection={false}
            hasRowView={false}
            hasDelete={false}
            hasModify={false}
            hasAdd={false}
            height={'60vh'}
          />
        </Modal>
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
                onSearch={val => { }}
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
                          teacher: item.C3_610390419677,
                          courseName: item.C3_609845305680
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
                onSearch={val => { }}
                value={this.state.modifyInternalCourseData.course}
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
                          course: item.C3_609845305680,
                          trainer: item.C3_610390419677,
                          courseId: item.C3_609845305868
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
                style={{ width: 200 }}
                placeholder="请输入培训师工号或姓名"
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
                  <Option key={d.key}>{d.label + ' - ' + d.memberId}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              培训师2(选填):
            </Col>
            <Col span={12}>
              <Select
                style={{ width: 200 }}
                placeholder="请输入培训师2工号或姓名"
                showSearch
                filterOption={false}
                onSearch={this.fetchUser}
                onChange={v => {
                  this.setState({
                    addOnJobTrainingData: {
                      ...this.state.addOnJobTrainingData,
                      trainMember: v.label,
                      trainMemberId2: v.key
                    }
                  });
                }}
                labelInValue
                loading={this.state.fetching}
              >
                {this.state.trainerData.map(d => (
                  <Option key={d.key}>{d.label + ' - ' + d.memberId}</Option>
                ))}
              </Select>
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
                style={{ width: 200 }}
                placeholder="请输入培训师工号或姓名"
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
                  <Option key={d.key}>{d.label + ' - ' + d.memberId}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row className="probation-forms_modal_inputrow">
            <Col span={4} offset={4}>
              培训师2(选填):
            </Col>
            <Col span={12}>
              <Select
                style={{ width: 200 }}
                placeholder="请输入培训师2工号或姓名"
                showSearch
                filterOption={false}
                onSearch={this.fetchUser}
                value={{
                  label: this.state.modifyOnJobTrainingData.trainMember,
                  key: this.state.modifyOnJobTrainingData.trainMemberId2
                }}
                onChange={v => {
                  this.setState({
                    modifyOnJobTrainingData: {
                      ...this.state.modifyOnJobTrainingData,
                      trainMember: v.label,
                      trainMemberId2: v.key
                    }
                  });
                }}
                labelInValue
                loading={this.state.fetching}
              >
                {this.state.trainerData.map(d => (
                  <Option key={d.key}>{d.label + ' - ' + d.memberId}</Option>
                ))}
              </Select>
            </Col>
          </Row>
          {/* <Row className="probation-forms_modal_inputrow">
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
          </Row> */}
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
            cmswhere={`C3_678454213113 = '${employeeInformation[memberSemiId]}'`}
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
            // cmswhere={`memberId = '${this.state.employeeInformation.memberId}'`}
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
