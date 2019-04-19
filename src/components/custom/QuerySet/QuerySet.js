import React, { Component } from 'react';
import './QuerySet.less';
import {
  Modal,
  Input,
  Button,
  Select,
  Tabs,
  Radio,
  Checkbox,
  Upload,
  Icon,
  DatePicker
} from 'antd';
import Choice from '../Choice';
import http from '../../../util20/api';
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

// 默认的题目数据结构
let questions = [
  {
    type: 1, // 题目类型：1 表示单选题；2 表示多选题；3 表示 问答题
    typeName: '单选题',
    topic: '', // 题目标题
    isRequired: 1,
    options: [
      {
        label: 1,
        value: '',
        isWrite: false
      },
      {
        label: 2,
        value: '',
        isWrite: false
      },
      {
        label: 3,
        value: '',
        isWrite: false
      },
      {
        label: 4,
        value: '',
        isWrite: false
      }
    ]
  },
  {
    type: 2,
    typeName: '多选题',
    topic: '',
    isRequired: 1,
    options: [
      {
        label: 1,
        value: '',
        isWrite: false
      },
      {
        label: 2,
        value: '',
        isWrite: false
      },
      {
        label: 3,
        value: '',
        isWrite: false
      },
      {
        label: 4,
        value: '',
        isWrite: false
      }
    ]
  },
  {
    type: 3,
    typeName: '问答题',
    topic: '',
    answer: '',
    isRequired: 1
  }
];

