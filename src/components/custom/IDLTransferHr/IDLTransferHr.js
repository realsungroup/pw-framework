import React, { Component } from 'react';
import {
  Steps,
  Button,
  Icon,
  Select,
  Input,
  Tabs,
  Spin,
  TreeSelect,
  Modal,
  DatePicker,
  Switch,
  Checkbox,
  message
} from 'antd';
import './IDLTransferHr.less';
import TableData from '../../common/data/TableData';
import qs from 'qs';
import http from 'Util20/api';
import moment from 'moment';
import IDLTransferVerify from '../IDLTransferVerify';
import IDLTransferVerifyAction from '../IDLTransferVerifyAction';
import ChangedInfoForm from './ChangedInfoForm';
import { async } from 'q';
import Sider from 'antd/lib/layout/Sider';
function compare(property) {
  return function(a, b) {
    return a[property] - b[property];
  };
}
const { Step } = Steps;
const { Option } = Select;

const WuxiHr03BaseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03BaseURL;

const attr = [
  '部门名',
  '岗位名',
  '级别',
  '主管',
  '项目代码',
  'BU CODE',
  '一级部门',
  '二级部门',
  '三级部门',
  '四级部门'
];
const showAfter = [
  'nDepart', //部门名
  'nJobName', //职务名
  'nLevel', //级别
  'nDriectorName', //主管
  'nProj_Code', //项目代码
  'nBuCode', //bucode
  'nFirstDepart', //一级部门
  'nSecondDepart', //二级部门
  'nThirdDepart', //三级部门
  'nFourthDepart' //四级部门
];
const subresid = 632314794466; //子表resid
class IDLTransferHr extends Component {
  constructor(props) {
    super(props);
    this.url80 =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
    this.state = {
      right: {
        location: '',
        id: '',
        jobid: '',
        HCPreApprove: '',
        HRPreApprove: ''
      }, //权限
      cms: ``,
      loading: false,
      visible: false,
      stream: [],
      streamChange: [],
      C3_632503853105: '',
      toCheckFront: {
        C3_632503853105: null,
        jobId: '',
        effortDate: null, //生效日期
        changeReason: '' //变动原因
      },
      toCheck: [],
      member: [], //同一审批单的人员
      conUnpass: false,
      visibleHC: false,
      C3_637425449725: '', //是否有HC
      C3_637425577105: '', //变更类型
      iiviJobCode: '', //jobcode
      C3_637425666513: '', //替代人
      C3_637425470106: '', //招聘人员备注
      C3_637425470106: '', //招聘人员备注
      C3_637425923781: '', //招聘人员确认人工号
      C3_637425935795: '', //招聘人员确认人姓名
      HCList: [], //招聘下拉列表
      list725: [],
      memberD: false,
      commandVisible: false,
      changeApprove: false, //审批人选择
      changeKey: null, //变更审批的序号
      curStep: 0,
      allValues: {}, //HR预审批时可以修改变动信息，此state用来存放子组件传递来的值
      applyNum: '', //申请人编号，审批流中申请人自动审批通过
      selectJobcodeModal: false //当HC预审的headcount类型为new时,有按钮可以打开模态框选择jobcode
    };
  }
  //删除审批节点
  deleteStream = key => {
    var arr = this.state.streamChange;
    var arrAfter = [];
    var n = 0;
    while (n < arr.length) {
      if (n != key) {
        arrAfter.push(arr[n]);
      }
      n++;
    }
    this.setState({ streamChange: arrAfter });
  };
  //修改JOBCODE
  handlemodiJobCode = async (value, recid) => {
    try {
      let res = await http().modifyRecords({
        resid: 632255761674,
        data: [
          {
            REC_ID: recid,
            iiviJobCode: value
          }
        ]
      });
      this.tableDataRef.handleRefresh();
      message.success('修改成功');
      this.setState({ toModi: '', modiJobCode: false });
    } catch (e) {
      console.log(e.message);
    }
  };

  //生成审批流
  StreamGenerate = async (resid, recid) => {
    try {
      let res = await http().CreateAuditFlowData({
        resid,
        recid
      });
      console.log('审批流', res);

      var n = 1;
      var arr = [];
      while (n < res.data.length + 1) {
        var c = 0;
        while (c < res.data.length) {
          if (res.data[c].auditRecno == n) {
            arr.push({
              stepName: res.data[c].auditCName,
              stepPeople: res.data[c].auditUserCode,
              stepPeopleID: res.data[c].auditUserCode,
              auditNo: res.data[c].auditNo,
              auditRecno: res.data[c].auditRecno
            });
          }
          c++;
        }
        n++;
      }
      console.log('审批流', arr);
      n = 0;
      var str = ``;
      //  C3_305737857578 编号
      //  C3_448032387764 工号
      while (n < arr.length) {
        if (n == 0) {
          str = `C3_305737857578 = '${arr[n].stepPeople}'`;
        } else {
          str += ` or C3_305737857578 = '${arr[n].stepPeople}'`;
        }
        n++;
      }
      try {
        let res2 = await http().getTable({
          resid: 609599795438,
          cmswhere: str
        });
        n = 0;
        var arr2 = arr;
        while (n < arr2.length) {
          var c = 0;
          while (c < res2.data.length) {
            if (arr2[n].stepPeople == res2.data[c].C3_305737857578) {
              arr2[n].stepPeople = res2.data[c].C3_227192484125;
            }
            c++;
          }

          n++;
        }
        console.log('stream', arr2);
        let proposal;
        try {
          proposal = await http().getTable({
            resid: 632255761674,
            cmswhere: `changeID = '${recid}'`
          });
          this.setState({
            applyNum: proposal.data[0].applyPersonId
          });
        } catch (error) {
          message.info(error.message);
          console.log(error.message);
        }
        this.setState({ stream: arr2, streamChange: arr2 });
      } catch (e) {
        console.log(e);
        this.setState({ loading: false });
      }
    } catch (e) {
      console.log(e);
    }
  };

