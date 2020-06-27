import React from 'react';
import './WageCardInformation.less';
import TabsTableData from '../TabsTableData';
import { Modal, Button, message, Tabs, Popconfirm, Input, Form } from 'antd';
// import http from '../../../../util20/api';
class WageCardInformation extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.wuxiHr03BaseURL;
    this.dlEmployDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.wuxiHr03DownloadBaseURL;
  }
  state = {
    SquareCardArr: [],
    val: null,
  };
  
  render() {
    return (
      <div>
        <TabsTableData
          arr={[
            {
              wrappedComponentRef: element => (this.tableDataRef = element),
              refTargetComponentName: 'TableData',
              baseURL: this.baseURL,
              downloadBaseURL: this.dlEmployDownloadURL,
              resid: 497727888930,
              TabsTitle: '在职',
              OutHeight: '91vh',
              recordFormFormWidth: '90%',
              hasBeBtns: false,
              hasModify: false,
              hasDelete: false,
              hasAdd: false,
              hasRowDelete: true,
              hasRowSelection: true,
              hasRowModify: true,
              hasRowView: true,
              subtractH: 220,
              actionBarWidth: 220,
              recordFormType: 'modal',
              isUseFormDefine:false,
              isWrap:true,
              formProps: {
                height: 650
              },
            },
            {
              baseURL: this.baseURL,
              downloadBaseURL: this.dlEmployDownloadURL,
              resid: 498135595185,
              TabsTitle: '离职',
              OutHeight: '91vh',
              recordFormFormWidth: '90%',
              hasBeBtns: true,
              hasModify: false,
              hasDelete: false,
              hasAdd: false,
              hasRowDelete: true,
              hasRowModify: true,
              hasRowView: true,
              subtractH: 220,
              actionBarWidth: 220,
              isUseFormDefine:false,
              isWrap:true,
              formProps: {
                height: 650
              },
              recordFormType: 'modal',
            }
          ]}
        />
      </div>
    );
  }
}

export default WageCardInformation;
