import React from 'react';
import './ApplyApprove.less';
import TabsTableData from '../TabsTableData';
import { Modal, Button, message, Tabs, Popconfirm } from 'antd';
import http from '../../../util20/api';
class ApplyApprove extends React.Component {
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
            resid: 614449812342,
            TabsTitle: '申请单未审核',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            recordFormUseAbsolute: true,
            hasAdd: false,
            hasRowDelete: false,
            hasRowModify: false,
            hasRowView: true,
            hasRowSelection:true,
            subtractH: 220,
            recordFormType: 'drawer',
            formProps: {
              height: 550
            },
            recordFormContainerProps: {
              placement: 'bottom',
              height: 600
            }
          },
          {
            resid: 614449831159,
            TabsTitle: '申请单已审核',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            hasAdd: false,
            hasRowDelete: false,
            hasRowModify: false,
            recordFormUseAbsolute: true,
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

export default ApplyApprove;
