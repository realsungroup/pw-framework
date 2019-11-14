import React from 'react';
import { Button, message, Modal, Card, Row, Col, Rate } from 'antd';

import { TableData } from '../../common/loadableCommon';
import http from 'Util20/api';

const CourseArrangementDetailResid = '616245136209';
class ViewFeedBack extends React.Component {
  state = {
    viewActionsVisible: false,
    selectedCourseArrangmentDetail: {},
    // 内训评分
    rate: {
      rate1: null,
      rate2: null,
      rate3: null,
      rate4: null,
      rate5: null,
      rate6: null,
      rate7: null,
      rate8: null,
      advantange: '',
      shortcomming: ''
    },
    //外训评分
    rateOut: {
      rate1: null,
      rate2: null,
      rate3: null,
      rate4: null
    },
    knowledge: [],
    plans: []
  };

  // 获取反馈和行动计划
  getFeebackAndRate = async () => {
    const { rate, rateOut, selectedCourseArrangmentDetail } = this.state;
    let res; //课程反馈
    try {
      res = await http().getTable({
        resid: 478367996508,
        cmswhere: `C3_478368118696 = ${selectedCourseArrangmentDetail.CourseArrangeDetailID}`
      });
    } catch (err) {
      console.log(err.message);
      message.error(err.message);
    }
    if (res.data.length > 0) {
      if (
        selectedCourseArrangmentDetail.courseType === '外训' ||
        selectedCourseArrangmentDetail.courseType === '外聘内训'
      ) {
        const tempRateOut = { ...rateOut };
        console.log(res.data[0]);
        tempRateOut.rate1 = res.data[0].C3_478370015482; //机构服务满意度
        tempRateOut.rate2 = res.data[0].C3_478370045169; //讲师满意度
        tempRateOut.rate3 = res.data[0].C3_615580966131; //内容关联度
        tempRateOut.rate4 = res.data[0].C3_478370100284; //是否推荐同事参加考试课程
        this.setState({
          rateOut: tempRateOut
        });
      } else {
        const tempRate = { ...rate };
        const data = res.data[0];
        console.log(res.data[0]);
        tempRate.rate1 = data.C3_615639978971; //讲师备课充分
        tempRate.rate2 = data.C3_615640010121; //我认为课程主题准确，结构清晰，内容充实
        tempRate.rate3 = data.C3_615640043869; //所学的内容对实际工作有很大帮助
        tempRate.rate4 = data.C3_615640107592; //讲师语言表达能力好,讲解清楚生动,运用肢体语言
        tempRate.rate5 = data.C3_615640157603; //讲师能够引入实际案例和例证,讲解透彻,激发学员思考
        tempRate.rate6 = data.C3_615640180269; //我能够积极参与到课堂中去
        tempRate.rate7 = data.C3_615640206802; //我的提问能够得到讲师认真,满意的答复
        tempRate.rate8 = data.C3_615640235456; //时间控制合理使我感到舒适
        const otherAdvice = {
          shortcommings: data.C3_622216725340,
          advantages: data.C3_622216706104
        };
        this.setState({
          rate: { ...tempRate, ...otherAdvice }
        });
      }
    } else {
      console.log('else');
      this.setState({
        // 内训评分
        rate: {
          rate1: null,
          rate2: null,
          rate3: null,
          rate4: null,
          rate5: null,
          rate6: null,
          rate7: null,
          rate8: null,
          advantange: '',
          shortcomming: ''
        },
        //外训评分
        rateOut: {
          rate1: null,
          rate2: null,
          rate3: null,
          rate4: null
        }
      });
    }
    let res2; //行动计划
    try {
      res2 = await http().getTable({
        resid: 615571557694,
        cmswhere: `courseArrange = ${selectedCourseArrangmentDetail.CourseArrangeDetailID}`
      });
    } catch (err) {
      message.error(err.message);
      console.log(err);
    }
    if (res2.data.length) {
      let knowledge = res2.data[0].knowledge1.split(';');
      let plans = res2.data[0].action1.split(';');
      this.setState({
        knowledge,
        plans
      });
    } else {
      this.setState({
        knowledge: [],
        plans: []
      });
    }
  };

  //关闭模态窗
  handleCloseModal = () => {
    this.setState({
      viewActionsVisible: false,
      selectedCourseArrangmentDetail: {},
      planView: [],
      // 内训评分
      rate: {
        rate1: null,
        rate2: null,
        rate3: null,
        rate4: null,
        rate5: null,
        rate6: null,
        rate7: null,
        rate8: null
      },
      //外训评分
      rateOut: {
        rate1: null,
        rate2: null,
        rate3: null,
        rate4: null
      }
    });
  };

