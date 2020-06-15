import React from 'react';
import moment from 'moment';
import { message } from 'antd';
import { modRecord } from 'Util/api';

// 数据格式化：返回格式化后的值
const timeFormat = value => {
  return moment(value).format('YYYY-MM-DD HH:mm:ss');
};

const advSearchConfig = {
  containerName: 'drawer', // 高级搜索所在容器的名字：'normal' 在表格里面；'drawer' 在抽屉容器里面
  defaultVisible: false, // 默认是否显示
  drawerWidth: 500, // 抽屉的宽度
  labelWidth: '24%', // label 宽度
  rowWidth: '100%', // row 宽度
  dateRanges: [
    // date
    {
      title: '开始时间',
      visible: [false, false, false, false],
      innerFieldName: 'C3_489231991382'
    },
    {
      title: '填单日期',
      visible: [false, false, false, false],
      innerFieldName: 'C3_489253762403'
    }
  ],
  search: [
    // search
    {
      title: '工号/姓名',
      innerFieldNames: ['C3_489231990680', 'C3_489231990945']
    }
  ]
};

// 申请中
export const inApplication = {
  resid: 605801028375,
  hasSearch: true,
  hasBeBtns: true,
  hasRowModify: true, //行内修改按钮
  hasModify: false,
  hasDelete: false,
  hasRowView: false,
  beforeSaveFields: 'C3_605703930741',
  subtractH: 196,
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  // height:500,
  //   formProps:{
  //     height:500,
  //  },
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  addText: '请填写访客基本信息',
  subTableArrProps: [
    {
      subTableName: '访客信息',
      subResid: 606066688508,
      tableProps: {
        addText: '添加访客身份信息',
        hasAdd: true,
        hasModify: false,
        hasDelete: false,
        hasRowModify: true,
        hasRowView: false,
        hasRowDelete: false,
        height: 400,
        defaultColumnWidth: 100,
        actionBarWidth: 100,
        subtractH: 196,
        formProps: { saveReopen: true, saveNeedConfirm: true }
      }
    }
  ]
};
// 审批中
export const inExaminationAndApproval = {
  resid: 605803642531,
  hasSearch: true,
  hasBeBtns: true,
  hasRowModify: false, //行内修改按钮
  hasModify: false,
  hasDelete: false,
  hasRowView: false,
  beforeSaveFields: 'C3_605703930741',
  subtractH: 196,
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  // height:500,
  //   formProps:{
  //     height:500,
  //  },
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  addText: '请填写访客基本信息',
  subTableArrProps: [
    {
      subTableName: '访客信息',
      subResid: 606066688508,
      tableProps: {
        addText: '添加访客信息（可添加多人）',
        hasAdd: true,
        hasModify: false,
        hasDelete: false,
        hasRowModify: true,
        hasRowView: false,
        hasRowDelete: false,
        hasRowEdit:true,
        rowEditFormName:'default',
        height: 400,
        defaultColumnWidth: 100,
        actionBarWidth: 100,
        subtractH: 196,
        actionBarFixed: false,
        rowEditAddPosition:'start',
        hasRowEditAdd: true,
        storeWay: 'fe',
        formProps: { saveReopen: true, saveOpenText: '保存并继续添加人员' }
      }
    },
    {
      subTableName: '审批记录',
      subResid: 605989494375,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        height: 500,
        subtractH: 196
      }
    }
  ]
};
// 已审批
export const approved = {
  resid: 605803707282,
  hasSearch: true,
  subtractH: 196,
  hasAdd: false,
  hasBeBtns: true,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  actionBarWidth: 200,
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  recordFormType: 'drawer',
  formProps: {
    height: 500
  },
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [
    {
      subTableName: '访客信息',
      subResid: 606066688508,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: true,
        hasRowView: false,
        hasRowDelete: false,
        subtractH: 196,
        height: 500,
        defaultColumnWidth: 100
      }
    },
    {
      subTableName: '审批记录',
      subResid: 605989494375,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        height: 500,
        subtractH: 196
      }
    }
  ]
  // formTabsSubTableProps: [
  //   {
  //     tabName: '审批记录', // 标题
  //     componentInfo: {
  //       name: 'TableData', // 组件名称
  //       props: {
  //         // 组件接受的 props
  //         subresid: 605989494375, // 必传
  //         // 其他参数为 LzTable 所能接受的参数
  //         btnsVisible: {
  //           check: true
  //         },
  //         tableSize: 'small'
  //       }
  //     }
  //   }
  // ],
};

// 已拒绝
export const refused = {
  resid: 605803740920,
  // height:500,
  subtractH: 166,
  formProps: {
    height: 500
  },
  hasAdd: false,
  hasSearch: true,
  hasBeBtns: true,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  subtractH: 196,
  recordFormType: 'drawer',
  actionBarWidth: 200,
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [
    {
      subTableName: '访客信息',
      subResid: 606066688508,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        // hasRowEdit: true,
        hasRowModify: true,
        hasRowView: false,
        hasRowDelete: false,
        height: 500,
        defaultColumnWidth: 100,
        actionBarWidth: 100
      }
    },
    {
      subTableName: '审批记录',
      subResid: 605989494375,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        height: 500
      }
    }
  ]
};

// 历史记录
export const history = {
  resid: 605803785490,
  hasAdd: false,
  hasSearch: true,
  // height:500,
  subtractH: 166,
  formProps: {
    height: 500
  },
  hasBeBtns: true,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  subtractH: 196,
  actionBarWidth: 300,
  recordFormType: 'drawer',
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [
    {
      subTableName: '访客信息',
      subResid: 606066688508,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        // hasRowEdit: true,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        height: 500,
        defaultColumnWidth: 100
      }
    },
    {
      subTableName: '审批记录',
      subResid: 605989494375,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        height: 500
      }
    }
  ]
};
