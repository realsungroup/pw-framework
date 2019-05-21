import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Tabs, Modal, Button, message } from 'antd';
import http from 'Util20/api';
import './ExamManage.less';

const TabPane = Tabs.TabPane;

/**
 * 考试安排
 */
export default class ExamManage extends Component {
  state = { visible: false, record: '' };

  showModal = record => {
    console.log('record', record);
    if (record) {
      this.setState({
        visible: true,
        record: record
      });
    }
  };

  handleClose = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleOk = async e => {
    let res;
    console.log('this.state.dataSource', this.state.dataSource);
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
  };
  onHandleMessage = async (dataSource, selectedRowKeys) => {
    console.log('dataSource', dataSource, selectedRowKeys);
    console.log('recoed', this.state.record);
    if (selectedRowKeys.length > 0) {
      let res;
      let data = this.state.dataSource;
      let Reldata = [];
      dataSource.map(item => {
        item.C3_607172879503 = this.state.record.C3_607171749463;
      });
      // data.map(item => {
      //   this.state.selectedRowKeys.map((items) => {
      //    if( item.REC_ID === items){
      //     item.C3_601650474946 = this.state.date;
      //     item.C3_604408361317 = 'Y'
      //     Reldata.push(item)
      //    }
      //   })
      // });
      try {
        res = await http().addRecords({
          // baseURL: "https://finisar.realsun.me:9092/"
          resid: 607188996053,
          data: dataSource,
          isEditoRAdd: false
        });
        this.setState({
          visible: true
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

      this.setState({
        visible: true,
        dataSource: dataSource,
        selectedRowKeys: selectedRowKeys
      });
    } else {
      message.error('请先勾选记录！');
    }
  };

  handleDownloadTemplate = async () => {
    let res;
    try {
      res = await http().exportTableData({
        resid: 611164003696,
        filetype: 'xls'
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    const { fileDownloadUrl } = window.pwConfig[process.env.NODE_ENV];
    window.open(fileDownloadUrl + res.data);
  };

  render() {
    return (
      <div
        className="table-data-wrap"
        style={{ height: '100vh' }}
      >
        <TableData
          refTargetComponentName="TableData"
          wrappedComponentRef={element => (this.tableDataRef = element)}
          {...this.props}
          resid={607188968490}
          hasRowSelection={false}
          hasRowModify={true}
          hasRowView={false}
          hasBeBtns={false}
          hasRowDelete={true}
          hasModify={false}
          hasDelete={false}
          subtractH={188}
          actionBarFixed={true}
          recordFormType="drawer"
          recordFormContainerProps={{
            placement: 'bottom',
            height: 600
          }}
          //   subTableArrProps={{
          //       subTableName: '员工成绩',
          //       subResid: 607188996053,
          //       tableProps: {
          //         hasAdd: false,
          //         hasModify: false,
          //         hasRowDelete: false,
          //         hasRowModify: false,
          //         hasDelete: false
          //       }

          //       // hasRowModify: false,
          //       // hasRowView: false,
          //       // hasRowDelete: false
          //   //   }
          //   // ]
          // }}
          customRowBtns={[
            // (record, btnSize) => {
            //   return (
            //     <Button
            //       onClick={() => {
            //         this.showModal(record);
            //       }}
            //     >
            //       添加题目
            //     </Button>
            //   );
            // },
            (record, btnSize) => {
              return (
                <Button
                  onClick={() => {
                    this.showModal(record);
                  }}
                  style={{ margin: '0 4px' }}
                >
                  导入题目
                </Button>
              );
            },
            (record, btnSize) => {
              return (
                <Button
                  onClick={() => {
                    window.location.href = `/fnmodule?resid=607459194551&recid=610198378903&type=考试系统&title=试卷设置&id=${
                      record.C3_607171749463
                    }`;
                  }}
                  style={{ margin: '0 4px' }}
                >
                  设计试卷
                </Button>
              );
            }
            // (record, btnSize) => {
            //   return <SetScore>分数设置</SetScore>;
            // }
          ]}
        />
        <Modal
          width="1200px"
          title="添加题目"
          visible={this.state.visible}
          onOk={this.handleClose}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          <TableData
            resid={607188996053}
            hasRowDelete={true}
            hasAdd={false}
            hasDelete={false}
            hasModify={false}
            hasRowView={false}
            hasRowModify={false}
            hasBeBtns={false}
            hasRowSelection={false}
            subtractH={220}
            heigth={500}
            width={1150}
            cmswhere={`C3_607172879503 = ${this.state.record.C3_607171749463}`}
            headerExtra={() => (
              <Button
                size="small"
                style={{ marginBottom: 6 }}
                onClick={this.handleDownloadTemplate}
                type="primary"
              >
                下载题目模板
              </Button>
            )}
          />
        </Modal>
      </div>
    );
  }
}
