import React from 'react';
import './CourseMaintain.less';
import TabsTableData from '../TabsTableData';
// import { Modal, Button, message, Tabs, Popconfirm } from 'antd';
// import http from '../../../../util20/api';
class CourseMaintain extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    SquareCardArr: [],
    val: null
  };
  
  render() {
    return (
      <TabsTableData
        arr={[
          {
            wrappedComponentRef:(element => this.tableDataRef = element),
            refTargetComponentName:"TableData",
            resid: 610308370365,
            TabsTitle: '总课程',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: false,
            hasModify: false,
            hasDelete: false,
            hasAdd: false,
            hasRowDelete: false,
            hasRowModify: false,
            hasRowView: true,
            hasRowSelection:true,
            subtractH: 220,
            recordFormType: 'drawer',
            formProps: {
              height: 700
            },
            recordFormContainerProps: {
              placement: 'right',
              height: 700
            }
          },
          {
            resid: 616155060405,
            TabsTitle: '内训课程',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            hasAdd: false,
            hasRowDelete: false,
            hasRowModify: false,
            hasRowView: true,
            subtractH: 220,
            formProps: {
              height: 550
            },
            recordFormType: 'drawer',
            recordFormContainerProps: {
              placement: 'bottom',
              height: 600
            }
          },
          {
            resid: 624970414826,
            TabsTitle: '外训课程',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            hasAdd: false,
            hasRowDelete: false,
            hasRowModify: false,
            hasRowView: true,
            subtractH: 220,
            formProps: {
              height: 550
            },
            recordFormType: 'drawer',
            recordFormContainerProps: {
              placement: 'bottom',
              height: 600
            }
          }
        ]}
      />
    );
  }
}

export default CourseMaintain;
