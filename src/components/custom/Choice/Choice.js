import React, { Component } from "react";
import { Radio, Button,} from "antd";
import "./Choice.less";

const RadioGroup = Radio.Group;
class Choice extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="choice">
        <div>
          <span className="mark">*</span>1.FINISAR在？年成立
        </div>
        <RadioGroup onChange={this.radioChange} value={this.state.value}>
          <Radio value={1}>A</Radio>
          <br />
          <Radio value={2}>B</Radio>
          <br />
          <Radio value={3}>C</Radio>
          <br />
          <Radio value={4}>D</Radio>
        </RadioGroup>
        <div className="choiceActionBox">
          <Button size="small" icon="form">
            编辑
          </Button>
          <Button size="small" icon="copy">
            复制
          </Button>
          <Button size="small" icon="delete">
            删除
          </Button>
          <Button size="small" icon="arrow-up">
            上移
          </Button>
          <Button size="small" icon="arrow-down">
            下移
          </Button>
          <Button size="small" icon="up-circle">
            最前
          </Button>
          <Button size="small" icon="down-circle">
            最后
          </Button>
        </div>
      </div>
    );
  }
}

export default Choice;
