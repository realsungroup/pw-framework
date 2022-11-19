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
        const tempRate = { ...rate };
        const data = res.data[0];
        tempRate.rate1 = data.C3_615639978971; //讲师备课充分
        tempRate.rate2 = data.C3_615640010121; //本次培训的主题明确，逻辑清晰，内容充实，有针对性
        tempRate.rate2_1 = data.C3_722076452880;//有合适的课前调研，并且调研结果与课程内容联系紧密
        tempRate.rate2_2 = data.C3_722076492665;//课程时长设置合适，课程进度不紧迫不冗长
        tempRate.rate3_1 = data.C3_722079578079; //培训师具有足够的专业知识和经验
        tempRate.rate3_2 = data.C3_722079636630;//培训师备课充分，对授课内容非常熟悉，课件设计美观大方
        tempRate.rate3 = data.C3_615640043869; //我所学到的内容对实际工作或个人发展有帮助
        tempRate.rate4 = data.C3_615640107592; //培训师语言表达能力好，音量和语速适中，讲解清晰生动，能够运用肢体语言
        tempRate.rate5 = data.C3_615640157603; //培训师能够引入实际案例和例证，讲解透彻，激发学员思考
        tempRate.rate6 = data.C3_615640180269; //培训师能设置提问，小组讨论等互动环节，使学员积极参与其中
        tempRate.rate7 = data.C3_615640206802; //培训师能够及时，认真地回答学员提出的问题
        tempRate.rate8 = data.C3_615640235456; //时间控制合理使我感到舒适
        tempRate.rate9 = data.C3_722087822472;//我对本次课程整体满意
        tempRate.rate10 = data.C3_722087862632;//我愿意向朋友或同事推荐这门课程
        tempRate.rate11 = data.C3_722087899198;//在培训过程中，培训组织者基于我足够的后勤支持
        tempRate.rate12 = data.C3_722087926763;//培训场地设备设施完整无故障
        this.setState({
          rate: tempRate
        });
      } else {
        const tempRate = { ...rate };
        const data = res.data[0];
        tempRate.rate1 = data.C3_615639978971; //讲师备课充分
        tempRate.rate2 = data.C3_615640010121; //本次培训的主题明确，逻辑清晰，内容充实，有针对性
        tempRate.rate2_1 = data.C3_722076452880;//有合适的课前调研，并且调研结果与课程内容联系紧密
        tempRate.rate2_2 = data.C3_722076492665;//课程时长设置合适，课程进度不紧迫不冗长
        tempRate.rate3_1 = data.C3_722079578079; //培训师具有足够的专业知识和经验
        tempRate.rate3_2 = data.C3_722079636630;//培训师备课充分，对授课内容非常熟悉，课件设计美观大方
        tempRate.rate3 = data.C3_615640043869; //我所学到的内容对实际工作或个人发展有帮助
        tempRate.rate4 = data.C3_615640107592; //培训师语言表达能力好，音量和语速适中，讲解清晰生动，能够运用肢体语言
        tempRate.rate5 = data.C3_615640157603; //培训师能够引入实际案例和例证，讲解透彻，激发学员思考
        tempRate.rate6 = data.C3_615640180269; //培训师能设置提问，小组讨论等互动环节，使学员积极参与其中
        tempRate.rate7 = data.C3_615640206802; //培训师能够及时，认真地回答学员提出的问题
        tempRate.rate8 = data.C3_615640235456; //时间控制合理使我感到舒适
        tempRate.rate9 = data.C3_722087822472;//我对本次课程整体满意
        tempRate.rate10 = data.C3_722087862632;//我愿意向朋友或同事推荐这门课程
        tempRate.rate11 = data.C3_722087899198;//在培训过程中，培训组织者基于我足够的后勤支持
        tempRate.rate12 = data.C3_722087926763;//培训场地设备设施完整无故障
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

          <Card>
            <Card type="inner" title="培训整体满意度" className="cardinner">
              <Row>
                <Col span={12}>我对本次课程整体满意</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate9} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>我愿意向朋友或同事推荐这门课程</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate10} disabled />
                </Col>
              </Row>
            </Card>
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
                <Col span={12}>本次培训的主题明确，逻辑清晰，内容充实，有针对性</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate2} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>有合适的课前调研，并且调研结果与课程内容联系紧密</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate2_1} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>课程时长设置合适，课程进度不紧迫不冗长</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate2_2} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>我所学到的内容对实际工作或个人发展有帮助</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate3} disabled />
                </Col>
              </Row>
            </Card>
            <Card type="inner" title="授课技巧" className="cardinner">
              <Row>
                <Col span={12}>
                  培训师语言表达能力好，音量和语速适中，讲解清晰生动，能够运用肢体语言
                  </Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate4} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  培训师能够引入实际案例和例证，讲解透彻，激发学员思考
                  </Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate5} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>培训师能设置提问，小组讨论等互动环节，使学员积极参与其中</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate6} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>培训师能够及时，认真地回答学员提出的问题</Col>
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
            <Card type="inner" title="培训组织与支持" className="cardinner">
              <Row>
                <Col span={12}>在培训过程中，培训组织者基于我足够的后勤支持</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate11} disabled />
                </Col>
              </Row>
              <Row>
                <Col span={12}>培训场地设备设施完整无故障</Col>
                <Col span={12}>
                  <Rate value={this.state.rate.rate12} disabled />
                </Col>
              </Row>
            </Card>
            {this.state.selectedCourseArrangmentDetail.courseType === '内训' ? (
              <div>
                <div>
                  <h3>我很有收获的内容</h3>
                  <p>{this.state.rate.advantange}</p>
                </div>
                <div>
                  <h3>我希望改进的内容</h3>
                  <p>{this.state.rate.shortcomming}</p>
                </div>
              </div>) : null}
          </Card>

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
