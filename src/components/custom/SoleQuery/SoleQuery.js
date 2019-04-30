import React, { Component } from 'react';
import './SoleQuery.less';
import {
  Input,
  Button,
  Select,
  Radio,
  Checkbox,
  Carousel,
  Popconfirm,
  message,
  Modal,
  Icon,
  Spin
} from 'antd';
import http from '../../../util20/api';
import qs from 'qs';
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
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
      isGetgift: '',
      tel: '',
      recid: '',
      hasGiftList: [],
      queryStatus: '', // 已停止 | 已发送
      hasGift: '',
      loading: false,
      hasSubmit: false
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
    // console.log({ res });

    this.setState({
      queryDetail: res.data[0],
      queryID: res.data[0].query_id,
      queryStatus: res.data[0].query_status,
      hasGift: res.data[0].gift
    });
  };

  // 获取用户是否已提交
  getUserIsSubmmit = async queryId => {
    let res;
    try {
      res = await http().getTable({
        resid: 608838682402,
        cmswhere: `query_id='${queryId}' and person_id='${
          userInfo.UserInfo.EMP_ID
        }'`
      });
    } catch (err) {
      return console.error(err);
    }

    let hasSubmit = false;
    if (res.data && res.data.length) {
      hasSubmit = true;
    }
    this.setState({ hasSubmit });
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
    await this.getQuery(qsObj.id);
    // 查询用户是否已提交
    const hasSubmit = await this.getUserIsSubmmit(qsObj.id);

    if (hasSubmit) {
      // 获取中奖名单
      this.getHasPrase(qsObj.id);
      this.setState({ loading: false });
      return;
    }

    // 获取问卷试题
    await this.getThisQueryQuestions(qsObj.id);
    // 获取中奖名单
    this.getHasPrase(qsObj.id);
    this.setState({ loading: false });
  }

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
    return AllQuestions.map(item => {
      switch (item.question_type) {
        case '单选题': {
          return this.renderGetSingleChoice(item);
        }
        case '多选题': {
          return this.renderGetMultiChoice(item);
        }
        case '问答题': {
          return this.renderGetAnswer(item);
        }
      }
    });
  }

  renderGetSingleChoice(item) {
    return (
      <div className="choice" key={item.question_id}>
        <div className="query-set__questionTopic">
          {item.question_must == '1' ? <span className="mark">*</span> : ''}
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
              <div key={option.option_id}>
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
  renderGetMultiChoice(item) {
    // // console.log({ item });
    return (
      <div className="choice" key={item.question_id}>
        <div className="query-set__questionTopic">
          {item.question_must == '1' ? <span className="mark">*</span> : ''}
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
                {id == option.option_id && option.option_write == '1' ? (
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

  renderGetAnswer(item) {
    return (
      <div className="choice" key={item.question_id}>
        <div className="query-set__questionTopic">
          {item.question_must == '1' ? <span className="mark">*</span> : ''}
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
    const { queryID, hasGift } = this.state;
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
            const optionId = question.subdata[0].option_id;
            const WriteContent = question.answer;
            let eassyAnswer = {
              person_id: userInfo.UserInfo.EMP_ID,
              query_id: queryID,
              question_id: questionId,
              option_id: optionId,
              write_content: WriteContent
            };
            answers.push(eassyAnswer);
          }
          break;
      }
      // // console.log(answers);
    });

    console.log({ answers });

    let res;
    try {
      res = await http().addRecords({
        resid: '608838682402',
        data: answers
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    message.success('提交成功');
    this.setState({
      visible: true
    });
    // 无礼品时
    if (hasGift === '0') {
      return;
    }
    // 有礼品时
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
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }

    this.setState({
      isGetgift: res.data[0].is_get_gift,
      recid: res.data[0].REC_ID
    });
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

  //
  handlePopcancle = () => {
    // console.log('点击取消');
  };

  //handleCancel
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  // 输入手机号点击确定
  handleOk = () => {
    const { recid, tel, isGetgift } = this.state;
    if (!(isGetgift == 'Y')) {
      //没有获奖
      return this.setState({
        visible: false,
        subStatus: false,
        hasSubmit: true
      });
    } else {
      if (!/^1[0-9]\d{9}$/.test(tel)) {
        return message.error('请输入正确的手机号');
      }
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
  handleTelChange = e => {
    // console.log(e.target.value);
    this.setState({
      tel: e.target.value
    });
  };

  //rendercarousel
  rendercarousel = () => {
    const { hasGiftList } = this.state;
    if (hasGiftList.length <= 0) {
      return <p className="lucker">暂无人获奖，赶紧填完试试运气吧!</p>;
    } else {
      return this.rendergiftList();
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
    const {
      queryDetail,
      isGetgift,
      tel,
      hasGiftList,
      queryStatus,
      loading,
      hasSubmit
    } = this.state;

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
            <p className="stopTips">您已经提交过此问卷，不能填写两次问卷哦</p>
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
          <Modal
            title="提交问卷"
            visible={this.state.visible}
            width={this.state.wid}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p style={{ paddingLeft: 40 }}>提交成功</p>
            <Icon
              className="tips"
              type="check"
              style={{ fontSize: 25, color: '#0f0', textAlign: 'center' }}
            />
            <p className="thanks">感谢您参与本次问卷调查</p>
            {this.state.isGetgift == 'Y' ? (
              <p>
                恭喜你获得精美礼品一份，请输入手机号,凭手机号前去人事部领取奖品一份
                <br />
                <Input value={tel} onChange={this.handleTelChange} />
              </p>
            ) : (
              ''
            )}
          </Modal>
        </div>
      </Spin>
    );
  }
}

export default SoleQuery;
