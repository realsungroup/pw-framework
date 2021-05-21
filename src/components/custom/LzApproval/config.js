import React from 'react';
import moment from 'moment';
import { message } from 'antd';
import { modRecord } from 'Util/api';

// 待审批
export const inApplication = {
  resid: 605961664222,
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
    height: 'calc(100vh - 60px)'
  },
  subTableArrProps: [
    {
      subTableName: '访客信息',
      subResid: 606066688508,
      tableProps: {
        hasAdd: true,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        height: 500
      }
    },
    {
      subTableName: '带出厂物品信息',
      subResid: 669820837743,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        subtractH: 196,
        height: 500,
        defaultColumnWidth: 100
      }
    }
  ]
};
// 已审批
export const applyForAbnormal = {
  resid: 605961680112,
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
      subTableName: '访客信息',
      subResid: 606066688508,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        height: 500
      }
    },
    {
      subTableName: '带出厂物品信息',
      subResid: 669820837743,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        subtractH: 196,
        height: 500,
        defaultColumnWidth: 100
      }
    }
  ]
};

// 已拒绝
export const refused = {
  resid: 605961692597,
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
  advSearch: {
    formName: 'defaultSearch'
  },
  recordFormContainerProps: {
    placement: 'bottom',
    height: 'calc(100vh - 30px)'
  },
  subTableArrProps: [
    {
      subTableName: '访客信息',
      subResid: 606066688508,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        height: 500
      }
    },
    {
      subTableName: '带出厂物品信息',
      subResid: 669820837743,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        subtractH: 196,
        height: 500,
        defaultColumnWidth: 100
      }
    }
  ]
};

// 历史记录
export const history = {
  resid: 605961710013,
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
  advSearch: {
    formName: 'defaultSearch'
  },
  recordFormContainerProps: {
    placement: 'bottom',
    height: 'calc(100vh - 30px)'
  },
  subTableArrProps: [
    {
      subTableName: '访客信息',
      subResid: 606066688508,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        height: 500
      }
    },
    {
      subTableName: '带出厂物品信息',
      subResid: 669820837743,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: false,
        hasRowView: false,
        hasRowDelete: false,
        subtractH: 196,
        height: 500,
        defaultColumnWidth: 100
      }
    }
  ]
};
