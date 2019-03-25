// 管理员确认
// window[606476781618] = {
//   name: 'TableDataWrap',
//   title: '录入',
//   props: {
//     resid: 605617716920,
//     hasBeBtns: true,
//     hasAdd: false,
//     hasModify: false,
//     hasDelete: false,
//     hasRowView: true,
//     hasRowModify: false,
//     hasRowView: true,
//     hasRowDelete: false,
//     // height:500,
//     subtractH: 166,

//     // operation: 'add',
//   }
// };
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
    subtractH: 166,
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
          innerFieldNames: ['C3_590512213622', 'C3_591373760332','C3_605619907534'],
          values: ['Y', null,'Y']
        },
        {
          btnName: '修改',
          innerFieldNames: ['C3_591373760332'],
          values: ['Y']
        },
        {
          btnName: '删除',
          innerFieldNames: ['C3_591373611399','C3_605619907534'],
          values: ['Y','Y']
        },
        {
          btnName: '撤销',
          innerFieldNames: ['C3_605619907534'],
          values: ['Y']
        },
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
// window[592400266558] = {
//   title: '录入',

//   name: 'LzMenuForms',
//   props: {
//     mode: 'multiple',
//     advSearchConfig: {
//       // 高级搜索配置
//       defaultVisible: false,
//       containerName: 'drawer',
//       drawerWidth: 500,
//       labelWidth: '24%',
//       rowWidth: '100%',
//       dateRanges: [
//         // date
//         {
//           title: '事件日期',
//           visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
//           innerFieldName: 'C3_591545408070' // 内部字段
//         }
//       ]
//     },
//     searchFields: [
//       {
//         text: '工号',
//         innerFieldName: 'C3_227192472953'
//       }
//     ],
//     navListResid: 591533333401,
//     resid: 591533160636,
//     hasFieldsLabel: false,
//     userFieldsViewConfig: {
//       mode: 'inline',
//       colCount: 2
//     },
//     userInfoFields: [
//       {
//         label: '姓名',
//         innerFieldName: 'C3_227192484125'
//       },
//       {
//         label: '工号',
//         innerFieldName: 'C3_227192472953'
//       },
//       {
//         label: '职务',
//         innerFieldName: 'C3_417990929305'
//       },
//       {
//         label: '部门',
//         innerFieldName: 'C3_227212499515'
//       }
//     ]
//   }
// };

// 计算公式取值
// window[592244969643] = {
//   title: '计算公式取值',

//   name: 'LzTable',
//   props: {
//     resid: 592244695755,
//     addBtn: true,
//     cFFillFormInnerFieldNames: ['C3_592244738975', 'C3_592244739145'],
//     btnsVisible: {
//       mod: true
//     },
//     // isGetFormDefaultValues: true,
//     associatedFields: [
//       ['C3_592244739145', 'C3_592306113509'],
//       ['C3_592244739346', 'C3_592306124239']
//     ]
//   }
// };
