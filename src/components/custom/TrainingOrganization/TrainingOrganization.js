import React from 'react';
import './TrainingOrganization.less';
// import TabsTableData from '../TabsTableData';
import TableData from '../../common/data/TableData';
// import { Modal, Button, message, Tabs, Popconfirm } from 'antd';
// import http from '../../../../util20/api';
class TrainingOrganization extends React.Component {
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
              resid="625156286269"
              subtractH={200}
              hasAdvSearch={false}
              hasAdd={true}
              hasRowView={true}
              hasRowDelete={true}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={true}
              hasRowSelection={true}
              actionBarWidth={100}
              // dblinkname="ehr"
              height={'600px'}
            />
    );
  }
}

export default TrainingOrganization;
