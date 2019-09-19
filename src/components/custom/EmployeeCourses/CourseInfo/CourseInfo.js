import React from 'react';
import { Card, Col, Row, Input, Modal, Button } from 'antd';

const CourseInfo = function(props) {
  let { course } = props;
  return (
    <Card
      title="课程信息"
      type="inner"
      size="small"
      className="courseDetail__card"
    >
      <Row>
        <Col span={8}>课程名称:{course.C3_613941384592}</Col>
        <Col span={8}>课程编号:{course.C3_614182469763}</Col>
        <Col span={8}>价格：{course.C3_622227141162}</Col>
      </Row>
      <Row>
        <Col span={8}>开始时间:{course.C3_615393041304} </Col>
        <Col span={8}>结束时间:{course.C3_615393093633} </Col>
        <Col span={8}>课时:{course.C3_613941385843}</Col>
      </Row>
      <Row>
        <Col span={8}>课程类别:{course.courseType}</Col>
        <Col span={8}>培训机构:{course.trainingClub}</Col>
        <Col span={8}>讲师:{course.C3_613941386081}</Col>
      </Row>
      <Row>
        <Col span={8}>地点:{course.C3_613941386325}</Col>
        <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flexShrink: 0 }}>附加费用:</span>
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
      </Row>
      <Row>
        <Col>
          <p>课程简介: {course.courseIntroduction}</p>
        </Col>
      </Row>
    </Card>
  );
};
export default CourseInfo;
