import React from 'react';
import { Card,Col,Row, } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
const CourseInfo = function(props) {
  return (
    <Card title="课程信息" type='inner' size="small" className="courseDetail__card">
      <Row>
        <Col span={8}>课程名称:新员工培训</Col>
        <Col span={8}>课程编号:2198374637383</Col>
        <Col span={8}>价格：0</Col>
      </Row>
      <Row>
        <Col span={8}>开始时间:2019-08-01 2:00 pm </Col>
        <Col span={8}>结束时间:2019-08-06 4:30 pm</Col>
        <Col span={8}>课时:5天</Col>
      </Row>
      <Row>
        <Col span={8}>课程类别:内训</Col>
        <Col span={8}>培训机构:HR</Col>
        <Col span={8}>讲师:高级讲师</Col>
      </Row>
      <Row>
        <Col span={8}>地点:世纪大道1000号</Col>
        <Col span={8}>培训机构:HR</Col>
        <Col span={8}>名额:10/30</Col>
      </Row>
      <Row>
        <Col span={24}>课程类别:课程大纲</Col>
        <Col>
          <TextArea
            style={{ width: '100%', minHeight: 60 }}
            value="公司文化，规章制度,员工手册,安全生产规章制度, 宿舍管理制度"
          />
        </Col>
      </Row>
    </Card>
  );
};
export default CourseInfo;
