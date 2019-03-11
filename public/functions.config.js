// 组织架构
window[594905218521] = {
  name: 'OrgChartData',
  title: '组织架构',
  props: {
    resid: 602348115218,
    template: 'rony',
    chartId: 'org-chart',
    chartWrapId: 'org-chart-wrap',
    level: 3,
    isExpandAllChildren: true,
    pidField: 'C3_602347244770',
    idField: 'C3_602347243263',
    enableDragDrop: true,
    showFields: {
      field_0: 'C3_602347243459',
      field_1: 'C3_602347246317',
      field_2: 'C3_602347244217',
      field_3: 'C3_602416916077',
      field_4: 'C3_602417234378',
      img_0: 'C3_602350177952'
    },
    recordFormContainerProps: { width: 500 },
    rootIds: [61, 67],
    rootIdsResid: 602348168470,
    groupingConfig: [
      {
        resourceOfTag: '602364331868',
        sourceColumnOfGroupName: 'C3_602416511957',
        sourceColumnOfTagName: 'C3_602358186916',
        columnOfTagName: 'C3_602347242284',
        isGroupTag: true,
        cmswhere: ''
      }
    ],
    keyField: 'C3_602347243459'
  }
};

/**
 * 考勤管理
 */

// 班组调整
window[592755014348] = {
  title: '班组调整',
  name: 'LzTable',
  props: {
    tableTitle: '班组调整',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    addBtn: true,
    resid: 592739481145,
    opIsFixed: true,
    hasDownloadExcel: true,
    isSortBE: true,
    pagination: {
      pageSize: 10, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      del: true
    },
    customColumnWidth: {
      人员编号: 120,
      人员工号: 120,
      人员姓名: 120,
      部门名称: 250,
      考勤年月: 100
    },
    isSearch: true,
    hasRefresh: true,
    cFFillFormInnerFieldNames: ['YGNO'],
    advSearchConfig: {
      containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: '24%', // label 宽度
      rowWidth: '100%', // row 宽度
      search: [
        // search
        {
          title: '工号/姓名',
          innerFieldNames: ['YGNO', 'NAMES']
        },
        {
          title: '班组名称',
          innerFieldNames: ['DAOBAN_NAME']
        },
        {
          title: '所属部门',
          innerFieldNames: ['C3_593025381592']
        }
      ],
      dateRanges: [
        {
          title: '开始日期',
          innerFieldName: 'STARTDATE',
          visible: [false, false, false, false]
        }
      ]
    },
    productComponents: [
      {
        iconClass: 'icon-add',
        componentInfo: {
          name: 'LzStepsCTS',
          props: {
            resid: 592739481145
          }
        }
      }
    ]
  }
};

// 请假登记
window[592757927037] = {
  title: '请假登记',
  name: 'LzTable',
  props: {
    tableTitle: '请假登记',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    addBtn: true,
    resid: 592744962876,
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
      登记小时限额: 150
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

// 加班登记
window[592759803717] = {
  title: '加班登记',
  name: 'LzTable',
  props: {
    tableTitle: '加班登记',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    addBtn: true,
    resid: 592759743053,
    opIsFixed: true,
    hasDownloadExcel: true,
    isSortBE: true,
    pagination: {
      pageSize: 50, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      del: true,
      mod: true
    },
    customColumnWidth: {
      人员工号: 120,
      员工姓名: 120,
      所属部门: 250,
      登记小时: 100,
      项目名称: 100
    },
    isSearch: true,
    cFFillFormInnerFieldNames: ['EMP_ID'],
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
          title: '加班项目',
          innerFieldNames: ['C3_425213243010']
        }
      ]
    },
    productComponents: [
      {
        iconClass: 'icon-add',
        componentInfo: {
          name: 'LzStepsOt',
          props: {
            resid: 592759743053
          }
        }
      }
    ]
  }
};

// 班次调整
window[592757819211] = {
  title: '班次调整',
  name: 'LzTable',
  props: {
    tableTitle: '班次调整',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    // opWidth: 300,
    addBtn: true,
    resid: 592761538859,
    opIsFixed: false,
    isSortBE: true,
    hasDownloadExcel: true,
    cFFillFormInnerFieldNames: ['C3_423704214978'],
    pagination: {
      pageSize: 10, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      del: true
    },
    customColumnWidth: {
      人员工号: 150,
      员工姓名: 100
    },
    isSearch: true,
    advSearchConfig: {
      containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: '24%', // label 宽度
      rowWidth: '100%', // row 宽度
      search: [
        // search
        {
          title: '工号/姓名',
          innerFieldNames: ['C3_423704214978', 'C3_423664176884']
        },
        {
          title: '班次名称',
          innerFieldNames: ['C3_375975770984']
        },
        {
          title: '部门编号',
          innerFieldNames: ['DAYSETTED']
        }
      ],
      dateRanges: [
        {
          title: '调整日期',
          innerFieldName: 'C3_423664325432',
          visible: [false, false, false, false]
        }
      ]
    },
    productComponents: [
      {
        iconClass: 'icon-add',
        componentInfo: {
          name: 'LzStepsCes',
          props: {
            resid: 592761538859
          }
        }
      }
    ]
  }
};

