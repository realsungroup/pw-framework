import React, { Component } from "react";
import "./EditTitle.less";
import { Select, Modal, Button, Input, Radio } from "antd";

const Option = Select.Option;
const RadioGroup = Radio.Group;

function handleChange(value) {
  console.log(`selected ${value}`);
}

export default class EditTitle extends Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true
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
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          修改题目
        </Button>
        <Modal
          width="700px"
          title="题目详情"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <label>题目类型:</label>
            <Select
              defaultValue="单选题"
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="单选题">单选题</Option>
              <Option value="多选题">多选题</Option>
              <Option value="判断题">判断题</Option>
              <Option value="填空题">填空题</Option>
              <Option value="问答题">问答题</Option>
            </Select>
            <label>题目难度:</label>
            <Select
              defaultValue="低难度"
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="低难度">中难度</Option>
              <Option value="中难度">中难度</Option>
              <Option value="高难度">高难度</Option>
            </Select>
          </div>
          <div>
            <label>试题题目:</label>
            <Input />
          </div>
          <div>
            <label>答案选项:</label>
            <Input />
          </div>
          <div>
            <label>选项个数:</label>
            <Input />
          </div>
          <div>
            <label>试题答案</label>
            <RadioGroup name="radiogroup" defaultValue={1}>
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
              <Radio value={4}>D</Radio>
            </RadioGroup>
          </div>
        </Modal>
      </div>
    );
  }
}
