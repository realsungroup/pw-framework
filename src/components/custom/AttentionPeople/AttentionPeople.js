import React from 'react';
import TableData from 'Common/data/TableData';
import './AttentionPeople.less';
import { Header } from '../loadableCustom';

class AttentionPeople extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <TableData
          resid={641471036623}
          subtractH={170}
          actionBarFixed={true}
          height={500}
          size='small'
          actionBarWidth={490}
          hasAdd={false}
          hasModify={false}
          hasDelete={false}
          hasRowDelete={false}
          hasRowView={false}
          hasBeBtns={true}
        />
      </div>
    );
  }
}

export default AttentionPeople;