// 刷卡登记
window[592757938718] = {
  title: '刷卡登记',

  name: 'LzTable',
  props: {
    tableTitle: '刷卡登记',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    addBtn: true,
    resid: 592745258634,
    hasDownloadExcel: true,
    isSortBE: true,
    opIsFixed: true,
    hasImportData: true,
    customColumnWidth: {
      人员编号: 150,
      员工工号: 120,
      员工姓名: 120,
      日期: 100,
      所属部门: 250,
      设备编号: 100,
      是否手工输入: 150
    },
    pagination: {
      pageSize: 50, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      mod: true,
      del: true
    },
    isSearch: true,
    cFFillFormInnerFieldNames: ['C3_424965724815'],
    advSearchConfig: {
      containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: '24%', // label 宽度
      rowWidth: '100%', // row 宽度
      search: [
        // search
        {
          title: '工号/姓名',
          innerFieldNames: ['C3_424965724815', 'C3_382963984207']
        },
        {
          title: '所属部门',
          innerFieldNames: ['C3_382963968285']
        }
      ],
      dateRanges: [
        {
          title: '刷卡时间',
          innerFieldName: 'TIMES',
          visible: [false, false, false, false]
        }
      ]
    },
    productComponents: [
      {
        iconClass: 'icon-add',
        componentInfo: {
          name: 'LzStepsSc',
          props: {
            resid: 592745258634
          }
        }
      }
    ]
  }
};

// 人员信息
window[593256465860] = {
  title: '人员信息',
  name: 'LzTable',
  props: {
    tableTitle: '人员信息',
    exceptTableInnerHeight: 305,
    addBtn: false,
    resid: 592742369617,
    opIsFixed: true,
    isSortBE: true,
    hasDownloadExcel: true,
    fixedCols: ['员工工号', '员工姓名'],
    formsName: 'default',
    // formTabsSubTableProps: [
    //   {
    //     tabName: '补刷卡登记', // 标题
    //     componentInfo: {
    //       name: 'LzTable', // 组件名称
    //       props: {
    //         // 组件接受的 props
    //         subresid: 592745258634, // 必传
    //         opIsFixed: true,
    //         tableSize: 'small',
    //         startColumnAdd: {
    //           mode: 'multiple'
    //         },
    //         editableRow: {
    //           mode: 'multiple'
    //         },
    //         btnsVisible: {
    //           edit: true,
    //           save: false,
    //           cancel: true
    //         },
    //         pagination: {
    //           current: 0,
    //           pageSize: 10
    //         }
    //       }
    //     }
    //   }
    // ],
    customColumnWidth: {
      员工工号: 100,
      员工姓名: 100,
      部门名称: 250,
      入司日期s: 100,
      离职日期s: 100,
      成本中心2: 100,
      产线名称: 200,
      电子邮箱: 250,
      卡号: 150,
      性别: 100,
      婚姻状况: 100,
      部门编号: 100,
      社会工龄: 100,
      一级部门: 150,
      岗位编码: 100,
      岗位名称: 150,
      '管理/工人': 150,
      合同类别: 150,
      家庭电话: 150,
      移动电话: 150,
      在职: 100,
      '全职/兼职': 150,
      职能代码: 100,
      科技: 100,
      研发: 100,
      学历: 100
    },
    tableSize: 'small',
    pagination: {
      pageSize: 30, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      mod: true,
      check: true
    },
    isSearch: true,
    advSearchConfig: {
      containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: '24%', // label 宽度
      rowWidth: '100%', // row 宽度
      dateRanges: [
        {
          title: '入司日期',
          innerFieldName: 'C3_227193233656', // 内部字段
          visible: [false, false, false, false]
        },
        {
          title: '离职日期',
          innerFieldName: 'C3_244132849812', // 内部字段
          visible: [false, false, false, false]
        }
      ],
      search: [
        // search
        {
          title: '工号/姓名',
          innerFieldNames: ['C3_227192472953', 'C3_227192484125']
        },
        {
          title: '部门名称',
          innerFieldNames: ['C3_227212499515']
        },
        {
          title: '产线名称',
          innerFieldNames: ['C3_593255037926']
        }
      ]
    },
    productComponents: [
      {
        iconClass: 'icon-add',
        componentInfo: {
          name: 'LzStepsPi',
          props: {
            resid: 592742369617
          }
        }
      }
    ]
  }
};

// 树组件
window[592918685751] = {
  title: '刷卡登记',

  name: 'LzSteps',
  props: {
    tableTitle: 'LzSteps'
  }
};

