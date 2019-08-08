import React from 'react';
import './Development.less';
import TableData from '../../../common/data/TableData';
class Development extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    SquareCardArr: [],
    val: null
  };
  render() {
    return (
      <TableData
        resid={618225629802}
        subtractH={220}
        hasBeBtns={false}
        hasRowSelection={false}
        hasAdd={true}
        hasRowView={false}
        hasModify={false}
        hasRowDelete={true}
        hasDelete={false}
        hasRowModify={true}
        height="100%"
      ></TableData>
    );
  }
}

export default Development;
