import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Button, Tabs } from 'antd';

const { TabPane } = Tabs;

class MoveAuthorityManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = () => {

    };

    getAttendenceData = () => {
        console.log('同步考勤记录');
        this.tableDataRef.handleRefresh();
    }

    getMoveData = () => {
        console.log('同步进出记录');
        this.tableDataRef.handleRefresh();
    }

    render() {
        const { } = this.state;
        return (
            <div style={{ width: '100vw', height: '100vh', background: '#fff' }}>
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="考勤记录" key="1" style={{ height: 'calc(100vh - 80px)' }}>
                        <TableData
                            resid={664295226124}
                            hasBeBtns={false}
                            hasRowSelection={false}
                            hasAdd={false}
                            hasDelete={false}
                            hasModify={false}
                            hasRowDelete={false}
                            hasRowModify={false}
                            hasRowView={true}
                            subtractH={180}
                            wrappedComponentRef={element => (this.tableDataRef = element)}
                            refTargetComponentName="TableData"
                            actionBarExtra={() => {
                                return (
                                    <Button
                                        type="primary"
                                        onClick={this.getAttendenceData}
                                    >
                                        同步考勤记录
                                    </Button>
                                );
                            }}
                        />
                    </TabPane>
                    <TabPane tab="进出记录" key="2" style={{ height: 'calc(100vh - 80px)' }}>
                        <TableData
                            resid={664295226124}
                            hasBeBtns={false}
                            hasRowSelection={false}
                            hasAdd={false}
                            hasDelete={false}
                            hasModify={false}
                            hasRowDelete={false}
                            hasRowModify={false}
                            hasRowView={true}
                            subtractH={180}
                            wrappedComponentRef={element => (this.tableDataRef = element)}
                            refTargetComponentName="TableData"
                            actionBarExtra={() => {
                                return (
                                    <Button
                                        type="primary"
                                        onClick={this.getMoveData}
                                    >
                                        同步进出记录
                                    </Button>
                                );
                            }}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default MoveAuthorityManagement;