// 产线信息
window[593258199149] = {
  title: '产线信息',

  name: 'LzTable',
  props: {
    tableTitle: '产线信息',
    exceptTableInnerHeight: 360,
    addBtn: true,
    resid: 593255133996,
    opIsFixed: false,
    isSortBE: true,
    tableSize: 'small',
    pagination: {
      pageSize: 10, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      mod: true,
      del: true
    },
    hasDownloadExcel: true,
    isSearch: true,
    cFFillFormInnerFieldNames: ['C3_593254727697'],
    advSearchConfig: {
      containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: '24%', // label 宽度
      rowWidth: '100%', // row 宽度
      search: [
        // search
        {
          title: '线长',
          innerFieldNames: ['C3_593254743856']
        },
        {
          title: '部门名称',
          innerFieldNames: ['C3_593254659030']
        },
        {
          title: '产线名称',
          innerFieldNames: ['C3_593254711841']
        }
      ]
    }
  }
};

// 考勤月报
window[593258257430] = {
  title: '考勤月报',

  name: 'LzTable',
  props: {
    tableTitle: '考勤月报',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 593257182832,
    opIsFixed: true,
    fixedCols: ['员工工号', '员工姓名'],
    isSortBE: true,
    unitBtns: [
      {
        name: 'LzPersonCA',
        btnName: '个人考勤',
        props: {
          resid: 593257182832,
          subresid: 593257166942
        }
      }
    ],
    displayMod: 'classify',
    // expandSubTableConfig: {
    //   // 展开的子表配置
    //   dataMode: 'sub',
    //   resid: 593257182832,
    //   subresid: 593257166942,
    //   isSearch: false,
    //   isBackEndBtnsVisible: true,
    //   style: {
    //     width: '100%'
    //   },
    //   fixedCols: ['考勤日期'],
    //   customColumnWidth: { 考勤日期: 200 },
    //   // tableSize: 'small',
    //   editableRow: {
    //     mode: 'single'
    //   },
    //   opIsFixed: true,
    //   btnsVisible: {
    //     edit: true,
    //     save: true,
    //     cancel: true
    //   },
    //   tableInnerHeight: 200
    // },
    pagination: {
      pageSize: 30, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      check: true
    },

    hasDownloadExcel: true,
    customColumnWidth: {
      考勤月份: 100,
      员工姓名: 120,
      员工工号: 120,
      部门名称: 250,
      应出勤小时合计: 150,
      停工小时: 100,
      调休小时: 100,
      出勤时数: 100,
      事假小时: 100,
      年休假小时: 110,
      病假小时: 100,
      婚假小时: 100,
      丧假小时: 100,
      工伤假小时: 110,
      产假小时: 100,
      哺乳假小时: 110,
      护理假小时: 110,
      旷工: 100,
      未刷卡: 100,
      平日加班1: 100,
      假日加班: 100,
      迟到小于30: 100,
      迟到分钟数: 110,
      早退分钟数: 110,
      未刷卡旷工小时: 150,
      刷卡旷工小时: 150,
      中班次数: 100,
      夜班次数: 100,
      迟到大于等于30: 150,
      早退大于等于30: 150,
      早退小于30: 150,
      迟到小于30: 150,
      一级部门: 250,
      平时加班: 100,
      公休加班: 100,
      节日加班: 100
    },
    advSearchConfig: {
      containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: '24%', // label 宽度
      rowWidth: '100%', // row 宽度
      search: [
        {
          title: '工号/姓名',
          innerFieldNames: ['YGNO', 'YGNAMES']
        },
        {
          title: '考勤年月',
          innerFieldNames: ['YEARMONTH']
        },
        {
          title: '部门名称',
          innerFieldNames: ['DEPTNAME']
        }
      ],
      tag: [
        // tag
        {
          title: '是否异常',
          op: 'or', // 操作符：'or' | 'and'
          tags: [
            {
              label: '异常',
              value: 'Y',
              isSelected: false,
              innerFieldName: 'C3_489056382938'
            },
            {
              label: '正常',
              value: 'N',
              isSelected: false,
              innerFieldName: 'C3_489056382938'
            }
          ]
        }
      ]
    }
  }
};

// 异步数据分析
window[593289637985] = {
  title: '异步数据分析',

  name: 'LzDataAnalyse',
  props: {
    resid: 597157025735,
    pnidcolname: 'C3_429373824779'
  }
};

