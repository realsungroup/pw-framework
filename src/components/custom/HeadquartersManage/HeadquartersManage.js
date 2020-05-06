import React from 'react';
import './HeadquartersManage.less';
import TabsTableData from '../TabsTableData';
import { Modal, Button, message, Tabs, Popconfirm, Input, Form } from 'antd';
class HeadquartersManage extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.headquartersBaseURL;
    this.dlEmployDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.headquartersDownloadURL;
  }
  state = {
    SquareCardArr: [],
    val: null,
    showModal: false,
    EDate: '',
    BDate: '',
    dataSource: [],
    selectRowKeys: []
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
              resid: 576924862772,
              TabsTitle: '招聘人头总部审批',
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
              recordFormType: 'drawer',
              formProps: {
                height: 650
              },
            },
            {
              baseURL: this.baseURL,
              downloadBaseURL: this.dlEmployDownloadURL,
              resid: 576926312667,
              TabsTitle: '录用总部审批',
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
              formProps: {
                height: 650
              },
              recordFormType: 'drawer',
              recordFormContainerProps: {
                placement: 'right',
                height: 700
              }
            }
          ]}
        />
      </div>
    );
  }
}

export default HeadquartersManage;