  //获取审批单上的人员名单
  getMem = async v => {
    this.setState({ loading: true });
    try {
      let res = await http().getTable({
        resid: 632314958317,
        cmswhere: `C3_632503844784='${v}'`
      });
      this.setState({ member: res.data, loading: false });
      console.log('resqq', res);
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };
  approveGroup = async (dataSource, selectedRowKeys) => {
    this.setState({ loading: true });
    var data = [];
    dataSource.map(item => {
      if (selectedRowKeys.includes(item.REC_ID)) {
        data.push(item);
      }
    });
    console.log(data);
    var n = 0;
    var recid = '';
    while (n < data.length) {
      recid += data[n].REC_ID + ',';
      data[n].Approve = '审核中';
      data[n].hrPreAprrove = 'Y';
      n++;
    }
    recid = recid.substring(0, recid.length - 1);
    try {
      let res = await http().CreateAuditFlowData({
        resid: 634822110774,
        recid
      });
      var n = 1;
      var arr2 = [];
      while (n < res.data.length + 1) {
        var c = 0;
        while (c < res.data.length) {
          if (res.data[c].auditRecno == n) {
            arr2.push({
              auditRecId: res.data[c].auditRecId,
              stepName: res.data[c].auditCName,
              stepPeople: res.data[c].auditUserCode,
              stepPeopleID: res.data[c].auditUserCode,
              auditNo: res.data[c].auditNo,
              auditRecno: res.data[c].auditRecno
            });
          }
          c++;
        }
        n++;
      }
      n = 0;
      var str = ``;
      //  C3_305737857578 编号
      //  C3_448032387764 工号
      while (n < arr2.length) {
        if (n == 0) {
          str = `C3_305737857578 = '${arr2[n].stepPeople}'`;
        } else {
          str += ` or C3_305737857578 = '${arr2[n].stepPeople}'`;
        }
        n++;
      }
      console.log('str', str);
      let resP = await http().getTable({
        resid: 609599795438,
        cmswhere: str
      });
      n = 0;
      while (n < arr2.length) {
        var c = 0;
        while (c < resP.data.length) {
          if (arr2[n].stepPeople == resP.data[c].C3_305737857578) {
            arr2[n].stepPeople = resP.data[c].C3_227192484125;
          }
          c++;
        }

        n++;
      }
      n = 0;
      var streamRec = [];
      while (n < arr2.length) {
        streamRec.push({
          C3_634660564341: arr2[n].auditRecId,
          C3_635250483297: arr2[n].auditRecno,
          C3_634660566076: arr2[n].auditNo,
          C3_635255573464: arr2[n].stepPeopleID,
          C3_634660565034: arr2[n].stepName,
          C3_634660565583: arr2[n].stepPeople
        });
        n++;
      }
      //申请人如果也是审批人，自动通过
      let applyHasPass = [];
      streamRec.map(item => {
        if (item.C3_635255573464.toString() === this.state.applyNum) {
          applyHasPass.push({
            ...item,
            C3_634660565837: 'Y',
            edit_time: moment().format('YYYY-MM-DD HH:mm:ss')
          });
        } else {
          applyHasPass.push({ ...item });
        }
      });
      console.log('更新后审批流', applyHasPass);
      let res2 = await http().addRecords({
        resid: 634660498796,
        data: applyHasPass
      });
      let res3 = await http().modifyRecords({
        resid: 632255761674,
        data: data
      });
      this.setState({ loading: false });
      message.success('批量审批成功');
      this.tableDataRef.handleRefresh();
    } catch (e) {
      this.setState({ loading: false });
      console.log(e);
    }
  };
  approve = async (v, end) => {
    this.setState({ loading: true });

    var res = '';
    if (v == 'N') {
      var prev = 'N';
      var endv;
      if (end) {
        prev = 'Y';
        endv = 'N';
      }

      try {
        res = await http().modifyRecords({
          resid: 632255761674,
          data: [
            {
              REC_ID: this.state.toCheckFront.REC_ID,
              Approve: '未通过',
              ApproveRemark: this.state.C3_632503853105,
              hrPreAprrove: prev,
              hrEndApprove: endv
            }
          ]
        });
        console.log('res', res);
        if (res.Error === 0) {
          message.success(res.message);
          this.setState({ visible: false, conUnpass: false, loading: false });
          this.tableDataRef.handleRefresh();
        }
      } catch (error) {
        message.error(error.message);
        this.setState({ loading: false });
      }
    } else {
      var ps = '审核中';
      var endV = '';
      if (end) {
        ps = '已通过';
        endV = 'Y';
      }
      try {
        var date = this.state.toCheckFront.effortDate;
        if (date) {
          date = moment(date).format('YYYY-MM-DD');
        }
        res = await http().modifyRecords({
          resid: 632255761674,
          data: [
            {
              REC_ID: this.state.toCheckFront.REC_ID,
              ...this.state.allValues,
              Approve: ps,
              ApproveRemark: this.state.C3_632503853105,
              hrPreAprrove: 'Y',
              effortDate: date,
              hrEndApprove: endV,
              jobId: this.state.toCheckFront.jobId
            }
          ]
        });
        var streamRec = [];
        // C3_634660564341 变动编号
        // C3_635250483297 审批阶段序号
        // C3_634660566076 审批序号
        // C3_635255573464 审批人编号
        // C3_634660565034 审批阶段名称
        // C3_634660565583 审批人
        if (!end) {
          var n = 0;
          while (n < this.state.stream.length) {
            streamRec.push({
              C3_634660564341: this.state.toCheckFront.changeID,
              C3_635250483297: this.state.stream[n].auditRecno,
              C3_634660566076: this.state.stream[n].auditNo,
              C3_635255573464: this.state.stream[n].stepPeopleID,
              C3_634660565034: this.state.stream[n].stepName,
              C3_634660565583: this.state.stream[n].stepPeople
            });
            n++;
          }
          //申请人如果也是审批人，自动通过
          let applyHasPass = [];
          streamRec.map(item => {
            if (item.C3_635255573464.toString() === this.state.applyNum) {
              applyHasPass.push({
                ...item,
                C3_634660565837: 'Y',
                edit_time: moment().format('YYYY-MM-DD HH:mm:ss')
              });
            } else {
              applyHasPass.push({ ...item });
            }
          });
          console.log('更新后审批流', applyHasPass);
          let res2 = await http().addRecords({
            resid: 634660498796,
            data: applyHasPass
          });
        }

        var res3 = await http().modifyRecords({
          resid: 632255761674,
          data: [{ REC_ID: this.state.toCheckFront.REC_ID }]
        });

        message.success(res.message);
        this.setState({ visible: false, loading: false });
        this.tableDataRef.handleRefresh();
      } catch (error) {
        message.error(error.message);
        this.setState({ loading: false });
      }
    }
  };
  showOverlay = v => {
    this.setState({ memberDetail: null, stream: [] });
    var n = 0;
    var arr = [];
    while (n < attr.length) {
      var a = v[showAfter[n]] || '';
      arr.push(a);
      n++;
    }
    // var obj = v;
    let object = {};
    Object.assign(object, v);
    let myDate = object.effortDate;
    console.log('myDate:' + myDate);
    if (myDate) {
      myDate = moment(myDate);
    }
    object.effortDate = myDate;
    console.log('object.effortDate:' + object.effortDate);
    var resid = '';
    resid = '634822110774';
    // if(obj.changeType=='部门变更'){
    //   resid='634822081509';
    // }else if(obj.changeType=='汇报关系变更'){
    //   resid='634822110774';
    // }else if(obj.changeType=='职位变更'){
    //   resid='634822131537';
    // }else if(obj.changeType=='级别变更'){
    //   resid='634820028458';
    // }
    this.getStream(object.changeID, resid);
    this.getMem(object.changeID);

    this.setState({ toCheck: arr, toCheckFront: object, visible: true });
    console.log('v', v);
  };

  approveHC = async v => {
    console.log(v);
    var res;
    this.setState({
      loading: true,
      memberD: false,
      visibleHC: false,
      visible: false
    });
    var currentID = localStorage.getItem('userInfo');
    currentID = JSON.parse(currentID);
    var curName = currentID.UserInfo.EMP_NAME;
    currentID = currentID.UserInfo.EMP_USERCODE;
    var obj = {
      REC_ID: this.state.toCheckFront.REC_ID,
      C3_637425577105: this.state.C3_637425577105, //变更类型
      C3_637425449725: this.state.C3_637425449725, //是否有新HC
      C3_637425666513: this.state.C3_637425666513.C3_305737857578, //替代人
      C3_637617454519: this.state.C3_637425666513.C3_227192484125, //替代人姓名
      C3_637425470106: this.state.C3_637425470106, //招聘人员备注
      iiviJobCode: this.state.iiviJobCode,
      C3_637425923781: currentID, //招聘人员确认人工号
      C3_637425935795: curName, //招聘人员确认人姓名
      headcount: v
    };
    if (v == 'N') {
      obj.Approve = '未通过';
    } else {
      obj.hrPreAprrove = 'waiting';
    }
    console.log(obj);
    try {
      res = await http().modifyRecords({
        resid: 632255761674,
        data: [obj]
      });
      if (res.Error == 0) {
        message.success('提交成功');
        this.setState({
          loading: false,
          C3_637425577105: '',
          C3_637425449725: '',
          C3_637425666513: '',
          C3_637617454519: '',
          C3_637425470106: '',
          iiviJobCode: ''
        });
      }

      this.tableDataRef.handleRefresh();
    } catch (e) {
      message.error(e.message);
      this.setState({ loading: false });
    }
  };
  getHCList = async v => {
    this.setState({ loading: true });
    var res;
    try {
      res = await http().getTableColumnDefine({
        resid: 632255761674
      });
      var arr;
      var arr2;
      var n = 0;
      while (n < res.data.length) {
        if (res.data[n].ColName == 'C3_637425577105') {
          arr = res.data[n].DisplayOptions;
        }
        if (res.data[n].ColName == 'C3_637425449725') {
          arr2 = res.data[n].DisplayOptions;
        }
        n++;
      }
      // this.getRight();

      this.setState({ loading: false, HCList: arr, list725: arr2 });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };
  // 选择变更后的审批人
  changeAppMem = v => {
    console.log(this.state.changeKey, v, this.state.stream);
    var obj = this.state.streamChange;
    obj[this.state.changeKey].stepPeople = v.C3_227192484125;
    obj[this.state.changeKey].stepPeopleID = v.C3_305737857578.toString();
    this.setState({ stream: obj, changeApprove: false });
  };
  getStream = async (v, id) => {
    try {
      let res2 = await http().getTable({
        resid: 634660498796,
        cmswhere: `C3_634660564341='${v}'`
      });
      if (res2.data.length > 0) {
        var n = 0;
        var arr = [];
        var c = 0;
        var isFin = 0;
        while (n < res2.data.length) {
          arr.push({
            stepName: res2.data[n].C3_634660565034,
            stepPeople: res2.data[n].C3_634660565583,
            stepTime: res2.data[n].edit_time,
            order: res2.data[n].C3_634660566076
          });
          if (res2.data[n].C3_637177232366 == 'Y') {
            var c = res2.data[n].C3_635250483297;
          }
          if (res2.data[n].C3_634660565837 == 'Y') {
            isFin = isFin + 1;
          }
          n++;
        }
        console.log('arr', arr);
        console.log('res2', res2);
        arr = arr.sort(compare('order'));
        if (isFin == res2.data.length) {
          c = res2.data.length + 1;
        }
        this.setState({ stream: arr, curStep: c });
      } else {
        this.StreamGenerate(id, v);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 获取权限地点
  // getRight = async () => {

  //   var usercode = localStorage.getItem('userInfo');
  //   var usrChara = JSON.parse(usercode)
  //   var userCode = usrChara.UserInfo.EMP_USERCODE;
  //   var res;
  //   try {
  //     res = await http().getTable({
  //       resid: 637687733184,
  //       cmswhere: `id = ${userCode}`
  //     });
  //     if (res.data[0]) {
  //       this.setState({ right: res.data[0] })

  //     }
  //     if (res.data[0].HCPreApprove == 'N') {
  //       this.setState({ cms: `hrPreAprrove = 'waiting' and C3_653481734712 = '${res.data[0].location}'` });
  //     } else {
  //       this.setState({ cms: `headcount = 'waiting' and C3_653481734712 = '${res.data[0].location}'` });
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  getRightGroup = () => {
    var usercode = localStorage.getItem('userInfo');
    var usrChara = JSON.parse(usercode);
    var string = usrChara.UserInfo.GroupList;
    let id = usrChara.UserInfo.EMP_USERCODE;
    let jobid = usrChara.UserInfo.EMP_ID;
    string = string.substring(1, string.length - 1);
    let arr = string.split(',');
    let HCPreApprove = 'N';
    let HRPreApprove = 'N';
    let location = usrChara.EnterpriseCode;
    let n = 0;
    while (n < arr.length) {
      arr[n] = arr[n].substring(2, arr[n].length - 1);
      if (
        arr[n] == '653477829853' ||
        arr[n] == '653484751513' ||
        arr[n] == '653479674643'
      ) {
        HRPreApprove = 'Y';
      }
      if (
        arr[n] == '653477850557' ||
        arr[n] == '653484767124' ||
        arr[n] == '653479693081'
      ) {
        HCPreApprove = 'Y';
      }
      n++;
    }
    let obj = {
      location: location,
      id: id,
      jobid: jobid,
      HCPreApprove: HCPreApprove,
      HRPreApprove: HRPreApprove
    }; //权限
    if (HCPreApprove == 'N') {
      this.setState({
        cms: `hrPreAprrove = 'waiting' and C3_653481734712 = '${location}'`
      });
    } else {
      this.setState({
        cms: `headcount = 'waiting' and C3_653481734712 = '${location}'`
      });
    }
    this.setState({ right: obj });
  };
  //获取表单更改后的值(HR预审可以修改变动信息)
  sendFormDataToFather = allValues => {
    this.setState(allValues);
    console.log(allValues);
  };
  //HR预审时，通知申请人他提交的变动信息已更改
  handleNoticePorposal = async (dataSource, selectedRowKeys) => {
    const arr = [];
    dataSource.map(item => {
      if (selectedRowKeys.includes(item.REC_ID)) {
        arr.push(item);
      }
    });
    arr.map(item => {
      try {
        http().modifyRecords({
          resid: 632255761674,
          data: [
            {
              REC_ID: item.REC_ID,
              C3_668536687126: 'Y'
            }
          ]
        });
      } catch (error) {
        message.info(error.message);
        console.log(error.message);
      }
    });
    message.info('提醒成功');
    this.tableDataRef.handleRefresh();
  };

  getReplacementJobcode = async record => {
    let jobcode;
    try {
      jobcode = await http({ baseURL: WuxiHr03BaseURL }).getTable({
        resid: 660756647720,
        cmswhere: `C3_660756674254 = '${record.C3_227192472953}'`
      });
      this.setState({
        iiviJobCode: jobcode.data[0].C3_660756702537
      });
    } catch (error) {
      console.log(error.message);
      message.info(error.message);
    }
  };

  componentWillMount() {
    this.getRightGroup();
  }
  componentDidMount() {
    this.getHCList();
  }
  render() {
    return (
      <div className="IDLTransferHR">
        <sider>
          <ul>
            {this.state.right.HRPreApprove == 'Y' ? (
              <>
                <li
                  className={
                    this.state.cms ==
                    `headcount = 'waiting' and C3_653481734712 = '${this.state.right.location}'`
                      ? 'cur'
                      : ''
                  }
                  onClick={() => {
                    this.setState({
                      cms: `headcount = 'waiting' and C3_653481734712 = '${this.state.right.location}'`
                    });
                  }}
                >
                  HC未审批
                </li>
                <li
                  className={
                    this.state.cms ==
                    `headcount = 'Y' and C3_653481734712 = '${this.state.right.location}'`
                      ? 'cur'
                      : ''
                  }
                  onClick={() => {
                    this.setState({
                      cms: `headcount = 'Y' and C3_653481734712 = '${this.state.right.location}'`
                    });
                  }}
                >
                  HC已通过
                </li>
                <li
                  className={
                    this.state.cms ==
                    `headcount = 'N' and C3_653481734712 = '${this.state.right.location}'`
                      ? 'cur'
                      : ''
                  }
                  onClick={() => {
                    this.setState({
                      cms: `headcount = 'N' and C3_653481734712 = '${this.state.right.location}'`
                    });
                  }}
                >
                  HC未通过
                </li>
              </>
            ) : null}
            {this.state.right.HRPreApprove == 'Y' ? (
              <>
                <li
                  className={
                    this.state.cms ==
                    `hrPreAprrove = 'waiting' and C3_653481734712 = '${this.state.right.location}'`
                      ? 'cur'
                      : ''
                  }
                  onClick={() => {
                    this.setState({
                      cms: `hrPreAprrove = 'waiting' and C3_653481734712 = '${this.state.right.location}'`
                    });
                  }}
                >
                  HR预审未审批
                </li>
                <li
                  className={
                    this.state.cms ==
                    `hrPreAprrove = 'Y' and C3_653481734712 = '${this.state.right.location}'`
                      ? 'cur'
                      : ''
                  }
                  onClick={() => {
                    this.setState({
                      cms: `hrPreAprrove = 'Y' and C3_653481734712 = '${this.state.right.location}'`
                    });
                  }}
                >
                  HR预审已通过
                </li>
                <li
                  className={
                    this.state.cms ==
                    `hrPreAprrove = 'N' and C3_653481734712 = '${this.state.right.location}'`
                      ? 'cur'
                      : ''
                  }
                  onClick={() => {
                    this.setState({
                      cms: `hrPreAprrove = 'N' and C3_653481734712 = '${this.state.right.location}'`
                    });
                  }}
                >
                  HR预审未通过
                </li>

                <li
                  className={
                    this.state.cms ==
                    `C3_653481734712 = '${this.state.right.location}' and isStreamEnd = 'Y' and isnull(hrEndApprove,'') = ''`
                      ? 'cur'
                      : ''
                  }
                  onClick={() => {
                    this.setState({
                      cms: `C3_653481734712 = '${this.state.right.location}' and isStreamEnd = 'Y' and isnull(hrEndApprove,'') = ''`
                    });
                  }}
                >
                  HR终审未审批
                </li>
                <li
                  className={
                    this.state.cms ==
                    `hrEndApprove = 'Y' and C3_653481734712 = '${this.state.right.location}'`
                      ? 'cur'
                      : ''
                  }
                  onClick={() => {
                    this.setState({
                      cms: `hrEndApprove = 'Y' and C3_653481734712 = '${this.state.right.location}'`
                    });
                  }}
                >
                  HR终审已通过
                </li>
                <li
                  className={
                    this.state.cms ==
                    `hrEndApprove = 'N' and C3_653481734712 = '${this.state.right.location}'`
                      ? 'cur'
                      : ''
                  }
                  onClick={() => {
                    this.setState({
                      cms: `hrEndApprove = 'N' and C3_653481734712 = '${this.state.right.location}'`
                    });
                  }}
                >
                  HR终审未通过
                </li>
              </>
            ) : null}
          </ul>
        </sider>
        <content>
          <Modal
            title={'变更审批人'}
            width={'90vw'}
            visible={this.state.changeApprove}
            footer={null}
            onCancel={() => this.setState({ changeApprove: false })}
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
          <Modal
            title={'人员列表'}
            width={'90vw'}
            visible={this.state.memberD}
            footer={null}
            onCancel={() => this.setState({ memberD: false })}
          >
            <div
              style={{
                width: '100%',
                height: 'calc(80vh - 104px)',
                position: 'relative'
              }}
            >
              <TableData
                resid={422485234051}
                hasRowView={false}
                subtractH={220}
                hasAdd={false}
                hasRowSelection={false}
                hasRowDelete={false}
                hasRowModify={false}
                hasModify={false}
                recordFormUseAbsolute={true}
                hasDelete={false}
                style={{ height: '100%' }}
                hasRowView={false}
                customRowBtns={[
                  record => {
                    return (
                      <Button
                        onClick={() => {
                          this.setState({
                            C3_637425666513: record,
                            memberD: false
                          });
                          this.getReplacementJobcode(record);
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
          <Modal
            width={'90vw'}
            visible={this.state.commandVisible}
            title={'审批流变更'}
            footer={
              <>
                <Button
                  type="primary"
                  onClick={() =>
                    this.setState({
                      stream: this.state.streamChange,
                      commandVisible: false
                    })
                  }
                >
                  确定
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ streamChange: this.state.stream });
                  }}
                >
                  重置
                </Button>
              </>
            }
            onCancel={() => this.setState({ commandVisible: false })}
          >
            <div style={{ width: '85vw', height: '60vh', overflow: 'auto' }}>
              {this.state.streamChange.map((item, key) => {
                return (
                  <div>
                    <div style={{ height: '16px' }}></div>
                    <span style={{ width: '240px', display: 'inline-block' }}>
                      {key + 1 + '.' + item.stepName + '-' + item.stepPeople}
                    </span>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.setState({ changeApprove: true, changeKey: key });
                      }}
                    >
                      更改人员
                    </Button>
                    <Button
                      style={{ marginLeft: '8px' }}
                      type="danger"
                      onClick={() => {
                        var arr = this.state.streamChange;
                        var arrAfter = [];
                        var n = 0;
                        while (n < arr.length) {
                          if (n != key) {
                            arrAfter.push(arr[n]);
                          }
                          n++;
                        }
                        n = 0;
                        while (n < arrAfter.length) {
                          arrAfter[n].auditRecno = n + 1;
                          n++;
                        }
                        console.log(arrAfter);
                        this.setState({ streamChange: arrAfter });
                      }}
                    >
                      删除节点
                    </Button>
                    <div
                      style={{
                        height: '16px',
                        width: 'calc(90vw - 48px)',
                        borderBottom: '1px solid #e8e8e8'
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </Modal>
          <Modal
            width={'90vw'}
            visible={this.state.visibleHC}
            footer={
              this.state.C3_637425449725 === '否' ? (
                <>
                  <Button
                    type="danger"
                    style={{ marginLeft: '8px' }}
                    onClick={() => {
                      this.approveHC('N');
                    }}
                  >
                    不通过审核
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      this.approveHC('Y');
                    }}
                  >
                    保存并通过HC审核
                  </Button>
                </>
              ) : this.state.C3_637425449725 && this.state.iiviJobCode ? (
                <>
                  <Button
                    type="danger"
                    style={{ marginLeft: '8px' }}
                    onClick={() => {
                      this.approveHC('N');
                    }}
                  >
                    不通过审核
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      this.approveHC('Y');
                    }}
                    disabled={this.state.C3_637425449725 == '否' ? true : false}
                  >
                    保存并通过HC审核
                  </Button>
                </>
              ) : (
                '至少全部填选完第1、3项才能提交'
              )
            }
            onCancel={() =>
              this.setState({
                visibleHC: false,
                C3_637425449725: '',
                iiviJobCode: '',
                C3_637425470106: '',
                C3_637425577105: '',
                C3_637425666513: ''
              })
            }
          >
            <b>
              <span style={{ color: 'red' }}>*</span>是否涉及Headcount：
            </b>
            <Select
              style={{ width: '200px' }}
              value={this.state.C3_637425449725}
              onChange={v => {
                this.setState({ C3_637425449725: v });
              }}
            >
              <Option key="是" value="是">
                {'是'}
              </Option>
              <Option key="否" value="否">
                {'否'}
              </Option>
            </Select>
            <div style={{ width: '100%', height: '1rem' }}></div>
            <b>Headcount类型：</b>
            <Select
              disabled={this.state.C3_637425449725 == '否' ? true : false}
              style={{ width: '200px' }}
              value={
                this.state.C3_637425449725 == '否'
                  ? null
                  : this.state.C3_637425577105
              }
              onChange={v => {
                this.setState({ C3_637425577105: v });
              }}
            >
              {this.state.HCList.map((item, key) => {
                return (
                  <Option key={key} value={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
            <div style={{ width: '100%', height: '1rem' }}></div>
            <b>
              替代人：
              {this.state.C3_637425666513
                ? this.state.C3_637425666513.C3_227192484125 +
                  '-' +
                  this.state.C3_637425666513.C3_305737857578
                : '请点击右边的按钮选择人员'}
            </b>
            <Button
              disabled={this.state.C3_637425577105 == 'New' ? true : false}
              style={{ marginLeft: '8px' }}
              type="primary"
              onClick={() => {
                this.setState({ memberD: true });
              }}
            >
              选择人员
            </Button>
            <div style={{ width: '100%', height: '1rem' }}></div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <b>
                {this.state.C3_637425449725 !== '否' ? (
                  <span style={{ color: 'red' }}>*</span>
                ) : null}
                Job Code：
              </b>
              <Input
                style={{ width: 200 }}
                value={this.state.iiviJobCode}
                onChange={e => {
                  this.setState({
                    iiviJobCode: e.target.value
                  });
                }}
                disabled={this.state.C3_637425449725 == '否' ? true : false}
              />
              {this.state.C3_637425577105 === 'New' && (
                <Button
                  style={{ marginLeft: '8px' }}
                  type="primary"
                  onClick={() => {
                    this.setState({ selectJobcodeModal: true });
                  }}
                >
                  选择Job Code
                </Button>
              )}
            </div>
            <div style={{ width: '100%', height: '1rem' }}></div>

            <b>备注：</b>
            <div style={{ width: '100%', height: '.5rem' }}></div>

            <Input.TextArea
              maxLength={500}
              style={{ resize: 'none' }}
              value={this.state.C3_637425470106}
              onChange={v => {
                this.setState({ C3_637425470106: v.target.value });
              }}
            />
          </Modal>
          <Modal
            width={'60vw'}
            visible={this.state.conUnpass}
            onCancel={() => this.setState({ conUnpass: false })}
            footer={
              <>
                <Button
                  onClick={() => {
                    this.setState({ conUnpass: false });
                  }}
                >
                  取消
                </Button>
                {this.state.cms ==
                `C3_653481734712 = '${this.state.right.location}' and isStreamEnd = 'Y' and isnull(hrEndApprove,'') = ''` ? (
                  <Button
                    type="primary"
                    onClick={() => {
                      this.approve('N', true);
                    }}
                  >
                    确认
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => {
                      this.approve('N');
                    }}
                  >
                    确认
                  </Button>
                )}
              </>
            }
          >
            <h3>请输入审核未通过的理由</h3>
            <p>({this.state.C3_632503853105.length}/200字)</p>
            <Input.TextArea
              maxLength={200}
              style={{
                marginTop: 16,
                width: '60vw',
                height: 120,
                resize: 'none'
              }}
              value={this.state.C3_632503853105}
              onChange={v => {
                this.setState({ C3_632503853105: v.target.value });
              }}
              placeholder="最多输入200字"
            />
          </Modal>
          <Modal
            width={'90vw'}
            visible={this.state.showJob}
            footer={null}
            onCancel={() => {
              this.setState({ showJob: false });
            }}
          >
            <div style={{ width: '100%', height: '80vh' }}>
              <TableData
                baseURL={this.url80}
                resid="638305113445"
                subtractH={200}
                hasAdvSearch={false}
                hasAdd={false}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                hasRowSelection={false}
                recordFormUseAbsolute={true}
                actionBarWidth={100}
                customRowBtns={[
                  record => {
                    return (
                      <Button
                        onClick={() => {
                          this.setState({
                            toCheckFront: {
                              ...this.state.toCheckFront,
                              jobId: record.orgNumber
                            },
                            showJob: false
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
          <Modal
            width={'90vw'}
            visible={this.state.visible}
            footer={
              this.state.cms ==
              `headcount = 'waiting' and C3_653481734712 = '${this.state.right.location}'` ? (
                <Button
                  type="primary"
                  onClick={() => this.setState({ visibleHC: true })}
                  disabled={
                    this.state.right.HCPreApprove === 'Y' ? false : true
                  }
                >
                  填写HC审批信息
                </Button>
              ) : this.state.cms ==
                  `hrPreAprrove = 'waiting' and C3_653481734712 = '${this.state.right.location}'` ||
                this.state.cms ==
                  `C3_653481734712 = '${this.state.right.location}' and isStreamEnd = 'Y' and isnull(hrEndApprove,'') = ''` ? (
                this.state.stream.length == 0 ? (
                  '审批流计算中，不可预审。请耐心等待...'
                ) : (
                  <>
                    <Button
                      type="danger"
                      loading={this.state.loading}
                      style={{ marginLeft: '8px' }}
                      onClick={() => {
                        this.setState({ conUnpass: true });
                      }}
                    >
                      不通过审核
                    </Button>

                    {this.state.cms ==
                    `C3_653481734712 = '${this.state.right.location}' and isStreamEnd = 'Y' and isnull(hrEndApprove,'') = ''` ? (
                      this.state.toCheckFront.effortDate &&
                      this.state.toCheckFront.jobId ? (
                        <Button
                          type="primary"
                          style={{ padding: '0 8px' }}
                          onClick={() => {
                            this.approve('Y', true);
                          }}
                        >
                          保存并通过审核
                        </Button>
                      ) : (
                        ' 请先填写生效日期和岗位代码'
                      )
                    ) : (
                      <Button
                        type="primary"
                        loading={this.state.loading}
                        onClick={() => this.approve('Y')}
                      >
                        保存并通过审核
                      </Button>
                    )}
                  </>
                )
              ) : null
            }
            onCancel={() => this.setState({ visible: false })}
          >
            <div className="toCheck" style={{ height: '60vh' }}>
              <div
                className="steps"
                style={{ width: 'calc(100% - 48px)', marginLeft: '24px' }}
              >
                {this.state.stream.length == 0 ? (
                  '正在计算审批流'
                ) : (
                  <Steps size="small" current={this.state.curStep}>
                    {this.state.stream.map((item, key) => {
                      return (
                        <Step
                          title={item.stepName}
                          description={<span>{item.stepPeople}</span>}
                        />
                      );
                    })}
                  </Steps>
                )}
                <div style={{ clear: 'both' }}></div>
                {this.state.cms ==
                  `hrPreAprrove = 'waiting' and C3_653481734712 = '${this.state.right.location}'` &&
                this.state.stream.length > 0 ? (
                  <Button
                    onClick={() => {
                      this.setState({ commandVisible: true });
                    }}
                    style={{ marginTop: 8 }}
                  >
                    变更审批流
                  </Button>
                ) : null}
                <div
                  className="showContent"
                  style={{ marginTop: 24, width: '100%', marginLeft: '0' }}
                >
                  <b>生效时间：</b>
                  <DatePicker
                    value={this.state.toCheckFront.effortDate}
                    onChange={v =>
                      this.setState({
                        toCheckFront: {
                          ...this.state.toCheckFront,
                          effortDate: v
                        }
                      })
                    }
                  />
                  <b>变动类型：{this.state.toCheckFront.changeType}</b>
                  <br />
                  <br />
                  <b>变动原因：</b>
                  <span>{this.state.toCheckFront.changeReason}</span>
                  <b>Job Code：</b>
                  <span>{this.state.toCheckFront.iiviJobCode}</span>
                  <br />
                  {this.state.cms ==
                  `hrEndApprove = 'Y' and C3_653481734712 = '${this.state.right.location}'` ? (
                    <>
                      <b>岗位代码：</b>
                      <span>{this.state.toCheckFront.jobId}</span>
                      <br />
                    </>
                  ) : null}
                  {this.state.cms ==
                  `C3_653481734712 = '${this.state.right.location}' and isStreamEnd = 'Y' and isnull(hrEndApprove,'') = ''` ? (
                    <>
                      <b>岗位代码：</b>
                      <span>
                        {this.state.toCheckFront.jobId ? (
                          this.state.toCheckFront.jobId
                        ) : (
                          <b style={{ color: '#f5222d' }}>请选择岗位</b>
                        )}
                      </span>
                      <Button
                        size="small"
                        icon="search"
                        onClick={() => {
                          this.setState({ showJob: true });
                        }}
                      >
                        搜索岗位
                      </Button>
                      <br />
                    </>
                  ) : null}
                  {this.state.toCheckFront.C3_632503853105 ? (
                    <div>
                      <b>审核反馈信息：</b>
                      <span>{this.state.toCheckFront.C3_632503853105}</span>
                    </div>
                  ) : null}
                  <div className="tableWrap">
                    <Spin spinning={this.state.loading}>
                      {/* <div style={{ float: 'left' }}>
                        <ul style={{ padding: '0' }}>
                          <li>
                            {' '}
                            <b>姓名: </b>
                            {this.state.toCheckFront.person}
                          </li>
                          <li>
                            <b>部门名: </b>
                            {this.state.toCheckFront.depart ===
                            this.state.toCheck[0] ? (
                              this.state.toCheckFront.depart
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {this.state.toCheckFront.depart +
                                  ' => ' +
                                  this.state.toCheck[0]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>岗位名: </b>
                            {this.state.toCheckFront.jobName ===
                            this.state.toCheck[1] ? (
                              this.state.toCheckFront.jobName
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {this.state.toCheckFront.jobName +
                                  ' => ' +
                                  this.state.toCheck[1]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>级别: </b>
                            {this.state.toCheckFront.level ===
                            this.state.toCheck[2] ? (
                              this.state.toCheckFront.level
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {this.state.toCheckFront.level +
                                  ' => ' +
                                  this.state.toCheck[2]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>主管: </b>
                            {this.state.toCheckFront.driectorName ===
                            this.state.toCheck[3] ? (
                              this.state.toCheckFront.driectorName
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {this.state.toCheckFront.driectorName +
                                  ' => ' +
                                  this.state.toCheck[3]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>项目代码: </b>
                            {this.state.toCheckFront.proj_code ===
                            this.state.toCheck[4] ? (
                              this.state.toCheckFront.proj_code
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {this.state.toCheckFront.proj_code +
                                  ' => ' +
                                  this.state.toCheck[4]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>BU CODE: </b>
                            {(this.state.toCheckFront.bucode || '') ===
                            this.state.toCheck[5] ? (
                              this.state.toCheckFront.bucode
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {(this.state.toCheckFront.bucode || '') +
                                  ' => ' +
                                  this.state.toCheck[5]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>一级部门: </b>
                            {(this.state.toCheckFront.firstDepart || '') ===
                            this.state.toCheck[6] ? (
                              this.state.toCheckFront.firstDepart
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {(this.state.toCheckFront.firstDepart || '') +
                                  ' => ' +
                                  this.state.toCheck[6]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>二级部门: </b>
                            {(this.state.toCheckFront.secondDepart || '') ===
                            this.state.toCheck[7] ? (
                              this.state.toCheckFront.secondDepart
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {(this.state.toCheckFront.secondDepart || '') +
                                  ' => ' +
                                  this.state.toCheck[7]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>三级部门: </b>
                            {(this.state.toCheckFront.thirdDepart || '') ===
                            this.state.toCheck[8] ? (
                              this.state.toCheckFront.thirdDepart
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {(this.state.toCheckFront.thirdDepart || '') +
                                  ' => ' +
                                  this.state.toCheck[8]}
                              </b>
                            )}
                          </li>
                          <li>
                            <b>四级部门: </b>
                            {(this.state.toCheckFront.fourthDepart || '') ===
                            this.state.toCheck[9] ? (
                              this.state.toCheckFront.fourthDepart
                            ) : (
                              <b style={{ color: '#f5222d' }}>
                                {(this.state.toCheckFront.fourthDepart || '') +
                                  ' => ' +
                                  this.state.toCheck[9]}
                              </b>
                            )}
                          </li>
                        </ul>
                      </div> */}
                      {this.state.toCheckFront.ApproveRemark ? (
                        <>
                          <br />
                          <b>审批说明:</b>
                          <p>{this.state.toCheckFront.ApproveRemark}</p>
                        </>
                      ) : null}
                      {/* <div style={{ float: 'left' }}>
                        <ul style={{ padding: '0', marginLeft: '-1px' }}>
                          <li>
                            <b>是否有Headcount：</b>
                            <span>
                              {this.state.toCheckFront.C3_637425449725
                                ? this.state.toCheckFront.C3_637425449725
                                : ''}
                            </span>
                          </li>

                          <li>
                            <b>headcount变更类型：</b>
                            <span>
                              {this.state.toCheckFront.C3_637425577105
                                ? this.state.toCheckFront.C3_637425577105
                                : ''}
                            </span>
                          </li>
                          <li>
                            <b>替代人：</b>
                            <span>
                              {this.state.toCheckFront.C3_637617454519
                                ? this.state.toCheckFront.C3_637617454519
                                : ''}
                            </span>
                          </li>
                          <li>
                            <b>招聘人员备注：</b>
                            <span>
                              {this.state.toCheckFront.C3_637425470106
                                ? this.state.toCheckFront.C3_637425470106
                                : ''}
                            </span>
                          </li>

                          <li>
                            <b>招聘人员确认人姓名：</b>
                            <span>
                              {this.state.toCheckFront.C3_637425935795
                                ? this.state.toCheckFront.C3_637425935795
                                : ''}
                            </span>
                          </li>
                        </ul>
                      </div> */}
                      <ChangedInfoForm
                        toCheckFront={this.state.toCheckFront}
                        toCheck={this.state.toCheck}
                        HCPreApprove={this.state.right.HCPreApprove}
                        isShowButton={
                          this.state.cms ===
                          `hrPreAprrove = 'waiting' and C3_653481734712 = '${this.state.right.location}'`
                            ? true
                            : false
                        }
                        sendFormDataToFather={this.sendFormDataToFather}
                      />
                    </Spin>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <Modal
            title={'选择Job Code'}
            width={'90vw'}
            visible={this.state.selectJobcodeModal}
            footer={null}
            onCancel={() => this.setState({ selectJobcodeModal: false })}
          >
            <div
              style={{
                width: '100%',
                height: 'calc(80vh - 104px)',
                position: 'relative'
              }}
            >
              <TableData
                resid={659552172710}
                baseURL={WuxiHr03BaseURL}
                downloadURL={this.downloadURL}
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
                          this.setState({
                            selectJobcodeModal: false,
                            iiviJobCode: record.JobCode
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
          <Modal
            title={'修改Job Code'}
            width={'90vw'}
            visible={this.state.modiJobCode}
            footer={null}
            onCancel={() => this.setState({ modiJobCode: false })}
          >
            <div
              style={{
                width: '100%',
                height: 'calc(80vh - 104px)',
                position: 'relative'
              }}
            >
              <TableData
                resid={662164687438}
                baseURL={this.url80}
                downloadURL={this.downloadURL}
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
                          this.handlemodiJobCode(
                            record.C3_662164707799,
                            this.state.toModi
                          );
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
          <Spin spinning={this.state.loading}>
            <div style={{ height: 'calc(100vh - 48px)' }}>
              {this.state.cms != `` ? (
                this.state.right.HCPreApprove == 'Y' ||
                this.state.right.HRPreApprove == 'Y' ? (
                  <TableData
                    resid={632255761674}
                    cmswhere={this.state.cms}
                    hasRowView={false}
                    hasAdd={false}
                    refTargetComponentName="TableData"
                    wrappedComponentRef={element =>
                      (this.tableDataRef = element)
                    }
                    hasRowDelete={false}
                    hasRowModify={false}
                    hasModify={false}
                    hasDelete={false}
                    style={{ height: '100%' }}
                    recordFormUseAbsolute={true}
                    hasRowView={false}
                    actionBarWidth={120}
                    actionBarFixed={true}
                    hasRowSelection={true}
                    actionBarExtra={({ dataSource, selectedRowKeys }) => {
                      return (
                        <>
                          {this.state.cms ==
                          `hrPreAprrove = 'waiting' and C3_653481734712 = '${this.state.right.location}'` ? (
                            <Button
                              type="primary"
                              disabled={!(selectedRowKeys.length > 0)}
                              style={{ padding: '0 8px' }}
                              onClick={() => {
                                this.approveGroup(dataSource, selectedRowKeys);
                              }}
                            >
                              批量审批通过
                            </Button>
                          ) : null}
                          {this.state.cms ===
                          `hrPreAprrove = 'Y' and C3_653481734712 = '${this.state.right.location}'` ? (
                            <Button
                              type="primary"
                              width={'160px'}
                              onClick={() => {
                                this.handleNoticePorposal(
                                  dataSource,
                                  selectedRowKeys
                                );
                              }}
                            >
                              通知申请人信息已变动
                            </Button>
                          ) : null}
                        </>
                      );
                    }}
                    // approveGroup
                    customRowBtns={[
                      record => {
                        return (
                          <>
                            <Button
                              style={{ width: '104px' }}
                              onClick={() => {
                                this.showOverlay(record);
                              }}
                            >
                              确认信息
                            </Button>
                            {this.state.cms ==
                            `hrEndApprove = 'Y' and C3_653481734712 = '${this.state.right.location}'` ? (
                              <Button
                                style={{ width: '104px' }}
                                onClick={() => {
                                  this.setState({
                                    modiJobCode: true,
                                    toModi: record.REC_ID
                                  });
                                }}
                              >
                                修改Job Code
                              </Button>
                            ) : null}
                          </>
                        );
                      }
                    ]}
                  />
                ) : (
                  <h3> 您无权查看，请联系管理员添加权限。</h3>
                )
              ) : null}
            </div>
          </Spin>
        </content>
      </div>
    );
  }
}

export default IDLTransferHr;