// 加班申请
window[593111982133] = {
  title: '加班申请',

  name: 'LzAFFO',
  cFFillFormInnerFieldNames: ['C3_489231990680'],
  props: {
    tabPanes: [
      // 申请中
      {
        tabName: '申请中',
        componentInfo: {
          props: {
            rowColors: [
              {
                innerFieldName: 'C3_593457421602', // 内部字段
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

// 经理数据看板
window[593524800192] = {
  title: '经理加班统计看板',

  name: 'LzDataDashboard',
  props: {
    cardsResid: 593542530074,
    tableResid: 593542560671,
    cardsTitle: '本部门统计',
    tableTitle: '下级部门统计'
  }
};

// 加班申请看板
window[593627784883] = {
  title: '加班申请看板',

  name: 'LzTabsDataDashboard',
  props: {
    boardType: '加班申请'
  }
};

// 实际加班看板
window[593804128619] = {
  title: '实际加班看板',

  name: 'LzTabsDataDashboard',
  props: {
    boardType: '实际加班'
  }
};

// 加班审批
window[593688260478] = {
  title: '加班审批',

  name: 'LzWorkOvertime',
  props: {}
};

// 班组设置
window[593967498334] = {
  title: '班组设置',

  name: 'LzTeamSet',
  props: {}
};

// 班次设置
window[593982019208] = {
  title: '班次设置',

  name: 'LzClassifySet',
  props: {}
};

// 数据处理
window[594754848652] = {
  title: '数据处理',

  name: 'LzDataHandling',
  props: {}
};

// 组织架构
window[594905218521] = {
  title: '组织架构',

  name: 'LzFramework',
  props: {
    resid: 461862520690
  }
};

//考勤日报
window[595521764611] = {
  title: '考勤日报',

  name: 'LzTable',
  props: {
    tableTitle: '考勤日报',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 593257166942,
    opIsFixed: true,
    hasDownloadExcel: true,
    fixedCols: ['考勤日期', '员工工号'],
    isSortBE: true,
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },
    customColumnWidth: {
      考勤日期: 100,
      员工姓名: 120,
      员工工号: 120,
      部门名称: 250,
      dept1id: 100,
      更新日期: 250,
      班次名称: 100,
      成本中心2: 150,
      刷卡记录: 150,
      排班小时: 100,
      排班出勤: 100,
      迟到早退: 100,
      单次刷卡: 100,
      迟到: 100,
      早退: 100,
      未刷卡: 100,
      调休: 100,
      年假: 100,
      病假: 100,
      事假: 100,
      婚假: 100,
      停工: 100,
      丧假: 100,
      工伤假: 100,
      产假: 100,
      哺乳假: 100,
      平时加班: 100,
      节日加班: 100,
      周末加班: 100,
      刷卡旷工: 100,
      未刷卡旷工: 150,
      中班次数: 100,
      早退小于30: 150,
      迟到小于30: 150,
      日报状态: 100
    },
    pagination: {
      pageSize: 35, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      check: true,
      mod: true
    },
    isSearch: true,
    advSearchConfig: {
      containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: '24%', // label 宽度
      rowWidth: '100%', // row 宽度
      dateRanges: [
        // date
        {
          title: '考勤日期',
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: 'DayDate' // 内部字段
        }
      ],
      search: [
        // search
        {
          title: '工号/姓名',
          innerFieldNames: ['C3_375380046640', 'C3_375380006609']
        }
      ]
    }
  }
};

//设备管理
window[595621883547] = {
  title: '设备管理',

  name: 'LzTable',
  props: {
    tableTitle: '设备管理',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 595620922026,
    isSortBE: true,
    opIsFixed: false,
    hasDownloadExcel: true,
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },
    customColumnWidth: {
      开始时间: 330,
      结束时间: 330
    },
    pagination: {
      pageSize: 30, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      check: true
    },
    isSearch: true,
    advSearchConfig: {
      containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: '24%', // label 宽度
      rowWidth: '100%', // row 宽度
      dateRanges: [
        // date
        {
          title: '日期',
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: 'C3_595679045082' // 内部字段
        }
      ]
    }
  }
};

//加班额度明细
window[595621726970] = {
  title: '加班额度明细',

  name: 'LzTable',
  props: {
    tableTitle: '加班额度明细',
    exceptTableInnerHeight: 360,
    resid: 595621692073,
    isSortBE: true,
    hasDownloadExcel: true,
    tableSize: 'small',
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },
    customColumnWidth: {
      开始时间: 330,
      结束时间: 330
    },
    pagination: {
      pageSize: 10, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      mod: true
    },
    isSearch: true,
    advSearchConfig: {
      containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: '24%', // label 宽度
      rowWidth: '100%' // row 宽度
    }
  }
};

//办卡管理
window[595611924576] = {
  title: '办卡管理',

  name: 'LzTable',
  props: {
    tableTitle: '办卡管理',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 468101018541,
    isSortBE: true,
    hasDownloadExcel: true,
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },
    cFFillFormInnerFieldNames: ['C3_301572426126'],
    pagination: {
      pageSize: 10, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      mod: true,
      save: true,
      cancel: true
    },

    isSearch: true,
    advSearchConfig: {
      containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: '24%', // label 宽度
      rowWidth: '100%' // row 宽度
    }
  }
};
// 我的考勤
window[596541442029] = {
  title: '我的考勤',

  name: 'LzMyCA',
  props: {}
};

// 调休登记
window[596628732654] = {
  title: '调休登记',

  name: 'LzTable',
  props: {
    tableTitle: '调休登记',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    addBtn: false,
    resid: 596720928643,
    opIsFixed: true,
    hasDownloadExcel: true,
    isSortBE: true,
    cFFillFormInnerFieldNames: ['C3_425213166775', 'EMP_ID'],
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },
    productComponents: [
      {
        iconClass: 'icon-add',
        componentInfo: {
          name: 'LzStepsDOL',
          props: {
            resid: 596720928643
          }
        }
      }
    ],
    formTabsSubTableProps: [
      {
        tabName: '调休汇总', // 标题
        componentInfo: {
          name: 'LzTable', // 组件名称
          props: {
            // 组件接受的 props
            subresid: 596647249456, // 必传
            // 其他参数为 LzTable 所能接受的参数
            btnsVisible: {
              check: true
            },
            opIsFixed: true,
            tableSize: 'small',
            customColumnWidth: {
              人员编号: 120,
              年份: 100,
              员工工号: 120,
              员工姓名: 120,
              所属部门: 250,
              上年剩余: 100,
              本年累计: 100,
              当前可用: 100,
              '1月份加班': 100,
              '2月份加班': 100,
              '3月份加班': 100,
              '4月份加班': 100,
              '5月份加班': 100,
              '6月份加班': 100,
              '7月份加班': 100,
              '8月份加班': 100,
              '9月份加班': 100,
              '10月份加班': 100,
              '11月份加班': 100,
              '12月份加班': 100,
              '1月份使用': 100,
              '2月份使用': 100,
              '3月份使用': 100,
              '4月份使用': 100,
              '5月份使用': 100,
              '6月份使用': 100,
              '7月份使用': 100,
              '8月份使用': 100,
              '9月份使用': 100,
              '10月份使用': 100,
              '11月份使用': 100,
              '12月份使用': 100,
              分公司ID: 100,
              上年剩余调整: 150,
              SUPERVISORID1: 150,
              SUPERVISORID2: 150,
              SUPERVISORID3: 150,
              SUPERVISORID4: 150,
              SUPERVISORID5: 150,
              SUPERVISORID6: 150
            }
          }
        }
      }
    ],
    customColumnWidth: {
      人员编号: 120,
      人员工号: 120,
      员工姓名: 120,
      所属部门: 250,
      登记小时: 100,
      考勤项目编号: 150,
      项目名称: 100,
      备注: 100,
      剩余调休额度: 150,
      可调休的加班小时: 150,
      登记小时限额: 150
    },
    pagination: {
      pageSize: 30, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      mod: true,
      del: true
    },
    isBackEndBtnsVisible: true,
    opWidth: 250,
    isSearch: true,
    advSearchConfig: {
      containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: '24%', // label 宽度
      rowWidth: '100%', // row 宽度
      search: [
        // search
        {
          title: '工号/姓名',
          innerFieldNames: ['C3_435431950633', 'C3_435431950852']
        },
        {
          title: '考勤年份',
          innerFieldNames: ['C3_435433214220']
        }
      ]
    }
  }
};

// 年假管理
// window[596628764026] = {
//   name: 'unitOne',
//   hasBackBtn: true,
//   title: '年假管理',
//   containerStyle: {
//     position: 'absolute',
//     top: '50px',
//     left: '50%',
//     width: '90%',
//     overflow: 'auto',
//     transform: 'translateX(-50%)'
//   },
//   unitComponents: {
//     name: 'LzTable',
//     props: {
//       tableTitle: '年假管理',
//       tableSize: 'small',
//       exceptTableInnerHeight: 360,
//       addBtn: false,
//       resid: 596645981652,
//       opIsFixed: true,
//       hasDownloadExcel: true,
//       isSortBE: true,
//       formsName: {
//         rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
//         formFormName: 'default' // formFormName 表示表单中所用的窗体名称
//       },
//       customColumnWidth: {
//         开始时间: 330,
//         结束时间: 330
//       },
//       pagination: {
//         pageSize: 10, // 默认每页数量
//         current: 0 // 当前页数
//       },
//       btnsVisible: {
//         check: true
//       },
//       isSearch: true,
//       advSearchConfig: {
//         containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
//         defaultVisible: false, // 默认是否显示
//         drawerWidth: 500, // 抽屉的宽度
//         labelWidth: '24%', // label 宽度
//         rowWidth: '100%', // row 宽度

//         search: [
//           // search
//           {
//             title: '工号/姓名',
//             innerFieldNames: ['C3_426438637535', 'C3_426438637763']
//           },
//           {
//             title: '考勤年份',
//             innerFieldNames: ['C3_426438687329']
//           }
//         ]
//       }
//     }
//   }
// };

// 年假登记
window[596658515396] = {
  title: '年假登记',

  name: 'LzTable',
  props: {
    tableTitle: '年假登记',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    addBtn: false,
    resid: 596720766027,
    opIsFixed: true,
    hasDownloadExcel: true,
    isSortBE: true,
    cFFillFormInnerFieldNames: ['C3_425213166775', 'EMP_ID'],
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },
    opWidth: 250,
    isBackEndBtnsVisible: true,
    productComponents: [
      {
        iconClass: 'icon-add',
        componentInfo: {
          name: 'LzStepsALL',
          props: {
            resid: 596720766027
          }
        }
      }
    ],
    formTabsSubTableProps: [
      {
        tabName: '年假汇总', // 标题
        componentInfo: {
          name: 'LzTable', // 组件名称
          props: {
            // 组件接受的 props
            subresid: 596645981652, // 必传
            // 其他参数为 LzTable 所能接受的参数
            btnsVisible: {
              check: true
            },
            tableSize: 'small'
          }
        }
      }
    ],
    customColumnWidth: {
      人员工号: 150,
      员工姓名: 100,
      所属部门: 250,
      考勤项目编号: 150,
      登记小时: 100,
      项目名称: 100,
      备注: 100,
      剩余年假额度: 150,
      可调休的加班小时: 150,
      登记小时限额: 150
    },
    pagination: {
      pageSize: 30, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      mod: true,
      del: true
    },
    isSearch: true,
    advSearchConfig: {
      containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: '24%', // label 宽度
      rowWidth: '100%', // row 宽度

      search: [
        // search
        {
          title: '工号/姓名',
          innerFieldNames: ['C3_426438637535', 'C3_426438637763']
        },
        {
          title: '考勤年份',
          innerFieldNames: ['C3_426438687329']
        }
      ]
    }
  }
};

// 病假登记
window[596628777520] = {
  title: '病假登记',

  name: 'LzTable',
  props: {
    tableTitle: '病假登记',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    addBtn: true,
    resid: 596629694197,
    opIsFixed: true,
    hasDownloadExcel: true,
    isSortBE: true,
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },
    customColumnWidth: {
      开始时间: 330,
      结束时间: 330
    },
    pagination: {
      pageSize: 30, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      del: true,
      mod: true
      // edit: true,
      // save: true,
      // cancel: true
    },
    isSearch: false,
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

// 部门信息
window[596904256141] = {
  title: '部门信息',

  name: 'LzTable',
  props: {
    tableTitle: '部门信息',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 592742244497,
    opIsFixed: true,
    hasDownloadExcel: true,
    // fixedCols: ['考勤日期', '员工姓名'],
    isSortBE: true,
    // formsName: {
    //   rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
    //   formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    // },
    customColumnWidth: {
      上级部门编号: 150,
      部门编号: 100,
      部门名称: 100,
      负责人: 100,
      部门级别: 100,
      部门级别: 100,
      部门默认班组: 150,
      act: 100
    },
    pagination: {
      pageSize: 30, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      check: true,
      mod: true
    },
    isSearch: true
    // advSearchConfig: {
    //   containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
    //   defaultVisible: false, // 默认是否显示
    //   drawerWidth: 500, // 抽屉的宽度
    //   labelWidth: '24%', // label 宽度
    //   rowWidth: '100%', // row 宽度
    //   dateRanges: [
    //     // date
    //     {
    //       title: '考勤日期',
    //       visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
    //       innerFieldName: 'DayDate' // 内部字段
    //     }
    //   ],
    //   search: [
    //     // search
    //     {
    //       title: '工号/姓名',
    //       innerFieldNames: ['C3_375380046640', 'C3_375380006609']
    //     }
    //   ]
    // }
  }
};

// 考勤期间
window[597167727825] = {
  title: '考勤期间',

  name: 'LzTable',
  props: {
    tableTitle: '考勤期间',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 565966489445,
    opIsFixed: false,
    addBtn: true,
    // fixedCols: ['考勤日期', '员工姓名'],
    isSortBE: true,
    customColumnWidth: {
      上级部门编号: 150,
      部门编号: 100,
      部门名称: 100,
      负责人: 100,
      部门级别: 100,
      部门级别: 100,
      部门默认班组: 150,
      act: 100
    },
    pagination: {
      pageSize: 10, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      del: true,
      mod: true
    },
    isSearch: true
  }
};

// 日期对调
window[597167759556] = {
  title: '日期对调',

  name: 'LzTable',
  props: {
    tableTitle: '日期对调',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 375455814611,
    opIsFixed: false,
    hasDownloadExcel: true,
    addBtn: true,
    // fixedCols: ['考勤日期', '员工姓名'],
    isSortBE: true,
    pagination: {
      pageSize: 30, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      mod: true,
      del: true
    },
    isSearch: true
  }
};

// 节日登记
window[597167738777] = {
  title: '节日登记',

  name: 'LzTable',
  props: {
    tableTitle: '节日登记',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 375364128640,
    opIsFixed: false,
    addBtn: true,

    hasDownloadExcel: true,
    // fixedCols: ['考勤日期', '员工姓名'],
    isSortBE: true,
    pagination: {
      pageSize: 30, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      mod: true
    },
    isSearch: true
  }
};

// 日报锁定
window[597167932280] = {
  title: '日报锁定',
  name: 'LzTable',
  props: {
    tableTitle: '日报锁定',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 597163054831,
    opIsFixed: false,
    addBtn: true,
    hasDownloadExcel: true,
    // fixedCols: ['考勤日期', '员工姓名'],
    isSortBE: true,
    pagination: {
      pageSize: 10, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      mod: true,
      del: true
    },
    isSearch: true
  }
};

// 月度人员名单
window[597173970236] = {
  title: '月度人员名单',

  name: 'LzTable',
  props: {
    tableTitle: '月度人员名单',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 593542625475,
    opIsFixed: true,
    hasDownloadExcel: true,
    fixedCols: ['考勤月份', '员工姓名'],
    // fixedCols: ['考勤日期', '员工姓名'],
    isSortBE: true,
    pagination: {
      pageSize: 30, // 默认每页数量
      current: 0 // 当前页数
    },
    customColumnWidth: {
      考勤月份: 100,
      员工姓名: 100,
      员工工号: 150,
      入司日期s: 100,
      在职: 100,
      当月离职: 100,
      当月入职: 100,
      部门编号: 100,
      性别: 100,
      所属部门: 250,
      当月在职状态: 150,
      离职状态: 100,
      二级英文: 250,
      一级英文: 250,
      当前日期: 100,
      是否入会: 100,
      是否结算: 100,
      考勤类型: 100,
      英文名: 100,
      考勤开始日期s: 150,
      考勤结束日期s: 150,
      学历: 100,
      合同类别: 100,
      录用渠道: 100,
      考勤月最后一天: 150
    },
    btnsVisible: {
      check: true
    },
    isSearch: true
  }
};

// 审批授权
window[597239214885] = {
  title: '审批授权',

  name: 'LzTable',
  props: {
    tableTitle: '审批授权',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 449582852659,
    opIsFixed: true,
    customColumnWidth: {
      被授权人工号: 150,
      被授权人: 100
    },
    cFFillFormInnerFieldNames: ['C3_449443745685'],
    // hasDownloadExcel: true,
    // fixedCols: ['考勤日期', '员工姓名'],
    isSortBE: true,
    addBtn: true,
    pagination: {
      pageSize: 10, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      mod: true,
      del: true
    },
    isSearch: true
  }
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

// 设备管理
window[602077066185] = {
  title: '设备管理',

  name: 'LzTable',
  props: {
    tableTitle: '设备管理',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 601666211205,
    // opIsFixed: true,
    addBtn: true,
    hasDownloadExcel: true,
    isSortBE: true,
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },
    customColumnWidth: {},
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
    associatedFields: [['C3_596649436965', 'C3_596648784210']]
  }
};

// 餐别管理
window[602077082269] = {
  title: '餐别管理',

  name: 'LzTable',
  props: {
    tableTitle: '餐别管理',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 601722857689,
    // opIsFixed: true,
    addBtn: true,
    hasDownloadExcel: true,
    isSortBE: true,
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },
    customColumnWidth: {},
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
    associatedFields: [['C3_596649436965', 'C3_596648784210']]
  }
};

//消费汇总查询
window[602077130764] = {
  title: '消费汇总查询',

  name: 'LzTable',
  props: {
    tableTitle: '消费汇总查询',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 602077872050,
    // opIsFixed: true,
    hasDownloadExcel: true,
    isSortBE: true,
    // formsName: {
    //   rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
    //   formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    // },

    formTabsSubTableProps: [
      {
        tabName: '餐别', // 标题
        componentInfo: {
          name: 'LzTable', // 组件名称
          props: {
            // 组件接受的 props
            subresid: 601747125830, // 必传
            // 其他参数为 LzTable 所能接受的参数
            btnsVisible: {
              check: true
            },
            opIsFixed: true,
            tableSize: 'small',
            customColumnWidth: {}
          }
        }
      }
    ],
    customColumnWidth: {
      人员工号: 70,
      姓名: 50,
      卡号: 80,
      设备名称: 70,
      餐别名称: 80
    },
    pagination: {
      pageSize: 50, // 默认每页数量
      current: 0 // 当前页数
    },
    isSearch: true,
    advSearchConfig: {
      containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: '24%', // label 宽度
      rowWidth: '100%', // row 宽度
      dateRanges: [
        // date
        {
          title: '消费时间',
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: '消费时间' // 内部字段
        }
      ],
      search: [
        // search
        {
          title: '人员工号',
          innerFieldNames: ['人员工号']
        },
        {
          title: '餐别名称',
          innerFieldNames: ['餐别名称']
        },
        {
          title: '设备名称',
          innerFieldNames: ['设备名称']
        }
      ]
    },
    cFFillFormInnerFieldNames: ['C3_425213166775', 'EMP_ID'],
    associatedFields: [['C3_596649436965', 'C3_596648784210']]
  }
};

//卡类管理
window[602077100378] = {
  title: '卡类管理',

  name: 'LzTable',
  props: {
    tableTitle: '卡类管理',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    addBtn: true,
    resid: 601722897251,
    opIsFixed: true,
    hasDownloadExcel: true,
    isSortBE: true,
    cFFillFormInnerFieldNames: ['C3_425213166775', 'EMP_ID'],
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },

    formTabsSubTableProps: [
      {
        tabName: '可用餐别', // 标题
        componentInfo: {
          name: 'LzTable', // 组件名称
          props: {
            // 组件接受的 props
            subresid: 601747125830, // 必传
            // 其他参数为 LzTable 所能接受的参数
            btnsVisible: {
              mod: true,
              del: true
            },
            opIsFixed: true,
            isSearch: false,
            addBtn: true,
            tableSize: 'small',
            customColumnWidth: {
              卡类型编号: 100,
              用餐名称: 100,
              当餐次数: 100
            }
          }
        }
      }
    ],
    customColumnWidth: {},
    pagination: {
      pageSize: 30, // 默认每页数量
      current: 0 // 当前页数
    },
    btnsVisible: {
      mod: true,
      del: true
    },
    isBackEndBtnsVisible: true,
    opWidth: 250,
    isSearch: true
  }
};

window[602077157834] = {
  title: '机台消费汇总',

  name: 'LzTableV2',
  isSearch: true,
  props: {
    resid: 602076597385,
    procedure: 'dbo.Pro_SumOfConsume',
    paranames: '@dates1,@dates2',
    paratypes: 'string,string,string',
    pagination: {
      pageSize: 50,
      current: 0
    },
    // tableTitle: '卡类管理',
    // tableSize: 'small',
    // exceptTableInnerHeight: 360,
    // resid: 601827764647,
    // opIsFixed: true,
    // hasDownloadExcel: true,
    // isSortBE: true,
    // cFFillFormInnerFieldNames: ['C3_425213166775', 'EMP_ID'],
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },
    customColumnWidth: {},
    customColumnWidth: {
      日期: 100
    },
    btnsVisible: {
      mod: true,
      del: true
    },
    isBackEndBtnsVisible: true,
    opWidth: 250,
    isSearch: true
  }
};

