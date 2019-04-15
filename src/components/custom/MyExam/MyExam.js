import React, { Component } from "react";
import TableData from "../../common/data/TableData";
import { Modal, Button } from "antd";
import "./MyExam.less";

export default class MyExam extends Component {
  render() {
    return (
      <div>
          <TableData
            resid="607188943833"
            hasRowModify={false}
            hasRowView={false}
            hasRowDelete={false}
            hasAdd={false}
            hasModify={false}
            hasDelete={false}
            height={500}
            customRowBtns={[
                (record, btnSize) => {
                  return (
                    <Button>参加考试</Button>
                  );
                },
              ]}
          />
      </div>
    );
  }
}
