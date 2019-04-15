import React from 'react';
import TableData from '../../common/data/TableData';
import Base64 from 'base-64';
import { message, Modal, Form, Input, Button } from 'antd';
import http from '../../../util20/api';
import { withRecordForm } from '../../common/hoc/withRecordForm';
const socket = require('socket.io-client')('http://localhost:5000');

class TableDataWrap extends React.Component {
  state = {
    visible: false,
    record: null,
    readOnly: true
  };
  btnStartRead = params => {};
  componentDidMount = () => {
    socket.emit('startRead');
    let card;
    socket.on('card message', async msg => {
      var result = Base64.decode(msg);
      card = eval('(' + result + ')');

      if (card) {
        let res;
        try {
          res = await http().getTable({
            resid: 606066688508,
            cmswhere: 'C3_608392189420 = ' + card.cardno
          });
          if (res.data) {
            message.success('查询成功！');
            await this.setState({
              record: res.data
            });
            this.open();
          } else {
            message.error('查无此人！');
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
    this.props.openRecordForm({
      title: '标题啊啊',
      type: 'drawer',
      data,
      operation: 'add',
      recordFormContainerProps: {
        height: 600,
        placement: 'bottom',
        onClose: () => this.props.closeRecordForm()
      },
      formProps: {
        height: 500
      },
      subTableArr: recordFormData.subTableArr,
      subTableArrProps: [
        {
          subTableName: '物品信息',
          subResid: 606413909447,
          tableProps: {
            hasAdd: true,
            hasModify: false,
            hasDelete: false
          }
        }
      ],
      info: { dataMode: 'sub', resid: this.props.resid },
      storeWay: 'fe'
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
        style={{ height: 'calc(100vh - 220px)' }}
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
          <Form.Item label="姓名">
            {getFieldDecorator('name', {
              initialValue: [record && record[0].C3_605716828937],
              rules: [
                {
                  required: true,
                  message: 'Please input your E-mail!'
                }
              ]
            })(<Input readOnly={readOnly} />)}
          </Form.Item>
          <Form.Item label="身份证号">
            {getFieldDecorator('cardno', {
              initialValue: [record && record[0].C3_608392189420],
              rules: [
                {
                  required: true,
                  message: 'Please input your password!'
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

// export default withRecordForm()(TableDataWrap);

// export default Form.create()(TableDataWrap);
export default withRecordForm()(Form.create()(TableDataWrap));
