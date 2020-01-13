import React, { Component } from 'react';
import './CourseApply.less';
import { Card, Row, Col } from 'antd';
import CourseInfo from '../CourseInfo';

const rowStyle = {
  marginBottom: 16
};
/**
 * @description 课程申请单
 */
class CourseApply extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { course } = this.props;
    return (
      <div className="courseApply">
        <Card
          title="申请人信息"
          type="inner"
          size="small"
          className="courseApply__card"
        >
          <Row style={rowStyle} class="courseApply_row">
            <Col md={12} sm={12}>
              <span className="courseApply_label">申请人:</span>
              {course.C3_613941385305}
            </Col>
            <Col md={12} sm={12}>
              <span className="courseApply_label">员工号:</span>
              {course.C3_615642868855}
            </Col>
          </Row>
          <Row style={rowStyle} class="courseApply_row">
            <Col md={12} sm={12}>
              <span className="courseApply_label">职务:</span>
              {course.C3_615642934644}
            </Col>
            <Col md={12} sm={12}>
              <span className="courseApply_label">所在部门:</span>
              {course.C3_615642887103}
            </Col>
          </Row>
          <Row style={rowStyle} class="courseApply_row">
            <Col md={12} sm={12}>
              <span className="courseApply_label">直接主管:</span>
              {course.C3_615642911765}
            </Col>
            <Col md={12} sm={12}>
              <span className="courseApply_label">部门负责人:</span>
              {course.C3_615642922917}
            </Col>
          </Row>
        </Card>
        <CourseInfo
          course={course}
          extraCost={
            this.props.mode === 'view'
              ? course.extraCharge
              : this.props.extraCost
          }
          onChangeExtraCost={this.props.onChangeExtraCost}
          mode={this.props.mode}
        />
      </div>
    );
  }
}
export default CourseApply;
