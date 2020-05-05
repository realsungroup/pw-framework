import React from 'react';
import TableData from 'Common/data/TableData';
import './PersonInfor.less';
import { Header } from '../loadableCustom';

/**
 * 机构选项-人员信息
 */

class PersonInfor extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <TableData
          resid={641574720816}
          subtractH={170}
          actionBarFixed={true}
          height={500}
          size='small'
          actionBarWidth={490}
          hasAdd={true}
          hasModify={false}
          hasDelete={false}
          hasRowDelete={true}
          hasRowView={false}
          hasBeBtns={true}
        />
      </div>
    );
  }
}

export default PersonInfor;
