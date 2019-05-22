import React, { Fragment } from 'react';
import {
  message,
  List,
  Button,
  Upload,
  Progress,
  Icon,
  Tooltip,
  Spin
} from 'antd';
import PropTypes from 'prop-types';
import http, { makeCancelable } from 'Util20/api';
import './ImportExcel.less';
import XLSX from 'xlsx';

const Dragger = Upload.Dragger;
const noop = () => {};

async function runPromiseByQueue(myPromises, callback) {
  for (let value of myPromises) {
    await value();
    callback && callback();
  }
}

const getImportSuccessCount = arr => {
  return arr.filter(item => item === 'success');
};

const getImportFailCount = arr => {
  return arr.filter(item => item !== 'success');
};

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
     * 导入数据的模式：'be' 表示后端处理 Excel；'fe' 表示前端处理 Excel
     * 默认：-
     */
    mode: PropTypes.oneOf(['be', 'fe']).isRequired,

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
      errMsgModalVisible: false,
      isSelectFile: false, // 是否选择了文件
      fileInfo: null, // 文件信息
      loading: false,
      columninfo: [], // 字段数据
      feMessages: [], // 前端模式处理 Excel 时，的错误字符串数据
      feRecords: [], // excel 中的记录
      progressIndex: 0
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
    this.setState({ loading: true });
    const { mode, resid } = this.props;

    // 后端处理 Excel
    if (mode === 'be') {
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

      // 前端处理 Excel
    } else {
      // 获取列定义数据
      let res;
      try {
        res = await http().getTableColumnDefine({ resid });
      } catch (err) {
        this.setState({ loading: false });
        console.error(err);
        return message.error(err.message);
      }
      this.setState({ columninfo: res.cmscolumninfo, loading: false });
    }
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

  handleFEUploadChange = info => {
    const file = info.file.originFileObj;
    const reader = new FileReader();
    const ctx = this;
    this.setState({ fileInfo: info, progressIndex: 0, feMessages: [] });
    reader.onload = function(e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {
        type: 'array',
        cellDates: true, // https://github.com/SheetJS/js-xlsx/issues/703#issuecomment-357383504
        dateNF: 'yyyy/mm/dd;@' // 日期格式化
      });
      ctx.setState({ isSelectFile: true });
      const sheet1Name = workbook.SheetNames[0];
      ctx._sheetData = workbook.Sheets[sheet1Name];
      ctx.handleImportExcel(ctx._sheetData);
    };
    reader.readAsArrayBuffer(file);
  };

  handleImportExcel = sheetData => {
    const { resid } = this.props;
    const { columninfo } = this.state;
    const resultArr = XLSX.utils.sheet_to_json(sheetData, {
      header: 1,
      dateNF: 'm/d/yy h:mm'
    });
    const recordArr = resultArr.slice(1);
    let headerInnerFields = [], // 表头的内部字段数组
      fieldIsCorrect = true; // 所有字段是否都对应正确
    try {
      headerInnerFields = resultArr[0].map(text => {
        const temp = columninfo.find(column => column.text === text);
        // 后端表中没有该字段
        if (!temp) {
          message.error(`导入失败：后端表中没有 ${text} 字段`);
          throw new Error('导入失败');
        }
        return temp.id;
      });
    } catch (err) {
      fieldIsCorrect = false;
      console.error(err);
    }

    if (!fieldIsCorrect) {
      return;
    }

    const records = recordArr.map(recordsValue => {
      let obj = {};
      recordsValue.forEach((value, index) => {
        obj[`${headerInnerFields[index]}`] = value;
      });
      return obj;
    });
    this.setState({ feRecords: records }, () => {
      const pArr = records.map((record, index) => {
        return async () => {
          return this.saveOneRecord(resid, record, index);
        };
      });
      runPromiseByQueue(pArr);
    });
  };

  saveOneRecord = async (resid, record) => {
    const { feMessages } = this.state;
    let res;
    try {
      res = await http().addRecords({
        resid,
        data: [record],
        isEditOrAdd: true
      });
    } catch (err) {
      feMessages.push(err.message);
      this.setState({ progressIndex: feMessages.length, feMessages });
      console.error(err);
      return console.error(err);
    }
    feMessages.push(res.rowstate[0].message);

    this.setState({ progressIndex: feMessages.length, feMessages });
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
    const {
      list,
      errMsgModalVisible,
      errMsgItem,
      isSelectFile,
      fileInfo
    } = this.state;
    const { mode } = this.props;

    // 后端处理 Excel
    if (mode === 'be') {
      return (
        <Fragment>
          <List
            dataSource={list}
            renderItem={item => (
              <List.Item>
                <div className="import-excel__item-wrap">
                  <span className="import-excel__title">{item.IMOUT_NAME}</span>
                  <div className="import-excel__progress">
                    {this.renderProgress(item)}
                  </div>
                  <div className="import-excel__op-area">
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

    // 前端处理 Excel
    const { loading, progressIndex, feRecords, feMessages } = this.state;
    const len = feRecords.length || 1;
    const percent = Math.floor((progressIndex / len) * 100);
    return (
      <Spin spinning={loading}>
        <div className="import-excel">
          <div style={{ height: 120, overflow: 'hidden' }}>
            <Dragger
              name="file"
              customRequest={noop}
              onChange={this.handleFEUploadChange}
            >
              <p>
                <Icon type="inbox" />
              </p>
              <p>点击或拖拽文件到此区域</p>
              {isSelectFile && (
                <span style={{ color: '#018f56' }}>
                  已选文件：{fileInfo.file.name}
                </span>
              )}
            </Dragger>
          </div>
        </div>
        {!!percent && <Progress percent={percent} />}
        {!!percent && (
          <div className="import-excel__result">
            <h4>导入结果：</h4>
            <div className="import-excel__result-item">
              <span>总记录数：</span>
              <span>{feRecords.length}</span>
            </div>
            <div className="import-excel__result-item">
              <span>导入成功的记录数：</span>
              <span>{getImportSuccessCount(feMessages).length}</span>
            </div>
            <div className="import-excel__result-item">
              <span>导入失败的记录数：</span>
              <span>{getImportFailCount(feMessages).length}</span>
            </div>
            <ul>
              {feMessages.map(
                (feMessage, index) =>
                  feMessage !== 'success' && (
                    <li style={{ color: '#f00', fontSize: 12 }}>
                      Excel 中的第 {index + 1} 条记录：{feMessage}
                    </li>
                  )
              )}
            </ul>
          </div>
        )}
      </Spin>
    );
  }
}
