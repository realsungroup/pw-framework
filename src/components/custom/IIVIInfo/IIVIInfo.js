import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03BaseURL;
const downloadBaseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.WuxiHr03DownloadBaseURL;

class IIVIInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {};
  render() {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#fff' }}>
        <Tabs defaultActiveKey="无锡II-VI信息表">
          <TabPane tab="无锡II-VI信息表" key="无锡II-VI信息表">
            <TableData
              baseURL={baseURL}
              downloadBaseURL={downloadBaseURL}
              resid={653494493371}
              hasBeBtns={true}
              hasRowSelection={true}
              hasAdd={true}
              hasDelete={true}
              hasModify={false}
              hasRowDelete={true}
              hasRowModify={true}
              hasRowView={true}
              subtractH={170}
              style={{ height: 'calc(100vh - 60px)' }}
              refTargetComponentName="TableData"
            />
          </TabPane>
          <TabPane tab="上海II-VI信息表" key="上海II-VI信息表">
            <TableData
              baseURL={baseURL}
              downloadBaseURL={downloadBaseURL}
              resid={653494511170}
              hasBeBtns={true}
              hasRowSelection={true}
              hasAdd={true}
              hasDelete={true}
              hasModify={false}
              hasRowDelete={true}
              hasRowModify={true}
              hasRowView={true}
              subtractH={170}
              style={{ height: 'calc(100vh - 60px)' }}
              refTargetComponentName="TableData"
            />
          </TabPane>
          <TabPane tab="部门名匹配表" key="部门名匹配表">
            <TableData
              baseURL={baseURL}
              downloadBaseURL={downloadBaseURL}
              resid={659023671965}
              hasBeBtns={true}
              hasRowSelection={true}
              hasAdd={true}
              hasDelete={true}
              hasModify={false}
              hasRowDelete={true}
              hasRowModify={true}
              hasRowView={true}
              subtractH={170}
              style={{ height: 'calc(100vh - 60px)' }}
              refTargetComponentName="TableData"
            />
          </TabPane>
          <TabPane tab="OracleID对照表" key="OracleID对照表">
            <TableData
              baseURL={baseURL}
              downloadBaseURL={downloadBaseURL}
              resid={660321617024}
              hasBeBtns={true}
              hasRowSelection={true}
              hasAdd={true}
              hasDelete={true}
              hasModify={false}
              hasRowDelete={true}
              hasRowModify={true}
              hasRowView={true}
              subtractH={170}
              style={{ height: 'calc(100vh - 60px)' }}
              refTargetComponentName="TableData"
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default IIVIInfo;
