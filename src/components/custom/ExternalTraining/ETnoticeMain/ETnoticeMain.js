import React from 'react';
import ETNoticed from './ETNoticed'
import { Input, Tabs, Button, DatePicker, Checkbox, Select, Modal, message, notification, Icon, Popconfirm } from 'antd';
import './ETnoticeMain.less';
import http from 'Util20/api';
import ApplyProgress from './ApplyProgress';
import moment from 'moment';




const Search = Input.Search;
const Option = Select
const courseArrangmentResid = '613959525708'; //课程安排表id
class ETnoticeMain extends React.Component {
    state = {
        key: '0', //当前是哪个tab页
        courseArrangment: [],
        courseIsApply: [], //已经通知过的课程
        courseNotApply: [], //未通知过的课程
        loading: false,
        searchText: '',
        isShowModal: false,
        searchTime: ['', ''],
        showTime: [null, null],
        selectTimeDefault: 'all',
        finishedCount: 0,  //任务已完成的数量
        allCount: Number,  //总任务的数量
        percent: 0,
        taskList: [], //任务已完成的列表
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
    getCourseForTab = async () => {
        this.onUnionSearch()
    }
    tabsChange = (e) => {
        console.log(e)
        this.setState({ key: e, searchText: '', searchTime: ['', ''], showTime: [null, null], selectTimeDefault: 'all' })
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
    onCurrentCourseIsApply = (e, i) => {
        console.log(e, i)
        let courseIsApply = this.state.courseIsApply
        let courseNotApply = this.state.courseNotApply
        courseIsApply.push(e)
        courseNotApply.splice(i, 1)
        this.setState({ courseIsApply, courseNotApply })
    }
    onOk = async () => {
        this.onUnionSearch()
    };
    onRangeSearchChange = (value, dateString) => {
        this.setState({
            selectTimeDefault: 'all'
        })
        let showTime = value.length ? value : [null, null]
        this.setState({ showTime })
        console.log('Selected Time: ', value);
        if (value.length) {
            this.setState({
                searchTime: dateString,
            })
        }
        else {
            this.setState({
                searchTime: ['', ''],
            })
            if (!this.state.searchText) {
                this.getCourseArrangment()
            } else {
                this.onUnionSearch()
            }
        }
        console.log('Formatted Selected Time: ', dateString);
    };
    setPeriodBySelect = e => {
        let { setPeriodBySelect } = this.state
        let searchTime = [], formatString = 'YYYY-MM-DD HH:mm:ss';
        switch (e) {
            case 'all':
                searchTime = ['', ''];
                setPeriodBySelect = 'all'
                break;
            case 'week':
                searchTime = [moment().format(formatString), moment().add(1, 'w').format(formatString)]
                setPeriodBySelect = 'week'
                break;
            case 'weeks':
                searchTime = [moment().format(formatString), moment().add(2, 'w').format(formatString)]
                setPeriodBySelect = 'weeks'
                break;
            case 'month':
                searchTime = [moment().format(formatString), moment().add(1, 'M').format(formatString)]
                setPeriodBySelect = 'month'
                break;
            case 'months':
                searchTime = [moment().format(formatString), moment().add(2, 'M').format(formatString)]
                setPeriodBySelect = 'months'
                break;
            default:
                break;
        }
        this.setState({ searchTime, setPeriodBySelect }, this.onUnionSearch)
    };
    onUnionSearch = async () => {
        let res,
            { searchTime, searchText } = this.state;
        let isHasPeriod = searchTime[0] && searchTime[1];
        try {
            res = await http().getTable({
                resid: courseArrangmentResid,
                key: searchText,
                cmswhere: ` ${this.state.key === '1' ? "C3_614256491795 = 'Y'" : 'C3_614256491795 IS NULL'}
                 ${isHasPeriod
                        ? ` and StartDatetime > '${searchTime[0]}'  and StartDatetime< '${searchTime[1]}'` : ''}`
            });
            let courseIsApply = []
            let courseNotApply = []
            if (this.state.key === '1') {
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
        } catch (error) {
            console.log(error)
        }
        this.setState({
            loading: false
        })
    }
    setAllApply = async (e) => {
        console.log(e)
        let { finishedCount, allCount, percent, taskList, courseNotApply, courseIsApply } = this.state
        if (e) {
            courseNotApply = [e]
            allCount = 1
        }
        if (!courseNotApply.length) {
            message.error('没有课程需要通知！')
            return
        }
        allCount = courseNotApply.length
        this.setState({
            isShowModal: true
        })
        console.log(courseNotApply)
        for (let item of courseNotApply) {
            let res = { Error: -1 };
            try {
                res = await http().modifyRecords({
                    resid: '613959525708',
                    data: [{
                        REC_ID: item.REC_ID,
                        C3_614256491795: 'Y'
                    }]
                });
            } catch (err) {
                console.log(1)
                item.success = false;
                item.errorMessage = err.message;
            }
            finishedCount++
            percent = Math.floor((finishedCount / courseNotApply.length) * 100);
            if (res.Error === 0) {
                item.success = true;
                item.errorMessage = '';
            }
            taskList.push(item)
            console.log(item)
            this.setState({
                finishedCount,
                percent,
                taskList,
                allCount
            })
        }
    }
    onCurrentCoursePeopleAllApply = async (e) => {
        this.setAllApply(e)
    }
    render() {
        const { TabPane } = Tabs;
        return (
            <div className='et_main'>
                <Tabs
                    defaultActiveKey={this.state.key}
                    onChange={this.tabsChange}
                    style={{
                        flex: 1,
                        width: '100%',
                        height: '100%'
                    }}
                    tabBarExtraContent={
                        <div>
                            {/* <Checkbox>全选</Checkbox> */}
                            {
                                this.state.key !== '1' ?
                                    <Popconfirm
                                        title="确认全部通知?"
                                        onConfirm={() =>
                                            this.setAllApply(false)
                                        }
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <a
                                            style={{ marginRight: 10 }}
                                            href='#'
                                        >全部通知</a>
                                    </Popconfirm>
                                    : null
                            }
                            <Select
                                defaultValue='all'
                                value={this.state.selectTimeDefault}
                                style={{ width: 100, marginRight: 10 }}
                                onChange={e => this.setState({ selectTimeDefault: e, showTime: [null, null] }, () => this.setPeriodBySelect(e))
                                }
                            >
                                <Option value='all'>全部</Option>
                                <Option value='week'>一周内</Option>
                                <Option value='weeks'>两周内</Option>
                                <Option value='month'>一个月内</Option>
                                <Option value='months'>两个月内</Option>
                            </Select>
                            <DatePicker.RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                placeholder={['开始日期', '结束日期']}
                                style={{ marginRight: 10 }}
                                onOk={this.onOk}
                                value={this.state.showTime}
                                onChange={this.onRangeSearchChange}
                            />
                            <Search
                                placeholder="搜索"
                                value={this.state.searchText}
                                onChange={(e) => {
                                    this.setState({ searchText: e.target.value })
                                }}
                                onSearch={value => this.setState({
                                    loading: true
                                }, () => this.getCourseForTab(value))}
                                style={{ width: 200, marginRight: 10 }}
                            />
                        </div>
                    }>
                    <TabPane tab="未通知" key='0'>
                        <ETNoticed
                            infor={this.state}
                            currentCourseIsApply={this.onCurrentCourseIsApply}
                            currentCoursePeopleAllApply={this.onCurrentCoursePeopleAllApply}
                            isNotice={0}
                        />
                    </TabPane>
                    <TabPane
                        style={{
                            width: '100%',
                            height: '78vh'
                        }}
                        tab="已通知" key='1'>
                        <ETNoticed infor={this.state} isNotice={1} />
                    </TabPane>

                </Tabs>
                <Modal
                    title="全部通知"
                    visible={this.state.isShowModal}
                    closable={false}
                    keyboard={false}
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={
                        <Button
                            type="primary"
                            disabled={(this.state.finishedCount == this.state.allCount) ? false : true}
                            onClick={() =>
                                 this.setState({ 
                                     isShowModal: false,
                                     finishedCount:0,
                                     allCount:Number,
                                     taskList:[],
                                     percent:0,
                                     }, this.getCourseArrangment)}
                        >
                            完成
                        </Button>
                    }
                >
                    <ApplyProgress
                        finishedCount={this.state.finishedCount}
                        allCount={this.state.allCount}
                        percent={this.state.percent}
                        taskList={this.state.taskList}
                    />
                </Modal>
            </div>
        )
    }
}
export default ETnoticeMain;