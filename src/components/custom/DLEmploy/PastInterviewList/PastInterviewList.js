import React from 'react';
import './PastInterviewList.less';
import TabsTableData from '../../TabsTableData';
import { Modal, Button, message, Tabs, Popconfirm } from 'antd';
import http from '../../../../util20/api';
class PastInterviewList extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    SquareCardArr: [],
    val: null
  };
  onHandleMessage = async (dataSource, selectedRowKeys) => {
    // console.log(dataSource,selectedRowKeys)
    if (selectedRowKeys.length) {
      const data = dataSource;
      const Reldata = [];
      data.map(item => {
        selectedRowKeys.map(items => {
          if (item.REC_ID === items) {
            console.log(item)
            item.sendPEMsg = 'Y';
            Reldata.push(item);
          }
        });
      });
      let res;
      try {
        res = await http({
          baseURL:'http://kingofdinner.realsun.me:1201/'
        }).modifyRecords({
          resid: 618666297012,
          data: Reldata,
          isEditoRAdd: false
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
      <TabsTableData
        arr={[
          {
            wrappedComponentRef:(element => this.tableDataRef = element),
            refTargetComponentName:"TableData",
            baseURL:'http://kingofdinner.realsun.me:1201/',
            resid: 618666297012,
            TabsTitle: '未通知录用人员',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: false,
            hasModify: false,
            hasDelete: false,
            hasAdd: false,
            hasRowDelete: false,
            hasRowModify: false,
            hasRowView: true,
            hasRowSelection:true,
            subtractH: 220,
            recordFormType: 'drawer',
            formProps: {
              height: 550
            },
            actionBarExtra:({
              dataSource: dataSource,
              selectedRowKeys: selectedRowKeys
            }) => {
              return (
                <Popconfirm
                  title="发送录用通知"
                  onConfirm={() => {
                    this.onHandleMessage(dataSource, selectedRowKeys);
                  }}
                >
                  <Button>发送体检通知</Button>
                </Popconfirm>
              );
            },
            recordFormContainerProps: {
              placement: 'bottom',
              height: 600
            }
          },
          {
            baseURL:'http://kingofdinner.realsun.me:1201/',
            resid: 618666595021,
            TabsTitle: '已通知录用人员',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            hasAdd: false,
            hasRowDelete: false,
            hasRowModify: false,
            hasRowView: true,
            subtractH: 220,
            formProps: {
              height: 550
            },
            recordFormType: 'drawer',
            recordFormContainerProps: {
              placement: 'bottom',
              height: 600
            }
          }
        ]}
      />
    );
  }
}

export default PastInterviewList;
