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
  Icon
} from 'antd';
import http from '../../../util20/api';
import qs from 'qs';
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const userinfo = JSON.parse(localStorage.getItem('userInfo'));

class SoleQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryID: '',
      queryDetail: {},
      AllQuestions: [],
      userInfo: {},
      subStatus: true,
      wid: 300,
      isGetgift: '',
      tel: '',
      recid: '',
      hasGiftList: []
    };
  }

  /**
   *
   * 以下是单个问卷的新方法
   */

  //  问卷信息
  getQuery = async queryId => {
    let res;
    try {
      res = await http().getTable({
        resid: 608822905547,
        cmswhere: 'query_id =' + queryId
      });
      return this.setState({
        queryDetail: res.data[0],
        queryID: res.data[0].query_id
      });
    } catch (err) {
      return console.error(err);
    }
  };
  //获取问卷试题
  getThisQueryQuestions = async queryId => {
    let res;
    try {
      res = await http().getTable({
        resid: 608828418560,
        subresid: 608828722533,
        cmswhere: 'query_id=' + queryId
      });
      console.log('res.data', res.data);
      res.data.forEach(item => {
        switch (item.question_type) {
          case '单选题': {
            item.subdata.forEach(option => {
              if (option.option_write === '1') {
                option.inputValue = '';
              }
            });
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
      // console.log('问卷试题', res.data);
    } catch (err) {
      return console.error(err);
    }
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
        console.log(res);
        this.setState({
          hasGiftList: res.data
        });
      })
      .catch(err => {
        console.error(err);
      });
  };
  componentDidMount() {
    // 根据链接前端做出处理，然后拿到文件的ID。去后台获取，这里ID已经固定好
    const quertString = window.location.search;
    console.log(quertString);
    const qsObj = qs.parse(quertString.substring(1));
    console.log('传过来的',qsObj);
    console.log('问卷ID', qsObj.id);
    this.getQuery(qsObj.id);
    this.getThisQueryQuestions(qsObj.id);
    this.getHasPrase(qsObj.id);
    http()
      .addRecords({
        resid: 608911532639,
        data: [
          {
            staff_id: userinfo.UserCode,
            query_id: qsObj.id
          }
        ]
      })
      .then(res => {
        console.log('提交返回的数据', res);
        this.setState({
          isGetgift: res.data[0].is_get_gift,
          recid: res.data[0].REC_ID
        });
        console.log(this.state.isGetgift);
      })
      .catch(err => {
        console.error(err);
      });
    console.log(userinfo);
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
    this.setState({ AllQuestions });
  };

  // 循环遍历所有的题目;
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
            // console.log("选项",option)
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
    // console.log({ item });
    return (
      <div className="choice" key={item.question_id}>
        <div className="query-set__questionTopic">
          {item.question_must == '1' ? <span className="mark">*</span> : ''}
          {item.question_topic}
          <span className="question_type">[{item.question_type}]</span>
        </div>
        <div key={item.question_id}>
          {item.subdata.map(option => {
            // console.log('多选题选项',option)
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
  submitQuery = () => {
    console.log('提交', userinfo);
    const { queryID } = this.state;
    let answers = [];
    const { AllQuestions } = this.state;
    console.log('点击提交后的问卷', AllQuestions);
    AllQuestions.map(question => {
      switch (question.question_type) {
        case '单选题': {
          const questionId = question.question_id;
          const optionId = question.result;
          const option = question.subdata.find(
            option => (option.option_id = optionId)
          );
          const writeContent = option.inputValue;
          let singleanswer = {
            person_id: userinfo.UserCode,
            query_id: queryID,
            question_id: questionId,
            option_id: optionId,
            write_contnet: writeContent
          };
          answers.push(singleanswer);
          break;
        }
        case '多选题': {
          const questionId = question.question_id;

          let multiAnswer = {
            person_id: userinfo.UserCode,
            query_id: queryID,
            question_id: questionId
          };

          question.result.forEach(optionid => {
            const obj = { ...multiAnswer, option_id: optionid };
            const option = question.subdata.find(
              option => option.option_id === optionid
            );
            if (option.option_write === '1') {
              obj.write_contnet = option.multinputValue;
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
              person_id: userinfo.UserCode,
              query_id: queryID,
              question_id: questionId,
              option_id: optionId,
              write_content: WriteContent
            };
            answers.push(eassyAnswer);
          }
          break;
      }
      console.log(answers);
    });
    // 向后台发送请求
    http()
      .addRecords({
        resid: '608838682402',
        data: answers
      })
      .then(res => {
        // 显示提交成功
        message.info('提交成功');
        this.setState({
          visible: true
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  //单选选中的值。
  handleSelectedOptionChange = (questionId, value) => {
    console.log(questionId, value);
    const { AllQuestions } = this.state;
    const question = AllQuestions.find(
      question => question.question_id === questionId
    );
    question.result = value;
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
      option => (option.option_id = optionId)
    );
    option.inputValue = value;
    this.setState({ AllQuestions });
  };
  // 多选框中输入值的变化
  handleMultiInputChange = (questionId, optionId, value) => {
    // console.log(111111);
    const { AllQuestions } = this.state;
    const question = AllQuestions.find(
      question => question.question_id === questionId
    );
    const option = question.subdata.find(
      option => (option.option_id = optionId)
    );
    option.multinputValue = value;
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
    this.setState({
      AllQuestions
    });
  };

  //
  handlePopcancle = () => {
    console.log('点击取消');
  };
  //handleCancel
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  // 输入手机号点击确定
  handleOk = () => {
    const { recid, tel } = this.state;
    console.log(recid, tel);
    if (!/^1[0-9]\d{9}$/.test(tel)) {
      return message.error('xxxx');
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
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
    this.setState({
      visible: false,
      subStatus: false
    });
  };
  // 监听电话输入的变化
  handleTelChange = e => {
    console.log(e.target.value);
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
    console.log('获奖人员列表', hasGiftList);
    return (
      <Carousel autoplay vertical>
        {hasGiftList.map(list => {
          const telstart = list.staff_tel.substring(0, 3);
          const telend = list.staff_tel.substring(7);
          return (
            <p className="lucker">
              {telstart}****{telend}已经领到礼品一份
            </p>
          );
        })}
      </Carousel>
    );
  };
  // 渲染的页面
  render() {
    const { queryDetail, isGetgift, tel, hasGiftList } = this.state;
    console.log(isGetgift);
    return (
      <div className="solequery">
        <div className="queryHeader">
          <h1>{queryDetail.query_name}</h1>
          <p className="query-set__description">
            {queryDetail.query_description}
          </p>
          {/* <Carousel autoplay vertical> */}
          {this.rendercarousel()}
          {/* </Carousel> */}
        </div>
        <div className="querycontent">{this.renderGetAllQuestions()}</div>
        <div>
          <div className="queryfooter__submit">
            {this.state.subStatus ? (
              <Popconfirm
                title="确定提交吗？一旦提交不能更改哟"
                onConfirm={() => {
                  this.submitQuery(queryDetail.query_id);
                }}
                onCancel={this.handlePopcancle}
              >
                <Button type="primary">提交</Button>
              </Popconfirm>
            ) : (
              <Button type="primary" disabled>
                提交
              </Button>
            )}
            {/* <Button type='primary' onClick={()=>{this.handleSend()}}>发送</Button> */}
          </div>
        </div>
        <Modal
          title="提交问卷"
          visible={this.state.visible}
          width={this.state.wid}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p style={{ paddingLeft: 40 }}>
            提交成功
            <Icon
              className="tips"
              type="check"
              style={{ fontSize: 25, color: '#0f0', textAlign: 'center' }}
            />
          </p>
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
    );
  }
}
export default SoleQuery;

/**
 * 现在AllQuestions 的数据结构如下:
 * AllQuestions:[
 * {
 *   question_type:'单选题',
 *   question_id:'123455908',
 *   question_topic:'你认为的额哈哈哈哈',
 *   result:'',
 *   options:[
 *         {
 *          option_id:'111',
 *          option_write:'',
 *          option_content:'',
 *          write_contnet:'',
 *         },
 *         {
 *          option_id:'111',
 *          option_write:'',
 *          option_content:'',
 *          write_contnet:'',
 *         },
 *
 * ]
 * },
 * {
 *  question_type:'多选题'，
 *  question_id:'9098809090',
 *  result:{
 *    inputValue:'',
 *   checkboxValues:[],
 *  },
 *  question_topic:'一下哪个颜色好看',
 *  options:[
 *          {
 *            option_id:'',
 *            option_content:'',
 *            write_content:'',
 *          },
 *          {
 *            option_id:'',
 *            option_content:'',
 *            write_content:'',
 *
 *          },
 * ]
 *
 * }
 *
 *
 * ]
 *
 *
 *
 *
 * result:['id1','id2','id3','id4',]
 * subdata:[
 * {
 *   option_id:'id1',
 *   option_write:'1',
 *   multiinputchange:'',
 * },
 * {
 *   option_id:'id2',
 *   option_write:'1',
 *   multiinputchange:'',
 * },
 * {
 *   option_id:'id3',
 *   option_write:'1',
 *   multiinputchange:'',
 * },
 * {
 *   option_id:'id4',
 *   option_write:'0',
 * },
 * {
 *   option_id:'id5',
 *   option_write:'0',
 * },
 *
 * ]
 */
