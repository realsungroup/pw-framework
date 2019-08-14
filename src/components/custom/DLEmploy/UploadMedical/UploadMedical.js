import React from 'react';
import './UploadMedical.less';
import TableData from '../../../common/data/TableData';
class UploadMedical extends React.Component {
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
        baseURL='http://kingofdinner.realsun.me:1201/'
        resid={618666652590}
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

export default UploadMedical;
