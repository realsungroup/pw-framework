import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import http from '../../../util20/api';
import LzAFFOSPeopleList from './LzAFFOSPeopleList';
import BuildApprovlForm from './BuildApprovalForm';
import DeliverApprovalForm from './DeliverApprovalForm';
import DeliverPeopleList from './DeliverPeopleList';
import BuilderForm from '../LzApproval/BuilderForm';
import DeliverForm from '../LzApproval/DeliverForm';
import GoodsInfoForm from './GoodsInfoForm';
import GoodsInfoForm1 from './GoodsInfoForm1';
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
const emptyApprovalPeopleList = []; //存放审批人员的空数组
for (let i = 0; i < 6; i++) {
  emptyApprovalPeopleList.push({
    C3_227212499515: '',
    C3_605717998409: '',
    C3_605718032582: '',
    C3_607445034147: '',
    C3_607445035535: '',
    C3_607445036471: '',
    C3_607445037719: '',
    C3_607445040215: ''
  });
}
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
      approvalPeopleList: emptyApprovalPeopleList, //审批人清单
      changeApproveModal: false, //选择审批人模态框
      kindOfDept: '', //受影响部门还是施工管理部门
      dept: '', //受影响部门
      influentedDepa: '', //受影响部门
      influentedManage: '', //受影响部门负责人
      buildArrangeDept: '', //施工管理部门负责人
      influentedManageNum: '', //施工管理部门负责人编号
      selectApprovalKey: 0, //选择审批人的序号
      goodsInfo: [], //带出厂物品信息
      FAC_Manager: '',
      goodsInfoModal: false //填写出厂物品信息的模态框
    };
    this.abnormalRef = React.createRef();
    this.inApplicationRef = React.createRef();
  }

  componentDidMount = () => {};

  componentWillUnmount = () => {};

  handleTabsChange = activeKey => {
    this.setState({ activeKey });
  };

  openDeptModal = value => {
    this.setState({
      searchDepaV: true,
      kindOfDept: value
    });
  };

  getInfluentedManageInfo = async num => {
    let res;
    try {
      res = await http().getTable({
        resid: 670091350112,
        cmswhere: `jobNum = ${num}`
      });
      this.setState({
        selectApprovalKey: 1
      });
      this.changeAppMem(res.data[0]);
    } catch (err) {
      console.error(err.message);
      return err.message;
    }
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
      approvalPeopleList.map((item, index) => {
        const current = item.C3_607445035535;
        const data = approvalList.data.filter(
          item1 => item1.C3_607445035535 === current
        );
        if (data.length === 1) {
          item.C3_605718014873 = data[0].C3_605718014873;
          item.C3_605718009813 = data[0].C3_605718009813;
          item.C3_227192472953 = data[0].C3_227192472953;
        }
      });
    } catch (error) {
      message.error(error.message);
    }
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
      this.setState({
        buildArrangeDept: apply.data[0].C3_476814654271 //部门经理
      });
      const applyarr = {};
      applyarr.C3_227212499515 = apply.data[0].C3_227212499515;
      applyarr.C3_605717998409 = apply.data[0].C3_227192484125;
      applyarr.C3_605718032582 = apply.data[0].C3_305737857578;
      applyarr.C3_607445035535 = '申请人';
      applyarr.num = apply.data[0].C3_227192472953;
      const newapprovalPeopleList = [];
      for (let i = 0; i < 5; i++) {
        newapprovalPeopleList.push({
          C3_227212499515: '',
          C3_605717998409: '',
          C3_605718032582: '',
          C3_607445034147: '',
          C3_607445035535: '',
          C3_607445036471: '',
          C3_607445037719: '',
          C3_607445040215: ''
        });
      }
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
    // 根据当前记录，找到与之对应的访客信息。
    let res;
    try {
      res = await http().getTable({
        resid: 606066688508,
        cmswhere: `C3_606070812241 = ${record.C3_605718092628}`
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
  };

  //获取施工申请表单数据
  getValues = (result, values) => {
    this.setState({
      value: values
    });
  };
  //获取送货申请表单数据
  getValuesDeliver = async (result, values) => {
    await this.setState({
      value: values
    });
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

  //更改部门总监
  changeConductor = () => {
    this.setState({
      changeApproveModal: true,
      selectApprovalKey: 5,
      cms: 670091359835
    });
  };

  //更改部门经理
  changeManagerSpecial = () => {
    this.setState({
      changeApproveModal: true,
      selectApprovalKey: 4,
      cms: 670091357851
    });
  };

  //更改厂务经理
  changeManager = () => {
    this.setState({
      changeApproveModal: true,
      selectApprovalKey: 3,
      cms: 670091353265
    });
  };

  //更改工程师
  changeEngineer = () => {
    this.setState({
      changeApproveModal: true,
      selectApprovalKey: 2,
      cms: 670091351596
    });
  };

  //更改受影响部门负责人
  changeEffect = () => {
    this.setState({
      changeApproveModal: true,
      selectApprovalKey: 1,
      cms: 670091350112
    });
  };

  //更改申请人
  changeApply = () => {
    this.setState({
      changeApproveModal: true,
      selectApprovalKey: 0,
      cms: 227186227531
    });
  };

  //是否管控区域
  changeControl = result => {
    this.setState({
      isControl: result
    });
  };

  // 审批人更改
  changeAppMem = v => {
    var obj = this.state.approvalPeopleList;
    obj[this.state.selectApprovalKey].C3_227212499515 = v.partment; //所属部门
    obj[this.state.selectApprovalKey].C3_605717998409 = v.name; //姓名
    obj[this.state.selectApprovalKey].C3_605718032582 = v.peopleNum; //人员编号
    obj[this.state.selectApprovalKey].num = v.jobNum; //工号
    obj[this.state.selectApprovalKey].C3_607445040215 = v.englishName; //英文名
    obj[this.state.selectApprovalKey].C3_607445034147 = '施工访客审批';
    switch (this.state.selectApprovalKey) {
      case 0:
        obj[this.state.selectApprovalKey].C3_607445035535 = '申请人';
        break;
      case 1:
        obj[this.state.selectApprovalKey].C3_607445035535 =
          '受施工影响部门负责人';
        break;
      case 2:
        obj[this.state.selectApprovalKey].C3_607445035535 = '厂务负责工程师';
        break;
      case 3:
        obj[this.state.selectApprovalKey].C3_607445035535 = '厂务经理';
        this.setState({ FAC_Manager: v.name });
        break;
      case 4:
        obj[this.state.selectApprovalKey].C3_607445035535 = '经理';
        break;
      case 5:
        obj[this.state.selectApprovalKey].C3_607445035535 = '总监';
        break;
    }
    this.setState({ approvalPeopleList: obj, changeApproveModal: false });
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
    let peopleStr = '';
    this.state.dataSource.map(item => {
      peopleStr = peopleStr + item.C3_605716828937 + '-';
    });
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
    extra.C3_673029042748 = peopleStr;
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
    for (let i = 1; i < list.length; i++) {
      if (list[i].C3_605717998409 === list[0].C3_605717998409) {
        list[0].C3_605718009813 = 'Y';
        list[1].C3_605718009813 = 'waiting';
      }
    }
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
    //添加带出厂物品信息
    const subdataGoods = this.state.goodsInfo.map((item, index) => {
      item._state = 'added';
      item._id = index + 50;
      return {
        resid: '669820837743',
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
          FAC_Manager: this.state.FAC_Manager,
          C3_605703896083: '施工',
          C3_605703913037: '施工人员',
          C3_619628041125: this.state.dataSource.length,
          _state: 'added',
          _id: 1
        },
        subdata: [...appList, ...subdataPeople, ...subdataGoods]
      }
    ];
    console.log('施工人员data', data);
    try {
      res2 = await http().saveRecordAndSubTables({
        data
      });
      message.info('提交成功');
      this.setState({
        deliverList: [],
        goodsInfo: []
      });
      Modal.destroyAll();
    } catch (err) {
      console.log(err.message);
      message.info(err.message);
      return err.message;
    }
    this.setState({
      value: {},
      approvalPeopleList: emptyApprovalPeopleList
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
    const extra = {};
    let peopleStr = '';
    this.state.deliverList.map(item => {
      peopleStr = peopleStr + item.C3_605716828937 + '-';
    });
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
    extra.C3_673029042748 = peopleStr;
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
    //添加带出厂物品信息
    const subdataGoods = this.state.goodsInfo.map((item, index) => {
      item._state = 'added';
      item._id = index + 50;
      return {
        resid: '669820837743',
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
          C3_619628041125: this.state.deliverList.length,
          ...this.state.value,
          _state: 'added',
          _id: 1
        },
        subdata: [...subdataGoods, ...appList, ...subdataPeople]
      }
    ];
    console.log('送货data', data);
    try {
      res2 = await http().saveRecordAndSubTables({
        data
      });
      this.setState({
        deliverList: [],
        goodsInfo: []
      });
      Modal.destroyAll();
      message.info('提交成功');
    } catch (err) {
      console.log(err.message);
      message.info(err.message);
      return err.message;
    }
    this.setState({
      value: {},
      approvalPeopleList: emptyApprovalPeopleList
    });
    this.tableDataRef.handleRefresh();
    this.setState({
      loading: false
    });
  };

  //打开出厂货物信息填写页面
  showGoodsInfo = () => {
    this.setState({
      goodsInfoModal: true
    });
  };
  showGoodsInfo1 = () => {
    this.setState({
      goodsInfoModal1: true
    });
  };

  //获取子组件出场货物信息
  getGoodsInfo = goodsInfo => {
    this.setState({
      goodsInfo: goodsInfo,
      goodsInfoModal: false,
      goodsInfoModal1: false
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
      record,
      isLongBuilder
    } = this.state;
    const { resids } = this.props;

    return (
      <div className="lz-affo">
        <Spin spinning={loading}>
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

            <TabPane tab="填写申请" key="审批中">
              <div style={{ height: 'calc(100vh - 60px)' }}>
                <TableData
                  recordFormUseAbsolute={true}
                  {...inExaminationAndApproval}
                  saveRecordAndSubTablesApiExtraParams={{
                    secondSaveColumn: 'C3_675250253608',
                    secondSaveValue: 'Y'
                  }}
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
                          type="primary"
                          onClick={() => {
                            this.getapplyInfo();
                            this.setState({ showModalJungleBuild: true });
                          }}
                        >
                          填写施工人员基本信息
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => {
                            this.getapplyInfo();
                            this.setState({
                              showJungleLongDeliverModal: true,
                              isLongDeliver: false,
                              showDeliverApprovalModal: true
                            });
                          }}
                        >
                          填写提送货人员基本信息
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
                    height: 'calc(100vh - 104px)',
                    position: 'relative'
                  }}
                >
                  <TableData
                    resid={670091350112}
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
                              if (this.state.kindOfDept === 'dept') {
                                this.setState({
                                  searchDepaV: false,
                                  dept: record.partment
                                });
                              } else if (
                                this.state.kindOfDept === 'influentedDepa'
                              ) {
                                this.setState({
                                  searchDepaV: false,
                                  influentedDepa: record.partment,
                                  influentedManage: record.name,
                                  influentedManageNum: record.jobNum
                                });
                                this.getInfluentedManageInfo(record.jobNum);
                              }
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

              <BuildApprovlForm
                parent={this}
                toFormMsg={{
                  dataSource: this.state.dataSource,
                  showBuilderModal: this.state.showBuilderModal,
                  isLongBuilder: this.state.isLongBuilder,
                  approvalPeopleList: this.state.approvalPeopleList,
                  isControl: this.state.isControl,
                  dept: this.state.dept,
                  influentedDepa: this.state.influentedDepa,
                  influentedManage: this.state.influentedManage,
                  buildArrangeDept: this.state.buildArrangeDept,
                  goodsInfo: this.state.goodsInfo
                }}
                getValues={this.getValues}
                openApprovalModal={this.openApprovalModal}
                openShortApprovalModal={this.openShortApprovalModal}
                closeBuildModal={this.closeBuildModal}
                showPeopleList={this.showPeopleList}
                showGoodsInfo={this.showGoodsInfo}
                changeApply={this.changeApply}
                changeEffect={this.changeEffect}
                changeEngineer={this.changeEngineer}
                changeManager={this.changeManager}
                changeConductor={this.changeConductor}
                changeManagerSpecial={this.changeManagerSpecial}
                changeControl={this.changeControl}
                openDeptModal={this.openDeptModal}
              />

              {/* 填写送货人员信息表单组件 */}
              <DeliverApprovalForm
                parent={this}
                toDeliverApprovalFormData={{
                  showDeliverApprovalModal: this.state.showDeliverApprovalModal,
                  deliverList: this.state.deliverList,
                  approvalPeopleList: this.state.approvalPeopleList,
                  isControl: this.state.isControl,
                  isLongDeliver: this.state.isLongDeliver,
                  deliverTime: this.state.deliverTime,
                  goodsInfo: this.state.goodsInfo
                }}
                getValuesDeliver={this.getValuesDeliver}
                closeDeliverApprovalModal={this.closeDeliverApprovalModal}
                changeManagerSpecial={this.changeManagerSpecial}
                changeConductor={this.changeConductor}
                showGoodsInfo1={this.showGoodsInfo1}
                openDeliverPeopleListModal={this.openDeliverPeopleListModal}
                changeControl={this.changeControl}
                changeApply={this.changeApply}
                submitAllDeliverData={this.submitAllDeliverData}
              />
              {/* 访客 */}
              <Modal
                title="出厂物品登记"
                width="90%"
                visible={this.state.goodsInfoModal}
                onCancel={() => {
                  this.setState({
                    goodsInfoModal: false
                  });
                }}
                footer={[]}
              >
                <GoodsInfoForm
                  getGoodsInfo={this.getGoodsInfo}
                  dataSource={this.state.goodsInfo}
                />
              </Modal>
              {/* 送货 */}
              <Modal
                title="出厂物品登记"
                width="90%"
                visible={this.state.goodsInfoModal1}
                onCancel={() => {
                  this.setState({
                    goodsInfoModal1: false
                  });
                }}
                footer={[]}
              >
                <GoodsInfoForm1
                  getGoodsInfo={this.getGoodsInfo}
                  dataSource={this.state.goodsInfo}
                />
              </Modal>

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
                title="提送货人员清单"
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
                  if (this.state.FAC_Manager === '') {
                    message.info('请填写厂务经理');
                    return;
                  } else {
                    this.setState({
                      showApprovalModal: false,
                      showLongApprovalModal: false
                    });
                    this.submitAllData();
                  }
                }}
              >
                <div className="approval_modal">
                  <label className="front_label">
                    1.施工影响部门负责人审批
                  </label>
                  <label min-width="120px">
                    {this.state.approvalPeopleList[1].C3_605717998409}
                  </label>
                  <Button
                    onClick={() => {
                      this.changeEffect();
                    }}
                  >
                    更改审批人
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
                    更改审批人
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
                    更改审批人
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
                    更改审批人
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
                      更改审批人
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
                  <label className="front_label">
                    1.施工影响部门负责人审批
                  </label>
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
                    height: 'calc(100vh - 104px)',
                    position: 'relative'
                  }}
                >
                  <TableData
                    resid={this.state.cms}
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
                        approvalList: approvalList1,
                        isPrint: isPrint
                      }}
                    />
                  </div>
                </div>
              </Modal>
              {/* 送货人员打印模态框 */}
              <Modal
                width="61%"
                visible={printDeliverModal}
                title="提送货申请审批"
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
                        approvalList: approvalList1,
                        isPrint: isPrint,
                        isLongBuilder: isLongBuilder
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
        </Spin>
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
