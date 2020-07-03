// 管理员确认
window[606476781618] = {
  name: 'AdminConfirm',
  title: '录入',
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    resid: 605617716920,
    hasBeBtns: false,
    hasAdd: false,
    hasModify: false,
    hasDelete: false,
    hasRowView: true,
    hasRowModify: false,
    hasRowDelete: false,
    subtractH: 220,
    hasRowSelection: true,
    isSearch: false,
    hasAdvSearch: false,
    advSearchConfig: {
      defaultVisible: false,
      containerName: 'drawer',
      drawerWidth: 550,
      labelWidth: '24%',
      rowWidth: '100%',
      dateRanges: [
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
      ],
      tag: [
        // tag
        // {
        //   title: '部门',
        //   op: 'or', // 操作符：'or' | 'and'
        //   tags: [
        //     {
        //       label: 'OA',
        //       value: 'OA',
        //       isSelected: false,
        //       innerFieldName: 'C3_590510763625' // 内部字段名
        //     },
        //     {
        //       label: 'OPS',
        //       value: 'OPS',
        //       isSelected: false,
        //       innerFieldName: 'C3_590510763625'
        //     }
        //   ]
        // },
        // {
        //   title: '状态',
        //   op: 'or',
        //   tags: [
        //     {
        //       label: '已撤销',
        //       value: '已撤销',
        //       isSelected: false,
        //       innerFieldName: 'C3_590514418013'
        //     },
        //     {
        //       label: '已录入',
        //       value: '已录入',
        //       isSelected: false,
        //       innerFieldName: 'C3_590514418013'
        //     },
        //     {
        //       label: '进行中',
        //       value: '进行中',
        //       isSelected: false,
        //       innerFieldName: 'C3_590514418013'
        //     }
        //   ]
        // },
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
        // {
        //   title: '是否撤销',
        //   op: 'or',
        //   tags: [
        //     {
        //       label: '是',
        //       value: 'Y',
        //       isSelected: false,
        //       innerFieldName: 'C3_590512213622'
        //     },
        //     {
        //       label: '否',
        //       value: 'N',
        //       isSelected: false,
        //       innerFieldName: 'C3_590512213622'
        //     }
        //   ]
        // },
        {
          title: '到期撤销',
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
        },
        {
          title: '一级部门',
          innerFieldNames: ['C3_590516541218']
        },
        {
          title: '二级部门',
          innerFieldNames: ['C3_590516558243']
        },
        {
          title: '三级部门',
          innerFieldNames: ['C3_590516572216']
        }
      ]
    }
  }
};
// // 606496690009 到期违章清单
window[606493652444] = {
  name: 'ExpireViolationsList',
  title: '到期违纪清单',
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
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
    baseURL: 'http://ngrok5.realsun.me:6060/',
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
  name: 'StatisticAnalysisJC',
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
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
      del: true,
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
    // dataMode :"sub",
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
        {
          title: '违纪日期',
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: 'C3_590511645885' // 内部字段
        },
        {
          title: '管理员确认日期',
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: 'C3_606306735938' // 内部字段
        }
      ],
      tag: [
        // tag
        // {
        //   title: '部门',
        //   op: 'or', // 操作符：'or' | 'and'
        //   tags: [
        //     {
        //       label: 'OA',
        //       value: 'OA',
        //       isSelected: false,
        //       innerFieldName: 'C3_590510763625' // 内部字段名
        //     },
        //     {
        //       label: 'OPS',
        //       value: 'OPS',
        //       isSelected: false,
        //       innerFieldName: 'C3_590510763625'
        //     }
        //   ]
        // },
        // {
        //   title: '状态',
        //   op: 'or',
        //   tags: [
        //     {
        //       label: '已撤销',
        //       value: '已撤销',
        //       isSelected: false,
        //       innerFieldName: 'C3_590514418013'
        //     },
        //     {
        //       label: '已录入',
        //       value: '已录入',
        //       isSelected: false,
        //       innerFieldName: 'C3_590514418013'
        //     },
        //     {
        //       label: '进行中',
        //       value: '进行中',
        //       isSelected: false,
        //       innerFieldName: 'C3_590514418013'
        //     }
        //   ]
        // },
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
        // {
        //   title: '是否撤销',
        //   op: 'or',
        //   tags: [
        //     {
        //       label: '是',
        //       value: 'Y',
        //       isSelected: false,
        //       innerFieldName: 'C3_590512213622'
        //     },
        //     {
        //       label: '否',
        //       value: 'N',
        //       isSelected: false,
        //       innerFieldName: 'C3_590512213622'
        //     }
        //   ]
        // },
        {
          title: '到期撤销',
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
        },
        {
          title: '一级部门',
          innerFieldNames: ['C3_590516541218']
        },
        {
          title: '二级部门',
          innerFieldNames: ['C3_590516558243']
        },
        {
          title: '三级部门',
          innerFieldNames: ['C3_590516572216']
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
    baseURL: 'http://ngrok5.realsun.me:6060/',
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
    subtractH: 200,
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
          hasDelete: false,
          height: 400
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
    isSetColumnWidth:true,
    actionBarFixed: true,
    recordFormContainerProps: {
      placement: 'bottom',
      height: 600
    },
    noWidthFields: "C3_611070959393",
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
          subtractH: 170,
          height: 440,
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
    baseURL: 'http://ngrok5.realsun.me:6060/',
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
window[642853831562] = {
  name: 'ComprehensiveQuery',
  title: '绩效查询',
  props: {
    tabKey: 'performance'
  }
};

window[642853818882] = {
  name: 'ComprehensiveQuery',
  title: '考勤查询',
  props: {
    tabKey: 'attendance'
  }
};
window[643372961628] = {
  name: 'ComprehensiveQuery',
  title: '评级评优查询',
  props: {
    tabKey: 'rating'
  }
};
window[642853806554] = {
  name: 'ComprehensiveQuery',
  title: '人事查询',
  props: {
    tabKey: 'personnel'
  }
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
  title: '岗位信息',
  props: {
    role: 'hr'
  }
};
window[640366512916] = {
  name: 'PostAndPersonnel',
  title: '岗位管理',
  props: {
    role: 'manager'
  }
};
window[640366451797] = {
  name: 'PersonnelInformation',
  title: '人事信息',
  props: {
    role: 'hr'
  }
};
window[640366551916] = {
  name: 'PersonnelInformation',
  title: '人事管理',
  props: {
    role: 'manager'
  }
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
    subtractH: 200
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
    isUseFormDefine:false,
    advSearch:{
      formName:'defaultSearch',
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

/**
 * 申请人确认页面
 */
window[629200936654] = {
  name: 'TableData', // 组件名称，
  title: '申请人确认', // 功能模块名称
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
    advSearch:{
      formName: 'defaultSearch'
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

window[631618595197] = {
  name: 'AttendanceRecord',
  title: '签到记录导出'
};

window[631968621232] = {
  name: 'PersonInfoManager',
  title: '个人档案管理'
};

window[631968828634] = {
  name: 'PersonInfoPrivate',
  title: '个人档案'
};

window[632244542306] = {
  name: 'IDLTransfer',
  title: 'IDL调岗'
};
window[635350002067] = {
  name: 'IDLTransferHr',
  title: 'IDL调岗HR预审'
};
window[640088086206] = {
  name: 'RBAVideoData',
  title: 'RBA视频数据'
};
window[640189772997] = {
  name: 'Compact',
  title: '合同管理'
};
window[640189820723] = {
  name: 'ContractApproval',
  title: '合同审批'
};
window[642077290667] = {
  name: 'WzApprove',
  title: '物资进出管理'
};
window[642506200802] = {
  name: 'WzAdminApprove',
  title: '物资行政部审批'
};
window[642506243685] = {
  name: 'WzEquipmentApprove',
  title: '物资设备部核准'
};
window[642506222417] = {
  name: 'WzImportApprove',
  title: '物资进出口审批'
};
window[641990842014] = {
  name: 'PWRedirect',
  title: '测试',
  props: {
    resid: '534530373089',
    replaceBaseUrl: 'http://ngrok16.realsun.me:6060'
  }
};
window[641992029202] = {
  name: 'PWRedirect',
  title: 'Offer Proposal管理',
  props: {
    resid: '534530373089',
    replaceBaseUrl: 'http://ngrok16.realsun.me:6060'
  }
};
window[641992076936] = {
  name: 'PWRedirect',
  title: 'Offer Proposal审批',
  props: {
    resid: '534957565681',
    replaceBaseUrl: 'http://ngrok16.realsun.me:6060'
  }
};
window[641992112255] = {
  name: 'PWRedirect',
  title: 'Offer Comfirmation管理',
  props: {
    resid: '537391112338',
    replaceBaseUrl: 'http://ngrok16.realsun.me:6060'
  }
};

window[641992135890] = {
  name: 'PWRedirect',
  title: 'Offer Comfirmation核对',
  props: {
    resid: '537532977680',
    replaceBaseUrl: 'http://ngrok16.realsun.me:6060'
  }
};
window[643313663856] = {
  name: 'PWRedirect',
  title: '薪资统计报表一',
  props: {
    resid: '643314531373',
    replaceBaseUrl: ''
  }
};
window[643374153807] = {
  name: 'PWRedirect',
  title: '在职情况',
  props: {
    resid: '643375082697',
    replaceBaseUrl: ''
  }
};
window[643376172016] = {
  name: 'PWRedirect',
  title: '离职情况',
  props: {
    resid: '643375999327',
    replaceBaseUrl: ''
  }
};
//总部-headcount
window[641992200325] = {
  name: 'PWRedirect',
  title: '总部HeadCount',
  props: {
    resid: '578227119902',
    replaceBaseUrl: 'http://wux-hr03.china.ads.finisar.com:8019'
  }
};
//总部-offer
window[641992279531] = {
  name: 'PWRedirect',
  title: '总部Offer',
  props: {
    resid: '578236391005',
    replaceBaseUrl: 'http://wux-hr03.china.ads.finisar.com:8019'
  }
};
//总部-管理员
window[641992499902] = {
  name: 'HeadquartersManage',
  title: '总部工作流管理'
  // props: {
  //   resid: '576924862772',//未定
  //   replaceBaseUrl: 'http://ngrok17.realsun.me:6060'
  // }
};
window[642853675476] = {
  name: 'WageCardInformation', // 组件名称，
  title: '工资卡信息', // 功能模块名称
  props: {
    // baseURL: 'http://ngrok5.realsun.me:6060/',
    // downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    // resid: 497727888930,
    // actionBarWidth: 200,
    // hasAdd: true,
    // hasBeBtns: true,
    // hasModify: false,
    // hasBackBtn: true,
    // hasDelete: true,
    // hasRowModify: true,
    // hasRowView: true,
    // hasRowDelete: true,
    // isUseFormDefine:false,
    // formProps: {
    //   // height: 500
    // },
    // subtractH: 200
  }
};

window[642853692520] = {
  name: 'TableData', // 组件名称，
  title: '离职信息', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 244132786765,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

window[646240367975] = {
  name: 'TableData', // 组件名称，
  title: '公司黑名单', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 548327414090,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642853703890] = {
  name: 'TableData', // 组件名称，
  title: '除名信息', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok/',
    resid: 547739772004,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    advSearch:{
      formName:'defaultSearch'
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642853717153] = {
  name: 'TableData', // 组件名称，
  title: '办公室实习', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 424790789055,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642853731843] = {
  name: 'TableData', // 组件名称，
  title: '办公室外包', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 426094684841,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642853756410] = {
  name: 'TableData', // 组件名称，
  title: '职务定义', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 417736675691,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642853770096] = {
  name: 'TableData', // 组件名称，
  title: '级别定义', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 449335746776,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642853871961] = {
  name: 'TableData', // 组件名称，
  title: '项目定义', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 308874433885,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642853893908] = {
  name: 'TableData', // 组件名称，
  title: '期间定义', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 424358078333,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642853907777] = {
  name: 'TableData', // 组件名称，
  title: '班次定义', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 375278046796,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642853918132] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '排班定义', // 功能模块名称
  props: {
    resid: 375292143375,
    mainTableProps: {
      actionBarWidth: 300,
      hasAdd: true,
      hasBeBtns: true,
      hasModify: true,
      hasBackBtn: true,
      hasDelete: true,
      hasRowModify: true,
      hasRowView: true,
      hasRowDelete: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      375292357468: {
        hasBeBtns: true
      }
    }
  }
};
window[642853928356] = {
  name: 'TableData', // 组件名称，
  title: '考勤数据锁定', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 432205173401,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642853955171] = {
  name: 'TableData', // 组件名称，
  title: '部门授权', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 423682233289,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEdit: true,
    hasRowEditAdd: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854041376] = {
  name: 'TableData', // 组件名称，
  title: '节日登记', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 375364128640,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEdit: true,
    hasRowEditAdd: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854056479] = {
  name: 'TableData', // 组件名称，
  title: '节日调休', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 375455814611,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEdit: true,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854067180] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '年假台账', // 功能模块名称
  props: {
    resid: 429955296972,
    mainTableProps: {
      actionBarWidth: 200,
      hasAdd: true,
      hasBeBtns: true,
      hasModify: true,
      hasBackBtn: true,
      hasDelete: true,
      hasRowModify: false,
      isUseFormDefine: false,
      hasRowEdit: true,
      hasRowEditAdd: true,
      hasRowView: true,
      hasRowDelete: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      441994427244: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      630169827334: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      469288143241: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};

window[642854077482] = {
  name: 'TableData', // 组件名称，
  title: '年假年度剩余调整', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 441994427244,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    isSetColumnWidth:false,
    advSearch:{
      // formName:"defaultSearch"
      isRequestFormData:false,
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854088542] = {
  name: 'TableData', // 组件名称，
  title: '年假当前新增调整', // 功能模块名称
  props: {
    resid: 630169827334,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    hasRowDelete: true,
    isSetColumnWidth:false,
    advSearch:{
      formName:"defaultSearch"
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854098292] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '哺乳假台账', // 功能模块名称
  props: {
    resid: 435412554124,
    mainTableProps: {
      actionBarWidth: 200,
      hasAdd: true,
      hasBeBtns: true,
      hasModify: true,
      hasBackBtn: true,
      hasDelete: true,
      hasRowModify: false,
      hasRowView: true,
      hasRowDelete: true,
      isUseFormDefine: false,
      hasRowEdit: true,
      hasRowEditAdd: true,
      baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      435419664427: {
        hasBeBtns: true
      }
    }
  }
};
window[642854107052] = {
  name: 'TableData', // 组件名称，
  title: '哺乳假使用明细', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 435419664427,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854117487] = {
  name: 'TableData', // 组件名称，
  title: '调休假台账', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 435431842051,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEditAdd: true,
    hasRowEdit: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854131163] = {
  name: 'TableData', // 组件名称，
  title: '调休年度剩余调整', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 442578987574,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEditAdd: true,
    hasRowEdit: true,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854141907] = {
  name: 'TableData', // 组件名称，
  title: '事假台账', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 518262920381,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854704644] = {
  name: 'TableData', // 组件名称，
  title: '班组调整记录查询', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 423660730564,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: false,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854157717] = {
  name: 'TableData', // 组件名称，
  title: '班组调整记录查询', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 423660730564,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: false,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642856273477] = {
  name: 'TableData', // 组件名称，
  title: 'DL招聘需求统计', // 功能模块名称
  props: {
    resid: 615914981961,
    actionBarWidth: 200,
    hasAdd: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isSetColumnWidth:false,
    isUseFormDefine:false,
    advSearch:{
      formName:'defaultSearch'
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[618661462541] = {
  name: 'TableData', // 组件名称，
  title: '内部推荐', // 功能模块名称
  props: {
    resid: 605636164944,
    actionBarWidth: 200,
    hasAdd: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine:false,
    advSearch:{
      formName:"defaultSearch"
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642855799959] = {
  name: 'DLEmploy', // 组件名称，
  title: 'DL招聘管理' // 功能模块名称
};
window[642856262431] = {
  name: 'TableData', // 组件名称，
  title: 'S1S2招聘管理', // 功能模块名称
  props: {
    resid: 527959305537,
    actionBarWidth: 200,
    hasAdd: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine:false,
    isSetColumnWidth:false,
    advSearch:{
      formName:'defaultSearch'
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642856283564] = {
  name: 'TableData', // 组件名称，
  title: 'DL业务部门查看', // 功能模块名称
  props: {
    resid: 561649722687,
    actionBarWidth: 200,
    hasAdd: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854180216] = {
  name: 'TableData', // 组件名称，
  title: '班次调整记录查询', // 功能模块名称
  props: {
    resid: 423666035454,
    actionBarWidth: 200,
    hasAdd: false,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854999190] = {
  name: 'TableData', // 组件名称，
  title: '班组调整', // 功能模块名称
  props: {
    resid: 423574450430,
    actionBarWidth: 200,
    hasAdd: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642855062753] = {
  name: 'TableData', // 组件名称，
  title: '班次调整', // 功能模块名称
  props: {
    resid: 423664972378,
    actionBarWidth: 200,
    hasAdd: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854713880] = {
  name: 'TableData', // 组件名称，
  title: '班次调整记录查询', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 423666035454,
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
    subtractH: 200
  }
};
window[642854200143] = {
  name: 'TableData', // 组件名称，
  title: '产线定义', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 525642530090,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    importConfig: {
      mode: 'be',
      saveState: 'editoradd',
      containerType: 'drawer'
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854211673] = {
  name: 'TableData', // 组件名称，
  title: 'RBA规则定义', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 525780641896,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854223262] = {
  name: 'TableData', // 组件名称，
  title: 'RBA排班导入', // 功能模块名称
  props: {
    resid: 527089107422,
    actionBarWidth: 200,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854235003] = {
  name: 'TableData', // 组件名称，
  title: 'RBA排班锁定', // 功能模块名称
  props: {
    resid: 619700236031,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854252939] = {
  name: 'TableData', // 组件名称，
  title: 'DL人员RBA规则设置', // 功能模块名称
  props: {
    resid: 611406015223,
    actionBarWidth: 200,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854266702] = {
  name: 'TableData', // 组件名称，
  title: '三期人员RBA规则设置', // 功能模块名称
  props: {
    resid: 608738442390,
    actionBarWidth: 200,
    hasAdd: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854279289] = {
  name: 'TableData', // 组件名称，
  title: 'RBA排班明细', // 功能模块名称
  props: {
    resid: 616676083973,
    actionBarWidth: 200,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854434101] = {
  name: 'TableData', // 组件名称，
  title: '考勤日报', // 功能模块名称
  props: {
    resid: 375296167687,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854450973] = {
  name: 'TableData', // 组件名称，
  title: '考勤月报', // 功能模块名称
  props: {
    resid: 311025002785,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854462178] = {
  name: 'TableData', // 组件名称，
  title: '上海公出无锡报表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 556378759707,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854476015] = {
  name: 'TableData', // 组件名称，
  title: '考勤异常处理', // 功能模块名称
  props: {
    resid: 599061859652,
    actionBarWidth: 200,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasAdd: true,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642868834485] = {
  name: 'TableData', // 组件名称，
  title: '考勤补结算', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 435408076402,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    actionBarFixed:false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854616358] = {
  name: 'TableData', // 组件名称，
  title: '离职结算表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 435842967084,
    actionBarWidth: 200,
    hasAdd: true,
    addText:'添加离职人员',
    modifyText:'修改离职日期',
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854648916] = {
  name: 'TableData', // 组件名称，
  title: '月度结算表', // 功能模块名称
  props: {
    resid: 431886989798,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854660698] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '考勤日报处理', // 功能模块名称
  props: {
    resid: 424363791882,
    mainTableProps: {
      actionBarWidth: 200,
      // baseURL: 'http://ngrok5.realsun.me:6060/',
      baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      hasAdd: false,
      hasBeBtns: true,
      hasModify: false,
      hasBackBtn: true,
      hasDelete: false,
      hasRowModify: false,
      hasRowView: false,
      hasRowSelection:true,
      hasRowDelete: false,
      isUseFormDefine: false,
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      423574450430: {
        hasBeBtns: true,
        baseURL: 'http://ngrok5.realsun.me:6060/',
        downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      423664972378: {
        hasBeBtns: true,
        baseURL: 'http://ngrok5.realsun.me:6060/',
        downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      382917623098: {
        hasBeBtns: true,
        baseURL: 'http://ngrok5.realsun.me:6060/',
        downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      423662411106: {
        hasBeBtns: true,
        baseURL: 'http://ngrok5.realsun.me:6060/',
        downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      425248261392: {
        hasBeBtns: true,
        baseURL: 'http://ngrok5.realsun.me:6060/',
        downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      425173186017: {
        hasBeBtns: true,
        baseURL: 'http://ngrok5.realsun.me:6060/',
        downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      426438255597: {
        hasBeBtns: true,
        baseURL: 'http://ngrok5.realsun.me:6060/',
        downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[642854669532] = {
  name: 'TableData', // 组件名称，
  title: '薪资结算名单', // 功能模块名称
  props: {
    resid: 429954752986,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854678648] = {
  name: 'TableData', // 组件名称，
  title: '薪资补充名单', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 458996839834,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854689917] = {
  name: 'TableData', // 组件名称，
  title: '离职不结算名单', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 445799437011,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEdit: true,
    hasRowEditAdd: true,
    isUseFormDefine: false,
    actionBarFixed: false,
    // isSetColumnWidth:false,
    // noWidthFields:"C3_445799498673",
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854704644] = {
  name: 'TableData', // 组件名称，
  title: '班组调整记录查询', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 423660730564,
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
    subtractH: 200
  }
};
window[642854723134] = {
  name: 'TableData', // 组件名称，
  title: '刷卡明细记录查询', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 423660885541,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: false,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854733765] = {
  name: 'TableData', // 组件名称，
  title: '请假登记记录查询', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 425274222825,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854743729] = {
  name: 'TableData', // 组件名称，
  title: '加班登记记录查询', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 425274253986,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854754543] = {
  name: 'TableData', // 组件名称，
  title: '请假导入错误记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 432648732840,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    isUseFormDefine: false,
    hasRowDelete: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854868542] = {
  name: 'TableData', // 组件名称，
  title: '请假登记导入错误记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 425603753670,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: false,
    isUseFormDefine: false,
    hasRowDelete: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854784459] = {
  name: 'TableData', // 组件名称，
  title: '加班记录导入错误', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 432648481019,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    isUseFormDefine: false,
    hasRowView: true,
    hasRowDelete: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854766667] = {
  name: 'TableData', // 组件名称，
  title: '刷卡导入错误查询', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 429706598519,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    isUseFormDefine: false,
    hasRowDelete: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854803335] = {
  name: 'TableData', // 组件名称，
  title: '请假登记异常明细', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 431960259688,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    isUseFormDefine: false,
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    hasRowModify: false,
    hasRowView: false,
    hasRowDelete: false,
    actionBarFixed:false,
    hasRowSelection:true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854814341] = {
  name: 'TableData', // 组件名称，
  title: '考勤异常日报明细', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 431956725893,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    isUseFormDefine: false,
    hasRowModify: false,
    hasRowView: false,
    hasRowDelete: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854826219] = {
  name: 'TableData', // 组件名称，
  title: '加班请假登记记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 509634460766,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    isUseFormDefine: false,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
// window[642865344500] = {
//   name: 'TableData', // 组件名称，
//   title: '刷卡记录', // 功能模块名称
//   props: {
//     baseURL: 'http://ngrok5.realsun.me:6060/',
//     downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
//     resid: 375296681546,
//     actionBarWidth: 200,
//     hasAdd: true,
//     hasBeBtns: true,
//     hasModify: true,
//     hasBackBtn: true,
//     hasDelete: true,
//     hasRowModify: true,
//     hasRowView: true,
//     hasRowDelete: true,
//     isUseFormDefine:false,
//     isSetColumnWidth:false,
//     formProps: {
//       // height: 500
//     },
//     subtractH: 200
//   }
// };
window[642854845983] = {
  name: 'TableData', // 组件名称，
  title: '刷卡登记', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 382917623098,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    addText:"刷卡登记",
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854858872] = {
  name: 'TableData', // 组件名称，
  title: '请假登记', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 423662411106,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

window[642854885216] = {
  name: 'TableData', // 组件名称，
  title: '加班登记', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 425248261392,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,

    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642854896162] = {
  name: 'TableData', // 组件名称，
  title: '加班未确认', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 430310411405,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642865689790] = {
  name: 'TableData', // 组件名称，
  title: '加班登记导入错误记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 429707656053,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854917620] = {
  name: 'TableData', // 组件名称，
  title: '加班导入记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 432051276159,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642854999190] = {
  name: 'TableData', // 组件名称，
  title: '班组调整', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 423574450430,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865743568] = {
  name: 'TableData', // 组件名称，
  title: '班组调整导入错误记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 429708025503,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642855062753] = {
  name: 'TableData', // 组件名称，
  title: '班次调整', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 423664972378,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    deleteText:'作废删除',
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865760883] = {
  name: 'TableData', // 组件名称，
  title: '班次调整导入错误记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 429708037784,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642855075847] = {
  name: 'TableData', // 组件名称，
  title: '加班补贴导入', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 437046073629,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    // isUseFormDefine: false,
    isSetColumnWidth:false,
    // noWidthFields: "C3_437046231179",
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642855085886] = {
  name: 'TableData', // 组件名称，
  title: '每月基数导入', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 427541771982,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    noWidthFields:"C3_427541796327",
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642855095782] = {
  name: 'TableData', // 组件名称，
  title: '审批请假加班记录查询', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 450887249266,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642855105931] = {
  name: 'TableData', // 组件名称，
  title: '移动请假加班记录', // 功能模块名称
  props: {
    resid: 546778189544,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642855115194] = {
  name: 'TableData', // 组件名称，
  title: '已撤销移动请假加班记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 563450902742,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642868538751] = {
  name: 'TableData', // 组件名称，
  title: '请假加班审批记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 549048498204,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    // isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642855166893] = {
  name: 'TableData', // 组件名称，
  title: '考勤事项审批设置', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 449351877765,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642855176494] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '考勤审批流程信息', // 功能模块名称
  props: {
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
      backendButtonPopConfirmProps:{ placement: 'bottom' },
      baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      449439564546: {
        hasBeBtns: false,
        isUseFormDefine:false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      449441441589: {
        hasBeBtns: true,
        hasRowView:false,
        hasRowModify:false,
        hasRowDelete:false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[642855189869] = {
  name: 'TableData', // 组件名称，
  title: '考勤事项审批流', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 448999733055,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine:false,
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642855262376] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '待审核招聘需求', // 功能模块名称
  props: {
    resid: 518463420928,
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
      isUseFormDefine: false,
      baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      advSearch:{
      formName:'defaultSearch'
    },
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      518464309741: {
        hasBeBtns: true,
        hasRowDelete: false,
        isSetColumnWidth:false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[642855273462] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '已审核招聘需求', // 功能模块名称
  props: {
    resid: 519213761827,
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
      isUseFormDefine: false,
      baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      advSearch:{
        formName:'defaultSearch'
      },
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      518464309741: {
        hasBeBtns: true,
        hasRowDelete: false,
        isSetColumnWidth:false,

        baseURL: 'http://ngrok5.realsun.me:6060/',
        downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[642855707652] = {
  name: 'TableData', // 组件名称，
  title: '已拒绝招聘需求', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 518448231083,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: false,
    hasRowDelete: false,
    isUseFormDefine: false,
    advSearch:{
      formName:'defaultSearch'
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642855719230] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '招聘需求管理', // 功能模块名称
  props: {
    
    resid: 518447767466,
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
      baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      522692921247: {
        hasBeBtns: true,
        isSetColumnWidth:false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      518461643267: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[642855734719] = {
  name: 'TableData', // 组件名称，
  title: '需总部审批', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 578151493683,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    advSearch:{
      formName:'defaultSearch'
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642855746711] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '待录用员工工资审批', // 功能模块名称
  props: {
    resid: 621522035695,
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
      isUseFormDefine:false,
      baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      advSearch:{
      formName:'defaultSearch'
      },
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      621522106327: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[642855760886] = {
  name: 'TableData', // 组件名称，
  title: '待录用员工薪资信息表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 621522106327,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    advSearch:{
      formName:'defaultSearch'
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642855770350] = {
  name: 'TableData', // 组件名称，
  title: '我的招聘申请', // 功能模块名称
  props: {
    baseURL: 'http://ngrok4.realsun.me:6060',
    downloadBaseURL: 'http://ngrok9.realsun.me:6060/',
    resid: 518460953577,
    actionBarWidth: 300,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    recordFormUseAbsolute:true,
    isUseFormDefine:false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
      width:1250
    },
    subtractH: 200
  }
};
window[642855780253] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables',
  title: '我的招聘审批', // 功能模块名称
  props: {
    resid: 518442541615,
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
      isUseFormDefine:false,
      // isSetColumnWidth:false,
      baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      advSearch:{
        formName:'defaultSearch'
      },
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      518461643267: {
        hasBeBtns: true,
        hasRowModify: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};

window[644083949537] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables',
  title: 'S1S2生产人员招聘', // 功能模块名称
  props: {
    resid: 527959305537,
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
      isUseFormDefine: false,
      isSetColumnWidth:false,
      baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    advSearch:{
      formName:'defaultSearch'
    },
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      518986543520: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      527715777875: {
        isUseFormDefine: false,
        hasBeBtns: true,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[642856303619] = {
  name: 'TableData', // 组件名称，
  title: '员工年度授予计划', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 561553433582,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856315965] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '财年授予定义', // 功能模块名称
  props: {
    resid: 561571034816,
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
      isUseFormDefine: false,
      baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isSetColumnWidth:false,
      formProps: {
        // height: 500
      },
      advSearch:{
        isRequestFormData:false,
      },
      subtractH: 200
    },
    subTablesProps: {
      561550682069: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      561550544816: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      568398863279: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[642856328223] = {
  name: 'TableData', // 组件名称，
  title: '员工年度授予名单', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 561571598834,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642856338095] = {
  name: 'TableData', // 组件名称，
  title: '员工年度授予HR审核', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 561571827662,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856348581] = {
  name: 'TableData', // 组件名称，
  title: '员工年度授予部门调整', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 561571882590,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    isUseFormDefine: false,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856357054] = {
  name: 'TableData', // 组件名称，
  title: '员工年度授予导出', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 561572171961,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856366737] = {
  name: 'TableData', // 组件名称，
  title: '个人查看授予明细', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 567704019233,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856395014] = {
  name: 'TableData', // 组件名称，
  title: '月度薪资明细', // 功能模块名称
  props: {
    resid: 438956460750,
    actionBarWidth: 400,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642856420818] = {
  name: 'TableData', // 组件名称，
  title: '薪资年假', // 功能模块名称
  props: {
    resid: 498754836060,
    actionBarWidth: 200,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642856432739] = {
  name: 'TableData', // 组件名称，
  title: '新员工薪资', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 622312148402,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856442104] = {
  name: 'TableData', // 组件名称，
  title: '实习生工资明细', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 466074745928,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642856451989] = {
  name: 'TableData', // 组件名称，
  title: '经济补偿金', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 466092254274,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856463210] = {
  name: 'TableData', // 组件名称，
  title: '研发人员薪资导出', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 580490764050,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642856472970] = {
  name: 'TableData', // 组件名称，
  title: 'IDL薪资明细', // 功能模块名称
  props: {
    resid: 631650286919,
    actionBarWidth: 200,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642856600971] = {
  name: 'TableData', // 组件名称，
  title: 'DL月度工资明细', // 功能模块名称
  props: {
    resid: 631650245633,
    actionBarWidth: 200,
    hasAdd: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642856612138] = {
  name: 'TableData', // 组件名称，
  title: '生产人员基本工资', // 功能模块名称
  props: {
    resid: 469639002606,
    actionBarWidth: 200,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',

    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856627631] = {
  name: 'TableData', // 组件名称，
  title: 'DL工资审核附件', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 639652386422,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642856644144] = {
  name: 'TableData', // 组件名称，
  title: 'DL工资审批记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 631911796331,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isSetColumnWidth:false,
    isUseFormDefine:false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856652519] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: 'DL工资审核', // 功能模块名称
  props: {
    resid: 631902827113,
    mainTableProps: {
      actionBarWidth: 250,
      hasAdd: true,
      hasBeBtns: true,
      hasModify: true,
      hasBackBtn: true,
      hasDelete: true,
      hasRowModify: true,
      hasRowView: true,
      hasRowDelete: true,
      addText: '新建审核',
      baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      isSetColumnWidth:false,
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      631908306906: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908278263: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
        downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908322536: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908332741: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908345599: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908357382: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908368002: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',

      },
      631908380066: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908391826: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908402889: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908414849: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,

      },
      631908468437: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908487343: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908500686: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908512015: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908524164: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908535350: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908546056: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908556110: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908578110: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908587861: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908598349: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908607040: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908616827: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908628445: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908639692: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908648936: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908660368: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631908672225: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      631909905356: {
        hasAdd: false,
        hasBeBtns: true,
        hasModify: false,
        hasBackBtn: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[642856661616] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '工资审核', // 功能模块名称
  props: {
    resid: 483136878846,
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
      addText: '新建审核',
      baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      526569913543: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      528384647857: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      483143248907: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      483143269379: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      483143292739: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      483143313607: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      490441845783: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      490441985369: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      490442033277: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      490442082614: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      490442208450: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      490442251347: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      490442311854: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      490442351603: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      490442367584: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      490442379053: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      490442394231: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      490442407188: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533377990246: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533378160861: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533378175759: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533378198800: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533378212840: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533378238689: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533378256722: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533378269639: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533378289607: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533378309262: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533378346468: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533378368276: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533378381536: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533378397713: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      533378418165: {
        hasBeBtns: true,
        isUseFormDefine: false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[642856673827] = {
  name: 'TableData', // 组件名称，
  title: '工资差异明细', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 483137369847,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856682732] = {
  name: 'TableData', // 组件名称，
  title: '工资审批记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 528384647857,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642856691841] = {
  name: 'TableData', // 组件名称，
  title: '工资审核附件', // 功能模块名称
  props: {
    resid: 526569913543,
    actionBarWidth: 200,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642856702868] = {
  name: 'TableData', // 组件名称，
  title: '上海十三薪明细', // 功能模块名称
  props: {
    resid: 537450483861,
    actionBarWidth: 200,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856714810] = {
  name: 'TableData', // 组件名称，
  title: '无锡十三薪明细', // 功能模块名称
  props: {
    resid: 537450500319,
    actionBarWidth: 200,
    hasAdd: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',

    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856723891] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '十三薪审批', // 功能模块名称
  props: {
    resid: 537461583719,
    mainTableProps: {
      actionBarWidth: 300,
      hasAdd: true,
      hasBeBtns: true,
      hasModify: true,
      hasBackBtn: true,
      hasDelete: true,
      hasRowModify: true,
      hasRowView: true,
      isUseFormDefine: false,
      hasRowDelete: true,
      isSetColumnWidth: true,
      baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      isSetColumnWidth:false,
      formProps: {
        // height: 500
      },
      advSearch:{
        isRequestFormData:false,
      },
      subtractH: 200
    },
    subTablesProps: {
      537453474424: {
        hasBeBtns: true,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      438607023678: {
        hasBeBtns: true,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[642856733155] = {
  name: 'TableData', // 组件名称，
  title: '十三薪审批记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 537453474424,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856745730] = {
  name: 'TableData', // 组件名称，
  title: '个税税率表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 244152029750,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856753982] = {
  name: 'TableData', // 组件名称，
  title: '个税基数表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 244152488375,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856763791] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '保险基数表', // 功能模块名称
  props: {
    resid: 244154194921,
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
      baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      244153076250: {
        hasBeBtns: true,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      },
      433706772782: {
        hasBeBtns: true,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[642856772119] = {
  name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '保险比例表', // 功能模块名称
  props: {
    resid: 244153076250,
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
      baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      433706772782: {
        hasBeBtns: true,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[642856782319] = {
  name: 'TableData', // 组件名称，
  title: '社保类型', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 294361971375,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856799479] = {
  name: 'TableData', // 组件名称，
  title: '劳务公司名单', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 418249909821,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856807541] = {
  name: 'TableData', // 组件名称，
  title: '病假扣款比例', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 433711303327,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856817466] = {
  name: 'TableData', // 组件名称，
  title: '社保关系', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 438600204340,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642856836829] = {
  name: 'TableData', // 组件名称，
  title: '生成工资分配表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 441282320318,
    actionBarWidth: 400,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEdit: true,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642856846560] = {
  name: 'TableData', // 组件名称，
  title: '生成工资财务分录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 476546200533,
    actionBarWidth: 180,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858017774] = {
  name: 'TableData', // 组件名称，
  title: '公司工资分配表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 441207245544,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    isUseFormDefine: false,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858195015] = {
  name: 'TableData', // 组件名称，
  title: '外包分配表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 527159436080,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858209225] = {
  name: 'TableData', // 组件名称，
  title: '非外包人员分配表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 527188258798,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858219205] = {
  name: 'TableData', // 组件名称，
  title: 'DL非外包分配表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 632588177275,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858230550] = {
  name: 'TableData', // 组件名称，
  title: '工作地工资分配表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 441210406417,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858239772] = {
  name: 'TableData', // 组件名称，
  title: '派遣公司工资分配表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 441290388300,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858250217] = {
  name: 'TableData', // 组件名称，
  title: '外包分配表-柏合', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 641211714413,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858265046] = {
  name: 'TableData', // 组件名称，
  title: 'Oracel模块', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 558633802683,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858275747] = {
  name: 'TableData', // 组件名称，
  title: '研发人员月度信息维护', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 548773045652,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858287535] = {
  name: 'TableData', // 组件名称，
  title: '月度工时比例分配', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 556830749419,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[643038878833] = {
  name: 'TableData', // 组件名称，
  title: '项目代码管理', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 548773450921,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858302008] = {
  name: 'TableData', // 组件名称，
  title: '研发人员生成工资分配表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 548774841771,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

window[642858311245] = {
  name: 'TableData', // 组件名称，
  title: '研发人员工资分配', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 549312161483,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858321470] = {
  name: 'TableData', // 组件名称，
  title: '研发工作地工资分配', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 549315073634,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858331244] = {
  name: 'TableData', // 组件名称，
  title: '研发人员工资凭证明细', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 549315898894,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858341571] = {
  name: 'TableData', // 组件名称，
  title: '工时分配明细', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 551380257255,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858355008] = {
  name: 'TableData', // 组件名称，
  title: '工时分配汇总表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 553432350418,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

window[642858364531] = {
  name: 'TableData', // 组件名称，
  title: '生成研发财务分录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 549316940861,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858381832] = {
  name: 'TableData', // 组件名称，
  title: '研发人员清单', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 556627948068,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858651331] = {
  // name: 'TableData', // 组件名称，
  name: 'MainTableSubTables', // 组件名称，
  title: '个人财年评估表', // 功能模块名称
  props: {
    resid: 467806334724,
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
      isUseFormDefine: false,
      baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      formProps: {
        // height: 500
      },
      advSearch:{
        isRequestFormData:false,
      },
      subtractH: 200
    },
    subTableProps: {
      421696601858: {
        hasBeBtns: true,
        baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[642858661984] = {
  name: 'TableData', // 组件名称，
  title: '绩效评估财年定义', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    isUseFormDefine: false,
    resid: 420161931474,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642858671562] = {
  name: 'TableData', // 组件名称，
  title: '评价选项', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 420151178050,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858680954] = {
  name: 'TableData', // 组件名称，
  title: '不参评人员', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 464112827627,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642858691148] = {
  name: 'TableData', // 组件名称，
  title: '当前参评人员', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 426074830919,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642858700263] = {
  name: 'TableData', // 组件名称，
  title: '部门评级评优设置', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 434932652492,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    isWrap:true,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642858711892] = {
  name: 'TableData', // 组件名称，
  title: '下属评级评优设置', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 442065444190,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642858815692] = {
  name: 'TableData', // 组件名称，
  title: '绩效历史记录查看', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 564509985230,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    isUseFormDefine: false,
    hasRowDelete: false,

    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642858825314] = {
  name: 'TableData', // 组件名称，
  title: '未提交人员', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 612897333692,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    isUseFormDefine: false,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    advSearch:{
      isRequestFormData:false,
    },
    subtractH: 200
  }
};
window[642864859197] = {
  name: 'TableData', // 组件名称，
  title: '我的安装申请', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 531400067855,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    addText:'新建申请',
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642864873312] = {
  name: 'TableData', // 组件名称，
  title: '安装申请-部门总监审批', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 531400837731,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: false,
    hasDelete: false,
    hasRowModify: false,
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    hasRowView: true,
    hasRowDelete: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642864883370] = {
  name: 'TableData', // 组件名称，
  title: '安装申请-部门经理审批', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 531400430406,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642864894557] = {
  name: 'TableData', // 组件名称，
  title: '预算负责人审批', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 547116884120,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: true,
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    hasRowView: true,
    hasRowDelete: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642864905946] = {
  name: 'TableData', // 组件名称，
  title: '安装情况记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 531401843164,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: false,
    isWrap:true,
    hasRowDelete: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642864915093] = {
  name: 'TableData', // 组件名称，
  title: '安装成功的申请单', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 547133324903,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: false,
    hasRowDelete: false,
    isUseFormDefine: false,
    isWrap:true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642864924530] = {
  name: 'TableData', // 组件名称，
  title: '已经撤销的申请单', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 547133469814,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: false,
    hasRowDelete: false,
    isUseFormDefine: false,
    isWrap:true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642864936700] = {
  name: 'TableData', // 组件名称，
  title: '已拒绝记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 606994091322,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    isWrap:true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642864955816] = {
  name: 'TableData', // 组件名称，
  title: '我的门禁开通申请', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 498060017391,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    hasRowEdit: true,
    hasRowEditAdd: true,
    isUseFormDefine: false,
    advSearch:{
      formName:'defaultSearch'
    },
    // actionBarFixed:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642864965745] = {
  name: 'TableData', // 组件名称，
  title: '审批下属门禁权限', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 498068110441,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    isSetColumnWidth:false,
    advSearch:{
      formName:'defaultSearch'
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865093743] = {
  name: 'TableData', // 组件名称，
  title: '审批管辖门禁权限', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 498068191125,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    advSearch:{
      formName:'defaultSearch'
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865104085] = {
  name: 'TableData', // 组件名称，
  title: '替他人申请门禁', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 498749604658,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    advSearch:{
      formName:'defaultSearch'
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865117751] = {
  name: 'TableData', // 组件名称，
  title: '删除下属门禁授权', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 506167643900,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isSetColumnWidth:false,
    advSearch:{
      formName:'defaultSearch'
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865127153] = {
  name: 'TableData', // 组件名称，
  title: '门禁开通记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 518632114918,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    isUseFormDefine: false,
    actionBarFixed: false,
    advSearch:{
      formName:'defaultSearch'
    },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865138428] = {
  name: 'TableData', // 组件名称，
  title: '管理员邮件通知', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 596552265142,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865148916] = {
  name: 'TableData', // 组件名称，
  title: '门禁权限月度名单', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 595166508878,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: false,
    hasRowDelete: false,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865159694] = {
  name: 'TableData', // 组件名称，
  title: '当月门禁清单', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 629221162564,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865168807] = {
  name: 'TableData', // 组件名称，
  title: '有误数据', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 596649621922,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865180079] = {
  name: 'TableData', // 组件名称，
  title: '确认无误数据', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 596649568623,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865189736] = {
  name: 'TableData', // 组件名称，
  title: '大厅门禁权限名单', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 601988366281,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865230273] = {
  name: 'TableData', // 组件名称，
  title: '办卡信息', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 301050266340,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865241049] = {
  name: 'TableData', // 组件名称，
  title: '设备信息', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 412431312761,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[646235959397] = {
  name: 'TableData', // 组件名称，
  title: '设备记录', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 412433149535,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865251509] = {
  name: 'TableData', // 组件名称，
  title: '外包人员办卡信息', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 542290371363,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865263466] = {
  name: 'TableData', // 组件名称，
  title: '外包人员清单', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 542286020945,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865468370] = {
  name: 'TableData', // 组件名称，
  title: '办公用品待确认', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 506183042085,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865477980] = {
  name: 'TableData', // 组件名称，
  title: '办公用品待发货', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 506183134562,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865487428] = {
  name: 'TableData', // 组件名称，
  title: '办公用品已完成', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 506183209943,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    hasDelete: false,
    hasRowModify: false,
    hasRowView: false,
    hasRowDelete: false,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865500060] = {
  name: 'TableData', // 组件名称，
  title: '员工乘坐班车信息维护', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 526474795022,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865508238] = {
  name: 'TableData', // 组件名称，
  title: '班车线路维护', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 526472168103,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865517021] = {
  name: 'TableData', // 组件名称，
  title: '员工排班', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 552594305731,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865529507] = {
  name: 'TableData', // 组件名称，
  title: '班次餐别维护', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 549653997867,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865539047] = {
  name: 'TableData', // 组件名称，
  title: '班车报餐数据维护清单', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 557491342865,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    isUseFormDefine: false,
    hasRowDelete: true,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[642865548263] = {
  name: 'TableData', // 组件名称，
  title: '餐别信息', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 549653969241,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    isUseFormDefine: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

window[642854837350] = {
  name: 'TableData', // 组件名称，
  title: '刷卡记录', // 功能模块名称
  props: {
    resid: 375296681546,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    // isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

window[642854549263] = {
  name: 'TableData', // 组件名称，
  title: '结算汇总表', // 功能模块名称
  props: {
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    resid: 426597421978,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    recordFormContainerProps: {
      width:'100vw'
    },
    subTableArrProps: [
      {
        subTableName: '考勤日报',
        subResid: 375296167687,
        tableProps: {
          height: 560,
          baseURL: 'http://ngrok5.realsun.me:6060/',
          actionBarWidth: 200,
          isUseFormDefine:false,
          subtractH: 170
        }
      }
    ],
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

window[640366579330] = {
  name: 'TableData', // 组件名称，
  title: 'Headcount申请', // 功能模块名称
  props: {
    resid: 518460953577,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',

    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

window[644335881606] = {
  name: 'TableData', // 组件名称，
  title: '财务IE日报汇总', // 功能模块名称
  props: {
    resid: 434745561835,
    actionBarWidth: 200,
    hasAdd: true,
    addText: '浏览报表',
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    isSetColumnWidth:false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

window[644327624410] = {
  name: 'TableData', // 组件名称，
  title: '公司选项', // 功能模块名称
  props: {
    resid: 375291923250,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: true,
    hasRowModify: true,
    hasRowEdit: true,
    actionBarFixed: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    hasRowEditAdd: true,
    isSetColumnWidth:true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

window[645027658426] = {
  name: 'TableData', // 组件名称，
  title: '个人办公用品申请', // 功能模块名称
  props: {
    resid: 506094320832,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok5.realsun.me:6060/',
    hasDelete: true,
    hasRowModify: true,
    hasRowEdit: true,
    actionBarFixed: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    advSearch:{
      isUseTableFields: true,
    },
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    hasRowEditAdd: true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

window[643895586124] = {
  name: 'OnlineTrainingManager', // 组件名称，
  title: '在线培训管理', // 功能模块名称
  props: {}
};

window[642858572880] = {
  name: 'MyAssessmentTable', // 组件名称，
  title: '我的评估表', // 功能模块名称
  props: {}
};

window[642858605607] = {
  name: 'DirectlyUnderTarget', // 组件名称，
  title: '直属目标管理', // 功能模块名称
  props: {
    residConfig: {
      财年: 436471186474,
      待核准目标: 420981341000,
      目标核准栏: 420981134612,
      可调整目标: 421244328300,
      目标调整栏: 421248567987,
      目标历史记录栏: 421260296132,
      直属面谈记录: 463156196758,
      面谈记录: 463159325562,
      绩效反馈: 558112361032
    }
  }
};
window[642858615601] = {
  name: 'EvaluateManage', // 组件名称，
  title: '评价管理', // 功能模块名称
  props: {
    gradeAppraisingConfig: {
      resid: 645010935966,
      replaceBaseUrl: 'http://ngrok9.realsun.me:6060',
      baseURL: 'http://ngrok14.realsun.me:6060/'
    },
    residConfig: {
      年中目标: 462637854501,
      年末目标: 462643948869
    }
  }
};
window[644526445002] = {
  name: 'WeeklySettlement', // 组件名称，
  title: '周结算', // 功能模块名称
  props: {}
};
window[642858626812] = {
  name: 'SubordinateAchievements', // 组件名称，
  title: '查看下属绩效', // 功能模块名称
  props: {
    residConfig: {
      财年评级评优: 463239758862,
      人事汇报关系: 639856535460
    }
  }
};
window[642858635809] = {
  name: 'AchievementResult', // 组件名称，
  title: '绩效结果', // 功能模块名称
  props: {}
};
window[645287046055] = {
  name: 'AchievementsGradeAppraising', // 组件名称，
  title: '绩效评级评优', // 功能模块名称
  props: {
    tableDataBaseURL:'http://ngrok4.realsun.me:6060/',
    mangerConfig: {
      '12345': {
        //总经理
        id: 12345,
        tableDataResid: 596626311953,
        iframeResid: 645286591505,
        replaceBaseUrl: 'http://ngrok9.realsun.me:6060',
        baseURL: 'http://ngrok5.realsun.me:6060/',
        downloadBaseURL:'http://ngrok9.realsun.me:6060/',
      },
      '169': {
        //总监
        id: 169,
        tableDataResid: 596626341706,
        iframeResid: 645288462780,
        replaceBaseUrl: 'http://ngrok9.realsun.me:6060',
        baseURL: 'http://ngrok5.realsun.me:6060/',
        downloadBaseURL:'http://ngrok9.realsun.me:6060/'
      }
    }
  }
};



window[645649238968] = {
  name: 'TableData', // 组件名称，
  title: '办卡信息导入', // 功能模块名称
  props: {
    resid: 424793046971,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

window[647005159900] = {
  name: 'TableData', // 组件名称，
  title: '考勤-病假扣款比例', // 功能模块名称
  props: {
    resid: 456246260727,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    noWidthFields:'C3_456246283759',
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[647005183171] = {
  name: 'TableData', // 组件名称，
  title: '考勤-请假扣款比例', // 功能模块名称
  props: {
    resid: 456246896370,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    noWidthFields:'C3_456246934372',
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[647005199463] = {
  name: 'TableData', // 组件名称，
  title: '考勤可查阅期间', // 功能模块名称
  props: {
    resid: 447426327525,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[647005213957] = {
  name: 'TableData', // 组件名称，
  title: '薪资可查阅期间', // 功能模块名称
  props: {
    resid: 447426493342,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[647005261709] = {
  name: 'TableData', // 组件名称，
  title: '考勤数据分类锁定', // 功能模块名称
  props: {
    resid: 433505169761,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    isWrap:true,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[647005277545] = {
  name: 'TableData', // 组件名称，
  title: '用户组锁定级别', // 功能模块名称
  props: {
    resid: 432206096450,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    noWidthFields:'C3_432206151289',
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[647005294257] = {
  name: 'TableData', // 组件名称，
  title: '考勤月度结算表锁定', // 功能模块名称
  props: {
    resid: 469045084192,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};

window[647005579815] = {
  name: 'TableData', // 组件名称，
  title: '公出B日报表', // 功能模块名称
  props: {
    resid: 432126463288,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: false,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[647005627465] = {
  name: 'TableData', // 组件名称，
  title: '考勤人员名单', // 功能模块名称
  props: {
    resid: 448558617432,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: false,
    hasRowModify: false,
    hasRowView: false,
    hasRowDelete: false,
    isUseFormDefine: false,
    backendButtonPopConfirmProps:{ placement: 'bottom' },
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[647005644256] = {
  name: 'TableData', // 组件名称，
  title: '月度人员名单', // 功能模块名称
  props: {
    resid: 447620057756,
    actionBarWidth: 200,
    hasAdd: false,
    hasBeBtns: true,
    hasModify: false,
    hasBackBtn: false,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: false,
    hasRowModify: false,
    hasRowView: false,
    hasRowDelete: false,
    isUseFormDefine: false,
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[647005664728] = {
  name: 'TableData', // 组件名称，
  title: '补充当月结算名单', // 功能模块名称
  props: {
    resid: 448453101928,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    noWidthFields:"C3_448453177684",
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[647005696097] = {
  name: 'TableData', // 组件名称，
  title: '加班申请额度个人控制', // 功能模块名称
  props: {
    resid: 472822081438,
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    baseURL: 'http://ngrok5.realsun.me:6060/',
    downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
    hasDelete: true,
    hasRowModify: false,
    hasRowView: true,
    hasRowDelete: false,
    isUseFormDefine: false,
    hasRowEdit: true,
    hasRowEditAdd: true,
    actionBarFixed: false,
    noWidthFields:"C3_472822127334",
    formProps: {
      // height: 500
    },
    subtractH: 200
  }
};
window[647005718255] = {
  name: 'MainTableSubTables', // 组件名称，
  title: 'HR专员请假审批', // 功能模块名称
  props: {
    resid: 513784214608,
    mainTableProps: {
      actionBarWidth: 300,
      hasAdd: true,
      hasBeBtns: true,
      hasModify: true,
      hasBackBtn: true,
      hasDelete: true,
      hasRowModify: true,
      hasRowView: true,
      hasRowDelete: true,
      isUseFormDefine:false,
      baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      446915608629: {
        hasBeBtns: true,
        isUseFormDefine:false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
        downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[647005738876] = {
  name: 'MainTableSubTables', // 组件名称，
  title: 'HR专员请假已审批', // 功能模块名称
  props: {
    resid: 516107915085,
    mainTableProps: {
      actionBarWidth: 300,
      hasAdd: true,
      hasBeBtns: true,
      hasModify: true,
      hasBackBtn: true,
      hasDelete: true,
      hasRowModify: true,
      hasRowView: true,
      hasRowDelete: true,
      isUseFormDefine:false,
      baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      formProps: {
        // height: 500
      },
      subtractH: 200
    },
    subTablesProps: {
      446915608629: {
        hasBeBtns: true,
        isUseFormDefine:false,
        baseURL: 'http://ngrok5.realsun.me:6060/',
        downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      }
    }
  }
};
window[647005761923] = {
  name: 'TableData', // 组件名称，
  title: 'HR专员已拒绝审批', // 功能模块名称
  props: {
    resid: 521636906178,
      actionBarWidth: 300,
      hasAdd: false,
      hasBeBtns: false,
      hasModify: false,
      hasBackBtn: false,
      hasDelete: false,
      hasRowModify: false,
      hasRowView: false,
      hasRowDelete: false,
      isWrap:true,
      baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      formProps: {
        // height: 500
      },
      subtractH: 200
  }
};
window[647005790386] = {
  name: 'TableData', // 组件名称，
  title: '部门平均工资', // 功能模块名称
  props: {
    resid: 534182415597,
      actionBarWidth: 300,
      hasAdd: true,
      hasBeBtns: true,
      hasModify: true,
      hasBackBtn: true,
      hasDelete: true,
      hasRowModify: true,
      hasRowView: true,
      hasRowDelete: true,
      baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      isWrap:true,
      isUseFormDefine:false,
      formProps: {
        // height: 500
      },
      subtractH: 200
  }
};
window[647005829686] = {
  name: 'TableData', // 组件名称，
  title: '薪资结构', // 功能模块名称
  props: {
    resid: 534182253486,
      actionBarWidth: 300,
      hasAdd: true,
      hasBeBtns: true,
      hasModify: true,
      hasBackBtn: true,
      hasDelete: true,
      hasRowModify: true,
      hasRowView: true,
      hasRowDelete: true,
      isUseFormDefine:false,
      noWidthFields:"C3_534182272208",
      baseURL: 'http://ngrok5.realsun.me:6060/',
      downloadBaseURL: 'http://ngrok10.realsun.me:6060/',
      formProps: {
        // height: 500
      },
      subtractH: 200
  }
};

window[646330411706] = {
  name: 'PersonnelImport',
  title:'人事信息批量导入',
  props:{

  }
}