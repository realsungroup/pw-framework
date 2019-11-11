import hoistStatics from 'hoist-non-react-statics';

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

/**
 * 获取需要增强功能组件的名称
 * @param {class} WrappedComponent 需要增强功能的组件
 */
function getDisplayName(WrappedComponent) {
  return (
    WrappedComponent.displayName || WrappedComponent.name || 'WrappedComponent'
  );
}

/**
 * 给容器组件添加静态属性和静态方法
 * @param {class} Container 容器组件
 * @param {class} WrappedComponent 需要增强功能的组件
 * @param {string} hocName 高阶组件名称
 */
export function argumentContainer(Container, WrappedComponent, hocName) {
  // 添加静态属性
  Container.displayName = `${hocName}(${getDisplayName(WrappedComponent)})`;
  Container.WrappedComponent = WrappedComponent;

  // 将 WrappedComponent 组件的静态方法 copy 至 Container 组件，类似 Object.assign() 方法
  return hoistStatics(Container, WrappedComponent);
}
