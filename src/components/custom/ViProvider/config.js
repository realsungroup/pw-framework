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

const customColumnWidth = {
  员工工号: 120,
  员工姓名: 100,
  产线名称: 250,
  填单人: 100,
  记录状态: 100,
  审批状态: 100
};

// 申请中
export const inApplication = {
  resid: 605891650522,
  subtractH: 196,
  formProps: {
    height: 500
  },
  hasSearch: true,
  hasBeBtns: true,
  hasRowModify: true, //行内修改按钮
  hasModify: false,
  hasDelete: false,
  hasRowView: false,
  hasBeBtns: true,
  defaultColumnWidth: 150,
  recordFormType: 'drawer',
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [
    {
      subTableName: '供应商信息',
      subResid: 606302353251,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: true,
        hasRowView: false,
        hasRowDelete: false,
        defaultColumnWidth: 100,
        subtractH: 196,
        height:400,
        actionBarWidth: 200,
        recordFormFormWidth: '40%',
        recordFormTabsWidth: '60%'
      }
    },
    
  ]
};
// 审批中
export const inExaminationAndApproval = {
  resid: 605891699222,
  subtractH: 196,
  formProps: {
    height: 500
  },
  hasSearch: true,
  hasBeBtns: true,
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  hasBeBtns: true,
  recordFormType: 'drawer',
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [
    {
      subTableName: '供应商信息',
      subResid: 606068632909,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        subtractH: 196,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        height: 500,
        defaultColumnWidth: 100,
        actionBarWidth: 200
      }
    },
    {
      subTableName: '审批记录',
      subResid: 605989494375,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowView: true
      }
    }
  ]
};
// 已审批
export const approved = {
  resid: 605891735751,
  subtractH: 196,
  formProps: {
    height: 500
  },
  hasSearch: true,
  hasAdd: false,
  hasBeBtns: true,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  actionBarWidth: 200,
  recordFormType: 'drawer',
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [
    {
      subTableName: '供应商信息',
      subResid: 606068632909,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        // hasRowEdit: true,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        height: 500,
        subtractH: 196,
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
        hasRowView: true,
        subtractH: 196,
      }
    }
  ]
};

// 已拒绝
export const refused = {
  resid: 605891789909,
  // height: 500,
  subtractH: 196,
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
  actionBarWidth: 200,
  recordFormType: 'drawer',
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [
    {
      subTableName: '供应商信息',
      subResid: 606068632909,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        // hasRowEdit: true,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        height: 500,
        subtractH: 196,
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
        hasRowView: true,
        subtractH: 196,
      }
    }
  ]
};

// 历史记录
export const history = {
  resid: 605891824806,
  // height: 500,
  subtractH: 196,
  actionBarWidth: 300,
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
  recordFormType: 'drawer',
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [
    {
      subTableName: '供应商信息',
      subResid: 606068632909,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        // hasRowEdit: true,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        height: 500,
        subtractH: 196,
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
        hasRowView: true,
        subtractH: 196,
      }
    }
  ]
};
