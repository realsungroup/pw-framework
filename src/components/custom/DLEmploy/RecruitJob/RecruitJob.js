import React from 'react';
import './RecruitJob.less';
import TableData from '../../../common/data/TableData';
class RecruitJob extends React.Component {
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
        baseURL = 'http://kingofdinner.realsun.me:1201/'
        resid={617195632278}
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

export default RecruitJob;
