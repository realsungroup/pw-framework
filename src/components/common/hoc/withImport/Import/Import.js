import React, { Fragment } from 'react';
import {
  message,
  List,
  Modal,
  Button,
  Upload,
  Progress,
  Icon,
  Tooltip
} from 'antd';
import PropTypes from 'prop-types';
import http, { makeCancelable } from 'Util20/api';
import './Import.less';

// 导入文件
export const importFile = (baseURL, resid, cfgid, srctype, file) => {
  const upUrlStr =
    baseURL +
    `api/Resource/ImportFileByConfig?resid=${resid}&cfgid=${cfgid}&srctype=xls`;
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return new Promise((resolve, reject) => {
    let fd = new FormData();
    fd.append('file', file, file.name);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', upUrlStr);
    xhr.setRequestHeader('accessToken', userInfo.AccessToken);
    xhr.setRequestHeader('usercode', userInfo.UserCode);
    xhr.onload = () => {
      var data = JSON.parse(xhr.response);
      if (xhr.status === 200) {
        resolve(data);
      } else {
        reject(data);
      }
    };
    xhr.send(fd);
  });
};

/**
 * 数据导入组件
 */
export default class Import extends React.Component {
  static propTypes = {
    /**
     * 导入的资源 id
     */
    resid: PropTypes.number,

    /**
     * 导入请求的基地址
     */
    baseURL: PropTypes.string
  };
  static defaultProps = {};
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      errMsgItem: {},
      errMsgModalVisible: false
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillUnmount = () => {
    this.getTaskStatus = null;
    this.p1 && this.p1.cancel();
    this.p2 && this.p2.cancel();
    this.p3 && this.p3.cancel();
    this.p4 && this.p4.cancel();
    this.p5 && this.p5.cancel();
  };

  getData = async () => {
    let res;
    this.p1 = makeCancelable(
      http().getImportConfigs({ resid: this.props.resid })
    );
    try {
      res = await this.p1.promise;
    } catch (err) {
      return message.error(err);
    }
    res.data.forEach(item => {
      item.opViewStatus = 'chooseFile'; // 操作视图状态：'chooseFile' 选择文件状态；'opBtns' 有操作按钮状态
      item.dealStatus = ''; // 后端正在处理时的状态：'deal' 正在处理；'pause' 暂停；'terminate' 中断
    });
    this.setState({ list: res.data });
  };

  selectedItem;
  importFile = (baseURL, resid, cfgid, fileInfo, item) => {
    const file = fileInfo.file;
    // 为什么不用 async/await：https://github.com/ant-design/ant-design/issues/10122
    importFile(baseURL, resid, cfgid, undefined, file)
      .then(res => {
        if (res.error !== 0) {
          return message.error(res.message);
        }
        item.taskId = res.data;
        item.opViewStatus = 'opBtns';
        item.dealStatus = 'deal';
        item.curIndex = 0;
        item.totalIndex = 0;
        item.percent = 0;
        this.setStateList(item);
        this.getTaskStatus && this.getTaskStatus(item);
      })
      .catch(err => {
        console.error(err);
      });
  };

  getTaskStatus = item => {
    item.timer = setTimeout(async () => {
      let res;
      this.p4 = makeCancelable(
        http().importingService({
          ImportTaskId: item.taskId,
          cmd: 'GetImportStatus'
        })
      );
      try {
        res = await this.p4.promise;
      } catch (err) {
        return message.error(err.message);
      }
      if (res.error !== 0) {
        return message.error(res.message);
      }
      item.curIndex = res.data.GetEditNumber;
      item.totalIndex = res.data.GetTotalNumber;
      item.isCompleted = res.data.IsCompleted;
      item.percent = Math.floor(
        (res.data.GetEditNumber / res.data.GetTotalNumber) * 100
      );
      item.errMsg = res.data.GetImportTip;
      if (res.data.IsCompleted) {
        item.opViewStatus = 'chooseFile';
        item.dealStatus = '';
        this.setStateList(item);
        // 本任务已完成
        if (!res.data.GetImportTip) {
          message.success('导入完成');
        } else {
          message.error('导入出错');
        }
      } else {
        this.setStateList(item);
        this.getTaskStatus && this.getTaskStatus(item);
      }
    }, 1000);
  };

  setStateList = item => {
    const { list } = this.state;
    const index = list.findIndex(
      listItem => listItem.IMOUT_ID === item.IMOUT_ID
    );
    list.splice(index, 1, item);
    this.setState({ list });
  };

