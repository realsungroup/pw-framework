import React, { Component } from 'react';
import './SoleQuery.less';
import { Input, Button, Select, Radio, Checkbox, Carousel } from 'antd';
import http from '../../../util20/api';
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class SoleQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryDetail: {},
      AllQuestions: []
    };
  }

  /**
   *
   * 以下是单个问卷的新方法
   */

  //  获取问卷信息
  getQuery = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: 608822905547,
        cmswhere: 'query_id =' + 609329948699
      });
      return this.setState({
        queryDetail: res.data[0]
      });
    } catch (err) {
      return console.error(err);
    }
  };
  //获取问卷试题
  getThisQueryQuestions = async () => {
    let res;
    try {
      res = await http().getTable({
        resid: 608828418560,
        subresid: 608828722533,
        cmswhere: 'query_id=' + 609329948699
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
  componentDidMount() {
    // 根据链接前端做出处理，然后拿到文件的ID。去后台获取，这里ID已经固定好
    this.getQuery();
    this.getThisQueryQuestions();
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
            query_id: '609329948699',
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
            query_id: '609329948699',
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
        case '问答题':{
          const questionId = question.question_id;
          const optionId= question.subdata[0].option_id;
          const WriteContent = question.answer;
          let eassyAnswer ={
            query_id: '609329948699',
            question_id: questionId,
            option_id:optionId,
            write_content:WriteContent,
          }
          answers.push(eassyAnswer);
        }
        break;
      }
      console.log(answers);
      // 向后台发送请求
      http().addRecords({
        resid:'608838682402',
        data:answers,
      })
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
 handleAnswerInputChange = (questionId,value)=>{
   const {AllQuestions} = this.state;
   const question = AllQuestions.find(
     question =>question.question_id===questionId
   );
   question.answer = value;
   this.setState({
     AllQuestions
   })
 }
  // 渲染的页面
  render() {
    const { queryDetail } = this.state;
    return (
      <div className="solequery">
        <div className="queryHeader">
          <h1>{queryDetail.query_name}</h1>
          <p className="query-set__description">
            {queryDetail.query_description}
          </p>
          <Carousel autoplay vertical>
            <p className="lucker">135****5667刚刚领到礼品一份</p>
            <p className="lucker">135****5668刚刚领到礼品一份</p>
            <p className="lucker">135****5669刚刚领到礼品一份</p>
            <p className="lucker">135****5665刚刚领到礼品一份</p>
          </Carousel>
        </div>
        <div className="querycontent">{this.renderGetAllQuestions()}</div>
        <div>
          <p className="thanks">感谢您参与本次问卷调查</p>
          <div className="queryfooter__submit">
            <Button
              type="primary"
              onClick={() => {
                this.submitQuery('609329948699');
              }}
            >
              提交
            </Button>
            <Button type="primary">预览</Button>
          </div>
        </div>
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
