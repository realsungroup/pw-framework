const config = {
  tabPanes: [
    {
      tabName: "班组调整",
      componentInfo: {
        name: "LzTable",
        props: {
          dataMode: "sub",
          resid: 593542625475,
          subresid: 603394463593,
          opIsFixed: true,
          addBtn: false,
          isSortBE: true,
          isSearch: false,
          hasDownloadExcel: true,
          pagination: {
            current: 0,
            pageSize: 50
          },
          advSearchConfig: {
            containerName: "drawer", // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
            defaultVisible: false, // 默认是否显示
            drawerWidth: 500, // 抽屉的宽度
            labelWidth: "24%", // label 宽度
            rowWidth: "100%", // row 宽度
            dateRanges: [
              // date
              {
                title: "开始日期",
                visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
                innerFieldName: "STARTDATE" // 内部字段
              }
            ]
          }
        }
      }
    },
    {
      tabName: "班次调整",
      componentInfo: {
        name: "LzTable",
        props: {
          dataMode: "sub",
          resid: 593542625475,
          subresid: 603394819080,
          addBtn: false,
          isSearch: false,
          isSortBE: true,
          hasDownloadExcel: true,
          pagination: {
            current: 0,
            pageSize: 50
          },
          advSearchConfig: {
            containerName: "drawer", // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
            defaultVisible: false, // 默认是否显示
            drawerWidth: 500, // 抽屉的宽度
            labelWidth: "24%", // label 宽度
            rowWidth: "100%", // row 宽度
            dateRanges: [
              // date
              {
                title: "调整日期",
                visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
                innerFieldName: "C3_423664325432" // 内部字段
              }
            ]
          }
        }
      }
    },
    {
      tabName: "加班登记",
      componentInfo: {
        name: "LzTable",
        props: {
          dataMode: "sub",
          resid: 593542625475,
          subresid: 603396545832,
          addBtn: false,
          isSearch: false,
          isSortBE: true,
          hasDownloadExcel: true,
          pagination: {
            current: 0,
            pageSize: 50
          },
          advSearchConfig: {
            containerName: "drawer", // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
            defaultVisible: false, // 默认是否显示
            drawerWidth: 500, // 抽屉的宽度
            labelWidth: "24%", // label 宽度
            rowWidth: "100%", // row 宽度
            dateRanges: [
              // date
              {
                title: "开始时间",
                visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
                innerFieldName: "DATE1" // 内部字段
              }
            ]
          }
        }
      }
    },
    {
      tabName: "请假登记",
      componentInfo: {
        name: "LzTable",
        props: {
          dataMode: "sub",
          resid: 593542625475,
          subresid: 603395836353,
          addBtn: false,
          isSearch: false,
          isSortBE: true,
          hasDownloadExcel: true,
          pagination: {
            current: 0,
            pageSize: 50
          },
          advSearchConfig: {
            containerName: "drawer", // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
            defaultVisible: false, // 默认是否显示
            drawerWidth: 500, // 抽屉的宽度
            labelWidth: "24%", // label 宽度
            rowWidth: "100%", // row 宽度
            dateRanges: [
              // date
              {
                title: "开始时间",
                visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
                innerFieldName: "DATE1" // 内部字段
              }
            ]
          }
        }
      }
    },
    {
      tabName: "刷卡登记",
      componentInfo: {
        name: "LzTable",
        props: {
          dataMode: "sub",
          resid: 593542625475,
          subresid: 603396755497,
          addBtn: false,
          isSearch: false,
          isSortBE: true,
          hasDownloadExcel: true,
          advSearchConfig: {
            containerName: "drawer", // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
            defaultVisible: false, // 默认是否显示
            drawerWidth: 500, // 抽屉的宽度
            labelWidth: "24%", // label 宽度
            rowWidth: "100%", // row 宽度
            dateRanges: [
              // date
              {
                title: "刷卡时间",
                visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
                innerFieldName: "TIMES" // 内部字段
              }
            ]
          },
          pagination: {
            current: 0,
            pageSize: 50
          }
        }
      }
    }
  ]
};

export default config;
