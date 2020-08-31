import React, { Component } from "react";
import TableData from "../../common/data/TableData";
import { Button, Icon } from "antd";


export default class Training extends Component {
  render() {
    return (
      <div>
        <TableData
          resid={607189025758}
          hasDelete={false}
          hasModify={false}
          hasRowModify={false}
          hasRowView={false}
          customRowBtns={[
            (record, btnSize) => {
              return <Button><Icon type="upload" />上传培训资料</Button>;
            },
            (record, btnSize) => {
              return <Button><Icon type="download" />下载培训资料</Button>;
            }
          ]
          }
        />
      </div>
    );
  }
}
