import React from 'react';
import EditableRow from './EditableRow';
import EditableCell from './EditableCell';

const filterColumns = (columnsInfo, cmscolumns) => {
  const cmscolumnsArr = cmscolumns.split(',');
  return columnsInfo.filter(item => {
    return cmscolumnsArr.some(id => id === item.id);
  });
};

/**
 * 获取分页配置信息
 * @param {object} defaultPagination 默认分页配置：{ current: 1, pageSize: 10 }
 * @param {function} onChange 页码变化时的回调函数
 * @param {function} onShowSizeChange 每页数量发生改变时的回调函数
 */
export const getPagination = (
  defaultPagination,
  onChange,
  onShowSizeChange
) => {
  if (defaultPagination) {
    return {
      ...defaultPagination,
      onChange,
      onShowSizeChange
    };
  } else {
    return {
      current: 1,
      pageSize: 10,
      onChange,
      onShowSizeChange
    };
  }
};

export const getColumns = (
  columnsInfo,
  { hasBeSort, defaultColumnWidth, columnsWidth, fixedColumns },
  cmscolumns,
  hasRowEdit
) => {
  const columns = [];

  // 筛选 cmscolumns
  if (cmscolumns) {
    columnsInfo = filterColumns(columnsInfo, cmscolumns);
  }

  // 开启了行内编辑，自定义单元格所用的组件
  let components;
  if (hasRowEdit) {
    components = {
      body: {
        row: EditableRow,
        cell: EditableCell
      }
    };
  }

  columnsInfo.forEach(item => {
    const column = {
      width: defaultColumnWidth,
      title: item.text,
      dataIndex: item.id,
      key: item.id,
      align: 'center',
      editable: true
    };

    // 自定义列宽度
    let width = columnsWidth && columnsWidth[item.text];
    if (width) {
      column.width = width;
    }

    // 开启了后端排序功能
    if (hasBeSort) {
      column.sorter = true;
    }

    // 固定了列
    if (Array.isArray(fixedColumns) && fixedColumns.indexOf(item.text) !== -1) {
      column.fixed = 'left';
    }

    columns.push(column);
  });
  return { columns, components };
};

// 获取行选择配置
export const getRowSelection = (hasModify, hasDelete, rowSelectionChange) => {
  if (hasModify || hasDelete) {
    return {
      selectedRowKeys: [],
      onChange: rowSelectionChange,
      columnWidth: 50,
      fixed: true
    };
  }
  return null;
};
