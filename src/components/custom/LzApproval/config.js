import React from 'react';
import moment from 'moment';
import {
  message
} from 'antd';
import {
  modRecord
} from 'Util/api';

// 待审批
export const inApplication = {
  resid: 605961664222,
  formProps: {
    height: 550,
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
  subtractH:166,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [{
    subTableName: '访客信息',
    subResid: 606302353251,
    tableProps: {
      hasAdd: false,
      hasModify: false,
      hasDelete: false,
      hasRowModify: false,
      hasRowView: false,
      hasRowDelete: false,
      height: 500,
    }
  }]
};
// 已审批
export const applyForAbnormal = {
  resid: 605961680112,
  formProps: {
    height: 550,
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
  subtractH:166,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [{
    subTableName: '访客信息',
    subResid: 606302353251,
    tableProps: {
      hasAdd: false,
      hasModify: false,
      hasDelete: false,
      hasRowModify: false,
      hasRowView: false,
      hasRowDelete: false,
      height: 500,
    }
  }]
};



// 已拒绝
export const refused = {
  resid: 605961692597,
  formProps:{
    height:550,
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
  subtractH:166,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [{
    subTableName: '访客信息',
    subResid: 606302353251,
    tableProps: {
      hasAdd: false,
      hasModify: false,
      hasDelete: false,
      hasRowModify: false,
      hasRowView: false,
      hasRowDelete: false,
      height: 500,
    }
  }]
};

// 历史记录
export const history = {
  resid: 605961710013,
  formProps:{
    height:550,
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
  subtractH:166,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [{
    subTableName: '访客信息',
    subResid: 606302353251,
    tableProps: {
      hasAdd: false,
      hasModify: false,
      hasDelete: false,
      hasRowModify: false,
      hasRowView: false,
      hasRowDelete: false,
      height: 500,
    }
  }]
};