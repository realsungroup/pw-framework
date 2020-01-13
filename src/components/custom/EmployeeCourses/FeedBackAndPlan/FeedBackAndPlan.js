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
        rate1: 5,
        rate2: 5,
        rate3: 5,
        rate4: 5,
        rate5: 5,
        rate6: 5,
        rate7: 5,
        rate8: 5
      },
      otherAdvice: {
        advantages: '', // 益处
        shortcommings: '' //缺点
      },
      //外训评分
      rateOut: {
        rate1: 5,
        rate2: 5,
        rate3: 5,
        rate4: 5
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
        {this.props.onCourseType === '内训' ? (
          <Card>
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
                <Col span={12}>我认为课程主题准确，结构清晰，内容充实</Col>
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
                <Col span={12}>所学的内容对实际工作有很大帮助</Col>
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
                <Col span={12}>
                  讲师语言表达能力好,讲解清楚生动,运用肢体语言
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
                  讲师能够引入实际案例和例证,讲解透彻,激发学员思考
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
                <Col span={12}>我能够积极参与到课堂中去</Col>
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
                <Col span={12}>我的提问能够得到讲师认真,满意的答复</Col>
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
            </Form.Item>
          </Card>
        ) : (
          <Card type="inner" title="讲师专业水平" className="cardinner">
            <Row>
              <Col span={12}>培训机构服务满意度</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={this.state.rateOut.rate1} disabled />
                ) : (
                  <Rate
                    value={this.state.rateOut.rate1}
                    onChange={this.handleOutRateChange('rate1')}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>培训讲师满意度</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={this.state.rateOut.rate2} disabled />
                ) : (
                  <Rate
                    value={this.state.rateOut.rate2}
                    onChange={this.handleOutRateChange('rate2')}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>培训内容和工作内容关联度</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={this.state.rateOut.rate3} disabled />
                ) : (
                  <Rate
                    value={this.state.rateOut.rate3}
                    onChange={this.handleOutRateChange('rate3')}
                  />
                )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>是否推荐同事参加该课程</Col>
              <Col span={12}>
                {this.props.mode === 'view' ? (
                  <Rate value={this.state.rateOut.rate4} disabled />
                ) : (
                  <Rate
                    value={this.state.rateOut.rate4}
                    onChange={this.handleOutRateChange('rate4')}
                  />
                )}
              </Col>
            </Row>
          </Card>
        )}
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
