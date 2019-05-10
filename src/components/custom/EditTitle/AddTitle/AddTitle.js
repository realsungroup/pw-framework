import React, { Component } from 'react';
import { Modal, Button, Radio, Input, Checkbox, Select, message } from 'antd';
import http from 'Util20/api';
import { cloneDeep } from 'lodash';
import './AddTitle.less';
const Option = Select.Option;
let questions = [
  {
    type: 1, // 题目类型：1 表示单选题；2 表示多选题；3 表示 问答题
    typeName: '单选题',
    topic: '', // 题目标题
    correctAnswer: '',
    options: [
      {
        value: ''
      },
      {
        value: ''
      },
      {
        value: ''
      },
      {
        value: ''
      }
    ]
  },
  {
    type: 2,
    typeName: '多选题',
    topic: '',
    correctAnswer: [],
    options: [
      {
        value: ''
      },
      {
        value: ''
      },
      {
        value: ''
      },
      {
        value: ''
      }
    ]
  },
  {
    type: 3,
    typeName: '判断题',
    topic: '',
    correctAnswer: ''
  }
];
export default class AddTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      activeQuestionType: '1',
      questions: cloneDeep(questions)
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
      questions: cloneDeep(questions)
    });
  };
  // 添加题目确定
  handleAddOk = async e => {
    const { questions, activeQuestionType } = this.state;
    console.log('添加确定', questions);
    switch (activeQuestionType) {
      case '1': {
        let res;
        try {
          res = await http().addRecords({
            resid: 607599734723,
            data: [
              {
                C3_607195719536: questions[0].typeName, //题型
                C3_607195719223: questions[0].topic, //题干
                C3_607195719379: questions[0].correctAnswer, //正确答案
                C3_610630858606: questions[0].options[0] ? questions[0].options[0].value : null, //A
                C3_610630869588: questions[0].options[1] ? questions[0].options[1].value : null, //B
                C3_610630879311: questions[0].options[2] ? questions[0].options[2].value : null, //C
                C3_610630889014: questions[0].options[3] ? questions[0].options[3].value : null, //D
                C3_610630895780: questions[0].options[4] ? questions[0].options[4].value : null, //E
                C3_610630908132: questions[0].options[5] ? questions[0].options[5].value : null, //F
                C3_610630928623: questions[0].options[6] ? questions[0].options[6].value : null,  //G
                C3_610630943539: questions[0].options[7] ? questions[0].options[7].value : null,  //H
                C3_610630961465: questions[0].options[8] ? questions[0].options[8].value : null,  //I
                C3_610630972853: questions[0].options[9] ? questions[0].options[9].value : null  //J
              }
            ]
          });
          console.log(res);
          message.success('添加成功');
          this.props.refresh();
          this.setState({
            visible: false
          });
        } catch (err) {
          return console.error(err);
        }
        break;
      }
      case '2': {
        const correctAnswerarr = questions[1].correctAnswer.join('');
        let res;
        try {
          res = await http().addRecords({
            resid: 607599734723,
            data: [
              {
                C3_607195719536: questions[1].typeName,
                C3_607195719223: questions[1].topic,
                C3_607195719379: correctAnswerarr,
                C3_610630858606: questions[1].options[0] ? questions[0].options[0].value : null, //A
                C3_610630869588: questions[1].options[1] ? questions[0].options[1].value : null, //B
                C3_610630879311: questions[1].options[2] ? questions[0].options[2].value : null, //C
                C3_610630889014: questions[1].options[3] ? questions[0].options[3].value : null, //D
                C3_610630895780: questions[1].options[4] ? questions[0].options[4].value : null, //E
                C3_610630908132: questions[1].options[5] ? questions[0].options[5].value : null, //F
                C3_610630928623: questions[1].options[6] ? questions[0].options[6].value : null,  //G
                C3_610630943539: questions[1].options[7] ? questions[0].options[7].value : null,  //H
                C3_610630961465: questions[1].options[8] ? questions[0].options[8].value : null,  //I
                C3_610630972853: questions[1].options[9] ? questions[0].options[9].value : null  //J
              }
            ]
          });
          message.success('添加成功');
          this.setState({
            visible: false
          });
          this.props.refresh();
        } catch (err) {
          return console.error(err);
        }
        break;
      }
      case '3': {
        let res;
        try {
          res = await http().addRecords({
            resid: 607599734723,
            data: [
              {
                C3_607195719536: questions[2].typeName,
                C3_607195719223: questions[2].topic,
                C3_607195719379: questions[2].correctAnswer
              }
            ]
          });
          console.log(res);
          message.success('添加成功');
          this.setState({
            visible: false
          });
        } catch (err) {
          return console.error(err);
        }
        break;
      }
     
    }
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
  //监听试题题型的变化
  handleQuestionTypeChange = e => {
    this.setState({ activeQuestionType: e.target.value });
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
  //监听单选选项输入的变化
  handleSingleOptionValueChange = (value, index) => {
    const newQuestions = [...this.state.questions];
    newQuestions[0].options[index].value = value;
    this.setState({ questions: newQuestions });
  };
  //监听多选选项输入变化
  handleMultiOptionValueChange = (value, index) => {
    const newQuestions = [...this.state.questions];
    newQuestions[1].options[index].value = value;
    this.setState({ questions: newQuestions });
  };
  //监听判断正误的变化
  handleJudgeChange = e => {
    const newQuestions = [...this.state.questions];
    newQuestions[2].correctAnswer = e.target.value;
    this.setState({
      questions: newQuestions
    });
  };
  // 添加选项
  hanldeAddChoiceContent = () => {
    console.log(11111);
    const { questions, activeQuestionType } = this.state;
    const newQuestions = [...questions];
    let obj = {
      value: ''
    };
    switch (activeQuestionType) {
      case '1': {
        newQuestions[0].options.push(obj);
        return this.setState({
          questions: newQuestions
        });
      }
      case '2': {
        newQuestions[1].options.push(obj);
        return this.setState({
          questions: newQuestions
        });
      }
    }
  };
  //删除选项
  delOption = index => {
    const { questions, activeQuestionType } = this.state;
    const newQuestions = [...questions];
    switch (activeQuestionType) {
      case '1': {
        newQuestions[0].options.splice(index, 1);
        return this.setState({
          questions: newQuestions
        });
      }
      case '2': {
        newQuestions[1].options.splice(index, 1);
        return this.setState({
          questions: newQuestions
        });
      }
    }
  };
  // 监听单选正确答案的变化
  handleSingleCorrectAnswer = value => {
    const { questions } = this.state;
    const newQuestions = [...questions];
    console.log('单选题', newQuestions[0]);
    newQuestions[0].correctAnswer = value;
    this.setState({
      questions: newQuestions
    });
  };
  // 监听多选答案的变化
  handleMultiCorrectAnswer = value => {
    const { questions } = this.state;
    const newQuestions = [...questions];
    newQuestions[1].correctAnswer = value;
    this.setState({
      questions: newQuestions
    });
  };
  // 监听判断答案的变化
  handleJudgeCorrectAnswer = value => {
    const { questions } = this.state;
    const newQuestions = [...questions];
    newQuestions[2].correctAnswer = value;
    this.setState({
      questions: newQuestions
    });
  };
  // 渲染问题
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
        return this.renderJudge();
      }
    }
  };
  // 单选题
  renderSingle = () => {
    let singlechoice = this.state.questions[0];
    return (
      <div
        className="query-set__single"
        style={{ marginTop: 15, marginBottom: 10 }}
      >
        <div>
          <Input
            value={singlechoice.topic}
            onChange={this.SingleTopicChange}
            placeholder="输入题目"
          />
        </div>
        <ul>
          {singlechoice.options.map((option, index) => {
            return (
              <li key={index}>
                <Radio className="raio">
                  <span style={{ marginRight: 20 }}>
                    {String.fromCharCode(index + 65)}
                  </span>
                  <Input
                    placeholder="请输入选项内容"
                    style={{ width: 780 }}
                    value={option.value}
                    onChange={e =>
                      this.handleSingleOptionValueChange(e.target.value, index)
                    }
                  />
                  <Button
                    icon="delet"
                    onClick={() => {
                      this.delOption(index);
                    }}
                  >
                    删除
                  </Button>
                </Radio>
              </li>
            );
          })}
        </ul>
        <span>正确答案:</span>
        <Select
          value={singlechoice.correctAnswer}
          style={{ width: 600 }}
          onChange={this.handleSingleCorrectAnswer}
        >
          {singlechoice.options.map((option, index) => {
            return (
              <Option value={String.fromCharCode(index + 65)} key={index}>
                {String.fromCharCode(index + 65)}
              </Option>
            );
          })}
        </Select>
      </div>
    );
  };
  // 多选题
  renderMulti = () => {
    let multichoice = this.state.questions[1];
    // console.log(multichoice)
    return (
      <div
        className="query-set__multi"
        style={{ marginTop: 15, marginBottom: 10 }}
      >
        <div>
          <Input
            value={multichoice.topic}
            placeholder="请输入题干"
            onChange={this.MultiTopicChange}
          />
        </div>
        <ul>
          {multichoice.options.map((option, index) => {
            return (
              <li style={{ marginBottom: 10 }} key={index}>
                <Checkbox
                  style={{ width: 20, height: 30 }}
                  className="checkbox"
                />
                <span style={{ marginRight: 20 }}>
                  {String.fromCharCode(index + 65)}
                </span>
                <Input
                  placeholder="输入选项内容"
                  style={{ width: 760 }}
                  value={option.value}
                  onChange={e =>
                    this.handleMultiOptionValueChange(e.target.value, index)
                  }
                />
                <Button
                  onClick={() => {
                    this.delOption(index);
                  }}
                >
                  删除
                </Button>
              </li>
            );
          })}
        </ul>
        <span>正确答案:</span>
        <Select
          value={multichoice.correctAnswer}
          mode="multiple"
          onChange={this.handleMultiCorrectAnswer}
          style={{ width: '50%' }}
        >
          {multichoice.options.map((option, index) => {
            return (
              <Option value={String.fromCharCode(index + 65)} key={index}>
                {String.fromCharCode(index + 65)}
              </Option>
            );
          })}
        </Select>
      </div>
    );
  };
  // 渲染判断题
  renderJudge = () => {
    let judgement = this.state.questions[2];
    // console.log(judgement)
    return (
      <div className="query-set__answer" style={{ marginTop: 15 }}>
        <div>
          <Input
            value={judgement.topic}
            placeholder="请输入题干"
            onChange={this.AnswerTopicChange}
          />
        </div>
        <div style={{ marginTop: 15 }}>
          <span>正确答案:</span>
          <Select
            value={judgement.correctAnswer}
            onChange={this.handleJudgeCorrectAnswer}
            style={{ width: 400 }}
          >
            <Option value="Y">正确</Option>
            <Option value="N">错误</Option>
          </Select>
        </div>
      </div>
    );
  };

  render() {
    const { activeQuestionType } = this.state;
    return (
      <div className="btns">
        <Button onClick={this.showModal}>添加题库题目</Button>
        <Modal
          width="1000px"
          title="添加题库题目"
          visible={this.state.visible}
          onOk={this.handleAddOk}
          onCancel={this.handleCancel}
        >
          <Radio.Group
            buttonStyle="solid"
            value={activeQuestionType}
            onChange={this.handleQuestionTypeChange}
          >
            <Radio.Button value="1">单选题</Radio.Button>
            <Radio.Button value="2">多选题</Radio.Button>
            <Radio.Button value="3">判断题</Radio.Button>
          </Radio.Group>
          {this.renderQuestion()}
          {activeQuestionType == '3' ? (
            ''
          ) : (
            <Button
              type="primary"
              onClick={() => this.hanldeAddChoiceContent()}
            >
              添加选项
            </Button>
          )}
        </Modal>
      </div>
    );
  }
}
