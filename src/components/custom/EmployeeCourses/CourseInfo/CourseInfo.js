import React from 'react';
import './CourseInfo.less';
import { Card, Col, Row, Input } from 'antd';
import moment from 'moment';
const rowStyle = {
  marginBottom: 16
};
/**
 * @description 课程信息
 */
const CourseInfo = function (props) {
  let { course } = props;
  return (
    <Card
      title="课程信息"
      type="inner"
      size="small"
      className="courseDetail__card"
    >
      <Row style={rowStyle}>
        <Col md={12}>
          <span className="course-info_label">课程名称:</span>
          {course.C3_613941384592}
        </Col>
        <Col md={12}>
          <span className="course-info_label">培训机构:</span>
          {course.trainingClub}
        </Col>
        {/* <Col md={12}>
          <span className="course-info_label">课程编号:</span>
          {course.C3_614182469763}
        </Col> */}
      </Row>
      <Row style={rowStyle}>
        {/* <Col md={12}>
          <span className="course-info_label">价格:</span>
          {course.C3_613941385069}
        </Col> */}
        <Col md={12}>
          <span className="course-info_label">地点:</span>
          {course.C3_613941386325}
        </Col>
      </Row>
      <Row style={rowStyle}>
        <Col md={12}>
          <span className="course-info_label">开始时间:</span>
          {moment(course.C3_615393041304).format('YYYY-MM-DD')}
        </Col>
        <Col md={12}>
          <span className="course-info_label">结束时间:</span>
          {moment(course.C3_615393093633).format('YYYY-MM-DD')}
        </Col>
      </Row>
      <Row style={rowStyle}>
        {/* <Col md={12}>课程类别:{course.courseType}</Col> */}
        {/* <Col md={12}>
          <span className="course-info_label">培训机构:</span>
          {course.trainingClub}
        </Col> */}
        <Col md={12}>
          <span className="course-info_label">课时:</span>
          {course.C3_613941385843}
        </Col>
        <Col md={12} style={{ display: 'flex', alignItems: 'center' }}>
          <span className="course-info_label" style={{ flexShrink: 0 }}>
            附加费用:
          </span>
          {props.mode === 'view' ? (
            <p>{props.extraCost}</p>
          ) : (
              <Input
                value={props.extraCost}
                type="number"
                onChange={e => {
                  props.onChangeExtraCost(e.target.value);
                }}
              />
            )}
        </Col>
        {/* <Col md={12}>
          <span className="course-info_label">地点:</span>
          {course.C3_613941386325}
        </Col> */}
        {/* <Col md={12}>
          <span className="course-info_label">课程简介:</span>
          {course.courseIntroduction}
        </Col> */}
        {/* <Col md={12}>讲师:{course.C3_613941386081}</Col> */}
      </Row>
    </Card>
  );
};
export default CourseInfo;
