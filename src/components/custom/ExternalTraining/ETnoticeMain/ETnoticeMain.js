import React from 'react';
import ETNoticed from './ETNoticed'
import { Input, Tabs, Button, DatePicker, Checkbox, Modal, message, notification, Icon } from 'antd';
import './ETnoticeMain.less';
import http from 'Util20/api';


const Search = Input.Search;
class ETnoticeMain extends React.Component {
    state = {
        key: 0, //当前是哪个tab页
        courseArrangment: [],
        courseIsApply: [], //已经通知过的课程
        courseNotApply: [], //未通知过的课程
        loading: false,
        searchText: '',
        isShowModal: false
    }
    componentDidMount = () => {
        this.setState({ loading: true })
        this.getCourseArrangment()
    }
    getCourseArrangment = async () => {
        let res;
        let normalData = {
            resid: '613959525708',
        }
        try {
            res = await http().getTable(normalData);
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
            this.setState({ courseArrangment, courseIsApply, courseNotApply, loading: false });
        }
    };
    getCourseForTab = async (e) => {
        let res;
        try {
            res = await http().getTable({
                resid: '613959525708',
                cmswhere: this.state.key ? "C3_614256491795 = 'Y'" : `C3_614256491795 IS NULL `,
                key: e
            });
        } catch (error) {
            return console.log(error);
        }
        if (res.error === 0) {
            let courseIsApply = []
            let courseNotApply = []
            if (this.state.key) {
                courseIsApply = res.data
                this.setState({
                    courseIsApply
                })
            } else {
                courseNotApply = res.data
                this.setState({
                    courseNotApply
                })
            }
            this.setState({ loading: false });
        }
    }
    tabsChange = (e) => {
        console.log(e)
        this.setState({ key: e })
    }

    startRunAutoApply = async () => {//开始进行全部通知任务
        let id = 613848452461
        let res;
        try {
            res = await http().runAutoImport({
                id
            });
        } catch (err) {
            console.error(err);
            message.error('正在通知，请耐心等候');
        }
    }
    getTaskInfo = async () => {//查看任务进度
        let res = {
            error: -1
        };
        try {
            res = await http().getAutoImportStatus();
        } catch (err) {
            message.error(err.message);
        }
        if (res.error !== 0) {
            setTimeout(async () => {
                await this.getTaskInfo()
            }, 1000)
            message.error(res.message);
        } else {
            notification.open({
                message: '通知',
                description: '人员通知完毕！',
                icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                duration: null
            });
        }
    }
    handleOk = e => {
        this.setState({
            isShowModal: false,
        });
    };

    handleCancel = e => {
        this.setState({
            isShowModal: false,
        });
    };
    onCurrentCourseIsApply(e, i) {
        console.log(e, i)
        let courseIsApply = [...this.courseIsApply]
        let courseNotApply = [...this.courseNotApply]
        courseIsApply.splice(i, 1)
        courseNotApply.push(e)
    }
    render() {
        const { TabPane } = Tabs;
        return (
            <div className='et_main'>
                <Tabs
                    defaultActiveKey={this.state.key}
                    onChange={this.tabsChange}
                    tabBarExtraContent={
                        <div>
                            {/* <Checkbox>全选</Checkbox> */}
                            {
                                !this.state.key ?
                                    <Button
                                        style={{ marginRight: 10 }}
                                        onClick={() => {
                                            this.setState({
                                                isShowModal: true
                                            })
                                        }}
                                    >全部通知</Button>
                                    : null
                            }
                            <DatePicker.RangePicker style={{ marginRight: 10 }} onChange={() => {

                            }} />
                            <Search
                                placeholder="搜索"
                                onSearch={value => this.setState({
                                    loading: true
                                }, () => this.getCourseForTab(value))}
                                style={{ width: 200, marginRight: 10 }}
                            />
                        </div>
                    }>
                    <TabPane tab="未通知" key={0}>
                        <ETNoticed infor={this.state} currentCourseIsApply={this.onCurrentCourseIsApply} isNotice={0} />
                    </TabPane>
                    <TabPane tab="已通知" key={1}>
                        <ETNoticed infor={this.state} isNotice={1} />
                    </TabPane>

                </Tabs>
                <Modal
                    title="通知"
                    visible={this.state.isShowModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >


                </Modal>
            </div>
        )
    }
}
export default ETnoticeMain;