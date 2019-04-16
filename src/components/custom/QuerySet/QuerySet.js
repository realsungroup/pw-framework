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
  Icon
} from 'antd';
import Choice from '../Choice';
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

// 默认的题目数据结构
let questions = [
  {
    type: 1, // 题目类型：1 表示单选题；2 表示多选题；3 表示 问答题
    typeName: '单选题',
    topic: '', // 题目标题
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
    ],
    isHaveTo: true // 题目是否为可选的
  },
  {
    type: 2,
    typeName: '多选题',
    topic: '',
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
    ],
    isHaveTo: true // 题目是否为可选的
  },
  {
    type: 3,
    typeName: '问答题',
    topic: '',
    answer: '',
    isHaveTo: true // 题目是否为可选的
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
        console.log(questions[0]);
        break;
      }
      case '2': {
        console.log(questions[1]);
        break;
      }
      case '3': {
        console.log(questions[2]);
        break;
      }
    }
    this.setState({
      visible2:false,
    })
  };

  handleCancel2 = e => {
    console.log(e);
    this.setState({
      visible2: false
    });
  };
  showTabs = key => {
    console.log(key);
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
    console.log('删除后的数组',questions)
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

  renderSingle = () => {
    let singlechoice = questions[0];
    // console.log(singlechoice);
    return (
      <div className="query-set__single" style={{ marginTop: 15 }}>
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
          <TextArea style={{ marginTop: 10 }} />
        </div>
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
          <label>标题</label>
          <Input />
          <label>说明</label>
          <TextArea />
          <label>外观</label>
          {/* <Upload name="avatar" action="//jsonplaceholder.typicode.com/posts/" className="avatar-uploader"></Upload> */}
          <div className="upload">
            <Icon type="plus" />
          </div>
          <label>礼品设置</label>
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
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <Radio.Group defaultValue="must" buttonStyle="solid">
                <Radio.Button value="must">必做题</Radio.Button>
                <Radio.Button value="may">选做题</Radio.Button>
              </Radio.Group>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default QuerySet;
