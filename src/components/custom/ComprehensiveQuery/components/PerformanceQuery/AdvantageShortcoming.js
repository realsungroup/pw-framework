import React from 'react';
import { Row, Col } from 'antd';
class AdvantageShortcoming extends React.Component {
  render() {
    return (
      <div className="" id="advantage-shortcoming">
        <Row>
          <Col span={8}>工号 Employee ID:</Col>
          <Col span={8}>姓名 Name:</Col>
          <Col span={8}>英文名 Name:</Col>
        </Row>
        <Row>
          <Col span={8}>入职日期 Hire Date:</Col>
          <Col span={8}>部门 Department:</Col>
          <Col span={8}>考核年度 Fisical Year:</Col>
        </Row>
        <Row>
          <Col span={8}>直接主管 Supervior:</Col>
        </Row>
      </div>
    );
  }
}
export default AdvantageShortcoming;
