// 录入
window['597167932280'] = {
  name: 'TableData',
  title: '录入',
  props: {
    resid: 592742369617
  }
};

// 日报锁定
window[597167932280] = {
  name: 'LzTable',
  title: '日报锁定',
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
  name: '日期对调',
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

// 数据处理
window[594754848652] = {
  title: '数据处理',
  name: 'LzDataHandling',
  props: {}
};

// 数据分析
window[593289637985] = {
  title: '数据分析',
  name: 'LzDataAnalyse',
  props: {
    resid: 597157025735,
    pnidcolname: 'C3_429373824779'
  }
};

// 考勤日报
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

// 个人考勤
window[596541442029] = {
  title: '个人考勤',
  name: 'LzMyCA',
  props: {}
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
    cFFillFormInnerFieldNames: ['C3_450479321413'],
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

// 班次设置
window[593982019208] = {
  title: '班次设置',
  name: 'LzClassifySet',
  props: {}
};
