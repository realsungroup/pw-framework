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
