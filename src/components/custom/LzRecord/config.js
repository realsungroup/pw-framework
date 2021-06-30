import React from 'react';
import moment from 'moment';
import { message } from 'antd';
import { modRecord } from 'Util/api';

// 待处理
export const inApplication = {
  resid: 678210125335,
  formProps: {
    height: 550
  },
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: false,
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
      subTableName: '前台登记记录',
      subResid: 606058778224,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: true,
        hasRowView: false,
        hasRowDelete: false,
        height: 500,
        subtractH: 196
      }
    }
  ]
};

// 已处理
export const applyForAbnormal = {
  resid: 678210148858,
  // formProps: {
  //   height: 550,
  // },
  recordFormFormWidth: '40%',
  recordFormTabsWidth: '60%',
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: false,
  hasRowDelete: false,
  hasBeBtns: true,
  subtractH: 200,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 'calc(100vh - 30px)'
  },
  subTableArrProps: [
    {
      subTableName: '前台登记记录',
      subResid: 606058778224,
      tableProps: {
        hasAdd: false,
        hasModify: false,
        hasDelete: false,
        hasRowModify: true,
        hasRowView: false,
        hasRowDelete: false,
        height: 500,
        subtractH: 196
      }
    }
  ]
};
