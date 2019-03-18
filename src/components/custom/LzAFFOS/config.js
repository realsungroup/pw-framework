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
  hasBeBtns: true,
  height:500,
  formProps:{
    height:500,
 },
  recordFormType: 'drawer',
  recordFormContainerProps: {
    placement: 'bottom',
    height:600,
  },
  subTableArrProps: [
    {
      subTableName: '访客信息',
      subResid: 606066688508,
      tableProps: {
        hasAdd: true,
        hasModify: false,
        hasDelete: false,
        // hasRowEdit: true,
        hasRowModify: true,
        hasRowView: false,
        hasRowDelete: false,
        height: 400,
        defaultColumnWidth: 100,
        actionBarWidth: 100
      }
    }
  ]
};
// 审批中
export const inExaminationAndApproval = {
  resid: 605803642531,
  hasSearch: true,
  hasBeBtns: true,
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  hasBeBtns: true,
  height:500,
  formProps:{
    height:600,
 },
  recordFormType: 'drawer',
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
        defaultColumnWidth: 100,
        actionBarWidth: 100
      }
    }
  ]
};
// 已审批
export const approved = {
  resid: 605803707282,
  hasSearch: true,
  hasAdd: false,
  hasBeBtns: true,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  recordFormType: 'drawer',
  height:500,
  formProps:{
    height:500,
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
        height: 500,
        defaultColumnWidth: 100,
        actionBarWidth: 100
      }
    }
  ]
};

// 已拒绝
export const refused = {
  resid: 605803740920,
  height:500,
  formProps:{
    height:500,
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
  recordFormContainerProps: {
    placement: 'bottom',
    height: 600
  },
  subTableArrProps: [
    {
      subTableName: '访客信息',
      subResid: 606066688508,
      tableProps: {
        hasAdd: true,
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
    }
  ]
};

// 历史记录
export const history = {
  resid: 605803785490,
  hasAdd: false,
  hasSearch: true,
  height:500,
  formProps:{
    height:500,
 },
  hasBeBtns: true,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
  actionBarWidth: 100,
  recordFormType: 'drawer',
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
        defaultColumnWidth: 100,
        
      }
    }
  ]
};
