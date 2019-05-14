import React, { Component } from 'react';
import { Modal, Button, Tabs } from 'antd';
import TableData from '../../common/data/TableData';
const TabPane = Tabs.TabPane;

export default class Selected extends Component {
  state = { visible: false };
  constructor(props) {
    super(props);
  }

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
      <React.Fragment>
        <Button onClick={this.showModal} style={{ marginLeft: 4 }}>
          查看人员
        </Button>
        <Modal
          title="参加考试人员列表"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="100%"
          destroyOnClose
        >
          <Tabs
            defaultActiveKey="1"
            style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}
          >
            <TabPane
              tab="全部人员"
              key="1"
              style={{ width: '100%', height: '100%' }}
            >
              <TableData
                resid="610196239974"
                hasAdd={false}
                hasDelete={false}
                hasModify={false}
                hasRowDelete={true}
                hasRowModify={false}
                hasRowView={false}
                width="99%"
                subtractH={190}
                cmswhere={`C3_607197284004 = ${
                  this.props.record.C3_607171221170
                }`}
              />
            </TabPane>
            <TabPane
              tab="未参加人员"
              key="2"
              style={{ width: '100%', height: '100%' }}
            >
              <TableData
                resid="610299723125"
                hasAdd={false}
                hasDelete={false}
                hasModify={false}
                hasRowDelete={true}
                hasRowModify={false}
                hasRowView={false}
                subtractH={190}
                width="99%"
                cmswhere={`C3_607197284004 = ${
                  this.props.record.C3_607171221170
                }`}
              />
            </TabPane>
          </Tabs>
        </Modal>
      </React.Fragment>
    );
  }
}
