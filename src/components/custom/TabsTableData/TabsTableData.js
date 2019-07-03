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
    let arr = []
    if(this.props[0]&&this.props[0].length>0){
      arr = this.props[0]
    }else if(this.props.arr&&this.props.arr.length>0){
      arr = this.props.arr
    }
   return  arr&&arr.map((prop,index) => {
     if(!prop.OutHeight){
       prop.OutHeight = '90vh'
     }
     return ( 
     <TabPane
        
        tab={prop.TabsTitle}
        key={index+1}
        style={{ width: '100%',height:"100%"  }}
      >
        
      <div className="table-data-wrap" style={{height: prop.OutHeight}}>
        <TableData
          {...prop}
        />
        </div>
      </TabPane>  
      ) 
    })
  }
  render() {
    const {data} = this.state
    return (
      <div className="table-data-wrap" style={{width:"100%",height:"100%"}} >
        <Tabs
          defaultActiveKey="1"
          style={{ width: '100%', backgroundColor: '#fff',height:"100%" }}
        >
        
        {this.show()}
        </Tabs>
      </div>
    );
  }
}

export default TabsTableData;
