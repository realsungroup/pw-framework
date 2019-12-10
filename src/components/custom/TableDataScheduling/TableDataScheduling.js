import React from 'react';
import { TableDataC } from '../loadableCustom';
import { TableData } from '../../common/loadableCommon';
import { Button, Modal, DatePicker, message, Tabs } from 'antd';
import { saveMultipleRecord } from '../../../util/api';
import http from '../../../util20/api';
import TableDataWrap from '../TableDataWrap';
const TabPane = Tabs.TabPane;

class TableDataScheduling extends React.Component {
  state = { visible: false, date: '', dataSource: [], selectedRowKeys: '' };

  onChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({
      date: dateString
    });
  };
  handleOk = async e => {
    let res;
    let data = this.state.dataSource;
    let Reldata = [];
    data.map(item => {
      this.state.selectedRowKeys.map(items => {
        if (item.REC_ID === items) {
          item.C3_601650474946 = this.state.date;
          item.C3_604408361317 = 'Y';
          Reldata.push(item);
        }
      });
    });
    try {
      res = await http({
        baseURL: 'https://finisar.realsun.me:9092/'
      }).modifyRecords({
        resid: 603303655900,
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
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  onHandleMessage = (dataSource, selectedRowKeys) => {
    if (selectedRowKeys.length > 0) {
      this.setState({
        visible: true,
        dataSource: dataSource,
        selectedRowKeys: selectedRowKeys
      });
    } else {
      message.error('请先勾选记录！');
    }
  };
  render() {
    return (
      <div className="table-data-wrap" style={{ height: '100vh' }}>
        <Tabs
          defaultActiveKey="1"
          style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}
        >
          <TabPane
            tab="排班导入"
            key="1"
            style={{ width: '100%', height: '100%' }}
          >
            <TableDataWrap
              hasTabs={true}
              refTargetComponentName="TableData"
              wrappedComponentRef={element => (this.tableDataRef = element)}
              // {...this.props}
              resid="527089107422"
              dblinkname="EHR"
              getcolumninfo="1"
              pageSize="10"
              page="1"
              defaultPagination={{
                current: 1,
                pageSize: 40,
                showSizeChanger: true,
                showQuickJumper: true
              }}
              size="small"
              hasRowSelection={false}
              hasAdd={true}
              hasBeBtns={false}
              hasDelete={false}
              hasRowModify={true}
              hasRowView={false}
              hasRowDelete={true}
              hasModify={false}
              subtractH={180}
              // height={500}
              actionBarFixed={true}
              // hasZoomInOut={true}
              importConfig={{
                mode: 'fe',
                saveState: 'editoradd',
                containerType: 'drawer'
              }}
              // actionBarExtra={({
              //   dataSource: dataSource,
              //   selectedRowKeys: selectedRowKeys
              // }) => {
              //   return (
              //     <Button
              //       onClick={() => {
              //         this.onHandleMessage(dataSource, selectedRowKeys);
              //       }}
              //     >
              //       面试通知
              //     </Button>
              //   );
              // }}
            />
          </TabPane>
          <TabPane tab="排班导入错误" key="2">
            <TableDataWrap
              // refTargetComponentName="TableData"
              // wrappedComponentRef={element => (this.tableDataRef = element)}
              // {...this.props}
              hasTabs={true}
              resid="527162576853"
              dblinkname="EHR"
              getcolumninfo="1"
              pageSize="10"
              page="1"
              size="small"
              hasRowSelection={false}
              hasAdd={false}
              hasBeBtns={false}
              hasDelete={false}
              hasRowModify={true}
              hasRowView={false}
              hasRowDelete={true}
              hasModify={false}
              subtractH={240}
              height={500}
              actionBarFixed={true}
            />
          </TabPane>
          <TabPane tab="排班超标记录" key="3">
            <TableDataWrap
              hasTabs={true}
              refTargetComponentName="TableData"
              dblinkname="EHR"
              wrappedComponentRef={element => (this.tableDataRef = element)}
              // {...this.props}
              resid="612464619921"
              getcolumninfo="1"
              pageSize="10"
              page="1"
              size="small"
              hasRowSelection={false}
              hasAdd={false}
              hasBeBtns={false}
              hasDelete={false}
              hasRowModify={true}
              hasRowView={false}
              hasRowDelete={true}
              hasModify={false}
              subtractH={240}
              height={500}
              actionBarFixed={true}
              columnsWidth ={{
                "员工工号":120,
                "是否超标":120,
                "连续7天等级":150,
                "大于84等级":150,
                "小于84等级":150,
                "小于72等级":150,

              }}
            />
          </TabPane>
          {/* <Modal
            title="选择日期"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            destroyOnClose
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              面试日期：
              <DatePicker onChange={this.onChange} />
            </div>
          </Modal> */}
        </Tabs>
      </div>
    );
  }
}

export default TableDataScheduling;
