import React from 'react';
import './LaborCorSelect.less';
import TableData from '../../../common/data/TableData';
import {Card,Button,Select} from 'antd';


const { Option } = Select;
// const { RangePicker } = DatePicker;
class LaborCorSelect extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    
  };
    
  render() {
    return (
      <TableData
        baseURL = 'http://kingofdinner.realsun.me:1201/'
        resid={620816140260}
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

export default LaborCorSelect;
