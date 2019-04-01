import React, { Component } from "react";
import "./Arrange.less";
import { Tabs, Modal, Button } from "antd";
import TableData from '../../common/data/TableData'

const TabPane = Tabs.TabPane;
function callback(key) {
  console.log(key);
}

export default class Arrange extends Component {
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
          添加题型
        </Button>
        <Modal width="1000px"
          title="添加题目"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Tabs defaultActiveKey="1" onChange={callback} width='100px'>
            <TabPane tab="单选题" key="1" />
            <TabPane tab="多选题" key="2" />
            <TabPane tab="判断题" key="3" />
            <TabPane tab="填空题" key="4" />
            <TabPane tab="问答题" key="5" />
          </Tabs>
          <TableData resid='607188996053' >
          
          </TableData>
        </Modal>
      </div>
    );
  }
}
