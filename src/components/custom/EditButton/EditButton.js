import React, { Component } from "react";
import "./EditButton.less";
import { Select, Modal, Button, Input, Radio, Icon } from "antd";

const Option = Select.Option;
const RadioGroup = Radio.Group;

function handleChange(value) {
  console.log(`selected ${value}`);
}

export default class EditButton extends Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };
  onChange = e => {
    this.setState({ size: e.target.value });
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
              style={{ marginBottom: 16, marginLeft: 10 }}
            >
              <Radio.Button value="small">低难度</Radio.Button>
              <Radio.Button value="default">中难度</Radio.Button>
              <Radio.Button value="large">高难度</Radio.Button>
            </Radio.Group>
          </div>
          <div className="exam-title">
            <label>试题题目:</label>
            <Input style={{marginTop:10}}/>
          </div>
          <div className="answer">
            <label>试题选项:</label>
            <br />
            <RadioGroup name="radiogroup" defaultValue={1}>
              <ul>
                <li>
                  <Radio value={1}>A</Radio>
                  <Input className="input" />
                  <Icon
                    type="minus-circle"
                    style={{ fontSize: 24, color: "grey" }}
                  />
                </li>
                <li>
                  <Radio value={2}>B</Radio>
                  <Input className="input" />
                  <Icon
                    type="minus-circle"
                    style={{ fontSize: 24, color: "grey" }}
                  />
                </li>
                <li>
                  <Radio value={3}>C</Radio>
                  <Input className="input" />
                  <Icon
                    type="minus-circle"
                    style={{ fontSize: 24, color: "grey" }}
                  />
                </li>
                <li>
                  <Radio value={4}>D</Radio>
                  <Input className="input" />
                  <Icon
                    type="minus-circle"
                    style={{ fontSize: 24, color: "grey" }}
                  />
                </li>
                <li>
                  <Button>添加</Button>
                </li>
              </ul>
            </RadioGroup>
          </div>
          <div className="correct">
            <label>正确答案:</label>
            <Input className="input" />
          </div>
        </Modal>
      </div>
    );
  }
}
