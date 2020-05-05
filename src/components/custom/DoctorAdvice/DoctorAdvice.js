import React from 'react';
import TableData from 'Common/data/TableData';
import './DoctorAdvice.less';
import Header from '../Header';

/**
 * 医嘱济洛路
 */

class DoctorAdvice extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <TableData
          resid={641579508301}
          subtractH={170}
          actionBarFixed={true}
          height={500}
          size='small'
          actionBarWidth={490}
          hasAdd={true}
          hasModify={false}
          hasDelete={false}
          hasRowDelete={true}
          hasRowModify={true}
          hasRowView={true}
          hasBeBtns={true}
        />
      </div>
    );
  }
}

export default DoctorAdvice;
