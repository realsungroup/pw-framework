import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Modal, Button, message, Tabs, Popconfirm,Input } from 'antd';
import MainTableSubTables from '../../common/data/MainTableSubTables/';
import './UltimateQuery.less';
import http from '../../../util20/api';
import Selected from '../Selected/Selected';
const config = {
  classes1:[
      {id:1,title:"人员信息",superior:null},
      {id:2,title:"考勤信息",superior:null},
      {id:13,title:"假期台账",superior:null},
      {id:5,title:"合同信息",superior:null},
      {id:15,title:"学习与发展",superior:null},
      {id:19,title:"招聘管理",superior:null},
      {id:20,title:"纪律管理",superior:null},
  ],
  classes2:[
    {id:3,title:"人员信息",superior:1},
    {id:4,title:"考勤报表",superior:2},
    {id:6,title:"合同信息",superior:5},
    {id:7,title:"人事信息变动",superior:1},
    {id:8,title:"年假台账",superior:13},
    {id:9,title:"哺乳假台账",superior:13},
    {id:10,title:"调休假台账",superior:13},
    {id:11,title:"其他假期台账",superior:13},
    {id:12,title:"考勤数据查询",superior:2},
    {id:13,title:"卡务管理",superior:2},
    {id:14,title:"考勤审批",superior:2},
    {id:16,title:"培训管理",superior:15},
    {id:17,title:"个人发展管理",superior:15},
    {id:18,title:"考试管理",superior:15},
    {id:21,title:"Headcount管理",superior:19},
    {id:22,title:"Offer管理",superior:19},
    {id:23,title:"DL招聘管理",superior:19},
    {id:24,title:"违纪查询",superior:20},
    {id:25,title:"信息查询",superior:20},
],
  founcs:[
  {
      name: 'custom', 
      title: '人员信息查询',
      class:3,
      id:1,
      src:'/fnmodule?resid=723578280726&recid=723578390658&type=信息查询&title=管理员查询人事信息'
  },
  {
    name: 'MainTableSubTables',
    title: '考勤日报处理',
    id:2,
    class:12,
    props: {
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
      resid: 676572028895,
      mainTableProps: {
        actionBarWidth: 200,
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: true,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowSelection: true,
        hasRowDelete: false,
        isUseFormDefine: false,
        backendButtonPopConfirmProps: { placement: 'bottom' },
        advSearch: {
          isRequestFormData: false
        },
        isUseBESize: true,
        hasBeSort: false,
        subtractH: 200
      },
      subTablesProps: {
        676573379187: {
          hasBeBtns: true,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/',
          isUseBESize: true,
          hasBeSort: false,
          advSearch: {
            isRequestFormData: false
          }
        },
        676573571624: {
          hasBeBtns: true,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/',
          isUseBESize: true,
          hasBeSort: false,
          advSearch: {
            isRequestFormData: false
          }
        },
        676573590282: {
          hasBeBtns: true,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/',
          isUseBESize: true,
          hasBeSort: false,
          advSearch: {
            isRequestFormData: false
          }
        },
        676573619175: {
          hasBeBtns: true,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/',
          isUseBESize: true,
          hasBeSort: false,
          advSearch: {
            isRequestFormData: false
          }
        },
        676573667991: {
          hasBeBtns: true,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/',
          isUseBESize: true,
          hasBeSort: false,
          advSearch: {
            isRequestFormData: false
          }
        }
      }
    }
  },
  {
    name: 'custom', 
    title: '合同管理',
    class:6,
    id:3,
    src:"/fnmodule?resid=640189772997&recid=640189232960&type=合同管理&title=合同管理"
  },
  {
    name: 'custom', 
    title: '人事调动审批',
    class:7,
    id:4,
    src:"/fnmodule?resid=635350002067&recid=635350084447&type=人事信息管理&title=人事调动审批"
  },
  {
    name: 'custom', 
    title: '年假管理（2020年后）',
    class:8,
    id:8,
    src:"/fnmodule?resid=663690700084&recid=663690929711&type=假期管理&title=年假管理"
  },
  {
    name: 'TableData', 
    title: '年假管理（2020年前）',
    class:8,
    id:9,
    props: {
      resid: 775130963822,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '年假年度剩余调整（2020年前）',
    class:8,
    id:10,
    props: {
      resid: 441994427244,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '年假当年新增调整（2020年以前）',
    class:8,
    id:11,
    props: {
      resid: 630169827334,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '哺乳假台账',
    class:9,
    id:12,
    props: {
      resid: 435412554124,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '哺乳假使用明细',
    class:9,
    id:13,
    props: {
      resid: 435419664427,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '调休假台账',
    class:10,
    id:14,
    props: {
      resid: 435431842051,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '调休假使用明细',
    class:10,
    id:15,
    props: {
      resid: 442578987574,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '事假台账',
    class:11,
    id:16,
    props: {
      resid: 518262920381,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '三期名单',
    class:11,
    id:17,
    props: {
      resid: 608738442390,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '育儿假台账',
    class:11,
    id:18,
    props: {
      resid: 775135706998,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '父母陪护假台账',
    class:11,
    id:19,
    props: {
      resid: 712075069963,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '班组调整记录查询',
    class:12,
    id:20,
    props: {
      resid: 423660730564,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '班次调整记录查询',
    class:12,
    id:21,
    props: {
      resid: 423666035454,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '刷卡明细记录查询',
    class:12,
    id:22,
    props: {
      resid: 423660885541,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '请假登记记录查询',
    class:12,
    id:23,
    props: {
      resid: 425274222825,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '加班登记记录查询',
    class:12,
    id:24,
    props: {
      resid: 425274253986,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  }, {
    name: 'TableData', 
    title: '请假导入错误记录',
    class:12,
    id:25,
    props: {
      resid: 432648732840,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  }, {
    name: 'TableData', 
    title: '加班记录导入错误',
    class:12,
    id:26,
    props: {
      resid: 432648481019,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  }, {
    name: 'TableData', 
    title: '刷卡导入错误查询',
    class:12,
    id:27,
    props: {
      resid: 429706598519,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  }, {
    name: 'TableData', 
    title: '请假登记异常明细',
    class:12,
    id:28,
    props: {
      resid: 431960259688,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  }, {
    name: 'TableData', 
    title: '考勤异常日报明细',
    class:12,
    id:29,
    props: {
      resid: 431956725893,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '活动中心刷卡记录',
    class:13,
    id:30,
    props: {
      resid: 439383544231,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '加班请假登记记录',
    class:12,
    id:31,
    props: {
      resid: 509634460766,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  }, {
    name: 'TableData', 
    title: '刷卡记录',
    class:13,
    id:32,
    props: {
      resid: 375296681546,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '已导入办卡信息',
    class:13,
    id:33,
    props: {
      resid: 424794795683,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '离职已退卡',
    class:13,
    id:34,
    props: {
      resid: 426189216297,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '注销卡',
    class:13,
    id:35,
    props: {
      resid: 446635742605,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '黑名单信息',
    class:13,
    id:36,
    props: {
      resid: 309560332600,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '正常卡',
    class:13,
    id:37,
    props: {
      resid: 588780106830,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '考勤日报',
    class:4,
    id:38,
    props: {
      resid: 375296167687,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '考勤月报',
    class:4,
    id:81,
    props: {
      resid: 311025002785,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '考勤汇总表',
    class:12,
    id:82,
    props: {
      resid: 426597421978,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '移动请假加班记录',
    class:14,
    id:39,
    props: {
      resid: 546778189544,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '请假加班审批记录',
    class:14,
    id:40,
    props: {
      resid: 549048498204,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '微信考勤申请记录',
    class:14,
    id:41,
    props: {
      resid: 552993482400,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'MainTableSubTables',
    title: '考勤审批流程信息',
    id:43,
    class:14,
    props: {
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
      resid: 449439660450,
      mainTableProps: {
        actionBarWidth: 200,
        hasAdd: true,
        hasBeBtns: true,
        hasModify: true,
        hasBackBtn: true,
        hasDelete: true,
        hasRowModify: true,
        hasRowView: true,
        hasRowDelete: true,
        backendButtonPopConfirmProps: { placement: 'bottom' },
  
        formProps: {
          // height: 500
        },
        advSearch: {
          isRequestFormData: false
        },
        subtractH: 200
      },
      subTablesProps: {
        449439564546: {
          hasBeBtns: false,
          isUseFormDefine: false,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/'
        },
        449441441589: {
          hasBeBtns: true,
          hasRowView: false,
          hasRowModify: false,
          hasRowDelete: false,
          noWidthFields: 'C3_446938797056',
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/',
          advSearch: {
            isRequestFormData: false
          }
        }
      }
    }
  },
  {
    name: 'TableData', 
    title: '获取IT排班',
    class:14,
    id:44,
    props: {
      resid: 775145745197,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '合同审批记录（上海+无锡老合同）',
    class:6,
    id:45,
    props: {
      resid: 532015753283,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '合同审批记录（无锡新合同）',
    class:6,
    id:46,
    props: {
      resid: 532015753283,
      baseURL: 'http://10.108.2.66:1001/',
      downloadBaseURL: 'http://10.108.2.66:1000/',
    }
  },
  {
    name: 'custom', 
    title: '内训签到记录',
    class:16,
    id:47,
    src:"/fnmodule?resid=675343454130&recid=675343519760&type=学习与发展&title=培训资源管理"
  },
  {
    name: 'custom', 
    title: '签到记录导出',
    class:16,
    id:49,
    src:"/fnmodule?resid=631618595197&recid=775150111960&type=学习与发展&title=签到记录导出"
  },{
    name: 'custom', 
    title: '内训管理',
    class:16,
    id:50,
    src:"/fnmodule?resid=615898415042&recid=615898443242&type=学习与发展&title=内训管理"
  },{
    name: 'custom', 
    title: '外训管理',
    class:16,
    id:51,
    src:"/fnmodule?resid=614187065713&recid=614187146539&type=学习与发展&title=外训管理"
  },{
    name: 'custom', 
    title: '课程维护',
    class:16,
    id:52,
    src:"/fnmodule?resid=611085896611&recid=775151144329&type=学习与发展&title=课程维护"
  },
  {
    name: 'custom', 
    title: '试用期管理',
    class:17,
    id:53,
    src:"/fnmodule?resid=619175063394&recid=619175176571&type=学习与发展&title=试用期管理"
  },
  {
    name: 'custom', 
    title: '考试培训',
    class:18,
    id:54,
    src:"/fnmodule?resid=611243928651&recid=630582052417&type=考试系统&title=考试培训"
  },
  {
    name: 'custom', 
    title: '考试安排',
    class:18,
    id:55,
    src:"/fnmodule?resid=607170185691&recid=775151287566&type=考试系统&title=考试安排"
  },{
    name: 'custom', 
    title: '题库管理',
    class:18,
    id:56,
    src:"/fnmodule?resid=607170415939&recid=775151341941&type=考试系统&title=题库管理"
  },{
    name: 'custom', 
    title: '试卷管理',
    class:18,
    id:57,
    src:"/fnmodule?resid=607170235566&recid=747236298295&type=考试系统&title=试卷管理"
  },{
    name: 'custom', 
    title: '统计分析',
    class:18,
    id:58,
    src:"/fnmodule?resid=607168405062&recid=775151403754&type=考试系统&title=统计分析"
  },{
    name: 'MainTableSubTables',
    title: 'S1S2生产人员招聘',
    id:59,
    class:21,
    props: {
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
      resid: 516897542458,
      mainTableProps: {
        actionBarWidth: 200,
        hasAdd: true,
        hasBeBtns: true,
        hasModify: true,
        hasBackBtn: true,
        hasDelete: true,
        hasRowModify: true,
        hasRowView: true,
        hasRowDelete: true,
        backendButtonPopConfirmProps: { placement: 'bottom' },
  
        formProps: {
          // height: 500
        },
        advSearch: {
          isRequestFormData: false
        },
        subtractH: 200
      },
      subTablesProps: {
        518986543520: {
          hasBeBtns: false,
          isUseFormDefine: false,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/'
        },
        527715777875: {
          hasBeBtns: true,
          hasRowView: false,
          hasRowModify: false,
          hasRowDelete: false,
          noWidthFields: 'C3_446938797056',
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/',
          advSearch: {
            isRequestFormData: false
          }
        }
      }
    }
  },{
    name: 'MainTableSubTables',
    title: 'M5E1生产人员招聘（2021年5月前）',
    id:60,
    class:21,
    props: {
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
      resid: 516897339260,
      mainTableProps: {
        actionBarWidth: 200,
        hasAdd: true,
        hasBeBtns: true,
        hasModify: true,
        hasBackBtn: true,
        hasDelete: true,
        hasRowModify: true,
        hasRowView: true,
        hasRowDelete: true,
        backendButtonPopConfirmProps: { placement: 'bottom' },
  
        formProps: {
          // height: 500
        },
        advSearch: {
          isRequestFormData: false
        },
        subtractH: 200
      },
      subTablesProps: {
        518387822292: {
          hasBeBtns: false,
          isUseFormDefine: false,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/'
        },
        522691427138: {
          hasBeBtns: true,
          hasRowView: false,
          hasRowModify: false,
          hasRowDelete: false,
          noWidthFields: 'C3_446938797056',
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/',
          advSearch: {
            isRequestFormData: false
          }
        }
      }
    }
  },{
    name: 'MainTableSubTables',
    title: 'M5E1生产人员招聘（2021年5月后）',
    id:61,
    class:21,
    props: {
      baseURL: 'http://10.108.2.66:1001/',
      downloadBaseURL: 'http://10.108.2.66:1000/',
      resid: 516897339260,
      mainTableProps: {
        actionBarWidth: 200,
        hasAdd: true,
        hasBeBtns: true,
        hasModify: true,
        hasBackBtn: true,
        hasDelete: true,
        hasRowModify: true,
        hasRowView: true,
        hasRowDelete: true,
        backendButtonPopConfirmProps: { placement: 'bottom' },
  
        formProps: {
          // height: 500
        },
        advSearch: {
          isRequestFormData: false
        },
        subtractH: 200
      },
      subTablesProps: {
        518387822292: {
          hasBeBtns: false,
          isUseFormDefine: false,
          baseURL: 'http://10.108.2.66:1001/',
          downloadBaseURL: 'http://10.108.2.66:1000/'
        },
        522691427138: {
          hasBeBtns: true,
          hasRowView: false,
          hasRowModify: false,
          hasRowDelete: false,
          noWidthFields: 'C3_446938797056',
          baseURL: 'http://10.108.2.66:1001/',
          downloadBaseURL: 'http://10.108.2.66:1000/',
          advSearch: {
            isRequestFormData: false
          }
        }
      }
    }
  },
  {
    name: 'MainTableSubTables',
    title: 'Offer Proposal',
    id:62,
    class:22,
    props: {
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
      resid: 534181420932,
      mainTableProps: {
        actionBarWidth: 200,
        hasAdd: true,
        hasBeBtns: true,
        hasModify: true,
        hasBackBtn: true,
        hasDelete: true,
        hasRowModify: true,
        hasRowView: true,
        hasRowDelete: true,
        backendButtonPopConfirmProps: { placement: 'bottom' },
  
        formProps: {
          // height: 500
        },
        advSearch: {
          isRequestFormData: false
        },
        subtractH: 200
      },
      subTablesProps: {
        534183662854: {
          hasBeBtns: false,
          isUseFormDefine: false,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/'
        },
      }
    }
  },
  {
    name: 'MainTableSubTables',
    title: 'Offer Comfirmation',
    id:63,
    class:22,
    props: {
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
      resid: 534187008752,
      mainTableProps: {
        actionBarWidth: 200,
        hasAdd: true,
        hasBeBtns: true,
        hasModify: true,
        hasBackBtn: true,
        hasDelete: true,
        hasRowModify: true,
        hasRowView: true,
        hasRowDelete: true,
        backendButtonPopConfirmProps: { placement: 'bottom' },
  
        formProps: {
          // height: 500
        },
        advSearch: {
          isRequestFormData: false
        },
        subtractH: 200
      },
      subTablesProps: {
        534187873941: {
          hasBeBtns: false,
          isUseFormDefine: false,
          baseURL: 'http://10.108.2.66:9091/',
          downloadBaseURL: 'http://10.108.2.66:80/'
        },
      }
    }
  },{
    name: 'TableData', 
    title: 'DL员工求职记录',
    class:23,
    id:66,
    props: {
      resid: 617190472818,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'TableData', 
    title: '非系统累进违纪记录',
    class:24,
    id:67,
    props: {
      resid: 729961926165,
      baseURL: 'http://10.108.2.66:1001/',
      downloadBaseURL: 'http://10.108.2.66:1000/',
    }
  },{
    name: 'TableData', 
    title: '系统累进违纪记录',
    class:24,
    id:68,
    props: {
      resid: 730039803659,
      baseURL: 'http://10.108.2.66:1001/',
      downloadBaseURL: 'http://10.108.2.66:1000/',
    }
  },{
    name: 'TableData', 
    title: '组长负责的主管',
    class:25,
    id:69,
    props: {
      resid: 729708742877,
      baseURL: 'http://10.108.2.66:1001/',
      downloadBaseURL: 'http://10.108.2.66:1000/',
    }
  },{
    name: 'TableData', 
    title: '违纪条例管理',
    class:25,
    id:70,
    props: {
      resid: 729704479929,
      baseURL: 'http://10.108.2.66:1001/',
      downloadBaseURL: 'http://10.108.2.66:1000/',
    }
  },{
    name: 'TableData', 
    title: '组长名单',
    class:25,
    id:71,
    props: {
      resid: 728996646072,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'custom', 
    title: '违纪升级记录',
    class:24,
    id:72,
    src:"/fnmodule?resid=728914680096&recid=728914791323&type=纪律管理系统&title=违纪升级记录"
  },
  {
    name: 'custom', 
    title: '符合解除人员',
    class:25,
    id:73,
    src:"/fnmodule?resid=614706766207&recid=644154393653&type=纪律管理系统&title=符合解除人员"
  },
  {
    name: 'TableData', 
    title: '开单权限变更记录',
    class:25,
    id:74,
    props: {
      resid: 729009666829,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
  {
    name: 'custom', 
    title: '奖惩-统计分析',
    class:25,
    id:75,
    src:"/fnmodule?resid=592305842055&recid=619608412213&type=纪律管理系统&title=奖惩-统计分析"
  },
  {
    name: 'custom', 
    title: '违纪管理',
    class:25,
    id:76,
    src:"/fnmodule?resid=590765309983&recid=619608230380&type=纪律管理系统&title=违纪管理"
  },
  {
    name: 'TableData', 
    title: 'DL入职培训统计',
    class:16,
    id:48,
    props: {
      resid: 775237361754,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: 'IDL入职培训统计',
    class:16,
    id:77,
    props: {
      resid: 775238562633,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '在线内训授权',
    class:16,
    id:78,
    props: {
      resid: 775236235343,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '内训在线培训记录',
    class:16,
    id:79,
    props: {
      resid: 775237739631,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },{
    name: 'TableData', 
    title: '黑名单',
    class:23,
    id:80,
    props: {
      resid: 681234360083,
      baseURL: 'http://10.108.2.66:9091/',
      downloadBaseURL: 'http://10.108.2.66:80/',
    }
  },
]}
const TabPane = Tabs.TabPane;
class UltimateQuery extends Component {
  state = {
    curSelectedFonc:{name:''},
    curfilter1:null,
    curfilter2:null,
    filtRes: [],
    classes1Show:[],
    classes2Show:[]
  };
  componentDidMount(){
    this.setState({classes1Show:config.classes1})
  }
  setCurSelected=async(id)=>{
    console.log('id',id)
    await this.setState({curSelectedFonc:{name:''}});
    for(let i=0;i<config.founcs.length;i++){
      if(config.founcs[i].id===id){
        console.log(config.founcs[i])
        this.setState({curSelectedFonc:config.founcs[i]});
      }
    }
  }
  selectFilter1=(id)=>{
    for(let i=0;i<this.state.classes1Show.length;i++){
      if(this.state.classes1Show[i].id===id){
        this.setState({curfilter1:this.state.classes1Show[i].id});
      }
    }
    //选择filter1的情况下，筛选filter2
    let classes2Show=[]
    for(let i=0;i<config.classes2.length;i++){
      if(config.classes2[i].superior===id){
        classes2Show.push(config.classes2[i]);
      }
    }
    
    //遍历arr，将所有下级都放到filtres
    let filtRes=[];
    for(let i=0;i<classes2Show.length;i++){
      for(let c=0;c<config.founcs.length;c++){
        if(config.founcs[c].class===classes2Show[i].id){
          filtRes.push(config.founcs[c]);
        }
      }
    }
    console.log(classes2Show,filtRes)
    this.setState({classes2Show,filtRes,curfilter2:null});
  }
  selectFilter2=(id)=>{
    const classes2Show=this.state.classes2Show;
    for(let i=0;i<classes2Show.length;i++){
      if(classes2Show[i].id===id){
        this.setState({curfilter2:classes2Show[i].id});
      }
    }
    let filtRes=[];
      for(let c=0;c<config.founcs.length;c++){
        if(config.founcs[c].class===id){
          filtRes.push(config.founcs[c]);
        }
      }
    this.setState({filtRes});
  }
  handleSearch(value){
      let v=value;
      if(v){
        if(v==='all'){v=''};
        //分别展示所有的classes和filres,并取消所有选中状态
        let classes1Show=[]
        for(let i=0;i<config.classes1.length;i++){
          let str = config.classes1[i].title;
          if(str.indexOf(v)!=-1){
            classes1Show.push(config.classes1[i]);
          }
        }
        let classes2Show=[]
        for(let i=0;i<config.classes2.length;i++){
          let str = config.classes2[i].title;
          if(str.indexOf(v)!=-1){
            classes2Show.push(config.classes2[i]);
          }
        }
        let filtRes=[]
        for(let i=0;i<config.founcs.length;i++){
          let str = config.founcs[i].title;
          if(str.indexOf(v)!=-1){
            filtRes.push(config.founcs[i]);
          }
        }
        this.setState({classes1Show,classes2Show,filtRes,curSelectedFonc:{name:''},curfilter1:null,curfilter2:null})
      }else{
        this.setState({classes1Show:config.classes1,classes2Show:[],filtRes:[],curSelectedFonc:{name:''},curfilter1:null,curfilter2:null})
      }
    }
  render() {
    const{curSelectedFonc,curfilter1,curfilter2,classes1Show,classes2Show,filtRes}=this.state;
    return (
      <div className='ultimate-query'>
        <div className='side-bar'>
          <div className='searchBar'>
              <Input.Search
                      placeholder='输入all可以查看所有功能'
                      onSearch={(v) => {
                        this.handleSearch(v);
                      }}
                      onPressEnter={v => {
                        this.handleSearch(v.target.value);
                      }}
               />
          </div>
          <div className='filters filters1'>
            {classes1Show.map((item)=>{
              return(
                <div class={curfilter1===item.id?'cur':''} onClick={()=>{this.selectFilter1(item.id)}}>{item.title}</div>
              )
            })}
          </div>
          <div className="filters filters2">
            {classes2Show.map((item)=>{
              return(
                <div class={curfilter2===item.id?'cur':''} onClick={()=>{this.selectFilter2(item.id)}}>{item.title}</div>
              )
            })}
          </div>
          <div className="funcs">
            {
              filtRes.map((item)=>{
                return(
                <div class={curSelectedFonc.id===item.id?'cur':''} onClick={()=>{this.setCurSelected(item.id)}}>{item.title}</div>
                )
              })
            }
          </div>
        </div>
        <div className='ulti-main-frame'>
          {curSelectedFonc.name==='TableData'?
          <TableData 
            resid={curSelectedFonc.props.resid} 
            baseURL={curSelectedFonc.props.baseURL} 
            downloadBaseURL={curSelectedFonc.props.downloadBaseURL}
            hasRowModify={false}
            hasAdd={false}
            hasRowDelete={false}
            hasRowView={true}
            height={"100vh"}
            subtractH={240}
            hasBeBtns={false}
            hasDelete={false}
            hasModify={false}
            hasAdvSearch={true}
          />:null}
          {
           curSelectedFonc.name==='MainTableSubTables'?<MainTableSubTables {...curSelectedFonc.props}></MainTableSubTables>:null
          }
          {
            curSelectedFonc.name==='custom'?<iframe src={window.location.origin+curSelectedFonc.src}/>:null
          }
        </div>
      </div>
    );
  }
}
export default UltimateQuery;
