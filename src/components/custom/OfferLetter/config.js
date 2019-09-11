import React from 'react';
import moment from 'moment';
import { message } from 'antd';
import { modRecord } from 'Util/api';

// 面试评估表
export const assementForm = {
  resid: 613152706922,
  // height: 600,
  subtractH: 210,
  hasModify: false,
  hasAdd: true,
  hasRowSelection: false,
  hasDelete: false,
  hasRowSelection: false,
  hasRowView: false,
  hasBeBtns: false
};
// 背景调查表
export const referenceCheck = {
  resid: 613152614705,
  defaultColumnWidth:270,
  hasAdd:true,
  hasModify:true,
  hasDelete:false,
  hasrowView:true

};
