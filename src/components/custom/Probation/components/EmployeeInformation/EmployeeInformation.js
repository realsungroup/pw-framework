import React from 'react';
import './EmployeeInformation.less';
import { Card, Row, Col, Input, Select } from 'antd';

const EmployeeInformation = props => {
  const { employeeInformation } = props;
  return (
    <div id="employee-imformation" className="probation-form">
      <Card
        title={
          <React.Fragment>
            <span className="card_title_name__zh">个人信息</span>
            <span className="card_title_name__en">Employee Information</span>
          </React.Fragment>
        }
      >
        <Row style={{ paddingBottom: 26, paddingTop: 8 }}>
          <Col span={8}>
            <span className="employee-imformation_lable">姓名/Name:</span>
            {employeeInformation.userName}
          </Col>
          <Col span={8}>
            <span className="employee-imformation_lable">工号/Job Number:</span>
          </Col>
          <Col span={8}>
            <span className="employee-imformation_lable">
              入职日期/Join Date:
            </span>
          </Col>
        </Row>
        <Row style={{ paddingBottom: 26 }}>
          <Col span={8}>
            <span className="employee-imformation_lable">部门/Department:</span>
          </Col>
          <Col span={8}>
            <span className="employee-imformation_lable">职位/Position:</span>
          </Col>
          <Col span={8}>
            <span className="employee-imformation_lable">级别/Level:</span>
          </Col>
        </Row>
        <Row style={{ paddingBottom: 21 }}>
          <Col span={8}>
            <span className="employee-imformation_lable">
              直接主管/Supervisor:
            </span>
            {employeeInformation.director}
          </Col>
          <Col span={8}>
            <span className="employee-imformation_lable">辅导员/Mentor:</span>
            <Select
              showSearch
              style={{ width: 200 }}
              value={employeeInformation.instructor}
              placeholder="请选择"
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default EmployeeInformation;
