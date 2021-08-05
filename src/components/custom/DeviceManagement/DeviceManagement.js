import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Button, message } from 'antd';

class DeviceManagement extends Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.state = {};
  }

  componentDidMount = () => {};

  /**
   * 获取最新的设备信息
   * @returns void
   */
  getDeviceInfo = () => {
    console.log('同步设备信息');
    message.success('设备信息更新完毕');
    this.tableDataRef.handleRefresh();
  };

  /**
   * 添加新设备
   * @param {object} deviceInfo
   * @returns void
   */
  addDevice = deviceInfo => {
    console.log('同步设备信息');
    message.success('设备已成功添加');
    this.tableDataRef.handleRefresh();
  };

  /**
   * 删除设备
   * @param {String} deviceNo
   * @returns void
   */
  removeDevice = deviceNo => {
    console.log('删除设备信息');
    message.success('设备已成功删除');
    this.tableDataRef.handleRefresh();
  };

  render() {
    const {} = this.state;
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
          hasRowModify={false}
          hasRowView={true}
          style={{ height: '100%' }}
          subtractH={200}
          wrappedComponentRef={element => (this.tableDataRef = element)}
          refTargetComponentName="TableData"
          actionBarExtra={() => {
            return [
              <Button type="primary" onClick={this.getDeviceInfo}>
                同步设备信息
              </Button>,
              <Button type="primary" onClick={this.addDevice}>
                添加设备
              </Button>
            ];
          }}
          customRowBtns={[
            record => {
              return (
                <Button type="primary" onClick={this.removeDevice}>
                  删除设备
                </Button>
              );
            }
          ]}
        />
      </div>
    );
  }
}

export default DeviceManagement;
