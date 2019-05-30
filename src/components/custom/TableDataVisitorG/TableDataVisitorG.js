import React from "react";
import TableData from "../../common/data/TableData";
import Base64 from "base-64";
import { message, Modal, Form, Input, Button } from "antd";
import http from "../../../util20/api";
import { withRecordForm } from "../../common/hoc/withRecordForm";
import { setDataInitialValue } from "Util20/formData2ControlsData";
const socket = require("socket.io-client")("http://localhost:5000");

class TableDataVisitorG extends React.Component {
  state = {
    visible: false,
    record: null,
    readOnly: true
  };
  btnStartRead = params => {};
  componentDidMount = () => {
    socket.emit("startRead");
    let card;
    socket.on("card message", async msg => {
      var result = Base64.decode(msg);
      card = eval("(" + result + ")");

      if (card) {
        let res;
        try {
          res = await http().getTable({
            resid: 606302353251,
            cmswhere: `C3_605719242955 = ${card.cardno}`
          });
          if (res.data.length>0) {
            message.success("查询成功！");
            await this.setState({
              record: res.data
            });
            document.getElementById("adds").click();
          } else {
            message.error("查无此人！");
          }
        } catch (error) {}
      }
    });
    //   'card message', function(msg){//接收读卡信息
    //     var base = new Base64();
    // var result1 = base.decode(msg); //解码
    // $('#messages').append($('<li>').text(result1));//显示
    // });

    // socket.on('add user', (data) => {
    //     console.log(data)
    // });
    // socket.on('new message', (data) => {
    //     console.log(data)
    // });
  };

  open = () => {
    this.setState({
      visible: true
    });
  };

  handleOpenRecordForm = (dataSource, selectedKeys, data, recordFormData) => {
    console.log({ data });
    const { record } = this.state;
    if (record) {
      data.map(item => {
        switch (item.label) {
          case '登记证件号码':
          item.initialValue = record[0].C3_605719242955;
            break;
              case '访问地区类型':
              item.initialValue = record[0].C3_605719242641;
                break;
                case '登记证件类型':
                item.initialValue = record[0].C3_605719242802;
                  break;
                  case '访客姓名':
                  item.initialValue = record[0].C3_605719242294;
                    break;
                    case '访客类型':
                    item.initialValue = record[0].C3_605719242479;
                      break;
                      case '访客单位':
                      item.initialValue = record[0].C3_605719242129;
                        break;
                        case '访问事由':
                            item.initialValue = record[0].C3_606843168661;
                            break;
                            case '申请人姓名':
                                item.initialValue = record[0].C3_612530147136;
                                break;
                            
        }
        // if (item.label === "登记证件号码" && record) {
        //   item.initialValue = record[0].C3_608392189420;
        //   // console.log("item.initialValue", item.initialValue);
        // }
        
      });
      // let records = record[0];
      // records.C3_606071247109 = records.C3_608392189420
      // const newData = setDataInitialValue(data, records);
      // console.log("records",records)
    }

    this.props.openRecordForm({
      title: "添加",
      type: "drawer",
      data,
      operation: "add",
      recordFormFormWidth: "50%",
      recordFormTabsWidth: "50%",
      onSuccess: ()=> {
        this.setState({
          record:null
        })
        message.success("保存成功！")
        this.props.closeRecordForm()
      },
      onCancel: () => {
        this.setState({
          record:null
        })
        this.props.closeRecordForm()} 
        ,
      recordFormContainerProps: {
        height: 600,
        placement: "bottom",
        onClose: () => {
          this.setState({
            record:null
          })
          this.props.closeRecordForm()
        }
      },
      formProps: {
        height: 500
      },
      subTableArr: recordFormData.subTableArr,
      subTableArrProps: [
        {
          subTableName: "物品信息",
          subResid: 606413909447,
          height:600,
          tableProps: {
            hasAdd: true,
            hasModify: false,
            hasDelete: false
          }
        }
      ],
      info: { dataMode: "sub", resid: this.props.resid },
      storeWay: "fe"
    });
  };

  handleOk = () => {
    this.setState({
      visible: false
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  render() {
    const { visible, record, readOnly } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div
        className="table-data-wrap"
        style={{ height: "calc(100vh - 220px)" }}
      >
        <TableData
          {...this.props}
          actionBarExtra={({
            dataSource,
            selectedRowKeys,
            data,
            recordFormData
          }) => {
            return (
              <Button
                ref="adds"
                id="adds"
                onClick={() =>
                  this.handleOpenRecordForm(
                    dataSource,
                    selectedRowKeys,
                    data,
                    recordFormData
                  )
                }
              >
                添加
              </Button>
            );
          }}
        />
        <Modal
          title="填写登记单"
          visible={visible}
          // width="100%"
          onOk={this.handleOk}
          // style={{ top: "40%" ,display:"flex",flexDirection:"row"}}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          {/* <div style={{width:"40%"}}> */}
          <Form.Item label="访客姓名">
            {getFieldDecorator("name", {
              initialValue: [record && record[0] && record[0].C3_605719242294],
              rules: [
                {
                  required: true,
                  message: "Please input your E-mail!"
                }
              ]
            })(<Input readOnly={readOnly} />)}
          </Form.Item>
          <Form.Item label="身份证号">
            {getFieldDecorator("cardno", {
              initialValue: [record && record[0] &&  record[0].C3_605719242955],
              rules: [
                {
                  required: true,
                  message: "Please input your password!"
                }
              ]
            })(<Input type="text" readOnly={readOnly} />)}
          </Form.Item>
          
          <Form.Item label="访客类型">
            {getFieldDecorator("visiterType", {
              initialValue: [record && record[0] &&  record[0].C3_605719242479],
              rules: [
                {
                  required: true,
                  message: "Please input your password!"
                }
              ]
            })(<Input type="text" readOnly={readOnly} />)}
          </Form.Item>
          <Form.Item label="单位">
            {getFieldDecorator("componey", {
              initialValue: [record && record[0] &&  record[0].C3_605719242129],
              rules: [
                {
                  required: true,
                  message: "Please input your password!"
                }
              ]
            })(<Input type="text" readOnly={readOnly} />)}
          </Form.Item>

          <Form.Item label="事由">
            {getFieldDecorator("reason", {
              initialValue: [record && record[0] &&  record[0].C3_606843168661],
              rules: [
                {
                  required: true,
                  message: "Please input your password!"
                }
              ]
            })(<Input type="text" readOnly={readOnly} />)}
          </Form.Item>
          
          <Form.Item label="地区">
            {getFieldDecorator("area", {
              initialValue: [record && record[0] &&  record[0].C3_605719242641],
              rules: [
                {
                  required: true,
                  message: "Please input your password!"
                }
              ]
            })(<Input type="text" readOnly={readOnly} />)}
          </Form.Item>

          
          <Form.Item label="申请人">
            {getFieldDecorator("applyName", {
              initialValue: [record && record[0] &&  record[0].C3_612530147136],
              rules: [
                {
                  required: true,
                  message: "Please input your password!"
                }
              ]
            })(<Input type="text" readOnly={readOnly} />)}
          </Form.Item>
          
          {/* </div> */}

          {/* <div style={{width:"40%"}}>
        <TableData  {...this.props}   
              />
        </div> */}
        </Modal>
      </div>
    );
  }
}

export default withRecordForm()(Form.create()(TableDataVisitorG));
