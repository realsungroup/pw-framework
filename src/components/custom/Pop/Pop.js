import React,{Component} from 'react'
import { Tabs, Modal, Button } from "antd";
import TableData from '../../common/data/TableData'

const TabPane = Tabs.TabPane;
function callback(key) {
  console.log(key);
}
export default class Pop extends Component {
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
          <Button type="primary" onClick={this.showModal}>添加参加考试人员</Button>
          <Modal width="1000px"
            title="添加参加考试人员"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Tabs defaultActiveKey="1" onChange={callback} width='100px'>
              <TabPane tab="按部门选择" key="1" />
              <TabPane tab="按员工所在地区选择" key="2" />
              <TabPane tab="按考试通过状态选择" key="3" />
              <TabPane tab="按入职时间选择" key="4" />
              <TabPane tab="按XXX选择" key="5" />
            </Tabs>
            <TableData></TableData>
          </Modal>
        </div>
      );
    }
}