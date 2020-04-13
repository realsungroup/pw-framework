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
    val: null,
    
  };
  componentDidMount(){
    var baseURL=window.pwConfig[
      process.env.NODE_ENV
    ].customURLs.onlineTrainning;
    var baseURLDownload=window.pwConfig[
      process.env.NODE_ENV
    ].customURLs.onlineTrainningDownload;
    this.setState({
      baseURL:baseURL,
      baseURLDownload:baseURLDownload
    })
  }
  render() {
    return (
      <TabsTableData
        arr={[
          {
            wrappedComponentRef: element => (this.tableDataRef = element),
            refTargetComponentName: 'TableData',
            resid: 610308370365,
            TabsTitle: '总课程',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            hasAdd: true,
            hasRowDelete: true,
            hasRowModify: true,
            hasRowView: true,
            hasRowSelection: true,
            subtractH: 220,
            recordFormType: 'drawer',
            formProps: {
              height: 550
            },
            recordFormContainerProps: {
              placement: 'right',
              height: 650
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
            hasAdd: true,
            hasRowDelete: true,
            hasRowModify: true,
            hasRowView: true,
            subtractH: 220,
            formProps: {
              height: 550
            },
            recordFormType: 'drawer',
            recordFormContainerProps: {
              placement: 'right',
              height: 700
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
            hasAdd: true,
            hasRowDelete: true,
            hasRowModify: true,
            hasRowView: true,
            subtractH: 220,
            formProps: {
              height: 550
            },
            recordFormType: 'drawer',
            recordFormContainerProps: {
              placement: 'right',
              height: 700
            }
          },
          {
            resid: 624993320876,
            TabsTitle: '新员工课程',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            hasAdd: true,
            hasRowDelete: true,
            hasRowModify: true,
            hasRowView: false,
            subtractH: 180,
            formProps: {
              height: 550
            },
            recordFormType: 'drawer',
            recordFormContainerProps: {
              placement: 'right',
              height: 700
            }
          },
          {
            resid: 625146057740,
            TabsTitle: '培训机构信息',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            hasAdd: true,
            hasRowDelete: true,
            hasRowModify: true,
            hasRowView: false,
            subtractH: 180,
            formProps: {
              height: 550
            },
            recordFormType: 'drawer',
            recordFormContainerProps: {
              placement: 'right',
              height: 700
            }
          },
          {
            resid: 640027948998,
            TabsTitle: '内训在线培训记录',
            OutHeight: '80vh',
            downloadBaseURL:this.state.baseURLDownload,
            baseURL:this.state.baseURL,
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            hasAdd: false,
            hasRowDelete: true,
            hasRowModify: false,
            hasRowView: false,
            subtractH: 180,
            formProps: {
              height: 550
            }},
            {
              resid: 640021774020,
              TabsTitle: '在线内训权限',
              OutHeight: '80vh',
            downloadBaseURL:this.state.baseURLDownload,
              baseURL:this.state.baseURL,
              recordFormFormWidth: '90%',
              hasBeBtns: true,
              hasModify: false,
              hasDelete: false,
              hasAdd: false,
              hasRowDelete: true,
              hasRowModify: false,
              hasRowView: false,
              subtractH: 180,
              formProps: {
                height: 550
              }}

        ]}
      />
    );
  }
}

export default CourseMaintain;
