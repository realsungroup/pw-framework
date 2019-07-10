import React, { Component } from 'react';
import './FeedBackAndPlan.less';
import {
  Card,
  Row,
  Col,
  Rate,
  InputNumber,
  DatePicker,
  Input,
  Button
} from 'antd';
import moment from 'moment';
import http from 'Util20/api';
const dateFormat = 'YYYY-MM-DD';

class FeedBackAndPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      planView: [],
      planWrite: [
        {
          actions: '',
          startTime: ' ',
          endTime: ' ',
          progress: 0
        }
      ],
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
    };
  }
  componentDidMount() {
    if (this.props.mode === 'view') {
      //
      this.getFeebackAndRate();
    }
  }
  // 获取后台反馈的分数和行动计划
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
      if (res.data[0].C3_615639406401 === '外训') {
        const tempRateOut = { ...rateOut };
        tempRateOut.rate1 = res.data[0].C3_478370015482; //机构服务满意度
        tempRateOut.rate2 = res.data[0].C3_478370045169; //讲师满意度
        tempRateOut.rate3 = res.data[0].C3_615580966131; //内容关联度
        tempRateOut.rate4 = res.data[0].C3_478370100284; //是否推荐同事参加考试课程
        this.setState({
          rateOut: tempRateOut
        });
        // console.log('后端返回的外训评分', this.state.rateOut);
      } else {
        const tempRate = { ...rate };
        tempRate.rate1 = res.data[0].C3_615639978971; //讲师备课充分
        tempRate.rate2 = res.data[0].C3_615640010121; //我认为课程主题准确，结构清晰，内容充实
        tempRate.rate3 = res.data[0].C3_615640043869; //所学的内容对实际工作有很大帮助
        tempRate.rate4 = res.data[0].C3_615640107592; //讲师语言表达能力好,讲解清楚生动,运用肢体语言
        tempRate.rate5 = res.data[0].C3_615640157603; // 讲师能够引入实际案例和例证,讲解透彻,激发学员思考
        tempRate.rate6 = res.data[0].C3_615640180269; //我能够积极参与到课堂中去
        tempRate.rate7 = res.data[0].C3_615640206802; //我的提问能够得到讲师认真,满意的答复
        tempRate.rate8 = res.data[0].C3_615640235456; //时间控制合理使我感到舒适
        this.setState({
          rate: tempRate
        });
        console.log('后盾返回的内训评分', tempRate);
      }
    }
    let res2; //行动计划
    try {
      res2 = await http().getTable({
        resid: 615571557694,
        cmswhere: `courseArrange =${this.props.onCourseDetailID}`
      });
    } catch (err) {
      console.log(err);
    }
    console.log('后端返回的行动计划', res2);
    this.setState({
      planView: res2.data
    });
  };
  // 内训评分反馈
  rate1Change = value => {
    const tempRate = { ...this.state.rate };
    tempRate.rate1 = value;
    this.setState({
      rate: tempRate
    });
    this.props.onSubmit(tempRate);
  };
  rate2Change = value => {
    const tempRate = { ...this.state.rate };
    tempRate.rate2 = value;
    this.setState({
      rate: tempRate
    });
    this.props.onSubmit(tempRate);
  };
  rate3Change = value => {
    const tempRate = { ...this.state.rate };
    tempRate.rate3 = value;
    this.setState({
      rate: tempRate
    });
    this.props.onSubmit(tempRate);
  };
  rate4Change = value => {
    const tempRate = { ...this.state.rate };
    tempRate.rate4 = value;
    this.setState({
      rate: tempRate
    });
    this.props.onSubmit(tempRate);
  };
  rate5Change = value => {
    const tempRate = { ...this.state.rate };
    tempRate.rate5 = value;
    this.setState({
      rate: tempRate
    });
    this.props.onSubmit(tempRate);
  };
  rate6Change = value => {
    const tempRate = { ...this.state.rate };
    tempRate.rate6 = value;
    this.setState({
      rate: tempRate
    });
    this.props.onSubmit(tempRate);
  };
  rate7Change = value => {
    const tempRate = { ...this.state.rate };
    tempRate.rate7 = value;
    this.setState({
      rate: tempRate
    });
    this.props.onSubmit(tempRate);
  };
  rate8Change = value => {
    const tempRate = { ...this.state.rate };
    tempRate.rate8 = value;
    this.setState({
      rate: tempRate
    });
    this.props.onSubmit(tempRate);
  };
  // 外训评分关键
  rateOut1Change = value => {
    const tempRate = { ...this.state.rateOut };
    tempRate.rate1 = value;
    this.setState({
      rateOut: tempRate
    });
    this.props.onSubmit(tempRate);
  };
  rateOut2Change = value => {
    const tempRate = { ...this.state.rateOut };
    tempRate.rate2 = value;
    this.setState({
      rateOut: tempRate
    });
    this.props.onSubmit(tempRate);
  };
  rateOut3Change = value => {
    const tempRate = { ...this.state.rateOut };
    tempRate.rate3 = value;
    this.setState({
      rateOut: tempRate
    });
    this.props.onSubmit(tempRate);
  };
  rateOut4Change = value => {
    const tempRate = { ...this.state.rateOut };
    tempRate.rate4 = value;
    this.setState({
      rateOut: tempRate
    });
    this.props.onSubmit(tempRate);
  };
  // 添加计划明细和进度
  addPlanwrite = () => {
    const obj = {
      actions: '',
      startTime: '',
      endTime: '',
      progress: ''
    };
    const tempPlanWrite = [...this.state.planWrite];
    tempPlanWrite.push(obj);
    this.setState({
      planWrite: tempPlanWrite
    });
    this.props.onSetPlanWrite(tempPlanWrite);
  };
  // 删除计划
  removePlanWrite = index => {
    const temPlanWrite = [...this.state.planWrite];
    temPlanWrite.splice(index, 1);
    this.setState({
      planWrite: temPlanWrite
    });
    this.props.onSetPlanWrite(temPlanWrite);
  };
  // 监听输入行动的变化
  handlePlanChange = (value, index) => {
    const temPlanWrite = [...this.state.planWrite];
    temPlanWrite[index].actions = value;
    this.setState({
      planWrite: temPlanWrite
    });
    this.props.onSetPlanWrite(temPlanWrite);
  };
  // 监听开始日期的变化
  handlestartTimeChange = (date, dataString, index) => {
    const temPlanWrite = [...this.state.planWrite];
    console.log(temPlanWrite, index);
    temPlanWrite[index].startTime = dataString;
    this.setState({
      planWrite: temPlanWrite
    });
    this.props.onSetPlanWrite(temPlanWrite);
  };
  // 监听结束日期的变化
  handleendTimeChange = (data, dataString, index) => {
    const temPlanWrite = [...this.state.planWrite];
    temPlanWrite[index].endTime = dataString;
    this.setState({
      planWrite: temPlanWrite
    });
    this.props.onSetPlanWrite(temPlanWrite);
  };
  // handleProgressChange  填写时进度变化
  handleProgressChange = (value, index) => {
    const temPlanWrite = [...this.state.planWrite];
    temPlanWrite[index].progress = value;
    this.setState({
      planWrite: temPlanWrite
    });
    this.props.onSetPlanWrite(temPlanWrite);
  };
  // handleNumberChange 查看时进度变化
  handleNumberChange = async (value, index, item) => {
    const planView = [...this.state.planView];
    console.log(index, planView);
    planView[index].progress = value;
    this.setState({
      planView: planView
    });
    // 向后端发请求
    // console.log('item',item);
    // console.log('现在',this.state.planWrite);
    let res;
    try {
      res = await http().modifyRecords({
        resid: 615571557694,
        data: [
          {
            REC_ID: item.REC_ID,
            progress: this.state.planView[index].progress
          }
        ]
      });
    } catch (err) {
      console.log(err.message);
    }
    this.getFeebackAndRate();
  };
  renderViewOrModify = () => {
    // console.log(this.props.mode);
    if (this.props.mode === 'view') {
      return (
        <React.Fragment>
          {this.state.planView.map((item, index) => {
            return (
              <Row key={index}>
                <Col span={2}>{index + 1}</Col>
                <Col span={8}>{item.actions}</Col>
                <Col span={4}>
                  <DatePicker
                    value={moment(`${item.startTime}`, dateFormat)}
                    disabled
                  />
                </Col>
                <Col span={4}>
                  <DatePicker
                    value={moment(`${item.endTime}`, dateFormat)}
                    disabled
                  />
                </Col>
                <Col span={2}>
                  <InputNumber
                    value={item.progress}
                    onChange={value => {
                      this.handleNumberChange(value, index, item);
                    }}
                  />
                </Col>
              </Row>
            );
          })}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          {this.state.planWrite.map((item, index) => {
            return (
              <Row key={index}>
                <Col span={2}>{index + 1}</Col>
                <Col span={8}>
                  <Input
                    onChange={e => {
                      this.handlePlanChange(e.target.value, index);
                    }}
                  />
                </Col>
                <Col span={4}>
                  <DatePicker
                    onChange={(date, dateString) => {
                      this.handlestartTimeChange(date, dateString, index);
                    }}
                  />
                </Col>
                <Col span={4}>
                  <DatePicker
                    onChange={(date, dateString) => {
                      this.handleendTimeChange(date, dateString, index);
                    }}
                  />
                </Col>
                <Col span={3}>
                  <InputNumber
                    onChange={value => {
                      this.handleProgressChange(value, index);
                    }}
                  />
                </Col>
                <Col span={3}>
                  <Button
                    onClick={() => {
                      this.addPlanwrite();
                    }}
                  >
                    增加
                  </Button>
                  <Button
                    onClick={() => {
                      this.removePlanWrite(index);
                    }}
                  >
                    删除
                  </Button>
                </Col>
              </Row>
            );
          })}
        </React.Fragment>
      );
    }
  };
  render() {
    // console.log('行动计划', this.state.palnView);
    // console.log('外训平分', this.state.rateOut);
    // console.log('内训评分', this.state.rate);
    return (
      <div>
        {this.props.onCourseType === '内训' ? (
          <Card>
            <Card type="inner" title="讲师专业水平" className="cardinner">
              <Row>
                <Col span={12}>讲师备课充分，对授课内容非常了解</Col>
                <Col span={12}>
                  {this.props.mode === 'view' ? (
                    <Rate value={this.state.rate.rate1} disabled />
                  ) : (
                    <Rate
                      value={this.state.rate.rate1}
                      onChange={value => {
                        this.rate1Change(value);
                      }}
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
                    <Rate value={this.state.rate.rate2} disabled />
                  ) : (
                    <Rate
                      onChange={value => {
                        this.rate2Change(value);
                      }}
                    />
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={12}>所学的内容对实际工作有很大帮助</Col>
                <Col span={12}>
                  {this.props.mode === 'view' ? (
                    <Rate value={this.state.rate.rate3} disabled />
                  ) : (
                    <Rate
                      onChange={value => {
                        this.rate3Change(value);
                      }}
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
                    <Rate value={this.state.rate.rate4} disabled />
                  ) : (
                    <Rate
                      value={this.state.rate.rate4}
                      onChange={value => {
                        this.rate4Change(value);
                      }}
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
                    <Rate value={this.state.rate.rate5} disabled />
                  ) : (
                    <Rate
                      value={this.state.rate.rate5}
                      onChange={value => {
                        this.rate5Change(value);
                      }}
                    />
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={12}>我能够积极参与到课堂中去</Col>
                <Col span={12}>
                  {this.props.mode === 'view' ? (
                    <Rate value={this.state.rate.rate6} disabled />
                  ) : (
                    <Rate
                      onChange={value => {
                        this.rate6Change(value);
                      }}
                    />
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={12}>我的提问能够得到讲师认真,满意的答复</Col>
                <Col span={12}>
                  {this.props.mode === 'view' ? (
                    <Rate value={this.state.rate.rate7} disabled />
                  ) : (
                    <Rate
                      onChange={value => {
                        this.rate7Change(value);
                      }}
                    />
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={12}>时间控制合理使我感到舒适</Col>
                <Col span={12}>
                  {this.props.mode === 'view' ? (
                    <Rate value={this.state.rate.rate8} disabled />
                  ) : (
                    <Rate
                      value={this.state.rate.rate8}
                      onChange={value => {
                        this.rate8Change(value);
                      }}
                    />
                  )}
                </Col>
              </Row>
            </Card>
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
                    onChange={value => {
                      this.rateOut1Change(value);
                    }}
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
                    onChange={value => {
                      this.rateOut2Change(value);
                    }}
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
                    onChange={value => {
                      this.rateOut3Change(value);
                    }}
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
                    onChange={value => {
                      this.rateOut4Change(value);
                    }}
                  />
                )}
              </Col>
            </Row>
          </Card>
        )}
        {this.props.onCourseType === '内训' ? null : (
          <Card title="行动计划" style={{ marginTop: 10 }}>
            <Row>
              <Col span={2}>序号</Col>
              <Col span={8}>具体行动</Col>
              <Col span={4}>开始时间</Col>
              <Col span={4}>结束时间</Col>
              <Col span={3}>进度</Col>
              {this.props.mode === 'view' ? null : <Col span={3}>操作</Col>}
            </Row>
            {this.renderViewOrModify()}
          </Card>
        )}
      </div>
    );
  }
}
export default FeedBackAndPlan;
