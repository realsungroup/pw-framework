import React from 'react';
import TableData from '../../common/data/TableData';

class TableDataDiscipline extends React.Component {
  state = {
    visible: false,
    record: null,
    readOnly: true
  };
 
  //奖惩-查看个人违纪
  

  handleOk = () => {
    this.setState({
      visible: false
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    
    return (
      <div
        className="table-data-wrap"
        style={{ height: '100vh' }}
      >
        <TableData
          resid={622206065690}
          subtractH={220}
          hasBeBtns={false}
          hasRowSelection={false}
          hasAdd={false}
          hasRowView={true}
          hasModify={false}
          hasRowDelete={false}
          hasDelete={false}
          hasRowModify={false}
          height="100%"
        />
       
      </div>
    );
  }
}

export default TableDataDiscipline 