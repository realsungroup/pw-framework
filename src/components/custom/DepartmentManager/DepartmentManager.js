import React from 'react';
import { Input, Tree, Icon } from 'antd';
import Department from '../OrgCharts/Department';
import './DepartmentManager.less';

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.PostArchitectureBaseURL;
/**
 * 部门管理
 */
class DepartmentManager extends React.Component {
  render() {
    return (
      <div className="department-manager">
        <Department
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
          hasDepartmentFilter={false}
        />
      </div>
    );
  }
}

export default DepartmentManager;
