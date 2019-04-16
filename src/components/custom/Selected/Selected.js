import React, { Component } from "react";
import { Modal, Button } from "antd";
import TableData from "../../common/data/TableData";

export default class Selected extends Component {
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
        <Button onClick={this.showModal}>查看人员</Button>
        <Modal
          title="参加考试人员列表"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
        >
          <TableData
            resid="607195870583"
            hasAdd={false}
            hasDelete={false}
            hasModify={false}
            hasRowDelete={false}
            hasRowModify={false}
            hasRowView={false}
            width={950}
          />
        </Modal>
      </div>
    );
  }
}
