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
          resid="417643880834"
          idField="DEP_ID" //主表id字段名
          pidField="DEP_PID" //父节点id字段名
          level={2}
          hasOpration={false}
          displayFileds={{
            firstField: 'DEP_NAME',
            secondaryField: 'C3_417651850998',
            thirdField: 'C3_419339113187'
            // imgField: 'C3_461934233303'
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
