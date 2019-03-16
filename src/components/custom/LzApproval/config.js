import React from 'react';
import moment from 'moment';
import {
  message
} from 'antd';
import {
  modRecord
} from 'Util/api';

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

// 待审批
export const inApplication = {
  resid: 605961664222,
  formProps: {
    height: 500,
  },
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  hasBeBtns: true,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [{
    subTableName: '访客信息',
    subResid: 605716014733,
    tableProps: {
      hasAdd: false,
      hasModify: false,
      hasDelete: false,
      hasRowModify: false,
      hasRowView: false,
      hasRowDelete: false,
      width: 700,
      height: 500,
      defaultColumnWidth: 100,
      actionBarWidth: 100
    }
  }]
};
// 已审批
export const applyForAbnormal = {
  resid: 605961680112,
  formProps: {
    height: 500,
  },
  hasBeBtns: true,
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [{
    subTableName: '访客信息',
    subResid: 605716014733,
    tableProps: {
      hasAdd: false,
      hasModify: false,
      hasDelete: false,
      hasRowModify: false,
      hasRowView: false,
      hasRowDelete: false,
      width: 700,
      height: 500,
      defaultColumnWidth: 100,
      actionBarWidth: 100
    }
  }]
};



// 已拒绝
export const refused = {
  resid: 605961692597,
  formProps:{
    height:500,
 },
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  hasBeBtns: true,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [{
    subTableName: '访客信息',
    subResid: 605716014733,
    tableProps: {
      hasAdd: false,
      hasModify: false,
      hasDelete: false,
      hasRowModify: false,
      hasRowView: false,
      hasRowDelete: false,
      width: 700,
      height: 500,
      defaultColumnWidth: 100,
      actionBarWidth: 100
    }
  }]
};

// 历史记录
export const history = {
  resid: 605961710013,
  formProps:{
    height:500,
  },
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  hasBeBtns: true,
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [{
    subTableName: '访客信息',
    subResid: 605716014733,
    tableProps: {
      hasAdd: false,
      hasModify: false,
      hasDelete: false,
      hasRowModify: false,
      hasRowView: false,
      hasRowDelete: false,
      width: 700,
      height: 500,
      defaultColumnWidth: 100,
      actionBarWidth: 100
    }
  }]
};