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
  //C3_615377473913
  render() {
    const {
      onCloseDetailOpenAppply,
      onCloseDetailOpenFeeback,
      onCloseCourseDetailOpenTip,
      onCourseType,
      course
    } = this.props;
    // alert(onCourseType )
    // alert(course.C3_615377473913 )
    return (
      <div className="courseDetail">
        <CourseInfo
          course={course}
          mode="view"
          extraCost={course.extraCharge}
        />
        <Card
          title="课程选项"
          type="inner"
          size="small"
          className="courseDetail__card"
        >
          {this.props.onCourseType === '外训' ||
          course.C3_615377523072 === 'Y' ? (
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
              <Col span={16}>{course.C3_615377538264}</Col>
            </Row>
          ) : null}
          {/* 课程反馈，行动计划已提交才显示 */}
          {course.C3_615377473913 === 'Y' && onCourseType=== '外训'? (
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
                  反馈表和行动计划表
                </a>
              </Col>
              <Col span={16}>{course.C3_615377481222}</Col>
            </Row>
          ) : null}
          {course.isInnerFeedBack === 'Y' && onCourseType=== '内训'? (
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
              <Col span={16}>{course.C3_615377481222}</Col>
            </Row>
          ) : null}
          {this.props.onCourseType === '外训' && course.isSubmitFeel === 'Y' ? (
            <Row className="courseDetail__courseOptional">
              <Col span={3}>
                <Icon type="paper-clip" />
              </Col>
              <Col span={5}>
                <a
                  onClick={() => {
                    onCloseCourseDetailOpenTip();
                  }}
                >
                  课程心得
                </a>
              </Col>
              <Col span={16}>{course.submitFeelTime}</Col>
            </Row>
          ) : null}
        </Card>
      </div>
    );
  }
}
export default CourseDetail;
