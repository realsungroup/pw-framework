import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Modal, Button, message, Tabs, Popconfirm } from 'antd';
import SelectPersonFirstK from '../SelectPersonFirstK/SelectPersonFirstK';
import './ExamArrange.less';
import http from '../../../util20/api';
import Selected from '../Selected/Selected';

const TabPane = Tabs.TabPane;
class ExamArrange extends Component {
  state = {
    visible: false,
    record: {}
  };
  onChoosePeople = record => {
    this.setState({
      visible: true,
      record: record
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  callback = visible => {
    this.setState({
      visible: false
    });
  };
  onHandleMessage = async (dataSource, selectedRowKeys) => {
    if (selectedRowKeys.length) {
      const data = dataSource;
      const Reldata = [];
      data.map(item => {
        selectedRowKeys.map(items => {
          if (item.REC_ID === items) {
            item.C3_610208198392 = 'Y';
            Reldata.push(item);
          }
        });
      });
      let res;
      try {
        res = await http().modifyRecords({
          resid: 607188943833,
          data: Reldata,
          isEditoRAdd: false
        });
        this.setState({
          visible: false
        });
        if (res.Error === 0) {
          this.tableDataRef.handleRefresh();
          message.success('操作成功！');
        } else {
          message.error(res.message);
        }
      } catch (error) {
        message.error(error);
      }
    } else {
      message.error('请勾选记录！');
    }
  };
  render() {
    return (
      <div>
        <Tabs
          defaultActiveKey="1"
          style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}
        >
          <TabPane
            tab="未通知"
            key="1"
            style={{ width: '100%', height: '100%' }}
          >
            <TableData
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              resid="607188943833"
              hasRowView={false}
              hasModify={false}
              hasDelete={false}
              hasRowSelection={true}
              height={600}
              subtractH={230}
              customRowBtns={[
                (record, btnSize) => {
                  return (
                    <Button
                      onClick={() => {
                        console.log('record', record);
                        this.onChoosePeople(record);
                      }}
                    >
                      选择考试人员
                    </Button>
                  );
                },
                // (record, btnSize) => {
                //     return (
                //       <Button>导入考试人员</Button>
                //     );
                //   },
                (record, btnSize) => {
                  return <Selected record={record} />;
                }
              ]}
              actionBarExtra={({
                dataSource: dataSource,
                selectedRowKeys: selectedRowKeys
              }) => {
                return (
                  <Popconfirm
                  title='确认发送邮件'
                    onConfirm={() => {
                      this.onHandleMessage(dataSource, selectedRowKeys);
                    }}
                  >
                    <Button>发送通知邮件</Button>
                  </Popconfirm>
                );
              }}
            />
            {/* <Modal
          title="选择人员"
          width="100%"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
        > */}
            <SelectPersonFirstK
              callback={this.callback}
              visible={this.state.visible}
              record={this.state.record}
            />
            {/* </Modal> */}
          </TabPane>
          <TabPane
            tab="已通知"
            key="2"
            style={{ width: '100%', height: '100%' }}
          >
            <TableData
              resid="610210292340"
              hasAdd={false}
              hasRowView={false}
              hasRowModify={false}
              hasModify={false}
              hasDelete={false}
              height={600}
              subtractH={230}
              customRowBtns={[
                (record, btnSize) => {
                  return <Selected record={record} />;
                }
              ]}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default ExamArrange;
