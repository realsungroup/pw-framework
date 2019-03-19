import React from 'react';
import moment from 'moment';
import { message } from 'antd';
import { modRecord } from 'Util/api';

// 待处理
export const inApplication = {
  resid: 605892972967,
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
    }
  }]
};

// 已处理
export const applyForAbnormal = {
  resid: 605892990971,
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
    }
  }]
};