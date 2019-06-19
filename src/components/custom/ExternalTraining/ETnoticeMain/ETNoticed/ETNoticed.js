import React from 'react';
import { Skeleton, Switch, Card, Icon, Avatar, Radio, Spin, Button, Progress, Tabs, Modal, Popconfirm, message } from 'antd';
import './ETNoticed.less';
import http from 'Util20/api';


class ETNoticed extends React.Component {
    count = 0

    constructor(props) {
        super(props)
    }
    state = {
        isNotice: 0,
        modalVisible: false,
        courseArrangment: [],
        courseIsApply: [], //已经通知过的课程
        courseNotApply: [], //未通知过的课程
        currentCourse: {}, //当前点击的课程
        currentCourseAllPeople: [], //当前选中课程的所有人
        peopleIsApply: [],  //当前选中课程已通知的人
        peopleNotApply: [], //当前选中课程没通知的人
        peopleForNotApply: [], //当前选中课程通知失败的人
        percent: 0,
        loading:false
    }
    componentWillMount = () => {
        this.setState({
            isNotice: this.props.isNotice
        })
    }
    componentDidMount = () => {
        this.setState({ loading: true });
        this.getCourseArrangment()
    }
    handleOk = e => {
        this.setState({
            modalVisible: false,
            currentCourseAllPeople: [],
            peopleForNotApply: [],
            peopleNotApply: [],
            peopleIsApply: [],
            percent: 0,
            currentCourse: {}
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
            currentCourse: {}
        });
    };

    getCourseArrangment = async () => {
        let res;
        try {
            res = await http().getTable({
                resid: '613959525708'
            });
        } catch (error) {
            return console.log(error);
        }
        if (res.error === 0) {
            let courseArrangment = res.data;
            let courseIsApply = []
            let courseNotApply = []
            courseArrangment.forEach((item) => {
                if (item.C3_614256491795 == 'Y') {
                    courseIsApply.push(item)
                } else {
                    courseNotApply.push(item)
                }
            })
            this.setState({ courseArrangment, courseIsApply, courseNotApply ,loading:false});
        }
    };
    getCurrentCourseIsApply = async (e) => {
        this.setState({
            currentCourse: e
        })
        let res;
        try {
            res = await http().getTable({
                resid: '613959487818',
                cmswhere: `C3_614182469763='${e.CourseID}' and C3_613941384328='${e.FisYear}'`
            });
        } catch (error) {
            return console.log(error);
        }
        if (res.error === 0) {
            let currentCourseAllPeople = res.data;
            let peopleIsApply = []
            let peopleNotApply = []
            currentCourseAllPeople.forEach(element => {
                if (element.C3_613960304536 == 'Y') {
                    peopleIsApply.push(element)
                } else {
                    peopleNotApply.push(element)
                }
            })
            console.log(currentCourseAllPeople, peopleIsApply, peopleNotApply)
            this.setState({
                currentCourseAllPeople,
                peopleIsApply,
                peopleNotApply,
                percent: Math.floor((peopleIsApply.length / currentCourseAllPeople.length) * 100)
            });

            if (peopleNotApply.length) {
                this.modifyCurrentCourseIsApply()
            }
        }
    }
    async  modifyCurrentCourseIsApply() {
        // let peopleNotApply = [...this.state.peopleNotApply]
        let peopleForNotApply = [...this.state.peopleForNotApply]
        let peopleIsApply = [...this.state.peopleIsApply]
        let res = {
            Error: -1
        };
        // console.log(this.state.peopleNotApply[this.count])
        // console.log(this.state.peopleNotApply)
        // console.log(this.count)
        try {
            res = await http().modifyRecords({
                resid: '613959487818',
                data: [{
                    REC_ID: this.state.peopleNotApply[this.count].REC_ID,
                    C3_613960304536: 'Y'
                }]
            })
        } catch (error) {
            console.error(error)
        }
        console.log(res.Error)
        if (res.Error == 0) {
            peopleIsApply.push(this.state.peopleNotApply[this.count])
            this.setState({ peopleIsApply })
            console.log('已经通知的人', peopleIsApply)
            this.setState({
                percent: Math.floor((peopleIsApply.length / this.state.currentCourseAllPeople.length) * 100)
            })
        } else {
            peopleForNotApply.push(this.state.peopleNotApply[this.count])
            this.setState({
                peopleForNotApply
            })
        }
        this.count++
        if (this.count == this.state.peopleNotApply.length) {
            this.count = 0
            if (peopleIsApply.length == this.state.currentCourseAllPeople.length) {
                let resm
                try {
                    resm = await http().modifyRecords({
                        resid: '613959525708',
                        data: [{
                            REC_ID: this.state.currentCourse.REC_ID,
                            C3_614256491795: 'Y'
                        }]
                    })
                } catch (error) {
                    console.error(error)
                }
                if (resm.Error != 0) {
                    message.error(resm.message)
                }
            }
        } else {
            this.modifyCurrentCourseIsApply()
        }
    }
    render() {
        return (
            <Spin  spinning={this.state.loading}>
                <div className='card'>
                    {
                        (this.props.isNotice ? this.state.courseIsApply : this.state.courseNotApply).map((item, i) => {
                            return (
                                <div className='card_pad'>
                                    <Card
                                        title={item.CourseName}
                                        extra={
                                            this.state.isNotice ?
                                                (
                                                    <Icon
                                                        type="bell"
                                                        theme='filled'
                                                        style={{fontSize:20}}
                                                    // onClick={
                                                    //     () => {
                                                    //         this.setState({ modalVisible: true })
                                                    //     }
                                                    // }
                                                    />
                                                ) : (
                                                    <Popconfirm
                                                        title="是否立即开始通知?"
                                                        onConfirm={() => {
                                                            this.getCurrentCourseIsApply(item)
                                                            this.setState({ modalVisible: true })
                                                        }}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <Icon
                                                            type="bell"
                                                            theme='outlined'
                                                            style={{fontSize:20}}
                                                        />
                                                    </Popconfirm>
                                                )
                                        }

                                        key={i}
                                    >
                                        <div className='card_container'>
                                            <div className='card_item'>主讲人:{item.Teacher}</div>
                                            <div className='card_item'>课程报名人数:{item.Attendees}</div>
                                            <div className='card_item'>地点:{item.CourseLocation}</div>
                                            <div className='card_item'>时间:{item.StartDatetime}</div>
                                        </div>
                                    </Card>
                                </div>
                            )
                        })
                    }
                    <Modal
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
                                <div style={{ display: 'flex',alignItems: 'center', flexDirection: 'column' }}>
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
                    </Modal>
                </div>
            </Spin>
        )
    }
}
export default ETNoticed;