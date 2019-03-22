import React from 'react';
import { TableData } from '../../common/loadableCommon';

class TableDataWrap extends React.Component{
  render(){
    return (
      <div className="table-data-wrap" style={{height: 'calc(100vh - 220px)'}}>
        <TableData {...this.props} />
      </div>
    )
  }
}

export default TableDataWrap;