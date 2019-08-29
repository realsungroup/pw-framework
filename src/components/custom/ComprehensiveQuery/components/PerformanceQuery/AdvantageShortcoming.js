import React from 'react';
import { Row, Col, Select } from 'antd';
class AdvantageShortcoming extends React.Component {
  render() {
    return (
      <div id="advantage-shortcoming">
        <div className="advantage-shortcoming_select-year">
          财年：
          <Select
            placeholder="请选择财年"
            style={{ width: 150 }}
            value={'FY2019'}
          />
        </div>
        <div className="advantage-shortcoming_content">
          <Row style={{ paddingBottom: 16 }}>
            <Col span={8}>
              <label>工号 Employee ID:</label>
            </Col>
            <Col span={8}>
              <label>姓名 Name:</label>
            </Col>
            <Col span={8}>
              <label>英文名 Name:</label>
            </Col>
          </Row>
          <Row style={{ paddingBottom: 16 }}>
            <Col span={8}>
              <label>入职日期 Hire Date:</label>
            </Col>
            <Col span={8}>
              <label>部门 Department:</label>
            </Col>
            <Col span={8}>
              <label>考核年度 Fisical Year:</label>
            </Col>
          </Row>
          <Row style={{ paddingBottom: 32 }}>
            <Col span={8}>
              <label>直接主管 Supervior:</label>
            </Col>
          </Row>
          <Row style={{ paddingBottom: 32 }}>
            <Col span={6}>
              自评总评：
              <div style={{ paddingBottom: 8 }}></div>
            </Col>
            <Col span={6} offset={2}>
              自评评级：
              <div style={{ paddingBottom: 8 }}></div>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              优点：
              <div style={{ paddingBottom: 8 }}></div>
            </Col>
            <Col span={6} offset={2}>
              有待改善：
              <div style={{ paddingBottom: 8 }}></div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default AdvantageShortcoming;
