import React from 'react';
import './EmployeeInformation.less';
import { Card, Row, Col, Select } from 'antd';

const { Option } = Select;
const handleOptionClick = (props, item) => {
  return () => props.setTutorship(item);
};
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
            {/* <Select
              showSearch
              style={{ width: 200 }}
              value={employeeInformation.instructor}
              placeholder="请选择"
            /> */}
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="请选择辅导员"
              optionFilterProp="children"
              onSearch={val => {}}
              value={employeeInformation.instructor}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {props.tutorships.map(item => (
                <Option
                  value={item.C3_609845305868}
                  key={item.C3_609845305868}
                  onClick={handleOptionClick(props, item)}
                >
                  {item.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default EmployeeInformation;
