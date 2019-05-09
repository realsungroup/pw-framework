import React, { Component } from 'react';
import './ExamSet.less';
import {
  Modal,
  Input,
  Button,
  Radio,
  Checkbox,
  Popconfirm,
  message,
  Spin,
  Select,
  Icon,
  Upload
} from 'antd';
import http from '../../../util20/api';
import qs from 'qs';
import { cloneDeep } from 'lodash';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const uploadFile = (file, url) => {
  return new Promise((resolve, reject) => {
    let fd = new FormData();
    fd.append('file', file, file.name);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onload = () => {
      const data = JSON.parse(xhr.response);
      if (xhr.status === 200 && (data.error === 0 || data.error === '0')) {
        const imgUrl = data.data;
        resolve(imgUrl);
      } else {
        reject(data);
      }
    };
    xhr.send(fd);
  });
};

function getFileType(file) {
  return file.type.split('/')[1];
}

let questions = [
  {
    type: '1', // 题目类型：1 表示单选题；2 表示多选题；3 表示 问答题
    typeName: '单选题',
    topic: '', // 题目标题
    answer: '',
    imgUrl: '',
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
    type: '2',
    typeName: '多选题',
    topic: '',
    answer: [], //答案
    imgUrl: '', //图片链接
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
    type: '3',
    typeName: '判断题',
    topic: '',
    answer: '',
    imgUrl: '' //图片链接
  }
];
class ExamSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wid: 500,
      queryId: '',
      questions: cloneDeep(questions),
      queryName: '',
      queryrecid: '',
      activeQuestionType: '1',
      AllQuestions: [],
      wid2: 1000,
      difficultLev: '低难度',
      currentQuestion: [],
      loading: false
    };
  }
  // 获取该试卷
  getThisQuery = async id => {
    let res;
    try {
      res = await http().getTable({
        resid: 607188968490,
        cmswhere: `C3_607171749463 = ${id}`
      });
      console.log(res);
      this.setState({
        queryId: res.data[0].C3_607171749463,
        queryName: res.data[0].C3_607171754854,
        queryrecid: res.data[0].REC_ID,
        loading: false
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 获取该问卷试题
  getThisQueryQuestions = async id => {
    this.setState({ loading: true });
    let res;
    try {
      res = await http().getTable({
        resid: 607188996053,
        subresid: 607189013257,
        cmswhere: `C3_607172879503 =${id}`
      });
      console.log(res);
      this.setState({
        AllQuestions: res.data,
        loading: false
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 试卷名称模态框
  showModal = () => {
    this.setState({
      visible: true,
      laoding: false
    });
  };
  // 试卷名称模态框取消的关闭
  handleNameChangecancel = () => {
    this.setState({
      visible: false,
      laoding: false
    });
  };
  //监听试卷名称的变化
  handleNameChange = value => {
    this.setState({
      queryName: value
    });
  };

  handleNameChangeok = async () => {
    const { queryName, queryrecid } = this.state;
    this.setState({
      visible: false,
      laoding: true
    });
    try {
      let res = await http().modifyRecords({
        resid: 607188968490,
        data: [
          {
            REC_ID: queryrecid,
            C3_607171754854: queryName
          }
        ]
      });
      this.setState({ loading: false });
    } catch (err) {
      console.error(err);
    }
  };

  // 点击完成跳回首页
  toMyQuery = () => {
    window.location.href = `/fnmodule?resid=607170235566&recid=608295658538&type=考试管理&title=试卷管理`;
  };
  // 单独添加
  addSingle = () => {
    this.setState({
      visible2: true,
      questions: cloneDeep(questions)
    });
  };
  // 监听难易程度的变化
  handleQuestionDiffLevChange = value => {
    this.setState({
      difficultLev: value
    });
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
  // 单独添加确定
  handleAddAloneOk = async () => {
    const { questions, activeQuestionType, queryId, difficultLev } = this.state;
    let terminaldata = [];
    switch (activeQuestionType) {
      case '1': {
        console.log('單選題', questions[0]);
        let tempArr = [];
        questions[0].options.forEach((option, index) => {
          const str = String.fromCodePoint(index + 65) + '.' + option.value;
          tempArr.push(str);
        });
        // console.log('想想', tempArr);
        const terStr = tempArr.join('');
        console.log(terStr);
        terminaldata = [
          {
            C3_607172879503: queryId,
            C3_607025683815: questions[0].typeName,
            C3_607025683659: questions[0].topic,
            C3_607025683987: terStr,
            C3_607025682987: questions[0].answer,
            C3_610564959242: questions[0].imgUrl
          }
        ];
        break;
      }
      case '2': {
        console.log('多選題', questions[1]);
        let tempArr = [];
        questions[1].options.forEach((option, index) => {
          const str = String.fromCodePoint(index + 65) + '.' + option.value;
          tempArr.push(str);
        });
        // console.log('想想', tempArr);
        const terStr = tempArr.join(' ');
        const AnswerStr = questions[1].answer.join('');
        terminaldata = [
          {
            C3_607172879503: queryId,
            C3_607025683815: questions[1].typeName,
            C3_607025683659: questions[1].topic,
            C3_607025683987: terStr,
            C3_607025682987: AnswerStr,
            C3_607025683503: difficultLev,
            C3_610564959242: questions[0].imgUrl
          }
        ];
        break;
      }
      case '3': {
        console.log('判斷', questions[2]);
        terminaldata = [
          {
            C3_607172879503: queryId,
            C3_607025683659: questions[2].topic,
            C3_607025683815: questions[2].typeName,
            C3_607025682987: questions[2].answer,
            C3_607025683503: difficultLev,
            C3_610564959242: questions[0].imgUrl
          }
        ];
      }
    }
    console.log('最终的ong', terminaldata);
    this.setState({
      visible2: false,
      laoding: true
    });
    let res;
    try {
      res = await http().addRecords({
        resid: 607188996053,
        data: terminaldata
      });
      console.log(res);
      this.setState({ laoding: false });
      this.getThisQueryQuestions(queryId);
      this.renderGetAllQuestions();
    } catch (err) {
      console.error(err);
    }
  };
  // 单独添加取消
  handleCancel2 = () => {
    this.setState({
      visible2: false
    });
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
  // 题型判断
  handleQuestionTypeChange = e => {
    this.setState({ activeQuestionType: e.target.value });
  };
  // 渲染单选题
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
                  <span style={{ marginRight: 20 }}>
                    {String.fromCharCode(index + 65)}
                  </span>
                  <Input
                    placeholder="请输入选项内容"
                    style={{ width: 780 }}
                    value={option.value}
                    onChange={e =>
                      this.handleOptionValueChange(e.target.value, index)
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
          value={singlechoice.answer}
          style={{ width: 600 }}
          onChange={this.handleCorrectAnswerChange}
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
                <span style={{ marginRight: 20 }}>
                  {String.fromCharCode(index + 65)}
                </span>
                <Input
                  placeholder="输入选项内容"
                  style={{ width: 780 }}
                  value={option.value}
                  onChange={e =>
                    this.handleOptionValueChange(e.target.value, index)
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
          value={multichoice.answer}
          mode="multiple"
          onChange={this.handleCorrectAnswerChange}
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
  renderAnswer = () => {
    let answers = this.state.questions[2];
    // console.log(answers)
    return (
      <div className="query-set__answer" style={{ marginTop: 15,marginBottom:15 }}>
        <div>
          <Input
            value={answers.topic}
            placeholder="请输入题干"
            onChange={this.AnswerTopicChange}
          />
        </div>
        <span>正确答案:</span>
        <Select
          value={answers.answer}
          onChange={this.handleCorrectAnswerChange}
          style={{ width: 400 }}
        >
          <Option value="Y">正确</Option>
          <Option value="N">错误</Option>
        </Select>
      </div>
    );
  };
  // 添加选项
  addChoiceContent = () => {
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
  // 选项内容的变化
  handleOptionValueChange = (value, index) => {
    const { activeQuestionType } = this.state;
    const newQuestions = [...this.state.questions];
    switch (activeQuestionType) {
      case '1': {
        newQuestions[0].options[index].value = value;
        break;
      }
      case '2': {
        newQuestions[1].options[index].value = value;
        break;
      }
    }
    this.setState({
      questions: newQuestions
    });
  };
  // hanldeuploadAddPicture = ()=>{

  // }
  hanldeuploadAddPicture = fileInfo => {
    const { activeQuestionType } = this.state;
    const newQuestions = [...this.state.questions];
    const file = fileInfo.file;
    const type = getFileType(file);
    const bucketname = 'realsun';
    const url = `http://kingofdinner.realsun.me:8102/api/AliyunOss/PutOneImageObject?bucketname=${encodeURIComponent(
      bucketname
    )}&srctype=${encodeURIComponent(type)}`;
    try {
      uploadFile(file, url).then(backUrl => {
        console.log('返回的图片路径', backUrl);
        switch (activeQuestionType) {
          case '1': {
            newQuestions[0].imgUrl = backUrl;
            break;
          }
          case '2': {
            newQuestions[1].imgUrl = backUrl;
            break;
          }
          case '3': {
            newQuestions[2].imgUrl = backUrl;
            break;
          }
        }
        this.setState({
          questions: newQuestions
        });
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 正确答案输入的变化
  handleCorrectAnswerChange = value => {
    const { activeQuestionType } = this.state;
    const newQuestions = [...this.state.questions];
    switch (activeQuestionType) {
      case '1': {
        newQuestions[0].answer = value;
        break;
      }
      case '2': {
        newQuestions[1].answer = value;
        break;
      }
      case '3': {
        newQuestions[2].answer = value;
        break;
      }
    }
    this.setState({
      questions: newQuestions
    });
  };

  //循环遍历所有的题目
  renderGetAllQuestions() {
    const { AllQuestions } = this.state;
    // console.log('渲染时的问卷试题', AllQuestions);
    return AllQuestions.map((item, index) => {
      switch (item.C3_607025683815) {
        case '单选题': {
          return this.renderGetSingleChoice(item, index);
        }
        case '多选题': {
          return this.renderGetMultiChoice(item, index);
        }
        case '判断题': {
          return this.renderGetAnswerChoice(item, index);
        }
      }
    });
  }
  renderGetSingleChoice(item, index) {
    return (
      <div className="choice" key={item.REC_ID}>
        <div className="query-set__questionTopic">
          <span className="questionOrder"> {index + 1}.</span>
          {item.C3_607025683659}
        </div>
        {item.C3_610564959242 == null ? (
          ' '
        ) : (
          <div className="Exam-set__pic">
            <img className="Exam-set__pic__img" src={item.C3_610564959242} />
          </div>
        )}
        <RadioGroup key={item.question_id}>
          {item.subdata.map((option, index) => {
            return (
              <div key={index} className='Exam-set__single__radio'>
                <Radio value={option.C3_607026461367}>
                  {option.C3_607026461367}
                </Radio>
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
          {/* <Button size="small" icon="copy">
          复制
        </Button> */}
          <Popconfirm
            title="确定删除该题目?"
            onConfirm={() => {
              this.delCurrentQuestion(item.REC_ID);
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
          <Button
            size="small"
            icon="arrow-up"
            onClick={() => {
              this.upCurrentQuestion(item);
            }}
          >
            上移
          </Button>
          <Button
            size="small"
            icon="arrow-down"
            onClick={() => {
              this.downCurrentQuestion(item);
            }}
          >
            下移
          </Button>
          <Button
            size="small"
            icon="up-circle"
            onClick={() => this.upToTop(item)}
          >
            最前
          </Button>
          <Button
            size="small"
            icon="down-circle"
            onClick={() => {
              this.downToEnd(item);
            }}
          >
            最后
          </Button>
        </div>
      </div>
    );
  }

  renderGetMultiChoice(item, index) {
    return (
      <div className="choice" key={item.REC_ID}>
        <div className="query-set__questionTopic">
          <span className="questionOrder"> {index + 1}.</span>
          {item.C3_607025683659}
        </div>
        {item.C3_610564959242 == ' ' ? (
          ' '
        ) : (
          <div className="Exam-set__pic">
            <img className="Exam-set__pic__img" src={item.C3_610564959242} />
          </div>
        )}
        <CheckboxGroup key={item.REC_ID}>
          {item.subdata.map((option, index) => {
            return (
              <div key={index}  className='Exam-set__single__radio'>
                <Checkbox
                  key={option.REC_ID}
                  value={option.C3_607026461367}
                  style={{ marginTop: 15 }}
                >
                  {option.C3_607026461367}
                </Checkbox>
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
          {/* <Button size="small" icon="copy">
            复制
          </Button> */}
          <Popconfirm
            title="确定删除该题目?"
            onConfirm={() => {
              this.delCurrentQuestion(item.REC_ID);
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
          <Button
            size="small"
            icon="arrow-up"
            onClick={() => {
              this.upCurrentQuestion(item);
            }}
          >
            上移
          </Button>
          <Button
            size="small"
            icon="arrow-down"
            onClick={() => {
              this.downCurrentQuestion(item);
            }}
          >
            下移
          </Button>
          <Button
            size="small"
            icon="up-circle"
            onClick={() => this.upToTop(item)}
          >
            最前
          </Button>
          <Button
            size="small"
            icon="down-circle"
            onClick={() => {
              this.downToEnd(item);
            }}
          >
            最后
          </Button>
        </div>
      </div>
    );
  }

  renderGetAnswerChoice(item, index) {
    return (
      <div className="choice" key={index}>
        <div className="query-set__questionTopic">
          <span className="questionOrder"> {index + 1}.</span>
          {item.C3_607025683659}
        </div>
        {item.C3_610564959242 == ' ' ? (
          ' '
        ) : (
          <div className="Exam-set__pic">
            <img className="Exam-set__pic__img" src={item.C3_610564959242} />
          </div>
        )}
        <div className='Exam-set__single__radio'>
          <RadioGroup defaultValue="正确">
            <Radio value="Y">正确</Radio>
            <br />
            <Radio value="N">错误</Radio>
          </RadioGroup>
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
          {/* <Button size="small" icon="copy">
          复制
        </Button> */}
          <Popconfirm
            title="确定删除该题目?"
            onConfirm={() => {
              this.delCurrentQuestion(item.REC_ID);
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
          <Button
            size="small"
            icon="arrow-up"
            onClick={() => {
              this.upCurrentQuestion(item);
            }}
          >
            上移
          </Button>
          <Button
            size="small"
            icon="arrow-down"
            onClick={() => {
              this.downCurrentQuestion(item);
            }}
          >
            下移
          </Button>
          <Button
            size="small"
            icon="up-circle"
            onClick={() => this.upToTop(item)}
          >
            最前
          </Button>
          <Button
            size="small"
            icon="down-circle"
            onClick={() => {
              this.downToEnd(item);
            }}
          >
            最后
          </Button>
        </div>
      </div>
    );
  }
  //显示当前题目的模态框
  showThisQuestionModal(item) {
    const { currentQuestion } = this.state;
    this.setState({
      CurrentQuestionVisible: true,
      currentQuestion: item,
      loading: false
    });
    console.log('当前问题', currentQuestion);
  }
  // 渲染当前问题
  renderCurrentQuestion(currentQuestionType) {
    switch (currentQuestionType) {
      case '单选题': {
        return this.renderCurrentSingleQuestion();
      }
      case '多选题': {
        return this.renderCurrentMultiQuestion();
      }
      case '判断题': {
        return this.renderCurrentAnswerQuestion();
      }
    }
  }

  // 渲染当前单选题的内容
  renderCurrentSingleQuestion() {
    const { currentQuestion } = this.state;
    console.log('当前', currentQuestion);
    let middleArr = [];
    currentQuestion.subdata.forEach((item, index) => {
      // s = A.10
      const s = item.C3_607026461367;
      const value = s.substring(2);
      middleArr.push(value);
    });
    return (
      <div className="query-set__single" style={{ marginTop: 15 }}>
        <div>
          <Input
            onChange={e => {
              this.handleCurrentQuestionTopci(e.target.value);
            }}
            value={currentQuestion.C3_607025683659}
          />
        </div>
        <ul>
          {middleArr.map((option, index) => {
            return (
              <li key={index}>
                <Radio className="raio">
                  <span style={{ marginRight: 20 }}>
                    {String.fromCharCode(index + 65)}
                  </span>
                  <Input
                    value={option}
                    onChange={e =>
                      this.handleCurrentQuestionOptionChange(
                        e.target.value,
                        index
                      )
                    }
                    style={{ width: 780 }}
                  />
                  <Button
                    icon="delet"
                    onClick={() => {
                      this.delcurrentOption(index);
                    }}
                  >
                    删除
                  </Button>
                </Radio>
              </li>
            );
          })}
        </ul>
        <div styel={{ marginBottom: 10 }}>
          <span>正确答案:</span>
          <Select
            value={currentQuestion.C3_607025682987}
            style={{ width: 600 }}
            onChange={this.handleEditCorrectAnswerChange}
          >
            {currentQuestion.subdata.map((option, index) => {
              return (
                <Option value={String.fromCharCode(index + 65)} key={index}>
                  {String.fromCharCode(index + 65)}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
    );
  }
  //渲染当前多选题的内容
  renderCurrentMultiQuestion() {
    const { currentQuestion } = this.state;
    let middleArr = [];
    currentQuestion.subdata.forEach((item, index) => {
      middleArr.push(item.C3_607026461367.substring(2));
    });
    console.log('当前多选题', currentQuestion);
    console.log('当前选项内容', middleArr);
    const correctAnswerArr = currentQuestion.C3_607025682987.split('');
    return (
      <div className="query-set__multi" style={{ marginTop: 15 }}>
        <div>
          <Input
            placeholder="请输入题干"
            onChange={e => {
              this.handleCurrentQuestionTopci(e.target.value);
            }}
            value={currentQuestion.C3_607025683659}
          />
        </div>
        <ul>
          {middleArr.map((option, index) => {
            return (
              <li style={{ marginTop: 10 }} key={index}>
                <Checkbox
                  style={{ width: 20, height: 30 }}
                  className="checkbox"
                />
                <span style={{ marginRight: 20 }}>
                  {String.fromCharCode(index + 65)}
                </span>
                <Input
                  value={option}
                  onChange={e =>
                    this.handleCurrentQuestionOptionChange(
                      e.target.value,
                      index
                    )
                  }
                  style={{ width: 780 }}
                />
                <Button
                  onClick={() => {
                    this.delcurrentOption(index);
                  }}
                >
                  删除
                </Button>
              </li>
            );
          })}
        </ul>
        <div styel={{ marginBottom: 10 }}>
          <span>正确答案:</span>
          <Select
            value={correctAnswerArr}
            mode="multiple"
            onChange={this.handlemultiCorrectAnswerChange}
            style={{ width: '50%' }}
          >
            {currentQuestion.subdata.map((option, index) => {
              return (
                <Option value={String.fromCharCode(index + 65)} key={index}>
                  {String.fromCharCode(index + 65)}
                </Option>
              );
            })}
          </Select>
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
            value={currentQuestion.C3_607025683659}
          />
        </div>
        <div styel={{ marginBottom: 10 }}>
          <span>正确答案:</span>
           <Select
          value={currentQuestion.C3_607025682987}
          onChange={this.handleEditCorrectAnswerChange}
        >
          <Option value="Y">正确</Option>
          <Option value="N">错误</Option>
        </Select>
        </div>
      </div>
    );
  }
  // 编辑中添加选项
  addCurrentQuestionOption = () => {
    const { currentQuestion } = this.state;
    console.log('当前问题', currentQuestion);
    const newcurrentQuestion = { ...currentQuestion };
    const obj = {
      C3_607026461367: ''
    };
    newcurrentQuestion.subdata.push(obj);
    this.setState({
      currentQuestion: newcurrentQuestion
    });
  };
  // 关闭编辑模态框
  handleEditModal = () => {
    this.setState({
      CurrentQuestionVisible: false
    });
  };
  componentDidMount() {
    const quertString = window.location.search;
    // console.log('地址', quertString);
    const qsObj = qs.parse(quertString.substring(1));
    // console.log(qsObj);
    this.getThisQuery(qsObj.id);
    this.getThisQueryQuestions(qsObj.id);
  }

  //编辑中选项内容的变化
  handleCurrentQuestionOptionChange(value, index) {
    const tempcurrentQuestion = this.state.currentQuestion;
    tempcurrentQuestion.subdata[index].C3_607026461367 = 'c.' + value;
    this.setState({
      currentQuestion: tempcurrentQuestion
    });
    console.log('变化后当前的问题', this.state.currentQuestion);
  }
  //编辑中题干内容的变化
  handleCurrentQuestionTopci(value) {
    const tempcurrentQuestion = this.state.currentQuestion;
    tempcurrentQuestion.C3_607025683659 = value;
    this.setState({
      currentQuestion: tempcurrentQuestion
    });
    console.log('题干变化后的', this.state.currentQuestion);
  }
  // 删除编辑中的选项
  delcurrentOption = index => {
    const { currentQuestion } = this.state;
    const newcurrentQuestion = { ...currentQuestion };
    newcurrentQuestion.subdata.splice(index, 1);
    this.setState({
      currentQuestion: newcurrentQuestion
    });
  };
  // 编辑中正确答案内容变化
  handleEditCorrectAnswerChange = value => {
    const { currentQuestion } = this.state;
    const newcurrentQuestion = { ...currentQuestion };
    newcurrentQuestion.C3_607025682987 = value;
    this.setState({
      currentQuestion: newcurrentQuestion
    });
    console.log('答案变化后的', currentQuestion);
  };
  // 修改中多选正确答案的变化
  handlemultiCorrectAnswerChange = value => {
    const newcurrentQuestion = this.state.currentQuestion;
    console.log('多选答案的变化', value);
    const tempvalue = value.join('');
    newcurrentQuestion.C3_607025682987 = tempvalue;
    this.setState({
      currentQuestion: newcurrentQuestion
    });
  };
  // 编辑中保存时
  handleEditModalSave = async () => {
    const { currentQuestion, queryId, loading } = this.state;
    const newcurrentQuestion = { ...currentQuestion };
    newcurrentQuestion.subdata.forEach((item, index) => {
      if (item.C3_607026461367) {
        const value = item.C3_607026461367.substring(2);
        item.backendValue = String.fromCodePoint(index + 65) + '.' + value;
      }
    });
    let midArr = [];
    newcurrentQuestion.subdata.forEach((item, index) => {
      midArr.push(item.backendValue);
    });
    const terStr = midArr.join('');
    let terminaldata = [];
    // 试卷题目表 607188996053
    if (newcurrentQuestion.C3_607025683815 == '判断题') {
      terminaldata = [
        {
          C3_607172879503: queryId, //试卷编号
          C3_607025683659: newcurrentQuestion.C3_607025683659, //题干
          C3_607025682987: newcurrentQuestion.C3_607025682987, //正确答案
          REC_ID: newcurrentQuestion.REC_ID,
          C3_610564959242: newcurrentQuestion.C3_610564959242
        }
      ];
    } else {
      terminaldata = [
        {
          C3_607172879503: queryId,
          C3_607025683659: newcurrentQuestion.C3_607025683659,
          C3_607025682987: newcurrentQuestion.C3_607025682987, //正确答案
          C3_607025683987: terStr, //选项
          REC_ID: newcurrentQuestion.REC_ID,
          C3_610564959242: newcurrentQuestion.C3_610564959242
        }
      ];
    }
    console.log('最后编辑后的内容', terminaldata);
    this.setState({
      CurrentQuestionVisible: false,
      loading: false
    });
    let res;
    try {
      res = await http().modifyRecords({
        resid: 607188996053,
        data: terminaldata
      });
      console.log(res);
      this.getThisQueryQuestions(queryId);
      this.renderGetAllQuestions();
      this.setState({ loading: false });
    } catch (err) {
      console.error(err);
    }
  };
  // 删除试题
  delCurrentQuestion = async recid => {
    const { queryId } = this.state;
    this.setState({ loading: true });
    let res;
    try {
      res = await http().removeRecords({
        resid: 607188996053,
        data: [
          {
            REC_ID: recid
          }
        ]
      });
      console.log(res);
      this.setState({ loading: false });
      this.getThisQueryQuestions(queryId);
      this.renderGetAllQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  //上移某道题
  upCurrentQuestion = async item => {
    console.log(1111, item);
    const { AllQuestions } = this.state;
    const queryId = item.C3_607172879503;
    const recid = item.REC_ID;
    console.log('当前题目序号', item.C3_609952752239);
    console.log(queryId);
    if (item.C3_609952752239 > AllQuestions[0].C3_609952752239) {
      this.setState({ laoding: true });
      await http().moveUpSteps({
        resid: 607188996053,
        recid: recid,
        strOrderCol: `C3_609952752239`,
        intStep: 1,
        strGroupWhere: `C3_607172879503='${queryId}'`
      });
      this.getThisQueryQuestions(queryId);
      this.setState({ loading: false });
    } else {
      return message.error('已经是第一道题,不能再上移了');
    }
  };
  // 下移某道题
  downCurrentQuestion = async item => {
    const { AllQuestions } = this.state;
    console.log(AllQuestions.length);
    console.log('当前序号', item.C3_609952752239);
    console.log(
      '最后一道题序号',
      AllQuestions[AllQuestions.length - 1].C3_609952752239
    );
    const queryId = item.C3_607172879503;
    const recid = item.REC_ID;
    if (
      item.C3_609952752239 >=
      AllQuestions[AllQuestions.length - 1].C3_609952752239
    ) {
      return message.info('已经是最后一题了，不能再下移了');
    } else {
      this.setState({ loading: true });
      await http().moveDownSteps({
        resid: 607188996053,
        recid: recid,
        strOrderCol: `C3_609952752239`,
        intStep: 1,
        strGroupWhere: `C3_607172879503='${queryId}'`
      });
      this.setState({ loading: false });
      this.getThisQueryQuestions(queryId);
      this.renderGetAllQuestions();
    }
  };
  // 移到最前
  upToTop = async item => {
    const { AllQuestions } = this.state;
    const queryId = item.C3_607172879503;
    const recid = item.REC_ID;
    console.log('当前序号', item.C3_609952752239);
    console.log('第一道题的序号', AllQuestions[0].C3_609952752239);
    if (item.C3_609952752239 > AllQuestions[0].C3_609952752239) {
      this.setState({ laoding: true });
      await http().moveUpFirst({
        resid: 607188996053,
        recid: recid,
        strOrderCol: ` C3_609952752239  `,
        strGroupWhere: `C3_607172879503='${queryId}'`
      });
      this.getThisQueryQuestions(queryId);
      this.setState({ laoding: false });
    } else {
      return message.info('已经是最前的了');
    }
  };
  // 移到最后
  downToEnd = async item => {
    const { AllQuestions } = this.state;
    const queryId = item.C3_607172879503;
    const recid = item.REC_ID;
    console.log('当前序号', item.C3_609952752239);
    console.log(
      '第一道题的序号',
      AllQuestions[AllQuestions.length - 1].C3_609952752239
    );
    if (
      item.C3_609952752239 >=
      AllQuestions[AllQuestions.length - 1].C3_609952752239
    ) {
      return message.info('已经是最后一题了，不能再移了');
    } else {
      this.setState({ laoding: true });
      await http().moveDownLast({
        resid: 607188996053,
        recid: recid,
        strOrderCol: ` C3_609952752239  `,
        strGroupWhere: `C3_607172879503='${queryId}'`
      });
      this.getThisQueryQuestions(queryId);
      this.setState({ laoding: false });
    }
  };

  // 编辑上传图片
  hanldeuploadPicture = fileInfo => {
    const { currentQuestion } = this.state;
    const newcurrentQuestion = { ...currentQuestion };
    const file = fileInfo.file;
    const type = getFileType(file);
    const bucketname = 'realsun';
    const url = `http://kingofdinner.realsun.me:8102/api/AliyunOss/PutOneImageObject?bucketname=${encodeURIComponent(
      bucketname
    )}&srctype=${encodeURIComponent(type)}`;
    try {
      // 点击编辑时的
      uploadFile(file, url).then(res => {
        newcurrentQuestion.C3_610564959242 = res;
        this.setState({
          currentQuestion: newcurrentQuestion
        });
      });
    } catch (err) {
      console.error(err);
    }
  };
  // Render
  render() {
    const {
      queryName,
      queryId,
      activeQuestionType,
      difficultLev,
      loading
    } = this.state;
    return (
      <Spin spinning={loading}>
        {' '}
        <div className="queryset">
          <div className="queryHeader" onClick={this.showModal}>
            <h1>{queryName}</h1>
          </div>
          {/* 试题的渲染 */}
          {this.renderGetAllQuestions()}
          {/* 名称模态框 */}
          <Modal
            title="试卷名称修改"
            visible={this.state.visible}
            onOk={this.handleNameChangeok}
            onCancel={this.handleNameChangecancel}
            width={this.state.wid}
          >
            <Input
              value={queryName}
              onChange={e => this.handleNameChange(e.target.value)}
            />
          </Modal>
          <div className="addStyle">
            {queryId == '' ? (
              <Button disabled>导入添加题目</Button>
            ) : (
              <Button>导入添加题目</Button>
            )}

            {queryId == '' ? (
              ''
            ) : (
              <Button onClick={this.toMyQuery}>完成</Button>
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
            width={this.state.wid2}
            destroyOnClose={true}
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
            {this.state.activeQuestionType == '3' ? (
              ''
            ) : (
              <div className="addchoice" style={{ marginTop: 10 }}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.addChoiceContent()}
                >
                  添加选项
                </Button>
              </div>
            )}
            <div className="query-set__upload">
              <Upload
                listType="picture"
                customRequest={this.hanldeuploadAddPicture}
              >
                <div className="Exam-set__upload__box">
                  <Icon type="plus" />
                  <div>upload</div>
                </div>
              </Upload>
            </div>
          </Modal>
          {/* 当前点击问题的模态框 */}
          <Modal
            title={this.state.currentQuestion.C3_607025683815}
            visible={this.state.CurrentQuestionVisible}
            onOk={this.handleEditModalSave}
            onCancel={this.handleEditModal}
            width={this.state.wid2}
            destroyOnClose={true}
          >
            {this.renderCurrentQuestion(
              this.state.currentQuestion.C3_607025683815
            )}

            {this.state.currentQuestion.C3_607025683815 == '判断题' ? (
              ''
            ) : (
              <div className="addchoice" style={{ marginTop: 10 }}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => {
                    this.addCurrentQuestionOption();
                  }}
                >
                  添加选项
                </Button>
              </div>
            )}
            <div className="query-set__upload">
              <Upload
                listType="picture"
                customRequest={this.hanldeuploadPicture}
              >
                <div className="Exam-set__upload__box">
                  <Icon type="plus" />
                  <div>upload</div>
                </div>
              </Upload>
            </div>
           <div className='Exam-set__picbox'> <img src={this.state.currentQuestion.C3_610564959242} /> </div>
            <div />
          </Modal>
        </div>
      </Spin>
    );
  }
}
export default ExamSet;
