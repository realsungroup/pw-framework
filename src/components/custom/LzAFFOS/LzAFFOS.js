import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import http from '../../../util20/api';
import LzAFFOSPeopleList from './LzAFFOSPeopleList';
import BuildApprovlForm from './BuildApprovalForm';
import DeliverApprovalForm from './DeliverApprovalForm';
import DeliverPeopleList from './DeliverPeopleList';
import BuilderForm from '../LzApproval/BuilderForm';
import DeliverForm from '../LzApproval/DeliverForm';
import {
  message,
  Tabs,
  Button,
  Modal,
  Switch,
  Select,
  Radio,
  tr,
  th,
  DatePicker,
  TimePicker,
  Input,
  Table,
  Popconfirm,
  Spin
} from 'antd';
import './LzAFFOS.less';
// import TableData from '../../../lib/unit-component/TableData';
import { TableData } from '../../common/loadableCommon';
import moment from 'moment';
import {
  inApplication,
  inExaminationAndApproval,
  approved,
  refused,
  history,
  MyVisitor
} from './config';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;
const { Option } = Select;
// const {format} = moment;

//申请人员数据

/**
 * 访客申请
 */
export default class LzAFFOS extends React.Component {
  static propTypes = {
    /**
     * 标签页配置
     */
    tabs: PropTypes.array
    // tabs = [
    //   {
    //     resid: 111,
    //     subTableArrProps: {
    //       // ..
    //     }
    //   }
    // ]
  };

