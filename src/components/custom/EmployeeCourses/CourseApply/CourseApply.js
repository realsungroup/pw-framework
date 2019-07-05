import React, { Component } from 'react';
import './CourseApply.less';
import { Card, Row, Col, Divider, Icon, Steps } from 'antd';
import CourseInfo from '../CourseInfo';
const { Step } = Steps;

class CourseApply extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    console.log(this.props);
    return (
      <div className="courseApply">
        {this.props.mode === 'modify' ? null : (
          <Card title="申请表" type='inner' size="small" className="courseApply__card">
            <Steps progressDot={true}>
              <Step description="直接主管/部门负责人 刘哲 2019-08-01 2:00pm" />
              <Step description="直接主管/部门负责人 刘哲 2019-08-01 2:00pm" />
              <Step description="直接主管/部门负责人 刘哲 2019-08-01 2:00pm" />
            </Steps>
          </Card>
        )}
        <Card title="申请人信息" type='inner' size="small" className="courseApply__card">
          <Row>
            <Col span={8}>课程名称:新员工培训</Col>
            <Col span={8}>课程编号:2198374637383</Col>
            <Col span={8}>价格：0</Col>
          </Row>
          <Row>
            <Col span={8}>课程名称:新员工培训</Col>
            <Col span={8}>课程编号:2198374637383</Col>
            <Col span={8}>价格：0</Col>
          </Row>
        </Card>
        <CourseInfo />
      </div>
    );
  }
}
export default CourseApply;
