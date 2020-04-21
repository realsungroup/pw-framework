import React from 'react';
import { Tabs, Button } from 'antd';
import PersonRelationship from '../OrgCharts/PersonRelationship';
import TableData from '../../common/data/TableData';

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.PostArchitectureBaseURL;
/**
 * 人事信息
 */
const { TabPane } = Tabs;
class PersonnelInformation extends React.Component {
  render() {
    const { role } = this.props;
    return (
      <div className="" style={{ height: '100vh', background: '#fff' }}>
        <Tabs defaultActiveKey="1">
          <TabPane key="1" tab="人事基本信息">
            <TableData
              baseURL={baseURL}
              resid="637772568684"
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              // subtractH={240}
              hasAdd={true}
              // tableComponent="ag-grid"
              // rowSelectionAg={ 'single' }
              hasRowView={true}
              hasRowDelete={true}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={true}
              hasRowSelection={false}
              hasAdvSearch={false}
              importConfig={null}
              actionBarWidth={100}
            />
          </TabPane>
          <TabPane
            key="2"
            tab="汇报关系"
            style={{ height: 'calc(100vh - 60px)' }}
          >
            <PersonRelationship
              resid="639856535460"
              idField="C3_305737857578" //主表id字段名
              pidField="C3_417993417686" //父节点id字段名
              level={2}
              hasOpration={false}
              displayFileds={{
                firstField: 'C3_419343735913',
                secondaryField: 'C3_227212499515',
                thirdField: 'C3_417990929081',
                imgField: 'C3_461934233303'
              }}
              procedureConfig={{
                procedure: 'pw_staffs',
                paranames: 'dates',
                paratypes: 'string'
              }}
              baseURL={baseURL}
              hasGroup={role === 'manager' ? false : true}
              hasDepartmentFilter={role === 'manager' ? false : true}
              role={role}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default PersonnelInformation;
