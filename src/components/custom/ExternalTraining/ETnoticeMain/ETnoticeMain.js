import React from 'react';
import ETNoticed from './ETNoticed'
import { Skeleton, Switch, Card, Icon, Avatar, Radio, Tabs } from 'antd';
import './ETnoticeMain.less';

class ETnoticeMain extends React.Component {



    render() {
        const { TabPane } = Tabs;
        return (
            <div className='et_main'>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="未通知" key="1">
                        <ETNoticed isNotice={0}/>
                    </TabPane>
                    <TabPane tab="已通知" key="2">
                        <ETNoticed isNotice={1}/>
                    </TabPane>

                </Tabs>
            </div>
        )
    }
}
export default ETnoticeMain;