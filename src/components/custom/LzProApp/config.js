import React from 'react';
import moment from 'moment';
import { message } from 'antd';
import { modRecord } from 'Util/api';

// 申请中
export const inApplication = {
  resid: 606243045601,
  // height:'100%',
  formProps: {
    height: 550
  },
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  hasBeBtns: true,
  subtractH: 196,
  hasRowSelection: true,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 'calc(100vh - 30px)'
  },
  subTableArrProps: [
    {
      subTableName: '供应商信息',
      subResid: 606302353251,
      // dataMode: 'main',
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        subtractH: 196,
        height: 500
      }
    }
    // {
    //   subTableName: '带出厂物品信息',
    //   subResid: 669820837743,
    //   tableProps: {
    //     hasAdd: false,
    //     hasModify: false,
    //     hasDelete: false,
    //     hasRowModify: false,
    //     hasRowView: false,
    //     hasRowDelete: false,
    //     subtractH: 196,
    //     height: 500,
    //     defaultColumnWidth: 100
    //   }
    // }
  ]
};
// 已审批
export const applyForAbnormal = {
  resid: 606243075484,
  formProps: {
    height: 550
  },
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  hasBeBtns: true,
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  subtractH: 196,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 'calc(100vh - 30px)'
  },
  subTableArrProps: [
    {
      subTableName: '供应商信息',
      subResid: 606302353251,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        subtractH: 196,
        hasRowDelete: false,
        height: 500
      }
    }
    // {
    //   subTableName: '带出厂物品信息',
    //   subResid: 669820837743,
    //   tableProps: {
    //     hasAdd: false,
    //     hasModify: false,
    //     hasDelete: false,
    //     hasRowModify: false,
    //     hasRowView: false,
    //     hasRowDelete: false,
    //     subtractH: 196,
    //     height: 500,
    //     defaultColumnWidth: 100
    //   }
    // }
  ]
};

// 已拒绝
export const refused = {
  resid: 606243102338,
  formProps: {
    height: 550
  },
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  hasBeBtns: true,
  subtractH: 196,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 'calc(100vh - 30px)'
  },
  subTableArrProps: [
    {
      subTableName: '供应商信息',
      subResid: 606302353251,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        subtractH: 196,
        hasRowDelete: false,
        height: 500
      }
    }
    // {
    //   subTableName: '带出厂物品信息',
    //   subResid: 669820837743,
    //   tableProps: {
    //     hasAdd: false,
    //     hasModify: false,
    //     hasDelete: false,
    //     hasRowModify: false,
    //     hasRowView: false,
    //     hasRowDelete: false,
    //     subtractH: 196,
    //     height: 500,
    //     defaultColumnWidth: 100
    //   }
    // }
  ]
};

// 历史记录
export const history = {
  resid: 606243117327,
  formProps: {
    height: 550
  },
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  hasBeBtns: true,
  subtractH: 196,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 'calc(100vh - 30px)'
  },
  subTableArrProps: [
    {
      subTableName: '供应商信息',
      subResid: 606302353251,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        subtractH: 196,
        height: 500
      }
    }
    // {
    //   subTableName: '带出厂物品信息',
    //   subResid: 669820837743,
    //   tableProps: {
    //     hasAdd: false,
    //     hasModify: false,
    //     hasDelete: false,
    //     hasRowModify: false,
    //     hasRowView: false,
    //     hasRowDelete: false,
    //     subtractH: 196,
    //     height: 500,
    //     defaultColumnWidth: 100
    //   }
    // }
  ]
};
