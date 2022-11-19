import React from 'react';
import {
  Tabs,
  Select,
  Input,
  Card,
  Radio,
  Button,
  Divider,
  Timeline,
  message,
  Modal,
  Popconfirm,
  Upload,
  Icon,
  Empty,
  Table,
  Tooltip,
  Steps,
  Popover,
  Pagination
} from 'antd';
import moment from 'moment';
import './EmployeeCourses.less';
import { uploadFile } from '../../../util/api';
import http from 'Util20/api';
import { TableData } from '../../common/loadableCommon';
import Calendar from 'ic-components/lib/Calendar';
import 'ic-components/lib/Calendar/style/index.less';
import qs from 'qs';
import CourseDetail from './CourseDetail';
import CourseApply from './CourseApply';
import FeedBackAndPlan from './FeedBackAndPlan/FeedBackAndPlan';
import EmployeeApplyCourse from './EmployeeApplyCourse';

const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;
const { Step } = Steps;
const resid = '615378031605'; //课程明细表id
const TIPS_RESID = '614964195659'; //心得表id
const YEAR_RESID = '611077132065'; //财年表id
const REVIEW_RECOR_RESID = '615663201836'; // 申请单审批记录表id  C3_615657103208 课程安排明细编号
const TABBARSTYLE = {
  display: 'flex',
  justifyContent: 'space-around'
};
const CardIconStyle = {
  fontSize: 16,
  paddingLeft: 8
};

const columns = [
  {
    title: '审批人',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '工号',
    dataIndex: 'employeeID',
    key: 'employeeID'
  },
  {
    title: '审批结果',
    dataIndex: 'result',
    key: 'result'
  },
  {
    title: '审批时间',
    dataIndex: 'time',
    key: 'time'
  }
];

const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

/**
 * 我的课程
 * @author 邓铭
 */
class EmployeeCourses extends React.Component {
  state = {
    currentPage: 1, //当前页码
    CoursesOrg: [], //分页判断的原始数据
    pageSize: 3, //分页大小
    myCourses: [], //我的课程
    selectedCourse: {}, //选中的课程
    approvalRecords: [], //申请单审批记录
    calendarEvents: [], //日历事件
    wid: '80%',
    applyVisible: false, //申请模态框
    feebackVisible: false, // 反馈和行动计划模态框
    applyModalMode: 'view', // 申请单的操作，默认为查看
    feedbackModalMode: 'view', // 反馈的操作，默认为查看
    tipsModalMode: 'view', // 心得的操作，默认为查看
    ReviewRecordModalVisible: false, //申请单审批记录模态窗显示状态
    tipsModalVisible: false, // 心得模态窗显示状态
    extraCost: '', //附加费用
    //提交心得时的数据
    tip: {
      title: '',
      tips: ''
    },
    selcetedTip: {}, //要显示的心得体会
    currentYear: {}, //当前财年
    years: [], //所有财年
    selectedYear: '', //下拉选中的财年
    selcetedCourseType: 'all', //下拉选中的课程类型
    searchKey: '', //搜索的关键字
    // 内训评分
    rate: {
      rate1: 5,
      rate2: 5,
      rate3: 5,
      rate4: 5,
      rate5: 5,
      rate6: 5,
      rate7: 5,
      rate8: 5
    },
    // 外训评分
    rateOut: {
      rate1: 5,
      rate2: 5,
      rate3: 5,
      rate4: 5
    },
    //员工对课程的建议（评价）
    internalTrainingOtherAdvice: {
      advantages: '', //有收获的内容
      shortcommings: '' //课程缺点
    },
    knowledge: [''], //课程学到的知识点
    plans: [''], //课程行动计划
    fileList: [],
    isfirst: true, //是否首次加载组件
    loadings: {
      submitTipLoading: false,
      submitPlanBtnLoading: false,
      submitApplyBtnLoading: false
    }
  };

  componentDidMount = async () => {
    await this.getYears();
    this.getCourses();
  };

  /**
   * 课程卡片位置调整
   */
  performCard = () => {
    var l = this.state.myCourses.length;
    var w = Number(window.innerWidth);
    if (l == 0 || l * 376 < w) {
      this.setState({ windowShow: { justifyContent: 'center' } });
    }
  };

