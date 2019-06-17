import React from 'react';
import { Modal, Progress, List, message, Icon, Button, Tag } from 'antd';
import http from '../../../util20/api';

const iconStyle = {
  display: 'flex',
  alignItems: 'center' /*垂直居中*/,
  justifyContent: 'center' /*水平居中*/
};

class PlanProgress extends React.Component {
  state = {
    visible: true,
    taskList: this.props.taskList,
    finishedCount: 0,
    percent: 0,
    isFinished: false
  };
  componentDidMount = async () => {
    let { taskList, finishedCount, percent } = this.state;
    let total = taskList.length;
    taskList.forEach(i=>{
      i.success =true;
    })
    await this.handleTasks(finishedCount, total, taskList, percent);
  };

  handleTasks = async (finishedCount, total, taskList, percent) => {
    // await taskList.forEach(async element => {
    //   let res;
    //   try {
    //     res = await http().addRecords({
    //       resid: '611315248461',
    //       data: [{element}],
    //       isEditOrAdd: true
    //     });
    //   } catch (error) {
    //     count++;
    //     return message.error(error.message);
    //   }
    //   let percent = 0;
    //   if (res.Error === 0) {
    //     finishedCount++;
    //     percent = Math.floor((finishedCount / total) * 100);
    //     element.success = true;
    //   } else {
    //     element.success = false;
    //   }
    //   count++;
    //   this.setState({
    //     finishedCount,
    //     percent,
    //     taskList,
    //     isFinished: count === total
    //   });
    // });
    for (let element of taskList) {
      let res = { Error: -1 };
      try {
        res = await http().addRecords({
          resid: '611315248461',
          data: [element],
          isEditOrAdd: true
        });
      } catch (error) {
        message.error(error.message);
      }
      finishedCount++;
      percent = Math.floor((finishedCount / total) * 100);
      if (res.Error === 0) {
        element.success = true;
        element.errorMessage =
          '错误信息错误信息错误信息错误信息错误信息错误信息';
      } else {
        element.success = false;
        element.errorMessage = res.message;
      }
      this.setState({
        finishedCount,
        percent,
        taskList,
        isFinished: finishedCount === total
      });
    }
  };

  render() {
    let { taskList, percent, finishedCount, isFinished } = this.state;
    let status = percent === 100 ? 'success' : 'active';
    if (percent < 100 && isFinished) {
      status = 'exception';
    }
    return (
      <Modal
        closable={false}
        visible={this.state.visible}
        centered={false}
        title="多选人员课程列表"
        bordered={true}
        mask={false}
        footer={
          <Button
            block={true}
            type="primary"
            disabled={!isFinished}
            onClick={this.props.handleShowProgress}
          >
            完成
          </Button>
        }
        style={{ top: 100, bottom: 20 }}
      >
        <div style={{ padding: 10, width: '50%', margin: '0 auto' }}>
          <Progress percent={percent} status={status} />
          <div style={{ marginTop: 5, textAlign: 'center' }}>
            {finishedCount} / {taskList.length}
          </div>
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
                <div style={{ flex: 1 }}>{item.C3_609622263470}</div>
                <div style={{ flex: 1 }}>{item.C3_609845305680}</div>
                {item.success ? null : (
                  <Tag
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    color="red"
                    title={item.errorMessage}
                  >
                    {item.errorMessage}
                  </Tag>
                )}
                {item.success ? (
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
      </Modal>
    );
  }
}

export default PlanProgress;