// 年假信息
window[601993616191] = {
  title: '年假信息',

  name: 'LzTable',
  props: {
    tableTitle: '年假信息',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    addBtn: false,
    resid: 602088671836,
    opIsFixed: true,
    hasDownloadExcel: true,
    isSortBE: true,
    cFFillFormInnerFieldNames: ['C3_425213166775', 'EMP_ID'],
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },
    opWidth: 250,
    isBackEndBtnsVisible: true,

    customColumnWidth: {
      人员工号: 150,
      员工姓名: 100,
      所属部门: 250,
      考勤项目编号: 150,
      登记小时: 100,
      项目名称: 100,
      备注: 100,
      剩余年假额度: 150,
      可调休的加班小时: 150,
      登记小时限额: 150
    },
    pagination: {
      pageSize: 30, // 默认每页数量
      current: 0 // 当前页数
    },
    isSearch: true
  }
};

//综合信息管理
window['603375053767'] = {
  title: '综合信息管理',

  name: 'LzMenuContainerB',
  props: {
    noDataTip: '暂无数据，请选择员工',
    resid: 593542625475,
    searchFields: [
      {
        text: '工号',
        innerFieldName: 'C3_429373825045'
      }
    ],
    userInfoFields: [
      {
        label: '姓名',
        innerFieldName: 'C3_429373825263'
      },
      {
        label: '工号',
        innerFieldName: 'C3_429373825045'
      },
      {
        label: '部门',
        innerFieldName: 'C3_429374111210'
      }
    ]
  }
};

