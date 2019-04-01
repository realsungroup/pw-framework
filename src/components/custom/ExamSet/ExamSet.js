import React, { Component } from "react";
import "./ExamSet.less";
import { Modal, Input, Button, Select, Tabs, Radio, Checkbox } from "antd";
import Choice from "../Choice";
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
class ExamSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wid: 600,
      title: "入职考试",
      radiovalue: ""
    };
  }
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  addSingle = () => {
    this.setState({
      visible2: true
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
  handleOk2 = e => {
    console.log(e);
    this.setState({
      visible2: false
    });
  };

  handleCancel2 = e => {
    console.log(e);
    this.setState({
      visible2: false
    });
  };
  showTabs = key => {
    console.log(key);
  };
  radioChange = e => {
    this.setState({
      radiovalue: e.target.value
    });
  };
  render() {
    return (
      <div className="queryset">
        <div className="queryHeader" onClick={this.showModal}>
          <h1>入职考试</h1>
        </div>
        <Choice />
        <Modal
          visible={this.state.visible}
          okText="保存"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={this.state.wid}
        >
          <label>标题</label>
          <Input />
        </Modal>
        <div className="addStyle">
          <Button>导入添加题目</Button>
          <Button onClick={this.addSingle}>单独添加题目</Button>
          <Modal
            title="单独添加"
            visible={this.state.visible2}
            onOk={this.handleOk2}
            onCancel={this.handleCancel2}
          >
            <Tabs defaultActiveKey="1" onChange={this.showTabs}>
              <TabPane tab="单选题" key="1">
                <div>标题1</div>
                <RadioGroup
                  onChange={this.radioChange}
                  value={this.state.value}
                >
                  <Radio value={1}>A</Radio>
                  <br />
                  <Radio value={2}>B</Radio>
                  <br />
                  <Radio value={3}>C</Radio>
                  <br />
                  <Radio value={4}>D</Radio>
                </RadioGroup>
              </TabPane>
              <TabPane tab="多选题" key="2">
                <div>题干</div>
                <CheckboxGroup>
                  <Checkbox>苹果</Checkbox>
                  <br />
                  <Checkbox>橘子</Checkbox>
                  <br />
                  <Checkbox>香蕉</Checkbox>
                  <br />
                </CheckboxGroup>
              </TabPane>
              <TabPane tab="问答题" key="3">
                <div>问题</div>
                <TextArea />
              </TabPane>
              <TabPane tab="自由" key="4">
                <div>问题</div>
                <RadioGroup
                  onChange={this.radioChange}
                  value={this.state.value}
                >
                  <Radio value={1}>A</Radio>
                  <br />
                  <Radio value={2}>B</Radio>
                  <br />
                  <Radio value={3}>C</Radio>
                  <br />
                  <Radio value={4}>D</Radio>
                  <br />
                  其他：
                </RadioGroup>
              </TabPane>
            </Tabs>
          </Modal>
        </div>
      </div>
    );
  }
}

export default ExamSet;
