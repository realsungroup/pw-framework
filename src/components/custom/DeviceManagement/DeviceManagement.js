import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Button, message } from 'antd';

class DeviceManagement extends Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.baseURLAPI =
      window.pwConfig[process.env.NODE_ENV].customURLs.hikBaseURL;
    this.state = {};
  }

  /**
   * 获取最新的设备信息
   * @returns void
   */
  getDeviceInfo = () => {
    const url = `${this.baseURLAPI}api/v1/syncDevices`;
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(res => {
        if (res.error === 0) {
          message.success('设备信息更新完毕');
          this.tableDataRef.handleRefresh();
        } else {
          message.info(res.message);
        }
      })
      .catch(error => {
        console.log(error);
        message.info(error.message);
      });
  };

  render() {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#fff' }}>
        <TableData
          baseURL={this.baseURL}
          resid={680878876091}
          hasBeBtns={false}
          hasRowSelection={false}
          hasAdd={false}
          hasDelete={false}
          hasModify={false}
          hasRowDelete={false}
          hasRowModify={true}
          hasRowView={true}
          style={{ height: '100%' }}
          subtractH={200}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          actionBarExtra={() => {
            return [
              <Button
                key="syncDeviceButton"
                type="primary"
                onClick={this.getDeviceInfo}
              >
                同步设备信息
              </Button>
            ];
          }}
        />
      </div>
    );
  }
}

export default DeviceManagement;
