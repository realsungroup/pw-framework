// 管理员确认
window[606476781618] = {
  name: 'TableDataWrap',
  title: '录入',
  props: {
    resid: 605617716920,
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
// // 606496690009 到期违章清单
window[606493652444] = {
  name: 'TableDataWrap',
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
          btnName: '撤销',
          innerFieldNames: [
            'C3_590512213622',
            'C3_591373760332',
            'C3_605619907534'
          ],
          values: ['Y', null, 'Y']
        },
        {
          btnName: '修改',
          innerFieldNames: ['C3_591373760332'],
          values: ['Y']
        },
        {
          btnName: '删除',
          innerFieldNames: ['C3_591373611399', 'C3_605619907534'],
          values: ['Y', 'Y']
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
  name: 'LzTable',
  props: {
    // 单元组件 props
    resid: 590863325025,
    isSearch: false,
    formsName: 'default3i',
    hasDownloadExcel: true,
    cFFillFormInnerFieldNames: ['C3_590510737521'],
    advDicTableProps: {
      lzTableStyle: {
        width: 1100
      },
      customColumnWidth: {
        依据: 600
      }
    },
    addBtn: {
      type: 'text',
      text: '录入'
    },
    btnsVisible: {
      check: true,
      mod: false,
      del: false,
      edit: false,
      save: false,
      cancel: false
    },
    pagination: {
      pageSize: 10,
      current: 0
    },
    opIsFixed: true,
    tableTitle: '统计分析',
    showHeader: true,
    displayMod: 'classify',
    hasOpenUnitBtn: true,

    lzAdvSearchStyle: {
      background: '#e5e9ed',
      borderRadius: '4px',
      border: '1px solid #e5e9ed'
    },
    advSearchConfig: {
      defaultVisible: false,
      containerName: 'drawer',
      drawerWidth: 550,
      labelWidth: '24%',
      rowWidth: '100%',
      dateRanges: [
        // date
        {
          title: '违纪日期',
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: 'C3_590511645885' // 内部字段
        },
        {
          title: '确认审批的日期',
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: 'C3_591363529469' // 内部字段
        }
        // {
        //   title: '入职日期',
        //   visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
        //   innerFieldName: 'C3_590512068786' // 内部字段
        // }
      ],
      tag: [
        // tag
        {
          title: '部门',
          op: 'or', // 操作符：'or' | 'and'
          tags: [
            {
              label: 'OA',
              value: 'OA',
              isSelected: false,
              innerFieldName: 'C3_590510763625' // 内部字段名
            },
            {
              label: 'OPS',
              value: 'OPS',
              isSelected: false,
              innerFieldName: 'C3_590510763625'
            }
          ]
        },
        {
          title: '状态',
          op: 'or',
          tags: [
            {
              label: '已撤销',
              value: '已撤销',
              isSelected: false,
              innerFieldName: 'C3_590514418013'
            },
            {
              label: '已录入',
              value: '已录入',
              isSelected: false,
              innerFieldName: 'C3_590514418013'
            },
            {
              label: '进行中',
              value: '进行中',
              isSelected: false,
              innerFieldName: 'C3_590514418013'
            }
          ]
        },
        {
          title: '合同类别',
          op: 'or',
          tags: [
            {
              label: 'SH',
              value: 'SH',
              isSelected: false,
              innerFieldName: 'C3_590686786388'
            },
            {
              label: 'WX',
              value: 'WX',
              isSelected: false,
              innerFieldName: 'C3_590686786388'
            }
          ]
        },
        {
          title: '违纪类别',
          op: 'or',
          tags: [
            {
              label: '绩效处分',
              value: '绩效处分',
              isSelected: false,
              innerFieldName: 'C3_590512169985'
            },
            {
              label: '警告',
              value: '警告',
              isSelected: false,
              innerFieldName: 'C3_590512169985'
            },
            {
              label: '较重警告',
              value: '较重警告',
              isSelected: false,
              innerFieldName: 'C3_590512169985'
            },
            {
              label: '严重警告',
              value: '严重警告',
              isSelected: false,
              innerFieldName: 'C3_590512169985'
            }
          ]
        },
        {
          title: '是否撤销',
          op: 'or',
          tags: [
            {
              label: '是',
              value: 'Y',
              isSelected: false,
              innerFieldName: 'C3_590512213622'
            },
            {
              label: '否',
              value: 'N',
              isSelected: false,
              innerFieldName: 'C3_590512213622'
            }
          ]
        },
        {
          title: '是否确认审批',
          op: 'or',
          tags: [
            {
              label: '是',
              value: 'Y',
              isSelected: false,
              innerFieldName: 'C3_591373611399'
            },
            {
              label: '否',
              value: 'N',
              isSelected: false,
              innerFieldName: 'C3_591373611399'
            }
          ]
        }
      ],
      search: [
        {
          title: '工号/姓名/部门',
          innerFieldNames: [
            'C3_590510737521',
            'C3_590510740042',
            'C3_590510763625'
          ]
        },
        {
          title: '惩处依据',
          innerFieldNames: ['C3_590511744313']
        },
        {
          title: '职级',
          innerFieldNames: ['C3_590512134594']
        }
      ]
    }
  }
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
  title: '供应商维护',
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
    hasRowDelete: false,
    formProps: {
      height: 500
    },
    subtractH: 166,
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
  name: 'TableDataWrap', // 组件名称，这里为定制组件名称
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
  title: '内部推荐'
};
// 607189885707
window[607189885707] = {
  name: 'MyQuery',
  title: '问卷系统'
};

// 608635796671
// window[608635796671] = {
//   name: 'QuerySet',
//   title: '问卷设置'
// };
// 路由跳转的配置
window['问卷设置'] = {
  title: '问卷设置',
  name: 'QuerySet'
};

//  window['选择人员'] = {
//    title:'选择人员发送',
//    name:'SelectPersonFirst'
//  };

// 609334612078 问卷提交
window['609334612078'] = {
  title: '提交问卷',
  name: 'SoleQuery'
};
// 609514648856

// SelectPersonFirst
window['选择人员'] = {
  title: '选择人员',
  name: 'SelectPersonFirst'
};

window['统计分析'] = {
  title: '统计分析',
  name: 'Statical'
};
// 发送问卷
window['发送问卷'] = {
  title: '我的问卷',
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
    hasRowView: false
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
    hasDelete: false
  }
};

//设计试卷

//考试培训
window[607168385734] = {
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
    hasDelete: false
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
  title: '我的错题',
  props: {
    resid: 607185752828,
    hasAdd: false,
    hasDelete: false,
    hasModify: false,
    hasRowDelete: false,
    hasRowModify: false
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
    hasRowView: false,
    height: 300
  }
}


//财年培训课表管理
window[609158468182]={
  name:'FJList',
  title:'财年培训课表管理',
  props: {
    resid: 610307713776,
    hasModify: false,
    hasDelete: false,
    hasAdd: false,
    hasRowDelete: false,
    hasRowModify: false,
    hasRowView: false,
  }
}
window['考试页面']={
  name:'ExamPage',
  title:'考试页面',
  props: {}
}

window[607168405062] = {
  name: 'TableData',
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
          hasDelete: false
        }

        // hasRowModify: false,
        // hasRowView: false,
        // hasRowDelete: false
      }
    ]
  }
}
window[607459194551] = {
  name: 'ExamSet',
  title: '设计试卷'
};