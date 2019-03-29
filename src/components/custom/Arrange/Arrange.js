import React, { Component } from "react";
import "./Arrange.less";
import { Modal, Button, Input ,DatePicker,Radio } from "antd";

const Search = Input.Search;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const RadioGroup = Radio.Group;

function onChange(date, dateString) {
  console.log(date, dateString);
}

export default class Arrange extends Component {
  state = { visible: false,value:1 ,wid:700};

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

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
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          添加考试安排
        </Button>
        <Modal 
          //  className='contain'
           width={this.state.wid}
          title="考试安排"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div className="modal">
            <label>安排分类:</label>
            <Search
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />
          </div>
          <div className='list modal'>
            <label>考试名称:</label>
            <Input className="input" />
          </div>
          <div className='list modal'>
            <label>考试时间:</label>
            <Input className='input'></Input>
          </div>
          <div className='list modal'>
            <label>参加次数:</label>
            <Input className='input'></Input>
          </div>
          <div className='list modal'>
            <label>试卷分数:</label>
            <Input className='input'></Input>
          </div>
          <div className='list modal'>
            <label>通过分数:</label>
            <Input className='input'></Input>
          </div>
          <div className='list modal'>
            <label>有效时间:</label>
            <RangePicker onChange={onChange} />
          </div>
          <div className='list modal'>
            <label>成绩公布安排:</label>
            <Radio>即时显示考卷分数</Radio>
            <Radio>指定成绩发布时间</Radio>
            <DatePicker onChange={onChange} />
          </div>
          <div className='list modal'>
            <label>选择试卷</label>
            <Search
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />
          </div>
        </Modal>
      </div>
    );
  }
}
