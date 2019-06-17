import React from 'react';
import { TableDataC } from '../loadableCustom';
import { TableData } from '../../common/loadableCommon';
import { Button, Modal, DatePicker, message, Tabs } from 'antd';
import { saveMultipleRecord } from '../../../util/api';
import http from '../../../util20/api';
import TableDataWrap from '../TableDataWrap';
const TabPane = Tabs.TabPane;

class TableDataHR extends React.Component {
  state = { visible: false, date: '', dataSource: [], selectedRowKeys: '' };
  constructor(props) {
    super(props);
    const data = []
    
    // props.map((prop) => {
    //   console.log("ree",prop)
    //   // data.push(prop)
    // })
    // console.log("props",props)
    // data.map((res) => {
    //   console.log("res",res)
    // })
    // console.log("data",data)
    // this.state={
    //   data:data
    // }
  }
  show = () => {
   return  this.props[0]&&this.props[0].map((prop,index) => {
      console.log("res",prop)
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
          {/* {this.state.data&&this.state.data.map((res,index) => {
            console.log("数据",res)
           return ( 
           <TabPane
              tab="未通知"
              key={index + 1}
              style={{ width: '100%', height: '100%' }}
            >
              <TableDataWrap
                resid={res.resid}
                getcolumninfo="1"
                pageSize="10"
                page="1"
                size="small"
                hasRowSelection={true}
                hasAdd={false}
                hasBeBtns={false}
                hasDelete={false}
                hasRowModify={true}
                hasRowView={false}
                hasRowDelete={true}
                hasModify={false}
                subtractH={240}
                height={500}
                actionBarFixed={true}
                hasZoomInOut={true}
              />
            </TabPane>
            ) 
          })} */}
          {/* <TabPane
            tab="未通知"
            key="1"
            style={{ width: "100%", height: "100%" }}
          >
            <TableDataWrap
              refTargetComponentName="TableData"
              wrappedComponentRef={element => (this.tableDataRef = element)}
              {...this.props}
              resid="603303655900"
              getcolumninfo="1"
              pageSize="10"
              page="1"
              size="small"
              hasRowSelection={true}
              hasAdd={false}
              hasBeBtns={false}
              hasDelete={false}
              hasRowModify={true}
              hasRowView={false}
              hasRowDelete={true}
              hasModify={false}
              subtractH={240}
              height={500}
              actionBarFixed={true}
              hasZoomInOut={true}
              actionBarExtra={({
                dataSource: dataSource,
                selectedRowKeys: selectedRowKeys
              }) => {
                return (
                  <Button
                    onClick={() => {
                      this.onHandleMessage(dataSource, selectedRowKeys);
                    }}
                  >
                    面试通知
                  </Button>
                );
              }}
            />
          </TabPane> */}
        </Tabs>
      </div>
    );
  }
}

export default TableDataHR;
