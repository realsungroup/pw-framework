import React, { Component } from 'react';
import './CourseResources.less';
import { TableData } from '../../common/loadableCommon';
import { Button, Popconfirm, message, Alert, Spin } from 'antd';
import http from 'Util20/api';
import { getItem } from 'Util20/util';
import qs from 'qs';
import moment from 'moment';

class CourseResources extends Component {
  state = {
    userInfo: JSON.parse(getItem('userInfo')).UserInfo,
    appliedCourses: [],
    loading: false,
    curDate: '20000101'
  };

  componentDidMount = () => {
    this.getAppliedCourses();
    var success = window.location.search;
    success = qs.parse(success.substring(1));
    success = success.success;
    let DateTime = new Date();
    DateTime = moment(DateTime).format('YYYYMMDD');
    DateTime = Number(DateTime);
    this.setState({ curDate: DateTime });
    if (success == 'true') {
      message.success('报名成功！');
    }
  };

  //获取已选课程
  getAppliedCourses = async () => {
    let res,
      usercode = parseInt(this.state.userInfo.EMP_USERCODE);
    try {
      res = await http().getTable({
        resid: '615983369834',
        cmswhere: `C3_613941384832 = ${usercode}`
      });
      // let ids = res.data.map(item => {
      //   return item.CourseArrangeID;
      // });
      this.setState({ appliedCourses: [...res.data] });
    } catch (error) {
      console.log(error.message);
      message.error(error.message);
    }
  };
  handleConfirm = async record => {
    let usercode = parseInt(this.state.userInfo.EMP_USERCODE);
    try {
      const res = await http().addRecords({
        resid: '615983369834',
        data: [
          {
            CourseArrangeID: record.CourseArrangeID,
            C3_613941384832: usercode,
            isApply: 'Y'
          }
        ]
      });
      if (record.places) {
        message.success('课程报名成功');
      } else {
        message.success('申请报名成功，请等待HR审核');
      }
      await this.tableDataRef.handleRefresh();
      this.setState({
        appliedCourses: [...this.state.appliedCourses, res.data[0]]
      });
    } catch (error) {
      message.error(error.message);
      console.log(error.message);
    }
  };

  //取消报名
  handleCancelAppply = async record => {
    const { appliedCourses } = this.state;
    let course = appliedCourses.find(item => {
      return item.CourseArrangeID === record.CourseArrangeID;
    }); //取消报名的课
    try {
      await http().removeRecords({
        resid: '615983369834',
        data: [{ REC_ID: course.REC_ID }]
      });
      message.success('取消报名成功');
      appliedCourses.splice(
        appliedCourses.findIndex(item => {
          return item.CourseArrangeID === record.CourseArrangeID;
        }),
        1
      );
      // let courses =
      this.getAppliedCourses();
      // this.setState({appliedCourses})
    } catch (error) {
      message.error(error.message);
      console.log(error.message);
    }
  };

  render() {
    let { appliedCourses } = this.state;
    let btns = [
      record => {
        // console.log("record.lastPlaces",record.lastPlaces,record.places)
        let isApplied = appliedCourses.find(
          item => item.CourseArrangeID === record.CourseArrangeID
        );
        if (isApplied && record.classType === '内训') {
          return (
            <Popconfirm
              title="是否撤回报名申请？"
              onConfirm={this.handleCancelAppply.bind(this, record)}
            >
              <Button type="danger">撤回报名申请</Button>
            </Popconfirm>
          );

        }
        else if (record.lastPlaces === 0) {
          return (
            <Alert message="人数已满，无法报名" type="info" showIcon></Alert>
          );
        }
        else if (record.lastPlaces === 0 && record.places) {
          return (
            <Alert message="人数已满，无法报名" type="info" showIcon></Alert>
          );
        } else if (record.isStopApply !== 'Y' && record.classType === '内训') {
          if (record.needSheet == 'Y') {
            if (Number(record.C3_625672176260) <= this.state.curDate) {
              return '该课程无法报名';
            } else {
              return (
                <Button
                  onClick={async () => {
                    this.setState({ loading: true });
                    let res;
                    // 获取工号
                    var staffNum = localStorage.getItem('userInfo');

                    staffNum = JSON.parse(staffNum);
                    staffNum = staffNum.UserCode;
                    // 查找历史问卷记录并删除
                    try {
                      res = await http().getTable({
                        resid: '609613163948',
                        cmswhere: `staff_number = '${staffNum}' and query_id = '${record.sheetId}'`
                      });
                      var arr = [];
                      var n = 0;
                      while (n < res.data.length) {
                        arr.push({ REC_ID: res.data[n].REC_ID });
                        n++;
                      }
                      await http().removeRecords({
                        resid: '609613163948',
                        data: arr
                      });
                      console.log(record.CourseArrangeID);
                      var res2 = await http().getTable({
                        resid: '608838682402',
                        cmswhere: `query_id = '${record.sheetId}' and person_id = '${staffNum}'`
                      });
                      arr = [];
                      n = 0;
                      while (n < res2.data.length) {
                        arr.push({ REC_ID: res2.data[n].REC_ID });
                        n++;
                      }
                      await http().removeRecords({
                        resid: '608838682402',
                        data: arr
                      });
                      // 添加问卷答题人员
                      await http().addRecords({
                        resid: '609613163948',
                        data: [
                          {
                            // 问卷编号
                            query_id: record.sheetId,
                            // 人员工号
                            staff_number: staffNum,
                            sheetType: 'DO_NOT_SEND_MAIL'
                          }
                        ]
                      });
                      this.setState({ loading: false });
                      // 跳转问卷
                      window.open(
                        window.location.origin +
                        '?resid=我的问卷&recid=609335337024&type=前端功能入口&title=我的问卷&id=' +
                        record.sheetId +
                        '&courseId=' +
                        record.CourseArrangeID
                      );
                      window.parent.close();
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                >
                  填写问卷并报名
                </Button>
              );
            }
          } else {
            if (Number(record.C3_625672176260) <= this.state.curDate) {
              return '该课程无法报名';
            } else {
              return (
                <Popconfirm
                  onConfirm={this.handleConfirm.bind(this, record)}
                  title="是否提交报名申请"
                >
                  <Button>提交报名申请</Button>
                </Popconfirm>
              );
            }
          }
        } else if (record.isStopApply === 'Y' && record.classType === '内训') {
          return <Alert message="报名已截止" type="info" showIcon></Alert>;
        } else {
          return <Alert message="外训不可报名" type="warning" showIcon></Alert>;
        }
        // return isApplied&&record.courseType === '内训' ? (

        // ) : record.lastPlaces === 0 && record.places ? (
        //   <Alert message="人数已满，无法报名" type="warning" showIcon></Alert>
        // ) : (
        //   <Popconfirm
        //     onConfirm={this.handleConfirm.bind(this, record)}
        //     title="请确认报名"
        //   >
        //     <Button>报名</Button>
        //   </Popconfirm>
        // )
      }
    ];
    return (
      <div className="course_resources">
        <Spin spinning={this.state.loading}>
          <div style={{ width: '100%', height: '100vh' }}>
            <TableData
              resid="615983242584"
              wrappedComponentRef={element => (this.tableDataRef = element)}
              refTargetComponentName="TableData"
              subtractH={240}
              hasAdd={false}
              hasModify={false}
              hasDelete={false}
              hasRowEdit={false}
              hasRowModify={false}
              hasRowView={false}
              hasRowDelete={false}
              customRowBtns={btns}
              actionBarWidth={150}
            />
          </div>
        </Spin>
      </div>
    );
  }
}

export default CourseResources;
