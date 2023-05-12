import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Button, message, Modal } from 'antd';
import http from 'Util20/api';

class NoFeedbackFromInternalTraining extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vis: false
    };
  }

  componentDidMount = () => { };

  //向邮件表发送记录编号
  sendRECID = async (...recids) => {
    let res;
    console.log(recids);
    let recidArray = recids[0].map(item => {
      return { C3_674740356945: item };
    });
    try {
      res = await http().addRecords({
        resid: '674740006120',
        data: recidArray
      });
      message.info('通知成功');
      console.log(res);
    } catch (error) {
      console.log(error.message);
      message.info(error.message);
    }
  };
  render() {
    const { vis } = this.state;
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#fff' }}>
        <Modal
          destroyOnClose
          onCancel={() => {
            this.setState({ vis: false });
          }}
          width="80vw"
          visible={vis}
          footer={null}
        >
          <div style={{ height: '80vh' }}>
            <TableData
              resid={737046742161}
              hasBeBtns={true}
              hasRowSelection={false}
              hasAdd={false}
              hasDelete={false}
              hasModify={false}
              hasRowDelete={false}
              hasRowModify={false}
              hasRowView={false}
              subtractH={210}
            />
          </div>
        </Modal>
        <TableData
          resid={674738465484}
          hasBeBtns={true}
          hasRowSelection={true}
          hasAdd={false}
          hasDelete={false}
          hasModify={false}
          hasRowDelete={false}
          hasRowModify={false}
          hasRowView={false}
          subtractH={210}
          style={{ height: '100%' }}
          refTargetComponentName="TableData"
          customRowBtns={[
            record => {
              return (
                <Button
                  onClick={() => {
                    this.sendRECID([record.REC_ID]);
                  }}
                >
                  发送提醒邮件
                </Button>
              );
            }
          ]}
          actionBarExtra={({ selectedRowKeys }) => {
            return (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    this.sendRECID(selectedRowKeys);
                  }}
                >
                  批量发送提醒邮件
              </Button>
                <Button onClick={() => { this.setState({ vis: true }) }}>
                  查看邮件发送记录
              </Button>
              </>
            );
          }}
        />
      </div>
    );
  }
}

export default NoFeedbackFromInternalTraining;
