// 管理员确认
window[606476781618] = {
  name: 'AdminConfirm',
  title: '录入',
  props: {
    resid: 605617716920,
    hasBeBtns: false,
    hasAdd: false,
    hasModify: false,
    hasDelete: false,
    hasRowView: true,
    hasRowModify: false,
    hasRowDelete: false,
    subtractH: 220,
    hasRowSelection: true
  }
};
// // 606496690009 到期违章清单
window[606493652444] = {
  name: 'ExpireViolationsList',
  title: '到期违纪清单',
  props: {
    resid: 605799219043,
    hasBeBtns: true,
    hasAdd: false,
    hasModify: false,
    hasDelete: false,
    hasRowView: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    subtractH: 166
  }
};

window[622544912704] = {
  name: 'TableDataDiscipline',
  title: '查看个人违纪'
};

// 违纪管理;
window[590765309983] = {
  title: '违纪管理',
  name: 'LzMenuContainer',
  props: {
    noDataTip: '暂无数据，请选择员工',
    resid: 590671418888,
    searchFields: [
      {
        text: '工号',
        innerFieldName: 'C3_227192472953'
      }
    ],
    userInfoFields: [
      {
        label: '姓名',
        innerFieldName: 'C3_227192484125'
      },
      {
        label: '工号',
        innerFieldName: 'C3_227192472953'
      },
      {
        label: '职务',
        innerFieldName: 'C3_417990929305'
      },
      {
        label: '部门',
        innerFieldName: 'C3_227212499515'
      }
    ],
    defaultComponetProps: {
      resid: 590671418888,
      subresid: 590863325025,
      advSearchConfig: {
        // 高级搜索配置
        defaultVisible: false,
        containerName: 'drawer',
        drawerWidth: 500,
        labelWidth: '24%',
        rowWidth: '100%',
        dateRanges: [
          // date
          {
            title: '违纪日期',
            visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
            innerFieldName: 'C3_590511645885' // 内部字段
          }
        ],
        tag: [
          // tag
          {
            title: '状态',
            op: 'or', // 操作符：'or' | 'and'
            tags: [
              {
                label: '待提交',
                value: '待提交',
                isSelected: false,
                innerFieldName: 'C3_590514418013' // 内部字段名
              },
              {
                label: '已提交',
                value: '已提交',
                isSelected: false,
                innerFieldName: 'C3_590514418013'
              },
              {
                label: '审批中',
                value: '审批中',
                isSelected: false,
                innerFieldName: 'C3_590514418013'
              },
              {
                label: '已通过',
                value: '已通过',
                isSelected: false,
                innerFieldName: 'C3_590514418013'
              },
              {
                label: '已拒绝',
                value: '已拒绝',
                isSelected: false,
                innerFieldName: 'C3_590514418013'
              },
              {
                label: '已撤销',
                value: '已撤销',
                isSelected: false,
                innerFieldName: 'C3_590514418013'
              }
            ]
          }
        ]
      },
      dataMode: 'sub',
      viewMode: 'forms',
      tableTitle: '违纪记录',
      advDicTableProps: {
        lzTableStyle: {
          width: 1100
        },
        customColumnWidth: {
          依据: 600
        }
      },
      addBtn: true,
      isSearch: false,
      colCount: 2,
      formsName: 'default4',
      isBackEndBtnsVisible: true,
      cFFillFormInnerFieldNames: ['C3_590512169985'],
      associatedFields: [
        ['C3_590516276367', 'C3_592335819161'],
        ['C3_590515131157', 'C3_592336006704']
      ],
      backendBtnsHide: [
        {
          btnName: '提交',
          innerFieldNames: ['C3_591373760332'],
          values: ['Y']
        },
        {
          btnName: '打印',
          innerFieldNames: ['C3_591373760332'],
          values: [null]
        },
        {
          btnName: '预览打印',
          innerFieldNames: ['C3_591373760332'],
          values: ['Y']
        },
        // {
        //   //提交后这个按钮隐藏
        //   btnName: '撤销',
        //   innerFieldNames: [
        //     // 'C3_590512213622',
        //     // 'C3_591373760332',
        //     // 'C3_605619907534'
        //     'C3_591373760332'
        //   ],
        //   values:['Y']
        //   // values: ['Y', null, 'Y']
        // },
        {
          btnName: '修改',
          innerFieldNames: ['C3_591373760332'],
          values: ['Y']
        },
        {
          btnName: '删除',
          // innerFieldNames: ['noDelete'],
          innerFieldNames: ['C3_591373760332'],
          // innerFieldNames: ['C3_591373611399', 'C3_605619907534'],
          values: ['Y']
        }
      ],
      formHeaderRecords: [
        {
          innerFieldName: 'C3_590512169985',
          style: {
            fontWeight: 'bold'
          }
        },
        {
          innerFieldName: 'C3_590514418013',
          style: {
            padding: '4px 8px',
            border: '1px solid #004a95',
            borderRadius: 6
          }
        }
      ]
    }
  }
};

