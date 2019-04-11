import React, { Component } from "react";
import TableData from "../../common/data/TableData";
import { Tabs, Modal, Button } from "antd";
import EditTitle from '../EditTitle'

const TabPane = Tabs.TabPane;
function callback(key) {
  console.log(key);
}

export default class ExamManage extends Component {
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
      <div
        className="table-data-wrap"
        style={{ height: "calc(100vh - 220px)" }}
      >
        <TableData
          refTargetComponentName="TableData"
          wrappedComponentRef={element => (this.tableDataRef = element)}
          {...this.props}
          resid="607188968490"
          hasRowSelection={true}
          hasAdd={false}
          hasRowModify={true}
          hasRowView={false}
          hasRowDelete={true}
          hasModify={false}
          subtractH={196}
          height={600}
          actionBarFixed={true}
          customRowBtns={[
            (record, btnSize) => {
              return <Button onClick={this.showModal}>添加题目</Button>;
            },
            (record, btnSize) => {
              return <Button onClick={()=>{window.location.href=""}}>设计试卷</Button>;
            },
            (record, btnSize) => {
              return <Button onClick={this.showModal}>题型分数设置</Button>;
            }
          ]}
        />
        <Modal
          width="1200px"
          title="添加题目"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Tabs defaultActiveKey="1" onChange={callback} width="100px">
            <TabPane tab="单选题" key="1" > <TableData
            resid="607188996053"
            hasRowDelete={false}
            hasAdd={false}
            hasDelete={false}
            hasModify={false}
            hasRowView={false}
            hasRowModify={false}
            hasBeBtns={false}
            hasRowSelection={true}
          /></TabPane>
            <TabPane tab="多选题" key="2"> <TableData
            resid="607188996053"
            hasRowDelete={false}
            hasAdd={false}
            hasDelete={false}
            hasModify={false}
            hasRowView={false}
            hasRowModify={false}
            hasBeBtns={false}
          /></TabPane>
            <TabPane tab="判断题" key="3" />
          </Tabs>
        </Modal>
        <Modal></Modal>
      </div>
    );
  }
}
