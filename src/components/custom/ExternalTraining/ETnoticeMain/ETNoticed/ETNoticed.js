import React from 'react';
import {
  Card,
  Icon,
  Spin,
  Button,
  Progress,
  Modal,
  Popconfirm,
  message,
  Checkbox,
  Empty
} from 'antd';
import './ETNoticed.less';
import http from 'Util20/api';

class ETNoticed extends React.Component {
  count = 0;
  state = {
    modalVisible: false,
    currentCourse: {}, //当前点击的课程
    currentCourseIndex: Number, //当前点击的课程在courseNotApply的index
    currentCourseAllPeople: [], //当前选中课程的所有人
    peopleIsApply: [], //当前选中课程已通知的人
    peopleNotApply: [], //当前选中F课程没通知的人
    peopleForNotApply: [], //当前选中课程通知失败的人
    percent: 0
  };
  constructor(props) {
    super(props);
  }
  componentWillMount = () => {};
  componentDidMount = () => {
    this.setState({
      isNotice: this.props.isNotice
    });
  };
  handleOk = e => {
    this.setState({
      modalVisible: false,
      currentCourseAllPeople: [],
      peopleForNotApply: [],
      peopleNotApply: [],
      peopleIsApply: [],
      percent: 0,
      currentCourse: {},
      currentCourseIndex: Number
    });
  };

  handleCancel = e => {
    this.setState({
      modalVisible: false,
      currentCourseAllPeople: [],
      peopleIsApply: [],
      peopleNotApply: [],
      peopleForNotApply: [],
      percent: 0,
      currentCourse: {},
      currentCourseIndex: Number
    });
  };

  // getCurrentCourseIsApply = async (e, i) => {
  //     this.setState({
  //         currentCourse: e,
  //         currentCourseIndex: i
  //     })
  //     // return
  //     let res;
  //     try {
  //         res = await http().getTable({
  //             resid: '613959487818',
  //             cmswhere: `C3_614182469763='${e.CourseID}' and C3_613941384328='${e.FisYear}'`
  //         });
  //     } catch (error) {
  //         return console.log(error);
  //     }
  //     if (res.error === 0) {
  //         let currentCourseAllPeople = res.data;
  //         if (!currentCourseAllPeople.length) {
  //             message.error('所选课程没有需要通知的人')
  //             this.setState({
  //                 currentCourse: {},
  //                 currentCourseIndex: Number
  //             })
  //             return
  //         }
  //         this.setState({ modalVisible: true })
  //         let peopleIsApply = []
  //         let peopleNotApply = []
  //         currentCourseAllPeople.forEach(element => {
  //             if (element.C3_613960304536 == 'Y') {
  //                 peopleIsApply.push(element)
  //             } else {
  //                 peopleNotApply.push(element)
  //             }
  //         })
  //         console.log(currentCourseAllPeople, peopleIsApply, peopleNotApply)
  //         this.setState({
  //             currentCourseAllPeople,
  //             peopleIsApply,
  //             peopleNotApply,
  //             percent: Math.floor((peopleIsApply.length / currentCourseAllPeople.length) * 100)
  //         });

  //         if (peopleNotApply.length) {
  //             this.modifyCurrentCourseIsApply()
  //         }
  //     }
  // }
  // async  modifyCurrentCourseIsApply() {
  //     // let peopleNotApply = [...this.state.peopleNotApply]
  //     let peopleForNotApply = [...this.state.peopleForNotApply]
  //     let peopleIsApply = [...this.state.peopleIsApply]
  //     let res = {
  //         Error: -1
  //     };
  //     // console.log(this.state.peopleNotApply[this.count])
  //     // console.log(this.state.peopleNotApply)
  //     // console.log(this.count)
  //     try {
  //         res = await http().modifyRecords({
  //             resid: '613959487818',
  //             data: [{
  //                 REC_ID: this.state.peopleNotApply[this.count].REC_ID,
  //                 C3_613960304536: 'Y'
  //             }]
  //         })
  //     } catch (error) {
  //         console.error(error)
  //     }
  //     console.log(res.Error)
  //     if (res.Error == 0) {
  //         peopleIsApply.push(this.state.peopleNotApply[this.count])
  //         this.setState({ peopleIsApply })
  //         console.log('已经通知的人', peopleIsApply)
  //         this.setState({
  //             percent: Math.floor((peopleIsApply.length / this.state.currentCourseAllPeople.length) * 100)
  //         })
  //     } else {
  //         peopleForNotApply.push(this.state.peopleNotApply[this.count])
  //         this.setState({
  //             peopleForNotApply
  //         })
  //     }
  //     this.count++
  //     if (this.count == this.state.peopleNotApply.length) {
  //         this.count = 0
  //         if (peopleIsApply.length == this.state.currentCourseAllPeople.length) {
  //             let resm
  //             try {
  //                 resm = await http().modifyRecords({
  //                     resid: '613959525708',
  //                     data: [{
  //                         REC_ID: this.state.currentCourse.REC_ID,
  //                         C3_614256491795: 'Y'
  //                     }]
  //                 })
  //             } catch (error) {
  //                 console.error(error)
  //             }

  //             if (resm.Error === 0) {
  //                 this.handleCurrentCourseIsApply(this.state.currentCourse, this.state.currentCourseIndex)
  //             } else {
  //                 message.error(resm.message)

