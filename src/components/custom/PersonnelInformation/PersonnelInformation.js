import React from 'react';
import { Tabs, Button } from 'antd';
import PersonRelationship from '../OrgCharts/PersonRelationship';
import TableData from '../../common/data/TableData';
import DepartmentTree from './DepartmentTree';
import './PersonnelInformation.less';

const tabPaneStyle = { height: 'calc(100vh - 60px)' };
const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.PostArchitectureBaseURL;
const downloadBaseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs
    .PostArchitectureDownloadBaseURL;
/**
 * 人事信息
 */
const { TabPane } = Tabs;
class PersonnelInformation extends React.Component {
  state = {
    selectedDepartment: null
  };
  render() {
    const { role } = this.props;
    const { selectedDepartment } = this.state;
    return (
      <div className="personnel-information">
        <Tabs defaultActiveKey="1">
          <TabPane key="1" tab="在职人员基本信息" style={tabPaneStyle}>
            <div className="personnel-information-base">
              <div className="department-tree-wrapper">
                <DepartmentTree
                  resid="417643880834"
                  baseURL={baseURL}
                  idField="DEP_ID"
                  pidField="DEP_PID"
                  titleField="DEP_NAME"
                  rootNode={{
                    title: 'Enterprise',
                    key: 0
                  }}
                  onSelect={selectedKeys => {
                    this.setState({
                      selectedDepartment: selectedKeys[0]
                        ? selectedKeys[0]
                        : null
                    });
                  }}
                  treeClassName="personnel-information-tree"
                  onlyPersonData={role === 'manager'}
                />
              </div>
              <div className="table-data-wrapper">
                <TableData
                  baseURL={baseURL}
                  resid="424537954415"
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  refTargetComponentName="TableData"
                  subtractH={180}
                  hasAdd={true}
                  hasRowView={true}
                  hasRowDelete={true}
                  hasRowEdit={false}
                  hasDelete={false}
                  hasModify={false}
                  hasRowModify={true}
                  hasRowSelection={false}
                  hasAdvSearch={false}
                  importConfig={null}
                  actionBarWidth={200}
                  recordFormUseAbsolute={true}
                  recordFormContainerProps={{ width: 1000 }}
                  downloadBaseURL={downloadBaseURL}
                  cparm1={selectedDepartment}
                />
              </div>
            </div>
          </TabPane>
          <TabPane key="2" tab="离职人员基本信息" style={tabPaneStyle}>
            <div className="personnel-information-base">
              <div className="department-tree-wrapper">
                <DepartmentTree
                  resid="417643880834"
                  baseURL={baseURL}
                  idField="DEP_ID"
                  pidField="DEP_PID"
                  titleField="DEP_NAME"
                  rootNode={{
                    title: 'Enterprise',
                    key: 0
                  }}
                  onSelect={selectedKeys => {
                    this.setState({
                      selectedDepartment: selectedKeys[0]
                        ? selectedKeys[0]
                        : null
                    });
                  }}
                  treeClassName="personnel-information-tree"
                  onlyPersonData={role === 'manager'}
                />
              </div>
              <div className="table-data-wrapper">
                <TableData
                  baseURL={baseURL}
                  resid="659550084796"
                  wrappedComponentRef={element => (this.tableDataRef = element)}
                  refTargetComponentName="TableData"
                  subtractH={180}
                  hasAdd={true}
                  hasRowView={true}
                  hasRowDelete={true}
                  hasRowEdit={false}
                  hasDelete={false}
                  hasModify={false}
                  hasRowModify={true}
                  hasRowSelection={false}
                  hasAdvSearch={false}
                  importConfig={null}
                  actionBarWidth={200}
                  recordFormUseAbsolute={true}
                  recordFormContainerProps={{ width: 1000 }}
                  downloadBaseURL={downloadBaseURL}
                  cparm1={selectedDepartment}
                />
              </div>
            </div>
          </TabPane>
          <TabPane key="3" tab="汇报关系" style={tabPaneStyle}>
            <PersonRelationship
              resid="639856535460"
              idField="pnid" //主表id字段名
              pidField="supPnid" //父节点id字段名
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
              rootId={60867}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default PersonnelInformation;
