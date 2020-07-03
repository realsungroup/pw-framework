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
  {
    hasBeSort,
    defaultColumnWidth,
    columnsWidth,
    fixedColumns,
    scrollX,
    tableDataWidth
  },
  cmscolumns,
  hasRowEdit,
  isUseBESize,
  isSetColumnWidth,
  noWidthFields = [],
  noWidthFieldsIndex = [],
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

  columnsInfo.forEach((item, itemIndex) => {
    const column = {
      title: item.text,
      dataIndex: item.id,
      key: item.id,
      fieldName: item.id,
      align: 'center',
      editable: true,
      _editWidth: item[item.id] && item[item.id].Minieditorwidth, // 在行内编辑状态下的宽度
      _editHeight: item[item.id] && item[item.id].Minieditorheight // 在行内编辑状态下的高度
    };

    if (isSetColumnWidth) {
      let columnWidth;
      // 使用后端给的 width
      if (isUseBESize) {
        columnWidth =
          (item[item.id] && item[item.id].CS_SHOW_WIDTH) || defaultColumnWidth;
      } else {
        columnWidth = defaultColumnWidth;
      }
      // 自定义列宽度
      let width = columnsWidth && columnsWidth[item.text];
      if (width) {
        column.width = width;
      }
      column.width = columnWidth;
    }

    // 不需要设置宽度的列
    if (noWidthFields.includes(item.id)) {
      delete column.width;
    }
    console.log({noWidthFieldsIndex})
    if (noWidthFieldsIndex.includes(itemIndex + 1)) {
      delete column.width;
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

export const getHasRowSelection = (hasRowSelection, hasModify, hasDelete) => {
  return hasRowSelection || hasModify || hasDelete;
};

/**
 * 获取行选择配置
 * @param {boolean} hasRowSelection 是否有行选择功能
 * @param {boolean} hasModify 是否有修改
 * @param {*} hasDelete
 * @param {*} rowSelection
 */
export const getRowSelection = (
  hasRowSelection,
  hasModify,
  hasDelete,
  rowSelection
) => {
  if (getHasRowSelection(hasRowSelection, hasModify, hasDelete)) {
    const { columnWidth = 50, ...otherRowSelection } = rowSelection;
    return {
      columnWidth,
      ...otherRowSelection
    };
  }
  return null;
};
