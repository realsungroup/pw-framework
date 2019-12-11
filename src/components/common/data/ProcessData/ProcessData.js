import React from 'react';
import { List, message, Progress, Popconfirm, Button } from 'antd';
import http, { makeCancelable } from 'Util20/api';
import './ProcessData.less';

/**
 * 结算
 */
class ProcessData extends React.Component {
  state = {
    initLoading: false,
    loadings: {},
    list: [],
    percentList: {},
    taskList: []
  };

  constructor(props) {
    super(props);
    this._httpParam = {};
    if (props.baseURL) {
      this._httpParam = { baseURL: props.baseURL };
    }
  }

  async componentDidMount() {
    this.setState({ initLoading: true });
    await this.getData();
    await this.getInitStatus();
    this.setState({ initLoading: false });
  }

  componentWillUnmount() {
    this.timer = null;
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
    this.p3 && this.p3.cancel();
    this.p4 && this.p4.cancel();
    this.p5 && this.p5.cancel();
  }

  /**
   * 获取任务列表
   */
  getData = async () => {
    try {
      this.p1 = makeCancelable(
        http(this._httpParam).getTable({
          resid: this.props.resid
        })
      );
      const res = await this.p1.promise;
      this.setState({ list: res.data });
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  getInitStatus = async () => {
    let { list, percentList } = this.state;
    const { taskidField } = this.props;
    for (let index = 0; index < list.length; index++) {
      if (list[index][taskidField]) {
        this.p2 = makeCancelable(
          http(this._httpParam).getBatchInfo({
            taskid: list[index][taskidField]
          })
        );
        try {
          const res = await this.p2.promise;
          const { taskList } = this.state;
          if (!res.IsTerminate) {
            taskList.push(list[index]);
            percentList = {
              ...this.state.percentList,
              [list[index].REC_ID]: {
                percent: ((res.index / res.total) * 100).toFixed(2),
                total: res.total,
                index: res.index
              }
            };
          }
          this.setState({
            taskList,
            percentList
          });
        } catch (error) {
          list[index][taskidField] = '';
          this.setState({
            list
          });
        }
      }
    }
    this.getTasksInfo();
  };

  /**
   * 获取正在进行的任务的进度
   */
  getTasksInfo = async () => {
    const { taskList } = this.state;
    const { taskidField } = this.props;
    if (taskList.length) {
      taskList.forEach(async (item, index) => {
        try {
          this.p3 = makeCancelable(
            http(this._httpParam).getBatchInfo({
              taskid: item[taskidField]
            })
          );
          const res = await this.p3.promise;
          // 该任务已完成
          if (res.index === res.total) {
            taskList.splice(index, 1);
            console.log(taskList);
            this.setState({
              taskList
            });
          }
          this.setState({
            percentList: {
              ...this.state.percentList,
              [item.REC_ID]: {
                percent: ((res.index / res.total) * 100).toFixed(2),
                total: res.total,
                index: res.index
              }
            }
          });
        } catch (error) {
          message.error(error.message);
          console.error(error);
        }
      });
      this.timer = setTimeout(() => {
        this.getTasksInfo();
      }, 5000);
    } else {
      this.timer = null;
    }
  };

  settle = (record, index) => async () => {
    const { list, taskList, loadings } = this.state;
    this.p4 = makeCancelable(
      http(this._httpParam).modifyRecords({
        resid: this.props.resid,
        data: [
          {
            REC_ID: record.REC_ID,
            [this.props.taskidField]: '',
            [this.props.taskReturnField]: ''
          }
        ],
        rp: {
          IsIsolateAutoSend: false
        }
      })
    );
    try {
      this.setState({ loadings: { ...loadings, [record.REC_ID]: true } });
      const res = await this.p4.promise;
      this.setState({ loadings: { ...loadings, [record.REC_ID]: false } });
      list[index] = res.data[0];
      taskList.push(res.data[0]);
      this.setState({ list, taskList }, this.getTasksInfo);
    } catch (error) {
      message.error(error.message);
      console.error(error);
      this.setState({ loadings: { ...loadings, [record.REC_ID]: false } });
    }
  };

  stopTask = (taskid, REC_ID) => async () => {
    const { taskList, percentList, loadings } = this.state;
    const { taskidField } = this.props;
    this.p5 = makeCancelable(
      http(this._httpParam).terminateBatch({
        taskid
      })
    );
    try {
      this.setState({ loadings: { ...loadings, [REC_ID]: true } });
      await this.p5.promise;
      taskList.splice(
        taskList.findIndex(item => {
          return item[taskidField] === taskid;
        }),
        1
      );
      delete percentList[REC_ID];
      this.setState({
        taskList,
        percentList,
        loadings: { ...loadings, [REC_ID]: false }
      });
      message.success('已停止');
    } catch (error) {
      message.error(error.message);
      console.error(error);
      this.setState({ loadings: { ...loadings, [REC_ID]: false } });
    }
  };

  render() {
    const { initLoading, list, percentList, loadings } = this.state;
    const {
      titleField,
      descriptionField,
      currentCountText,
      totalCountText,
      taskidField
    } = this.props;
    return (
      <List
        className="process-data_list"
        loading={initLoading}
        itemLayout="horizontal"
        dataSource={list}
        bordered
        renderItem={(item, index) => {
          let actions = [];
          const currentPercent = percentList[item.REC_ID];
          // 结算完成或未在结算
          if (
            (currentPercent && currentPercent.percent == 100) ||
            !currentPercent
          ) {
            actions.push(
              <Popconfirm
                title="确认进行结算吗？"
                onConfirm={this.settle(item, index)}
              >
                <Button loading={loadings[item.REC_ID]}>结算</Button>
              </Popconfirm>
            );
          } else {
            actions.push(
              <Popconfirm
                title="确认进行停止吗？"
                onConfirm={this.stopTask(item[taskidField], item.REC_ID)}
              >
                <Button loading={loadings[item.REC_ID]}>停止</Button>
              </Popconfirm>
            );
          }
          return (
            <List.Item actions={actions}>
              <List.Item.Meta
                title={item[titleField]}
                description={item[descriptionField] || item[titleField]}
              />
              {currentPercent && (
                <div className="process-data_list_progress">
                  <Progress
                    percent={currentPercent.percent}
                    type="circle"
                    width={80}
                    className="process-data_list_progress_progress"
                  />
                  <p>
                    {currentCountText}/{totalCountText}
                    <br />
                    {currentPercent.index}/{currentPercent.total}
                  </p>
                </div>
              )}
            </List.Item>
          );
        }}
      />
    );
  }
}

export default ProcessData;
