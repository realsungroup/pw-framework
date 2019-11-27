import React from 'react';
import './ReportPeople.less';
import TabsTableData from '../../TabsTableData';
import { Modal, Button, message, Tabs, Popconfirm } from 'antd';
import http from '../../../../util20/api';
class ReportPeople extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.dlEmployBaseURL;
    this.dlEmployDownloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.dlEmployDownloadURL;
  }
  state = {
    SquareCardArr: [],
    val: null
  };

  onHandleMessage = async (dataSource, selectedRowKeys) => {
    console.log(dataSource,selectedRowKeys)
    if (selectedRowKeys.length) {
      const data = dataSource;
      const Reldata = [];
      data.map(item => {
        selectedRowKeys.map(items => {
          if (item.REC_ID === items) {
            console.log(item)
            item.sendRPMsg = 'Y';
            Reldata.push(item);
          }
        });
      });
      let res;
      try {
        res = await http({
          baseURL:'http://kingofdinner.realsun.me:1201/'
        }).modifyRecords({
          resid: 618666744677,
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
            baseURL:this.baseURL,
            downloadBaseURL :this.dlEmployDownloadURL,
            resid: 618666744677,
            TabsTitle: '未通知',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: false,
            hasModify: false,
            hasDelete: false,
            hasAdd: true,
            hasRowDelete: false,
            hasRowModify: false,
            hasRowView: true,
            hasRowSelection:true,
            subtractH: 240,
            recordFormType: 'drawer',
            formProps: {
              height: 550
            },
            columnsWidth:{
              '面试时间':180,
              '姓名':90,
              '年龄':90,
              '申请职位':115,
              '申请时间':130,
              '考试结果':115,
              '面试结果':115,
              '状态':90,
              '签到':90,
              '开始面试操作':180,
              '结束面试':115,
              '考试批次':130,
              '面试通知发送':160,
              '劳务公司':115,
              '面试官':115,
              '面试官账号':130,
              '体检结果':115,
              '发送体检通知':160,
              '发送报到通知':160,
              '是否入职':115,
              '是否离职':115,
              '预约已过期':130,
              '开始考试时间':180,
              '身份证号':200,
              '考试分数':115,
              '结束考试时间':180
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
                  <Button>发送录用通知</Button>
                </Popconfirm>
              );
            },
            recordFormContainerProps: {
              placement: 'bottom',
              height: 600
            }, 
          },
          {
            baseURL:this.baseURL,
            downloadBaseURL :this.dlEmployDownloadURL,
            resid: 618666763917,
            TabsTitle: '已通知',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            hasAdd: true,
            hasRowDelete: false,
            hasRowModify: false,
            hasRowView: false,
            subtractH: 220,
            formProps: {
              height: 550
            },
            columnsWidth:{
              '面试时间':180,
              '姓名':90,
              '年龄':90,
              '申请职位':115,
              '申请时间':130,
              '考试结果':115,
              '面试结果':115,
              '状态':90,
              '签到':90,
              '开始面试操作':180,
              '结束面试':115,
              '考试批次':130,
              '面试通知发送':160,
              '劳务公司':115,
              '面试官':115,
              '面试官账号':130,
              '体检结果':115,
              '发送体检通知':160,
              '发送报到通知':160,
              '是否入职':115,
              '是否离职':115,
              '预约已过期':130,
              '开始考试时间':180,
              '身份证号':200,
              '考试分数':115,
              '结束考试时间':180
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

export default ReportPeople;
