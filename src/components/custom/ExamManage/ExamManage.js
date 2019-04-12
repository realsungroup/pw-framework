import React, { Component } from "react";
import TableData from "../../common/data/TableData";
import { Tabs, Modal, Button, message } from "antd";
import EditTitle from "../EditTitle";
import http from "../../../util20/api";

const TabPane = Tabs.TabPane;
function callback(key) {
  console.log(key);
}

export default class ExamManage extends Component {
  state = { visible: false ,record:""};

  showModal = (record) => {
    console.log("record",record)
    if(record){
      this.setState({
        visible: true,
        record:record
      });
    }
  };


  handleClose = e => {
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

  handleOk = async (e) => {
    let res;
    console.log("this.state.dataSource",this.state.dataSource)
    let data = this.state.dataSource;
    let Reldata= [];
    data.map(item => {
      this.state.selectedRowKeys.map((items) => {
       if( item.REC_ID === items){
        item.C3_601650474946 = this.state.date; 
        item.C3_604408361317 = 'Y'
        Reldata.push(item)
       }
      })
    });
  };
  onHandleMessage = async(dataSource, selectedRowKeys) => {
    console.log("dataSource",dataSource,selectedRowKeys)
    console.log("recoed",this.state.record)
    if (selectedRowKeys.length > 0) {
      let res;
      let data = this.state.dataSource;
      let Reldata= [];
      dataSource.map((item) => {
        item.C3_607172879503 = this.state.record.C3_607171749463
      })
      // data.map(item => {
      //   this.state.selectedRowKeys.map((items) => {
      //    if( item.REC_ID === items){
      //     item.C3_601650474946 = this.state.date; 
      //     item.C3_604408361317 = 'Y'
      //     Reldata.push(item)
      //    }
      //   })
      // });
      try {
        res = await http(
          // baseURL: "https://finisar.realsun.me:9092/"
      ).addRecords({
          resid: 607188996053,
          data: dataSource,
          isEditoRAdd: false
        });
        this.setState({
          visible: false
        });
        if(res.Error===0){
          this.tableDataRef.handleRefresh();
          message.success("操作成功！")
        }else{
          message.error(res.message)
        }
      } catch (error) {
        message.error(error)
      }

      this.setState({
        visible: true,
        dataSource: dataSource,
        selectedRowKeys: selectedRowKeys,
      });
    } else {
      message.error("请先勾选记录！");
    }
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
              return <Button onClick={() => {
                this.showModal(record)
              } }>添加题目</Button>;
            },
            (record, btnSize) => {
              return (
                <Button
                  onClick={() => {
                    window.location.href = "";
                  }}
                >
                  设计试卷
                </Button>
              );
            },
            (record, btnSize) => {
              return <Button onClick={this.showModal2}>题型分数设置</Button>;
            }
          ]}
        />
        <Modal
          width="1200px"
          title="添加题目"
          visible={this.state.visible}
          onOk={this.handleClose}
          onCancel={this.handleCancel}
        >
          <Tabs defaultActiveKey="1" onChange={callback} width="100px">
            <TabPane tab="单选题" key="1">
              <TableData
                resid="607599734723"
                hasRowDelete={false}
                hasAdd={false}
                hasDelete={false}
                hasModify={false}
                hasRowView={false}
                hasRowModify={false}
                hasBeBtns={false}
                hasRowSelection={true}
                actionBarExtra={({
                  dataSource: dataSource,
                  selectedRowKeys: selectedRowKeys
                }) => {
                  return (
                    <Button
                      onClick={() => {
                        this.onHandleMessage(dataSource, selectedRowKeys);
                      }}
                    >
                      添加题目
                    </Button>
                  );
                }}
              />
            </TabPane>
            <TabPane tab="多选题" key="2">
              <TableData
                resid="608397494705"
                hasRowDelete={false}
                hasAdd={false}
                hasDelete={false}
                hasModify={false}
                hasRowView={false}
                hasRowModify={false}
                hasBeBtns={false}
                actionBarExtra={({
                  dataSource: dataSource,
                  selectedRowKeys: selectedRowKeys
                }) => {
                  return (
                    <Button
                      onClick={() => {
                        this.onHandleMessage(dataSource, selectedRowKeys);
                      }}
                    >
                      添加题目
                    </Button>
                  );
                }}
              />
            </TabPane>
            <TabPane tab="判断题" key="3">
              <TableData
                resid="608397540251"
                hasRowDelete={false}
                hasAdd={false}
                hasDelete={false}
                hasModify={false}
                hasRowView={false}
                hasRowModify={false}
                hasBeBtns={false}
                actionBarExtra={({
                  dataSource: dataSource,
                  selectedRowKeys: selectedRowKeys
                }) => {
                  return (
                    <Button
                      onClick={() => {
                        this.onHandleMessage(dataSource, selectedRowKeys);
                      }}
                    >
                      添加题目
                    </Button>
                  );
                }}
              />
            </TabPane>
          </Tabs>
        </Modal>
        <Modal>
          
        </Modal>
      </div>
    );
  }
}
