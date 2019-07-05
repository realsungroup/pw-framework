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
    let { course } = this.props
    return (
      <div className="courseApply">
        {this.props.mode === 'modify' ? null : (
          <Card title="申请表" size="small" className="courseApply__card">
            <Steps progressDot={true}>
              <Step description="直接主管/部门负责人 刘哲 2019-08-01 2:00pm" />
              <Step description="直接主管/部门负责人 刘哲 2019-08-01 2:00pm" />
              <Step description="直接主管/部门负责人 刘哲 2019-08-01 2:00pm" />
            </Steps>
          </Card>
        )}
        <Card title="申请人信息" size="small" className="courseApply__card">
          <Row>
            <Col span={8}>申请人:{course.C3_613941385305}</Col>
            <Col span={8}>员工号:{course.C3_615642868855}</Col>
            <Col span={8}>职务:{course.C3_615642934644}</Col>
          </Row>
          <Row>
            <Col span={8}>所在部门:{course.C3_615642887103}</Col>
            <Col span={8}>直接主管:{course.C3_615642911765}</Col>
            <Col span={8}>部门负责人:{course.C3_615642922917}</Col>
          </Row>
        </Card>
        <CourseInfo course={course}/>
      </div>
    );
  }
}
export default CourseApply;
