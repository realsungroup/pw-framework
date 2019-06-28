import React from 'react';
import { Modal, Progress, List, message, Icon, Button, Tag, Divider } from 'antd';
import http from 'Util20/api';

const iconStyle = {
    display: 'flex',
    alignItems: 'center' /*垂直居中*/,
    justifyContent: 'center' /*水平居中*/
};
class ApplyProgress extends React.Component {
    state = {

    }
    render() {
        let {  finishedCount, percent, taskList,allCount } = this.props;
        console.log(this.props)
        return (
            <div>
                <div style={{ padding: 10, width: '50%', margin: '0 auto' }}>
                    <Progress percent={percent} />
                    {/* <div style={{ marginTop: 5, textAlign: 'center' }}>
                        {finishedCount} / {allCount}
                    </div> */}
                </div>
                <List
                    dataSource={taskList}
                    style={{ overflow: 'scroll', maxHeight: '50vh' }}
                    renderItem={item => (
                        <List.Item>
                            <div
                                style={{
                                    display: 'flex',
                                    width: '100%'
                                }}
                            >
                                <div style={{ flex: 1 }}>{item.FisYear}</div>
                                <div style={{ flex: 1 }}>{item.CourseName}</div>
                                {item.success ? null : (
                                    <Tag
                                        style={{
                                            flex: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        color="red"
                                        title={item.errorMessage}
                                    >
                                        {item.errorMessage}
                                    </Tag>
                                )}
                                {item.success? (
                                    <Icon
                                        type="check-circle"
                                        theme="twoTone"
                                        style={iconStyle}
                                        title="任务成功"
                                        twoToneColor="#52c41a"
                                    />
                                ) : (
                                        <Icon
                                            type="close-circle"
                                            theme="twoTone"
                                            twoToneColor="red"
                                            style={iconStyle}
                                            title={item.errorMessage}
                                        />
                                    )}
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}
export default ApplyProgress;
