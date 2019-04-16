import React, { Component } from "react";
import TableData from "../../common/data/TableData";
import { Modal, Button } from 'antd';
import "./SetScore.less";

export default class SetScore extends Component {
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
  render() {
    return (
      <div>
          <Button onClick={this.showModal}>题型分数设置</Button>
          <Modal
          title="试卷题型分数设置"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1080}
        >
        <TableData resid='607698018138'width={1040} hasModify={false} hasDelete={false}>

        </TableData>
        </Modal>
      </div>
    );
  }
}
