import React, { Component } from 'react';
import { Modal, Button, Tabs, Popconfirm , message} from 'antd';
import TableData from '../../common/data/TableData';
import http from '../../../util20/api';
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
  handleSecondEmail = async (personList)=>{
    console.log(personList);
   const  newpersonList =[...personList];
    const terpersonList = newpersonList.map(person => {
      return {
        REC_ID: person.REC_ID,
        C3_610662024171:'',
      }
    })
    try {
      await http().modifyRecords({
        resid: 610196239974,
        data: terpersonList
      })  
    } catch (err) {
      console.error(err);
      Modal.success({
        title:'提醒成功',
        content:'邮件已成功发送',
        onOk:()=>{
          return message.success(err.message);
        }
      })
      return message.error(err.message);
    }
    
  }
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
                height={300}
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
                actionBarExtra={({ dataSource: dataSource }) => {
                  return (
                    <Popconfirm
                      title="请核对人员信息,确定将发送邮件通知学员参加考试"
                      onConfirm={() => {
                        this.handleSecondEmail(dataSource);
                      }}
                    >
                      <Button>提醒参加考试</Button>
                    </Popconfirm>
                  );
                }}
              />
            </TabPane>
          </Tabs>
        </Modal>
      </React.Fragment>
    );
  }
}
