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
