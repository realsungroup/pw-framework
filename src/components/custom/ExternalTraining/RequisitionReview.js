import React from 'react';
import { TableData } from '../../common/loadableCommon';

function ReviewRequisition(props) {
  return (
    <div style={{flex:1}}>
      <TableData
        resid="614184482830"
        height='100%'
        subtractH={200}
        hasRowView={false}
        hasModify={false}
        hasDelete={false}
        hasRowSelection={true}
      />
    </div>
  );
}

export default ReviewRequisition;