  //             }
  //         }
  //     } else {
  //         this.modifyCurrentCourseIsApply()
  //     }
  // }
  // handleCurrentCourseIsApply(e, i) {
  //     this.props.currentCourseIsApply(e, i)
  // }
  handleCurrentCoursePeopleAllApply(e) {
    this.props.currentCoursePeopleAllApply(e);
  }
openDown=(item)=>{
  console.log('item',item)
  Modal.info({
    title:'查看上课通知邮件的附件',
    content:(
      <div>
      {item.courseAccessory?<a href={item.courseAccessory} target='_blank' style={{display:'block',margin:'8px 0'}}>附件1</a>:null}
      {item.hotelStrategy?<a href={item.hotelStrategy} target='_blank' style={{display:'block',margin:'8px 0'}}>附件2</a>:null}
      {item.otherFile1?<a href={item.otherFile1} target='_blank' style={{display:'block',margin:'8px 0'}}>附件3</a>:null}
      {item.otherFile2?<a href={item.otherFile2} target='_blank' style={{display:'block',margin:'8px 0'}}>附件4</a>:null}
      </div>
      
    ),
    okText:'关闭'
  })
}
  // 提醒培训机构上传附件
  alertUpload=async(v,a)=>{
    let res;
    try{
      res = http().modifyRecords({
        resid: 613959525708,
        data: [{
          REC_ID:v.REC_ID,
          noticeTrainingSubmit:'Y'
        }]
      });
      message.success('提醒成功')
      this.props.getCourseArrangment();
      console.log(res)
    }catch(e){
      message.error(e)
    }
    console.log(v)
  }
// 开课通知二次提醒
  alertTwice=(item,bol)=>{
    if(bol){
      this.handleCurrentCoursePeopleAllApply(item);

    }else{
      Modal.confirm({
        title:'提醒确认',
        content:'培训机构还未上传附件，确认通知学员上课么？',
        onOk:()=>this.handleCurrentCoursePeopleAllApply(item)

      })
    }

  }
  // 事后提醒
  alterAfter=async()=>{

  }
  render() {
    return (
      <Spin spinning={this.props.infor.loading} style={{ height: '70vh' }}>
        {/* <Checkbox.Group style={{ width: '100%' }}> */}
        <div className="card">
          {(this.props.isNotice
            ? this.props.infor.courseIsApply
            : this.props.infor.courseNotApply
          ).length ? (
            (this.props.isNotice
              ? this.props.infor.courseIsApply
              : this.props.infor.courseNotApply
            ).map((item, i) => {
              return (
                <div className="card_pad">
                  <Card
                    title={
                      !this.props.isNotice
                        ? // <Checkbox>{item.CourseName}</Checkbox>
                          item.CourseName
                        : item.CourseName
                    }
                    extra={
                      <div>
                        {item.C3_627068359533=='Y'?(<Icon type="download" onClick={()=>{this.openDown(item)}} style={{marginRight:'8px',fontSize:'20px',cursor:'pointer'}}/>):null}
                        
                        {
                          item.noticeTrainingSubmit?null:(
                            <Popconfirm
                            trigger='hover'
                          title="是否提醒培训机构上传开课通知附件?"
                          style={{cursor:'pointer'}}
                          onConfirm={() => {
                            this.alertUpload(item);
                          }}
                        >
                          <Icon
                            type="alert"
                            theme="outlined"
                            style={{ fontSize: 20  ,marginRight:'8px',cursor:'pointer'}}
                          />
                          </Popconfirm>)
                        }
                        
                      {this.props.isNotice ? null : (
                        <Popconfirm
                          title="是否立即开始通知?"
                          trigger='hover'
                          style={{cursor:'pointer'}}
                          onConfirm={() => {
                            this.alertTwice(item,item.C3_627068359533?true:false);
                          }}
                        >
                          
                          <Icon
                            type="bell"
                            theme="outlined"
                            style={{ fontSize: 20,cursor:'pointer'}}
                          />
                        </Popconfirm>
                      )}
                      </div>
                    }
                    key={i}
                  >
                    <div className="card_container">
                      <div className="card_item">主讲人:{item.Teacher}</div>
                      <div className="card_item">
                        课程报名人数:{item.Attendees}
                      </div>
                      <div className="card_item">
                        地点:{item.CourseLocation}
                      </div>
                      <div className="card_item">时间:{item.StartDatetime}</div>
                    </div>
                  </Card>
                </div>
              );
            })
          ) : (
            <Empty
              style={{ margin: '0 auto' }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
          {/* <Modal
                            title="通知"
                            visible={this.state.modalVisible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center' }} >
                                <Progress style={{ width: 250 }} percent={this.state.percent} />
                            </div>
                            {
                                this.state.peopleForNotApply.length ? (
                                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: 10, marginBottom: 10 }} >
                                            {
                                                this.state.peopleForNotApply.map((item) => {
                                                    return (
                                                        < div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 100, margin: '5' }}>
                                                            {item.C3_613941385305}
                                                            <Icon type="close-circle" style={{ color: 'red' }} />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        {
                                            (
                                                this.state.peopleForNotApply.length ||
                                                this.state.peopleNotApply.length
                                            ) +
                                                this.state.peopleIsApply.length ==
                                                this.state.currentCourseAllPeople.length ? (
                                                    < Button onClick={() => {
                                                        this.setState({
                                                            peopleNotApply: [...this.state.peopleForNotApply],
                                                            peopleForNotApply: []
                                                        }, () => {
                                                            this.modifyCurrentCourseIsApply()
                                                        })
                                                    }}> 继续通知</Button>
                                                ) : (null)
                                        }
                                    </div>
                                ) : (null)
                            }
                        </Modal> */}
        </div>
        {/* </Checkbox.Group> */}
      </Spin>
    );
  }
}
export default ETNoticed;