// 统计分析与录入
window[592305842055] = {
  title: '统计分析与录入',
  // 单元组件
  // name: 'LzTable',
  name: 'StatisticAnalysisJC'
  // props: {
  //   // 单元组件 props
  //   resid: 590863325025,
  //   isSearch: false,
  //   formsName: 'default3i',
  //   hasDownloadExcel: true,
  //   cFFillFormInnerFieldNames: ['C3_590510737521'],
  //   advDicTableProps: {
  //     lzTableStyle: {
  //       width: 1100
  //     },
  //     customColumnWidth: {
  //       依据: 600
  //     }
  //   },
  //   addBtn: {
  //     type: 'text',
  //     text: '录入'
  //   },
  //   btnsVisible: {
  //     check: true,
  //     mod: false,
  //     del: true,
  //     edit: false,
  //     save: false,
  //     cancel: false
  //   },
  //   pagination: {
  //     pageSize: 10,
  //     current: 0
  //   },
  //   opIsFixed: true,
  //   tableTitle: '统计分析',
  //   showHeader: true,
  //   displayMod: 'classify',
  //   hasOpenUnitBtn: true,

  //   lzAdvSearchStyle: {
  //     background: '#e5e9ed',
  //     borderRadius: '4px',
  //     border: '1px solid #e5e9ed'
  //   },
  //   advSearchConfig: {
  //     defaultVisible: false,
  //     containerName: 'drawer',
  //     drawerWidth: 550,
  //     labelWidth: '24%',
  //     rowWidth: '100%',
  //     dateRanges: [
  //       {
  //         title: '违纪日期',
  //         visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
  //         innerFieldName: 'C3_590511645885' // 内部字段
  //       },
  //       {
  //         title: '确认审批的日期',
  //         visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
  //         innerFieldName: 'C3_591363529469' // 内部字段
  //       }
  //     ],
  //     tag: [
  //       // tag
  //       // {
  //       //   title: '部门',
  //       //   op: 'or', // 操作符：'or' | 'and'
  //       //   tags: [
  //       //     {
  //       //       label: 'OA',
  //       //       value: 'OA',
  //       //       isSelected: false,
  //       //       innerFieldName: 'C3_590510763625' // 内部字段名
  //       //     },
  //       //     {
  //       //       label: 'OPS',
  //       //       value: 'OPS',
  //       //       isSelected: false,
  //       //       innerFieldName: 'C3_590510763625'
  //       //     }
  //       //   ]
  //       // },
  //       // {
  //       //   title: '状态',
  //       //   op: 'or',
  //       //   tags: [
  //       //     {
  //       //       label: '已撤销',
  //       //       value: '已撤销',
  //       //       isSelected: false,
  //       //       innerFieldName: 'C3_590514418013'
  //       //     },
  //       //     {
  //       //       label: '已录入',
  //       //       value: '已录入',
  //       //       isSelected: false,
  //       //       innerFieldName: 'C3_590514418013'
  //       //     },
  //       //     {
  //       //       label: '进行中',
  //       //       value: '进行中',
  //       //       isSelected: false,
  //       //       innerFieldName: 'C3_590514418013'
  //       //     }
  //       //   ]
  //       // },
  //       {
  //         title: '合同类别',
  //         op: 'or',
  //         tags: [
  //           {
  //             label: 'SH',
  //             value: 'SH',
  //             isSelected: false,
  //             innerFieldName: 'C3_590686786388'
  //           },
  //           {
  //             label: 'WX',
  //             value: 'WX',
  //             isSelected: false,
  //             innerFieldName: 'C3_590686786388'
  //           }
  //         ]
  //       },
  //       {
  //         title: '违纪类别',
  //         op: 'or',
  //         tags: [
  //           {
  //             label: '绩效处分',
  //             value: '绩效处分',
  //             isSelected: false,
  //             innerFieldName: 'C3_590512169985'
  //           },
  //           {
  //             label: '警告',
  //             value: '警告',
  //             isSelected: false,
  //             innerFieldName: 'C3_590512169985'
  //           },
  //           {
  //             label: '较重警告',
  //             value: '较重警告',
  //             isSelected: false,
  //             innerFieldName: 'C3_590512169985'
  //           },
  //           {
  //             label: '严重警告',
  //             value: '严重警告',
  //             isSelected: false,
  //             innerFieldName: 'C3_590512169985'
  //           }
  //         ]
  //       },
  //       // {
  //       //   title: '是否撤销',
  //       //   op: 'or',
  //       //   tags: [
  //       //     {
  //       //       label: '是',
  //       //       value: 'Y',
  //       //       isSelected: false,
  //       //       innerFieldName: 'C3_590512213622'
  //       //     },
  //       //     {
  //       //       label: '否',
  //       //       value: 'N',
  //       //       isSelected: false,
  //       //       innerFieldName: 'C3_590512213622'
  //       //     }
  //       //   ]
  //       // },
  //       {
  //         title: '到期撤销',
  //         op: 'or',
  //         tags: [
  //           {
  //             label: '是',
  //             value: 'Y',
  //             isSelected: false,
  //             innerFieldName: 'C3_591373611399'
  //           },
  //           {
  //             label: '否',
  //             value: 'N',
  //             isSelected: false,
  //             innerFieldName: 'C3_591373611399'
  //           }
  //         ]
  //       }
  //     ],
  //     search: [
  //       {
  //         title: '工号/姓名/部门',
  //         innerFieldNames: [
  //           'C3_590510737521',
  //           'C3_590510740042',
  //           'C3_590510763625'
  //         ]
  //       },
  //       {
  //         title: '惩处依据',
  //         innerFieldNames: ['C3_590511744313']
  //       },
  //       {
  //         title: '职级',
  //         innerFieldNames: ['C3_590512134594']
  //       },
  //       {
  //         title: '一级部门',
  //         innerFieldNames: ['C3_590516541218']
  //       },
  //       {
  //         title: '二级部门',
  //         innerFieldNames: ['C3_590516558243']
  //       },
  //       {
  //         title: '三级部门',
  //         innerFieldNames: ['C3_590516572216']
  //       }
  //     ]
  //   }
  // }
};

