import React from 'react';
import './S1S2RecruitApply.less';
import TabsTableData from '../TabsTableData';
import { Modal, Button, message, Tabs, Popconfirm, Input, Form } from 'antd';
// import http from '../../../../util20/api';
import MainTableSubTables from '../../common/data/MainTableSubTables/MainTableSubTables';

const TabPane = Tabs.TabPane;

class S1S2RecruitApply extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.wuxiHr03BaseURL;
    this.downloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.wuxiHr03DownloadBaseURL;
  }
  state = {
    SquareCardArr: [],
    val: null
  };

  render() {
    return (
      <div>
        <Tabs
          defaultActiveKey="1"
          style={{ width: '100%', backgroundColor: '#fff', height: "100%" }}
        >
          <TabPane
            tab="申请中"
            key={1}
            style={{ width: '100%', height: '100%' }}
          >
            <MainTableSubTables
              baseURL={this.baseURL}
              downloadBaseURL={this.downloadURL}
              resid={518992241469}
              mainTableProps={{
                recordFormFormWidth: '90%',
                hasBeBtns: true,
                hasModify: false,
                hasDelete: false,
                hasAdd: true,
                hasRowDelete: true,
                hasRowSelection: true,
                hasRowModify: true,
                hasRowView: true,
                subtractH: 200,
                actionBarWidth: 220,
                recordFormType: 'modal',
                isUseFormDefine: false,
                height: 'calc(100vh - 60px)',
                isSetColumnWidth: true,
                // noWidthFields: 'C3_518986364887',
                isWrap: true,
                formProps: { height: 650 },
                advSearch: {
                  isRequestFormData: false
                }
              }}
              subTablesProps={{
                518986543520: {
                  hasBeBtns: true,
                  isUseFormDefine: false,
                  baseURL: this.baseURL,
                  downloadBaseURL: this.downloadURL,
                  advSearch: {
                    isRequestFormData: false
                  }
                },
                527715777875: {
                  isUseFormDefine: false,
                  hasBeBtns: true,
                  baseURL: this.baseURL,
                  downloadBaseURL: this.downloadURL,
                  advSearch: {
                    isRequestFormData: false
                  }
                }
              }}
            ></MainTableSubTables>
          </TabPane>
          <TabPane
            tab="审批中"
            key={2}
            style={{ width: '100%', height: '100%' }}
          >
            <MainTableSubTables
              baseURL={this.baseURL}
              downloadBaseURL={this.downloadURL}
              resid={528143590767}
              mainTableProps={{
                recordFormFormWidth: '90%',
                hasBeBtns: true,
                hasModify: false,
                hasDelete: false,
                hasAdd: false,
                subtractH: 200,
                actionBarWidth: 220,
                isUseFormDefine: false,
                // isSetColumnWidth:false,
                height: 'calc(100vh - 60px)',
                isWrap: true,
                formProps: {
                  height: 650
                },
                advSearch: {
                  isRequestFormData: false,
                },
                recordFormType: 'modal',
              }}
              subTablesProps={{
                518986543520: {
                  hasBeBtns: true,
                  isUseFormDefine: false,
                  baseURL: this.baseURL,
                  downloadBaseURL: this.downloadURL,
                  advSearch: {
                    isRequestFormData: false
                  }
                },
                527715777875: {
                  isUseFormDefine: false,
                  hasBeBtns: true,
                  baseURL: this.baseURL,
                  downloadBaseURL: this.downloadURL,
                  advSearch: {
                    isRequestFormData: false
                  }
                }
              }}
            ></MainTableSubTables>
          </TabPane>
          <TabPane
            tab="审批通过"
            key={3}
            style={{ width: '100%', height: '100%' }}
          >
            <MainTableSubTables
              baseURL={this.baseURL}
              downloadBaseURL={this.downloadURL}
              resid={528143607350}
              mainTableProps={{
                recordFormFormWidth: '90%',
                hasBeBtns: true,
                hasModify: false,
                hasDelete: false,
                hasAdd: false,
                subtractH: 200,
                actionBarWidth: 220,
                isUseFormDefine: false,
                height: 'calc(100vh - 60px)',
                // isSetColumnWidth:false,
                isWrap: true,
                formProps: {
                  height: 650
                },
                advSearch: {
                  isRequestFormData: false,
                },
                recordFormType: 'modal',
              }}
              subTablesProps={{
                518986543520: {
                  hasBeBtns: true,
                  isUseFormDefine: false,
                  baseURL: this.baseURL,
                  downloadBaseURL: this.downloadURL,
                  advSearch: {
                    isRequestFormData: false
                  }
                },
                527715777875: {
                  isUseFormDefine: false,
                  hasBeBtns: true,
                  baseURL: this.baseURL,
                  downloadBaseURL: this.downloadURL,
                  advSearch: {
                    isRequestFormData: false
                  }
                }
              }}
            ></MainTableSubTables>
          </TabPane>
          <TabPane
            tab="审批拒绝"
            key={4}
            style={{ width: '100%', height: '100%' }}
          >
            <MainTableSubTables
              baseURL={this.baseURL}
              downloadBaseURL={this.downloadURL}
              resid={528143623060}
              mainTableProps={{
                recordFormFormWidth: '90%',
                hasBeBtns: true,
                hasModify: false,
                hasDelete: false,
                hasAdd: false,
                hasRowDelete: true,
                hasRowModify: true,
                hasRowView: true,
                subtractH: 200,
                actionBarWidth: 220,
                isUseFormDefine: false,
                height: 'calc(100vh - 60px)',
                // isSetColumnWidth:false,
                isWrap: true,
                formProps: {
                  height: 650
                },
                advSearch: {
                  isRequestFormData: false,
                },
                recordFormType: 'modal',
              }}
              subTablesProps={{
                518986543520: {
                  hasBeBtns: true,
                  isUseFormDefine: false,
                  baseURL: this.baseURL,
                  downloadBaseURL: this.downloadURL,
                  advSearch: {
                    isRequestFormData: false
                  }
                },
                527715777875: {
                  isUseFormDefine: false,
                  hasBeBtns: true,
                  baseURL: this.baseURL,
                  downloadBaseURL: this.downloadURL,
                  advSearch: {
                    isRequestFormData: false
                  }
                }
              }}
            ></MainTableSubTables>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default S1S2RecruitApply;
