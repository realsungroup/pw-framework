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
    const { size } = this.state;
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
            <label>题目难度:</label>
            <Radio.Group
              value={size}
              onChange={this.onChange}
              style={{ marginBottom: 16 }}
            >
              <Radio.Button value="small">低难度</Radio.Button>
              <Radio.Button value="default">中难度</Radio.Button>
              <Radio.Button value="large">高难度</Radio.Button>
            </Radio.Group>
          </div>
          <div>
            <label>试题题目:</label>
            <Input />
          </div>
          <div>
            <label>试题答案</label>
            <br></br>
            <RadioGroup name="radiogroup" defaultValue={1}>
              <Radio value={1}>A</Radio><Input className='input'></Input>
              <Radio value={2}>B</Radio><Input className='input'></Input>
              <br></br>
              <Radio value={3}>C</Radio><Input className='input'></Input>
              <Radio value={4}>D</Radio><Input className='input'></Input>
            </RadioGroup>
          </div>
        </Modal>
      </div>
    );
  }
}
