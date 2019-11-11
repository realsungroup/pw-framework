import React from 'react';
import { Pagination } from 'antd';

/**
 * Pagination
 */
const TablePagination = React.memo(props => {
  return <Pagination {...props} />;
});

export default TablePagination;