// 办卡信息
window[603800213153] = {
  title: '办卡信息',

  name: 'LzTable',
  props: {
    tableTitle: '办卡信息',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    addBtn: true,
    resid: 603799234294,
    opIsFixed: true,
    hasDownloadExcel: true,
    isSortBE: true,
    cFFillFormInnerFieldNames: ['C3_425213166775', 'EMP_ID'],
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },
    opWidth: 300,
    isBackEndBtnsVisible: true,

    pagination: {
      pageSize: 50, // 默认每页数量
      current: 0 // 当前页数
    },
    customColumnWidth: {
      ID卡号: 130,
      员工姓名: 100
    },
    btnsVisible: {
      mod: true,
      del: true
    },
    isSearch: true
  }
};

//异常刷卡记录
window[604607348876] = {
  title: '异常刷卡记录',

  name: 'LzTable',
  props: {
    tableTitle: '异常刷卡记录',
    tableSize: 'small',
    exceptTableInnerHeight: 360,
    resid: 604595936643,
    opIsFixed: true, //固定操作窗口
    hasDownloadExcel: true,
    isSortBE: true,
    formsName: {
      rowFormName: 'default-edit', //  rowFormName 表示行内编辑所用的窗体名称
      formFormName: 'default' // formFormName 表示表单中所用的窗体名称
    },
    pagination: {
      pageSize: 50, // 默认每页数量
      current: 0 // 当前页数
    },
    isSearch: true,
    cFFillFormInnerFieldNames: ['C3_425213166775', 'EMP_ID'],
    associatedFields: [['C3_596649436965', 'C3_596648784210']]
  }
};
