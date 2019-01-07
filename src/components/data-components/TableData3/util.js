export const getColumns = (
  columnsInfo,
  { hasBeSort, defaultColumnWidth, columnsWidth, fixedColumns }
) => {
  const columns = [];
  columnsInfo.forEach(item => {
    const column = {
      width: defaultColumnWidth,
      title: item.text,
      dataIndex: item.id,
      key: item.id,
      align: 'center'
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

  return columns;
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
