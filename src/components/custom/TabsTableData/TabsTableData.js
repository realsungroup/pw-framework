import React from 'react';
import { TableDataC } from '../loadableCustom';
import { TableData } from '../../common/loadableCommon';
import { Button, Modal, DatePicker, message, Tabs } from 'antd';
import { saveMultipleRecord } from '../../../util/api';
import http from '../../../util20/api';
import TableDataWrap from '../TableDataWrap';
const TabPane = Tabs.TabPane;

class TabsTableData extends React.Component {
  state = { visible: false, date: '', dataSource: [], selectedRowKeys: '' };
  constructor(props) {
    super(props);
  }
  show = () => {
   return  this.props[0]&&this.props[0].map((prop,index) => {
     return ( 
     <TabPane
        tab={prop.TabsTitle}
        key={index+1}
        style={{ width: '100%', height: '100%' }}
      >
        <TableDataWrap
          {...prop}
        />
      </TabPane>
      ) 
    })
  }
  render() {
    const {data} = this.state
    return (
      <div className="table-data-wrap" style={{ height: '100vh' }}>
        <Tabs
          defaultActiveKey="1"
          style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}
        >
        
        {this.show()}
        </Tabs>
      </div>
    );
  }
}

export default TabsTableData;
