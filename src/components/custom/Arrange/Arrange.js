import React, { Component } from "react";
import "./Arrange.less";
import {Tabs,Modal, Button} from "antd";

const TabPane = Tabs.TabPane;
function callback(key) {
  console.log(key);
}

export default class Arrange extends Component {
  state = { visible: false }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

render(){
  return (

  <div>
  <Button type="primary" onClick={this.showModal}>添加题型
  </Button>
  <Modal
    title="添加题目"
    visible={this.state.visible}
    onOk={this.handleOk}
    onCancel={this.handleCancel}
  >
<Tabs defaultActiveKey="1" onChange={callback}>
    <TabPane tab="单选题" key="1"></TabPane>
    <TabPane tab="多选题" key="2"></TabPane>
    <TabPane tab="判断题" key="3"></TabPane>
    <TabPane tab="填空题" key="4"></TabPane>
    <TabPane tab="问答题" key="5"></TabPane>
  </Tabs>
  </Modal>
</div>
  )
}
}
