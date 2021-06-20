import { getRenderedPwTableColumnsWidth } from './getRenderedPwTableColumnsWidth';

/**
 * @param {array} columns 列数据
 * @param {object} options options
 * @returns {array} columns
 */
export const getUpdatedWithColumns = async (columns, options) => {
  const { columnMaxWidth, containerSelector, dataSource } = options;

  let renderColumns = [];
  if (typeof columnMaxWidth === 'number') {
    renderColumns = [...columns];
  } else {
    Object.keys(columnMaxWidth).forEach(key => {
      const column = columns.find(column => column.dataIndex === key);
      renderColumns.push(column);
    });
  }

  const result = await getRenderedPwTableColumnsWidth(
    containerSelector,
    renderColumns,
    dataSource
  );

  let newColumns = columns.map(column => {
    const withWidthColumn = result.find(
      item => item.dataIndex === column.dataIndex
    );
    if (withWidthColumn && withWidthColumn.width) {
      // 当列的内容宽度小于等于设置的列的宽度时，取列的内容宽度，否则取设置的列的宽度
      // 也就是设置的列宽度为最大的宽度

      const maxWidth =
        typeof columnMaxWidth === 'number'
          ? columnMaxWidth
          : columnMaxWidth[column.dataIndex];
      const contentWidth = withWidthColumn.width;

      const width = contentWidth <= maxWidth ? contentWidth : maxWidth;

      return {
        ...column,
        width
      };
    }
    return { ...column };
  });

  return newColumns;
};

export const getColumnMaxWithByBEWith = cmsColumnsInfo => {
  const columnMaxWidth = {};
  cmsColumnsInfo.forEach(cmsColumn => {
    columnMaxWidth[cmsColumn.id] = cmsColumn[cmsColumn.id].CS_SHOW_WIDTH;
  });
  return columnMaxWidth;
};

export const getDealedTableBlankIssueColumns = (columns, options) => {
  const { rowSelectionWidth, tableWidth, actionBarWidth } = options;
  const noWithColumn = columns.find(column => !column.width);
  if (noWithColumn) {
    return columns;
  }

  let sum = columns.reduce((acc, cur) => {
    return acc + cur.width;
  }, rowSelectionWidth + actionBarWidth);

  if (sum >= tableWidth) {
    return columns;
  }

  const columnAddWidth = (tableWidth - sum) / columns.length;

  return columns.map(column => ({
    ...column,
    width: column.width + columnAddWidth
  }));
};
