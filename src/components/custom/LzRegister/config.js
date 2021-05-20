import React from 'react';
import moment from 'moment';
import { message } from 'antd';
import { modRecord } from 'Util/api';

// 待访问
export const inApplication = {
  resid: 605802492264,
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
  subtractH: 196,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 'calc(100vh - 30px)'
  },
  subTableArrProps: [
    {
      subTableName: '访客进出登记',
      subResid: 606054433923,
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

// 访问中
export const applyForAbnormal = {
  resid: 674217539047,
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
  subtractH: 196,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 'calc(100vh - 30px)'
  },
  subTableArrProps: [
    {
      subTableName: '访客进出登记',
      subResid: 606054433923,
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

// 已访问
export const refused = {
  resid: 605802654230,
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
  subtractH: 196,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 'calc(100vh - 30px)'
  },
  subTableArrProps: [
    {
      subTableName: '访客进出登记',
      subResid: 606054433923,
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
