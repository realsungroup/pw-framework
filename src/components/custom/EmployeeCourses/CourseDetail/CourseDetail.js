import React, { Component } from 'react';
import './CourseDetail.less';
import { Card, Row, Col, Icon, Modal } from 'antd';
import CourseInfo from '../CourseInfo';


class CourseDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ApplyAndFeebackVisible: false
    };
  }
  render() {
    const {onCloseDetailOpenAppply} = this.props;
    return (
      <div className="courseDetail">
        {/* <Card title="课程信息" size="small" className="courseDetail__card">
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
        </Card> */}
        <CourseInfo></CourseInfo>
        <Card title="课程选项" size="small" className="courseDetail__card">
          <Row className="courseDetail__courseOptional">
            <Col span={3}>
              <Icon type="paper-clip" />
            </Col>
            <Col span={5}>
              <a
                onClick={() => {
                  onCloseDetailOpenAppply();
                }}
              >
                申请单
              </a>
            </Col>
            <Col span={16}>2018年9月5日 3:06:44</Col>
          </Row>

          <Row className="courseDetail__courseOptional">
            <Col span={3}>
              <Icon type="paper-clip" />
            </Col>
            <Col span={5}>
              <a>反馈表</a>
            </Col>
            <Col span={16}>2018年9月5日 3:06:44</Col>
          </Row>
          <Row className="courseDetail__courseOptional">
            <Col span={3}>
              <Icon type="paper-clip" />
            </Col>
            <Col span={5}>
              <a>行动计划</a>
            </Col>
            <Col span={16}>2018年9月5日 3:06:44</Col>
          </Row>
        </Card>
        
      </div>
    );
  }
}
export default CourseDetail;
