import React from 'react';
import { TableData } from '../../common/loadableCommon';

class TableDataWrap extends React.Component{
  render(){
    return (
      <div className="table-data-wrap" style={{height: '100vh'}}>
        <TableData {...this.props} />
      </div>
    )
  }
}

export default TableDataWrap;