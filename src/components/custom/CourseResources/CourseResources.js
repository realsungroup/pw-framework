import React, { Component } from 'react';
import './CourseResources.less';
import { TableData } from '../../common/loadableCommon';
import { Button, Popconfirm, message, Alert } from 'antd';
import http from 'Util20/api';
import { getItem } from 'Util20/util';

class CourseResources extends Component {
  state = {
    userInfo: JSON.parse(getItem('userInfo')).UserInfo,
    appliedCourses: []
  };

  componentDidMount = () => {
    this.getAppliedCourses();
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
      console.log(res.data);
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
    console.log(record);
    let usercode = parseInt(this.state.userInfo.EMP_USERCODE);
    try {
      await http().addRecords({
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
        appliedCourses: [...this.state.appliedCourses, { ...record }]
      });
    } catch (error) {
      message.error(error.message);
      console.log(error.message);
    }
  };

  //取消报名
  handleCancelAppply = async record => {
    let course = this.state.appliedCourses.find(item => {
      return item.CourseArrangeID === record.CourseArrangeID;
    }); //取消报名的课
    let appliedCourses = [...this.state.appliedCourses];
    console.log(appliedCourses);
    try {
      await http().removeRecords({
        resid: '615983369834',
        data: [course]
      });
      message.success('取消报名成功');
      appliedCourses.splice(
        appliedCourses.findIndex(item => {
          return item.CourseArrangeID === record.CourseArrangeID;
        }),
        1
      );
      // let courses = 
      await this.getAppliedCourses();
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
        if(isApplied&&record.classType === '内训'){
          return ( <Popconfirm
            title="是否撤回报名申请？"
            onConfirm={this.handleCancelAppply.bind(this, record)}
          >
            <Button type="danger">撤回报名申请</Button>
          </Popconfirm>)
        }else if(record.lastPlaces === 0 && record.places){
          return (
            <Alert message="人数已满，无法报名" type="info" showIcon></Alert>
          )
        }else if(record.isStopApply !== 'Y' && record.classType === '内训'){
          if(record.needSheet=='Y'){
            return (
              <Button onClick={async()=>{
                console.log(record)
                let res;
                // 获取工号
                var staffNum=localStorage.getItem('userInfo');

                staffNum=JSON.parse(staffNum);
                staffNum=staffNum.UserCode;
                try {
                  await http().addRecords({
                    resid: '609613163948',
                    data: [{
                      // 问卷编号
                      query_id:record.sheetId,
                      // 人员工号
                      staff_number:staffNum,
                      sheetType:'DO_NOT_SEND_MAIL',
                    }]
                  });
                  }catch(e){
                    console.log(e)
                  }
                // 跳转问卷
                window.open(window.location.origin+'?resid=我的问卷&recid=609335337024&type=前端功能入口&title=我的问卷&id='+record.sheetId+'&courseId='+record.CourseArrangeID)
              }}>填写问卷并报名</Button>
            )
          }else{
            return (
              <Popconfirm
              onConfirm={this.handleConfirm.bind(this, record)}
              title="是否提交报名申请"
            >
              <Button>提交报名申请</Button>
            </Popconfirm>
            )
          }
          
        }else if(record.isStopApply === 'Y' && record.classType === '内训'){
          return (
            <Alert message="报名已截止" type="info" showIcon></Alert>
          )
        }
        else{
          return (
            <Alert message="外训不可报名" type="warning" showIcon></Alert>
          )
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
    );
  }
}

export default CourseResources;
