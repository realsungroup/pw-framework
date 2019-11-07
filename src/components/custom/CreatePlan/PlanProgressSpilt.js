import React from 'react';
import {
  Modal,
  Progress,
  List,
  message,
  Icon,
  Button,
} from 'antd';
// import PropTypes from 'prop-types';
import http from '../../../util20/api';

class PlanProgressSplit extends React.Component {
  // static propTypes = {
  //   struct: PropTypes.string,
  //   options: PropTypes.object,
  //   title: PropTypes.string,
  //   width: PropTypes.string,
  //   onFinished: PropTypes.func,
  //   showFields: PropTypes.array,
  // } 
  state = {
    visible: true,
    // finishedCount: 0,
    percent: 0,
    isFinished: false,
    taskid: '',
    errorList: [],
    isShowDetail: false,
    intErrLines: 0,
    intCurrent: 0,
    intTotalNumber: 0
  };
  componentDidMount = async () => {
    let res;
    try {
      switch (this.props.struct) {
        case '100':
          res = await http().StartSaveTask(this.props.options);
          break;
        case '200':
          res = await http().StartSaveTask200(this.props.options);
          break;
        default:
          res = await http().StartSaveTask(this.props.options);
          break;
      }
      let taskid = res.taskid;
      this.getTaskInfo(taskid);
    } catch (error) {
      message.error(error.message);
    }
  };
  componentWillUnmount = () => {
    this.timer = null;
    this.getTaskInfo = null;
  };
  getTaskInfo = async taskid => {
    let res;
    try {
      res = await http().RetrieveSaveTask({ taskid, includeData: true });
    } catch (err) {
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo(taskid);
        }
      }, 1000);
      console.log(err);
      return message.error(err.message);
    }
    let data = res.data;
    if (res.IsCompleted) {
      // 当前任务已完成
      if (data.result.Error !== 0) {
        let errorList = [];
        data.result.data.forEach(item => {
          if (item.maindata.message) {
            errorList.push(item.maindata);
          }
        });
        let percent = Math.floor((data.intCurrent / data.intTotalNumber) * 100);
        this.setState({
          errorList,
          percent,
          isFinished: true,
          intCurrent: data.intCurrent,
          intErrLines: data.intErrLines,
          intTotalNumber: data.intTotalNumber
        });
      } else {
        this.setState({
          percent: 100,
          isFinished: true,
          intCurrent: data.intCurrent,
          intErrLines: data.intErrLines,
          intTotalNumber: data.intTotalNumber
        });
      }
    } else {
      // 当前任务未完成
      let percent = Math.floor((data.intCurrent / data.intTotalNumber) * 100);
      this.setState({
        percent,
        isFinished: false,
        intCurrent: data.intCurrent,
        intErrLines: data.intErrLines,
        intTotalNumber: data.intTotalNumber
      });
      this.timer = setTimeout(async () => {
        if (this.getTaskInfo) {
          await this.getTaskInfo(taskid);
        }
      }, 1000);
    }
  };

  render() {
    let {
      percent,
      isFinished,
      errorList,
      intCurrent,
      intErrLines,
      intTotalNumber
    } = this.state;
    let status;
    if (percent < 100) {
      status = 'normal';
    }
    if (percent === 100 && errorList.length === 0) {
      status = 'success';
    } else if (percent === 100 && errorList.length !== 0) {
      status = 'exception';
    }
    return (
      <Modal
        closable={false}
        visible={this.state.visible}
        centered={true}
        title={this.props.title}
        bordered={true}
        mask={false}
        width={this.props.width}
        footer={
          <Button
            block={true}
            type="primary"
            disabled={!isFinished}
            onClick={this.props.onFinished}
          >
            完成
          </Button>
        }
        style={{ top: 50, bottom: 20 }}
      >
        <div style={{ padding: 10, display: 'flex', flexDirection: 'column' }}>
          <Progress
            percent={percent}
            type="circle"
            status={status}
            size="small"
            style={{ margin: '0 auto' }}
          />
          <div style={{ marginTop: 6, textAlign: 'center' }}>
            总数：{intTotalNumber}，成功：{intCurrent - intErrLines}，出错：
            {intErrLines}
          </div>
          {intErrLines !== 0 ? (
            <div style={{ textAlign: 'center' }}>
              <span
                onClick={() => {
                  this.setState({ isShowDetail: !this.state.isShowDetail });
                }}
                style={{ cursor: 'pointer', marginTop: 6, fontSize: 18 }}
              >
                {this.state.isShowDetail ? '收起错误详情' : '展开错误详情'}
                {this.state.isShowDetail ? (
                  <Icon type="down-circle" />
                ) : (
                  <Icon type="right-circle" />
                )}
              </span>
            </div>
          ) : null}
        </div>
        {this.state.isShowDetail && (
          <List
            dataSource={errorList}
            style={{ overflow: 'scroll', maxHeight: '35vh' }}
            renderItem={item => (
              <List.Item>
                <div
                  style={{
                    display: 'flex',
                    width: '100%'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    {item[this.props.showFields[0]]}
                  </div>
                  <div style={{ flex: 1 }}>
                    {item[this.props.showFields[1]]}
                  </div>
                  {/* <Tag
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  color="red"
                  title={item.message}
                >
                  {item.message}
                </Tag> */}

                  <Icon
                    type="close-circle"
                    theme="twoTone"
                    twoToneColor="red"
                    // style={iconStyle}
                    title={item.message}
                  />
                </div>
              </List.Item>
            )}
          />
        )}
      </Modal>
    );
  }
}

export default PlanProgressSplit;