class QuerySet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wid: 1000,
      title: '2019年满意度调查',
      questions,
      activeQuestionType: '1'
    };
  }
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  addSingle = () => {
    this.setState({
      visible2: true
    });
  };
  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };
  handleAddAloneOk = () => {
    const { activeQuestionType, questions } = this.state;
    switch (activeQuestionType) {
      case '1': {
        const singleQuestion = questions[0];
        let data; // 最终的 data
        const dataObj = {};
        dataObj.resid = 608828418560;
        dataObj.maindata = {
          query_id: '608897493977',
          question_topic: questions[0].topic,
          question_type: questions[0].typeName,
          question_must: questions[0].isRequired,
          _id: 1,
          _state: 'added'
        };

        // 求 subdata
        dataObj.subdata = [];
        singleQuestion.options.forEach((option, index) => {
          // console.log('循环出来的数组',index)
          const obj = {
            resid: 608828722533,
            maindata: {
              option_content: option.value,
              _id: index + 1,
              _state: 'added'
            }
          };
          dataObj.subdata.push(obj);
        });

        data = [dataObj];

        http()
          .saveRecordAndSubTables({
            data
          })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.error('添加错误原因', err);
          });
        break;
      }
      case '2': {
        // console.log(questions[1]);
        const multiQuestion = questions[1];
        let data; // 最终的 data
        const dataObj = {};
        dataObj.resid = 608828418560;
        dataObj.maindata = {
          query_id: '608897493977',
          question_topic: questions[1].topic,
          question_type: questions[1].typeName,
          question_must: questions[1].isRequired,
          _id: 1,
          _state: 'added'
        };

        // 求 subdata
        dataObj.subdata = [];
        multiQuestion.options.forEach((option, index) => {
          // console.log('循环出来的数组',index)
          const obj = {
            resid: 608828722533,
            maindata: {
              option_content: option.value,
              _id: index + 1,
              _state: 'added'
            }
          };
          dataObj.subdata.push(obj);
        });

        data = [dataObj];

        http()
          .saveRecordAndSubTables({
            data
          })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.error('添加错误原因', err);
          });

        break;
      }
      case '3': {
        console.log(questions[2]);
        let data; // 最终的 data
        const dataObj = {};
        dataObj.resid = 608828418560;
        dataObj.maindata = {
          query_id: '608897493977',
          question_topic: questions[2].topic,
          question_type: questions[2].typeName,
          question_must: questions[2].isRequired,
          _id: 1,
          _state: 'added'
        };
        //求subdata
        dataObj.subdata = [
          {
            resid: 608828722533,
            maindata: {
              option_cntent: questions[2].answer,
              _id: 1,
              _state: 'added'
            }
          }
        ];
        data = [dataObj];
        http()
          .saveRecordAndSubTables({
            data
          })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.error('添加错误原因', err);
          });
        break;
      }
    }
    this.setState({
      visible2: false
    });
  };

  handleCancel2 = e => {
    // console.log(e);
    this.setState({
      visible2: false
    });
  };
  radioChange = e => {
    this.setState({
      radiovalue: e.target.value
    });
  };
  // 监听单选题干变化;
  SingleTopicChange = e => {
    const newQuestions = [...this.state.questions];
    newQuestions[0].topic = e.target.value;
    this.setState({
      questions: newQuestions
    });
    // console.log('单选内容',questions)
  };
  // 监听多选题干变化;
  MultiTopicChange = e => {
    // console.log(e.target.value);
    const { questions } = this.state;
    const newQuestions = [...questions];
    newQuestions[1].topic = e.target.value;
    this.setState({
      questions: newQuestions
    });
  };
  // 监听问答题干变化;
  AnswerTopicChange = e => {
    // console.log(e.target.value);
    const { questions } = this.state;
    const newQuestions = [...questions];
    newQuestions[2].topic = e.target.value;
    this.setState({
      questions: newQuestions
    });
  };
  //添加选项
  addChoiceContent = () => {
    //  console.log(type)
    const { questions, activeQuestionType } = this.state;
    const newQuestions = [...questions];
    let newLabel0 = newQuestions[0].options.length + 1;
    let newLabel1 = newQuestions[1].options.length + 1;
    if (activeQuestionType == '1') {
      newQuestions[0].options.push({
        label: newLabel0,
        value: '',
        isWrite: false
      });
      return this.setState({
        questions: newQuestions
      });
    } else {
      newQuestions[1].options.push({
        label: newLabel1,
        value: '',
        isWrite: false
      });
      return this.setState({
        questions: newQuestions
      });
    }
  };
  //添加可填写选项
  addChoiceCanWrite = () => {
    const { questions, activeQuestionType } = this.state;
    const newQuestions = [...questions];
    let newLabel0 = newQuestions[0].options.length + 1;
    let newLabel1 = newQuestions[1].options.length + 1;
    if (activeQuestionType == '1') {
      newQuestions[0].options.push({
        label: newLabel0,
        value: '',
        isWrite: true
      });
      return this.setState({
        questions: newQuestions
      });
    } else {
      newQuestions[1].options.push({
        label: newLabel1,
        value: '',
        isWrite: true
      });
      return this.setState({
        questions: newQuestions
      });
    }
  };
  //删除单选选项
  deleSingleOption = index => {
    const newQuestions = [...this.state.questions];
    newQuestions[0].options.splice(index, 1);
    this.setState({ questions: newQuestions });
    console.log('删除后的数组', questions);
  };

  //多选删除选项
  deleMultiOption = index => {
    const newQuestions = [...this.state.questions];
    newQuestions[1].options.splice(index, 1);
    this.setState({ questions: newQuestions });
  };

  //监听单选选项变化
  handleSingleOptionValueChange = (value, index) => {
    const newQuestions = [...this.state.questions];
    newQuestions[0].options[index].value = value;
    this.setState({ questions: newQuestions });
  };

  //监听多选选项变化
  handleMultiOptionValueChange = (value, index) => {
    const newQuestions = [...this.state.questions];
    newQuestions[1].options[index].value = value;
    this.setState({ questions: newQuestions });
  };

  //是否选做变化
  handleChange = (value, questionIndex) => {
    const { questions } = this.state;
    questions[questionIndex].isRequired = value;
    this.setState({
      questions: questions
    });
    // console.log(questions)
  };

  renderIsRequired = (value, questionIndex) => {
    return (
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <Radio.Group
          value={value}
          buttonStyle="solid"
          onChange={e => this.handleChange(e.target.value, questionIndex)}
        >
          <Radio.Button value={1}>必做题</Radio.Button>
          <Radio.Button value={0}>选做题</Radio.Button>
        </Radio.Group>
      </div>
    );
  };

  renderSingle = () => {
    let singlechoice = questions[0];
    // console.log(singlechoice);
    return (
      <div className="query-set__single" style={{ marginTop: 15 }}>
        <div>
          <Input onChange={this.SingleTopicChange} placeholder="输入题目" />
        </div>
        <ul>
          {singlechoice.options.map((option, index) => {
            return (
              <li key={index}>
                <Radio className="raio">
                  {option.isWrite ? (
                    <Input
                      placeholder="其他"
                      style={{ width: 800 }}
                      value={option.value}
                      onChange={e =>
                        this.handleSingleOptionValueChange(
                          e.target.value,
                          index
                        )
                      }
                    />
                  ) : (
                    <Input
                      value={option.value}
                      onChange={e =>
                        this.handleSingleOptionValueChange(
                          e.target.value,
                          index
                        )
                      }
                      placeholder="输入选项内容"
                      style={{ width: 800 }}
                    />
                  )}
                  <Button
                    icon="delet"
                    onClick={() => {
                      this.deleSingleOption(index);
                    }}
                  >
                    删除
                  </Button>
                </Radio>
              </li>
            );
          })}
        </ul>
        {this.renderIsRequired(singlechoice.isRequired, 0)}
      </div>
    );
  };

  renderMulti = () => {
    let multichoice = questions[1];
    // console.log(multichoice)
    return (
      <div className="query-set__multi" style={{ marginTop: 15 }}>
        <div>
          <Input placeholder="请输入题干" onChange={this.MultiTopicChange} />
        </div>
        <ul>
          {multichoice.options.map((option, index) => {
            return (
              <li style={{ marginTop: 10 }} key={index}>
                <Checkbox
                  style={{ width: 20, height: 30 }}
                  className="checkbox"
                />
                {option.isWrite ? (
                  <Input
                    placeholder="其他"
                    style={{ width: 800 }}
                    value={option.value}
                    onChange={e =>
                      this.handleMultiOptionValueChange(e.target.value, index)
                    }
                  />
                ) : (
                  <Input
                    value={option.value}
                    onChange={e =>
                      this.handleMultiOptionValueChange(e.target.value, index)
                    }
                    placeholder="输入选项内容"
                    style={{ width: 800 }}
                  />
                )}
                <Button
                  onClick={() => {
                    this.deleMultiOption(index);
                  }}
                >
                  删除
                </Button>
              </li>
            );
          })}
        </ul>
        {this.renderIsRequired(multichoice.isRequired, 1)}

        {/* <div style={{ textAlign: 'center', marginTop: 10 }}>
          <Radio.Group
            value={multichoice.isRequired}
            buttonStyle="solid"
            onChange={this.handleChange}
          >
            <Radio.Button value={true}>必做题</Radio.Button>
            <Radio.Button value={false}>选做题</Radio.Button>
          </Radio.Group>
        </div> */}
      </div>
    );
  };

  renderAnswer = () => {
    let answers = questions[2];
    // console.log(answers)
    return (
      <div className="query-set__answer" style={{ marginTop: 15 }}>
        <div>
          <Input placeholder="请输入题干" onChange={this.AnswerTopicChange} />
        </div>
        <div>
          <TextArea style={{ marginTop: 10 }} disabled />
        </div>
        {this.renderIsRequired(answers.isRequired, 2)}
      </div>
    );
  };

  renderQuestion = () => {
    const { activeQuestionType } = this.state;
    switch (activeQuestionType) {
      // 单选题
      case '1': {
        return this.renderSingle();
      }
      // 多选题
      case '2': {
        return this.renderMulti();
      }
      // 问答题
      case '3': {
        return this.renderAnswer();
      }
    }
  };

  handleQuestionTypeChange = e => {
    this.setState({ activeQuestionType: e.target.value });
  };

  render() {
    const { activeQuestionType } = this.state;
    return (
      <div className="queryset">
        <div className="queryHeader" onClick={this.showModal}>
          <h1>2019年满意度调查</h1>
          <div>试卷说明的内容</div>
          {/* <div className='prasered'>
            133******6758刚领到##礼品一份
          </div>
          <div>该问卷已经关闭</div> */}
        </div>
        {/* <Choice /> */}
        <Choice />
        {/* <Choice /> */}
        <Modal
          title="外观&说明&礼品"
          visible={this.state.visible}
          okText="保存"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={this.state.wid}
          cancelText="取消"
        >
          <div className='query-set__modal'>
            <label className="query-set__setTitle">标题</label>
            <Input onChange={this.handlequerSetTittleChange} />
          </div>
          <div  className='query-set__modal'>
            <label className="query-set__setTitle">所属文件夹</label>
            <div>
              <Select style={{ width: '100%' }}>
                <Option value="新闻类">新闻类</Option>
                <Option value="英语类">英语类</Option>
                <Option value="语文类">语文类</Option>
                <Option value="Yiminghe">体育类</Option>
              </Select>
            </div>
          </div>
          <div className='query-set__modal'>
            <label className="query-set__setTitle">说明</label>
            <TextArea />
          </div>
          <div className='query-set__modal'>
            <label className="query-set__setTitle">外观</label>
            {/* <Upload name="avatar" action="//jsonplaceholder.typicode.com/posts/" className="avatar-uploader"></Upload> */}
            <div className="upload">
              <Icon type="plus" />
            </div>
          </div>
          <div className='query-set__modal'>
            <label className="query-set__setTitle">时间设置</label>
            <div>
              <span className="query-set__datalabel">开始时间</span>
              <DatePicker className="query-set__data" />
              <span className="query-set__datalabel">结束时间</span>
              <DatePicker className="query-set__data" />
            </div>
          </div>
          <div className='query-set__modal'>
            <label className="query-set__setTitle">礼品设置</label>
            <div>
              <RadioGroup>
                <Radio value={1}>
                  礼品份数:
                  <Input style={{ width: 30, height: 20 }} />
                  <span className="prasetip">份</span>
                </Radio>
                <Radio value={2}>
                  中奖率:
                  <Input style={{ width: 30, height: 20 }} />
                  <span className="prasetip">%</span>
                </Radio>
              </RadioGroup>
            </div>
          </div>
        </Modal>
        <div className="addStyle">
          <Button>导入添加题目</Button>
          <Button type="primary">提交</Button>
          <Button onClick={this.addSingle}>单独添加题目</Button>
          <Modal
            title="单独添加"
            visible={this.state.visible2}
            onOk={this.handleAddAloneOk}
            onCancel={this.handleCancel2}
            width={this.state.wid}
          >
            <Radio.Group
              buttonStyle="solid"
              value={activeQuestionType}
              onChange={this.handleQuestionTypeChange}
            >
              <Radio.Button value="1">单选题</Radio.Button>
              <Radio.Button value="2">多选题</Radio.Button>
              <Radio.Button value="3">问答题</Radio.Button>
            </Radio.Group>
            {this.renderQuestion()}
            {this.state.activeQuestionType == '3' ? (
              ''
            ) : (
              <div className="addchoice">
                <Button
                  icon="plus"
                  type="primary"
                  onClick={this.addChoiceContent}
                >
                  添加选项
                </Button>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={this.addChoiceCanWrite}
                >
                  添加可填写选项
                </Button>
              </div>
            )}
          </Modal>
        </div>
      </div>
    );
  }
}

export default QuerySet;
