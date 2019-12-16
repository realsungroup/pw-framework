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
            hasRowDelete: true,
            hasRowModify: true,
            hasRowView: true,
            hasRowSelection:true,
            subtractH: 220,
            actionBarWidth: 300,
            hasDownloadExcel:true,
            recordFormType:'drawer',
            formProps: {
              height: 550
            },
            columnsWidth:{
              '体检结果':130,
              '姓名':90,
              '年龄':90,
              '面试时间':180,
              '申请时间':130,
              '考试结果':130,
              '面试结果':130,
              '签到':90,
              '劳务公司':130,
              '面试官':115,
              '发送报到通知':160,
              '身份证号':200,
              '考试分数':130,
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
            hasRowDelete: true,
            hasRowModify: true,
            hasRowView: true,
            subtractH: 220,
            actionBarWidth: 300,
            formProps: {
              height: 550
            },
            importConfig: {
              mode: 'fe',
              saveState: 'added',
              containerType: 'drawer'
            },
            columnsWidth:{
              '体检结果':130,
              '姓名':90,
              '年龄':90,
              '申请职位':140,
              '面试时间':180,
              '申请时间':130,
              '考试结果':130,
              '面试结果':130,
              '签到':90,
              '劳务公司':130,
              '面试官':115,
              '发送报到通知':160,
              '身份证号':200,
              '考试分数':115,
              '面试日期':140
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
