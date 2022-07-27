import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
class HolidayBalanceQuery extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = () => { };
    render() {
        return (
            <div style={{ width: '100vw', height: '100vh', background: '#fff' }}>
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="调休假余额" key="1">
                        <p style={{ marginLeft: '20px' }}>每年定期清理调休假的时间点:8/31和2/28,请合理使用调休假</p>
                        <TableData
                            resid={671299372057}
                            actionBarWidth={200}
                            style={{ height: 'calc(100vh - 100px)' }}
                            hasAdd={false}
                            hasBeBtns={false}
                            hasModify={false}
                            hasBackBtn={false}
                            hasDelete={false}
                            hasRowModify={false}
                            hasRowView={true}
                            hasRowDelete={false}
                            baseURL={'http://WUX-HR03:801/'}
                            downloadBaseURL={'http://WUX-HR03:800/'}
                            subtractH={200}
                        />
                    </TabPane>
                    <TabPane tab="年假余额" key="2">
                        <TableData
                            resid={674654001482}
                            actionBarWidth={200}
                            style={{ height: 'calc(100vh - 60px)' }}
                            hasAdd={false}
                            hasBeBtns={false}
                            hasModify={false}
                            hasBackBtn={false}
                            hasDelete={false}
                            hasRowModify={false}
                            hasRowView={true}
                            hasRowDelete={false}
                            baseURL={'http://WUX-HR03:801/'}
                            downloadBaseURL={'http://WUX-HR03:800/'}
                            subtractH={200}
                        />
                    </TabPane>
                </Tabs>

            </div>
        );
    }
}

export default HolidayBalanceQuery;
