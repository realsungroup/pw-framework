// 录入
window[590765309983] = {
  name: 'TypeIn',
  title: '录入',
  enTitle: 'Type in',

  props: {
    displayMod: 'classify',
    resid: 590510705335,
    operation: 'add',
    record: {},
    formName: 'default'
  }
};

// 违纪信息
window[592305842055] = {
  name: 'LzTable',
  title: '违纪信息',
  enTitle: 'Disciplinary information',
  props: {
    resid: 590510705335,
    isSearch: false,
    btnsVisible: {
      mod: true,
      del: true,
      check: true,
      edit: false,
      save: false,
      cancel: false,
      add: false
    },
    pagination: {
      pageSize: 10,
      current: 0
    },
    opWidth: 300,
    opIsFixed: true,
    tableTitle: '统计分析',
    showHeader: true,
    displayMod: 'classify',
    lzAdvSearchStyle: {
      border: '1px solid #86cfff',
      borderRadius: '4px',
      background: '#e2f6ff'
    },
    advSearchVisible: true,
    advSearchConfig: {
      containerName: 'drawer',

      dateRanges: [
        // date
        {
          title: '违纪日期',
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: 'C3_590511645885' // 内部字段
        },
        {
          title: '入职日期',
          visible: [false, false, false, false], // 对应 “今天”、“昨天”、“本周”、“上周” 是否显示
          innerFieldName: 'C3_590512068786' // 内部字段
        }
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
        }
      ]
    }
  }
};
