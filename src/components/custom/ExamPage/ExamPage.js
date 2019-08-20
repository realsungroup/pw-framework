import React, { Component } from 'react';
import { Modal, Button, message, Spin, Radio, Checkbox } from 'antd';
import './ExamPage.less';
import qs from 'qs';
import http from 'Util20/api';
import moment from 'moment';
import ReactCountDown from 'rc-count-down';
const RadioGroup = Radio.Group;

export const getWindowSize = () => {
  const w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    width = w.innerWidth || e.clientWidth || g.clientWidth,
    height = w.innerHeight || e.clientHeight || g.clientHeight;
  return { width, height };
};

const multipleQuestionOptions = [
  {
    label: '正确',
    value: 'Y'
  },
  {
    label: '错误',
    value: 'N'
  }
];

const optionFields = [
  'C3_610631165366',
  'C3_610631174071',
  'C3_610631188179',
  'C3_610631200724',
  'C3_610631210942',
  'C3_610631222642',
  'C3_610631234014',
  'C3_610631245449',
  'C3_610631256930',
  'C3_610631266770'
];

/**
 * 获取考卷剩余时间
 * @param {object} startTime 开始时间；moment object
 * @param {number} duration 持续时间（分钟）
 */
const getTimeRemaining = (startTime, duration) => {
  const now = moment(); // 现在时间
  const endTime = startTime.add(duration, 'minutes'); // 结束时间
  return endTime.diff(now, 'seconds');
};

/**
 * 考试页面
 */
export default class ExamPage extends Component {
  state = {
    hasSubmit: false, // 改试卷是否已提交
    examName: '', // 试卷名称
    loading: false,
    questions: [], // 问题
    answerData: [], // 考试批次答题表
    timeRemaining: 1, // 剩余时间（秒）
    hasGetTime: false, // 是否已获取到了剩余时间
    shortcutsLeft: 1000,
    record: null,
    li:null
  };

