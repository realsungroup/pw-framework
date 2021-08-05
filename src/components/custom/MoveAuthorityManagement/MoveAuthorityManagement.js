import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Button, Tabs, Modal, Tree, DatePicker } from 'antd';
import { TreeTransfer } from './TreeTransfer';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const treeData = [
  { key: '0-0', title: '0-0' },
  {
    key: '0-1',
    title: '0-1',
    children: [
      { key: '0-1-0', title: '0-1-0' },
      { key: '0-1-1', title: '0-1-1' }
    ]
  },
  { key: '0-2', title: '0-3' }
];

class MoveAuthorityManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddAccessModalOpen: false,
      targetKeys: []
    };
  }

  componentDidMount = () => {};

  getAttendenceData = () => {
    console.log('同步考勤记录');
    this.tableDataRef.handleRefresh();
  };

  addAccess = () => {
    console.log('同步进出记录');
    this.tableDataRef.handleRefresh();
  };

  closeAllModals = () => {
    this.setState({
      isAddAccessModalOpen: false
    });
  };

  onChange = targetKeys => {
    console.log('Target Keys:', targetKeys);
    this.setState({ targetKeys });
  };

  render() {
    const { isAddAccessModalOpen, targetKeys } = this.state;
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#fff' }}>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab="按组织配置权限"
            key="1"
            style={{ height: 'calc(100vh - 80px)' }}
          >
            <TableData
              resid={664295226124}
              hasBeBtns={false}
              hasRowSelection={false}
              hasAdd={false}
              hasDelete={false}
              hasModify={false}
              hasRowDelete={false}
              hasRowModify={false}
              hasRowView={true}
              subtractH={180}
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              actionBarExtra={() => {
                return (
                  <>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.setState({
                          isAddAccessModalOpen: true
                        });
                      }}
                    >
                      添加权限
                    </Button>
                    <Button type="primary" onClick={this.getMoveData}>
                      下载权限到设备
                    </Button>
                  </>
                );
              }}
              customRowBtns={[
                record => {
                  return (
                    <Button type="primary" onClick={this.removeDevice}>
                      删除权限
                    </Button>
                  );
                },
                record => {
                  return (
                    <Button type="primary" onClick={this.removeDevice}>
                      修改有效期
                    </Button>
                  );
                }
              ]}
            />
          </TabPane>
          <TabPane
            tab="按人员配置权限"
            key="2"
            style={{ height: 'calc(100vh - 80px)' }}
          >
            <TableData
              resid={664295226124}
              hasBeBtns={false}
              hasRowSelection={false}
              hasAdd={false}
              hasDelete={false}
              hasModify={false}
              hasRowDelete={false}
              hasRowModify={false}
              hasRowView={true}
              subtractH={180}
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              actionBarExtra={() => {
                return (
                  <>
                    <Button type="primary" onClick={this.getMoveData}>
                      添加权限
                    </Button>
                    <Button type="primary" onClick={this.getMoveData}>
                      下载权限到设备
                    </Button>
                  </>
                );
              }}
              customRowBtns={[
                record => {
                  return (
                    <Button type="primary" onClick={this.removeDevice}>
                      删除权限
                    </Button>
                  );
                },
                record => {
                  return (
                    <Button type="primary" onClick={this.removeDevice}>
                      修改有效期
                    </Button>
                  );
                }
              ]}
            />
          </TabPane>
        </Tabs>
        <Modal
          visible={isAddAccessModalOpen}
          title="配置权限"
          width="65%"
          style={{ width: '65%' }}
          onCancel={this.closeAllModals}
          onOk={this.closeAllModals}
        >
          <div>
            <p>权限有效期</p>
            <RangePicker onChange={() => {}} />
            <br />
            <p>人员组织及下级组织</p>
            <TreeTransfer
              dataSource={treeData}
              targetKeys={targetKeys}
              onChange={this.onChange}
            />
            <br />
            <p>权限点位</p>
            <TreeTransfer
              dataSource={treeData}
              targetKeys={targetKeys}
              onChange={this.onChange}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default MoveAuthorityManagement;
