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
            <Radio.Group
              value={size}
              onChange={this.onChange}
              style={{ marginBottom: 16 }}
            >
              <ul>
                <li>
                  {" "}
                  <label>题目难度:</label>
                </li>
                <li>
                  <Radio.Button value="small" size="default">
                    低难度
                  </Radio.Button>
                </li>
                <li>
                  <Radio.Button value="default">中难度</Radio.Button>
                </li>
                <li>
                  <Radio.Button value="large">高难度</Radio.Button>
                </li>
              </ul>
            </Radio.Group>
          </div>
          <div className='exam-title'>
            <label>试题题目:</label>
            <Input />
          </div>
          <div className="answer">
            <label>试题答案:</label>
            <br />
            <RadioGroup name="radiogroup" defaultValue={1}>
              <ul>
                <li>
                  <Radio value={1}>A</Radio>
                  <Input className="input" />
                </li>
                <li>
                  <Radio value={2}>B</Radio>
                  <Input className="input" />
                </li>
                <li>
                  <Radio value={3}>C</Radio>
                  <Input className="input" />
                </li>
                <li>
                  <Radio value={4}>D</Radio>
                  <Input className="input" />
                </li>
                <li>
                  <Button>添加</Button>
                </li>
              </ul>
            </RadioGroup>
          </div>
        </Modal>
      </div>
    );
  }
}
