import React, { Component } from 'react';
import './SoleQuery.less';
import {
  Input,
  Button,
  Radio,
  Checkbox,
  Carousel,
  message,
  Modal,
  Spin
} from 'antd';
import http from '../../../util20/api';
import PlanProgress from '../CreatePlan/PlanProgress';
import qs from 'qs';
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const userInfo = JSON.parse(localStorage.getItem('userInfo'));

class SoleQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryID: '',
      queryDetail: {},
      AllQuestions: [],
      subStatus: true,
      wid: 300,
      isGetgift: '', //是否中奖
      tel: '',
      recid: '',
      hasGiftList: [],
      queryStatus: '', // 已停止 | 已发送
      hasGift: '', //问卷有无礼品
      loading: true,
      hasSubmit: false,
      subRecid: '', // 该用户是否提交记录ID
      isShowProgress: false,
      taskList: []
    };
  }

  /**
   *
   * 以下是单个问卷的新方法
   */

  // 问卷信息
  getQuery = async queryId => {
    let res;
    try {
      res = await http().getTable({
        resid: 608822905547,
        cmswhere: 'query_id =' + queryId
      });
    } catch (err) {
      return console.error(err);
    }
    // console.log('问卷信息', res);

    this.setState({
      queryDetail: res.data[0],
      queryID: res.data[0].query_id,
      queryStatus: res.data[0].query_status,
      hasGift: res.data[0].gift
    });
    return res;
  };

  // 获取用户是否已提交
  // getUserIsSubmmit = async queryId => {
  //   let res;
  //   try {
  //     res = await http().getTable({
  //       resid: 608838682402,
  //       cmswhere: `query_id='${queryId}' and person_id='${
  //         userInfo.UserInfo.EMP_ID
  //       }'`
  //     });
  //   } catch (err) {
  //     return console.error(err);
  //   }

  //   let hasSubmit = false;
  //   if (res.data && res.data.length) {
  //     hasSubmit = true;
  //   }
  //   this.setState({ hasSubmit });
  //   return hasSubmit;
  // };
  //  优化
  getUserIsSubmmit = async queryId => {
    let res;
    try {
      res = await http().getTable({
        resid: 609613163948,
        cmswhere: `query_id='${queryId}' and staff_number='${userInfo.UserInfo.EMP_ID}'`
      });
    } catch (err) {
      return console.error(err);
    }
    // console.log('获取到是否提交信息', res);
    let hasSubmit = false;
    let str = '';
    if (res.data.length > 0) {
      if (res.data[0].hasSubmit === '已提交') {
        hasSubmit = true;
      }
      str = res.data[0].REC_ID;
    }

    this.setState({ hasSubmit, subRecid: str });
    return hasSubmit;
  };
  // 获取问卷试题
  getThisQueryQuestions = async queryId => {
    let res;
    try {
      res = await http().getTable({
        resid: 608828418560,
        subresid: 608828722533,
        cmswhere: 'query_id=' + queryId
      });
    } catch (err) {
      return console.error(err);
    }

    res.data.forEach(item => {
      // 该题目是否为必答题
      item.required = false;
      if (item.question_must === '1') {
        item.required = true;
      }
      // 该题目是否已作答
      item.hasDo = false;

      switch (item.question_type) {
        case '单选题': {
          item.subdata.forEach(option => {
            if (option.option_write === '1') {
              option.inputValue = '';
            }
          });
          break;
        }
        case '多选题': {
          item.subdata.forEach(option => {
            if (option.option_write === '1') {
              option.multinputValue = '';
            }
          });
          return (item.result = []);
        }
        case '问答题': {
          return (item.answer = '');
        }
      }
    });
    return this.setState({
      AllQuestions: res.data
    });
  };

  // 获取该问卷中奖人员的名单
  getHasPrase = queryId => {
    http()
      .getTable({
        resid: 608911532639,
        cmswhere: `query_id=${queryId} and is_get_gift='Y' and staff_tel!=''
     `
      })
      .then(res => {
        this.setState({
          hasGiftList: res.data
        });
      })
      .catch(err => {
        console.error(err);
      });
  };
  async componentDidMount() {
    this.setState({ loading: true });
    // 根据链接前端做出处理，然后拿到文件的ID。去后台获取，这里ID已经固定好
    const quertString = window.location.search;
    const qsObj = qs.parse(quertString.substring(1));

    // 获取问卷信息
    const res = await this.getQuery(qsObj.id);
    //  console.log('res',res);
    // 查询用户是否已提交
    const hasSubmit = await this.getUserIsSubmmit(qsObj.id);

    if (hasSubmit) {
      // // 获取中奖名单
      // this.getHasPrase(qsObj.id);
      this.setState({ loading: false });
      return;
    }

    // 获取问卷试题
    await this.getThisQueryQuestions(qsObj.id);
    // 获取中奖名单
    if (res.data[0].gift === '1') {
      this.getHasPrase(qsObj.id);
    }
    this.setState({ loading: false });
  }

  // 进度条关闭
  handleShowProgress = async () => {
    const { hasGift, queryID } = this.state;
    var bol = false;
    // 改变提交状态
    try {
      this.setState({ loading: true });
      await http().modifyRecords({
        resid: 609613163948,
        data: [{ REC_ID: this.state.subRecid, hasSubmit: '已提交' }]
      });
      var courseId = window.location.search;
      courseId = qs.parse(courseId.substring(1));
      courseId = courseId.courseId;
      var staffNum = localStorage.getItem('userInfo');
      staffNum = JSON.parse(staffNum);
      staffNum = staffNum.UserInfo.EMP_USERCODE;
      if (staffNum.length > 0 && courseId && courseId.length > 0) {
        bol = true;
      }
      if (bol == true) {
        await http().addRecords({
          resid: '615983369834',
          data: [
            {
              CourseArrangeID: courseId,
              C3_613941384832: staffNum,
              isApply: 'Y'
            }
          ]
        });
        // window[615375286006] = {
        //   name: 'CourseResources',
        //   title: '课程资源'
        // };
        window.open(
          window.location.origin +
          '?resid=615375286006&recid=615375314499&type=%E4%B8%AA%E4%BA%BA%E4%B8%AD%E5%BF%83&title=%E8%AF%BE%E7%A8%8B%E8%B5%84%E6%BA%90&success=true'
        );
        window.parent.close();
      }
    } catch (err) {
      console.error(err);
      this.setState({ loading: false });
      return message.error(err.message);
    }

    this.setState({ loading: false });
    //  判断有无礼品
    if (hasGift === '0') {
      return this.setState({
        isShowProgress: false,
        hasSubmit: true
      });
    }
    // 有礼品时
    message.success('已经成功报名课程');
    let res;
    try {
      res = await http().addRecords({
        resid: 608911532639,
        data: [
          {
            staff_id: userInfo.UserInfo.EMP_ID,
            query_id: queryID
          }
        ]
      });
      this.setState({
        isGetgift: res.data[0].is_get_gift,
        recid: res.data[0].REC_ID,
        isShowProgress: false,
        visible: true
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  };
  handleCheckboxChange = (questionId, optionId, e) => {
    const { AllQuestions } = this.state;
    const question = AllQuestions.find(
      question => question.question_id === questionId
    );

    const checked = e.target.checked;

    if (checked) {
      question.result.push(optionId);
    } else {
      const index = question.result.findIndex(item => item === optionId);
      question.result.splice(index, 1);
    }

    // 判断是否已答
    if (question.result.length) {
      question.hasDo = true;
    } else {
      question.hasDo = false;
    }

    this.setState({ AllQuestions });
  };

  // 循环遍历所有的题目;
  renderGetAllQuestions() {
    const { AllQuestions } = this.state;
    return AllQuestions.map((item, index) => {
      switch (item.question_type) {
        case '单选题': {
          return this.renderGetSingleChoice(item, index);
        }
        case '多选题': {
          return this.renderGetMultiChoice(item, index);
        }
        case '问答题': {
          return this.renderGetAnswer(item, index);
        }
      }
    });
  }

  renderGetSingleChoice(item, index) {
    return (
      <div className="choice" key={item.question_id}>
        <div className="query-set__questionTopic">
          <span className="questionOrder">{index + 1}.</span>{' '}
          {item.question_must === '1' ? <span className="mark">*</span> : ''}
          {item.question_topic}
          <span className="question_type">[{item.question_type}]</span>
        </div>
        <RadioGroup
          key={item.question_id}
          value={item.result}
          onChange={e => {
            this.handleSelectedOptionChange(item.question_id, e.target.value);
          }}
        >
          {item.subdata.map(option => {
            // // console.log("选项",option)
            return (
              <div key={option.option_id} className="choice__wrap">
                <Radio value={option.option_id}>
                  {option.option_content}
                  {item.result === option.option_id &&
                    option.option_write === '1' ? (
                      <Input
                        value={option.inputValue}
                        onChange={e =>
                          this.handleSingleInputChange(
                            item.question_id,
                            option.option_id,
                            e.target.value
                          )
                        }
                        style={{
                          width: 200,
                          height: 15,
                          borderRadius: 0,
                          border: 'none',
                          borderBottom: '1px solid #000'
                        }}
                      />
                    ) : (
                      ''
                    )}
                </Radio>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    );
  }
  renderGetMultiChoice(item, index) {
    // // console.log({ item });
    return (
      <div className="choice" key={item.question_id}>
        <div className="query-set__questionTopic">
          <span className="questionOrder">{index + 1}.</span>{' '}
          {item.question_must === '1' ? <span className="mark">*</span> : ''}
          {item.question_topic}
          <span className="question_type">[{item.question_type}]</span>
        </div>
        <div key={item.question_id}>
          {item.subdata.map(option => {
            // // console.log('多选题选项',option)
            const id = item.result.find(id => id === option.option_id);
            return (
              <div key={option.option_id}>
                <Checkbox
                  onChange={e => {
                    this.handleCheckboxChange(
                      item.question_id,
                      option.option_id,
                      e
                    );
                  }}
                >
                  {option.option_content}
                </Checkbox>
                {id === option.option_id && option.option_write === '1' ? (
                  <Input
                    style={{
                      width: 200,
                      height: 15,
                      borderRadius: 0,
                      border: 'none',
                      borderBottom: '1px solid #000'
                    }}
                    value={option.multinputValue}
                    onChange={e => {
                      this.handleMultiInputChange(
                        item.question_id,
                        option.option_id,
                        e.target.value
                      );
                    }}
                  />
                ) : (
                    ''
                  )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  renderGetAnswer(item, index) {
    return (
      <div className="choice" key={item.question_id}>
        <div className="query-set__questionTopic">
          <span className="questionOrder">{index + 1}.</span>{' '}
          {item.question_must === '1' ? <span className="mark">*</span> : ''}
          {item.question_topic}
        </div>
        <div key={item.question_id}>
          <TextArea
            style={{ height: 80 }}
            value={item.answer}
            onChange={e => {
              this.handleAnswerInputChange(item.question_id, e.target.value);
            }}
          />
        </div>
      </div>
    );
  }

  // 提交问卷
  submitQuery = async () => {
    const { queryID, hasGift, tel } = this.state;
    let answers = [];
    const { AllQuestions } = this.state;
    AllQuestions.map(question => {
      switch (question.question_type) {
        case '单选题': {
          const questionId = question.question_id;
          const optionId = question.result;
          const option = question.subdata.find(
            option => option.option_id === optionId
          );
          if (!option) {
            return;
          }
          const writeContent = option.inputValue;
          let singleanswer = {
            person_id: userInfo.UserInfo.EMP_ID,
            query_id: queryID,
            question_id: questionId,
            option_id: optionId,
            write_content: writeContent
          };
          answers.push(singleanswer);
          break;
        }
        case '多选题': {
          const questionId = question.question_id;

          let multiAnswer = {
            person_id: userInfo.UserInfo.EMP_ID,
            query_id: queryID,
            question_id: questionId
          };

          question.result.forEach(optionid => {
            const obj = { ...multiAnswer, option_id: optionid };
            const option = question.subdata.find(
              option => option.option_id === optionid
            );
            if (option.option_write === '1') {
              obj.write_content = option.multinputValue;
            }
            answers.push(obj);
          });
          break;
        }
        case '问答题':
          {
            const questionId = question.question_id;
            // const optionId = question.subdata[0].option_id;
            const WriteContent = question.answer;
            let eassyAnswer = {
              person_id: userInfo.UserInfo.EMP_ID,
              query_id: queryID,
              question_id: questionId,
              // option_id: optionId,
              write_content: WriteContent
            };
            answers.push(eassyAnswer);
          }
          break;
      }
      console.log(answers);
    });

    console.log({ answers });
    const newanswers = [...answers];
    newanswers.forEach((answer, index) => {
      answer._id = index + 1;
      answer._state = 'added';
    });
    console.log(newanswers);
    this.setState({
      isShowProgress: true,
      taskList: newanswers
    });
    // 如果有课程参数则报名课程

    // let res;
    // try {
    //   this.setState({loading:true})
    //   res = await http().addRecords({
    //     resid: '608838682402',
    //     data: answers
    //   });
    // } catch (err) {
    //   console.error(err);
    //   return message.error(err.message);
    // }
    // // this.setState({loading:true})
    // try {
    //   this.setState({loading:true})
    //   await http().modifyRecords({
    //     resid: 609613163948,
    //     data: [{ REC_ID: this.state.subRecid, hasSubmit: '已提交' }]
    //   });
    // } catch (err) {
    //   console.error(err);
    //   return message.error(err.message);
    // }
    //  this.setState({loading:false})
    // // 无礼品时
    // if (hasGift === '0') {
    //   return Modal.success({
    //     title: '问卷已经成功提交',
    //     okText: '知道了',
    //     onOk: () => {
    //       this.setState({
    //         hasSubmit: true
    //       });
    //     }
    //   });
    // }
    // 有礼品时
    // try {
    //   res = await http().addRecords({
    //     resid: 608911532639,
    //     data: [
    //       {
    //         staff_id: userInfo.UserInfo.EMP_ID,
    //         query_id: queryID
    //       }
    //     ]
    //   });
    //   this.setState({
    //     isGetgift: res.data[0].is_get_gift,
    //     recid: res.data[0].REC_ID,
    //     visible: true
    //   });
    // } catch (err) {
    //   console.error(err);
    //   return message.error(err.message);
    // }
  };

  //单选选中的值。
  handleSelectedOptionChange = (questionId, value) => {
    // console.log(questionId, value);
    const { AllQuestions } = this.state;
    const question = AllQuestions.find(
      question => question.question_id === questionId
    );
    question.result = value;
    question.hasDo = true;
    this.setState({
      AllQuestions
    });
  };

  // 单选输入框值的变化
  handleSingleInputChange = (questionId, optionId, value) => {
    const { AllQuestions } = this.state;
    const question = AllQuestions.find(
      question => question.question_id === questionId
    );
    const option = question.subdata.find(
      option => option.option_id === optionId
    );
    option.inputValue = value;
    this.setState({ AllQuestions });
  };

  // 多选框中输入值的变化
  handleMultiInputChange = (questionId, optionId, value) => {
    const { AllQuestions } = this.state;
    const question = AllQuestions.find(
      question => question.question_id === questionId
    );
    const option = question.subdata.find(
      option => option.option_id === optionId
    );
    option.multinputValue = value;

    question.hasDo = true;

    this.setState({
      AllQuestions
    });
  };

  // 文答题中输入框值的变化
  handleAnswerInputChange = (questionId, value) => {
    const { AllQuestions } = this.state;
    const question = AllQuestions.find(
      question => question.question_id === questionId
    );
    question.answer = value;
    if (value) {
      question.hasDo = true;
    } else {
      question.hasDo = false;
    }
    this.setState({
      AllQuestions
    });
  };
  //handleCancel
  handleGiveUpgiftCancel = () => {
    const { isGetgift } = this.state;
    if (!(isGetgift === 'Y')) {
      //没有中奖
      this.setState({
        visible: false,
        hasSubmit: true
      });
    } else {
      Modal.warning({
        title: '提示',
        content: '手机号将是您作为领取礼品的凭证，不填写将视为放弃',
        onOk: () => {
          this.setState({
            visible: false,
            hasSubmit: true
          });
        }
      });
    }
  };

  // 输入手机号点击确定
  handleOk = () => {
    const { recid, tel, isGetgift } = this.state;
    if (!(isGetgift === 'Y')) {
      //没有获奖

      return this.setState({
        visible: false,
        subStatus: false,
        hasSubmit: true
      });
    } else if (!tel) {
      this.handleGiveUpgiftCancel();
    } else {
      http()
        .modifyRecords({
          resid: 608911532639,
          data: [
            {
              REC_ID: recid,
              staff_tel: tel
            }
          ]
        })
        .then(res => {
          this.setState({ hasSubmit: true });
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  // 监听电话输入的变化
  handleTelChange = value => {
    const { tel } = this.state;
    console.log(11111111);
    console.log(value);
    this.setState(
      {
        tel: value
      },
      () => {
        console.log(this.state.tel);
      }
    );
  };

  //rendercarousel
  rendercarousel = () => {
    const { hasGiftList, hasGift } = this.state;
    if (hasGift == '1') {
      if (hasGiftList.length <= 0) {
        return <p className="lucker">暂无人获奖，赶紧填完试试运气吧!</p>;
      } else {
        return this.rendergiftList();
      }
    } else {
      return;
    }
  };

  // rendergiftList
  rendergiftList = () => {
    const { hasGiftList } = this.state;
    // console.log('获奖人员列表', hasGiftList);
    return (
      <Carousel autoplay vertical>
        {hasGiftList.map(item => {
          const telstart = item.staff_tel.substring(0, 3);
          const telend = item.staff_tel.substring(7);
          return (
            <p className="lucker" key={item.REC_ID}>
              {telstart}****{telend}已经领到礼品一份
            </p>
          );
        })}
      </Carousel>
    );
  };

  getSubmitDisabled = () => {
    const { AllQuestions } = this.state;
    const result = AllQuestions.every(item => {
      if (item.required) {
        if (item.hasDo) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    });
    return !result;
  };

  handleSubmitClick = queryId => {
    Modal.confirm({
      title: '提示',
      content: '您确定要提交问卷吗？',
      onOk: () => {
        this.submitQuery(queryId);
      }
    });
  };

  // 渲染的页面
  render() {
    const { queryDetail, tel, queryStatus, loading, hasSubmit } = this.state;
    // 已停止
    if (queryStatus === '已停止') {
      return (
        <Spin spinning={loading}>
          <div className="solequery solequery__has-stop">
            <p className="stopTips"> 该问卷已停止，不能作答</p>
          </div>
        </Spin>
      );
    }

    // 已提交
    if (hasSubmit) {
      return (
        <Spin spinning={loading}>
          <div className="solequery solequery__has-stop">
            <p className="stopTips">提交成功，感谢您的配合！</p>
          </div>
        </Spin>
      );
    }

    return (
      <Spin spinning={loading}>
        <div className="solequery">
          <div className="queryHeader">
            <h1>{queryDetail.query_name}</h1>
            <p className="query-set__description">
              {queryDetail.query_description}
            </p>
            {this.rendercarousel()}
          </div>
          <div className="querycontent">{this.renderGetAllQuestions()}</div>
          <div>
            <div className="queryfooter__submit">
              <Button
                type="primary"
                disabled={this.getSubmitDisabled()}
                onClick={() => this.handleSubmitClick(queryDetail.query_id)}
              >
                提交
              </Button>
            </div>
          </div>
          {this.state.isShowProgress ? (
            <PlanProgress
              onFinished={this.handleShowProgress}
              // resid={608838682402}
              options={{
                resid: 608838682402,
                data: JSON.stringify(this.state.taskList)
              }}
              title="上传答案"
              showFields={['question_id', 'question_topic']}
            // width='50%'
            />
          ) : null}
          <Modal
            title="提交问卷"
            visible={this.state.visible}
            width={this.state.wid}
            onOk={this.handleOk}
            onCancel={this.handleGiveUpgiftCancel}
          >
            <div>
              <p className="thanks">感谢您参与本次问卷调查</p>
              <p className="thanks">提交成功，感谢您的配合</p>
              {this.state.isGetgift === 'Y' ? (
                <p>
                  恭喜你获得精美礼品一份。请输入手机号凭手机号前去人力资源部领取奖品一份
                  <br />
                  <Input
                    value={this.state.tel}
                    onChange={e => {
                      this.handleTelChange(e.target.value);
                    }}
                  />
                </p>
              ) : (
                  ''
                )}
            </div>
          </Modal>
        </div>
      </Spin>
    );
  }
}

export default SoleQuery;
