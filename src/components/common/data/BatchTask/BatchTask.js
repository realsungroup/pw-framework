import React from 'react';
import './BatchTask.less';
import { Modal, Progress, message, Icon, Tooltip } from 'antd';
import http from 'Util20/api';
import { defaultProps, propTypes } from './propTypes';

const IconStyle = {
  fontSize: 24
};
/*
 *  批处理任务，用于大数据量
 */
class BatchTask extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;
  state = {
    visible: false,
    completedCount: 0, // 当前数量
    totalCount: 0, //总数量
    isFinished: false, //任务是否已完成
    percent: 0, //当前任务进度
    taskid: 0, //后台返回的taskid，0代表无任务
    taskTitle: '', //任务标题
    isTerminate: false //当前任务是否已停止
  };

  constructor(props) {
    super(props);
    const { id, resid, keycolumn, keyparm, batchsize } = this.props;
    this._id = id;
    this._resid = resid;
    this._keycolumn = keycolumn;
    this._keyparm = keyparm;
    this._batchsize = batchsize;
  }
  componentDidMount() {}
  componentWillUnmount() {
    this.timer = null;
  }
  startTask = () => {
    this.setState({ visible: true });
    if (this.state.taskid) {
      return;
    } else {
      this.handleStart();
    }
  };

  handleStart = async () => {
    try {
      this.setState({
        completedCount: 0,
        totalCount: 0,
        isFinished: false,
        percent: 0,
        taskid: 0,
        taskTitle: '',
        isTerminate: false
      });
      const res = await http().batchImport({
        id: this._id,
        resid: this._resid,
        keycolumn: this._keycolumn,
        keyparm: this._keyparm,
        batchsize: this._batchsize
      });
      const { otherdata: taskid, data } = res;
      if (data.length) {
        this.setState({
          taskTitle: data[0].data.Title
        });
      }
      this.setState({
        taskid
      });
      this.getTaskInfo(taskid);
    } catch (error) {
      // message.error(error.message);
      console.log(error);
    }
  };

  _num = 0;
  getTaskInfo = async taskid => {
    try {
      const res = await http().getBatchInfo({
        taskid
      });
      const data = res.data;
      let total = 0,
        currentIndex = 0,
        isComplete = false;
      data.forEach(item => {
        const _data = item.data;
        total += _data.Total;
        currentIndex += _data.Index;
      });
      isComplete = data.every(item => {
        return item.IsComplete;
      });
      if (isComplete) {
        this.setState({
          isFinished: isComplete
        });
        this.timer = null;
      } else {
        console.log(++this._num, total, currentIndex);
        const percent = Math.floor((currentIndex / total) * 100);
        this.setState({
          isFinished: isComplete,
          percent,
          completedCount: currentIndex,
          totalCount: total
        });
        this.timer = setTimeout(() => {
          this.getTaskInfo(taskid);
        }, 3000);
      }
    } catch (error) {
      // message.error(error.message);
      console.log(error);
    }
  };

  stopTask = async () => {
    try {
      const { taskid } = this.state;
      if (!taskid) {
        return;
      }
      const res = await http().terminateBatch({
        taskid
      });
      this.setState({
        isTerminate: true
      });
      this.timer = null;
      message.success('已停止');
    } catch (error) {
      // message.error(error.message);
      console.log(error);
    }
  };

  render() {
    const {
      visible,
      percent,
      completedCount,
      totalCount,
      taskTitle,
      isTerminate
    } = this.state;
    return (
      <>
        <Modal
          visible={visible}
          onOk={() => this.setState({ visible: false })}
          onCancel={() => this.setState({ visible: false })}
          title={taskTitle}
          footer={null}
        >
          <div className="batch-task">
            <Progress type="circle" percent={percent} />
          </div>
          <div className="batch-task_count">
            <span>{completedCount}</span>/<span>{totalCount}</span>
          </div>
          <div className="batch-task_icon-buttons">
            {isTerminate ? (
              <Tooltip title="重新开始">
                <Icon
                  type="caret-right"
                  style={IconStyle}
                  onClick={this.handleStart}
                />
              </Tooltip>
            ) : (
              <Tooltip title="暂停">
                <Icon type="pause" style={IconStyle} onClick={this.stopTask} />
              </Tooltip>
            )}
          </div>
        </Modal>
      </>
    );
  }
}

export default BatchTask;
