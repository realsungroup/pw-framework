import React from 'react';
import { DatePicker } from 'antd';
import TableData from '../../../../common/data/TableData';

import './JobAndEmployee.less';

class JobAndEmployee extends React.Component {
  render() {
    return (
      <div className="training-query">
        <div className="training-query_left">
          <div>
            变化期间
            <DatePicker />
            <DatePicker />
          </div>
          <div>变化项目</div>
          <div>
            <TableData
              key="invalid-application-form"
              resid="450383351695"
              subtractH={200}
              hasAdvSearch={false}
              hasAdd={false}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={false}
              hasRowSelection={true}
              actionBarWidth={100}
              dblinkname="ehr"
            />
          </div>
        </div>
        <div className="training-query_right">right</div>
      </div>
    );
  }
}

export default JobAndEmployee;