  componentDidMount = async () => {
    window.parent.pwCallback &&
      window.parent.pwCallback.modifyTitle('考试页面');
    // 监听父窗口发送的 message 事件
    window.addEventListener(
      'message',
      e => {
        if (!e || !e.source || !e.source.pwCallback) {
          return;
        }
        // 当事件类型为 "goBack"（即返回上一页时）
        // 1. 调用 history.goBack() 方法放回上一页
        // 2. 调用父级 window 对象下的 pwCallback.modifyTitle 方法，来修改窗口左上角的标题，其内容为上一页页面的标题
        if (e.data.type === 'goBack') {
          this.props.history.goBack();
          e.source.pwCallback.modifyTitle &&
            e.source.pwCallback.modifyTitle('我的考试');
        }
      },
      false
    );
    this.setState({ loading: true });

    // 监听 resize 事件
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    const qsObj = qs.parse(window.location.search.substring(1));
    // 考试批次编号、试卷编号
    const { exambatchnum, examnum, arrangenum, personnum, myexamrecid } = qsObj;

    this.arrangeNum = arrangenum;
    this.examNum = examnum;
    this.personNum = personnum;
    this.myExamRecid = myexamrecid;

    // 根据 myexamrecid 获取 “我的考试” 页面表的记录
    let res;
    try {
      res = await http().getTable({
        resid: 609931927812,
        cmswhere: `REC_ID = '${myexamrecid}'`
      });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    const myExamRecord = res.data[0];

    // 通过考试批次编号获取考试批次
    try {
      res = await http().getTable({
        resid: 608809112309,
        cmswhere: `C3_607196596723 = '${exambatchnum}'`,
        subresid: 607270079025
      });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    // 改试卷是否已提交
    let record = res.data[0];
    this.dealRecord(record);
    let li =   record.C3_619539613886.split("（")
    console.log("li",li)
    if (record.C3_607198887973 === 'Y') {
      return this.setState({
        hasSubmit: true,
        loading: false,
        record,
        hasGetTime: true,
        myExamRecord
      });
    }else{
      this.setState({
        record,
        li:li
      })
    }

    // “考试批次答题表” 数据
    const answerData = record.subdata;
    answerData.forEach(item => (item.id = item.C3_607174324165)); // 题目编号

    const examName = record.C3_609949675460; // 试卷名称
    this.startTime = record.C3_609958684582; // 开始时间
    const duration = record.C3_609956872989; //  考试时长
    const timeRemaining = getTimeRemaining(moment(this.startTime), duration);

    // 超时，则不再获取题目，直接显示提交框
    if (timeRemaining <= 0) {
      return this.setState({
        loading: false,
        timeRemaining,
        record,
        hasGetTime: true,
        myExamRecord
      });
    }

    // 根据试卷编号获取试卷题目与选项
    try {
      res = await http().getTable({
        resid: 607188996053,
        cmswhere: `C3_607172879503 = '${examnum}'`,
        // subresid: 607189013257,
        sortField: 'C3_609952752239',
        sortOrder: 'asc'
      });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      return message.error(err.message);
    }
    const questions = [
      { type: '单选题', questions: [] },
      { type: '多选题', questions: [] },
      { type: '判断题', questions: [] }
    ];

    res.data.forEach((item, index) => {
      item.subdata = optionFields
        .map(field => {
          const value = item[field];
          if (value) {
            return {
              label: value,
              value: value
            };
          }
        })
        .filter(Boolean);

      switch (item.C3_607025683815) {
        case '单选题': {
          questions[0].questions.push(item);
          item.options = [];
          item.subdata.forEach(record => {
            item.options.push({
              label: record.label,
              value: record.value
            });
          });

          // 找到答案
          const temp = answerData.find(
            answerItem => answerItem.id === item.C3_607026334772
          );
          if (temp) {
            if (temp.C3_607174361025) {
              const optionIndex = temp.C3_607174361025.charCodeAt() - 65;
              item.answer = item.options[optionIndex].value;
            } else {
              item.answer = null;
            }

            item.id = temp.id; // 将 考试批次答题表中的题目编号存在题目记录里
          } else {
            item.answer = '';
          }

          if (item.answer) {
            item.hasDo = true;
          } else {
            item.hasDo = false;
          }

          break;
        }
        case '多选题': {
          questions[1].questions.push(item);
          item.options = [];
          item.subdata.forEach(record => {
            item.options.push({
              label: record.label,
              value: record.value
            });
          });

          // 找到答案
          const temp = answerData.find(
            answerItem => answerItem.id === item.C3_607026334772
          );
          if (temp) {
            // 'A B C'
            if (temp.C3_607174361025) {
              const answerArr = temp.C3_607174361025.split(' ');
              item.answer = answerArr.map(answerItem => {
                const optionIndex = answerItem.charCodeAt() - 65;
                return item.options[optionIndex].value;
              });
            } else {
              item.answer = [];
            }
            item.id = temp.id; // 将 考试批次答题表中的题目编号存在题目记录里
          }

          if (item.answer.length) {
            item.hasDo = true;
          } else {
            item.hasDo = false;
          }

          break;
        }
        case '判断题': {
          questions[2].questions.push(item);
          item.options = multipleQuestionOptions;

          // 找到答案
          const temp = answerData.find(
            answerItem => answerItem.id === item.C3_607026334772
          );

          if (temp) {
            item.answer = temp.C3_607174361025;
            item.id = temp.id; // 将 考试批次答题表中的题目编号存在题目记录里
          } else {
            item.answer = '';
          }

          if (item.answer) {
            item.hasDo = true;
          } else {
            item.hasDo = false;
          }

          break;
        }
      }
    });

    let i = 0;
    questions.forEach(item => {
      item.questions.forEach(question => {
        question.C3_607025683659 = `${i++ + 1}. ${question.C3_607025683659}`;
      });
    });

    this.setState({
      questions,
      examName,
      loading: false,
      answerData,
      timeRemaining,
      record,
      hasGetTime: true,
      myExamRecord
    });
  };

  dealRecord = record => {
    record.name = record.C3_610126074004;
    record.time = record.C3_610126164784;
    record.totalScore = record.C3_607198872223;
    record.score = record.C3_608755560466;
    record.isPass = record.C3_610125942554;
  };

  handleResize = e => {
    const w = getWindowSize().width;
    const shortcutsLeft = (w - 800) / 2 + 800;
    this.setState({ shortcutsLeft });
  };

  saveAnswer = async (recid, answer) => {
    const resid = 607270079025; // 考试批次答题表资源 id
    const C3_607174361025 = answer; // 答案
    try {
      await http().modifyRecords({
        resid,
        data: [{ C3_607174361025, REC_ID: recid }]
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    message.info('保存成功');
  };

  renderQuestion = (type, question) => {
    switch (type) {
      case '单选题': {
        return this.renderSingleChoice(question, type);
      }
      case '多选题': {
        return this.renderMultipleChoice(question);
      }
      case '判断题': {
        return this.renderJudge(question);
      }
    }
  };

  handleJudgeChange = (question, value) => {
    question.answer = value;
    question.hasDo = true;
    this.forceUpdate();

    // 保存答案
    const { answerData } = this.state;
    const record = answerData.find(answerItem => answerItem.id === question.id);
    this.saveAnswer(record.REC_ID, value);
  };

  handleSingleChoiceChange = (question, value) => {
    question.answer = value;
    question.hasDo = true;
    this.forceUpdate();

    // 保存答案
    const { answerData } = this.state;
    const record = answerData.find(answerItem => answerItem.id === question.id);

    const index = question.options.findIndex(option => option.value === value);
    const newValue = String.fromCharCode(index + 65);

    this.saveAnswer(record.REC_ID, newValue);
  };

  handleMultipleChange = (question, checked, value) => {
    // 选中
    if (checked) {
      question.answer.push(value);
      // 未选中
    } else {
      const index = question.answer.findIndex(item => item === value);
      question.answer.splice(index, 1);
    }
    if (question.answer.length) {
      question.hasDo = true;
    } else {
      question.hasDo = false;
    }
    this.forceUpdate();

    // 保存答案
    const { answerData } = this.state;
    const record = answerData.find(answerItem => answerItem.id === question.id);
    let answer = [...question.answer];

    answer = answer.map(answerItem => {
      const index = question.options.findIndex(
        option => option.value === answerItem
      );
      return String.fromCharCode(index + 65);
    });
    answer.sort();
    const multiValue = answer.join(' ');
    this.saveAnswer(record.REC_ID, multiValue);
  };

  renderSingleChoice = (question, type) => {
    const title = question.C3_607025683659;
    return (
      <div className="exam-page__single-question">
        <h3>{title}</h3>
        <div>
          <RadioGroup
            value={question.answer}
            onChange={e =>
              this.handleSingleChoiceChange(question, e.target.value)
            }
          >
            {question.options.map((option, index) => (
              <div
                key={'' + index + option.value}
                className="exam-page__radio-wrap"
              >
                <Radio value={option.value}>
                  {String.fromCharCode(index + 65) + '.' + option.label}
                </Radio>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    );
  };

  renderJudge = (question, type) => {
    const title = question.C3_607025683659;
    return (
      <div className="exam-page__single-question">
        <h3>{title}</h3>
        <div>
          <RadioGroup
            value={question.answer}
            onChange={e => this.handleJudgeChange(question, e.target.value)}
          >
            {question.options.map((option, index) => (
              <div key={option.value} className="exam-page__radio-wrap">
                <Radio value={option.value}>{option.label}</Radio>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    );
  };

  getChecked = (arr, value) => {
    return arr.some(item => item === value);
  };

  renderMultipleChoice = (question, type) => {
    const title = question.C3_607025683659;
    return (
      <div className="exam-page__single-question">
        <h3>{title}</h3>
        <div>
          {question.options.map((option, index) => (
            <div
              key={'' + index + option.value}
              className="exam-page__radio-wrap"
            >
              <Checkbox
                checked={this.getChecked(question.answer, option.value)}
                onChange={e =>
                  this.handleMultipleChange(
                    question,
                    e.target.checked,
                    option.value
                  )
                }
              >
                {String.fromCharCode(index + 65) + '.' + option.label}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>
    );
  };

  getUseTimeS = () => {
    const startTime = moment(this.startTime);
    const now = moment();
    return now.diff(startTime, 'seconds');
  };

  handleSubmit = async () => {
    const { record, myExamRecord } = this.state;

    // 判断是否在有效日期时间之前
    const timeStr = myExamRecord.C3_610709944031;
    if (!timeStr) {
      return message.error('有效日期为空！');
    }
    const validTimeUnix = moment(timeStr).unix();
    const now = moment().unix();
    if (now >= validTimeUnix) {
      return message.error(
        `考试有效时间为 ${timeStr} ，时间已过，您不能提交。`
      );
    }

    const useTimeS = this.getUseTimeS();
    const useTime = `${Math.floor(useTimeS / 60)}分${useTimeS % 60}秒`;

    const handTime = moment().format('YYYY-MM-DD HH:mm:ss');

    let res;
    try {
      res = await http().modifyRecords({
        resid: 608809112309,
        data: [
          {
            REC_ID: record.REC_ID,
            C3_607198887973: 'Y', // 修改 “是否提交” 字段值为 “Y”
            C3_610126164784: useTime, // 考试用时
            C3_607200067154: handTime // 交卷时间
          }
        ]
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    const newRecord = res.data[0];
    this.dealRecord(newRecord);
    message.success('提交成功');
    myExamRecord.C3_610137428463 =
      parseInt(myExamRecord.C3_610137428463, 10) - 1;
    this.setState({ hasSubmit: true, record: newRecord, myExamRecord });
  };

  handleSubmitBtnClick = () => {
    const { questions } = this.state;
    // 检查是否每一道题目都做了
    const result = questions.every(item => {
      return item.questions.every(question => {
        return question.hasDo;
      });
    });
    // 未做的题目
    const noDoQuestionsIndex = [];
    let i = 1;
    questions.forEach(item => {
      item.questions.forEach(question => {
        if (!question.hasDo) {
          noDoQuestionsIndex.push(i);
        }
        i++;
      });
    });

    let content;
    if (result) {
      content = '您已答完所有的题目，确定要提交吗？';
    } else {
      content = (
        <div>
          <div>
            <span>您有以下未作答的题目，确定要提交吗？</span>
          </div>
          <div>
            {noDoQuestionsIndex.map((item, index) => {
              if (index !== noDoQuestionsIndex.length - 1) {
                return item + '、';
              } else {
                return item;
              }
            })}
          </div>
        </div>
      );
    }

    Modal.confirm({
      title: '提示',
      content: content,
      onOk: () => this.handleSubmit()
    });
  };

  handleReminderUser = () => {
    Modal.info({
      title: '提示',
      content: '您只剩 10 分钟的作答时间了，请抓紧时间~'
    });
  };

  handleTimeEnd = () => {
    this.setState({ timeRemaining: 0 });
  };

  handleJoinExam = async () => {
    this.setState({ loading: true });
    // 向考试批次表（主表）和 考试批次答题表中添加

    // 考试安排编号
    const arrangeNum = this.arrangeNum;
    // 试卷编号
    const examNum = this.examNum;
    // 人员编号
    const personNum = this.personNum;

    const myExamRecid = this.myExamRecid;

    // 通过试卷编号获取试卷题目
    let res;
    try {
      res = await http().getTable({
        resid: 607188996053,
        cmswhere: `C3_607172879503 = '${examNum}'`
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    const questions = res.data; //
    console.log('exampage', questions);

    // 项考试批次表（主表）和考试批次答题表（子表）中插入数据
    const dataObj = {
      resid: 608809112309, // 主表 id
      maindata: {
        // 添加的主表记录
        _state: 'added',
        C3_607195889817: arrangeNum,
        C3_607195947239: examNum,
        C3_607195966239: personNum,
        C3_609958684582: moment().format('YYYY-MM-DD HH:mm:ss'), // 进入时间
        _id: 1
      },
      subdata: [] // 子表数据
    };

    questions.forEach((question, index) => {
      const subdataObj = {
        resid: 607270079025,
        maindata: {
          C3_607174660929: personNum,
          C3_607174324165: question.C3_607026334772, // 题目编号
          _id: index + 1,
          _state: 'added'
        }
      };
      dataObj.subdata.push(subdataObj);
    });

    try {
      res = await http().saveRecordAndSubTables({
        data: [dataObj]
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }

    // 验证后端返回的数据是否有错误
    try {
      if (!res.data.length) {
        throw new Error('操作失败');
      }
      const record = res.data[0];
      if (record.maindata.message) {
        throw new Error(record.maindata.message);
      }
      let message;
      for (let i = 0; i < record.subdata.length; i++) {
        if (record.subdata[i].maindata.message) {
          message = record.subdata[i].maindata.message;
          break;
        }
      }
      if (message) {
        throw new Error(message);
      }
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }

    // 考试批次编号
    const examBatchNum = res.data[0].maindata.C3_607196596723;

    window.location.href = `/fnmodule?resid=考试页面&recid=608295659960&type=考试系统&title=考试页面&examnum=${examNum}&exambatchnum=${examBatchNum}&arrangenum=${arrangeNum}&personnum=${personNum}&myexamrecid=${myExamRecid}`;
  };

  getCountDown = node => {
    this.countDownRef = node;
  };

  render() {
    const {
      loading,
      examName,
      questions,
      timeRemaining,
      hasSubmit,
      hasGetTime,
      record,
      myExamRecord
    } = this.state;

    // 用户已提交
    if (hasSubmit) {
      return (
        <Spin spinning={loading}>
          <div className="exam-page">
            <div className="exam-page__form">
              <span className="exam-page__form-title">姓名：</span>
              <span className="exam-page__form-value">{record.name}</span>
            </div>
            <div className="exam-page__form">
              <span className="exam-page__form-title">考试用时：</span>
              <span className="exam-page__form-value">{record.time}</span>
            </div>
            <div className="exam-page__form">
              <span className="exam-page__form-title">试卷总分：</span>
              <span className="exam-page__form-value">{record.totalScore}</span>
            </div>
            <div className="exam-page__form">
              <span className="exam-page__form-title">得分：</span>
              <span className="exam-page__form-value">{record.score}</span>
            </div>
            <div className="exam-page__form">
              <span className="exam-page__form-title">是否通过：</span>
              <span className="exam-page__form-value">{record.isPass}</span>
            </div>
            {myExamRecord.C3_610137428463 > 0 && record.isPass === '未通过' && (
              <Button
                block
                onClick={() =>
                  Modal.confirm({
                    title: '提示',
                    content: '是否再次参加考试',
                    onOk: this.handleJoinExam
                  })
                }
                style={{ marginTop: 16 }}
                type="primary"
              >
                再次考试
              </Button>
            )}
            <Button
              block
              style={{ marginTop: 16 }}
              type="primary"
              href="/fnmodule?resid=607168416937&recid=610555030491&type=%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F&title=%E6%88%91%E7%9A%84%E8%80%83%E8%AF%95"
            >
              完成
            </Button>
          </div>
        </Spin>
      );
    }

    // 超时，直接提示用户提交
    if (timeRemaining <= 0) {
      return (
        <Spin spinning={loading}>
          <div className="exam-page">
            <h1 style={{ textAlign: 'center' }}>时间已到，请提交</h1>
            <Button block type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          </div>
        </Spin>
      );
    }

    return (
      <div className="exam-page__assistor">
        <Spin spinning={loading}>
          <div className="exam-page">
            <h1 style={{ textAlign: 'center' }}>{examName}</h1>
           <div className='exam-page-rule'>考试规则：{this.state.li&&this.state.li.map((item) => {
             console.log("item",item)
              return <div>{item}</div>
        })}
        </div> 
            {hasGetTime && (
              <div className="exam-page__time-remaining">
                <h1 className="exam-page__time-remaining-title">考试倒计时</h1>
                <div style={{ fontSize: 40, fontWeight: 'bold' }}>
                  <ReactCountDown
                    time={timeRemaining}
                    remainingTimePoints={[
                      {
                        point: 10 * 60,
                        callback: this.handleReminderUser
                      }
                    ]}
                    onEnd={this.handleTimeEnd}
                    ref={this.getCountDown}
                  />
                </div>
              </div>
            )}
            {questions.map(item => {
              return (
                <div className="exam-page__question" key={item.type}>
                  {!!item.questions.length && (
                    <h2 id={item.type}>{item.type}</h2>
                  )}
                  <div className="exam-page__question-list">
                    {item.questions.map((question, index) => {
                      return (
                        <div
                          className="exam-page__question-content"
                          key={question.REC_ID}
                        >
                          {this.renderQuestion(item.type, question)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div className="exam-page__submit-btn">
              <Button type="primary" onClick={this.handleSubmitBtnClick} block>
                提交
              </Button>
            </div>
            <div
              className="exam-page__shortcuts"
              style={{ left: this.state.shortcutsLeft }}
            >
              <Button size="small" href="#单选题">
                单选题
              </Button>
              <Button size="small" href="#多选题">
                多选题
              </Button>
              <Button size="small" href="#判断题" data-mt-duration="300">
                判断题
              </Button>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}
