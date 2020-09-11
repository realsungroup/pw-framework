import React from 'react';
import './PersonnelImport.less';
import TabsTableData from '../TabsTableData';
import { Modal, Button, message, Tabs, Popconfirm, Input, Form } from 'antd';
// import http from '../../../../util20/api';
class PersonnelImport extends React.Component {
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
              resid: 424904771305,
              TabsTitle: '人员信息导入',
              OutHeight: '91vh',
              recordFormFormWidth: '90%',
              hasBeBtns: true,
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
              isUseFormDefine: false,
              // isSetColumnWidth:false,
              isWrap: true,
              formProps: {
                height: 650
              },
              advSearch: {
                isRequestFormData: false,
              },
            },
            {
              baseURL: this.baseURL,
              downloadBaseURL: this.dlEmployDownloadURL,
              resid: 424566070449,
              TabsTitle: '离职操作导入',
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
              isUseFormDefine: false,
              // isSetColumnWidth:false,
              isWrap: true,
              formProps: {
                height: 650
              },
              advSearch: {
                isRequestFormData: false,
              },
              recordFormType: 'modal',
            },
            {
              baseURL: this.baseURL,
              downloadBaseURL: this.dlEmployDownloadURL,
              resid: 603468350125,
              TabsTitle: '除名导入',
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
              isUseFormDefine: false,
              // isSetColumnWidth:false,
              isWrap: true,
              formProps: {
                height: 650
              },
              advSearch: {
                isRequestFormData: false,
              },
              recordFormType: 'modal',
            },
          ]}
        />
      </div>
    );
  }
}

export default PersonnelImport;
