import React, { Component } from 'react';
import './QuerySet.less';
import {
  Modal,
  Input,
  Button,
  Select,
  Radio,
  Checkbox,
  Icon,
  DatePicker,
  Switch,
  message,
  Popconfirm,
  Spin
} from 'antd';
import moment from 'moment';
import http from '../../../util20/api';
import qs from 'qs';
import { cloneDeep } from 'lodash';
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

// 默认的题目数据结构
let questions = [
  {
    type: 1, // 题目类型：1 表示单选题；2 表示多选题；3 表示 问答题
    typeName: '单选题',
    topic: '', // 题目标题
    isRequired: 1,
    options: [
      {
        value: '',
        isWrite: '0'
      },
      {
        value: '',
        isWrite: '0'
      },
      {
        value: '',
        isWrite: '0'
      },
      {
        value: '',
        isWrite: '0'
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
        value: '',
        isWrite: '0'
      },
      {
        value: '',
        isWrite: '0'
      },
      {
        value: '',
        isWrite: '0'
      },
      {
        value: '',
        isWrite: '0'
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
      questions: cloneDeep(questions),
      activeQuestionType: '1',
      query_name: '',
      query_description: '',
      query: {}, //跳转时拿到的问卷，
      floders: [],
      floder_name: '',
      startDate: '',
      endDate: '',
      isGift: '0',
      giftCount: '',
      giftRate: '',
      queryId: '', //跳转时传过来的ID,
      AllQuestions: [],
      currentQuestion: {},
      CurrentQuestionVisible: false,
      currentactiveQuestionMust: '',
      giftStyle: '',
      loading: false
    };
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  addSingle = () => {
    this.setState({
      visible2: true,
      questions: cloneDeep(questions)
    });
  };

  // 关闭编辑模态框
  handleEditModal = () => {
    this.setState({
      CurrentQuestionVisible: false
    });
  };
  //点击设置保存时
  handlequerySetChange = e => {
    // console.log(e);
    console.log('问卷id', queryId);
    const {
      query_name,
      query_description,
      startDate,
      endDate,
      floder_name,
      isGift,
      giftCount,
      queryId,
      loading
    } = this.state;
    if (queryId == '') {
      // 添加这个记录
      this.setState({ loading: true });
      http()
        .addRecords({
          resid: 608822905547,
          data: [
            {
              query_name: query_name,
              query_description: query_description,
              floder_name: floder_name,
              start_time: startDate,
              end_time: endDate,
              gift: isGift,
              gift_count: giftCount
            }
          ]
        })
        .then(res => {
          console.log(res);
          console.log(res);
          let tempid = res.data[0].query_id;
          this.setState({ loading: false });
          this.getThisquery(tempid);
        })
        .catch(err => {
          console.error(err);
          message.error('queryset编辑添加失败', err.message);
        });
    } else {
      // 修改
      http()
        .modifyRecords({
          resid: 608822905547,
          cmswhere: 'query_id =' + queryId,
          data: [
            {
              REC_ID: queryId,
              query_name: query_name,
              query_description: query_description,
              floder_name: floder_name,
              start_time: startDate,
              end_time: endDate,
              gift: isGift,
              gift_count: giftCount
            }
          ]
        })
        .then(res => {
          // console.log(res);
          this.getThisquery(queryId);
        })
        .catch(err => {
          console.error(err);
          message.error('queryset编辑修改失败', err.message);
        });
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
  handleAddAloneOk = () => {
    const { activeQuestionType, questions, queryId } = this.state;
    this.setState({ loading: true });
    switch (activeQuestionType) {
      case '1': {
        const singleQuestion = questions[0];
        let data; // 最终的 data
        const dataObj = {};
        dataObj.resid = 608828418560;
        dataObj.maindata = {
          query_id: queryId,
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
              _state: 'added',
              option_write: option.isWrite
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
            this.setState({ loading: false });
            this.getThisQueryQuestions(queryId);
          })
          .catch(err => {
            console.error('添加错误原因', err);
            message.error('queryset添加失败', err.message);
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
          query_id: queryId,
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
              _state: 'added',
              option_write: option.isWrite
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
            // console.log(res);
            this.getThisQueryQuestions(queryId);
          })
          .catch(err => {
            console.error('添加错误原因', err);
            message.error('queryset添加问答失败', err.message);
          });

        break;
      }
      case '3': {
        console.log(questions[2]);
        let data; // 最终的 data
        const dataObj = {};
        dataObj.resid = 608828418560;
        dataObj.maindata = {
          query_id: queryId,
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
              option_content: questions[2].answer,
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
            // console.log(res);
            this.getThisQueryQuestions(queryId);
          })
          .catch(err => {
            console.error('添加错误原因', err);
            message.error('queryset添加失败', err.message);
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
        isWrite: '0'
      });
      return this.setState({
        questions: newQuestions
      });
    } else {
      newQuestions[1].options.push({
        label: newLabel1,
        value: '',
        isWrite: '0'
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
        isWrite: '1'
      });
      return this.setState({
        questions: newQuestions
      });
    } else {
      newQuestions[1].options.push({
        label: newLabel1,
        value: '',
        isWrite: '1'
      });
      return this.setState({
        questions: newQuestions
      });
    }
  };
  //删除单选选项
  deleSingleOption = (index, optionId) => {
    const newQuestions = [...this.state.questions];
    newQuestions[0].options.splice(index, 1);
    this.setState({ questions: newQuestions });
    // if (optionId) {
    //   http()
    //     .removeRecords({
    //       resid: 608828722533,
    //       data: [
    //         {
    //           REC_ID: optionId
    //         }
    //       ]
    //     })
    //     .then(res => {
    //       console.log(res);
    //     })
    //     .catch(err => {
    //       console.error(err);
    //       message.error('queryset删除单选选项失败', err.message);
    //     });
    //   console.log('删除后的数组', questions);
    // }
  };

  //多选删除选项
  deleMultiOption = (index, optionId) => {
    const newQuestions = [...this.state.questions];
    newQuestions[1].options.splice(index, 1);
    this.setState({ questions: newQuestions });
    // if (optionId) {
    //   http()
    //     .removeRecords({
    //       resid: 608828722533,
    //       data: [
    //         {
    //           REC_ID: optionId
    //         }
    //       ]
    //     })
    //     .then(res => {
    //       console.log(res);
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });
    // }
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
    let singlechoice = this.state.questions[0];
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
                  {option.isWrite == '0' ? (
                    <Input
                      placeholder="请输入选项内容"
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
                      placeholder="其他"
                      onChange={e =>
                        this.handleSingleOptionValueChange(
                          e.target.value,
                          index
                        )
                      }
                      style={{ width: 800 }}
                    />
                  )}
                  <Button
                    icon="delet"
                    onClick={() => {
                      this.deleSingleOption(index, option.option_id);
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
    let multichoice = this.state.questions[1];
    // console.log(multichoice)
    return (
      <div className="query-set__multi" style={{ marginTop: 15 }}>
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
              <li style={{ marginTop: 10 }} key={index}>
                <Checkbox
                  style={{ width: 20, height: 30 }}
                  className="checkbox"
                />
                {option.isWrite == '0' ? (
                  <Input
                    placeholder="输入选项内容"
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
                    placeholder="其他"
                    style={{ width: 800 }}
                  />
                )}
                <Button
                  onClick={() => {
                    this.deleMultiOption(index, option.option_id);
                  }}
                >
                  删除
                </Button>
              </li>
            );
          })}
        </ul>
        {this.renderIsRequired(multichoice.isRequired, 1)}
      </div>
    );
  };

  renderAnswer = () => {
    let answers = this.state.questions[2];
    // console.log(answers)
    return (
      <div className="query-set__answer" style={{ marginTop: 15 }}>
        <div>
          <Input
            value={answers.topic}
            placeholder="请输入题干"
            onChange={this.AnswerTopicChange}
          />
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
  handleDateChange = (date, dateStrings) => {
    console.log(dateStrings);
    // console.log('选择的日期', dates[0]._d);
    this.setState({
      startDate: dateStrings[0],
      endDate: dateStrings[1]
    });
  };
  handlequerSetNameChange = e => {
    console.log(e.target.value);
    this.setState({
      query_name: e.target.value
    });
  };
  handlequerySetDescriptionChange = e => {
    // console.log('textarea的内容', e.target.value);
    this.setState({
      query_description: e.target.value
    });
  };
  //获取指定问卷试题
  getThisQueryQuestions = queryId => {
    this.setState({ loading: true });
    console.log('问卷试题表中问卷Id', queryId);
    http()
      .getTable({
        resid: 608828418560,
        subresid: 608828722533,
        cmswhere: 'query_id =' + queryId
      })
      .then(questions => {
        console.log('问卷试题', questions.data);
        this.setState({
          AllQuestions: questions.data,
          loading: false
        });
      })
      .catch(err => {
        console.error(err);
        message.error('queryset获取问卷试题', err.message);
      });
  };
  //获取文件夹
  getFloders = () => {
    this.setState({ loading: true });
    http()
      .getTable({
        resid: 608822887704
      })
      .then(res => {
        console.log('文件夹', res.data);
        let floders = res.data;
        this.setState({
          floders: floders,
          loading: false
        });
      })
      .catch(err => {
        console.error(err);
        message.error('queryset获取文件夹', err.message);
        this.setState({ loading: false });
      });
  };
  getThisquery = queryId => {
    console.log('文卷ID', queryId);
    this.setState({ loading: true });
    http()
      .getTable({
        resid: 608822905547,
        cmswhere: `query_id = ${queryId}`
      })
      .then(query => {
        console.log('拿到的问卷信息', query.data[0], this.state.query);
        this.setState({
          query: query.data[0],
          queryId: query.data[0].query_id,
          query_name: query.data[0].query_name,
          floder_name: query.data[0].floder_name,
          startDate: query.data[0].start_time,
          endDate: query.data[0].end_time,
          query_description: query.data[0].query_description,
          isGift: query.data[0].gift,
          giftCount: query.data[0].gift_count,
          loading: false
        });
      })
      .catch(err => {
        console.log('获取指定问卷内容失败原因', err);
        message.error('queryset获取指定问卷内容失败原因', err.message);
        this.setState({ loading: false });
      });
  };
  componentDidMount() {
    const quertString = window.location.search;
    console.log('地址', quertString);
    const qsObj = qs.parse(quertString.substring(1));
    console.log('问卷ID', qsObj.id);
    //获取当前的日期
    var today = new Date();
    let date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    this.setState({
      queryId: qsObj.id,
      startDate: date,
      endDate: date
    });
    this.getFloders();
    this.setState({ loading: false });
    if (qsObj.id) {
      this.setState({ loading: false });
      this.getThisquery(qsObj.id);
      this.getThisQueryQuestions(qsObj.id);
    }
  }
  // 监听是否有礼品的变化
  handleSwitchGiftChange = checked => {
    console.log(checked);
    let isGift;
    if (checked) {
      // 有礼品
      isGift = 1;
    } else {
      // 无礼品
      isGift = 0;
    }
    this.setState({
      isGift: isGift
    });
  };
  // 监听礼品份数的变化
  handleGiftCountChange = e => {
    this.setState({
      giftCount: e.target.value
    });
  };
  // 监听礼品中奖率的变化
  handleGiftRateChange = e => {
    this.setState({
      giftRate: e.target.value
    });
  };
  // 监听文件夹的变化
  handlefloderNameChange = value => {
    console.log('所在文件夹名称', `${value}`);
    this.setState({
      floder_name: `${value}`
    });
  };
  //循环遍历所有的题目
  renderGetAllQuestions() {
    const { AllQuestions } = this.state;
    // console.log('渲染时的问卷试题', AllQuestions);
    return AllQuestions.map(item => {
      switch (item.question_type) {
        case '单选题': {
          return this.renderGetSingleChoice(item);
        }
        case '多选题': {
          return this.renderGetMultiChoice(item);
        }
        case '问答题': {
          return this.renderGetAnswerChoice(item);
        }
      }
    });
  }
  //上移某道题
  upCurrentQuestion(questionID, questionOrder) {
    const { AllQuestions, queryId } = this.state;

    let tempAllQuestions = this.state.AllQuestions;
    // console.log(questionID, questionOrder);
    if (questionOrder >= 2) {
      let neworder = questionOrder - 1;
      let index = questionOrder - 2;
      // console.log("上边那到题",tempAllQuestions[index]);
      const recid = tempAllQuestions[index].REC_ID;
      // console.log(neworder);
      http()
        .modifyRecords({
          resid: '608828418560',
          data: [
            {
              REC_ID: questionID,
              question_order: neworder
            },
            {
              REC_ID: recid,
              question_order: neworder + 1
            }
          ]
        })
        .then(res => {
          this.getThisQueryQuestions(queryId);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      return message.info('已经是第一项了，不能再上移了');
    }
  }
  // 下移某道题
  downCurrentQuestion(questionID, questionOrder) {
    const { AllQuestions, queryId } = this.state;
    console.log(AllQuestions.length);
    if (questionOrder >= AllQuestions.length) {
      return message.info('已经是最后一题了，不能再下移了');
    } else {
      // 下一道题的索引
      let index = questionOrder;
      // console.log(AllQuestions[index]);
      const recid = AllQuestions[index].REC_ID;
      http()
        .modifyRecords({
          resid: '608828418560',
          data: [
            {
              REC_ID: questionID,
              question_order: questionOrder + 1
            },
            {
              REC_ID: recid,
              question_order: questionOrder - 1
            }
          ]
        })
        .then(res => {
          this.getThisQueryQuestions(queryId);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
  renderGetSingleChoice(item) {
    return (
      <div className="choice" key={item.question_id}>
        <div className="query-set__questionTopic">
          {item.question_must == '1' ? <span className="mark">*</span> : ''}
          {item.question_topic}
        </div>
        <RadioGroup key={item.question_id}>
          {item.subdata.map(option => {
            return (
              <div key={option.option_id}>
                {option.option_write == '0' ? (
                  <Radio value={option.option_content}>
                    {option.option_content}
                  </Radio>
                ) : (
                  <Radio value={option.option_content}>
                    {option.option_content}{' '}
                    <Input
                      className="WriteInut"
                      style={{
                        borderRadius: 0,
                        border: 'none',
                        borderBottom: '1px solid #000',
                        width: 100
                      }}
                    />
                  </Radio>
                )}
              </div>
            );
          })}
        </RadioGroup>
        <div className="choiceActionBox">
          <Button
            size="small"
            icon="form"
            onClick={() => {
              this.showThisQuestionModal(item);
            }}
          >
            编辑
          </Button>
          <Button size="small" icon="copy">
            复制
          </Button>
          <Button
            size="small"
            icon="delete"
            onClick={() => {
              this.delCurrentQuestion(item.question_id);
            }}
          >
            删除
          </Button>
          <Button
            size="small"
            icon="arrow-up"
            onClick={() => {
              this.upCurrentQuestion(item.question_id, item.question_order);
            }}
          >
            上移
          </Button>
          <Button
            size="small"
            icon="arrow-down"
            onClick={() => {
              this.downCurrentQuestion(item.question_id, item.question_order);
            }}
          >
            下移
          </Button>
          <Button size="small" icon="up-circle">
            最前
          </Button>
          <Button size="small" icon="down-circle">
            最后
          </Button>
        </div>
      </div>
    );
  }
  renderGetMultiChoice(item) {
    return (
      <div className="choice" key={item.question_id}>
        <div className="query-set__questionTopic">
          {item.question_must == '1' ? <span className="mark">*</span> : ''}
          {item.question_topic}
        </div>
        <CheckboxGroup key={item.question_id}>
          {item.subdata.map(option => {
            return (
              <div key={option.option_id}>
                {option.option_write == '0' ? (
                  <Checkbox value={option.option_content}>
                    {option.option_content}
                  </Checkbox>
                ) : (
                  <Checkbox value={option.option_content}>
                    {option.option_content}
                    <Input
                      className="WriteInut"
                      style={{
                        borderRadius: 0,
                        border: 'none',
                        borderBottom: '1px solid #000',
                        width: 100
                      }}
                    />
                  </Checkbox>
                )}
              </div>
            );
          })}
        </CheckboxGroup>
        <div className="choiceActionBox">
          <Button
            size="small"
            icon="form"
            onClick={() => {
              this.showThisQuestionModal(item);
            }}
          >
            编辑
          </Button>
          <Button size="small" icon="copy">
            复制
          </Button>
          <Button
            size="small"
            icon="delete"
            onClick={() => {
              this.delCurrentQuestion(item.question_id);
            }}
          >
            删除
          </Button>
          <Button size="small" icon="arrow-up">
            上移
          </Button>
          <Button size="small" icon="arrow-down">
            下移
          </Button>
          <Button size="small" icon="up-circle">
            最前
          </Button>
          <Button size="small" icon="down-circle">
            最后
          </Button>
        </div>
      </div>
    );
  }
  renderGetAnswerChoice(item) {
    return (
      <div className="choice" key={item.question_id}>
        <div className="query-set__questionTopic">
          {item.question_must == '1' ? <span className="mark">*</span> : ''}
          {item.question_topic}
        </div>
        <div>
          <TextArea style={{ height: 52, marginBottom: 20 }} />
        </div>
        <div className="choiceActionBox">
          <Button
            size="small"
            icon="form"
            onClick={() => {
              this.showThisQuestionModal(item);
            }}
          >
            编辑
          </Button>
          <Button size="small" icon="copy">
            复制
          </Button>
          <Popconfirm
            title="确定删除该题目?"
            onConfirm={() => {
              this.delCurrentQuestion(item.question_id);
            }}
          >
            <Button
              size="small"
              icon="delete"
              // onClick={}
            >
              删除
            </Button>
          </Popconfirm>
          <Button size="small" icon="arrow-up">
            上移
          </Button>
          <Button size="small" icon="arrow-down">
            下移
          </Button>
          <Button size="small" icon="up-circle">
            最前
          </Button>
          <Button size="small" icon="down-circle">
            最后
          </Button>
        </div>
      </div>
    );
  }
  //删除当前的这道试题
  delCurrentQuestion(questionID) {
    const { queryId } = this.state;
    console.log('试题ID', questionID);
    http()
      .removeRecords({
        resid: 608828418560,
        data: [
          {
            REC_ID: questionID
          }
        ]
      })
      .then(res => {
        console.log(res);
        if (res.Error) {
          console.log('删除失败');
        } else {
          this.getThisQueryQuestions(queryId);
        }
      })
      .catch(err => {
        console.error(err);
        message.error('获取指定问卷内容失败原因', err.message);
      });
  }
  //显示当前题目的模态框
  showThisQuestionModal(item) {
    const { currentQuestion } = this.state;
    this.setState({
      CurrentQuestionVisible: true,
      currentQuestion: item,
      currentactiveQuestionMust: item.question_must
    });
    console.log('当前问题', currentQuestion);
  }
  //renderCurrentQuestion 判断当前的题目类型，
  renderCurrentQuestion(currentQuestionType) {
    switch (currentQuestionType) {
      case '单选题': {
        return this.renderCurrentSingleQuestion();
      }
      case '多选题': {
        return this.renderCurrentMultiQuestion();
      }
      case '问答题': {
        return this.renderCurrentAnswerQuestion();
      }
    }
  }
  // 删除编辑中选项
  delcurrentOption(optionId, index) {
    const { currentQuestion } = this.state;
    console.log('当前选项的Id', optionId);
    currentQuestion.subdata.splice(index, 1);
    // 还要删除后台表中的数据
    this.setState({ loading: true });
    http().removeRecords({
      resid: 608828722533,
      data: [
        {
          REC_ID: optionId
        }
      ]
    });
    this.setState({
      currentQuestion: currentQuestion,
      loading: false
    });
  }
  //编辑中添加选项
  addCurrentQuestionOption(questiontype) {
    const tempCurrentQuestion = this.state.currentQuestion;
    const option = {
      option_content: '',
      option_write: '0'
    };
    tempCurrentQuestion.subdata.push(option);
    this.setState({
      currentQuestion: tempCurrentQuestion
    });
  }
  //编辑中添加可填写选项
  addCurrentQuestionWiteOption() {
    const tempCurrentQuestion = this.state.currentQuestion;
    const option = {
      option_content: '',
      option_write: '1'
    };
    tempCurrentQuestion.subdata.push(option);
    this.setState({
      currentQuestion: tempCurrentQuestion
    });
    console.log('添加可填写选项后的', this.state.currentQuestion);
  }
  //编辑中选项内容的变化
  handleCurrentQuestionOptionChange(value, index) {
    const tempcurrentQuestion = this.state.currentQuestion;
    tempcurrentQuestion.subdata[index].option_content = value;
    // console.log(value)
    this.setState({
      currentQuestion: tempcurrentQuestion
    });
    // console.log(this.state.currentQuestion);
  }
  //编辑中题干内容的变化
  handleCurrentQuestionTopci(value) {
    const tempcurrentQuestion = this.state.currentQuestion;
    tempcurrentQuestion.question_topic = value;
    this.setState({
      currentQuestion: tempcurrentQuestion
    });
    // console.log("题干变化后的",this.state.currentQuestion)
  }
  //编辑中选做的变化
  handleCurrentQuestionMustChange(value) {
    //  console.log(this.state.currentQuestion);
    const { currentQuestion } = this.state;
    currentQuestion.question_must = value;
    let tempcurrentQuestion = currentQuestion;
    this.setState({
      currentQuestion: tempcurrentQuestion,
      currentactiveQuestionMust: value
    });
    console.log('变化后的当前问卷', this.state.currentQuestion);
  }
  //渲染当前单选题的内容
  renderCurrentSingleQuestion() {
    const { currentQuestion } = this.state;
    // console.log(currentQuestion);
    return (
      <div className="query-set__single" style={{ marginTop: 15 }}>
        <div>
          <Input
            onChange={e => {
              this.handleCurrentQuestionTopci(e.target.value);
            }}
            value={currentQuestion.question_topic}
          />
        </div>
        <ul>
          {currentQuestion.subdata.map((option, index) => {
            // console.log(option)
            return (
              <li key={option.option_id}>
                <Radio className="raio">
                  <Input
                    value={option.option_content}
                    onChange={e =>
                      this.handleCurrentQuestionOptionChange(
                        e.target.value,
                        index
                      )
                    }
                    style={{ width: 800 }}
                  />
                  <Button
                    icon="delet"
                    onClick={() => {
                      this.delcurrentOption(option.option_id, index);
                    }}
                  >
                    删除
                  </Button>
                </Radio>
              </li>
            );
          })}
        </ul>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <Radio.Group
            value={this.state.currentactiveQuestionMust}
            buttonStyle="solid"
            onChange={e => {
              this.handleCurrentQuestionMustChange(e.target.value);
            }}
          >
            <Radio.Button value={'1'}>必做题</Radio.Button>
            <Radio.Button value={'0'}>选做题</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    );
  }

  //渲染当前多选题的内容
  renderCurrentMultiQuestion() {
    const { currentQuestion } = this.state;
    console.log(currentQuestion);
    return (
      <div className="query-set__multi" style={{ marginTop: 15 }}>
        <div>
          <Input
            placeholder="请输入题干"
            onChange={e => {
              this.handleCurrentQuestionTopci(e.target.value);
            }}
            value={currentQuestion.question_topic}
          />
        </div>
        <ul>
          {currentQuestion.subdata.map((option, index) => {
            return (
              <li style={{ marginTop: 10 }} key={index}>
                <Checkbox
                  style={{ width: 20, height: 30 }}
                  className="checkbox"
                />
                <Input
                  value={option.option_content}
                  onChange={e =>
                    this.handleCurrentQuestionOptionChange(
                      e.target.value,
                      index
                    )
                  }
                  style={{ width: 800 }}
                />
                <Button
                  onClick={() => {
                    this.delcurrentOption(option.option_id, index);
                  }}
                >
                  删除
                </Button>
              </li>
            );
          })}
        </ul>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <Radio.Group
            value={this.state.currentactiveQuestionMust}
            buttonStyle="solid"
            onChange={e => {
              this.handleCurrentQuestionMustChange(e.target.value);
            }}
          >
            <Radio.Button value={'1'}>必做题</Radio.Button>
            <Radio.Button value={'0'}>选做题</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    );
  }
  //渲染当前问答题的内容
  renderCurrentAnswerQuestion() {
    const { currentQuestion } = this.state;
    console.log(currentQuestion);
    return (
      <div className="query-set__answer" style={{ marginTop: 15 }}>
        <div>
          <Input
            placeholder="请输入题干"
            onChange={e => {
              this.handleCurrentQuestionTopci(e.target.value);
            }}
            value={currentQuestion.question_topic}
          />
        </div>
        <div>
          <TextArea style={{ marginTop: 10 }} disabled />
        </div>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <Radio.Group
            value={this.state.currentactiveQuestionMust}
            buttonStyle="solid"
            onChange={e => {
              this.handleCurrentQuestionMustChange(e.target.value);
            }}
          >
            <Radio.Button value={'1'}>必做题</Radio.Button>
            <Radio.Button value={'0'}>选做题</Radio.Button>
          </Radio.Group>
        </div>
      </div>
    );
  }
  //点击编辑模态框中的保存
  handleEditModalSave = () => {
    const { currentQuestion } = this.state;
    this.setState({ loading: true });
    console.log('当前更新的问题', currentQuestion);
    let terminal;
    const terminaldataObj = {};
    terminaldataObj.resid = 608828418560;
    terminaldataObj.maindata = {
      REC_ID: currentQuestion.question_id,
      question_must: currentQuestion.question_must,
      question_topic: currentQuestion.question_topic,
      _state: 'modified', // 修改
      _id: 1
    };
    //求后台需要的subdata
    terminaldataObj.subdata = [];
    currentQuestion.subdata.forEach((option, index) => {
      console.log('循环出的选项', option.option_id);
      let obj;
      if (option.option_id) {
        obj = {
          resid: 608828722533,
          maindata: {
            REC_ID: option.option_id,
            option_content: option.option_content,
            _state: 'modified',
            _id: index + 1
          }
        };
      } else {
        obj = {
          resid: 608828722533,
          maindata: {
            option_write: option.option_write,
            option_content: option.option_content,
            _state: 'added',
            _id: index + 1
          }
        };
      }
      terminaldataObj.subdata.push(obj);
    });
    terminal = [terminaldataObj];
    console.log('编辑后的数据', terminal);

    // 向后端发送请求
    http()
      .saveRecordAndSubTables({
        data: terminal
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.error(err);
        message.error('queryset编辑保存失败原因', err.message);
      });
    this.setState({
      CurrentQuestionVisible: false,
      loading: false
    });
  };
  // 监听礼品设置的形式，份数或者中奖率
  giftStyleChange = value => {
    console.log('奖品形式', value);
    this.setState({
      giftStyle: value
    });
  };
  render() {
    const {
      activeQuestionType,
      query,
      query_name,
      floders,
      floder_name,
      isGift,
      queryId,
      query_description,
      loading
    } = this.state;
    // console.log('是否有礼品', isGift);
    return (
      <Spin spinning={loading}>
        {' '}
        <div className="queryset">
          <div className="queryHeader" onClick={this.showModal}>
            {queryId == '' ? (
              <h1>点击添加问卷名称和说明</h1>
            ) : (
              <div>
                <h1>{query.query_name}</h1>
                <p className="query-set__description">
                  {query.query_description}
                </p>
              </div>
            )}
          </div>
          {this.renderGetAllQuestions()}
          <Modal
            className="blank-modal"
            title="外观&说明&礼品"
            visible={this.state.visible}
            okText="保存"
            onOk={this.handlequerySetChange}
            onCancel={this.handleCancel}
            width={this.state.wid}
            cancelText="取消"
          >
            <div className="query-set__modal">
              <label className="query-set__setTitle">标题</label>
              <Input
                value={query_name}
                onChange={this.handlequerSetNameChange}
              />
            </div>
            <div className="query-set__modal">
              <label className="query-set__setTitle">所属文件夹</label>
              <Select
                style={{ width: '100%' }}
                value={floder_name}
                onChange={this.handlefloderNameChange}
              >
                {floders.map((floder, index) => {
                  return (
                    <Option value={floder.floder_name} key={index}>
                      {floder.floder_name}
                    </Option>
                  );
                })}
              </Select>
            </div>
            <div className="query-set__modal">
              <label className="query-set__setTitle">说明</label>
              <TextArea
                onChange={this.handlequerySetDescriptionChange}
                value={query_description}
              />
            </div>
            {/* <div className="query-set__modal"> */}
            {/* <label className="query-set__setTitle">外观</label> */}
            {/* <Upload name="avatar" action="//jsonplaceholder.typicode.com/posts/" className="avatar-uploader"></Upload> */}
            {/* <div className="upload"> */}
            {/* <Icon type="plus" /> */}
            {/* </div> */}
            {/* </div> */}
            <div className="query-set__modal">
              <label className="query-set__setTitle">时间设置</label>
              <div>
                <RangePicker
                  value={[
                    moment(this.state.startDate, dateFormat),
                    moment(this.state.endDate, dateFormat)
                  ]}
                  // showTime
                  onChange={this.handleDateChange}
                  dateRender={current => {
                    const style = {};
                    if (current.date() === 1) {
                      style.border = '1px solid #1890ff';
                      style.borderRadius = '50%';
                    }
                    return (
                      <div className="ant-calendar-date" style={style}>
                        {current.date()}
                      </div>
                    );
                  }}
                />
              </div>
            </div>
            <Switch
              checked={this.state.isGift === '0' ? false : true}
              checkedChildren="有礼品"
              unCheckedChildren="无礼品"
              onClick={this.handleSwitchGiftChange}
            />
            <br />
            <div className="query-set__modal">
              {isGift == 1 ? (
                <div>
                  <RadioGroup
                    onChange={e => {
                      this.giftStyleChange(e.target.value);
                    }}
                  >
                    <Radio value={'份数'}>
                      礼品份数:
                      {this.state.giftStyle == '概率' ? (
                        <Input style={{ width: 60, height: 20 }} disabled />
                      ) : (
                        <Input
                          style={{ width: 60, height: 20 }}
                          onChange={this.handleGiftCountChange}
                          value={this.state.giftCount}
                        />
                      )}
                      <span className="prasetip">份</span>
                    </Radio>
                    {/* <Radio value={'概率'}>
                    中奖率:
                    {this.state.giftStyle == '份数' ? (
                      <Input style={{ width: 60, height: 20 }} disabled />
                    ) : (
                      <Input
                        style={{ width: 60, height: 20 }}
                        onChange={this.handleGiftRateChange}
                      />
                    )}
                    <span className="prasetip">%</span>
                  </Radio> */}
                  </RadioGroup>
                </div>
              ) : (
                ''
              )}
            </div>
          </Modal>
          <div className="addStyle">
            {queryId == '' ? (
              <Button disabled>导入添加题目</Button>
            ) : (
              <Button>导入添加题目</Button>
            )}

            {queryId == '' ? (
              <Button disabled>单独添加题目</Button>
            ) : (
              <Button onClick={this.addSingle}>单独添加题目</Button>
            )}
          </div>
          <Modal
            title="单独添加"
            visible={this.state.visible2}
            onOk={this.handleAddAloneOk}
            onCancel={this.handleCancel2}
            width={this.state.wid}
            destroyOnClose={true}
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
          {/* 当前点击问题的Modal */}
          <Modal
            title={this.state.currentQuestion.question_type}
            visible={this.state.CurrentQuestionVisible}
            onOk={this.handleEditModalSave}
            onCancel={this.handleEditModal}
            width={this.state.wid}
            destroyOnClose={true}
          >
            {this.renderCurrentQuestion(
              this.state.currentQuestion.question_type
            )}
            {this.state.currentQuestion.question_type == '问答题' ? (
              ''
            ) : (
              <div className="addchoice">
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => {
                    this.addCurrentQuestionOption(
                      this.state.currentQuestion.question_type
                    );
                  }}
                >
                  添加选项
                </Button>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => {
                    this.addCurrentQuestionWiteOption();
                  }}
                >
                  添加可填写选项
                </Button>
              </div>
            )}
          </Modal>
        </div>
      </Spin>
    );
  }
}

export default QuerySet;
