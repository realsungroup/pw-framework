import React from 'react';
import { Input, Tree, Icon } from 'antd';
import Department from './Department';
import './DepartmentManager.less';

const baseURL =
  window.pwConfig[process.env.NODE_ENV].customURLs.PostArchitectureBaseURL;
/**
 * 部门管理
 */
class DepartmentManagement extends React.Component {
  render() {
    return (
      <div className="department-manager">
        <Department
          resid="417643880834"
          idField="DEP_ID" //主表id字段名
          pidField="DEP_PID" //父节点id字段名
          level={2}
          hasOpration={true}
          hudongSpecial={false} //沪东项目中不需要展示的组件
          displayFileds={{
            firstField: 'DEP_NAME',
            secondaryField: 'C3_417651850998',
            thirdField: 'C3_419339113187'
            // imgField: 'C3_461934233303'
          }}
          baseURL={baseURL}
          hasDepartmentFilter={false}
        />
      </div>
    );
  }
}

export default DepartmentManagement;
