import React from 'react';
import './RightBtnsTaskList.less';
import EventEmitter from 'wolfy87-eventemitter';
import { Collapse, message, List, Progress } from 'antd';
import { getProcessStatus } from 'Util/api';
import shallowequal from 'shallowequal';
import IconWithTooltip from '../../../IconWithTooltip';

const Panel = Collapse.Panel;

export default class RightBtnsTaskList extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dataAnalyseTaskIds } = this.props;
    this.state = {
      // 数据分析
      dataAnalyseTaskIds: [...dataAnalyseTaskIds], // 数据分析任务 id 列表
      curDataAnalyseId: 0, // 当前任务 id
      dataAnalyseTotal: 0,
      dataAnalyseCompleteCount: 0,
      dataAnalyseErrMessage: '',
      dataAnalyseTimeConsume: 0
    };
  }

  componentDidMount = () => {
    window.lzCustomEvent.ee = window.lzCustomEvent.ee || new EventEmitter();
    window.lzCustomEvent.ee.addListener('addTask', this.handleAddTaskCallback);
  };

  componentWillReceiveProps = nextProps => {
    if (
      !shallowequal(this.props.dataAnalyseTaskIds, nextProps.dataAnalyseTaskIds)
    ) {
      this.setState(
        { dataAnalyseTaskIds: [...nextProps.dataAnalyseTaskIds] },
        () => {
          // 获取数据分析任务状态
          if (this.state.dataAnalyseTaskIds.length) {
            this.setState({
              curDataAnalyseId: this.state.dataAnalyseTaskIds[0]
            });
            this.getDataAnalyseTaskStatus(this.state.dataAnalyseTaskIds[0]);
          }
        }
      );
    }
  };

  handleAddTaskCallback = (type, data) => {
    switch (type) {
      // 数据分析
      case 'data-analyse': {
        this.dataAnalyse(data);
        break;
      }
      // 数据处理
      case 'data-deal': {
        this.dataDeal(data);
        break;
      }
      // 数据导入
      default: {
        this.dataImport();
      }
    }
  };

  dataAnalyse = data => {
    console.log('data:', data);
  };

  getDataAnalyseTaskStatus = taskId => {
    if (taskId === 0) {
      return;
    }
    this.dataAnalyseTimer = setTimeout(async () => {
      let res;
      try {
        res = await getProcessStatus(taskId);
      } catch (err) {
        window.clearTimeout(this.dataAnalyseTimer);
        return message.error(err.message);
      }
      if (res.Error !== 0) {
        return message.error(res.message);
      }
      this.setState({
        dataAnalyseTotal: res.data.TotalNumber,
        dataAnalyseCompleteCount: res.data.CallbackCounts,
        dataAnalyseErrMessage: res.data.ErrMessage,
        dataAnalyseTimeConsume: res.data.TimeOfSecondsTaken
      });
      if (!res.data.IsCompleted) {
        this.getDataAnalyseTaskStatus &&
          this.getDataAnalyseTaskStatus(this.state.dataAnalyseTaskIds[0]);
      } else {
        message.success('任务已完成！');
        this.setState({
          isTaskComplete: true,
          completeCount: this.state.total
        });
      }
    }, 1000);
  };

  dataDeal = data => {};

  dataImport = data => {};

  handleDataAnalyseTerminateClick = () => {};

  render() {
    const { dataAnalyseTaskIds } = this.state;
    return (
      <Collapse
        style={{ width: 440 }}
        defaultActiveKey={['data-analyse', 'data-deal', 'data-import']}
      >
        <Panel
          header={<div style={{ paddingRight: 20 }}>数据分析</div>}
          key="data-analyse"
        >
          <List
            itemLayout="horizontal"
            dataSource={dataAnalyseTaskIds}
            renderItem={taskId => (
              <List.Item>
                <div className="right-btns-task-list__list-item">
                  <div className="right-btns-task-list__list-item-progress">
                    <Progress percent={30} size="small" />
                  </div>
                  <IconWithTooltip
                    tip="终止"
                    iconClass="icon-terminate"
                    onClick={this.handleDataAnalyseTerminateClick}
                  />
                </div>
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>
    );
  }
}
