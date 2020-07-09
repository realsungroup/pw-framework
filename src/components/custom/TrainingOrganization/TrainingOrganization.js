import React from 'react';
import './TrainingOrganization.less';
import TabsTableData from '../TabsTableData';
import TableData from '../../common/data/TableData';
// import { Modal, Button, message, Tabs, Popconfirm } from 'antd';
// import http from '../../../../util20/api';
const uploadConfig =  window.pwConfig[process.env.NODE_ENV].trainingClubUploadConfig;

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
      // <TableData
      //         resid="625156286269"
      //         subtractH={200}
      //         hasAdvSearch={false}
      //         hasAdd={true}
      //         hasRowView={true}
      //         hasRowDelete={false}
      //         hasRowEdit={false}
      //         hasDelete={false}
      //         hasModify={false}
      //         hasRowModify={true}
      //         hasRowSelection={true}
      //         actionBarWidth={100}
      //         // dblinkname="ehr"
      //         height={'600px'}
      //       />
            <TabsTableData
        arr={[
          {
            wrappedComponentRef:(element => this.tableDataRef = element),
            refTargetComponentName:"TableData",
            resid: 625156286269,
            TabsTitle: '维护课程信息',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: false,
            hasModify: false,
            hasDelete: false,
            hasAdd: false,
            hasRowDelete: false,
            hasRowModify: true,
            hasRowView: false,
            hasRowSelection:false,
            subtractH: 220,
            recordFormType: 'modal',
            formProps: {
              height: 650
            },
          },
          {
            resid: 627065901638,
            TabsTitle: '上传课程附件',
            OutHeight: '80vh',
            recordFormFormWidth: '95%',
            hasBeBtns: false,
            hasModify: false,
            hasDelete: false,
            hasAdd: false,
            hasRowDelete: false,
            hasRowModify: true,
            hasRowView: false,
            subtractH: 220,
            formProps: {
              height: 880
            },
            recordFormType: 'modal',
            uploadConfig:uploadConfig
          }
        ]}
      />
    );
  }
}

export default TrainingOrganization;
