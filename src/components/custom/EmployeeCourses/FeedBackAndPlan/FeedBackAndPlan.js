import React, { Component } from 'react';
import './FeedBackAndPlan.less';
import { Card, Row, Col, Rate, InputNumber,DatePicker } from 'antd';

class FeedBackAndPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paln: [
        {
          action: '查找到现有流程中的瓶颈',
          start: '2018-09-10',
          end: '2019-07-06',
          rateOfProgress: '50%'
        },
        {
          action: '找出问题的原因',
          start: '2018-09-10',
          end: '2019-07-06',
          rateOfProgress: '30%'
        },
        {
          action: '寻求可行的解决方案',
          start: '2018-09-10',
          end: '2019-07-06',
          rateOfProgress: '70%'
        },
        {
          action: '验证方案效果',
          start: '2018-09-10',
          end: '2019-07-06',
          rateOfProgress: '50%'
        },
        {
          action: '应用方案并及时反馈',
          start: '2018-09-10',
          end: '2019-07-06',
          rateOfProgress: '100%'
        }
      ]
    };
  }
  render() {
    return (
      <div>
        <Card title="课程反馈">
          <Card type="inner" title="讲师专业水平" className="cardinner">
            <Row>
              <Col span={12}>讲师备课充分，对授课内容非常了解</Col>
              <Col span={12}>
                <Rate />
              </Col>
            </Row>
          </Card>
          <Card type="inner" title="课程内容安排" className="cardinner">
            <Row>
              <Col span={12}>讲师备课充分，对授课内容非常了解</Col>
              <Col span={12}>
                <Rate />
              </Col>
            </Row>
            <Row>
              <Col span={12}>讲师备课充分，对授课内容非常了解</Col>
              <Col span={12}>
                <Rate />
              </Col>
            </Row>
          </Card>
          <Card type="inner" title="授课技巧" className="cardinner">
            <Row>
              <Col span={12}>讲师备课充分，对授课内容非常了解 内容非常了解</Col>
              <Col span={12}>
                <Rate />
              </Col>
            </Row>
            <Row>
              <Col span={12}>讲师备课充分，对授课内容非常了解 内容非常了解</Col>
              <Col span={12}>
                <Rate />
              </Col>
            </Row>
            <Row>
              <Col span={12}>讲师备课充分，对授课内容非常了解授课内容</Col>
              <Col span={12}>
                <Rate />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                讲师备课充分，对授课内容非常了解内容非常了解内容非常了解
              </Col>
              <Col span={12}>
                <Rate />
              </Col>
            </Row>
          </Card>
        </Card>
        <Card title="行动计划">
          <Row>
            <Col span={2}>序号</Col>
            <Col span={12}>具体行动</Col>
            <Col span={4}>开始时间</Col>
            <Col span={4}>结束时间</Col>
            <Col span={2}>进度</Col>
          </Row>
          {this.state.paln.map((item, index) => {
            return (
              <Row>
                <Col span={2}>{index+1}</Col>
                <Col span={10}>{item.action}</Col>
                <Col span={5}><DatePicker></DatePicker></Col>
                <Col span={5}><DatePicker></DatePicker></Col>
                <Col span={2}><InputNumber value={item.rateOfProgress} min={1} max={100}></InputNumber></Col>
              </Row>
            );
          })}
        </Card>
      </div>
    );
  }
}
export default FeedBackAndPlan;
