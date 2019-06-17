import React from 'react';
import { Modal, Progress, List, message, Icon, Button } from 'antd';
import http from '../../../util20/api';

class PlanProgress extends React.Component {
  state = {
    visible: true,
    taskList: this.props.taskList,
    finishedCount: 0,
    percent: 0,
    isFinished: false
  };
   componentDidMount = async ()=> {
    let { taskList, finishedCount } = this.state;
    let total = taskList.length;
    await this.handleTasks(finishedCount, total, taskList);
  }

   handleTasks = async (finishedCount, total, taskList) => {
    let count =0;
    await taskList.forEach(async element => {
      let res;
      try {
        res = await http().addRecords({
          resid: '611315248461',
          data: [element],
          isEditOrAdd: true
        });
      } catch (error) {
        count++;
        return message.error(error.message);
      }
      let percent = 0;
        if (res.Error === 0) {
          finishedCount = ++finishedCount;
          percent = Math.floor((finishedCount / total) * 100);
          element.success = true;
        } else {
          element.success = false;
        }
        count++;
        this.setState({ finishedCount, percent, taskList, isFinished: count === total });
    });
   }
  

  render() {
    console.log('render');
    let { taskList, percent, finishedCount, isFinished } = this.state;
    let status = percent === 100 ? 'success' : 'active';
    if (percent < 100 && isFinished) {
      status = 'exception';
    }
    let successIcon = (
      <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
    );
    let faileIcon = (
      <Icon type="close-circle" theme="twoTone" twoToneColor="red" />
    );
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
        style={{ top: 20, bottom: 20 }}
      >
        <div style={{ padding: 10, width: '50%', margin: '0 auto' }}>
          <Progress percent={percent} status={status} />
          <div style={{ marginTop: 5, textAlign: 'center' }}>
            {finishedCount} / {taskList.length}
          </div>
        </div>
        <List
          dataSource={taskList}
          style={{ overflow: 'scroll', maxHeight: '60vh' }}
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
                {item.success ? successIcon : faileIcon}
              </div>
            </List.Item>
          )}
        />
      </Modal>
    );
  }
}

export default PlanProgress;