// 主表左侧导航多表单测试
window[592400266558] = {
  title: '录入',

  name: 'LzMenuForms',
  props: {
    mode: 'multiple',
    advSearchConfig: {
      // 高级搜索配置
      defaultVisible: false,
      containerName: 'drawer',
      drawerWidth: 500,
      labelWidth: '24%',
      rowWidth: '100%',
      dateRanges: [
        // date
        {
          title: '事件日期',
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: 'C3_591545408070' // 内部字段
        }
      ]
    },
    searchFields: [
      {
        text: '工号',
        innerFieldName: 'C3_227192472953'
      }
    ],
    navListResid: 591533333401,
    resid: 591533160636,
    hasFieldsLabel: false,
    userFieldsViewConfig: {
      mode: 'inline',
      colCount: 2
    },
    userInfoFields: [
      {
        label: '姓名',
        innerFieldName: 'C3_227192484125'
      },
      {
        label: '工号',
        innerFieldName: 'C3_227192472953'
      },
      {
        label: '职务',
        innerFieldName: 'C3_417990929305'
      },
      {
        label: '部门',
        innerFieldName: 'C3_227212499515'
      }
    ]
  }
};

// 计算公式取值
window[592244969643] = {
  title: '计算公式取值',

  name: 'LzTable',
  props: {
    resid: 592244695755,
    addBtn: true,
    cFFillFormInnerFieldNames: ['C3_592244738975', 'C3_592244739145'],
    btnsVisible: {
      mod: true
    },
    // isGetFormDefaultValues: true,
    associatedFields: [
      ['C3_592244739145', 'C3_592306113509'],
      ['C3_592244739346', 'C3_592306124239']
    ]
  }
};

