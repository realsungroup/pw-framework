import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import { Button } from 'antd';

class DeviceManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = () => {

    };

    getDeviceInfo = () => {

        console.log('同步设备信息');
        this.tableDataRef.handleRefresh();
    }

    render() {
        const { } = this.state;
        return (
            <div style={{ width: '100vw', height: '100vh', background: '#fff' }}>
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
                    style={{ height: '100%' }}
                    subtractH={200}
                    wrappedComponentRef={element => (this.tableDataRef = element)}
                    refTargetComponentName="TableData"
                    actionBarExtra={() => {
                        return (
                            <Button
                                type="primary"
                                onClick={this.getDeviceInfo}
                            >
                                同步设备信息
                            </Button>
                        );
                    }}
                />
            </div>
        );
    }
}

export default DeviceManagement;
