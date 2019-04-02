import React, { Component } from "react";
import { Tabs, Modal, Button, Radio, Checkbox, Row, Col, Input,Select} from "antd";
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
      <div>
        <Button type="primary" onClick={this.showModal}>
          添加题库题目
        </Button>
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
              <Select
                defaultValue="低难度"
                style={{ width: 120 }}
                onChange={handleChange}
              >
                <Option value="low">低难度</Option>
                <Option value="middle">中难度</Option>
                <Option value="high">高难度</Option>
              </Select>
              <br></br>
              <label>
                题目:
                <Input className="title" placeholder="请输入题目" />
              </label>
              <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>
                  A<Input className="choose" placeholder="请输入选项内容" />
                </Radio>
                <Radio value={2}>
                  B<Input className="choose" placeholder="请输入选项内容" />
                </Radio>
                <Radio value={3}>
                  C<Input className="choose" placeholder="请输入选项内容" />
                </Radio>
                <Radio value={4}>
                  D<Input className="choose" placeholder="请输入选项内容" />
                </Radio>
              </RadioGroup>
            </TabPane>
            <TabPane tab="多选题" key="2">
            <label>题目难易度:</label>
              <Select
                defaultValue="低难度"
                style={{ width: 120 }}
                onChange={handleChange}
              >
                <Option value="low">低难度</Option>
                <Option value="middle">中难度</Option>
                <Option value="high">高难度</Option>
              </Select>
              <br></br>
              <label>
                题目:
                <Input className="title" placeholder="请输入题目" />
              </label>
              <Checkbox.Group style={{ width: "100%" }} onChange={onChange}>
                <Row>
                  <Col span={8}>
                    <Checkbox value="A">
                      A<Input className="choose" />
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="B">
                      B<Input className="choose" />
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="C">
                      C<Input className="choose" />
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="D">
                      D<Input className="choose" />
                    </Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="E">
                      E<Input className="choose" />
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
              ,
            </TabPane>
            <TabPane tab="判断题" key="3">
            <label>题目难易度:</label>
              <Select
                defaultValue="低难度"
                style={{ width: 120 }}
                onChange={handleChange}
              >
                <Option value="low">低难度</Option>
                <Option value="middle">中难度</Option>
                <Option value="high">高难度</Option>
              </Select>
              <br></br>
              <label>
                题目:
                <Input className="title" placeholder="请输入题目" />
              </label>
              <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={1}>正确</Radio>
                <Radio value={2}>错误</Radio>
              </RadioGroup>
            </TabPane>
            <TabPane tab="填空题" key="4">
            <label>题目难易度:</label>
              <Select
                defaultValue="低难度"
                style={{ width: 120 }}
                onChange={handleChange}
              >
                <Option value="low">低难度</Option>
                <Option value="middle">中难度</Option>
                <Option value="high">高难度</Option>
              </Select>
              <br></br>
              <label>
                题目:
                <Input className="title" placeholder="Finisar在______成立" />
              </label>
              ______的内容是:<Input />
            </TabPane>
            <TabPane tab="问答题" key="5">
            <label>题目难易度:</label>
              <Select
                defaultValue="低难度"
                style={{ width: 120 }}
                onChange={handleChange}
              >
                <Option value="low">低难度</Option>
                <Option value="middle">中难度</Option>
                <Option value="high">高难度</Option>
              </Select>
              <br></br>
              <label>
                题目:
                <Input className="title" placeholder="请输入题目" />
              </label>
              <label>答案：</label>
              <Input placeholder="输入答题内容" />
            </TabPane>
          </Tabs>
          {/* <TableData resid='607188996053' ></TableData> */}
        </Modal>
      </div>
    );
  }
}