// 袁巧云申请
window[605803889644] = {
  title: '访客申请',
  name: 'LzAFFOS',
  // cFFillFormInnerFieldNames: ['C3_489231990680'],
  props: {
    resids: [],
    tabPanes: [
      // 申请中
      {
        tabName: '申请中',
        componentInfo: {
          props: {
            rowColors: [
              {
                innerFieldName: 'C3_59345742160', // 内部字段
                colors: [
                  {
                    value: '正常',
                    color: ''
                  },
                  {
                    value: '异常',
                    color: '#ff0000'
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
};
// 供应商申请
window[605891224706] = {
  title: '供应商申请',
  name: 'ViProvider'
};
// 请假信息
window[601728701208] = {
  title: '请假信息',
  name: 'LzTable',
  props: {
    tableTitle: '请假信息',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 601728118057,
    opIsFixed: true,
    hasDownloadExcel: true,
    isSortBE: true,
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },
    customColumnWidth: {
      人员工号: 120,
      员工姓名: 120,
      所属部门: 250,
      登记小时: 100,
      项目名称: 100,
      同步: 100,
      考勤月份: 100,
      请假项目: 100,
      登记小时限额: 100
    },
    pagination: {
      pageSize: 10, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      del: true,
      mod: true
    },
    isSearch: true,
    cFFillFormInnerFieldNames: ['C3_425213166775', 'EMP_ID'],
    associatedFields: [['C3_596649436965', 'C3_596648784210']],
    advSearchConfig: {
      containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: '24%', // label 宽度
      rowWidth: '100%', // row 宽度
      dateRanges: [
        {
          title: '开始时间',
          innerFieldName: 'DATE1', // 内部字段
          visible: [false, false, false, false]
        }
      ],
      search: [
        // search
        {
          title: '工号/姓名',
          innerFieldNames: ['EMP_ID', 'C3_375965124343']
        },
        {
          title: '请假项目',
          innerFieldNames: ['C3_425213166775']
        }
      ]
    },
    productComponents: [
      {
        iconClass: 'icon-add',
        componentInfo: {
          name: 'LzStepsAfl',
          props: {
            resid: 592744962876
          }
        }
      }
    ]
  }
};
// 保安登记
window[605900163561] = {
  title: '保安查询',
  name: 'LzRegister'
};
// 前台记录
window[605871880758] = {
  title: '前台查询',
  name: 'LzRecord'
};
// 访客审批
window[605893340481] = {
  title: '访客审批',
  name: 'LzApproval'
};

//打印
window[603827488844] = {
  name: 'LzStepAflY', // 组件名称，这里为定制组件名称
  title: '打印信息', // 功能模块名称
  hasBackBtn: true // 是否有返回上一页的按钮，默认为 true
  // props: {
  //   resid: 777
  // } // 组件所接收的 props
};
//保安访客登记
window[606071626403] = {
  name: 'TableDataVisitor', // 组件名称，这里为定制组件名称
  title: '保安访客登记', // 功能模块名称
  // hasBackBtn: true,// 是否有返回上一页的按钮，默认为 true
  props: {
    resid: 606071751596,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      height: 500
    },
    subtractH: 240,
    recordFormType: 'drawer',
    recordFormContainerProps: {
      placement: 'bottom',
      height: 600
    },
    // recordFormFormWidth: '45%',
    subTableArrProps: [
      {
        subTableName: '物品信息',
        subResid: 606413909447,
        tableProps: {
          hasAdd: true,
          hasModify: false,
          hasDelete: false
        }

        // hasRowModify: false,
        // hasRowView: false,
        // hasRowDelete: false
      }
    ]
  }
  // 组件所接收的 props
};
//前台访客登记
window[606071640940] = {
  name: 'TableData', // 组件名称，这里为定制组件名称
  title: '前台访客登记', // 功能模块名称
  hasBackBtn: true, // 是否有返回上一页的按钮，默认为 true
  props: {
    resid: 606071814271,
    recordFormFormWidth: '90%',
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    height: '80vh',
    recordFormFormWidth: '90%'
  } // 组件所接收的 props
};
//供应商审批
window[606249673489] = {
  name: 'LzProApp', // 组件名称
  title: '供应商审批', // 功能模块名称
  hasBackBtn: true // 是否有返回上一页的按钮，默认为 true
};
//606242031630供应商保安登记
window[606242031630] = {
  name: 'TableDataVisitorG', // 组件名称，这里为定制组件名称
  title: '供应商保安登记', // 功能模块名称
  hasBackBtn: true, // 是否有返回上一页的按钮，默认为 true
  props: {
    resid: 606244496074,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasDelete: false,
    hasRowModify: true,
    hasRowView: false,
    hasRowDelete: true,
    formProps: {
      height: 500
    },
    recordFormFormWidth: '40%',
    recordFormType: 'drawer',
    recordFormContainerProps: {
      placement: 'bottom',
      height: 600
    },
    subTableArrProps: [
      {
        subTableName: '物品信息',
        subResid: 606413909447,
        tableProps: {
          hasAdd: true,
          hasModify: false,
          hasDelete: false
        }

        // hasRowModify: false,
        // hasRowView: false,
        // hasRowDelete: false
      }
    ]
  } // 组件所接收的 props
};

window[608050884937] = {
  name: 'TableDataInner',
  title: '内部推荐',
  props: {
    columnsWidth: {
      性别: 100,
      被推荐人姓名: 130,
      身份证号码: 180,
      联系电话: 130,
      民族: 100,
      婚姻状况: 130,
      籍贯: 100,
      健康状况: 130,
      学历: 130,
      专业: 100,
      在锡居住地址: 140,
      家庭地址: 180,
      推荐人工号: 130,
      推荐人姓名: 130,
      推荐部门: 130,
      推荐人联系电话: 150,
      与被推荐人之间的关系: 190,
      通知面试日期: 130,
      提交日期: 100,
      管理操作日期: 130
    }
  }
};
// 607189885707
window[607189885707] = {
  name: 'MyQuery',
  title: '问卷系统'
};
// 路由跳转的配置
window['问卷设置'] = {
  title: '问卷设置',
  name: 'QuerySet'
};

// 609334612078 问卷提交
window['我的问卷'] = {
  title: '我的问卷',
  name: 'SoleQuery'
};
// 609514648856

// SelectPersonFirst
window['选择人员'] = {
  title: '选择人员',
  name: 'SelectPersonFirst'
};

// 发送问卷
window['发送问卷'] = {
  title: '发送问卷',
  name: 'SoleQuery'
};

//题型管理
window[607170472378] = {
  name: 'TableData',
  title: '题型管理',
  props: {
    resid: 607188982819,
    hasDelete: false,
    hasModify: false,
    hasRowView: false,
    // height:600,
    subtractH: 220
  }
};
//试卷管理
window[607170235566] = {
  name: 'ExamManage',
  title: '试卷管理',
  props: {
    resid: 607188968490,
    hasModify: false
  }
};

//考试安排
window[607170185691] = {
  name: 'ExamArrange',
  title: '考试安排'
};
//题库管理
window[607170415939] = {
  name: 'EditTitle',
  title: '题库管理',
  props: {
    resid: 607599734723,
    hasAdd: false,
    hasModify: false,
    hasDelete: false,
    hasRowDelete: true
  }
};

//设计试卷
window[607459194551] = {
  name: 'ExamSet',
  title: '设计试卷'
};
//考试培训
window[611243928651] = {
  name: 'Training',
  title: '考试培训'
};
//我的考试
window[607168416937] = {
  name: 'MyExam',
  title: '我的考试',
  props: {
    resid: 607188943833,
    hasAdd: false,
    hasModify: false,
    hasDelete: false,
    columnsWidth: {
      考试名称: 250,
      考试次数: 110,
      是否通过: 110,
      剩余参加考试次数: 170,
      有效日期: 220
    }
  }
};
//人员信息
window[607183152969] = {
  name: 'TableData',
  title: '人员信息',
  props: {
    resid: 607189040461,
    hasModify: false,
    hasDelete: false
  }
};
//我的错题
window[607562749445] = {
  name: 'TableData',
  props: {
    resid: 612902074056,
    hasAdd: false,
    hasDelete: false,
    hasModify: false,
    hasRowDelete: false,
    hasRowModify: false,
    hasBeBtns: true,
    recordFormType: 'drawer',
    recordFormContainerProps: {
      placement: 'bottom',
      height: 500
    },
    columnsWidth: {
      考试名称: 250,
      试卷名称: 250,
      人员工号: 120,
      姓名: 120,
      考试总分: 120,
      通过分数: 120,
      考试成绩: 120,
      考试状态: 120,
      交卷时间: 180,
      考试剩余次数: 150,
      考试时长: 120,
      进入时间: 180,
      是否通过考试: 150,
      考试用时: 120,
      参加次数: 120,
      已参加次数: 120
    },
    // recordFormFormWidth: '45%',
    subTableArrProps: [
      {
        subTableName: '我的错题',
        subResid: 607185752828,
        tableProps: {
          hasAdd: false,
          hasModify: false,
          hasDelete: false,
          hasRowModify: false,
          hasRowView: true,
          hasRowDelete: false,
          height: 400,
          subtractH: 196
        }
      }
    ]
    // height:600
  }
};
//题型分数设置
window[607697832715] = {
  name: 'SetScore',
  title: '题型分数设置',
  props: {
    resid: 607698018138
  }
};
//考试成绩汇总
window[607384570024] = {
  name: 'Result',
  title: '成绩汇总',
  props: {
    resid: 607385902612,
    hasAdd: false,
    hasModify: false,
    hasDelete: false
  }
};
// 考试系统----培训资料611243928651
window[611243928651] = {
  name: 'TrainingMaterial',
  title: '管理考试资料'
};
window[611839500701] = {
  name: 'TrainingMaterialU',
  title: '我的考试资料'
};
//个人成绩管理
window[607170104270] = {
  name: 'TableData',
  title: '个人成绩管理',
  props: {
    resid: 608648690156,
    hasModify: false,
    hasDelete: false,
    hasAdd: false,
    hasRowDelete: false,
    hasRowModify: false,
    hasRowView: false
    // height: 300
  }
};

//财年培训课表管理
window['财年培训课表管理'] = {
  name: 'FJList',
  title: '财年培训课表管理',
  props: {
    resid: 610307713776,
    subResid: 611315248461,
    subbResid: 610308370365,
    totalResid: 609883172764,
    levelId: 449335746776,
    kcxlResid: 610708527386,
    kclbResid: 610708543449
  }
};
window['考试页面'] = {
  name: 'ExamPage',
  title: '考试页面',
  props: {}
};

window[607459194551] = {
  name: 'ExamSet',
  title: '设计试卷'
};

//创建计划
window['创建计划'] = {
  name: 'CreatePlan',
  title: '创建计划',
  props: {
    resid: 610307713776,
    subResid: 610308370365,
    levelId: 449335746776,
    kcbResid: 611315248461,
    kcxlResid: 610708527386,
    kclbResid: 610708543449
  }
};

window[610657933222] = {
  name: 'TableData',
  title: '我的成绩',
  props: {
    resid: 610662573011,
    recordFormFormWidth: '90%',
    hasBeBtns: false,
    hasModify: false,
    hasDelete: false,
    hasAdd: false,
    hasRowDelete: false,
    hasRowModify: false,
    hasRowView: true,
    subtractH: 220,
    columnsWidth: {
      考试名称: 250,
      试卷名称: 250,
      人员工号: 100,
      考试总分: 100,
      通过分数: 100,
      考试成绩: 100,
      考试状态: 100,
      交卷时间: 180,
      考试剩余次数: 150,
      考试时长: 100,
      进入时间: 180,
      是否通过考试: 150,
      考试用时: 100,
      参加次数: 100
    },
    // height:600,
    recordFormType: 'drawer',
    recordFormContainerProps: {
      placement: 'bottom',
      height: 600
    }
  }
};
// 问卷统计
window[610653848123] = {
  name: 'QuestionnaireRecords',
  title: '问卷统计',
  props: {
    resid: 608822905547,
    hasBeBtns: false,
    hasAdd: false,
    hasModify: false,
    hasDelete: false,
    hasRowView: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    subtractH: 190
  }
};

// 问卷统计分析
window['问卷统计分析'] = {
  name: 'QuestionnaireStatisticAnalysisTabs',
  title: '问卷统计分析',
  props: {}
};

// 财年计划
window[610812799351] = {
  name: 'FiscalYearPlan',
  title: '财年计划',
  props: {
    CreateableGroups: ['611769739518']
  }
};

//类别管理611054119826
window[611054119826] = {
  name: 'TableDataWrap',
  title: '试卷类别管理',
  props: {
    resid: 611054247854,
    subtractH: 190,
    // height:500,
    hasModify: false,
    hasDelete: false,
    hasRowView: false,
    hasRowSelection: true
  }
};

//课程维护
window[611085896611] = {
  name: 'CourseMaintain',
  title: '课程维护'
};

//创建总计划
window[611077057050] = {
  name: 'CreateTotalPlan',
  title: '创建总计划',
  props: {
    resid: 611077132065,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: false,
    hasDelete: false,
    hasRowDelete: true,
    hasRowModify: true,
    hasRowView: false,
    hasRowSelection: true,
    recordFormType: 'drawer',
    recordFormContainerProps: {
      placement: 'bottom',
      height: 600
    },
    subTableArrProps: [
      {
        subTableName: '人员名单',
        subResid: 613847444837,
        tableProps: {
          hasAdd: true,
          hasModify: false,
          hasRowDelete: true,
          hasRowModify: false,
          hasDelete: false,
          subtractH: 190,
          height: 500,
          hasRowView: false
        }
      }
    ]
  }
};

//HR预审
// window[611339874157] = {
//   name: 'TableData',
//   title: 'HR预审',
//   props: {
//     resid: 611086999042,
//     recordFormFormWidth: '90%',
//     hasBeBtns: true,
//     hasModify: false,
//     hasDelete: false,
//     hasAdd: false,
//     hasRowDelete: false,
//     hasRowModify: false,
//     hasRowView: true,
//     subtractH: 220,
//     // height:600,
//     recordFormType: 'drawer',
//     recordFormContainerProps: {
//       placement: 'bottom',
//       height: 600
//     }
//   }
// };
window[611339874157] = {
  name: 'TabsTableData',
  title: 'HR预审',
  props: [
    [
      {
        resid: 614686575134,
        TabsTitle: '待提交',
        recordFormFormWidth: '90%',
        columnsWidth: { 财年: 150 },
        hasBeBtns: true,
        hasModify: false,
        hasDelete: false,
        hasAdd: false,
        hasRowDelete: false,
        hasRowModify: true,
        hasRowView: false,
        subtractH: 220,
        // height:600,
        recordFormType: 'drawer',
        recordFormContainerProps: {
          placement: 'bottom',
          height: 600
        },
        subTableArrProps: [
          {
            subTableName: '计划详情',
            subResid: 611315248461,
            tableProps: {
              hasAdd: false,
              hasModify: false,
              hasDelete: false,
              hasRowModify: false,
              hasRowView: true,
              hasRowDelete: false,
              height: 400,
              subtractH: 196
            }
          }
        ]
      },
      {
        resid: 611086999042,
        TabsTitle: '未审批',
        recordFormFormWidth: '90%',
        hasBeBtns: true,
        hasModify: false,
        hasDelete: false,
        hasAdd: false,
        hasRowDelete: false,
        hasRowModify: false,
        hasRowView: true,
        subtractH: 220,
        // height:600,
        recordFormType: 'drawer',
        recordFormContainerProps: {
          placement: 'bottom',
          height: 600
        },
        subTableArrProps: [
          {
            subTableName: '计划详情',
            subResid: 611315248461,
            tableProps: {
              hasAdd: false,
              hasModify: false,
              hasDelete: false,
              hasRowModify: false,
              hasRowView: true,
              hasRowDelete: false,
              height: 400,
              subtractH: 196
            }
          }
        ]
      },
      {
        resid: 614160247793,
        TabsTitle: '已审批',
        recordFormFormWidth: '90%',
        hasBeBtns: true,
        hasModify: false,
        hasDelete: false,
        hasAdd: false,
        hasRowDelete: false,
        hasRowModify: false,
        hasRowView: false,
        subtractH: 220,
        // height:600,
        recordFormType: 'drawer',
        recordFormContainerProps: {
          placement: 'bottom',
          height: 600
        },
        subTableArrProps: [
          {
            subTableName: '计划详情',
            subResid: 611315248461,
            tableProps: {
              hasAdd: false,
              hasModify: false,
              hasDelete: false,
              hasRowModify: false,
              hasRowView: true,
              hasRowDelete: false,
              height: 400,
              subtractH: 196
            }
          }
        ]
      }
    ]
  ]
};
//用户端入口
window[611839500701] = {
  name: 'TrainingMaterialU',
  title: '我的考试资料'
};
//总监审批
// window[611339890532] = {
//   name: 'TableData',
//   title: '总监审批',
//   props: {
//     resid: 611086978293,
//     recordFormFormWidth: '90%',
//     hasBeBtns: true,
//     hasModify: false,
//     hasDelete: false,
//     hasAdd: false,
//     hasRowDelete: false,
//     hasRowModify: false,
//     hasRowView: true,
//     subtractH: 220,
//     // height:600,
//     recordFormType: 'drawer',
//     recordFormContainerProps: {
//       placement: 'bottom',
//       height: 600
//     }
//   }
// };

window[611339890532] = {
  name: 'TabsTableData',
  title: '总监审批',
  props: [
    [
      {
        resid: 614160318420,
        TabsTitle: '未审批',
        recordFormFormWidth: '90%',
        hasBeBtns: true,
        hasModify: false,
        hasDelete: false,
        hasAdd: false,
        hasRowDelete: false,
        hasRowModify: false,
        hasRowView: true,
        subtractH: 220,
        // height:600,
        recordFormType: 'drawer',
        recordFormContainerProps: {
          placement: 'bottom',
          height: 600
        },
        subTableArrProps: [
          {
            subTableName: '计划详情',
            subResid: 611315248461,
            tableProps: {
              hasAdd: false,
              hasModify: false,
              hasDelete: false,
              hasRowModify: false,
              hasRowView: true,
              hasRowDelete: false,
              height: 400,
              subtractH: 196
            }
          }
        ]
      },
      {
        resid: 614160332247,
        TabsTitle: '已审批',
        recordFormFormWidth: '90%',
        hasBeBtns: true,
        hasModify: false,
        hasDelete: false,
        hasAdd: false,
        hasRowDelete: false,
        hasRowModify: false,
        hasRowView: false,
        subtractH: 220,
        // height:600,
        recordFormType: 'drawer',
        recordFormContainerProps: {
          placement: 'bottom',
          height: 600
        },
        subTableArrProps: [
          {
            subTableName: '计划详情',
            subResid: 611315248461,
            tableProps: {
              hasAdd: false,
              hasModify: false,
              hasDelete: false,
              hasRowModify: false,
              hasRowView: true,
              hasRowDelete: false,
              height: 400,
              subtractH: 196
            }
          }
        ]
      }
    ]
  ]
};

//计划授权
window[611667749682] = {
  name: 'TableData',
  title: '计划授权',
  props: {
    resid: 611318802160,
    recordFormFormWidth: '90%',
    hasBeBtns: false,
    hasModify: false,
    hasDelete: false,
    hasAdd: true,
    hasRowDelete: true,
    hasRowModify: true,
    hasRowView: false,
    subtractH: 220,
    height: 600,
    recordFormType: 'drawer',
    recordFormContainerProps: {
      placement: 'bottom',
      height: 600
    }
  }
};

//RBA排班
window[612526844134] = {
  name: 'TableDataScheduling',
  title: 'RBA排班',
  props: {}
};

// 个人成绩管理
window[607168405062] = {
  name: 'PersonGradeManagement',
  title: '个人成绩管理',
  props: {
    resid: 610311177773,
    recordFormFormWidth: '90%',
    hasBeBtns: true,
    hasModify: false,
    hasDelete: false,
    hasAdd: false,
    hasRowDelete: false,
    hasRowModify: false,
    hasRowView: false,
    subtractH: 190,
    // height:600,
    formProps: {
      height: 500
    },
    recordFormType: 'drawer',
    recordFormContainerProps: {
      placement: 'bottom',
      height: 600
    },
    subTableArrProps: [
      {
        subTableName: '员工成绩',
        subResid: 608809112309,
        tableProps: {
          hasAdd: false,
          hasModify: false,
          hasRowDelete: false,
          hasRowModify: false,
          hasDelete: false,
          subtractH: 190,
          height: 500,
          hasRowView: false
        }
      },
      {
        subTableName: '通过人员',
        subResid: 610297347149,
        tableProps: {
          hasAdd: false,
          hasModify: false,
          hasRowDelete: false,
          hasRowModify: false,
          hasDelete: false,
          subtractH: 190,
          height: 500,
          hasRowView: false
        }
      },
      {
        subTableName: '未参加&未通过人员',
        subResid: 610299723125,
        tableProps: {
          hasAdd: false,
          hasModify: false,
          hasRowDelete: false,
          hasRowModify: false,
          hasDelete: false,
          subtractH: 190,
          height: 500,
          hasRowView: false
        }
      }
    ]
  }
};

// 考试图表分析
window['考试图表分析'] = {
  name: 'ExamAnalyze',
  title: '考试图表分析',
  props: {}
};

// 综合管理
window['629806026549'] = {
  name: 'BusinessManagement',
  title: '综合管理',
  props: {
    rootId: 0,
    dblinkname: '',
    baseURL: 'http://10.108.2.66:9091',
    downloadBaseURL: 'http://10.108.2.66:80/'
  }
};

// 求职者入口
window[614079025750] = {
  name: 'JobSeeker',
  title: 'IDL求职者',
  props: {}
};

// IE考勤数据查询
window[629807131919] = {
  name: 'TableData',
  title: 'IE考勤数据查询',
  props: {
    resid: '629462405981',
    subtractH: '200',
    hasAdd: false,
    hasModify: false,
    hasRowDelete: false,
    hasRowModify: false,
    hasDelete: false,
    hasBeBtns: true,
    nullValueNotFetch: true
  }
};

window[614187065713] = {
  name: 'ExternalTraining', // 组件名称，这里为定制组件名称
  title: '外训管理', // 功能模块名称
  hasBackBtn: true, // 是否有返回上一页的按钮，默认为 true
  props: {
    // resid: 777
  } // 组件所接收的 props
};
// IDL招聘管理员端入口
window[614078684178] = {
  name: 'IdLindex',
  title: 'IDL招聘'
};

// IDL第二种设计方案
window[614260227832] = {
  name: 'IdL2',
  title: 'IDL招聘新版本'
};
window[616084074623] = {
  name: 'OfferLetter',
  title: 'IDLOfferLetter'
};
window[621418936996] = {
  name: 'IDLExamination',
  title: 'IDLExamination'
};
//IDl 路由跳转设置
window['个人表格'] = {
  title: '个人表格',
  name: 'PersonInfo'
};

//符合解除人员
window[614706766207] = {
  name: 'RelievePerson',
  title: '符合解除人员'
  // props: {
  //   resid: 614709186509,
  //   recordFormFormWidth: '90%',
  //   hasBeBtns: false,
  //   hasModify: false,
  //   hasDelete: false,
  //   hasAdd: false,
  //   hasRowDelete: false,
  //   hasRowModify: false,
  //   hasRowView: true,
  //   subtractH: 220,
  //   height: 600,
  //   recordFormType: 'drawer',
  //   recordFormContainerProps: {
  //     placement: 'right',
  //     height: 600
  //   }
  // }
};

//违纪未审批记录
window[614709663995] = {
  name: 'TableData',
  title: '违纪未审批记录',
  props: {
    resid: 614709499589,
    recordFormFormWidth: '90%',
    hasBeBtns: false,
    hasModify: false,
    hasDelete: false,
    hasAdd: false,
    hasRowDelete: true,
    hasRowModify: false,
    hasRowView: false,
    subtractH: 220,
    height: 600,
    recordFormType: 'drawer',
    recordFormContainerProps: {
      placement: 'bottom',
      height: 600
    }
  }
};

//培训系统————课程资源
window[615375286006] = {
  name: 'CourseResources',
  title: '课程资源'
};

//员工 我的课程
window[615374522659] = {
  name: 'EmployeeCourses', // 组件名称，这里为定制组件名称
  title: '我的课程', // 功能模块名称
  hasBackBtn: true, // 是否有返回上一页的按钮，默认为 true
  props: {
    // resid: 777
  } // 组件所接收的 props
};

//培训系统————内训管理
window[615898415042] = {
  name: 'InternalTraining',
  title: '内训管理'
};

//培训系统————二级部门经理 查阅计划
window[616242189307] = {
  name: 'ViewPlan',
  title: '查阅计划'
};

//HR部门经理审批申请单
window[622831415092] = {
  name: 'ApplyApprove',
  title: '申请单审批'
};

//培训系统————下属课程
window[616504759208] = {
  name: 'SubordinateCourses',
  title: '下属课程'
};

// 618661338339 内
// 617900923941 外
//DL招聘————显示考试签到二维码
window[618661338339] = {
  name: 'ExaminationQRCode',
  title: '签到二维码'
};

//DL招聘————问询系统
window[619020712280] = {
  name: 'EnquirySystem',
  title: '问询中心'
};

//试用期管理————HR
window[619175063394] = {
  name: 'HRProbation',
  title: '试用期管理'
};
window[625082884132] = {
  name: 'TrainingOrganization',
  title: '培训机构课程维护'
};
//我的试用期————员工
window[619175111028] = {
  name: 'EmployeeProbation',
  title: '我的试用期',
  props: {
    roleName: '员工'
  }
};
//试用期————辅导员
window[619175547350] = {
  name: 'TutorshipProbation',
  title: '试用期管理'
};
//试用期————经理
window[619553176367] = {
  name: 'ManagerProbation',
  title: '试用期管理'
};
//试用期————主管
window[619553156237] = {
  name: 'DirectorProbation',
  title: '试用期管理'
};

// 616081514704
window[616081514704] = {
  name: 'TableData',
  title: '测试'
};

window[618508577260] = {
  name: 'MyTeam',
  title: '我的团队'
};

window[618572873186] = {
  name: 'IDPMangement',
  title: '员工个人发展管理'
};
window[618665452476] = {
  name: 'DLEmploy',
  title: '员工个人发展管理'
};
window[619954194724] = {
  name: 'IdpCard',
  title: '我的IDP',
  props: {
    role: 'Employee'
  }
};
window[620212364621] = {
  name: 'ComprehensiveQuery',
  title: '综合查询'
};
window[621257502796] = {
  name: 'AttendanceManage',
  title: '考勤申请'
};
window[622577431745] = {
  name: 'ReferenceCheck',
  title: '背景调查'
};
window[622577498761] = {
  name: 'PhysicalExamination',
  title: '体检通知'
};
window[623529591025] = {
  name: 'CyberMoney',
  title: '积分系统'
};
window[623607754429] = {
  name: 'ProjectBonus',
  title: '项目积分'
};
window[625853399155] = {
  name: 'TranningDetail',
  title: '内外训明细'
};
window[625853614245] = {
  name: 'TranningDetailApproval',
  title: '内外训明细审批'
};
window[626452876459] = {
  name: 'SearchForEmployee',
  title: '求职者查询'
};
window[626954797692] = {
  name: 'PostAndPersonnel',
  title: '岗位与人事'
};
window[627590812010] = {
  name: 'DLPrint',
  title: 'DL打印'
};
window[628679481942] = {
  name: 'StatisticalReportForms',
  title: '数据统计报表'
};
window[628250933331] = {
  name: 'IDPTrack',
  title: '个人能力发展轨迹'
};
window[630772897523] = {
  name: 'RankGrade',
  title: '评级评优'
};
window[628868376923] = {
  name: 'VisitorApplyVIP',
  title: 'VIP访客申请'
};

window[629371964947] = {
  name: 'DataProcess',
  title: '数据处理'
};

window[629545423118] = {
  name: 'InterviewInvitation',
  title: 'IDL面试邀请'
};

window[631729718446] = {
  name: 'DepartmentManager',
  title: '部门管理'
};
window[631729844802] = {
  name: 'OfferApproval',
  title: 'Offer审批'
};
window[631729798279] = {
  name: 'HeadCount',
  title: 'HeadCount'
};

window[628885904481] = {
  name: 'TableData', // 组件名称，
  title: 'VIP前台查阅', // 功能模块名称
  props: {
    resid: 628946871001,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: true,
    actionBarWidth: 170,
    hasRowView: true,
    hasRowDelete: false,
    formProps: {
      // height: 500
    },
    subtractH: 240
  }
};

window[628886558788] = {
  name: 'TableData', // 组件名称，
  title: '统计管理', // 功能模块名称
  props: {
    resid: 628946981907,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    formProps: {
      // height: 500
    },
    subtractH: 240
  }
};

/**
 * 申请人确认页面
 */
window[629200936654] = {
  name: 'TableData', // 组件名称，
  title: '统计管理', // 功能模块名称
  props: {
    resid: 631104772748,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    formProps: {
      // height: 500
    },
    subtractH: 240
  }
};

window[631618595197] = {
  name:'AttendanceRecord',
  title:'签到记录导出'
};

window[631968621232] = {
  name:'PersonInfoManager',
  title:'个人档案管理'
};