// 节日登记
window[588425594397] = {
  title: '患者信息',
  name: 'PatientInfo',
  props: {
    tableDataProps: {
      resid: 626547652750,
      subtractH: 100,
      actionBarFixed: false,
      height: 500,
      size: 'small',
      actionBarWidth: 490,
      hasModify: false,
      hasDelete: false,
      addText: '添加基本信息',
      enAddText: 'Add basic information',
      rowModifyText: '修改基本信息',
      enRowModifyText: 'Modify basic information',
      formProps: {
        displayMode: 'classify'
      }
    }
  }
};


window[626543183115] = {
  title: '生物样本库',
  name: 'PatientInfo',
  props: {
    tableDataProps: {
      resid:626550360141,
      subtractH: 100,
      actionBarFixed: false,
      height: 500,
      size: 'small',
      actionBarWidth: 490,
      hasModify: false,
      hasDelete: false,
      addText: '添加样本信息',
      enAddText: 'Add basic information',
      rowModifyText: '修改样本信息',
      enRowModifyText: 'Modify basic information',
      formProps: {
        displayMode: 'classify'
      }
    }
  }
};


window[689372902921] = {
  title: "儿科数据IBD病种导出",
  name: "ExportData",
  props: {
    addBtn: false,
    navListResid: 689336611814,

    tableDataProps: {
      subtractH: 170,
      actionBarFixed: false,
      height: 'calc(100vh - 224px)',
      size: "small",
      actionBarWidth: 490,
      hasModify: false,
      hasDelete: false,
      hasAdd: false,
      hasRowDelete: false,
      hasRowModify: false,
      hasRowView: false,
      hasSearch: false,
      formProps: {
        displayMode: "classify",
      },
    },
    hasAdvSearch: true,
    isSearch: true,
    advSearchConfig: {
      containerName: "drawer", // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: "24%", // label 宽度
      rowWidth: "100%", // row 宽度
      dateRanges: [
        // date
        {
          title: "考勤日期",
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: "DayDate", // 内部字段
        },
      ],
      search: [
        // search
        {
          title: "工号/姓名",
          innerFieldNames: ["C3_375380046640", "C3_375380006609"],
        },
      ],
    },
  },
};

window[689373378040] = {
  title: "儿科数据其他病种导出",
  name: "ExportData",
  props: {
    addBtn: false,
    navListResid: 689337098290,
    tableDataProps: {
      subtractH: 170,
      actionBarFixed: false,
      height: 'calc(100vh - 224px)',
      size: "small",
      actionBarWidth: 490,
      hasModify: false,
      hasDelete: false,
      hasAdd: false,
      hasRowDelete: false,
      hasRowModify: false,
      hasRowView: false,
      hasSearch: false,
      formProps: {
        displayMode: "classify",
      },
    },
    isSearch: true,
    advSearchConfig: {
      containerName: "drawer", // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: "24%", // label 宽度
      rowWidth: "100%", // row 宽度
      dateRanges: [
        // date
        {
          title: "考勤日期",
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: "DayDate", // 内部字段
        },
      ],
      search: [
        // search
        {
          title: "工号/姓名",
          innerFieldNames: ["C3_375380046640", "C3_375380006609"],
        },
      ],
    },
  },
};


window[689373430131] = {
  title: "儿科数据问卷调查导出",
  name: "ExportData",
  props: {
    addBtn: false,
    navListResid: 689337145198,
    tableDataProps: {
      subtractH: 170,
      actionBarFixed: false,
      height: 'calc(100vh - 224px)',
      size: "small",
      actionBarWidth: 490,
      hasModify: false,
      hasDelete: false,
      hasAdd: false,
      hasRowDelete: false,
      hasRowModify: false,
      hasRowView: false,
      hasSearch: false,
      formProps: {
        displayMode: "classify",
      },
    },
    isSearch: true,
    advSearchConfig: {
      containerName: "drawer", // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
      defaultVisible: false, // 默认是否显示
      drawerWidth: 500, // 抽屉的宽度
      labelWidth: "24%", // label 宽度
      rowWidth: "100%", // row 宽度
      dateRanges: [
        // date
        {
          title: "考勤日期",
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: "DayDate", // 内部字段
        },
      ],
      search: [
        // search
        {
          title: "工号/姓名",
          innerFieldNames: ["C3_375380046640", "C3_375380006609"],
        },
      ],
    },
  },
};