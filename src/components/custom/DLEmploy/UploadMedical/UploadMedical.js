import React from 'react';
import './UploadMedical.less';
import TabsTableData from '../../TabsTableData';
class UploadMedical extends React.Component {
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
  render() {
    return (
      <TabsTableData
        arr={[
          {
            baseURL:this.baseURL,
            downloadBaseURL :this.dlEmployDownloadURL,
            resid: 618666652590,
            TabsTitle: '上传体检报告',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: false,
            hasModify: false,
            hasDelete: true,
            hasAdd: true,
            hasRowDelete: false,
            hasRowModify: true,
            hasRowView: true,
            hasRowSelection:true,
            subtractH: 220,
            hasDownloadExcel:true,
            recordFormType:'drawer',
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
            recordFormContainerProps: {
              placement: 'bottom',
              height: 550
            },
            importConfig: {
              mode: 'fe',
              saveState: 'added',
              containerType: 'drawer'
            },
          },
          {
            baseURL:this.baseURL,
            downloadBaseURL:this.dlEmployDownloadURL,
            resid: 618666816692,
            TabsTitle: '体检未通过人员',
            OutHeight: '80vh',
            recordFormFormWidth: '90%',
            hasBeBtns: true,
            hasModify: false,
            hasDelete: false,
            hasAdd: true,
            hasRowDelete: false,
            hasRowModify: false,
            hasRowView: true,
            subtractH: 220,
            formProps: {
              height: 550
            },
            importConfig: {
              mode: 'fe',
              saveState: 'added',
              containerType: 'drawer'
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
              height: 700
            }
          }
        ]}
      />
    );
  }
}

export default UploadMedical;
