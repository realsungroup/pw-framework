import React from "react";
import { TableDataC } from "../loadableCustom";
import { TableData } from "../../common/loadableCommon";
import { Button, Modal, DatePicker, message, Tabs,List } from "antd";
import { saveMultipleRecord } from "../../../util/api";
import http from "../../../util20/api";
import TableDataWrap from "../TableDataWrap";
const TabPane = Tabs.TabPane;
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];


class FJList extends React.Component {
  state = { visible: false, date: "", dataSource: [], selectedRowKeys: "" };

  render() {
    return (
      <div
        className="table-data-wrap"
        style={{ height: "calc(100vh - 160px)" }}
      > 
      <div style={{background:"#fff"}}>
      <h3 style={{ margin: '16px 0' }}>Large Size</h3> <List
      size="large"
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={data}
      renderItem={item => (<List.Item>{item}</List.Item>)}
    />
      </div>
      </div>
    );
  }
}

export default FJList;