  render() {
    const { knowledge, plans } = this.state;
    return (
      <div style={{ height: 'calc(100% - 62px)' }}>
        <TableData
          resid={CourseArrangementDetailResid}
          subtractH={200}
          hasRowView={false}
          hasAdd={false}
          hasModify={false}
          hasDelete={false}
          hasRowSelection={true}
          hasRowDelete={false}
          actionBarWidth={150}
          hasRowModify={false}
          customRowBtns={[
            record => {
              return (
                <Button
                  onClick={() => {
                    this.setState(
                      {
                        viewActionsVisible: true,
                        selectedCourseArrangmentDetail: record
                      },
                      this.getFeebackAndRate
                    );
                  }}
                >
                  {record.courseType === '内训'
                    ? '查看课程反馈'
                    : '查看行动计划'}
                </Button>
              );
            }
          ]}
          // cmswhere={`C3_614184177086 = '${selectedCourseArrangment.CourseArrangeID}'`}
        />
        <Modal
          title="查看行动计划"
          visible={this.state.viewActionsVisible}
          onCancel={this.handleCloseModal}
          onOk={this.handleCloseModal}
          width="70%"
          destroyOnClose
        >
          {this.state.selectedCourseArrangmentDetail.courseType === '内训' ? (
            <Card>
              <Card type="inner" title="讲师专业水平" className="cardinner">
                <Row>
                  <Col span={12}>讲师备课充分，对授课内容非常了解</Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate1} disabled />
                  </Col>
                </Row>
              </Card>
              <Card type="inner" title="课程内容安排" className="cardinner">
                <Row>
                  <Col span={12}>我认为课程主题准确，结构清晰，内容充实</Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate2} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>所学的内容对实际工作有很大帮助</Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate3} disabled />
                  </Col>
                </Row>
              </Card>
              <Card type="inner" title="授课技巧" className="cardinner">
                <Row>
                  <Col span={12}>
                    讲师语言表达能力好,讲解清楚生动,运用肢体语言
                  </Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate4} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    讲师能够引入实际案例和例证,讲解透彻,激发学员思考
                  </Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate5} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>我能够积极参与到课堂中去</Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate6} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>我的提问能够得到讲师认真,满意的答复</Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate7} disabled />
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>时间控制合理使我感到舒适</Col>
                  <Col span={12}>
                    <Rate value={this.state.rate.rate8} disabled />
                  </Col>
                </Row>
              </Card>
              <div>
                <div>
                  <h3>我很有收获的内容</h3>
                  <p>{this.state.rate.advantange}</p>
                </div>
                <div>
                  <h3>我希望改进的内容</h3>
                  <p>{this.state.rate.shortcomming}</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card type="inner" title="讲师专业水平" className="cardinner">
              <Row>
                <Col span={12}>培训机构服务满意度</Col>
                <Col span={12}>
                  <Rate value={this.state.rateOut.rate1} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>培训讲师满意度</Col>
                <Col span={12}>
                  <Rate value={this.state.rateOut.rate2} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>培训内容和工作内容关联度</Col>
                <Col span={12}>
                  <Rate value={this.state.rateOut.rate3} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>是否推荐同事参加该课程</Col>
                <Col span={12}>
                  <Rate value={this.state.rateOut.rate4} disabled />
                </Col>
              </Row>
            </Card>
          )}
          {this.state.selectedCourseArrangmentDetail.courseType ===
          '内训' ? null : (
            <>
              <Row>
                <div>
                  <ul className="feedbackList">
                    <li key="tip">列出培训中学习到的3个知识点</li>
                    {knowledge.map((item, index) => {
                      return (
                        <li key={index}>
                          <rect>{index + 1}</rect>
                          <p>{item}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Row>
              <Row>
                <div>
                  <ul className="feedbackList">
                    <li key="tip">
                      行动计划
                      <br />
                      (运用学到的知识，你可以改善工作中的哪些行为或问题？请列出具体行为。
                      )
                    </li>
                    {/* <li className="alter2" key="tip1">
                      <rect>序号</rect>
                      <p>具体行为</p>
                    </li> */}
                    {plans.map((item, index) => {
                      return (
                        <li key={index}>
                          <rect>{index + 1}</rect>
                          <p>{item}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Row>
            </>
          )}
        </Modal>
      </div>
    );
  }
}

export default ViewFeedBack;
