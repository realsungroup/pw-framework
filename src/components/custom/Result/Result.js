import React, { Component } from "react";
import TableData from "../../common/data/TableData";
import { Modal, Button } from "antd";
import "./Result.less";

export default class Result extends Component {
  render() {
    return (
      <div>
          <TableData
            resid="607385902612"
            hasRowModify={false}
            hasRowView={false}
            hasRowDelete={false}
            hasAdd={false}
            hasModify={false}
            hasDelete={false}
            customRowBtns={[
                (record, btnSize) => {
                  return (
                    <Button>查看成绩明细</Button>
                  );
                },
              ]}
          />
      </div>
    );
  }
}
