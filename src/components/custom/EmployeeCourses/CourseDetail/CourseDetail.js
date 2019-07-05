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
    const {
      onCloseDetailOpenAppply,
      onCloseDetailOpenFeeback,
      onCourseType
    } = this.props;
    return (
      <div className="courseDetail">
        <CourseInfo />
        <Card
          title="课程选项"
          type="inner"
          size="small"
          className="courseDetail__card"
        >
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
              <a
                onClick={() => {
                  onCloseDetailOpenFeeback();
                }}
              >
                反馈表
              </a>
            </Col>
            <Col span={16}>2018年9月5日 3:06:44</Col>
          </Row>
          {this.props.onCourseType === '内训' ? null : (
            <Row className="courseDetail__courseOptional">
              <Col span={3}>
                <Icon type="paper-clip" />
              </Col>
              <Col span={5}>
                <a
                  onClick={() => {
                    onCloseDetailOpenFeeback();
                  }}
                >
                  行动计划
                </a>
              </Col>
              <Col span={16}>2018年9月5日 3:06:44</Col>
            </Row>
          )}
        </Card>
      </div>
    );
  }
}
export default CourseDetail;