  handlePause = async item => {
    let res;
    this.p5 = makeCancelable(
      http().importingService({
        ImportTaskId: item.taskId,
        cmd: 'PauseImport'
      })
    );
    try {
      res = await this.p5.promise;
    } catch (err) {
      return message.error(err.message);
    }
    if (res.error !== 0) {
      return message.error(res.message);
    }
    clearTimeout(item.timer);
    item.dealStatus = 'pause';
    this.setStateList(item);
    message.success('已暂停');
  };

  handleShowErrMsg = item => {
    this.setState({ errMsgItem: item, errMsgModalVisible: true });
  };

  handleStart = async item => {
    let res;
    this.p2 = makeCancelable(
      http().importingService({
        ImportTaskId: item.taskId,
        cmd: 'ResumeImport'
      })
    );
    try {
      res = await this.p2.promise;
    } catch (err) {
      return console.error(err);
    }
    if (res.error !== 0) {
      return message.error(res.message);
    }
    this.getTaskStatus(item);
    item.dealStatus = 'deal';
    this.setStateList(item);
    message.success('已开始');
  };

  handleTerminate = async item => {
    let res;
    this.p3 = makeCancelable(
      http().importingService({
        ImportTaskId: item.taskId,
        cmd: 'TerminateImport'
      })
    );
    try {
      res = await this.p3.promise;
    } catch (err) {
      return message.error(err.message);
    }
    if (res.error !== 0) {
      return message.error(res.message);
    }
    clearTimeout(item.timer);
    item.opViewStatus = 'chooseFile';
    item.dealStatus = '';
    this.setStateList(item);
    message.success('已终止');
  };

  renderProgress = item => {
    // 正在处理
    if (item.dealStatus) {
      return (
        <Fragment>
          <Progress percent={item.percent} />
          <div>
            {item.curIndex} / {item.totalIndex}
          </div>
        </Fragment>
      );
    }
  };

  renderOpArea = item => {
    // 选择文件
    if (item.opViewStatus === 'chooseFile') {
      return (
        <Fragment>
          {item.errMsg && (
            <Button
              style={{ marginLeft: 10 }}
              onClick={() => this.handleShowErrMsg(item)}
              type="danger"
            >
              错误信息
            </Button>
          )}
          <Upload
            customRequest={file =>
              this.importFile(
                this.props.baseURL,
                item.IMOUT_RESID,
                item.IMOUT_ID,
                file,
                item
              )
            }
            showUploadList={false}
          >
            <Button type="primary">选择文件</Button>
          </Upload>
        </Fragment>
      );
    }

    // 暂停、开始、中断按钮
    if (item.opViewStatus === 'opBtns') {
      let BtnIcon;
      if (item.dealStatus === 'deal') {
        BtnIcon = (
          <Tooltip title="暂停">
            <Icon
              style={{ fontSize: 30, marginLeft: 10, cursor: 'pointer' }}
              type="pause-circle"
              onClick={() => this.handlePause(item)}
            />
          </Tooltip>
        );
      } else if (item.dealStatus === 'pause') {
        BtnIcon = (
          <Tooltip title="开始">
            <Icon
              style={{ fontSize: 30, marginLeft: 10, cursor: 'pointer' }}
              type="play-circle"
              onClick={() => this.handleStart(item)}
            />
          </Tooltip>
        );
      }

      return (
        <Fragment>
          {BtnIcon}
          <Tooltip title="终止">
            <Icon
              type="stop"
              style={{ fontSize: 30, marginLeft: 10, cursor: 'pointer' }}
              onClick={() => this.handleTerminate(item)}
            />
          </Tooltip>
        </Fragment>
      );
    }
  };

  render() {
    const { list, errMsgModalVisible, errMsgItem } = this.state;
    return (
      <Fragment>
        <List
          dataSource={list}
          renderItem={item => (
            <List.Item>
              <div className="with-import__item-wrap">
                <span className="with-import__title">{item.IMOUT_NAME}</span>
                <div className="with-import__progress">
                  {this.renderProgress(item)}
                </div>
                <div className="with-import__op-area">
                  {this.renderOpArea(item)}
                </div>
              </div>
            </List.Item>
          )}
        />
        {errMsgModalVisible && (
          <pre style={{ color: '#f00' }}>{errMsgItem.errMsg}</pre>
        )}
      </Fragment>
    );
  }
}
