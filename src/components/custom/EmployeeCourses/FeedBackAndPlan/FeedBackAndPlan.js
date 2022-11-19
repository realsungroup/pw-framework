import React, { Component } from 'react';
import './FeedBackAndPlan.less';
import {
  Card,
  Row,
  Col,
  Rate,
  Input,
  Button,
  Tooltip,
  Form,
  Icon,
  message,
  Popconfirm
} from 'antd';
import moment from 'moment';
import http from 'Util20/api';
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;
/**
 * @description 反馈与行动计划
 */
class FeedBackAndPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      planView: [],
      // 内训评分
      rate: {
        rate1: 0,
        rate2: 0,
        rate3: 0,
        rate4: 0,
        rate5: 0,
        rate6: 0,
        rate7: 0,
        rate8: 0
      },
      otherAdvice: {
        advantages: '', // 益处
        shortcommings: '' //缺点
      },
      //外训评分
      rateOut: {
        rate1: 0,
        rate2: 0,
        rate3: 0,
        rate4: 0
      },
      knowledge: [''], //获得的知识点
      plans: [''] //行动计划
    };
  }

  componentDidMount() {
    if (this.props.mode === 'view') {
      this.getFeebackAndRate();
    }
  }

  /**
   * 获取后台反馈的分数和行动计划
   */
  getFeebackAndRate = async () => {
    const { rate, rateOut } = this.state;
    let res; //课程反馈
    try {
      res = await http().getTable({
        resid: 478367996508,
        cmswhere: `C3_478368118696 =${this.props.onCourseDetailID}`
      });
    } catch (err) {
      console.log(err.message);
    }
    if (res.data.length > 0) {
      if (
        this.props.onCourseType === '外训' ||
        this.props.onCourseType === '外聘内训'
      ) {
        const tempRateOut = { ...rateOut };
        const tempRate = { ...rate };
        const data = res.data[0];
        tempRate.rate1 = data.C3_615639978971; //讲师备课充分
        tempRate.rate2 = data.C3_615640010121; //本次培训的主题明确，逻辑清晰，内容充实，有针对性
        tempRate.rate3 = data.C3_615640043869; //我所学到的内容对实际工作或个人发展有帮助
        tempRate.rate2_1 = data.C3_722076452880;//有合适的课前调研，并且调研结果与课程内容联系紧密
        tempRate.rate2_2 = data.C3_722076492665;//课程时长设置合适，课程进度不紧迫不冗长
        tempRate.rate3_1 = data.C3_722079578079; //培训师具有足够的专业知识和经验
        tempRate.rate3_2 = data.C3_722079636630;//培训师备课充分，对授课内容非常熟悉，课件设计美观大方
        tempRate.rate4 = data.C3_615640107592; //培训师语言表达能力好，音量和语速适中，讲解清晰生动，能够运用肢体语言
        tempRate.rate5 = data.C3_615640157603; //培训师能够引入实际案例和例证，讲解透彻，激发学员思考
        tempRate.rate6 = data.C3_615640180269; //培训师能设置提问，小组讨论等互动环节，使学员积极参与其中
        tempRate.rate7 = data.C3_615640206802; //培训师能够及时，认真地回答学员提出的问题
        tempRate.rate8 = data.C3_615640235456; //时间控制合理使我感到舒适\
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
        tempRate.rate3 = data.C3_615640043869; //我所学到的内容对实际工作或个人发展有帮助
        tempRate.rate2_1 = data.C3_722076452880;//有合适的课前调研，并且调研结果与课程内容联系紧密
        tempRate.rate2_2 = data.C3_722076492665;//课程时长设置合适，课程进度不紧迫不冗长
        tempRate.rate3_1 = data.C3_722079578079; //培训师具有足够的专业知识和经验
        tempRate.rate3_2 = data.C3_722079636630;//培训师备课充分，对授课内容非常熟悉，课件设计美观大方
        tempRate.rate4 = data.C3_615640107592; //培训师语言表达能力好，音量和语速适中，讲解清晰生动，能够运用肢体语言
        tempRate.rate5 = data.C3_615640157603; //培训师能够引入实际案例和例证，讲解透彻，激发学员思考
        tempRate.rate6 = data.C3_615640180269; //培训师能设置提问，小组讨论等互动环节，使学员积极参与其中
        tempRate.rate7 = data.C3_615640206802; //培训师能够及时，认真地回答学员提出的问题
        tempRate.rate8 = data.C3_615640235456; //时间控制合理使我感到舒适\
        tempRate.rate9 = data.C3_722087822472;//我对本次课程整体满意
        tempRate.rate10 = data.C3_722087862632;//我愿意向朋友或同事推荐这门课程
        tempRate.rate11 = data.C3_722087899198;//在培训过程中，培训组织者基于我足够的后勤支持
        tempRate.rate12 = data.C3_722087926763;//培训场地设备设施完整无故障
        const otherAdvice = {
          shortcommings: data.C3_622216725340,
          advantages: data.C3_622216706104
        };
        this.setState({
          rate: tempRate,
          otherAdvice
        });
      }
    }
    let res2; //行动计划
    try {
      res2 = await http().getTable({
        resid: 615571557694,
        cmswhere: `courseArrange = ${this.props.onCourseDetailID}`
      });
    } catch (err) {
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

  handleRateChange = key => value => {
    const tempRate = {
      ...this.state.rate
    };
    tempRate[key] = value;
    this.setState({
      rate: tempRate
    });
    this.props.onSubmit(tempRate);
  };

  handleOutRateChange = key => value => {
    const tempRate = {
      ...this.state.rateOut
    };
    tempRate[key] = value;
    this.setState({
      rateOut: tempRate
    });
    this.props.onSubmit(tempRate);
  };

  /**
   * 添加知识点
   */
  handleAddKnowledge = () => {
    let knowledge = [...this.state.knowledge];
    if (knowledge.length > 2) {
      return message.info('不能多于3个');
    }
    knowledge.push('');
    this.setState({
      knowledge
    });
  };

  handleKnowledgeChange = index => e => {
    const { knowledge } = this.state;
    knowledge[index] = e.target.value;
    this.props.setKnowledge(knowledge);
    this.setState({
      knowledge
    });
  };

  /**
   * 删除知识点
   */
  handleDeleteKnowledge = index => () => {
    let knowledge = [...this.state.knowledge];
    if (knowledge.length === 1) {
      return message.info('不能少于1个');
    }
    knowledge.splice(index, 1);
    this.props.setKnowledge(knowledge);
    this.setState({
      knowledge
    });
  };

  /**
   * 添加行动计划
   */
  handleAddPlan = () => {
    let plans = [...this.state.plans];
    if (plans.length > 2) {
      return message.info('不能多于3个');
    }
    plans.push('');
    this.setState({
      plans
    });
  };

  handlePlanChange = index => e => {
    const { plans } = this.state;
    plans[index] = e.target.value;
    this.props.setPlans(plans);
    this.setState({
      plans
    });
  };

  /**
   * 删除行动计划
   */
  handleDeletePlan = index => () => {
    let plans = [...this.state.plans];
    if (plans.length <= 1) {
      return message.info('不能少于1个');
    }
    plans.splice(index, 1);
    this.props.setPlans(plans);
    this.setState({
      plans
    });
  };

  render() {
    const required = !(this.props.mode === 'view');
    const { plans, knowledge, rate } = this.state;
    return (
      <div>


        <Card>
          <Card type="inner" title="培训整体满意度" className="cardinner">
            <Row>
              <Col span={12}>我对本次课程整体满意</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate9} disabled />
                ) : (
                    <Rate
                      value={rate.rate9}
                      onChange={this.handleRateChange('rate9')}
                    />
                  )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>我愿意向朋友或同事推荐这门课程</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate10} disabled />
                ) : (
                    <Rate
                      value={rate.rate10}
                      onChange={this.handleRateChange('rate10')}
                    />
                  )}
              </Col>
            </Row>
          </Card>
          <Card type="inner" title="讲师专业水平" className="cardinner">
            <Row>
              <Col span={12}>讲师备课充分，对授课内容非常了解</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate1} disabled />
                ) : (
                    <Rate
                      value={rate.rate1}
                      onChange={this.handleRateChange('rate1')}
                    />
                  )}
              </Col>
            </Row>
          </Card>
          <Card type="inner" title="课程内容安排" className="cardinner">
            <Row>
              <Col span={12}>本次培训的主题明确，逻辑清晰，内容充实，有针对性</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate2} disabled />
                ) : (
                    <Rate
                      value={rate.rate2}
                      onChange={this.handleRateChange('rate2')}
                    />
                  )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>有合适的课前调研，并且调研结果与课程内容联系紧密</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate2_1} disabled />
                ) : (
                    <Rate
                      value={rate.rate2_1}
                      onChange={this.handleRateChange('rate2_1')}
                    />
                  )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>课程时长设置合适，课程进度不紧迫不冗长</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate2_2} disabled />
                ) : (
                    <Rate
                      value={rate.rate2_2}
                      onChange={this.handleRateChange('rate2_2')}
                    />
                  )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>我所学到的内容对实际工作或个人发展有帮助</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate3} disabled />
                ) : (
                    <Rate
                      value={rate.rate3}
                      onChange={this.handleRateChange('rate3')}
                    />
                  )}
              </Col>
            </Row>
          </Card>
          <Card type="inner" title="授课技巧" className="cardinner">
            <Row>
              <Col span={12}>培训师具有足够的专业知识和经验</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate3_1} disabled />
                ) : (
                    <Rate
                      value={rate.rate3_1}
                      onChange={this.handleRateChange('rate3_1')}
                    />
                  )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>培训师备课充分，对授课内容非常熟悉，课件设计美观大方</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate3_2} disabled />
                ) : (
                    <Rate
                      value={rate.rate3_2}
                      onChange={this.handleRateChange('rate3_2')}
                    />
                  )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                培训师语言表达能力好，音量和语速适中，讲解清晰生动，能够运用肢体语言
                </Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate4} disabled />
                ) : (
                    <Rate
                      value={rate.rate4}
                      onChange={this.handleRateChange('rate4')}
                    />
                  )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                培训师能够引入实际案例和例证，讲解透彻，激发学员思考
                </Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate5} disabled />
                ) : (
                    <Rate
                      value={rate.rate5}
                      onChange={this.handleRateChange('rate5')}
                    />
                  )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>培训师能设置提问，小组讨论等互动环节，使学员积极参与其中</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate6} disabled />
                ) : (
                    <Rate
                      value={rate.rate6}
                      onChange={this.handleRateChange('rate6')}
                    />
                  )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>培训师能够及时，认真地回答学员提出的问题</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate7} disabled />
                ) : (
                    <Rate
                      value={rate.rate7}
                      onChange={this.handleRateChange('rate7')}
                    />
                  )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>时间控制合理使我感到舒适</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate8} disabled />
                ) : (
                    <Rate
                      value={rate.rate8}
                      onChange={this.handleRateChange('rate8')}
                    />
                  )}
              </Col>
            </Row>
          </Card>
          <Card type="inner" title="培训组织与支持" className="cardinner">
            <Row>
              <Col span={12}>在培训过程中，培训组织者基于我足够的后勤支持</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate11} disabled />
                ) : (
                    <Rate
                      value={rate.rate11}
                      onChange={this.handleRateChange('rate11')}
                    />
                  )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>培训场地设备设施完整无故障</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={rate.rate12} disabled />
                ) : (
                    <Rate
                      value={rate.rate12}
                      onChange={this.handleRateChange('rate12')}
                    />
                  )}
              </Col>
            </Row>
          </Card>
          {this.props.onCourseType === '内训' ? (<>
            <Form.Item
              label="我很有收获的内容"
              labelCol="4"
              required={required}
            >
              <TextArea
                placeholder="我很有收获的内容"
                disabled={this.props.mode === 'view'}
                value={this.state.otherAdvice.advantages}
                onChange={e => {
                  this.setState(
                    {
                      otherAdvice: {
                        ...this.state.otherAdvice,
                        advantages: e.target.value
                      }
                    },
                    () => this.props.onAdviceChange(this.state.otherAdvice)
                  );
                }}
              />
            </Form.Item>
            <Form.Item
              label="我希望改进的内容"
              labelCol="4"
              required={required}
            >
              <TextArea
                placeholder="我希望改进的内容"
                value={this.state.otherAdvice.shortcommings}
                disabled={this.props.mode === 'view'}
                onChange={e => {
                  this.setState(
                    {
                      otherAdvice: {
                        ...this.state.otherAdvice,
                        shortcommings: e.target.value
                      }
                    },
                    () => this.props.onAdviceChange(this.state.otherAdvice)
                  );
                }}
              />
            </Form.Item></>
          ) : null}
        </Card>

        {this.props.onCourseType === '内训' ? null : (
          <>
            <Row>
              <div>
                <ul className="feedbackList">
                  <li key="tip">
                    列出培训中学习到的3个知识点
                    {this.props.mode === 'view' ? null : (
                      <Tooltip title="添加一项">
                        <Icon
                          style={{ fontSize: '20px' }}
                          type="plus-circle"
                          onClick={this.handleAddKnowledge}
                        />
                      </Tooltip>
                    )}
                  </li>
                  {knowledge.map((item, index) => {
                    return (
                      <li key={index}>
                        <rect>{index + 1}</rect>
                        {this.props.mode === 'view' ? (
                          <p>{item}</p>
                        ) : (
                            <input
                              type="text"
                              placeholder="请填入你所学到的知识点"
                              onChange={this.handleKnowledgeChange(index)}
                              value={item}
                            />
                          )}

                        {this.props.mode === 'view' ? null : (
                          <Popconfirm
                            onConfirm={this.handleDeleteKnowledge(index)}
                            title="确认删除吗？"
                          >
                            <Icon
                              style={{ fontSize: '20px' }}
                              type="close-circle"
                            />
                          </Popconfirm>
                        )}
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
                    {this.props.mode === 'view' ? null : (
                      <Tooltip title="添加一项">
                        <Icon
                          style={{ fontSize: '20px' }}
                          type="plus-circle"
                          onClick={this.handleAddPlan}
                        />
                      </Tooltip>
                    )}
                  </li>
                  {/* <li className="alter2" key="tip1">
                    <rect>序号</rect>
                    <p>具体行为</p>
                    
                  </li> */}
                  {plans.map((item, index) => {
                    return (
                      <li key={index}>
                        <rect>{index + 1}</rect>
                        {this.props.mode === 'view' ? (
                          <p>{item}</p>
                        ) : (
                            <input
                              type="text"
                              placeholder="请填入你所学到的具体行为"
                              value={item}
                              onChange={this.handlePlanChange(index)}
                            />
                          )}

                        {this.props.mode === 'view' ? null : (
                          <Popconfirm
                            title="确认删除吗？"
                            onConfirm={this.handleDeletePlan(index)}
                          >
                            <Icon
                              style={{ fontSize: '20px' }}
                              type="close-circle"
                            />
                          </Popconfirm>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Row>
          </>
        )}
      </div>
    );
  }
}
export default FeedBackAndPlan;
