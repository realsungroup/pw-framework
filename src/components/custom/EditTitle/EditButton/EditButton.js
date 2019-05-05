import React, { Component } from 'react';
import './EditButton.less';
import { Modal, Button, Input, Radio, Checkbox, message, Select } from 'antd';
import http from 'Util20/api';
const Option = Select.Option;
export default class EditButton extends Component {
  constructor(props) {
    super(props);
    console.log('props', props);
    let originArr = props.currentRecord.C3_607195720426;
    console.log('后端给的', originArr); 
    if (props.currentRecord.C3_607195720426) {
      let originArr = props.currentRecord.C3_607195720426.split(' ');
      let middleArr = [];
      originArr.forEach((item, index) => {
        middleArr.push(item.substring(2));
      });
      console.log('middel', middleArr);
      this.state = {
        currentVisible: false,
        wid: 1000,
        options: middleArr,
        currentRecord: props.currentRecord
      };
    } else {
      this.state = {
        currentVisible: false,
        wid: 1000,
        currentRecord: props.currentRecord
      };
    }
  }
  // 显示当前点击的模态框
  showCurrentModal = () => {
    console.log('options', this.state.options);
    this.setState({
      currentVisible: true
    });
  };
  //修改确定的时候
  handleOk = async e => {
    const { currentRecord, options } = this.state;
    console.log('最新的options', options);
    // options
    let terminaldata = [];
    switch (currentRecord.C3_607195719536) {
      case '单选题':
        {
          // const termianloption = options.join(' ');
          let middleArr = [];
          options.forEach((option, index) => {
            let obj = `${String.fromCharCode(index + 65)}.${option}`;
            middleArr.push(obj);
          });
          const termianloption = middleArr.join(' ');
          terminaldata = [
            {
              REC_ID: currentRecord.REC_ID,
              C3_607195719223: currentRecord.C3_607195719223,
              C3_607195719379: currentRecord.C3_607195719379,
              C3_607195720426: termianloption,
              C3_607195720020: currentRecord.C3_607195720020
            }
          ];
        }
        break;
      case '多选题':
        {
          let middleArr = [];
          options.forEach((option, index) => {
            let obj = `${String.fromCharCode(index + 65)}.${option}`;
            middleArr.push(obj);
          });
          const termianloption = middleArr.join(' ');
          terminaldata = [
            {
              REC_ID: currentRecord.REC_ID,
              C3_607195719223: currentRecord.C3_607195719223,
              C3_607195719379: currentRecord.C3_607195719379,
              C3_607195720426: termianloption,
              C3_607195720020: currentRecord.C3_607195720020
            }
          ];
        }
        break;
      case '判断题':
        {
          terminaldata = [
            {
              REC_ID: currentRecord.REC_ID,
              C3_607195719223: currentRecord.C3_607195719223,
              C3_607195719379: currentRecord.C3_607195719379,
              C3_607195720020: currentRecord.C3_607195720020
            }
          ];
        }
        break;
    }
    this.setState({
      currentVisible: false
    });
    console.log('最后的data', terminaldata);
    try {
      let res = await http().modifyRecords({
        resid: 607599734723,
        data: terminaldata
      });
      // console.log(res);
      message.success('修改成功');
    } catch (err) {
      console.error(err);
    }
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      currentVisible: false
    });
  };
  // 渲染当前问题
  renderCurrentQuestion(type) {
    switch (type) {
      case '单选题': {
        return this.renderCurrentSingle();
      }
      case '多选题': {
        return this.renderCurrentMulti();
      }
      case '判断题': {
        return this.renderCurrentJudge();
      }
    }
  }
  // 删除选项
  delcurrentOption = index => {
    const { options } = this.state;
    // let optionsC = options.split(" ")
    const newoptions = [...options];
    newoptions.splice(index, 1);
    console.log('newoptions', newoptions);
    this.setState({
      options: newoptions
    });
  };
  //修改题目中选项内容的变化
  handleCurrentQuestionOptionChange(value, index) {
    const { options } = this.state;
    const newoptions = [...options];
    console.log({ newoptions: newoptions });
    newoptions[index] = value;
    this.setState({
      options: newoptions
    });
    // console.log('新', this.state.currentRecord);
  }
  //修改题目中题干内容的变化
  handleCurrentQuestionTopci(value) {
    const tempcurrentRecord = this.state.currentRecord;
    tempcurrentRecord.C3_607195719223 = value;
    this.setState({
      currentRecord: tempcurrentRecord
    });
    // console.log("题干变化后的",this.state.currentQuestion)
  }
  // 修改中正确答案的变化
  handleCorrectAnswerChange = value => {
    const newcurrentRecord = this.state.currentRecord;
    newcurrentRecord.C3_607195719379 = value;
    this.setState({
      currentRecord: newcurrentRecord
    });
  };
  // 修改中多选正确答案的变化
  handlemultiCorrectAnswerChange = value => {
    const newcurrentRecord = this.state.currentRecord;
    console.log('多选答案的变化', value);
    const tempvalue = value.join('');
    newcurrentRecord.C3_607195719379 = tempvalue;
    this.setState({
      currentRecord: newcurrentRecord
    });
  };
  // 编辑中添加选项
  addChoiceContent() {
    const newoptions = this.state.options;
    let obj = '';
    newoptions.push(obj);
    this.setState({
      options: newoptions
    });
  }
  // 难易程度的变化
  handleQuestionDiffLevChange = value => {
    const tempcurrentRecord = this.state.currentRecord;
    tempcurrentRecord.C3_607195720020 = value;
    this.setState({
      currentRecord: tempcurrentRecord
    });
  };
  // 渲染当前的单选题
  renderCurrentSingle() {
    const { options, currentRecord } = this.state;
    return (
      <div>
        <div>
          <Input
            onChange={e => {
              this.handleCurrentQuestionTopci(e.target.value);
            }}
            value={currentRecord.C3_607195719223}
          />
        </div>
        <ul>
          {options.map((option, index) => {
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
        <span>正确答案:</span>
        {/* <Input
          value={currentRecord.C3_607195719379}
          onChange={e => this.handleCorrectAnswerChange(e.target.value)}
        /> */}
        <Select
          value={currentRecord.C3_607195719379}
          style={{ width: 600 }}
          onChange={this.handleCorrectAnswerChange}
        >
          {options.map((option, index) => {
            return (
              <Option value={String.fromCharCode(index + 65)} key={index}>
                {String.fromCharCode(index + 65)}
              </Option>
            );
          })}
        </Select>
      </div>
    );
  }
  // 渲染当前多选
  renderCurrentMulti() {
    const { options, currentRecord } = this.state;
    const correctAnswerArr = currentRecord.C3_607195719379.split('');
    return (
      <div>
        <div>
          <Input
            onChange={e => {
              this.handleCurrentQuestionTopci(e.target.value);
            }}
            value={currentRecord.C3_607195719223}
          />
        </div>
        <ul>
          {options.map((option, index) => {
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
        <span>正确答案:</span>
        {/* <Input
          value={currentRecord.C3_607195719379}
          onChange={e => this.handleCorrectAnswerChange(e.target.value)}
        /> */}
        <Select
          value={correctAnswerArr}
          mode="multiple"
          onChange={this.handlemultiCorrectAnswerChange}
          style={{ width: '50%' }}
        >
          {options.map((option, index) => {
            return (
              <Option value={String.fromCharCode(index + 65)} key={index}>
                {String.fromCharCode(index + 65)}
              </Option>
            );
          })}
        </Select>
      </div>
    );
  }
  // 渲染当前判断
  renderCurrentJudge() {
    const { currentRecord } = this.state;
    return (
      <div>
        <div>
          <Input
            onChange={e => {
              this.handleCurrentQuestionTopci(e.target.value);
            }}
            value={currentRecord.C3_607195719223}
          />
        </div>
        <span>正确答案:</span>
        <Select
          value={currentRecord.C3_607195719379}
          onChange={this.handleCorrectAnswerChange}
        >
          <Option value="A">正确</Option>
          <Option value="B">错误</Option>
        </Select>
      </div>
    );
  }
  render() {
    // const { size } = this.state;
    const { currentRecord } = this.state;
    console.log({ currentRecord, currentRecord });
    return (
      <div>
        <Button onClick={() => this.showCurrentModal()}>修改题目</Button>
        <Modal
          title={currentRecord.C3_607195719536}
          visible={this.state.currentVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={this.state.wid}
        >
          {this.renderCurrentQuestion(currentRecord.C3_607195719536)}
          {currentRecord.C3_607195719536 == '判断题' ? (
            ' '
          ) : (
            <Button
              onClick={() => {
                this.addChoiceContent();
              }}
              type="primary"
              style={{ marginTop: 10 }}
            >
              添加选项
            </Button>
          )}
          <div style={{ marginTop: 16 }}>
            <span className="DL">题目的难易程度:</span>
            <Radio.Group
              value={currentRecord.C3_607195720020}
              buttonStyle="solid"
              onChange={e => this.handleQuestionDiffLevChange(e.target.value)}
            >
              <Radio.Button value="低难度" className="dlButton">
                低难度
              </Radio.Button>
              <Radio.Button value="中难度" className="dlButton">
                中难度
              </Radio.Button>
              <Radio.Button value="高难度" className="dlButton">
                高难度
              </Radio.Button>
            </Radio.Group>
          </div>
        </Modal>
      </div>
    );
  }
}
