// 患者周期列表
window[648640265023] = {
  title: "患者周期列表",
  name: "PatientPeriod",
  props: {
    tableDataProps: {
      resid: 648300111771,
      subtractH: 170,
      actionBarFixed: true,
      height:500,
      // height: 'calc(100vh - 160px)',
      size: "small",
      actionBarWidth: 490,
      hasModify: false,
      hasDelete: false,
      addText: "添加基本信息",
      enAddText: "Add basic information",
      rowModifyText: "修改基本信息",
      enRowModifyText: "Modify basic information",
      formProps: {
        // displayMode: "classify",
      },
    },
  },
};

window[645026775225] = {
  title: "UC数据导出",
  name: "ExportData",
  props: {
    addBtn: false,
    navListResid: 615379398034,

    tableDataProps: {
      subtractH: 170,
      height:500,
      actionBarFixed:true,
      // height: 'calc(100vh - 224px)',
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

window[645045274189] = {
  title: "CD数据导出",
  name: "ExportData",
  props: {
    addBtn: false,
    navListResid: 614860684060,
    tableDataProps: {
      subtractH: 170,
      actionBarFixed: false,
      height:500,
      // height: 'calc(100vh - 224px)',
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
