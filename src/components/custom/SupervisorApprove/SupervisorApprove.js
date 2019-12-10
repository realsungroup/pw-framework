import React from 'react';
import './SupervisorApprove.less';
import TabsTableData from '../TabsTableData';
import { Tabs } from 'antd';
import http from '../../../util20/api';
import TableData from '../../common/data/TableData';
class SupervisorApprove extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    
  }
  callback = () =>{

  }
  
  render() {
    const { TabPane } = Tabs;
    return (
      <div className='supervisor_wrap'>
      <Tabs defaultActiveKey="1" onChange={this.callback}>
    <TabPane tab="未审批" key="1" >
      <div className='tableOuter'>
      <TableData
        resid={'629316708402'}
        hasModify={false}
        hasAdd={false}
        hasDelete={false}
        hasRowDelete={false}
        hasRowModify={false}
        hasBeBtns={true}
      />
      </div>
    </TabPane>
    <TabPane tab="已审批" key="2">
    <div className='tableOuter'>

    <TableData
        resid={'629316737341'}
        hasModify={false}
        hasAdd={false}
        hasDelete={false}
        hasRowDelete={false}
        hasRowModify={false}
      />
      </div>
      
    </TabPane>
    </Tabs>
    </div>
    );
  }
}

export default SupervisorApprove;