  /**
   * 获取所有课程
   */
  getCourses = async () => {
    let res,
      { currentYear } = this.state;
    try {
      res = await http().getRecordAndSubTables({
        resid: resid,
        cmswhere: `C3_613941384328 = '${currentYear.C3_611070959393}'`,
        subresid: '622466450977',
        getsubresource: 1
      });
      let myCourses = res.data;
      if (myCourses.length > 0) {
        const qsObj = qs.parse(window.location.search.substring(1));
        //url中可能带有课程id
        const { targetId } = qsObj;
        let target = myCourses.find(
          item => item.REC_ID.toString() === targetId
        );
        let selectedCourse = {};
        if (target) {
          //如有url中的课程则选中该课程
          target.checked = true;
          selectedCourse = { ...target };
        } else {
          //否则选中第一个
          myCourses[0].checked = true;
          selectedCourse = { ...myCourses[0] };
        }
        //日历事件
        let importantIndex = 0;
        let calendarEvents = myCourses.map(item => {
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
            event_important: ++importantIndex,
            category_name: item.C3_613941384592
          };
        });
        this.setState({ myCourses, selectedCourse, calendarEvents });
        this.setState({ CoursesOrg: this.state.myCourses });
        var urlID = qsObj.targetId;
        // 获取邮件传来的ID
        if (urlID) {
          this.onPageChange(1, 3, urlID);
        } else {
          this.onPageChange(1, 3);
        }
      }
      this.performCard();
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  /**
   * 获取财年
   */
  getYears = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: YEAR_RESID
      });
      let years = [...res.data];
      let currentYear = years.find(item => item.C3_611264740419 === 'Y');
      this.setState({
        years,
        currentYear,
        selectedYear: currentYear.C3_611070959393
      });
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  /**
   * 搜索课程
   *
   */
  searchMyCourse = async () => {
    let res;
    try {
      let { selcetedCourseType, selectedYear, searchKey } = this.state;
      let cmswhere = `C3_613941384328 = '${selectedYear}' `;
      if (selcetedCourseType !== 'all') {
        cmswhere += `AND courseType = '${selcetedCourseType}'`;
      }
      res = await http().getTable({
        resid: resid,
        cmswhere,
        key: searchKey
      });
      // message.success(res.message);
      let myCourses = [...res.data];
      if (myCourses.length > 0) {
        myCourses[0].checked = true;
        let selectedCourse = { ...myCourses[0] };
        var org = myCourses;
        this.setState({ CoursesOrg: org });

        var result = org.slice(0, this.state.pageSize);
        this.setState({ myCourses: result, currentPage: 1, selectedCourse });
        // this.setState({ myCourses, selectedCourse });
      } else {
        this.setState({ myCourses: [], selectedCourse: {} });
      }
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  };

  /**
   * 根据选中的课程获取心得
   */
  getTip = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: TIPS_RESID,
        cmswhere: `C3_615479417558 = ${this.state.selectedCourse.CourseArrangeDetailID}`
      });

      if (res.data.length > 0) {
        this.setState({
          selcetedTip: { ...res.data[0] },
          tipsModalVisible: true
          // tipsModalMode: 'view'
        });
      }
      return res;
    } catch (error) {
      console.log(error.message);
      message.error(error.message);
      throw error;
    }
  };

  /**
   * 获取审批记录
   */
  getApprovalRecords = async () => {
    try {
      const { selectedCourse } = this.state;
      const res = await http().getTable({
        resid: REVIEW_RECOR_RESID,
        cmswhere: `C3_615657103208 = ${selectedCourse.CourseArrangeDetailID} `
      });
      let approvalRecords = res.data.map(item => {
        let result = '';
        if (item.C3_615657104736) {
          if (item.C3_615657104736 === 'Y') {
            result = '通过';
          }
          if (item.C3_615657104736 === 'N') {
            result = '拒绝';
          }
        } else {
          result = '审核中';
        }
        let str = item.C3_615657104984;
        if (str) {
          if (str.length > 10) {
            str = item.C3_615657104984.substring(0, 10)
          }
        }
        return {
          name: item.C3_615657104492,
          employeeID: item.C3_615657105254,
          time: str,
          result
        };
      });
      console.log('当前', selectedCourse)
      let last_result = '';
      if (selectedCourse.C3_623173774889) {
        if (selectedCourse.C3_623173774889 === 'Y') {
          last_result = '通过';
        }
        if (selectedCourse.C3_623173774889 === 'N') {
          last_result = '拒绝';
        }
      } else {
        last_result = '审核中';
      }
      let str = '';
      if (selectedCourse.passTime) {
        str = selectedCourse.passTime.substring(0, 10)
      }
      approvalRecords.push({
        name: selectedCourse.HRName,
        employeeID: selectedCourse.HRNum,
        time: str,
        result: last_result
      });
      this.setState({
        approvalRecords
      });
    } catch (error) {
      console.log(error.message);
      message.error(error.message);
    }
  };

  /**
   * 课程评分变化时调用（传递给子组件使用）
   */
  setRate = async rate => {
    if (this.state.selectedCourse.courseType === '内训') {
      this.setState({ rate });
    } else {
      this.setState({
        rate
      });
    }
  };

  setKnowledge = knowledge => this.setState({ knowledge });

  setPlans = plans => this.setState({ plans });

  setOtherAdvice = advice => {
    this.setState({
      internalTrainingOtherAdvice: advice
    });
  };

  /**
   * 点击选中课程
   */
  handleSelectCourse = item => {
    let myCourses = [...this.state.myCourses];
    myCourses.forEach(course => {
      course.checked = false;
    });
    let CoursesOrg = [...this.state.CoursesOrg];
    CoursesOrg.forEach(course => {
      course.checked = false;
    });

    myCourses.find(course => {
      return course.REC_ID === item.REC_ID;
    }).checked = true;
    let selectedCourse = { ...item };
    this.setState({ myCourses, selectedCourse, CoursesOrg });
  };

  handleDetailClick = () => {
    this.setState({
      visible: true
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
      feebackVisible: false,
      feedbackModalMode: 'view'
    });
  };
  handleOk = () => {
    this.setState({
      visible: false,
      feebackVisible: false
    });
  };
  handleFileChange = info => {
    console.log(info);
    let { file, fileList } = info;
    // if (file.status === 'removed') {
    //   this.setState({
    //     fileList: fileList.filter(item => item.uid !== file.uid)
    //   });
    // } else {
    this.setState({ fileList });
    // }
  };
  handleOpenAppAndFeeback = () => {
    this.setState({
      applyVisible: true
    });
  };
  handleApplyOk = () => {
    this.setState({
      applyVisible: false,
      approvalRecords: []
    });
  };
  handleApplyCancel = () => {
    this.setState({
      applyVisible: false,
      applyModalMode: 'view',
      approvalRecords: []
    });
  };
  closeCourseDetailOpenApply = () => {
    this.getApprovalRecords();

    this.setState({
      visible: false,
      applyVisible: true
    });
  };

  /**
   * 关闭详情 打开反馈模态框
   */
  closeCourseDetailOpenFeeback = () => {
    this.setState({
      visible: false,
      feebackVisible: true
    });
  };

  closeCourseDetailOpenTip = () => {
    this.setState(
      {
        visible: false,
        tipsModalMode: 'view'
      },
      this.getTip
    );
  };

  /**
   * 提交申请单
   */
  submitApply = async () => {
    let res,
      record = { ...this.state.selectedCourse },
      extraCharge = this.state.extraCost;
    this.setState({
      loadings: {
        ...this.state.loadings,
        submitApplyBtnLoading: true
      }
    });
    try {
      res = await http().modifyRecords({
        resid: resid,
        data: [{ REC_ID: record.REC_ID, C3_615488174421: 'Y', extraCharge }]
      });
      message.success(res.message);
      let myCourses = [...this.state.myCourses],
        selectedCourse = { ...res.data[0], checked: true };
      myCourses[
        myCourses.findIndex(item => item.REC_ID === selectedCourse.REC_ID)
      ] = selectedCourse;
      this.setState({
        applyVisible: false,
        applyModalMode: 'view',
        extraCost: '',
        myCourses,
        selectedCourse
      });
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
    this.setState({
      loadings: {
        ...this.state.loadings,
        submitApplyBtnLoading: false
      }
    });
  };

  /**
   * 打开填写心得模态窗
   */
  openWriteTip = async () => {
    this.setState({
      tipsModalVisible: true,
      tipsModalMode: 'modify'
    });
    let res;
    try {
      res = await this.getTip();
      if (res.data.length > 0) {
        let tip = {
          title: res.data[0].C3_614964239022
          // tips: res.data[0].C3_614964225030,
        };
        const fileList = res.data[0].Filepath.split(',').map((item, index) => {
          return {
            url: item,
            status: 'done',
            name: `附件${index + 1}`,
            uid: -index - 1
          };
        });
        console.log(tip, fileList);
        this.setState({ tip, fileList });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  /**
   * 点击保存心得
   */
  onSaveTip = async () => {
    let res,
      tip = { ...this.state.tip };
    if (tip.title.trim() === '') {
      return message.error('标题不能为空');
    }
    try {
      res = await this.saveTip(tip, false);
      this.setState({
        tipsModalVisible: false,
        tipsModalMode: 'view',
        tip: { title: '', tips: '' }
      });
      message.success('保存成功，请下次记得提交');
    } catch (error) {
      message.error(error.message);
    }
  };

  /**
   * 调用后端接口保存心得
   */
  saveTip = async (tip, isSubmit) => {
    let res;
    let Filepath = '';
    this.state.fileList.forEach(file => {
      Filepath += file.url + ',';
    });
    Filepath = Filepath.substring(0, Filepath.length - 1);
    try {
      res = await http().addRecords({
        resid: TIPS_RESID,
        data: [
          {
            C3_614964239022: tip.title,
            C3_614964225030: tip.tips,
            C3_614964322197: isSubmit ? 'Y' : '',
            Filepath: Filepath,
            C3_615479417558: this.state.selectedCourse.CourseArrangeDetailID
          }
        ],
        isEditOrAdd: true
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  /**
   * 提交心得
   */
  submitTip = async () => {
    let tip = { ...this.state.tip },
      res;
    if (tip.title.trim() === '') {
      return message.error('标题不能为空');
    }
    try {
      this.setState({
        loadings: {
          ...this.state.loadings,
          submitTipLoading: true
        }
      });
      res = await this.saveTip(tip, true);
      message.success(res.message);
      await this.getCourseById();
      this.setState({
        tipsModalVisible: false,
        tipsModalMode: 'view',
        tip: { title: '', tips: '' },
        loadings: {
          ...this.state.loadings,
          submitTipLoading: true
        }
      });
    } catch (error) {
      console.log(error.message);
      message.error(error.message);
    }
  };

  /**
   * 根据课程明细id获取，用于提交心得后刷新数据
   */
  getCourseById = async () => {
    let res,
      { selectedCourse } = this.state;
    try {
      res = await http().getTable({
        resid,
        cmswhere: `CourseArrangeDetailID = '${selectedCourse.CourseArrangeDetailID}'`
      });
      if (res.data.length > 0) {
        let myCourses = [...this.state.myCourses],
          selectedCourse = { ...res.data[0], checked: true };
        myCourses[
          myCourses.findIndex(item => item.REC_ID === selectedCourse.REC_ID)
        ] = selectedCourse;
        this.setState({ myCourses, selectedCourse });
      } else {
        message.error('获取课程失败！');
      }
    } catch (error) {
      console.log(error.message);
      message.error(error.message);
    }
  };

  /**
   * 点赞课程
   */
  likeCourse = async (data, index) => {
    try {
      let res = await http().modifyRecords({
        resid,
        data: [data]
      });
      let myCourses = [...this.state.myCourses];
      myCourses[index].isLike = res.data[0].isLike;
      this.setState({
        myCourses: myCourses
      });
    } catch (error) {
      console.log(error.message);
      message.error(error.message);
    }
  };

  /**
   * 关闭心得模态窗
   */
  onCloseTipModal = () =>
    this.setState({
      tipsModalVisible: false,
      tipsModalMode: 'view',
      tip: {
        title: '',
        tips: ''
      },
      selcetedTip: {}
    });

  /**
   * 提交评分和行动计划反馈
   */
  submitRate = async () => {
    const {
      rateOut,
      knowledge,
      plans,
      selectedCourse,
      rate,
      internalTrainingOtherAdvice
    } = this.state;

    if (
      selectedCourse.courseType === '外训' ||
      selectedCourse.courseType === '外聘内训'
    ) {
      let str1 = '';
      for (let index = 0; index < knowledge.length; index++) {
        if (knowledge[index].trim()) {
          knowledge[index] = knowledge[index].replace(';', '');
          if (index + 1 !== knowledge.length) {
            str1 += knowledge[index] + ';';
          } else {
            str1 += knowledge[index];
          }
        } else {
          return message.info(`第${index + 1}项知识点不能为空`);
        }
      }
      let str2 = '';
      for (let index = 0; index < plans.length; index++) {
        if (plans[index].trim()) {
          plans[index] = plans[index].replace(';', '');
          if (index + 1 !== plans.length) {
            str2 += plans[index] + ';';
          } else {
            str2 += plans[index];
          }
        } else {
          return message.info(`第${index + 1}项行动计划不能为空`);
        }
      }
      this.setState({
        loadings: {
          ...this.state.loadings,
          submitPlanBtnLoading: true
        }
      });
      let data = {
        courseArrange: this.state.selectedCourse.CourseArrangeDetailID,
        knowledge1: str1,
        action1: str2
      };
      let res; //反馈
      try {
        res = await http().addRecords({
          resid: 478367996508,
          data: [
            {
              C3_478368118696: this.state.selectedCourse.CourseArrangeDetailID, //  课程安排明细ID
              C3_615639978971: rate.rate1, //讲师备课充分，对授课内容非常了解
              C3_615640010121: rate.rate2, //本次培训的主题明确，逻辑清晰，内容充实，有针对性
              C3_615640043869: rate.rate3, //我所学到的内容对实际工作或个人发展有帮助
              C3_722076452880: rate.rate2_1,//有合适的课前调研，并且调研结果与课程内容联系紧密
              C3_722076492665: rate.rate2_2,//课程时长设置合适，课程进度不紧迫不冗长
              C3_722079578079: rate.rate3_1, //培训师具有足够的专业知识和经验
              C3_722079636630: rate.rate3_2, //培训师备课充分，对授课内容非常熟悉，课件设计美观大方
              C3_615640107592: rate.rate4, //培训师语言表达能力好，音量和语速适中，讲解清晰生动，能够运用肢体语言
              C3_615640157603: rate.rate5, //培训师能够引入实际案例和例证，讲解透彻，激发学员思考
              C3_615640180269: rate.rate6, //培训师能设置提问，小组讨论等互动环节，使学员积极参与其中
              C3_615640206802: rate.rate7, //培训师能够及时，认真地回答学员提出的问题
              C3_615640235456: rate.rate8, //时间控制合理使我感到舒适
              C3_722087822472: rate.rate9,//我对本次课程整体满意
              C3_722087862632: rate.rate10,//我愿意向朋友或同事推荐这门课程
              C3_722087899198: rate.rate11,//在培训过程中，培训组织者基于我足够的后勤支持
              C3_722087926763: rate.rate12,//培训场地设备设施完整无故障
            }
          ],
          isEditOrAdd: true
        });
      } catch (err) {
        message.error(err.message);
        console.log(err);
      }
      let res2; //行动计划
      try {
        res2 = await http().addRecords({
          resid: 615571557694,
          data: [data]
        });
        message.success(res2.message);
        this.setState({ feebackVisible: false, feedbackModalMode: 'view' });
        this.getCourseById();
      } catch (err) {
        message.error(err.message);
        console.log(err);
      }
    } else {
      //内训只提交反馈数据
      let res;
      try {
        if (
          internalTrainingOtherAdvice.advantages.trim() &&
          internalTrainingOtherAdvice.shortcommings.trim()
        ) {
          res = await http().addRecords({
            resid: 478367996508,
            data: [
              {
                C3_478368118696: this.state.selectedCourse
                  .CourseArrangeDetailID, //  课程安排明细ID
                C3_615639978971: rate.rate1, //讲师备课充分，对授课内容非常了解
                C3_615640010121: rate.rate2, //本次培训的主题明确，逻辑清晰，内容充实，有针对性
                C3_615640043869: rate.rate3, //我所学到的内容对实际工作或个人发展有帮助
                C3_722076452880: rate.rate2_1,//有合适的课前调研，并且调研结果与课程内容联系紧密
                C3_722076492665: rate.rate2_2,//课程时长设置合适，课程进度不紧迫不冗长
                C3_722079578079: rate.rate3_1, //培训师具有足够的专业知识和经验
                C3_722079636630: rate.rate3_2, //培训师备课充分，对授课内容非常熟悉，课件设计美观大方
                C3_615640107592: rate.rate4, //培训师语言表达能力好，音量和语速适中，讲解清晰生动，能够运用肢体语言
                C3_615640157603: rate.rate5, //培训师能够引入实际案例和例证，讲解透彻，激发学员思考
                C3_615640180269: rate.rate6, //培训师能设置提问，小组讨论等互动环节，使学员积极参与其中
                C3_615640206802: rate.rate7, //培训师能够及时，认真地回答学员提出的问题
                C3_615640235456: rate.rate8, //时间控制合理使我感到舒适
                C3_722087822472: rate.rate9,//我对本次课程整体满意
                C3_722087862632: rate.rate10,//我愿意向朋友或同事推荐这门课程
                C3_722087899198: rate.rate11,//在培训过程中，培训组织者基于我足够的后勤支持
                C3_722087926763: rate.rate12,//培训场地设备设施完整无故障
                C3_622216706104: internalTrainingOtherAdvice.advantages,
                C3_622216725340: internalTrainingOtherAdvice.shortcommings
              }
            ],
            isEditOrAdd: true
          });
          message.success(res.message);
          this.setState({ feebackVisible: false, feedbackModalMode: 'view' });
          this.getCourseById();
        } else {
          return message.info('收益内容与改进内容为必填项');
        }
      } catch (error) {
        message.error(error.message);
        console.log(error);
      }
    }
    this.setState({
      loadings: {
        ...this.state.loadings,
        submitPlanBtnLoading: false
      }
    });
  };

  /**
   * 页码变化
   */
  onPageChange = (v, s, REC_ID) => {
    var org = this.state.CoursesOrg;
    var res;
    if (REC_ID) {
      // 遍历找出选中项
      var n = 0;
      var r = 0;
      while (n < org.length) {
        if (org[n].REC_ID == REC_ID) {
          this.setState({ selectedCourse: org[n] });
          r = n;
        }
        n++;
      }
      r = Math.ceil((r + 1) / s);
      var res = org.slice(s * (r - 1), s * r);
      this.setState({ myCourses: res, currentPage: r });
    } else {
      res = org.slice(s * (v - 1), s * v);
      this.setState({ myCourses: res, selectedCourse: res[0], currentPage: v });
    }

    console.log('org', org);
  };

  /**
   * 每页显示多少变化
   */
  onScaleChange = (v, s) => {
    this.setState({ pageSize: s });
    this.onPageChange(v, s);
  };

  /**
   * 设置附加费用
   */
  setExtraCost = extraCost => {
    this.setState({ extraCost: parseFloat(extraCost) });
  };

  /**
   * 点击放弃
   */
  isAbandon = async () => {
    let res,
      record = { ...this.state.selectedCourse };

    try {
      res = await http().modifyRecords({
        resid: resid,
        data: [{ REC_ID: record.REC_ID, isAbandon: 'Y' }]
      });
      this.setState({
        applyVisible: false
      });
      message.success(res.message);
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  /**
   * 关闭反馈模态窗
   */
  handleCloseFeedBackModal = () => {
    this.setState({
      feebackVisible: false,
      feedbackModalMode: 'view',
      plans: [''],
      knowledge: ['']
    });
  };

  renderHeader = () => (
    <header className="emploee-courses_courses-manage-header">
      <Select
        className="emploee-courses_courses-manage-header-selector"
        value={this.state.selectedYear}
        onChange={e => {
          this.setState(
            {
              selectedYear: e
            },
            this.searchMyCourse
          );
        }}
      >
        {this.state.years.map(item => (
          <Option key={item.REC_ID} value={item.C3_611070959393}>
            {item.C3_611070959393}
          </Option>
        ))}
      </Select>
      <Select
        defaultValue="all"
        className="emploee-courses_courses-manage-header-selector"
        value={this.state.selcetedCourseType}
        onChange={e => {
          this.setState(
            {
              selcetedCourseType: e
            },
            this.searchMyCourse
          );
        }}
      >
        <Option value="all">内训/外训</Option>
        <Option value="外训">外训</Option>
        <Option value="内训">内训</Option>
        <Option value="外聘内训">外聘内训</Option>
      </Select>

      <Search
        className="emploee-courses_courses-manage-header-search"
        placeholder="请输入"
        onSearch={value =>
          this.setState({ searchKey: value }, this.searchMyCourse)
        }
        enterButton
        allowClear
      />
    </header>
  );

  renderCoursesList = () => {
    let { myCourses, selectedCourse } = this.state;
    return myCourses.length ? (
      myCourses.map((item, index) => (
        <Card
          // extra={<Radio checked={item.checked} />}
          extra={
            <Icon
              type="info-circle"
              style={CardIconStyle}
              onClick={() => {
                this.handleDetailClick();
              }}
            />
          }
          title={`${item.courseType} / ${item.C3_613941384592}`}
          className={`course-list_course-card ${
            item.REC_ID === selectedCourse.REC_ID ? 'checked' : ''
            }`}
          key={item.REC_ID}
          bodyStyle={{ padding: 16 }}
          headStyle={{ padding: '0 16px' }}
          bordered={false}
          onClick={this.handleSelectCourse.bind(this, item)}
        >
          <div className="emploee-courses_courses-manage_course-list_course-content">
            <div className="emploee-courses_courses-manage_course-list_course-content_items">
              <div className="course_item">
                讲师:
                <span style={{ paddingLeft: 12 }}>{item.C3_613941386081}</span>
              </div>
              <div className="course_item">
                地点:
                <span style={{ paddingLeft: 12 }}>{item.C3_613941386325}</span>
              </div>
              <div className="course_item">
                开始时间:
                <span style={{ paddingLeft: 12 }}>{item.C3_615393041304}</span>
              </div>
              <div className="course_item">
                结束时间:
                <span style={{ paddingLeft: 12 }}>{item.C3_615393093633}</span>
              </div>
            </div>
            <div>
              {item.isLike !== 'Y' && (
                <Popconfirm
                  title="确认点赞吗？"
                  onConfirm={() => {
                    this.likeCourse(
                      { REC_ID: item.REC_ID, isLike: 'Y' },
                      index
                    );
                  }}
                >
                  <Icon type="like" className="course-like" />
                  <p className="likeText">赞一下</p>
                </Popconfirm>
              )}
              {item.isLike === 'Y' && (
                <Tooltip title="已点赞课程">
                  <Icon type="like" theme="filled" className="course-like" />
                  <p className="likeText">已点赞</p>
                </Tooltip>
              )}
            </div>
          </div>
        </Card>
      ))
    ) : (
        <Empty style={{ marginTop: '100px' }}></Empty>
      );
  };
  render() {
    const { selectedCourse } = this.state;
    const { courseType } = selectedCourse;
    const now = moment();
    const isAfterStart =
      selectedCourse.C3_615393041304 &&
      now.isAfter(moment(selectedCourse.C3_615393041304));

    const isAfterEnd =
      selectedCourse.C3_615393093633 &&
      now.isAfter(moment(selectedCourse.C3_615393093633));
    return (
      <div className="emploee-courses">
        <Tabs defaultActiveKey="MyCourses" tabBarStyle={TABBARSTYLE}>
          <TabPane tab="报销单与发票" key="applyCourse">
            <EmployeeApplyCourse />
          </TabPane>
          <TabPane tab="课程管理" key="MyCourses">
            <div className="emploee-courses_courses-manage">
              {/* 选中的课程可用按钮 */}
              <div
                className={
                  this.state.myCourses.length > 0
                    ? 'emploee-courses_courses-manage_buttons'
                    : 'hidden'
                }
              >
                {courseType !== '内训' && (
                  <>
                    {/* 填写按钮 */}
                    {selectedCourse.C3_613956470258 === 'Y' &&
                      selectedCourse.C3_615377523072 !== 'Y' && (
                        <button
                          onClick={() => {
                            this.setState({
                              applyVisible: true,
                              applyModalMode: 'modify'
                            });
                          }}
                        >
                          提交申请
                        </button>
                      )}
                    {selectedCourse.C3_613961474297 === 'Y' &&
                      selectedCourse.C3_615377473913 === 'ing' &&
                      isAfterEnd && (
                        <button
                          onClick={() =>
                            this.setState({
                              feebackVisible: true,
                              feedbackModalMode: 'modify'
                            })
                          }
                        >
                          填写课程行动计划
                        </button>
                      )}
                    {courseType === '外训' &&
                      selectedCourse.C3_615377473913 === 'Y' &&
                      selectedCourse.isSubmitFeel === 'ing' && (
                        <button onClick={this.openWriteTip}>
                          填写心得体会(分享记录)
                        </button>
                      )}

                    {/* 查看按钮 */}
                    {selectedCourse.C3_615377523072 === 'Y' && (
                      <>
                        <button
                          onClick={() => {
                            this.getApprovalRecords();
                            this.setState({
                              applyVisible: true,
                              isfirst: false
                            });
                          }}
                        >
                          查看申请单
                        </button>
                        <button
                          onClick={() => {
                            this.setState({
                              ReviewRecordModalVisible: true
                            });
                          }}
                        >
                          查看审批记录
                        </button>
                      </>
                    )}
                    {selectedCourse.C3_615377473913 === 'Y' && (
                      <button
                        onClick={() => this.setState({ feebackVisible: true })}
                      >
                        查看课程行动计划
                      </button>
                    )}
                    {courseType === '外训' &&
                      selectedCourse.isSubmitFeel === 'Y' && (
                        <button
                          onClick={() => {
                            this.setState({ tipsModalMode: 'view' });
                            this.getTip();
                          }}
                        >
                          查看心得体会(分享记录)
                        </button>
                      )}
                  </>
                )}
                {courseType === '内训' &&
                  selectedCourse.isInnerFeedBack === 'ing' &&
                  isAfterEnd && (
                    <button
                      onClick={() =>
                        this.setState({
                          feebackVisible: true,
                          feedbackModalMode: 'modify'
                        })
                      }
                    >
                      填写课程反馈
                    </button>
                  )}
                {courseType === '内训' &&
                  selectedCourse.isInnerFeedBack === 'Y' && (
                    <button
                      onClick={() => this.setState({ feebackVisible: true })}
                    >
                      查看课程反馈
                    </button>
                  )}
              </div>
              <div
                className={
                  this.state.myCourses.length > 0
                    ? 'emploee-courses_courses-manage_course-steps'
                    : 'hidden'
                }
              >
                {courseType !== '内训' && (
                  <Steps progressDot={customDot}>
                    <Step
                      title="计划提交"
                      status={
                        selectedCourse.C3_615392983685 ? 'finish' : 'wait'
                      }
                      description={selectedCourse.C3_615392983685}
                    />
                    <Step
                      title="计划审批"
                      status={
                        selectedCourse.C3_615394023182 ? 'finish' : 'wait'
                      }
                      description={selectedCourse.C3_615394023182}
                    />
                    <Step
                      title="申请单提交"
                      status={
                        selectedCourse.C3_615377538264 ? 'finish' : 'wait'
                      }
                      description={selectedCourse.C3_615377538264}
                    />
                    <Step
                      title="申请单审批"
                      status={
                        selectedCourse.C3_615377747279 ? 'finish' : 'wait'
                      }
                      description={selectedCourse.C3_615377747279}
                    />
                    <Step
                      title="上课开始"
                      status={isAfterStart ? 'finish' : 'wait'}
                      description={selectedCourse.C3_615393041304}
                    />
                    <Step
                      title="上课结束"
                      status={isAfterEnd ? 'finish' : 'wait'}
                      description={selectedCourse.C3_615393093633}
                    />
                    <Step
                      title="课程行动计划"
                      status={
                        selectedCourse.C3_615377481222 ? 'finish' : 'wait'
                      }
                      description={selectedCourse.C3_615377481222}
                    />
                    {courseType === '外训' && (
                      <Step
                        title="心得体会(分享记录)"
                        status={
                          selectedCourse.submitFeelTime ? 'finish' : 'wait'
                        }
                        description={selectedCourse.submitFeelTime}
                      />
                    )}
                  </Steps>
                )}
                {courseType === '内训' && (
                  <Steps progressDot={customDot}>
                    <Step
                      title="报名"
                      status={
                        selectedCourse.C3_623960665038 ? 'finish' : 'wait'
                      }
                      description={selectedCourse.C3_623960665038}
                    />
                    <Step
                      title="上课开始"
                      status={isAfterStart ? 'finish' : 'wait'}
                      description={selectedCourse.C3_615393041304}
                    />
                    <Step
                      title="签到"
                      status={selectedCourse.signInTime ? 'finish' : 'wait'}
                      description={selectedCourse.signInTime}
                    />
                    <Step
                      title="上课结束"
                      status={isAfterEnd ? 'finish' : 'wait'}
                      description={selectedCourse.C3_615393093633}
                    />
                    <Step
                      title="课程反馈"
                      status={
                        selectedCourse.C3_615377481222 ? 'finish' : 'wait'
                      }
                      description={selectedCourse.C3_615377481222}
                    />
                  </Steps>
                )}
              </div>
              {this.renderHeader()}
              <div
                className="emploee-courses_courses-manage_course-list"
                style={this.state.windowShow}
              >
                {this.renderCoursesList()}
              </div>
              <footer>
                <p style={{ float: 'left' }}>
                  共
                  <span style={{ color: '#2593fc', fontSize: 24 }}>
                    {this.state.CoursesOrg.length}
                  </span>
                  条记录
                </p>
                <Pagination
                  size="small"
                  onShowSizeChange={(v, s) => {
                    this.onScaleChange(v, s);
                  }}
                  current={this.state.currentPage}
                  pageSize={this.state.pageSize}
                  onChange={(v, s) => {
                    this.onPageChange(v, s);
                  }}
                  total={this.state.CoursesOrg.length}
                  pageSizeOptions={['1', '2', '3', '4']}
                  showSizeChanger
                  showQuickJumper
                  style={{ float: 'left', margin: '8px 0 0 16px' }}
                />
              </footer>
            </div>
          </TabPane>
          <TabPane tab="课程日历" key="CoursesCalendar" forceRender>
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
        <Modal
          title="课程详情"
          visible={this.state.visible}
          width={this.state.wid}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          centered
        >
          <CourseDetail
            onCloseDetailOpenAppply={this.closeCourseDetailOpenApply}
            onCloseDetailOpenFeeback={this.closeCourseDetailOpenFeeback}
            onCloseCourseDetailOpenTip={this.closeCourseDetailOpenTip}
            onCourseType={
              this.state.selectedCourse && this.state.selectedCourse.courseType
            }
            course={this.state.selectedCourse}
          />
        </Modal>
        <Modal
          title=""
          visible={this.state.applyVisible}
          onCancel={this.handleApplyCancel}
          destroyOnClose
          width={this.state.wid}
          footer={
            this.state.applyModalMode === 'modify'
              ? [
                <Button
                  onClick={() => {
                    this.setState({
                      applyVisible: false,
                      applyModalMode: 'view',
                      extraCost: ''
                    });
                  }}
                >
                  关闭
                  </Button>,
                <Popconfirm
                  title="确认提交？"
                  okText="确认"
                  cancelText="取消"
                  onConfirm={this.submitApply}
                >
                  <Button
                    type="primary"
                    loading={this.state.loadings.submitApplyBtnLoading}
                  >
                    提交
                    </Button>
                </Popconfirm>,
                // <Popconfirm
                //   title="确定要放弃吗？"
                //   icon={
                //     <Icon type="question-circle-o" style={{ color: 'red' }} />
                //   }
                //   onConfirm={this.isAbandon}
                // >
                //   <Button type="danger">放弃</Button>
                // </Popconfirm>
              ]
              : [
                <Button
                  onClick={() => {
                    this.setState({
                      applyVisible: false,
                      applyModalMode: 'view',
                      extraCost: ''
                    });
                  }}
                >
                  关闭
                  </Button>,
                <Button
                  type="primary"
                  onClick={() => {
                    const bodyHtml = window.document.body.innerHTML;
                    window.document.body.innerHTML = this.printer.innerHTML;
                    window.print();
                    window.document.body.innerHTML = bodyHtml;
                    window.location.reload();
                  }}
                >
                  打印
                  </Button>
              ]
          }
        >
          <div id="apply-printer" ref={element => (this.printer = element)}>
            <div style={{ backgroundColor: '#fff', height: '100%' }}>
              <h2 style={{ textAlign: 'center' }}>培训申请单</h2>
              <CourseApply
                mode={this.state.applyModalMode}
                course={this.state.selectedCourse}
                extraCost={this.state.extraCost}
                onChangeExtraCost={this.setExtraCost}
              />
              <Card title="培训审批" type="inner" size="small">
                <Table
                  columns={columns}
                  dataSource={this.state.approvalRecords}
                  pagination={false}
                />
              </Card>
            </div>
          </div>
        </Modal>
        <Modal
          title={
            selectedCourse.courseType === '外训' ? '课程行动计划' : '课程反馈'
          }
          visible={this.state.feebackVisible}
          width={this.state.wid}
          // onOk={this.handleOk}
          onCancel={this.handleCloseFeedBackModal}
          destroyOnClose
          footer={
            this.state.feedbackModalMode === 'modify'
              ? [
                <Button onClick={this.handleCloseFeedBackModal}>关闭</Button>,
                <Button
                  onClick={() => {
                    this.submitRate();
                  }}
                  loading={this.state.loadings.submitPlanBtnLoading}
                >
                  确定提交
                  </Button>
              ]
              : [
                <Button
                  onClick={() => {
                    this.setState({
                      feebackVisible: false,
                      feedbackModalMode: 'view'
                    });
                  }}
                >
                  关闭
                  </Button>
              ]
          }
        >
          <FeedBackAndPlan
            onSubmit={this.setRate}
            onAdviceChange={this.setOtherAdvice}
            onCourseDetailID={
              this.state.selectedCourse &&
              this.state.selectedCourse.CourseArrangeDetailID
            }
            setPlans={this.setPlans}
            setKnowledge={this.setKnowledge}
            mode={this.state.feedbackModalMode}
            onCourseType={
              this.state.selectedCourse && this.state.selectedCourse.courseType
            }
          />
        </Modal>
        {/* 审批记录模态窗 */}
        <Modal
          title="培训申请单审批记录"
          visible={this.state.ReviewRecordModalVisible}
          width="70%"
          onOk={() => {
            this.setState({ ReviewRecordModalVisible: false });
          }}
          onCancel={() => {
            this.setState({ ReviewRecordModalVisible: false });
          }}
          centered
          destroyOnClose
        >
          {this.state.selectedCourse ? (
            <TableData
              resid={REVIEW_RECOR_RESID}
              subtractH={240}
              hasBeBtns={true}
              hasAdd={false}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              actionBarFixed={true}
              hasRowModify={false}
              height="70vh"
              cmswhere={`C3_615657103208 = ${this.state.selectedCourse.CourseArrangeDetailID} `}
            />
          ) : null}
        </Modal>
        {/* 心得模态窗 */}
        <Modal
          title="心得"
          visible={this.state.tipsModalVisible}
          destroyOnClose
          width="70%"
          onCancel={this.onCloseTipModal}
          footer={
            this.state.tipsModalMode === 'modify'
              ? [
                <Button onClick={this.onCloseTipModal}>关闭</Button>,
                <Button
                  type="primary"
                  onClick={this.submitTip}
                  loading={this.state.loadings.submitTipLoading}
                >
                  提交
                  </Button>
              ]
              : [<Button onClick={this.onCloseTipModal}>关闭</Button>]
          }
        >
          {this.state.tipsModalMode === 'modify' ? (
            <div style={{ padding: 12 }}>
              <div>
                <label>
                  <strong>标题</strong>
                </label>
                <Input
                  type="text"
                  value={this.state.tip.title}
                  onChange={e => {
                    let tip = { ...this.state.tip, title: e.target.value };
                    this.setState({ tip });
                  }}
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <Upload
                  onChange={this.handleFileChange}
                  fileList={this.state.fileList}
                  customRequest={async file => {
                    const res = await uploadFile(file.file);
                    let { fileList } = this.state;
                    fileList[fileList.length - 1] = {
                      name: file.file.name,
                      url: res,
                      status: 'done',
                      uid: -fileList.length
                    };
                    this.setState({
                      fileList
                    });
                  }}
                >
                  <Button>
                    <Icon type="upload" /> 上传心得文件
                  </Button>
                </Upload>
              </div>
            </div>
          ) : (
              <div style={{ padding: 12 }}>
                {/* 标题 */}
                <h2 style={{ textAlign: 'center' }}>
                  {this.state.selcetedTip.C3_614964239022}
                </h2>
                <Divider />
                {/* 内容 */}
                {this.state.selcetedTip.Filepath ? (
                  this.state.selcetedTip.Filepath.split(',').map(
                    (item, index) => (
                      <p key={item}>
                        <a href={item} target="_blank">
                          附件{index + 1}
                        </a>
                      </p>
                    )
                  )
                ) : (
                    <p>无附件</p>
                  )}
              </div>
            )}
        </Modal>
      </div>
    );
  }
}

export default EmployeeCourses;
