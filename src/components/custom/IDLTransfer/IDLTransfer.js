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
import './IDLTransfer.less';
import TableData from '../../common/data/TableData';
import qs from 'qs';
import http from 'Util20/api';
import moment from 'moment';
import IDLTransferVerify from '../IDLTransferVerify';
import IDLTransferVerifyAction from '../IDLTransferVerifyAction';
import { async } from 'q';

const { Option } = Select;
const { TabPane } = Tabs;
const { Step } = Steps;
const subresid = 632314794466; //子表resid
const WuxiHr03BaseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03BaseURL;

//正式环境与测试环境分别建表，resid不一致
const bucodeResid =
  WuxiHr03BaseURL !== 'http://10.108.2.66:7001/'
    ? '668190417178'
    : '668189585712';

class IDLTransfer extends Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    var jobNum = userInfo.UserInfo.EMP_ID;
    this.state = {
      companyArr: [],
      draft: [{ publishCode: '', data: [{ person: '' }] }], //草稿
      userId: jobNum, //当前用户编号
      chooseFo: false, //是否选择下属
      typeResid: '',
      checkGroup: {
        date: false,
        depaCode: false,
        proCode: false,
        supervisor: false,
        job: false,
        class: false,
        bucode: false,
        reason: true
      }, //必填项
      depaOrg: null, //部门的原始数据
      step: 0, //申请步骤
      selectedRecord: [], //选中的人
      hint: '', //提交结果提示
      page: '1', //tab页
      result: 'success', //是否提交成功
      selection: '1', //申请记录筛选选择
      // checkPoint:[['原部门主管','张三'],['原部门经理','李四']],//需要审批的节点
      isSub: false, //是否已经提交过申请
      loading: false,
      department: [], //部门数据,
      depaMember: [
        {
          title: 'Node1',
          value: '0-0',
          key: '0-0',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1'
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2'
            }
          ]
        }
      ], // 部门下的调动前直属上级
      depaMemberV: '', //选中的调动前直属上级
      company: [
        { name: '无锡', value: '100' },
        { name: '上海', value: '2000' }
      ], //公司数据，
      companyV: '100', //选中的公司值
      depaV: null, //选中的部门值
      selectMem: [], //选中的人员
      searchDepaV: false, //搜索部门模态框是否可见
      searchSuperV: false, //搜索主管模态框是否可见
      searchJobV: false, //搜索职位模态框是否可见
      lvList: [], //级别下拉选择列表
      depaSele: [
        {
          C3_461011945566: '',
          C3_461011949004: '',
          C3_461011961036: '',
          C3_461011968036: ''
        }
      ], //原部门的一级部门二级部门三级部门四级部门的数据
      changeReason: '', //变动原因,
      depaFilter: '', //选择部门时的公司筛选,

      curPeopleId: '',
      curPeopleKey: 0,
      showCraft: false,
      bucodeGroup: [],
      isDirector: true //是否是主管，主管才可以提交
    };
  }
  componentWillMount() {}
  componentDidMount() {
    this.getLv();
    this.getCompany();
    this.getBucode();
    this.getTypeAndTitle();
    this.handleIsDirector();
  }
  getCompany = async () => {
    let res;
    res = await http().getTable({
      resid: 548936690604
    });
    this.setState({ companyArr: res.data });
    if (res.data) {
      this.setState({ depaFilter: res.data[1].C3_419448436728 });
    }
  };
  //获取地址栏参数跳转页面
  getTypeAndTitle = () => {
    const quertString = window.location.search;
    const qsObj = qs.parse(quertString.substring(1));
    var page = qsObj.page;
    if (page) {
      this.setState({
        page: page
      });
    }
  };
  getBucode = async () => {
    var res;
    try {
      res = await http().getTableColumnDefine({
        resid: 632255761674
      });

      var data = res.data;
      var n = 0;
      var arr;
      while (n < data.length) {
        if (data[n].ColName == 'nBuCode') {
          arr = data[n].DisplayOptions;
        }
        n++;
      }
      this.setState({ bucodeGroup: arr });
    } catch (e) {}
  };
  //  第二页提交前检查未填项
  checkUnfill = () => {
    var msg;
    var bol = false;
    var bol2 = true;
    var n = 0;
    var c = 0;
    var d = 0;
    var bol3 = false;
    let values = [];
    for (let property in this.state.selectMem) {
      values.push(this.state.selectMem[property]);
    }

    while (n < values.length) {
      if (values[n].checkGroup.date && !values[n].activeDate) {
        if (!msg) {
          msg = '生效日期';
          bol = true;
          c = n;
        }
      } else if (
        values[n].checkGroup.newDepa &&
        !values[n].newDepa.C3_419339113187
      ) {
        if (!msg) {
          msg = '变更后部门代码';
          bol = true;
          c = n;
        }
      } else if (values[n].checkGroup.proCode && !values[n].proCode) {
        if (!msg) {
          msg = '变更后项目代码';
          bol = true;
          c = n;
        }
      } else if (
        values[n].checkGroup.supervisor &&
        !values[n].newSuper.C3_227192484125
      ) {
        if (!msg) {
          msg = '变更后主管';
          bol = true;
          c = n;
        }
      } else if (values[n].checkGroup.job && !values[n].job.C3_662164716971) {
        if (!msg) {
          msg = '岗位';
          bol = true;
          c = n;
        }
      } else if (values[n].checkGroup.lv && !values[n].lv) {
        if (!msg) {
          msg = '变更后级别';
          bol = true;
          c = n;
        }
      } else if (values[n].checkGroup.bucode && !values[n].bucode) {
        if (!msg) {
          msg = 'bucode';
          bol = true;
          c = n;
        }
      }
      // else if (values[n].checkGroup.reason && !values[n].reason) {
      //   if (!msg) {
      //     msg = '变动原因';
      //     bol = true;
      //     bol3 = true;
      //     c = n;
      //   }
      // }
      var e = 0;
      if (!values[n].checkGroup.newDepa) {
        e = e + 1;
      }
      if (!values[n].checkGroup.proCode) {
        e = e + 1;
      }
      if (!values[n].checkGroup.supervisor) {
        e = e + 1;
      }
      if (!values[n].checkGroup.job) {
        e = e + 1;
      }
      if (!values[n].checkGroup.lv) {
        e = e + 1;
      }
      if (!values[n].checkGroup.bucode) {
        e = e + 1;
      }
      if (e == 6) {
        if (bol2 == true) {
          d = n;
          bol2 = false;
        }
      }
      n++;
    }
    console.log('n', n);
    if (bol == true) {
      if (bol3) {
        message.error('您还未填写第' + (c + 1) + '人的' + msg, 10);
      } else {
        message.error(
          '您还未填写第' + (c + 1) + '人的' + msg + ',若无需更改请取消选中状态',
          10
        );
      }
      return false;
    }
    if (bol2 == false) {
      message.error('您还未填写第' + (d + 1) + '人的变动信息', 10);
      return false;
    }
  };
  //获取第二页必填项
  getBitian = async v => {
    this.setState({ changeType: v, loading: true, newDepa: {} });
    var resid = '';
    if (v == '部门变更') {
      resid = '634822081509';
    } else if (v == '汇报关系变更') {
      resid = '634822110774';
    } else if (v == '职位变更') {
      resid = '634822131537';
    } else if (v == '级别变更') {
      resid = '634820028458';
    }
    var res;
    try {
      res = await http().getFieldProp({
        resid: resid,
        getcolumninfo: 1
      });

      var resField = [
        'effortDate',
        'nDepartCode',
        'nProj_Code',
        'nDirectorNum',
        'nJobCode',
        'nLevel',
        'nBuCode',
        'changeReason'
      ];
      var stateField = Object.keys(this.state.checkGroup);
      var fin = this.state.checkGroup;
      var n = 0;
      var check = [];
      while (n < res.cmscolumninfo.length) {
        var c = 0;
        while (c < resField.length) {
          if (resField[c] == res.cmscolumninfo[n].id) {
            var k = stateField[c];
            check.push(k);
            fin[k] = res.cmscolumninfo[n][resField[c]].isBiTian;
          }
          c++;
        }
        n++;
      }
      console.log('fin', fin);
      if (fin.depaCode == false) {
        this.setState({ newDepa: this.state.depaSele[0] });
      }
      if (fin.supervisor == false) {
        this.setState({
          newSuper: {
            C3_227192484125: this.state.selectMem[0].C3_417993433650,
            C3_305737857578: this.state.selectMem[0].C3_417993417686
          }
        });
      }
      this.setState({ loading: false, checkGroup: fin });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };
  //判定是否是主管身份，主管才有权限提交
  handleIsDirector = async () => {
    const currentUsercode = this.getAppInfo();
    let res;
    try {
      res = await http({ baseURL: WuxiHr03BaseURL }).getTable({
        resid: 620151840444,
        cmswhere: `C3_417993417686 = '${currentUsercode}'`
      });
      if (res.data.length > 0) {
        this.setState({
          isDirector: true,
          loading: false
        });
      } else {
        this.setState({
          isDirector: false,
          loading: false
        });
      }
    } catch (error) {
      console.log(error.message);
      message.info(error.message);
    }
  };
  //获取申请人信息
  getAppInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    var usercode = userInfo.UserInfo.EMP_USERCODE;
    return usercode;
  };
  //获取级别信息
  getLv = async () => {
    this.setState({ loading: true });
    var res = '';
    try {
      res = await http({ baseURL: this.baseURL }).getTable({
        resid: 666268376334
      });
      var n = 0;
      var arr = [];
      while (n < res.data.length) {
        arr.push({
          value: res.data[n].type,
          key: res.data[n].type
        });
        n++;
      }
      this.setState({ lvList: arr });
      this.getDepartment('100');
    } catch (e) {
      this.setState({ loading: false });
      console.log(e);
    }
  };
  //  获取部门的树的数据并整理数据
  getDepartment = async v => {
    this.setState({ department: [], loading: true });
    var res = '';
    try {
      res = await http().getTable({
        resid: 632327119162,
        cmswhere: `C3_419448448137 = '${v}'`
      });
      this.setState({ depaOrg: res.data });
      var n = 0;
      var obj = res.data;
      var arr = [];
      // 设置arr初始值
      n = 0;
      while (n < obj.length) {
        if (obj[n].C3_417731575935 != 'Y' && obj[n].C3_419448436728) {
          //一级部门C3_461011945566
          //二级部门C3_461011949004
          //三级部门C3_461011961036
          //四级部门C3_461011968036
          var level = 0;
          if (obj[n].C3_461011961036 == obj[n].DEP_ID) {
            level = 3;
          } else if (obj[n].C3_461011949004 == obj[n].DEP_ID) {
            level = 2;
          } else if (obj[n].C3_461011945566 == obj[n].DEP_ID) {
            level = 1;
          } else if (obj[n].C3_461011968036 == obj[n].DEP_ID) {
            level = 4;
          }
          arr.push({
            title: obj[n].DEP_NAME_EN,
            value: obj[n].DEP_ID,
            key: obj[n].DEP_ID,
            level: level,
            C3_461011945566: obj[n].C3_461011945566,
            C3_461011949004: obj[n].C3_461011949004,
            C3_461011961036: obj[n].C3_461011961036,
            C3_461011968036: obj[n].C3_461011968036
          });
        }
        n++;
      }
      obj = [];
      var obj1 = [];
      var obj2 = [];
      var obj3 = [];
      var obj4 = [];
      n = 0;
      while (n < arr.length) {
        if (arr[n].level == 0) {
          obj.push(arr[n]);
        } else if (arr[n].level == 1) {
          obj1.push(arr[n]);
        } else if (arr[n].level == 2) {
          obj2.push(arr[n]);
        } else if (arr[n].level == 3) {
          obj3.push(arr[n]);
        } else if (arr[n].level == 4) {
          obj4.push(arr[n]);
        }
        n++;
      }
      var c;
      n = 0;
      while (n < obj3.length) {
        c = 0;
        while (c < obj4.length) {
          if (obj3[n].value == obj4[c].C3_461011961036) {
            if (obj3[n].children) {
              obj3[n].children.push(obj4[c]);
            } else {
              obj3[n].children = [obj4[c]];
            }
          }
          c++;
        }
        n++;
      }
      n = 0;
      while (n < obj2.length) {
        c = 0;

        while (c < obj3.length) {
          if (obj2[n].value == obj3[c].C3_461011949004) {
            if (obj2[n].children) {
              obj2[n].children.push(obj3[c]);
            } else {
              obj2[n].children = [obj3[c]];
            }
          }
          c++;
        }
        n++;
      }
      n = 0;
      while (n < obj1.length) {
        c = 0;

        while (c < obj2.length) {
          if (obj1[n].value == obj2[c].C3_461011945566) {
            if (obj1[n].children) {
              obj1[n].children.push(obj2[c]);
            } else {
              obj1[n].children = [obj2[c]];
            }
          }
          c++;
        }
        n++;
      }
      n = 0;
      while (n < obj.length) {
        c = 0;

        while (c < obj1.length) {
          if (obj[n].value == obj1[c].C3_461011961036) {
            if (obj[n].children) {
              obj[n].children.push(obj1[c]);
            } else {
              obj[n].children = [obj1[c]];
            }
          }
          c++;
        }
        n++;
      }
      obj1 = obj1.sort(function(a, b) {
        return a.title.localeCompare(b.title);
      });
      // 排序
      n = 0;
      while (n < obj1.length) {
        if (obj1[n].children) {
          c = 0;
          while (c < obj1[n].children.length) {
            if (obj1[n].children[c].children) {
              obj1[n].children[c].children = obj1[n].children[c].children.sort(
                function(a, b) {
                  return a.title.localeCompare(b.title);
                }
              );
            }
            c++;
          }
          obj1[n].children = obj1[n].children.sort(function(a, b) {
            return a.title.localeCompare(b.title);
          });
        }

        n++;
      }

      this.setState({ loading: false, department: obj1 });
    } catch (e) {
      this.setState({ loading: false });
      console.log(e);
    }
  };
  //  获取部门下面的人员并整理数据成tree
  getDepaMem = async v => {
    this.setState({ loading: true });
    try {
      let res = await http().getTable({
        resid: 609599795438,
        cmswhere: `HRUSER_DEP2ID = '${v}'`
      });

      function listToTree(list = []) {
        const data = JSON.parse(JSON.stringify(list)); // 浅拷贝不改变源数据
        const result = [];
        if (!Array.isArray(data)) {
          return result;
        }
        data.forEach(item => {
          delete item.children;
        });
        const map = {};
        data.forEach(item => {
          map[item.value] = item;
        });
        data.forEach(item => {
          const parent = map[item.parent_value];
          if (parent) {
            (parent.children || (parent.children = [])).push(item);
          } else {
            result.push(item);
          }
        });
        return result;
      }
      var arr = res.data;
      var n = 0;
      var memData = [];
      while (n < arr.length) {
        memData.push({
          title:
            arr[n].C3_227192484125 + '(工号:' + arr[n].C3_227192472953 + ')',
          // value: arr[n].C3_305737857578,
          // key: arr[n].C3_305737857578,
          // parent_value: arr[n].C3_417993417686
          value: arr[n].C3_227192472953,
          key: arr[n].C3_227192472953,
          parent_value: arr[n].C3_429966115761
        });
        n++;
      }

      memData = listToTree(memData);
      this.setState({
        depaMember: memData,
        loading: false
      });
    } catch (e) {
      console.log(e);
      this.setState({
        loading: false
      });
    }
  };
  // 选择单人直接跳到第二页
  searchAndJump = async v => {
    let res;
    this.setState({ loading: true });
    try {
      let res = await http({ baseURL: this.baseURL }).getTable({
        resid: 666203805903,
        cmswhere: `C3_227192472953 = '${v}'`
      });
      var data2 = [];
      // 存部门的第一部门第二部门第三部门第四部门
      var arr = [this.state.depaV];
      this.state.depaOrg.map(item => {
        if (arr.includes(item.DEP_ID)) {
          data2.push(item);
        }
      });
      var arr = res.data;
      arr[0].searchDepaV = false;
      arr[0].searchSuperV = false;
      arr[0].newDepa = {};
      arr[0].newSuper = {};
      arr[0].job = '';
      arr[0].searchJobV = false;
      arr[0].lvList = [];
      arr[0].lv = '';
      arr[0].proCode = '';
      arr[0].bucode = '';
      arr[0].changeType = '';
      arr[0].activeDate = '';
      arr[0].proCode = '';
      arr[0].reason = '';
      arr[0].checkGroup = {
        date: false,
        depaCode: false,
        proCode: false,
        supervisor: false,
        job: false,
        class: false,
        bucode: false,
        reason: true
      };
      console.log('depaSele', data2);
      this.setState({
        selectMem: arr,
        step: 1,
        depaSele: data2,
        loading: false,
        curPeopleId: arr[0].C3_448032387764
      });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };
  // 第一页切换部门
  onChange = value => {
    this.setState({
      depaV: value,
      depaMemberV: null,
      selMemberV: null,
      selectMem: []
    });
    this.getDepaMem(value);
  };
  // 第一页切换调动前直接上级主管
  onChangeDepaMem = value => {
    this.setState({ depaMemberV: value, selectMem: [], selMemberV: null });
  };
  // 第一页切换调动前直接上级主管
  onChangeSelMem = value => {
    this.setState({ depaMemberV: value, selectMem: [], selMemberV: null });
    this.searchAndJump(value);
  };
  // 第一页切换公司
  handleChange = v => {
    this.setState({ companyV: v, depaV: null });
    // this.getDepartment(v);
  };
  // 向后台提交数据
  subData = async bol => {
    var r = this.checkUnfill();
    if (r == false) {
      return false;
    }
    this.setState({ loading: true });
    var toSub = [];
    var n = 0;

    var usercode = this.getAppInfo();
    let values = [];
    var publishCode = new Date();
    publishCode = publishCode.getTime();
    var b = 'waiting';
    if (bol == true) {
      b = 'draft';
    }
    for (let property in this.state.selectMem) {
      values.push(this.state.selectMem[property]);
    }
    while (n < this.state.selectMem.length) {
      var date = values[n].activeDate;
      if (date) {
        date = moment(date).format('YYYY-MM-DD');
      }
      let num = values[n].job.C3_662164707799;
      if (values[n].checkGroup.isNew == true) {
        num = '';
      }
      console.log(values[n]);
      var obj = {
        effortDate: date, //生效日期
        nDepartCode: values[n].newDepa.DEP_ID, //变动后部门编号
        nProj_Code: values[n].proCode, //变动后项目代码
        nDriectorCode: values[n].newSuper.C3_305737857578, //变动后主管编号
        // nJobCode: num, //变动后jobcode
        jobName: values[n].C3_661366417780, //变动前岗位
        level: values[n].C3_658407610385, //级别
        nJobName: values[n].job.C3_662164716971, //变动后岗位名
        // jobCode: values[n].jobCode, //变动前jobcode
        // nJobNameEN: values[n].job.orgJobEN, //变动后岗位英文名
        nLevel: values[n].lv, //变动后级别
        nBuCode: values[n].bucode, //变动后bucode
        personID: values[n].C3_305737857578, //人员编号
        changeReason: values[n].reason, //变动原因
        headcount: b,
        publishCode: publishCode
      };
      toSub.push(obj);
      n++;
    }
    console.log('toSub', toSub);
    var res;
    try {
      res = await http().addRecords({
        resid: 632255761674,
        data: toSub
      });
      if (b == 'draft') {
        this.setState({
          loading: false,
          result: 'success',
          hint: '草稿保存成功',
          step: 2,
          isSub: true
        });
      } else {
        this.setState({
          loading: false,
          result: 'success',
          hint: '提交成功',
          step: 2,
          isSub: true
        });
      }
    } catch (e) {
      this.setState({
        loading: false,
        result: 'error',
        hint: e.message,
        step: 2,
        isSub: false
      });
      console.log(e);
    }
  };
  getDraft = async () => {
    var res;
    this.setState({ loading: true });
    try {
      res = await http().getTable({
        resid: 632255761674,
        cmswhere: `headcount = 'draft' and applyPersonNum = '${this.state.userId}'`
      });

      var arr = [];
      var n = 0;
      if (res.data.length > 0) {
        arr.push({ publishCode: res.data[n].publishCode, data: [] });
      }
      while (n < res.data.length) {
        var c = 0;
        var bol = false;
        while (c < arr.length) {
          if (arr[c].publishCode == res.data[n].publishCode) {
            bol = true;
          }
          c++;
        }
        if (bol == false) {
          arr.push({ publishCode: res.data[n].publishCode, data: [] });
        }
        n++;
      }
      n = 0;
      while (n < res.data.length) {
        c = 0;
        while (c < arr.length) {
          if (arr[c].publishCode == res.data[n].publishCode) {
            arr[c].data.push(res.data[n]);
          }
          c++;
        }
        n++;
      }
      console.log(arr);
      this.setState({ loading: false, draft: arr });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };
  //  翻tab
  callBack = k => {
    this.setState({ page: k, isSub: false });
  };
  //  第一页跳转第二页
  subMemData = (dataSource, selectedRowKeys) => {
    var data = [];
    dataSource.map(item => {
      if (selectedRowKeys.includes(item.REC_ID)) {
        data.push(item);
      }
    });
    var data2 = [];
    // 存部门的第一部门第二部门第三部门第四部门
    var arr = [this.state.depaV];
    this.state.depaOrg.map(item => {
      if (arr.includes(item.DEP_ID)) {
        data2.push(item);
      }
    });
    var n = 0;
    while (n < data.length) {
      data[n].searchDepaV = false;
      data[n].searchSuperV = false;
      data[n].newDepa = {};
      data[n].newSuper = {};
      data[n].job = '';
      data[n].searchJobV = false;
      data[n].lvList = [];
      data[n].lv = '';
      data[n].proCode = '';
      data[n].bucode = '';
      data[n].changeType = '';
      data[n].activeDate = '';
      data[n].reason = '';
      data[n].proCode = '';
      data[n].checkGroup = {
        date: false,
        depaCode: false,
        proCode: false,
        supervisor: false,
        job: false,
        class: false,
        bucode: false,
        reason: true
      };
      n++;
    }
    console.log(data);
    this.setState({
      selectMem: data,
      step: 1,
      depaSele: data2,
      curPeopleId: data[0].C3_448032387764
    });
  };
  //  关闭部门查询模态框
  clzDepaSearch = () => {
    this.setState({ searchDepaV: false });
  };
  //切换选择单人编辑变更后的信息
  selectSingle = (v, k) => {
    this.setState({ curPeopleId: v, curPeopleKey: k });
  };
  //更改人员数组内的数据
  setValue = (v, l) => {
    var arr = this.state.selectMem;
    arr[this.state.curPeopleKey][l] = v;
    this.setState({ selectMem: arr });
  };
  setCheck = l => {
    var arr = this.state.selectMem;
    arr[this.state.curPeopleKey].checkGroup[l] = !arr[this.state.curPeopleKey]
      .checkGroup[l];
    this.setState({ selectMem: arr });
  };
  subDraft = async (v, s) => {
    this.setState({ loading: true });
    var data = [];
    v.map(item => {
      if (s.includes(item.REC_ID)) {
        data.push(item);
      }
    });
    var n = 0;
    while (n < data.length) {
      data[n].headcount = 'waiting';
      n++;
    }
    var res;

    try {
      res = await http().modifyRecords({
        resid: '632255761674',
        data: data
      });
      message.success('提交成功');
      this.setState({ loading: false, showDraft: false });
      this.getDraft();
    } catch (e) {
      this.setState({ loading: true });
      console.log(e);
    }
  };
  render() {
    const { isDirector } = this.state;
    return (
      <div>
        <Spin
          style={{ width: '100%', height: '100%' }}
          spinning={this.state.loading}
        >
          <div className="IDLTransfer">
            <Tabs activeKey={this.state.page} onChange={k => this.callBack(k)}>
              <TabPane tab="填写申请单" key="1">
                {!isDirector ? (
                  <div>
                    <h3 style={{ textAlign: 'center', marginTop: '64px' }}>
                      您无权提交人事变动申请
                    </h3>
                  </div>
                ) : (
                  <div className="wrap" style={{ padding: '16px' }}>
                    <Steps
                      current={this.state.step}
                      style={{ width: '100%', cursor: 'default' }}
                    >
                      <Step title="选择调动人员" />
                      <Step title="填写调岗申请单" />
                      <Step title="查看结果" />
                    </Steps>
                    {this.state.step == 0 ? (
                      <Spin
                        style={{ width: '100%', height: '100%' }}
                        spinning={this.state.loading}
                      >
                        <Modal
                          title={'选择部门'}
                          visible={this.state.showSelDep}
                          footer={null}
                          destroyOnClose={true}
                          onCancel={() => {
                            this.setState({ showSelDep: false });
                          }}
                          width={'80vw'}
                          height={'80vh'}
                        >
                          <br />
                          <br />
                          <Spin spinning={this.state.loading}>
                            <div
                              style={{
                                width: '100%',
                                height: 'calc(80vh - 104px)',
                                position: 'relative'
                              }}
                            >
                              <TableData
                                isUseBESize={true}
                                hasDownload={false}
                                resid={632327119162}
                                cmswhere={
                                  this.state.companyV == '100'
                                    ? `C3_419339113187 != '' and C3_419448436728 = '菲尼萨光电通讯科技(无锡)有限公司'`
                                    : `C3_419339113187 != '' and C3_419448436728 = '菲尼萨光电通讯(上海)有限公司'`
                                }
                                hasRowView={false}
                                subtractH={220}
                                hasAdd={false}
                                hasRowSelection={false}
                                hasRowDelete={false}
                                hasRowModify={false}
                                hasModify={false}
                                hasDelete={false}
                                actionBarWidth={80}
                                style={{ height: '100%' }}
                                hasRowView={false}
                                customRowBtns={[
                                  record => {
                                    return (
                                      <Button
                                        onClick={() => {
                                          console.log(record);
                                          this.getDepaMem(
                                            record.C3_461011945566
                                          );

                                          this.setState({
                                            depaV: record.C3_461011945566,
                                            depaName: record.DEP_NAME_EN,
                                            showSelDep: false,
                                            depaMemberV: null,
                                            selMemberV: null,
                                            selectMem: []
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
                          </Spin>
                        </Modal>

                        <Modal
                          title={this.state.draftName}
                          visible={this.state.showDraft}
                          footer={null}
                          destroyOnClose={true}
                          onCancel={() => {
                            this.setState({ showDraft: false });
                          }}
                          width={'80vw'}
                          height={'80vh'}
                        >
                          <br />
                          <br />
                          <Spin spinning={this.state.loading}>
                            <div
                              style={{
                                width: '100%',
                                height: 'calc(80vh - 104px)',
                                position: 'relative'
                              }}
                            >
                              <TableData
                                resid={637754719247}
                                hasDownload={false}
                                cmswhere={`publishCode = '${this.state.draftCode}' and headcount ='draft' and applyPersonNum = '${this.state.userId}'`}
                                hasRowView={false}
                                subtractH={220}
                                hasAdd={false}
                                hasRowSelection={true}
                                hasRowDelete={false}
                                hasRowModify={true}
                                hasModify={false}
                                hasDelete={false}
                                style={{ height: '100%' }}
                                hasRowView={false}
                                actionBarExtra={({
                                  dataSource,
                                  selectedRowKeys
                                }) => {
                                  return (
                                    <Button
                                      type="primary"
                                      disabled={!(selectedRowKeys.length > 0)}
                                      onClick={() => {
                                        this.subDraft(
                                          dataSource,
                                          selectedRowKeys
                                        );
                                      }}
                                    >
                                      提交
                                    </Button>
                                  );
                                }}
                              />
                            </div>
                          </Spin>
                        </Modal>

                        <div
                          className={
                            this.state.showCraft
                              ? 'craftEntery extend'
                              : 'craftEntery'
                          }
                        >
                          <div
                            className="title"
                            onClick={() => {
                              if (!this.state.showCraft) {
                                this.getDraft();
                              }
                              this.setState({
                                showCraft: !this.state.showCraft
                              });
                            }}
                          >
                            我的草稿
                            <Icon
                              type="right"
                              style={{ fontSize: '16px', margin: '12px' }}
                            />
                          </div>
                          <div className="content">
                            {this.state.draft.map((item, key) => {
                              return (
                                <div
                                  className="draftCell"
                                  key={key}
                                  onClick={() => {
                                    this.setState({
                                      showDraft: true,
                                      draftCode: item.publishCode,
                                      draftName:
                                        '创建时间：' + item.data[0].REC_CRTTIME
                                    });
                                  }}
                                >
                                  <h3>创建时间：{item.data[0].REC_CRTTIME}</h3>
                                  <p>
                                    人员：
                                    {item.data.map(item2 => {
                                      return <>{item2.person} </>;
                                    })}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div
                          className={
                            this.state.chooseFo
                              ? 'sider load'
                              : 'load sider focusWindow'
                          }
                          style={{
                            width: '200px',
                            paddingRight: '24px',
                            marginTop: '24px',
                            height: 'calc(100vh - 132px)'
                          }}
                        >
                          请选择公司:
                          <Select
                            value={this.state.companyV}
                            onChange={v => this.handleChange(v)}
                            defaultValue="100"
                            style={{
                              width: '100%',
                              marginBottom: '8px',
                              marginTop: '8px'
                            }}
                          >
                            {this.state.company.map(item => {
                              return (
                                <Option value={item.value}>{item.name}</Option>
                              );
                            })}
                          </Select>
                          请选择部门:
                          {/* <TreeSelect
                              style={{ width: '100%', marginTop: '8px' }}
                              value={this.state.depaV}
                              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                              treeData={this.state.department}
                              placeholder="请先选择部门"
                              showSearch={true}
                              searchPlaceholder="输入部门编号搜索"
                              onChange={this.onChange}
                            /> */}
                          <span>
                            {this.state.depaV ? (
                              <>
                                <br /> {this.state.depaName}{' '}
                              </>
                            ) : (
                              ''
                            )}
                          </span>
                          <Button
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                              this.setState({ showSelDep: true });
                            }}
                          >
                            选择部门
                          </Button>
                          {this.state.depaV ? (
                            <>
                              <p
                                style={{
                                  textAlign: 'left',
                                  lineHeight: '16px',
                                  height: 'auto',
                                  margin: '0',
                                  marginTop: '8px'
                                }}
                              >
                                请选择人员:
                              </p>

                              <TreeSelect
                                style={{
                                  width: '100%',
                                  marginTop: '8px',
                                  marginBottom: '10px'
                                }}
                                value={this.state.depaMemberV}
                                dropdownStyle={{
                                  maxHeight: 400,
                                  overflow: 'auto'
                                }}
                                treeData={this.state.depaMember}
                                placeholder="请先选择人员"
                                showSearch={true}
                                searchPlaceholder="输入人员工号搜索"
                                onChange={this.onChangeDepaMem}
                              />

                              <Switch
                                defaultChecked
                                checked={this.state.chooseFo}
                                onChange={() =>
                                  this.setState({
                                    chooseFo: !this.state.chooseFo
                                  })
                                }
                              />
                              <span
                                style={{
                                  textIndent: '8px',
                                  display: 'inline-block'
                                }}
                              >
                                选择下属
                              </span>
                              <br />
                              {this.state.chooseFo ? null : (
                                <Button
                                  style={{ marginTop: 10 }}
                                  onClick={() => {
                                    this.onChangeSelMem(this.state.depaMemberV);
                                  }}
                                  type="primary"
                                >
                                  下一步
                                </Button>
                              )}
                            </>
                          ) : null}
                        </div>
                      </Spin>
                    ) : null}
                    {this.state.step == 0 && this.state.chooseFo ? (
                      <div
                        className="load"
                        style={{
                          float: 'left',
                          width: 'calc(100% - 224px)',
                          marginLeft: '24px',
                          marginTop: '24px',
                          height: 'calc(100% - 64px)'
                        }}
                      >
                        <TableData
                          resid={666203805903}
                          hasDownload={false}
                          isUseBESize={true}
                          baseURL={this.baseURL}
                          hasRowView={false}
                          hasAdd={false}
                          cmswhere={
                            this.state.selMemberV
                              ? `C3_227192472953 = '${this.state.selMemberV}'`
                              : `C3_429966115761 = '${this.state.depaMemberV}'`
                            // ? `C3_305737857578 = '${this.state.selMemberV}'`
                            // : `C3_417993417686 = '${this.state.depaMemberV}'`
                          }
                          hasRowSelection={false}
                          hasRowDelete={false}
                          hasRowModify={false}
                          hasModify={false}
                          subtractH={190}
                          hasDelete={false}
                          style={{ height: '100%' }}
                          hasRowView={false}
                          hasRowSelection={true}
                          actionBarExtra={({ dataSource, selectedRowKeys }) => {
                            return (
                              <Button
                                type="primary"
                                disabled={!(selectedRowKeys.length > 0)}
                                onClick={() => {
                                  this.subMemData(dataSource, selectedRowKeys);
                                }}
                              >
                                下一步
                              </Button>
                            );
                          }}
                        />
                      </div>
                    ) : null}
                    {this.state.step == 1 ? (
                      <Spin spinning={this.state.loading}>
                        <div
                          style={{
                            width: '100%',
                            height: 'calc(100vh - 156px)',
                            position: 'relative'
                          }}
                          className="load"
                        >
                          <div className="memberList">
                            {/* <h3>变更前部门：</h3>
                            <div>
                              <b>一级部门：</b>
                              <span>
                                {this.state.depaSele[0]
                                  ? this.state.depaSele[0].C3_461011989083
                                  : '- -'}
                              </span>
                              <br />
                              <b>二级部门：</b>
                              <span>
                                {this.state.depaSele[0]
                                  ? this.state.depaSele[0].C3_461011989333
                                  : '- -'}
                              </span>
                              <br />
                              <b>三级部门：</b>
                              <span>
                                {this.state.depaSele[0]
                                  ? this.state.depaSele[0].C3_461011989568
                                  : '- -'}
                              </span>
                              <br />
                              <b>四级部门：</b>
                              <span>
                                {this.state.depaSele[0]
                                  ? this.state.depaSele[0].C3_461011989771
                                  : '- -'}
                              </span>
                              <br />
                            </div> */}
                            <h3>
                              待变更人员：<b>{this.state.selectMem.length}</b>
                            </h3>
                            <ul>
                              {this.state.selectMem.map((item, key) => {
                                return (
                                  <li
                                    key={key}
                                    className={
                                      this.state.curPeopleId ==
                                      item.C3_448032387764
                                        ? 'current'
                                        : ''
                                    }
                                    onClick={(v, k) => {
                                      this.selectSingle(
                                        item.C3_448032387764,
                                        key
                                      );
                                    }}
                                  >
                                    <h4>{key + 1}</h4>
                                    <p>
                                      <b>工号：</b>
                                      <span>{item.C3_448032387764}</span>
                                    </p>
                                    <p>
                                      <b>姓名：</b>
                                      <span>{item.C3_227192484125}</span>
                                    </p>
                                    <p>
                                      <b>英文名：</b>
                                      <span>{item.C3_419343735913}</span>
                                    </p>

                                    <p>
                                      <b>当前主管：</b>
                                      <span>{item.C3_417993433650}</span>
                                    </p>

                                    <p>
                                      <b>当前职位：</b>
                                      <span>{item.C3_661366417780}</span>
                                    </p>

                                    <p>
                                      <b>一级部门：</b>
                                      <span>{item.C3_422840485957}</span>
                                    </p>

                                    <p>
                                      <b>二级部门：</b>
                                      <span>{item.C3_422840495341}</span>
                                    </p>
                                    <p>
                                      <b>三级部门：</b>
                                      <span>{item.C3_422840502598}</span>
                                    </p>
                                    <p>
                                      <b>四级部门：</b>
                                      <span>{item.C3_422840508142}</span>
                                    </p>
                                    {/* <p>
                                      <b>当前级别：</b>
                                      <span>{item.C3_658407610385}</span>
                                    </p> */}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          <div className="form">
                            <h3>变更后：</h3>
                            {/* <Checkbox
                        checked={
                          this.state.selectMem[this.state.curPeopleKey]
                            .checkGroup.date
                        }
                        onChange={v => {
                          this.setCheck('date');
                          if (!v.target.checked) {
                            this.setValue(null, 'activeDate');
                          }
                        }}
                      >
                        生效日期：
                      </Checkbox>
                      <span style={{ width: 'auto' }}>
                        <DatePicker
                          disabled={
                            !this.state.selectMem[this.state.curPeopleKey]
                              .checkGroup.date
                          }
                          value={
                            this.state.selectMem[this.state.curPeopleKey]
                              .activeDate
                          }
                          onChange={v => this.setValue(v, 'activeDate')}
                        />
                      </span> */}
                            {/* <br/>
                  <br/>
                  <b>变更类型：</b>
                  <span style={{width:'auto'}}>
                  <Select placeholder='请选择变更类型' style={{ width: 240 }} value={this.state.changeType} onChange={(v)=>{this.getBitian(v)}}>

                    <Option value='部门变更' key='0'>部门变更</Option>
                    <Option value='汇报关系变更' key='1'>汇报关系变更</Option>
                    <Option value='级别变更' key='2'>级别变更</Option>
                    <Option value='职位变更' key='3'>职位变更</Option>


                  </Select>
                  </span> */}
                            <br />
                            <br />
                            <Checkbox
                              style={{ marginRight: 8 }}
                              checked={
                                this.state.selectMem[this.state.curPeopleKey]
                                  .checkGroup.newDepa
                              }
                              onChange={v => {
                                this.setCheck('newDepa');
                                if (!v.target.checked) {
                                  var rec = this.state.selectMem;
                                  rec[this.state.curPeopleKey].newDepa = {};
                                  this.setState({ newDepa: rec });
                                }
                              }}
                            >
                              变更后部门代码：
                            </Checkbox>
                            <span
                              style={{
                                width: '248px',
                                marginRight: '16px',
                                minWidth: '0'
                              }}
                            >
                              {this.state.selectMem[this.state.curPeopleKey]
                                .newDepa.C3_419339113187 ? (
                                this.state.selectMem[this.state.curPeopleKey]
                                  .newDepa.C3_419339113187
                              ) : (
                                <span
                                  style={
                                    this.state.selectMem[
                                      this.state.curPeopleKey
                                    ].newDepa.depaCode
                                      ? this.state.selectMem[
                                          this.state.curPeopleKey
                                        ].newDepa.C3_419339113187
                                        ? {}
                                        : { color: '#f5222d' }
                                      : { color: '#999' }
                                  }
                                >
                                  请点击右侧按钮选择部门
                                </span>
                              )}
                            </span>
                            <Button
                              icon="search"
                              disabled={
                                !this.state.selectMem[this.state.curPeopleKey]
                                  .checkGroup.newDepa
                              }
                              onClick={() =>
                                this.setState({ searchDepaV: true })
                              }
                            >
                              选择部门
                            </Button>
                            <div>
                              <b>变更后部门名：</b>
                              <span>
                                {this.state.selectMem[this.state.curPeopleKey]
                                  .newDepa.DEP_NAME
                                  ? this.state.selectMem[
                                      this.state.curPeopleKey
                                    ].newDepa.DEP_NAME
                                  : '- -'}
                              </span>
                              <b>变更后部门英文名：</b>
                              <span>
                                {this.state.selectMem[this.state.curPeopleKey]
                                  .newDepa.DEP_NAME_EN
                                  ? this.state.selectMem[
                                      this.state.curPeopleKey
                                    ].newDepa.DEP_NAME_EN
                                  : '- -'}
                              </span>
                              <b>变更后一级部门名：</b>
                              <span>
                                {this.state.selectMem[this.state.curPeopleKey]
                                  .newDepa.C3_461011984661
                                  ? this.state.selectMem[
                                      this.state.curPeopleKey
                                    ].newDepa.C3_461011984661
                                  : '- -'}
                              </span>

                              <b>变更后二级部门名：</b>
                              <span>
                                {this.state.selectMem[this.state.curPeopleKey]
                                  .newDepa.C3_461011984896
                                  ? this.state.selectMem[
                                      this.state.curPeopleKey
                                    ].newDepa.C3_461011984896
                                  : '- -'}
                              </span>

                              <b>变更后三级部门名：</b>
                              <span>
                                {this.state.selectMem[this.state.curPeopleKey]
                                  .newDepa.C3_461011985099
                                  ? this.state.selectMem[
                                      this.state.curPeopleKey
                                    ].newDepa.C3_461011985099
                                  : '- -'}
                              </span>

                              <b>变更后四级部门名：</b>
                              <span>
                                {this.state.selectMem[this.state.curPeopleKey]
                                  .newDepa.C3_461011985365
                                  ? this.state.selectMem[
                                      this.state.curPeopleKey
                                    ].newDepa.C3_461011985365
                                  : '- -'}
                              </span>
                            </div>
                            <Checkbox
                              checked={
                                this.state.selectMem[this.state.curPeopleKey]
                                  .checkGroup.proCode
                              }
                              onChange={v => {
                                this.setCheck('proCode');
                                if (!v.target.checked) {
                                  this.setValue('', 'proCode');
                                }
                              }}
                            >
                              变更后项目代码：
                            </Checkbox>
                            <Input
                              disabled={
                                !this.state.selectMem[this.state.curPeopleKey]
                                  .checkGroup.proCode
                              }
                              value={
                                this.state.selectMem[this.state.curPeopleKey]
                                  .proCode
                              }
                              onChange={v =>
                                this.setValue(v.target.value, 'proCode')
                              }
                            />
                            <br />
                            <br />
                            <Checkbox
                              style={{ marginRight: 8 }}
                              checked={
                                this.state.selectMem[this.state.curPeopleKey]
                                  .checkGroup.supervisor
                              }
                              onChange={v => {
                                this.setCheck('supervisor');
                                if (!v.target.checked) {
                                  var rec = this.state.selectMem;
                                  rec[this.state.curPeopleKey].newSuper = {};
                                  this.setState({ newSuper: rec });
                                }
                              }}
                            >
                              变更后主管：
                            </Checkbox>
                            <span
                              style={{
                                minWidth: '248px',
                                marginRight: '16px',
                                minWidth: '0'
                              }}
                            >
                              {this.state.selectMem[this.state.curPeopleKey]
                                .newSuper.C3_227192484125 ? (
                                this.state.selectMem[this.state.curPeopleKey]
                                  .newSuper.C3_227192484125 +
                                ' - ' +
                                this.state.selectMem[this.state.curPeopleKey]
                                  .newSuper.C3_227192472953
                              ) : (
                                <span
                                  style={
                                    this.state.selectMem[
                                      this.state.curPeopleKey
                                    ].checkGroup.supervisor
                                      ? { color: '#f5222d' }
                                      : { color: '#999' }
                                  }
                                >
                                  请点击右侧按钮选择主管
                                </span>
                              )}
                            </span>
                            <Button
                              disabled={
                                !this.state.selectMem[this.state.curPeopleKey]
                                  .checkGroup.supervisor
                              }
                              icon="search"
                              onClick={() =>
                                this.setState({ searchSuperV: true })
                              }
                            >
                              选择主管
                            </Button>
                            <br />
                            <br />
                            <Checkbox
                              checked={
                                this.state.selectMem[this.state.curPeopleKey]
                                  .checkGroup.job
                              }
                              onChange={v => {
                                this.setCheck('job');
                                if (!v.target.checked) {
                                  var rec = this.state.selectMem;
                                  rec[this.state.curPeopleKey].job = {
                                    C3_662164716971: ''
                                  };
                                  this.setState({ job: rec });
                                  rec[
                                    this.state.curPeopleKey
                                  ].checkGroup.isNew = false;
                                  this.setState({ isNew: false });
                                }
                              }}
                            >
                              变更后岗位：
                            </Checkbox>
                            &nbsp;无岗位的情况请先和HR联系创建岗位
                            {/* <Checkbox
                              style={{ marginLeft: 8 }}
                              onChange={() => {
                                this.setCheck('isNew');
                              }}
                              checked={
                                this.state.selectMem[this.state.curPeopleKey]
                                  .checkGroup.isNew
                              }
                              disabled={
                                !this.state.selectMem[this.state.curPeopleKey]
                                  .checkGroup.job
                              }
                            >
                              需要新的headcount
                            </Checkbox> */}
                            <br />
                            {/* <label>岗位中文名：</label>
                      <Input
                        disabled={
                          !this.state.selectMem[this.state.curPeopleKey]
                            .checkGroup.job
                        }
                        value={
                          this.state.selectMem[this.state.curPeopleKey].job
                            .orgJobCN
                        }
                        onChange={v => {
                          let rec = this.state.selectMem;
                          rec[this.state.curPeopleKey].job = {
                            orgJobCN: v
                          };
                          this.setState({ job: rec });
                        }}
                      /> */}
                            <label style={{ marginLeft: 8 }}>岗位名：</label>
                            <Input
                              disabled={
                                !this.state.selectMem[this.state.curPeopleKey]
                                  .checkGroup.job
                              }
                              value={
                                this.state.selectMem[this.state.curPeopleKey]
                                  .job.C3_662164716971
                              }
                              onChange={v => {
                                let rec = this.state.selectMem;
                                rec[this.state.curPeopleKey].job = {
                                  C3_662164716971: v
                                };
                                this.setState({ job: rec });
                              }}
                            />
                            <Button
                              style={{ marginLeft: 8 }}
                              disabled={
                                !this.state.selectMem[this.state.curPeopleKey]
                                  .checkGroup.job
                              }
                              icon="search"
                              onClick={() =>
                                this.setState({ searchJobV: true })
                              }
                            >
                              选择职位
                            </Button>
                            <br />
                            <br />
                            {/* <Checkbox
                                checked={
                                  this.state.selectMem[this.state.curPeopleKey]
                                    .checkGroup.lv
                                }
                                onChange={v => {
                                  this.setCheck('lv');
                                  if (!v.target.checked) {
                                    this.setValue('', 'lv');
                                  }
                                }}
                              >
                                变更后级别：
                            </Checkbox>
                              <span style={{ width: 'auto' }}>
                                <Select
                                  disabled={
                                    !this.state.selectMem[this.state.curPeopleKey]
                                      .checkGroup.lv
                                  }
                                  placeholder="请选择级别"
                                  style={{ width: 240 }}
                                  value={
                                    this.state.selectMem[this.state.curPeopleKey]
                                      .lv
                                  }
                                  onChange={v => {
                                    this.setValue(v, 'lv');
                                  }}
                                >
                                  {this.state.lvList.map(item => {
                                    return (
                                      <Option value={item.value} key={item.key}>
                                        {item.value}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              </span>
                              <br />
                              <br /> */}
                            <Checkbox
                              checked={
                                this.state.selectMem[this.state.curPeopleKey]
                                  .checkGroup.bucode
                              }
                              onChange={v => {
                                this.setCheck('bucode');
                                if (!v.target.checked) {
                                  this.setValue('', 'bucode');
                                }
                              }}
                            >
                              BU CODE:
                            </Checkbox>
                            {/* <span style={{ width: 'auto' }}>
                        <Select
                          disabled={
                            !this.state.selectMem[this.state.curPeopleKey]
                              .checkGroup.bucode
                          }
                          placeholder="BU CODE"
                          value={
                            this.state.selectMem[this.state.curPeopleKey].bucode
                          }
                          style={{ width: 240 }}
                          onChange={v => {
                            this.setValue(v, 'bucode');
                          }}
                        >
                          {this.state.bucodeGroup.map((item, key) => {
                            return (
                              <Option value={item} key={key}>
                                {item}
                              </Option>
                            );
                          })}
                        </Select>
                      </span> */}
                            <span
                              style={{
                                minWidth: '248px',
                                marginRight: '16px',
                                minWidth: '0'
                              }}
                            >
                              {this.state.selectMem[this.state.curPeopleKey]
                                .bucode ? (
                                this.state.selectMem[this.state.curPeopleKey]
                                  .bucode
                              ) : (
                                <span
                                  style={
                                    this.state.selectMem[
                                      this.state.curPeopleKey
                                    ].checkGroup.bucode
                                      ? { color: '#f5222d' }
                                      : { color: '#999' }
                                  }
                                >
                                  请点击右侧按钮BU CODE
                                </span>
                              )}
                            </span>
                            <Button
                              disabled={
                                !this.state.selectMem[this.state.curPeopleKey]
                                  .checkGroup.bucode
                              }
                              icon="search"
                              onClick={() =>
                                this.setState({ searchBucode: true })
                              }
                            >
                              选择BU CODE
                            </Button>
                            <br />
                            <br />
                            <b>变动原因</b>
                            <b style={{ width: 'auto' }}>
                              (
                              {
                                this.state.selectMem[this.state.curPeopleKey]
                                  .reason.length
                              }
                              /500字)
                            </b>
                            <Input.TextArea
                              maxLength={500}
                              style={{ resize: 'none' }}
                              value={
                                this.state.selectMem[this.state.curPeopleKey]
                                  .reason
                              }
                              onChange={v => {
                                this.setValue(v.target.value, 'reason');
                              }}
                            />
                          </div>

                          <Modal
                            title="部门列表"
                            visible={this.state.searchDepaV}
                            footer={null}
                            onCancel={this.clzDepaSearch}
                            width={'80vw'}
                            height={'80vh'}
                          >
                            <Select
                              placeholder="请选择级别"
                              style={{ width: 240 }}
                              value={this.state.depaFilter}
                              onChange={v => {
                                this.setState({ depaFilter: v });
                              }}
                            >
                              {this.state.companyArr.map((item, key) => {
                                return (
                                  <Option
                                    value={item.C3_419448436728}
                                    key={key}
                                  >
                                    {item.C3_419448436728}
                                  </Option>
                                );
                              })}
                            </Select>
                            <br />
                            <br />
                            <div
                              style={{
                                width: '100%',
                                height: 'calc(80vh - 104px)',
                                position: 'relative'
                              }}
                            >
                              <TableData
                                isUseBESize={true}
                                hasDownload={false}
                                resid={632327119162}
                                actionBarWidth={80}
                                cmswhere={`C3_419339113187 != '' and C3_419448436728 = '${this.state.depaFilter}'`}
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
                                          var rec = this.state.selectMem;

                                          rec[
                                            this.state.curPeopleKey
                                          ].newDepa = record;
                                          this.setState({
                                            selectMem: rec,
                                            searchDepaV: false
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
                            title="人员列表"
                            visible={this.state.searchSuperV}
                            footer={null}
                            onCancel={() => {
                              this.setState({ searchSuperV: false });
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
                                resid={609599795438}
                                hasDownload={false}
                                actionBarWidth={80}
                                isUseBESize={true}
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
                                          var rec = this.state.selectMem;
                                          rec[
                                            this.state.curPeopleKey
                                          ].newSuper = record;
                                          this.setState({
                                            newSuper: rec,
                                            searchSuperV: false
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
                            title="岗位列表"
                            destroyOnClose={true}
                            visible={this.state.searchJobV}
                            footer={null}
                            onCancel={() => {
                              this.setState({ searchJobV: false });
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
                                resid={666280127026}
                                hasDownload={false}
                                baseURL={this.baseURL}
                                actionBarWidth={80}
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
                                          var rec = this.state.selectMem;
                                          rec[
                                            this.state.curPeopleKey
                                          ].job = record;
                                          this.setState({
                                            job: rec,
                                            searchJobV: false
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
                            title="BU CODE列表"
                            visible={this.state.searchBucode}
                            footer={null}
                            destroyOnClose={true}
                            onCancel={() => {
                              this.setState({ searchBucode: false });
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
                                baseURL={WuxiHr03BaseURL}
                                hasDownload={false}
                                resid={bucodeResid}
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
                                          var rec = this.state.selectMem;
                                          rec[this.state.curPeopleKey].bucode =
                                            record.C3_668189623493;
                                          this.setState({
                                            selectMem: rec,
                                            searchBucode: false
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
                          <footer>
                            <Button onClick={() => this.setState({ step: 0 })}>
                              上一步
                            </Button>
                            <Button
                              style={
                                this.state.isSub ? {} : { display: 'none' }
                              }
                              type="primary"
                              onClick={() => this.setState({ step: 2 })}
                            >
                              下一步
                            </Button>
                            <Button
                              style={
                                !this.state.isSub ? {} : { display: 'none' }
                              }
                              onClick={() => this.subData(true)}
                            >
                              保存
                            </Button>
                            <Button
                              style={
                                !this.state.isSub ? {} : { display: 'none' }
                              }
                              type="primary"
                              onClick={() => {
                                if (isDirector) {
                                  this.subData();
                                } else {
                                  message.info('您无权提交申请');
                                  return;
                                }
                              }}
                            >
                              提交
                            </Button>
                          </footer>
                        </div>
                      </Spin>
                    ) : null}
                    {this.state.step == 2 ? (
                      <div className="result">
                        {this.state.result == 'success' ? (
                          <Icon
                            type="check-circle"
                            theme="filled"
                            style={{ color: '#52c41a' }}
                          />
                        ) : (
                          <Icon
                            type="close-circle"
                            theme="filled"
                            style={{ color: '#f5222d' }}
                          />
                        )}

                        <h2>{this.state.hint}</h2>
                        {/* {this.state.result=='success'?(<>
                  <p>本次申请需要以下人员审批：</p>
                  <ul>
                    {this.state.checkPoint.map(item =>{return(
                    <li><b>{item[0]}：</b><span>{item[1]}</span></li>
                     ) })}
                  </ul>
              </>):null} */}
                        {this.state.result == 'success' ? (
                          <>
                            <Button
                              style={{ marginRight: '16px', width: '120px' }}
                              onClick={() => {
                                this.setState({
                                  step: 0,
                                  isSub: false,
                                  depaMemberV: null,
                                  selMemberV: null
                                });
                              }}
                            >
                              再申请一人
                            </Button>
                            <Button
                              style={{ marginRight: '16px', width: '120px' }}
                              onClick={() => {
                                this.setState({
                                  step: 0,
                                  page: '2',
                                  isSub: false
                                });
                              }}
                              type="primary"
                            >
                              查看审批记录
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              style={{ marginRight: '16px', width: '120px' }}
                              onClick={() => {
                                this.setState({ step: 1 });
                              }}
                            >
                              返回查看
                            </Button>
                            {/* <Button style={{marginRight:'16px',width:'120px'}} onClick={()=>{this.setState({step:2})}} type='primary'>再试一次</Button> */}
                          </>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              </TabPane>
              <TabPane tab="我发起的审批记录" key="2">
                {!isDirector ? (
                  <div>
                    <h3 style={{ textAlign: 'center', marginTop: '64px' }}>
                      您无权提交人事变动申请
                    </h3>
                  </div>
                ) : (
                  <div className="wrap">
                    {/* view */}
                    <IDLTransferVerify mode="view"></IDLTransferVerify>
                  </div>
                )}
              </TabPane>

              <TabPane tab="我的审核" key="3">
                <div className="wrap">
                  {/* view */}
                  <IDLTransferVerifyAction></IDLTransferVerifyAction>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Spin>
      </div>
    );
  }
}

export default IDLTransfer;
