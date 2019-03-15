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

// 待访问
export const inApplication= {
  resid: 605802492264,
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
};

// 访问中
export const applyForAbnormal = {
  resid: 605802635754,
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
};

// 已拒绝
export const approved = {
  resid: 605802654230,
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
};

// 已访问
export const refused = {
  resid: 605802654230,
  hasAdd: false,
  hasModify: false,
  hasDelete: false,
  hasRowModify: false,
  hasRowView: true,
  hasRowDelete: false,
};

// 历史记录
export const history = {
  resid: 605897558606,
  exceptTableInnerHeight: 400,
  addBtn: false,
  opIsFixed: true,
  hasDownloadExcel: true,
  pagination: {
    pageSize: 10, // 默认每页数量
    current: 0 // 当前页数
  },
  isSearch: true,
  hasRefresh: true,
  advSearchConfig,
  customColumnWidth,
  tableSize: 'small',
  isSortBE: true
};

// 审批中
export const inExaminationAndApproval = {
  resid: 596816381916,
  exceptTableInnerHeight: 400,
  addBtn: false,
  opIsFixed: true,
  hasDownloadExcel: true,
  pagination: {
    pageSize: 10, // 默认每页数量
    current: 0 // 当前页数
  },
  isSearch: true,
  hasRefresh: true,
  advSearchConfig,
  customColumnWidth,
  tableSize: 'small',
  isBackEndBtnsVisible: true,
  customBtns: [
    {
      text: '撤销', // 按钮名称
      popConfirmProps: {
        title: '确定撤销？'
      }, // PopConfirm 组件配置
      onClick: async (record, callback) => {
        // 点击回调
        const newRecord = { C3_593523276035: 'Y', REC_ID: record.REC_ID };
        let res;
        try {
          res = await modRecord(593444507094, newRecord);
        } catch (err) {
          return message.error(err.message);
        }
        message.success('撤销成功');
        callback && callback();
      }
    }
  ],
  formTabsSubTableProps: [
    {
      tabName: '审批记录', // 标题
      componentInfo: {
        name: 'LzTable', // 组件名称
        props: {
          // 组件接受的 props
          subresid: 593202125987, // 必传
          // 其他参数为 LzTable 所能接受的参数
          btnsVisible: {
            check: true
          },
          opIsFixed: true,
          tableSize: 'small',
          customColumnWidth: {
            审批序号: 100,
            审批节点: 100,
            审批结果: 100,
            审批人: 100,
            审批时间: 100,
            日剩余加班额度: 150,
            累计加班小时: 150,
            月剩余加班额度: 150
          }
        }
      }
    }
  ]
};
