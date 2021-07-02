import React from 'react';
import QRCode from 'qrcode.react';
import http from 'Util20/api';
import moment from 'moment';
import './ExaminationQRCode.less';
import { Button, message } from 'antd';

const seconds = 60;
class ExaminationQRCode extends React.Component {
  state = {
    value: '',
    testBatchId: ''
  };

  timer = null;

  async componentDidMount() {
    await this.getCheckInId();
  }

  setUnix = seconds => {
    let { testBatchId } = this.state;
    this.setState({
      value: `${testBatchId}`
    });
    // this.timer = setTimeout(() => {
    //   this.setUnix(seconds);
    // }, seconds * 1000);
  };

  getCheckInId = async () => {
    this.setState({ value: '' });
    try {
      let res = await http({
        baseURL: 'https://finisarinterview.realsun.me/'
      }).getTable({
        resid: 617904057962
      });
      if (res.data.length) {
        let value = res.data[0].testBatchId;
        this.setState({
          value: `${value}`,
          testBatchId: value
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentWillUnmount() {
    this.timer = null;
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 12
        }}
      >
        <Button
          type="primary"
          style={{ marginBottom: 12 }}
          onClick={() => {
            // this.timer = null;
            this.getCheckInId();
            message.success('已刷新');
          }}
        >
          重新获取
        </Button>
        <p style={{ margin: 16 }}>
          <big>
            <b>{this.state.value ? this.state.value : '正在获取数据'}</b>
          </big>
        </p>
        <QRCode value={this.state.value} size={500} renderAs="svg" />
      </div>
    );
  }
}

export default ExaminationQRCode;
