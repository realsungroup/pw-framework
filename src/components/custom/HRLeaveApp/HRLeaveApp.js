import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import MainTableSubTables from '../../common/data/MainTableSubTables';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03BaseURL;
const downloadBaseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03DownloadBaseURL;

class HRLeaveApp extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => { };
  render() {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#fff' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="待审批" key="1">
            <MainTableSubTables
              baseURL={baseURL}
              downloadBaseURL={downloadBaseURL}
              resid="513784214608"
              mainTableProps={{
                actionBarWidth: 300,
                hasAdd: true,
                hasBeBtns: true,
                hasModify: true,
                hasBackBtn: true,
                hasDelete: true,
                hasRowModify: true,
                hasRowView: true,
                hasRowDelete: true,
                isUseFormDefine: false,
                mediaFieldBaseURL: 'http://wux-hr03/',
                backendButtonPopConfirmProps: { placement: 'bottom' },
                advSearch: {
                  isRequestFormData: false
                },
                formProps: {
                  showLinkFields: ['C3_451391568463'],
                },
                isUseBESize: true,
                hasBeSort: false,
                subtractH: 180,
                height: 440
              }}
              subTablesProps={{
                446915608629: {
                  hasBeBtns: true,
                  isUseFormDefine: false,
                  baseURL: baseURL,
                  downloadBaseURL: downloadBaseURL,
                  advSearch: {
                    isRequestFormData: false
                  }
                }
              }}
            />
          </TabPane>
          <TabPane tab="已审批" key="2">
            <MainTableSubTables
              baseURL={baseURL}
              downloadBaseURL={downloadBaseURL}
              resid="516107915085"
              mainTableProps={{
                actionBarWidth: 300,
                hasAdd: true,
                hasBeBtns: true,
                hasModify: true,
                hasBackBtn: true,
                hasDelete: true,
                hasRowModify: true,
                hasRowView: true,
                hasRowDelete: true,
                isUseFormDefine: false,
                mediaFieldBaseURL: 'http://wux-hr03/',
                advSearch: {
                  isRequestFormData: false
                },
                formProps: {
                  showLinkFields: ['C3_451391568463'],
                },
                isUseBESize: true,
                hasBeSort: false,
                subtractH: 180,
                height: 440
              }}
              subTablesProps={{
                446915608629: {
                  hasBeBtns: true,
                  isUseFormDefine: false,
                  baseURL: baseURL,
                  downloadBaseURL: downloadBaseURL,
                  advSearch: {
                    isRequestFormData: false
                  }
                }
              }}
            />
          </TabPane>
          <TabPane
            tab="已拒绝"
            key="3"
            style={{ height: 'calc(100vh - 90px)' }}
          >
            <TableData
              resid="521636906178"
              baseURL={baseURL}
              downloadBaseURL={downloadBaseURL}
              mediaFieldBaseURL="http://wux-hr03/"
              actionBarWidth={300}
              actionBarFixed={true}
              hasAdd={false}
              hasBeBtns={false}
              hasModify={false}
              hasBackBtn={false}
              hasDelete={false}
              hasRowModify={false}
              hasRowView={false}
              hasRowDelete={false}
              advSearch={{
                isRequestFormData: false
              }}
              isUseBESize={true}
              hasBeSort={false}
              subtractH={180}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default HRLeaveApp;
