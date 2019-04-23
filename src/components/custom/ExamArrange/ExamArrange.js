import React, { Component } from "react";
import TableData from "../../common/data/TableData";
import { Modal, Button,message } from "antd";
import "./ExamArrange.less";
import http from "../../../util20/api";
import Selected from "../Selected/Selected";

export default class Result extends Component {
  render() {
    return (
      <div>
          <TableData
            resid="607188943833"
            hasRowView={false}
            hasModify={false}
            hasDelete={false}
            hasRowSelection={true}
            customRowBtns={[
                (record, btnSize) => {
                  return (
                    <Button>手动选择考试人员</Button>
                  ); 
                },
                (record, btnSize) => {
                    return (
                      <Button>导入考试人员</Button>
                    ); 
                  },
                  (record, btnSize) => {
                    return (
                        <Selected></Selected>
                    ); 
                  }
              ]
            }
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
                    发送通知邮件
                  </Button>
                );
              }}
          />
      </div>
    );
  }
}