  static defaultProps = {};
  constructor(props) {
    super(props);
    this.state = {
      abnormalNum: 0,
      activeKey: '审批中',
      addWorkerVisible: false,
      selectTypeVisible: false,
      showModalJungleBuild: false, //选择是否长期施工人员模态框
      isBuilder: true, //是否是施工人员
      isLongBuilder: false, //是否长期施工人员
      showBuilderModal: false, //控制施工人员信息填写表单模态框
      showPeopleListModal: false, //控制施工人员编辑人员清单模态框
      isPrint: true, //是否打印
      showLongApprovalModal: false, //长期施工审批流确认模态框
      showApprovalModal: false, //临时施工审批流确认模态框
      dataSource: [], //访客人员清单
      value: {}, //表单数据
      isControl: false, //是否经过管控区域
      forShowData: false, //用来展示的数据
      showDeliverApprovalModal: false, //控制送货人员信息填写表单模态框
      showDeliverPeopleListModal: false, //控制送货人员编辑人员清单模态框
      deliverList: [], //送货人员清单
      isLongDeliver: false, //是否长期送货人员
      showJungleLongDeliverModal: false, //展示判定长期送货人员模态框
      deliverTime: '', //长期送过货时间
      searchDepaV: false, //控制选择部门模态框按钮
      applyNum: '', //审批人编号，从localStorage获取
      searchDepaV: false, //选择受影响部门的模态框
      loading: false, //是否处于缓冲状态
      isPrint: false, //是否打印
      printDeliverModal: false, //打印模态框
      printBuilderModal: false,
      approvalList: [], //打印所需审批流
      approvalList1: [],
      builderList: [],
      deliverList: [],
      cms: '', //选择审批人员时额外添加的条件
      record: {},
      approvalPeopleList: [
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        }
      ], //审批人清单
      changeApproveModal: false, //选择审批人模态框
      selectApprovalKey: 0 //选择审批人的序号
    };
    this.abnormalRef = React.createRef();
    this.inApplicationRef = React.createRef();
  }

  componentDidMount = () => {};

  componentWillUnmount = () => {};

  handleTabsChange = activeKey => {
    this.setState({ activeKey });
  };

  openDeptModal = () => {
    this.setState({
      searchDepaV: true
    });
  };

  //根据人员类型不同，打开不同的模态框
  showRecord = async record => {
    // console.log('record', record);
    if (record.C3_605703913037 === '施工人员') {
      this.setState({ printBuilderModal: true, record: record });
    } else if (record.C3_605703913037 === '送货人员') {
      this.setState({ printDeliverModal: true, record: record });
    } else {
      message.info('当前申请为一般访客，不可打印');
      this.setState({ isPrint: false });
    }
    //获取人员清单
    let peopleList;
    try {
      peopleList = await http().getTable({
        resid: '605716014733',
        cmswhere: `C3_606070812241 = '${record.C3_605718092628}'`
      });
      this.setState({
        deliverList: peopleList.data,
        builderList: peopleList.data
      });
    } catch (error) {
      message.error(error.message);
    }
    //获取审批流信息
    let approvalList;
    const approvalPeopleList = [
      {
        C3_607445035535: '申请人',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '受施工影响部门负责人',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '厂务负责工程师',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '厂务经理',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '经理',
        C3_605718014873: '',
        C3_605718009813: ''
      },
      {
        C3_607445035535: '总监',
        C3_605718014873: '',
        C3_605718009813: ''
      }
    ];
    try {
      approvalList = await http().getTable({
        resid: '605717968873',
        cmswhere: `C3_605717990563 = '${record.C3_605718092628}'`
      });
      this.setState({
        approvalList: approvalList.data
      });
      // console.log('审批信息', approvalList.data);
      approvalPeopleList.map((item, index) => {
        const current = item.C3_607445035535;
        const data = approvalList.data.filter(
          item1 => item1.C3_607445035535 === current
        );
        // console.log('data', data);
        // return {
        //   item: { ...data }
        // };
        if (data.length === 1) {
          // console.log('111');
          // return {
          //   item: data[0]
          // };
          item.C3_605718014873 = data[0].C3_605718014873;
          item.C3_605718009813 = data[0].C3_605718009813;
          item.C3_227192472953 = data[0].C3_227192472953;
        }
      });
    } catch (error) {
      message.error(error.message);
    }
    // console.log('approvalPeopleList', approvalPeopleList);
    this.setState({
      approvalList1: approvalPeopleList
    });
  };

  doPrint = res => {
    var currentHtml = window.document.body.innerHTML;
    if (res === 'deliver') {
      if (
        window.document.getElementById('printDeliverForm').innerHTML != null
      ) {
        let bdHtml = window.document.getElementById('printDeliverForm')
          .innerHTML;
        window.document.body.innerHTML = bdHtml;
        // console.log('获取打印');
        window.print();
        this.setState({
          isPrint: false
        });
      }
    } else if (res === 'builder') {
      if (
        window.document.getElementById('printBuilderForm').innerHTML != null
      ) {
        let bdHtml = window.document.getElementById('printBuilderForm')
          .innerHTML;
        window.document.body.innerHTML = bdHtml;
        // console.log('获取打印');
        window.print();
        this.setState({
          isPrint: false
        });
      }
      window.document.body.innerHTML = currentHtml;
    }
  };

  getapplyInfo = async () => {
    const applyinfo = localStorage.getItem('userInfo');
    const newapplyInfo = JSON.parse(applyinfo);
    let apply;
    try {
      apply = await http().getTable({
        resid: 227186227531,
        cmswhere: `C3_227192472953=${newapplyInfo.UserInfo.EMP_ID}`
      });
      const applyarr = {};
      applyarr.C3_227212499515 = apply.data[0].C3_227212499515;
      applyarr.C3_605717998409 = apply.data[0].C3_227192484125;
      applyarr.C3_605718032582 = apply.data[0].C3_305737857578;
      applyarr.C3_607445035535 = '申请人';
      applyarr.num = apply.data[0].C3_227192472953;
      const newapprovalPeopleList = [
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        }
      ];
      this.setState({
        approvalPeopleList: [applyarr, ...newapprovalPeopleList]
      });
    } catch (err) {
      console.log(err.message);
      message.info(err.message);
      return err.message;
    }
    this.setState({
      applyNum: newapplyInfo.UserInfo.EMP_ID
    });
  };

  reApply = async record => {
    console.log('当前记录', record);
    // 根据当前记录，找到与之对应的访客信息。
    let res;
    try {
      res = await http().getTable({
        resid: 606066688508,
        cmswhere: `C3_606070812241=${record.C3_605718092628}`
      });
    } catch (err) {
      console.error(err.message);
      return err.message;
    }
    console.log(res.data);
    // 向申请中表加数据,主子表同时加
    let res2;
    try {
      res2 = await http().saveRecordAndSubTables({
        data: [
          {
            resid: '605801028375',
            maindata: {
              C3_605703896083: record.C3_605703896083, //来访事由
              C3_605703913037: record.C3_605703913037, //访客类型
              C3_605703930741: record.C3_605703930741, //访客类型
              C3_605703980025: record.C3_605703980025, //有效开始日期
              C3_605703992046: record.C3_605703992046, //有效结束日期
              C3_614883990443: record.C3_614883990443, //一级审批人工号
              C3_614884004893: record.C3_614884004893, //一级审批人
              C3_614884015488: record.C3_614884015488, //二级审批人工号
              C3_614884016188: record.C3_614884016188, //二级审批人
              C3_615638304913: 'Y',
              _state: 'added',
              _id: 1
            },
            subdata: [
              {
                resid: '606066688508',
                maindata: {
                  C3_605716828937: res.data[0].C3_605716828937, //访客姓名
                  C3_605716301557: res.data[0].C3_605716301557, //访客单位
                  C3_605716867680: res.data[0].C3_605716867680, //访客证件类型
                  C3_606412134505: res.data[0].C3_606412134505, //访客手机号
                  C3_614704116070: res.data[0].C3_614704116070, //登记证件号
                  _state: 'added',
                  _id: 1
                }
              }
            ]
          }
        ]
      });
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
    console.log(res2);
    this.tableDataRef.handleRefresh();
    this.setState({ activeKey: '审批中' });
  };

  //获取子组件的施工人员清单
  getBuilderList = (result, msg) => {
    this.setState({
      dataSource: msg,
      showPeopleListModal: false
    });
    // console.log(result, msg);
  };

  //获取施工申请表单数据
  getValues = (result, values) => {
    this.setState({
      value: values
    });
    // console.log('触发获取values');
    // console.log('父result', result, '父state', this.state.value);
    // console.log('this.state.value:', this.state.value);
  };
  //获取送货申请表单数据
  getValuesDeliver = async (result, values) => {
    await this.setState({
      value: values
    });
    // console.log('触发获取values');
    // console.log('父result', result, '父state', this.state.value);
    // console.log('this.state.value:', this.state.value);
    this.submitAllDeliverData();
  };

  //打开长期施工审批确认模态框
  openApprovalModal = () => {
    this.setState({
      showLongApprovalModal: true
    });
  };

  //打开长期施工审批确认模态框
  openShortApprovalModal = () => {
    this.setState({
      showApprovalModal: true
    });
  };

  //供表单（子组件）关闭申请模态框
  closeBuildModal = () => {
    this.setState({
      showBuilderModal: false
    });
  };

  //编辑人员清单模态框
  showPeopleList = () => {
    this.setState({
      showPeopleListModal: true
    });
  };

  //更改厂务总监
  changeConductor = () => {
    this.setState({
      changeApproveModal: true,
      selectApprovalKey: 5,
      cms: 'S10'
    });
  };

  //更改经理
  changeManagerSpecial = () => {
    this.setState({
      changeApproveModal: true,
      selectApprovalKey: 4,
      cms: 'S8'
    });
  };

  //更改厂务经理
  changeManager = () => {
    this.setState({
      changeApproveModal: true,
      selectApprovalKey: 3
    });
  };

  //更改工程师
  changeEngineer = () => {
    this.setState({
      changeApproveModal: true,
      selectApprovalKey: 2
    });
  };

  //更改受影响部门负责人
  changeEffect = () => {
    this.setState({
      changeApproveModal: true,
      selectApprovalKey: 1
    });
  };

  //更改申请人
  changeApply = () => {
    this.setState({
      changeApproveModal: true,
      selectApprovalKey: 0
    });
  };

  //是否管控区域
  changeControl = result => {
    this.setState({
      isControl: result
    });
  };

  // 审批人确认时更改
  changeAppMem = v => {
    // console.log(this.state.selectApprovalKey, v, this.state.approvalPeopleList);
    var obj = this.state.approvalPeopleList;
    obj[this.state.selectApprovalKey].C3_227212499515 = v.C3_227212499515; //所属部门
    obj[this.state.selectApprovalKey].C3_605717998409 = v.C3_227192484125; //姓名
    obj[this.state.selectApprovalKey].C3_605718032582 = v.C3_305737857578; //人员编号
    // obj[this.state.selectApprovalKey].C3_607445036471 =
    //   this.state.selectApprovalKey + 1; //序号
    // obj[
    //   this.state.selectApprovalKey
    // ].C3_607445037719 = this.state.selectApprovalKey; //上级序号
    obj[this.state.selectApprovalKey].num = v.C3_227192472953; //工号
    obj[this.state.selectApprovalKey].C3_607445040215 = v.C3_227192496109;
    switch (this.state.selectApprovalKey) {
      case 0:
        obj[this.state.selectApprovalKey].C3_607445034147 = '施工访客审批';
        obj[this.state.selectApprovalKey].C3_607445035535 = '申请人';
        break;
      case 1:
        obj[this.state.selectApprovalKey].C3_607445034147 = '施工访客审批';
        obj[this.state.selectApprovalKey].C3_607445035535 =
          '受施工影响部门负责人';
        break;
      case 2:
        obj[this.state.selectApprovalKey].C3_607445034147 = '施工访客审批';
        obj[this.state.selectApprovalKey].C3_607445035535 = '厂务负责工程师';
        break;
      case 3:
        obj[this.state.selectApprovalKey].C3_607445034147 = '施工访客审批';
        obj[this.state.selectApprovalKey].C3_607445035535 = '厂务经理';
        break;
      case 4:
        obj[this.state.selectApprovalKey].C3_607445034147 = '施工访客审批';
        obj[this.state.selectApprovalKey].C3_607445035535 = '经理';
        break;
      case 5:
        obj[this.state.selectApprovalKey].C3_607445034147 = '施工访客审批';
        obj[this.state.selectApprovalKey].C3_607445035535 = '总监';
        break;
    }
    this.setState({ approvalPeopleList: obj, changeApproveModal: false });
    // console.log(this.state.approvalPeopleList);
    // console.log('this.state.dataSource:', this.state.dataSource);
    // console.log('this.state.value:', this.state.value);
  };

  submitAllData = async () => {
    this.setState({
      loading: true
    });
    //转化时间格式，施工时段
    const workTime1 = moment(this.state.value.workTime1).format('HH:mm');
    const workTime2 = moment(this.state.value.workTime2).format('HH:mm');
    this.state.value.workTime = `${workTime1}-${workTime2}`;
    //施工审批人空的要去除,为第一个人审批结果设为waiting，加上字段是否施工人员为Y
    const isEmpty = ({ C3_605717998409 }) => C3_605717998409 !== '';
    const isApply = ({ C3_607445035535 }) => C3_607445035535 !== '申请人';
    const newAppList1 = this.state.approvalPeopleList.filter(isEmpty);
    const newAppList = newAppList1.filter(isApply);
    //审批表需要额外添加数据

    const extra = {};
    extra.maxProcess = newAppList.length; //最大审批节点
    extra.C3_605703779087 = this.state.value.C3_605703779087; //申请人姓名
    extra.C3_605703754022 = this.state.value.C3_605703754022; //申请人工号
    extra.C3_605703913037 = '施工人员'; //访客类型
    extra.C3_605703828345 = this.state.value.C3_605703828345; //来访单位？？
    extra.C3_605703896083 = this.state.value.C3_605703896083; //来访事由？？
    extra.C3_619628041125 = this.state.dataSource.length; //来访人数
    extra.C3_605703930741 = this.state.value.C3_605703930741; //访问区域
    extra.C3_605703980025 = this.state.value.C3_605703980025; //有效开始日期
    extra.C3_605703992046 = this.state.value.C3_605703980025; //有效结束日期
    const list = newAppList.map((item, index) => {
      if (index === 0) {
        item.C3_605718009813 = 'waiting';
        item.construction = 'Y';
        item.C3_607445036471 = index + 1;
        item.C3_607445037719 = index;
        item._state = 'added';
        item._id = index + 1;
      } else {
        item.construction = 'Y';
        item.C3_607445036471 = index + 1;
        item.C3_607445037719 = index;
        item._state = 'added';
        item._id = index + 1;
      }
      return {
        ...item,
        ...extra
      };
    });
    const appList = list.map((item, index) => {
      return {
        resid: '605717968873',
        maindata: item
      };
    });
    //添加申请人员信息
    const subdataPeople = this.state.dataSource.map((item, index) => {
      item._state = 'added';
      item._id = index + 6;
      return {
        resid: '605716014733',
        maindata: item
      };
    });
    // 向申请中表加数据,主子表同时加
    let res2;
    const data = [
      {
        resid: '605703697147',
        maindata: {
          ...this.state.value,
          C3_605703913037: '施工人员',
          _state: 'added',
          _id: 1
        },
        subdata: [...appList, ...subdataPeople]
      }
    ];
    console.log('施工人员data', data);
    try {
      res2 = await http().saveRecordAndSubTables({
        data
      });
      message.info('提交成功');
    } catch (err) {
      console.log(err.message);
      message.info(err.message);
      return err.message;
    }

    console.log(res2);
    this.setState({
      value: {},
      approvalPeopleList: [
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        }
      ]
    });
    this.tableDataRef.handleRefresh();
    this.setState({
      loading: false
    });
  };

  //关闭送货人员信息填写表单
  closeDeliverApprovalModal = () => {
    this.setState({
      showDeliverApprovalModal: false
    });
  };

  //获取子组件的送货人员清单
  getDelivererList = (result, msg) => {
    this.setState({
      deliverList: msg,
      showDeliverPeopleListModal: false
    });
    // console.log(result, 'msg', msg);
  };

  //打开送货人员清单编辑页面
  openDeliverPeopleListModal = () => {
    this.setState({
      showDeliverPeopleListModal: true
    });
  };

  //提交送货人员全部信息
  submitAllDeliverData = async () => {
    this.setState({
      loading: true
    });
    //施工审批人空的要去除,为第一个人审批结果设为waiting，加上字段是否施工人员为Y
    const isEmpty = ({ C3_605717998409 }) => C3_605717998409 !== '';
    const isApply = ({ C3_607445035535 }) => C3_607445035535 !== '申请人';
    const newAppList1 = this.state.approvalPeopleList.filter(isEmpty);
    const newAppList = newAppList1.filter(isApply);
    //审批表需要额外添加数据
    // console.log('是否已获取value', this.state.value);
    const extra = {};
    extra.maxProcess = newAppList.length; //最大审批节点
    extra.C3_605703779087 = this.state.value.C3_605703779087; //申请人姓名
    extra.C3_605703754022 = this.state.value.C3_605703754022; //申请人工号
    extra.C3_605703913037 = '送货人员'; //访客类型
    extra.C3_605703828345 = this.state.value.C3_605703828345; //来访单位？？
    extra.C3_605703896083 = this.state.value.C3_605703896083; //来访事由？？
    extra.C3_619628041125 = this.state.deliverList.length; //来访人数
    extra.C3_605703930741 = this.state.value.C3_605703930741; //访问区域
    extra.C3_605703980025 = this.state.value.C3_605703980025; //有效开始日期
    extra.C3_605703992046 = this.state.value.C3_605703980025; //有效结束日期
    // console.log('extra', extra);
    const list = newAppList.map((item, index) => {
      if (index === 0) {
        item.C3_605718009813 = 'waiting';
        item.construction = 'Y';
        item.C3_607445036471 = index + 1;
        item.C3_607445037719 = index;
        item._state = 'added';
        item._id = index + 1;
      } else {
        item.construction = 'Y';
        item.C3_607445036471 = index + 1;
        item.C3_607445037719 = index;
        item._state = 'added';
        item._id = index + 1;
      }
      return {
        ...item,
        ...extra
      };
    });

    const appList = list.map((item, index) => {
      return {
        resid: '605717968873',
        maindata: item
      };
    });
    //添加申请人员信息
    const subdataPeople = this.state.deliverList.map((item, index) => {
      item.longTime = this.state.isLongDeliver;
      item._state = 'added';
      item._id = index + 7;
      return {
        resid: '605716014733',
        maindata: item
      };
    });
    // 向申请中表加数据,主子表同时加
    let res2;
    const data = [
      {
        resid: '605703697147',
        maindata: {
          permitionDay: this.state.isLongDeliver
            ? this.state.deliverTime === 'three'
              ? '90'
              : '180'
            : '15',
          longTime: this.state.isLongDeliver,
          C3_605703913037: '送货人员',
          ...this.state.value,
          _state: 'added',
          _id: 1
        },
        subdata: [...appList, ...subdataPeople]
      }
    ];
    console.log('送货data', data);
    try {
      res2 = await http().saveRecordAndSubTables({
        data
      });
      message.info('提交成功');
    } catch (err) {
      console.log(err.message);
      message.info(err.message);
      return err.message;
    }
    console.log(res2);
    this.setState({
      value: {},
      approvalPeopleList: [
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        },
        {
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        }
      ]
    });
    this.tableDataRef.handleRefresh();
    this.setState({
      loading: false
    });
  };

  render() {
    const {
      activeKey,
      abnormalNum,
      addWorkerVisible,
      selectTypeVisible,
      dataSource,
      loading,
      isPrint,
      printBuilderModal,
      printDeliverModal,
      approvalList1,
      builderList,
      deliverList,
      record
    } = this.state;
    const { resids } = this.props;

    return (
      <div className="lz-affo">
        <Tabs
          activeKey={activeKey}
          renderTabBar={this.renderTabBar}
          onChange={this.handleTabsChange}
        >
          {/* <TabPane tab="申请中" key="申请中">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData
                {...inApplication}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                formProps={{
                  saveText: '请在右侧添加访客信息后再提交',
                  height: 500,
                  saveNeedConfirm: true
                }}
              />
            </div>
          </TabPane> */}

          <TabPane tab="申请中" key="审批中">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData
                {...inExaminationAndApproval}
                wrappedComponentRef={element => (this.tableDataRef = element)}
                refTargetComponentName="TableData"
                formProps={{
                  saveText: '提交',
                  height: 500,
                  saveNeedConfirm: true,
                  saveConfirmTip: '请确认已在右侧添加完访客信息'
                }}
                successMessageComponent={{
                  name: 'Modal',
                  title: (
                    <div>
                      <p
                        style={{
                          thor: 'black',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}
                      >
                        您的申请已提交，所有外部人员需检查锡康码及行动轨迹
                      </p>
                    </div>
                  )
                }}
                actionBarExtra={({}) => {
                  return (
                    <>
                      <Button
                        onClick={() => {
                          this.getapplyInfo();
                          this.setState({ showModalJungleBuild: true });
                        }}
                      >
                        请填写施工人员基本信息
                      </Button>
                      <Button
                        onClick={() => {
                          this.getapplyInfo();
                          this.setState({
                            showJungleLongDeliverModal: true,
                            isLongDeliver: false,
                            showDeliverApprovalModal: true
                          });
                        }}
                      >
                        请填写送货人员基本信息
                      </Button>
                    </>
                  );
                }}
              />
            </div>

            {/* 选择是否长期施工人员 */}
            <Modal
              title="请选择是否长期施工人员"
              visible={this.state.showModalJungleBuild}
              onOk={() => {
                this.setState({
                  showModalJungleBuild: false,
                  showBuilderModal: true
                });
              }}
              onCancel={() => this.setState({ showModalJungleBuild: false })}
            >
              <div>
                <label className="jungle_isBuilder_label">
                  是否长期施工人员
                </label>
                <Radio.Group
                  onChange={e => {
                    // console.log('是否长期施工人员', e.target.value);
                    this.setState({ isLongBuilder: e.target.value });
                  }}
                >
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </div>
            </Modal>

            {/* 选择是否长期送货人员 */}
            {/* <Modal
              title="请选择是否长期送货人员"
              visible={this.state.showJungleLongDeliverModal}
              onOk={() => {
                this.setState({
                  showJungleLongDeliverModal: false,
                  showDeliverApprovalModal: true
                });
              }}
              onCancel={() =>
                this.setState({ showJungleLongDeliverModal: false })
              }
            >
              <div>
                <label className="jungle_isBuilder_label">
                  是否长期送货人员
                </label>
                <Radio.Group
                  onChange={e => {
                    this.setState({ isLongDeliver: e.target.value });
                  }}
                >
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </div>
              {this.state.isLongDeliver && (
                <div>
                  <label className="jungle_isBuilder_label">时间间隔</label>
                  <Radio.Group
                    onChange={e => {
                      this.setState({ deliverTime: e.target.value });
                      // console.log('时间1', e.target.value);
                      // console.log('时间2', this.state.deliverTime);
                    }}
                  >
                    <Radio value={'three'}>三个月</Radio>
                    <Radio value={'six'}>六个月</Radio>
                  </Radio.Group>
                </div>
              )}
            </Modal> */}

            {/* 选择受影响部门模态框 */}
            <Modal
              title="部门列表"
              visible={this.state.searchDepaV}
              footer={null}
              onCancel={() => {
                this.setState({ searchDepaV: false });
              }}
              width={'80vw'}
              height={'80vh'}
            >
              <div
                style={{
                  width: '100%',
                  height: 'calc(80vh - 104px)',
                  position: 'relative'
                }}
              >
                <TableData
                  resid={632327119162}
                  cmswhere={`C3_419339113187 != '' and C3_419448436728 = '菲尼萨光电通讯科技(无锡)有限公司'`}
                  hasRowView={false}
                  subtractH={220}
                  hasAdd={false}
                  hasRowSelection={false}
                  hasRowDelete={false}
                  hasRowModify={false}
                  hasModify={false}
                  hasDelete={false}
                  style={{ height: '100%' }}
                  hasRowView={false}
                  customRowBtns={[
                    record => {
                      return (
                        <Button
                          onClick={() => {
                            // console.log('record', record.DEP_NAME);
                            this.setState({
                              searchDepaV: false,
                              dept: record.DEP_NAME
                            });
                          }}
                        >
                          选择
                        </Button>
                      );
                    }
                  ]}
                />
              </div>
            </Modal>

            {/* 填写施工人员信息表单组件 */}
            <Spin spinning={loading}>
              <BuildApprovlForm
                parent={this}
                toFormMsg={{
                  dataSource: this.state.dataSource,
                  showBuilderModal: this.state.showBuilderModal,
                  isLongBuilder: this.state.isLongBuilder,
                  approvalPeopleList: this.state.approvalPeopleList,
                  isControl: this.state.isControl,
                  dept: this.state.dept
                }}
                getValues={this.getValues}
                openApprovalModal={this.openApprovalModal}
                openShortApprovalModal={this.openShortApprovalModal}
                closeBuildModal={this.closeBuildModal}
                showPeopleList={this.showPeopleList}
                changeApply={this.changeApply}
                changeEffect={this.changeEffect}
                changeEngineer={this.changeEngineer}
                changeManager={this.changeManager}
                changeConductor={this.changeConductor}
                changeManagerSpecial={this.changeManagerSpecial}
                changeControl={this.changeControl}
                openDeptModal={this.openDeptModal}
              />
            </Spin>

            {/* 填写送货人员信息表单组件 */}
            <Spin spinning={loading}>
              <DeliverApprovalForm
                parent={this}
                toDeliverApprovalFormData={{
                  showDeliverApprovalModal: this.state.showDeliverApprovalModal,
                  deliverList: this.state.deliverList,
                  approvalPeopleList: this.state.approvalPeopleList,
                  isControl: this.state.isControl,
                  isLongDeliver: this.state.isLongDeliver,
                  deliverTime: this.state.deliverTime
                }}
                getValuesDeliver={this.getValuesDeliver}
                closeDeliverApprovalModal={this.closeDeliverApprovalModal}
                changeManagerSpecial={this.changeManagerSpecial}
                changeConductor={this.changeConductor}
                openDeliverPeopleListModal={this.openDeliverPeopleListModal}
                changeControl={this.changeControl}
                changeApply={this.changeApply}
                submitAllDeliverData={this.submitAllDeliverData}
              />
            </Spin>

            {/* 施工人员编辑Modal */}
            <Modal
              title="施工人员清单"
              width="90%"
              visible={this.state.showPeopleListModal}
              onCancel={() => {
                this.setState({
                  showPeopleListModal: false
                });
              }}
              footer={[]}
            >
              <LzAFFOSPeopleList parent={this} />
            </Modal>

            {/* 送货人员编辑Modal */}
            <Modal
              title="送货人员清单"
              width="90%"
              visible={this.state.showDeliverPeopleListModal}
              onCancel={() => {
                this.setState({
                  showDeliverPeopleListModal: false
                });
              }}
              footer={[]}
            >
              <DeliverPeopleList parent={this} />
            </Modal>

            {/* 临时施工审批流 */}
            <Modal
              width="600px"
              title="审批流确认"
              visible={
                this.state.showApprovalModal && !this.state.isLongBuilder
              }
              onCancel={() => {
                this.setState({
                  showApprovalModal: false,
                  showLongApprovalModal: false
                });
              }}
              onOk={() => {
                this.setState({
                  showApprovalModal: false,
                  showLongApprovalModal: false
                });
                this.submitAllData();
              }}
            >
              <div className="approval_modal">
                <label className="front_label">1.施工影响部门负责人审批</label>
                <label min-width="120px">
                  {this.state.approvalPeopleList[1].C3_605717998409}
                </label>
                <Button
                  onClick={() => {
                    this.changeEffect();
                  }}
                >
                  查找人员
                </Button>
              </div>
              <div className="approval_modal">
                <label className="front_label">2.厂务工程师审批</label>
                <label min-width="120px">
                  {this.state.approvalPeopleList[2].C3_605717998409}
                </label>
                <Button
                  onClick={() => {
                    this.changeEngineer();
                  }}
                >
                  查找人员
                </Button>
              </div>
              <div className="approval_modal">
                <label className="front_label">3.厂务经理审批</label>
                <label min-width="120px">
                  {this.state.approvalPeopleList[3].C3_605717998409}
                </label>
                <Button
                  onClick={() => {
                    this.changeManager();
                  }}
                >
                  查找人员
                </Button>
              </div>
              <div className="approval_modal">
                <label className="front_label">4.经理审批</label>
                <label min-width="120px">
                  {this.state.approvalPeopleList[4].C3_605717998409}
                </label>
                <Button
                  onClick={() => {
                    this.changeManagerSpecial();
                  }}
                >
                  查找人员
                </Button>
              </div>
              {this.state.isControl && (
                <div className="approval_modal">
                  <label className="front_label">5.总监审批</label>
                  <label min-width="120px">
                    {this.state.approvalPeopleList[5].C3_605717998409}
                  </label>
                  <Button
                    onClick={() => {
                      this.changeConductor();
                    }}
                  >
                    查找人员
                  </Button>
                </div>
              )}
            </Modal>

            {/* 长期施工审批流确认 */}
            <Modal
              width="600px"
              title="审批流确认"
              visible={
                this.state.showLongApprovalModal && this.state.isLongBuilder
              }
              onCancel={() => {
                this.setState({
                  showApprovalModal: false,
                  showLongApprovalModal: false
                });
              }}
              onOk={() => {
                this.setState({
                  showApprovalModal: false,
                  showLongApprovalModal: false
                });
                this.submitAllData();
              }}
            >
              <div className="approval_modal">
                <label className="front_label">1.施工影响部门负责人审批</label>
                <label min-width="120px">
                  {this.state.approvalPeopleList[1].C3_605717998409}
                </label>
                <Button
                  onClick={() => {
                    this.changeEffect();
                  }}
                >
                  查找人员
                </Button>
              </div>
              <div className="approval_modal">
                <label className="front_label">2.厂务工程师审批</label>
                <label min-width="120px">
                  {this.state.approvalPeopleList[2].C3_605717998409}
                </label>
                <Button
                  onClick={() => {
                    this.changeEngineer();
                  }}
                >
                  查找人员
                </Button>
              </div>
              <div className="approval_modal">
                <label className="front_label">3.厂务经理审批</label>
                <label min-width="120px">
                  {this.state.approvalPeopleList[3].C3_605717998409}
                </label>
                <Button
                  onClick={() => {
                    this.changeManager();
                  }}
                >
                  查找人员
                </Button>
              </div>
              <div className="approval_modal">
                <label className="front_label">4.经理审批</label>
                <label min-width="120px">
                  {this.state.approvalPeopleList[4].C3_605717998409}
                </label>
                <Button
                  onClick={() => {
                    this.changeManagerSpecial();
                  }}
                >
                  查找人员
                </Button>
              </div>
              {this.state.isControl && (
                <div className="approval_modal">
                  <label className="front_label">5.总监审批</label>
                  <label min-width="120px">
                    {this.state.approvalPeopleList[5].C3_605717998409}
                  </label>
                  <Button
                    onClick={() => {
                      this.changeConductor();
                    }}
                  >
                    查找人员
                  </Button>
                </div>
              )}
            </Modal>

            {/* 审批流确认时选择审批人 */}
            <Modal
              zIndex={4321}
              title={'选择审批人'}
              width={'90vw'}
              visible={this.state.changeApproveModal}
              footer={null}
              onCancel={() => this.setState({ changeApproveModal: false })}
            >
              <div
                style={{
                  width: '100%',
                  height: 'calc(80vh - 104px)',
                  position: 'relative'
                }}
              >
                <TableData
                  resid={227186227531}
                  hasRowView={false}
                  subtractH={220}
                  hasAdd={false}
                  hasRowSelection={false}
                  hasRowDelete={false}
                  hasRowModify={false}
                  hasModify={false}
                  hasDelete={false}
                  recordFormUseAbsolute={true}
                  style={{ height: '100%' }}
                  hasRowView={false}
                  recordFormUseAbsolute={true}
                  customRowBtns={[
                    record => {
                      return (
                        <Button
                          onClick={() => {
                            this.changeAppMem(record);
                          }}
                        >
                          选择
                        </Button>
                      );
                    }
                  ]}
                />
              </div>
            </Modal>
          </TabPane>
          <TabPane tab="已审批" key="已审批">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData
                {...approved}
                customRowBtns={[
                  record => {
                    return (
                      <Button
                        style={{ width: '104px' }}
                        onClick={() => {
                          this.showRecord(record);
                          this.setState({
                            isPrint: true
                          });
                        }}
                      >
                        打印申请单
                      </Button>
                    );
                  }
                ]}
              />
            </div>
            {/* 施工人员打印模态框 */}
            <Modal
              width="61%"
              visible={printBuilderModal}
              title="施工申请审批"
              onCancel={() => {
                this.setState({
                  printBuilderModal: false
                });
              }}
              footer={[
                <Button
                  type="primary"
                  onClick={() => {
                    console.log('开始打印');
                    this.doPrint('builder');
                    this.setState({
                      isPrint: true
                    });
                  }}
                >
                  打印
                </Button>,
                <Button
                  onClick={() => {
                    this.setState({
                      printBuilderModal: false,
                      isPrint: false
                    });
                  }}
                >
                  关闭
                </Button>
              ]}
            >
              <div id="printBuilderForm">
                <div className="printBody">
                  <BuilderForm
                    toBuilderFormInfo={{
                      approvalInfo: record,
                      builderList: builderList,
                      approvalList: approvalList1
                    }}
                  />
                </div>
              </div>
            </Modal>
            {/* 送货人员打印模态框 */}
            <Modal
              width="61%"
              visible={printDeliverModal}
              title="送货申请审批"
              onCancel={() => {
                this.setState({
                  printDeliverModal: false
                });
              }}
              footer={[
                <Button
                  type="primary"
                  onClick={() => {
                    console.log('开始打印');
                    this.doPrint('deliver');
                  }}
                >
                  打印
                </Button>,
                <Button
                  onClick={() => {
                    this.setState({
                      printDeliverModal: false,
                      isPrint: false
                    });
                  }}
                >
                  关闭
                </Button>
              ]}
            >
              <div id="printDeliverForm">
                <div className="printBody">
                  <DeliverForm
                    toDeliverFormInfo={{
                      approvalInfo: record,
                      deliverList: deliverList,
                      approvalList: approvalList1
                    }}
                  />
                </div>
              </div>
            </Modal>
          </TabPane>
          <TabPane tab="已拒绝" key="已拒绝">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData {...refused} />
            </div>
          </TabPane>
          <TabPane tab="历史记录" key="历史记录">
            <div style={{ height: 'calc(100vh - 60px)' }}>
              <TableData
                {...history}
                customtrBtns={[
                  (record, btnSize) => {
                    return (
                      <Button
                        onClick={() => {
                          this.reApply(record);
                        }}
                      >
                        重新申请
                      </Button>
                    );
                  }
                ]}
              />
            </div>
          </TabPane>
        </Tabs>
        {!!abnormalNum && (
          <div className="lz-affo__abnormal-num">{abnormalNum}</div>
        )}

        <Modal
          title="选择人员类型"
          visible={selectTypeVisible}
          onCancel={this.toggleSelectTypeVisible}
        >
          <div>
            <label>是否长期施工</label>
            <Switch
              onChange={checked => {}}
              checkedChildren="是"
              unCheckedChildren="否"
            />
          </div>
        </Modal>
        <AddWorker
          visible={addWorkerVisible}
          onClose={this.handleCloseAddWorker}
        />
      </div>
    );
  }
  handleCloseAddWorker = () => {
    this.setState({ addWorkerVisible: false });
  };

  toggleSelectTypeVisible = () => {
    this.setState({ selectTypeVisible: !this.state.selectTypeVisible });
  };
}

class AddWorker extends React.PureComponent {
  render() {
    const { visible, onClose } = this.props;
    return (
      <Modal
        title="添加施工人员"
        visible={visible}
        width={'90vw'}
        footer={null}
        onCancel={onClose}
      >
        <div>
          <label>是否长期施工</label>
          <Switch
            onChange={checked => {}}
            checkedChildren="是"
            unCheckedChildren="否"
          />
        </div>
      </Modal>
    );
  }
}
