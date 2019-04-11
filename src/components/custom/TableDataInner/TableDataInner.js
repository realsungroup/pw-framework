import React from "react";
import { TableDataC } from "../loadableCustom";
import { TableData } from "../../common/loadableCommon";
import { Button, Modal, DatePicker, message, Tabs } from "antd";
import { saveMultipleRecord } from "../../../util/api";
import http from "../../../util20/api";
const TabPane = Tabs.TabPane;

class TableDataInner extends React.Component {
  state = { visible: false, date: "", dataSource: [], selectedRowKeys: "" };

  onChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({
      date: dateString
    });
  };
  handleOk = async e => {
    let res;
    let data = this.state.dataSource;
    let Reldata = [];
    data.map(item => {
      this.state.selectedRowKeys.map(items => {
        if (item.REC_ID === items) {
          item.C3_601650474946 = this.state.date;
          item.C3_604408361317 = "Y";
          Reldata.push(item);
        }
      });
    });
    try {
      res = await http({
        baseURL: "https://finisar.realsun.me:9092/"
      }).modifyRecords({
        resid: 603303655900,
        data: Reldata,
        isEditoRAdd: false
      });
      this.setState({
        visible: false
      });
      if (res.Error === 0) {
        this.tableDataRef.handleRefresh();
        message.success("操作成功！");
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  onHandleMessage = (dataSource, selectedRowKeys) => {
    if (selectedRowKeys.length > 0) {
      this.setState({
        visible: true,
        dataSource: dataSource,
        selectedRowKeys: selectedRowKeys
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
        <Tabs defaultActiveKey="1" style={{width:"100%",height:"100%",backgroundColor:"#fff"}}>
          <TabPane tab="未通知" key="1" style={{width:"100%",height:"100%"}}>
            <TableData
              refTargetComponentName="TableData"
              wrappedComponentRef={element => (this.tableDataRef = element)}
              {...this.props}
              resid="603303655900"
              baseURL="https://finisar.realsun.me:9092/"
              getcolumninfo="1"
              pageSize="10"
              page="1"
              hasRowSelection={true}
              hasAdd={false}
              hasBeBtns={false}
              hasDelete={false}
              hasRowModify={false}
              hasRowView={false}
              hasRowDelete={false}
              hasModify={false}
              subtractH={216}
              height={600}
              actionBarFixed={true}
              hasZoomInOut={true}
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
                    面试通知
                  </Button>
                );
              }}
            />
          </TabPane>
          <TabPane tab="已通知" key="2">
            <TableData
              refTargetComponentName="TableData"
              wrappedComponentRef={element => (this.tableDataRef = element)}
              {...this.props}
              resid="604083044918"
              baseURL="https://finisar.realsun.me:9092/"
              getcolumninfo="1"
              pageSize="10"
              page="1"
              hasRowSelection={true}
              hasAdd={false}
              hasBeBtns={false}
              hasDelete={false}
              hasRowModify={false}
              hasRowView={false}
              hasRowDelete={false}
              hasModify={false}
              subtractH={216}
              height={600}
              actionBarFixed={true}
             
            />
          </TabPane>
          <Modal
            title="选择日期"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            destroyOnClose
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              面试日期：
              <DatePicker onChange={this.onChange} />
            </div>
          </Modal>
        </Tabs>
      </div>
    );
  }
}

export default TableDataInner;
