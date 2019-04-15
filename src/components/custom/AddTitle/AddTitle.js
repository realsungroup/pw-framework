import React, { Component } from "react";
import {
  Tabs,
  Modal,
  Button,
  Radio,
  Checkbox,
  Row,
  Col,
  Input,
  Select,
  Icon
} from "antd";
import TableData from "../../common/data/TableData";
import "./AddTitle.less";

const Option = Select.Option;

function handleChange(value) {
  console.log(`selected ${value}`);
}

const TabPane = Tabs.TabPane;
function callback(key) {
  console.log(key);
}
function onChange(checkedValues) {
  console.log("checked = ", checkedValues);
}

const RadioGroup = Radio.Group;

export default class AddTitle extends Component {
  state = { visible: false, value: 1 };
  onChange = e => {
    console.log("radio checked", e.target.value);
    this.setState({
      value: e.target.value
    });
  };
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
      <div className="btns">
        <Button onClick={this.showModal}>添加题库题目</Button>
        <Modal
          width="1000px"
          title="添加题库题目"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Tabs defaultActiveKey="1" onChange={callback} width="100px">
            <TabPane tab="单选题" key="1">
              <label>题目难易度:</label>
              <Button className="button">低难度</Button>
              <Button className="button">中难度</Button>
              <Button className="button">高难度</Button>
              <div className="score">
                <label>题目分值:</label>
                <Input className="input-score" />
              </div>
              <div>
                <label>
                  题目:
                  <Input className="title" placeholder="请输入题目" />
                </label>
              </div>
              <div>
                <RadioGroup onChange={this.onChange} value={this.state.value}>
                  <label>选项:</label>
                  <ul>
                    <li>
                      <Radio value={1}>
                        A
                        <Input
                          className="choose"
                          placeholder="请输入选项内容"
                        />
                      </Radio>
                      <Icon type="minus-circle" style={{ fontSize: 20 }} />
                    </li>
                    <li>
                      <Radio value={2}>
                        B
                        <Input
                          className="choose"
                          placeholder="请输入选项内容"
                        />
                      </Radio>
                      <Icon type="minus-circle" style={{ fontSize: 20 }} />
                    </li>
                    <li>
                      <Radio value={3}>
                        C
                        <Input
                          className="choose"
                          placeholder="请输入选项内容"
                        />
                      </Radio>
                      <Icon type="minus-circle" style={{ fontSize: 20 }} />
                    </li>
                    <li>
                      <Radio value={4}>
                        D
                        <Input
                          className="choose"
                          placeholder="请输入选项内容"
                        />
                      </Radio>
                      <Icon type="minus-circle" style={{ fontSize: 20 }} />
                    </li>
                    <li>
                      <Button>添加选项</Button>
                    </li>
                  </ul>
                </RadioGroup>
              </div>
              <div>
                <label>正确答案:</label>
                <Input className="choose" />
              </div>
            </TabPane>
            <TabPane tab="多选题" key="2">
              <label>题目难易度:</label>
              <Button className="button">低难度</Button>
              <Button className="button">中难度</Button>
              <Button className="button">高难度</Button>
              <div className="score">
                <label>题目分值:</label>
                <Input className="input-score" />
              </div>
              <div>
                <label>
                  题目:
                  <Input className="title" placeholder="请输入题目" />
                </label>
              </div>
              <Checkbox.Group style={{ width: "100%" }} onChange={onChange}>
                <label>选项:</label>
                <ul>
                  <li>
                    <Checkbox onChange={onChange} value="A">A</Checkbox>
                    <Input className="choose" />
                    <Icon type="minus-circle" style={{ fontSize: 20 }} />
                  </li>
                  <li>
                    <Checkbox onChange={onChange} value="B">B</Checkbox>
                    <Input className="choose" />
                    <Icon type="minus-circle" style={{ fontSize: 20 }} />
                  </li>
                  <li>
                    <Checkbox onChange={onChange} value='C'>C</Checkbox>
                    <Input className="choose" />
                    <Icon type="minus-circle" style={{ fontSize: 20 }} />
                  </li>
                  <li>
                    <Checkbox onChange={onChange} valu='D'>D</Checkbox>
                    <Input className="choose" />
                    <Icon type="minus-circle" style={{ fontSize: 20 }} />
                  </li>
                  <li>
                    <Checkbox onChange={onChange} value='E'>E</Checkbox>
                    <Input className="choose" />
                    <Icon type="minus-circle" style={{ fontSize: 20 }} />
                  </li>
                  <li><Button>添加选项</Button></li>
                </ul>
              </Checkbox.Group>
              <div>
                <label>正确答案:</label>
                <Input className="choose" />
              </div>
            </TabPane>
            <TabPane tab="判断题" key="3">
              <label>题目难易度:</label>
              <Button className="button">低难度</Button>
              <Button className="button">中难度</Button>
              <Button className="button">高难度</Button>
              <div className="score">
                <label>题目分值:</label>
                <Input className="input-score" />
              </div>
              <div>
                <label>
                  题目:
                  <Input className="title" placeholder="请输入题目" />
                </label>
              </div>
              <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>正确</Radio>
                <Radio value={2}>错误</Radio>
              </RadioGroup>
            </TabPane>
            {/* <TabPane tab="填空题" key="4">
              <label>题目难易度:</label>
              <Button type="primary" className="button">
                低难度
              </Button>
              <Button className="button">中难度</Button>
              <Button className="button">高难度</Button>
              <div className="score">
                <label>题目分值:</label>
                <Input className="input-score" />
              </div>
              <div>
                <label>题目:</label>
                <Input
                  className="title"
                  placeholder="Finisar在______成立"
                />
              </div>
              <div>
                <label>内容是:</label>
              <Input className='title' />
              </div>
            </TabPane> */}
            {/* <TabPane tab="问答题" key="5">
              <label>题目难易度:</label>
              <Button type="primary" className="button">
                低难度
              </Button>
              <Button className="button">中难度</Button>
              <Button className="button">高难度</Button>
              <div className="score">
                <label>题目分值:</label>
                <Input className='input-score'/>
              </div>
              <div>
                <div>
                  <label>题目:</label>
                  <Input
                    className="title title-title"
                    placeholder="请输入题目"
                  />
                </div>
                <div>
                  <label>答案:</label>
                  <Input
                    className="title title-title"
                    placeholder="输入答题内容"
                  />
                </div>
              </div>
            </TabPane> */}
          </Tabs>
        </Modal>
      </div>
    );
  }
}
