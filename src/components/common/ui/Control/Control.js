import React from 'react';
import {
  Input,
  DatePicker,
  Select,
  Upload,
  Button,
  Icon,
  Checkbox,
  message,
  Modal
} from 'antd';
import DateTimePicker from '../DateTimePicker';
import withAdvDicTable from '../../hoc/withAdvDicTable';
import { FILESEPARATOR } from 'Util/constants';
import withUploadFile from '../../hoc/withUploadFile';
import { withHttpBeforeSave } from '../../hoc/withHttp';
import { compose } from 'recompose';
import moment from 'moment';
import { defaultProps, propTypes } from './propTypes';
import * as blobUtil from 'blob-util';
import './Control.less';

const { TextArea, Search } = Input;
const Option = Select.Option;
const { Fragment } = React;

const getDatePickerValueProp = value => {
  if (value instanceof moment) {
    return value ? { value } : null;
  }
  return value ? { value: moment(value) } : null;
};

const trueValues = ['Y'];
// const falseValues = ['', undefined, null, 'N'];
const getCheckboxChecked = value => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (trueValues.indexOf(value) !== -1) {
    return true;
  }
  return false;
};

// 获取文件列表，value：字符串，里面含有 n 个文件地址，以 ';file;' 分隔
const getFileList = value => {
  if (Array.isArray(value)) {
    return value;
  }
  let ret = [];
  if (!value) {
    return ret;
  }
  const urls = value.split(FILESEPARATOR);
  ret = urls.map((url, index) => ({
    uid: -(index + 1),
    name: url,
    status: 'done',
    url: url
  }));
  return ret;
};

const beforeSaveOnChangeControls = [
  'Checkbox',
  'Select',
  'DatePicker',
  'DateTimePicker'
];

const getSelectValue = (value, props) => {
  // 多选
  if (props.mode === 'multiple') {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    // 多个选项以 “,” 分隔
    return value.split(',');

    // 单选
  } else {
    return value;
  }
};

const getSelectViewValue = (value, controlData, props) => {
  if (!value) {
    return value;
  }

  let options = controlData.ListOfColOptions;
  if (options.length) {
    // 多选
    if (props.mode === 'multiple') {
      // value: '男,女'
      // [ {  } ]

      let valueArr = value.split(',');
      valueArr = valueArr.map(valueArrItem => {
        const obj = options.find(
          option => option.valueColValue === valueArrItem
        );
        if (obj) {
          return obj.displayColValue;
        }
      });
      return valueArr.join(',');
    }

    const obj = options.find(option => option.valueColValue === value);
    if (obj) {
      return obj.displayColValue;
    }
    return value;
  } else {
    const valueOptions = controlData.ValueOptions;
    const options = controlData.DisplayOptions;
    const obj = options.find(option => option.valueColValue === value);
    if (obj) {
      return obj.valueColValue;
    }
    return value;
  }
};

const imageReg = /\.png|\.jpg|\.jpeg$/;

/**
 * Control
 */
class Control extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);

    this.state = {
      takePictureVisible: false,
      takePictureStatus: 'ing', // 拍照状态：'ing' 表示正在拍（未拍）| 'end' 表示已拍
      imgDataURL: '', // 拍照得到的图片的 base64
      takePictureOkText: '拍照', // 可选值：'拍照' | '上传'
      takePictureCancelText: '取消' // 可选值：'取消' | '重拍'
    };
  }

  componentDidMount = () => {};

  componentWillUnmount = () => {};

  shouldComponentUpdate = (nextProps, nextState) => {
    if (
      nextProps.value !== this.props.value ||
      nextProps.mode !== this.props.mode ||
      nextState.takePictureVisible !== this.state.takePictureVisible ||
      nextState.takePictureStatus !== this.state.takePictureStatus
    ) {
      return true;
    }
    return false;
  };

  handleSearch = () => {
    const { showAdvDicTable, form, dataItem } = this.props;
    showAdvDicTable(form, dataItem, this.handleBeforeSave);
  };

  /**
   * 控件值发生改变的回调
   * @param {string | moment} value 改变后的值
   */
  handleChange = value => {
    const { dataItem, hasBeforeSave, onSingleChange, form } = this.props;
    // Checkbox/Select/DatePicker/DateTimePicker beforeSave
    if (hasBeforeSave) {
      if (beforeSaveOnChangeControls.indexOf(dataItem.name) !== -1) {
        setTimeout(() => {
          this.handleBeforeSave();
        }, 0);
      }
    }

    this.triggerChange(value);
    onSingleChange && onSingleChange(dataItem.id, form);
  };

  triggerChange = changedValue => {
    this.props.onChange && this.props.onChange(changedValue);
  };

  // 上传文件（注意：不能使用 async 函数）
  // fileInfo = {
  //   file: {
  //     name: '111', // 文件名
  //     type: 'image/png', // 文件类型
  //   }
  // }
  // fileInfo:文件信心
  handleUploadFile = fileInfo => {
    const { uploadFile, dblinkname } = this.props;
    const file = fileInfo.file;
    try {
      uploadFile(
        file,
        fileUrl => {
          const value = this.getFileListValue('add', fileUrl);
          this.handleChange(value);
          message.success('上传成功');
          this.handleEndTakePicture();
        },
        err => {
          console.error(err);
          message.error('上传失败');
        },
        dblinkname
      );
    } catch (err) {
      return console.error(err);
    }
  };

  /**
   * 获取 添加/移除 文件后的 上传控件所接收的 fileList 的值
   * @param {string} operation 对控件的操作：'add' 添加了文件 | 'remove' 移除了文件
   * @param {string | object} param2 当 operation 为 'add' 时，param2 为新增文件的地址；当 operation 为 'remove' 时，param2 为 file（将要删除的文件详情）
   */
  getFileListValue = (operation = 'add', param2) => {
    const fileList = getFileList(this.props.value);
    let value;
    // 添加
    if (operation === 'add') {
      const uid = fileList.length ? -(fileList.length + 1) : -1;
      value = [
        ...fileList,
        {
          uid: uid,
          name: param2,
          status: 'done',
          url: param2
        }
      ];

      // 移除
    } else {
      const file = param2;
      const index = fileList.findIndex(item => item.uid === file.uid);
      if (index === -1) {
        return message.error('删除出错');
      }
      value = [...fileList];
      value.splice(index, 1);
    }
    return value;
  };

  handleRemoveFile = file => {
    const value = this.getFileListValue('remove', file);
    this.handleChange(value);
  };

  handleBeforeSave = () => {
    if (!this.props.hasBeforeSave) {
      return;
    }
    const { form, operation, resid, record } = this.props;
    this.props.httpBeforeSave(resid, record, form, operation);
  };

  handleStartTakePicture = () => {
    this.setState(
      {
        takePictureVisible: true,
        takePictureOkText: '拍照',
        takePictureCancelText: '取消',
        takePictureStatus: 'ing'
      },
      () => {
        setTimeout(() => {
          this.playVideo();
        }, 0);
      }
    );
  };

  handleEndTakePicture = () => {
    const { takePictureStatus } = this.state;

    // 点击了重拍
    if (takePictureStatus === 'end') {
      this.handleStartTakePicture();

      // 点击了取消
    } else {
      try {
        this.videoNode = null;
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
        this.canvas = null;
      } catch (err) {}

      this.setState({
        takePictureVisible: false,
        takePictureOkText: '拍照',
        takePictureCancelText: '取消'
      });
    }
  };

  handleTakePicture = async () => {
    const { takePictureStatus, imgDataURL } = this.state;

    // 点击了拍照
    if (takePictureStatus === 'ing') {
      this.canvas = document.createElement('canvas');
      const context = this.canvas.getContext('2d');
      this.canvas.width = 600;
      this.canvas.height = 400;
      context.drawImage(
        this[`videoNode`],
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      this.setState({
        imgDataURL: this.canvas.toDataURL('image/png'),
        takePictureStatus: 'end',
        takePictureOkText: '上传',
        takePictureCancelText: '重拍'
      });

      // 停止
      this.videoNode = null;
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      this.canvas = null;

      // 点击了上传
    } else {
      let blob;
      console.log({ imgDataURL });
      try {
        blob = blobUtil.dataURLToBlob(imgDataURL);
      } catch (err) {
        console.error(err);
        return message.error(err.message);
      }

      const fileName = Math.floor(new Date().getTime() / 1000);
      const file = new File([blob], fileName, {
        type: 'image/png'
      });
      const fileInfo = {
        file
      };
      this.handleUploadFile(fileInfo);
    }
  };

  playVideo = async () => {
    const { dataItem } = this.props;
    const name = dataItem.name;
    this.videoNode = document.querySelector(`#video-${name}`);

    const videoConstraints = { width: 600, height: 400 };
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: videoConstraints
      });
      this.videoNode.srcObject = this.stream;
      this.videoNode.play();
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
  };

  renderTakePictureContent = () => {
    const { dataItem } = this.props;
    const name = dataItem.name;
    const { takePictureStatus, imgDataURL } = this.state;

    if (takePictureStatus === 'ing') {
      return (
        <video
          id={`video-${name}`}
          autoPlay
          muted
          style={{ display: 'block', width: 600, height: 400 }}
        />
      );
    }

    return (
      <div className="control__take-picture-img">
        <img
          src={imgDataURL}
          style={{ display: 'block', width: 600, height: 400 }}
        />
      </div>
    );
  };

  render() {
    const { dataItem, value, mode } = this.props;
    const name = dataItem.name;
    const props = dataItem.props;
    const {
      takePictureVisible,
      takePictureCancelText,
      takePictureOkText
    } = this.state;

    if (mode === 'view') {
      switch (name) {
        case 'Upload': {
          let urls = [];
          if (value) {
            urls = value.split(';file;');
          }
          return (
            <Fragment>
              {urls.map(url => {
                // 图片
                if (imageReg.test(url)) {
                  return (
                    <img
                      src={url}
                      style={{ width: '100%', height: '100%' }}
                      alt={url}
                    ></img>
                  );
                }

                return (
                  <a
                    target="blank"
                    style={{ display: 'block' }}
                    key={url}
                    href={url}
                  >
                    {url}
                  </a>
                );
              })}
            </Fragment>
          );
        }
        case 'TakePicture': {
          let urls = [];
          if (value) {
            urls = value.split(';file;');
          }
          return (
            <Fragment>
              {urls.map(url => (
                <a
                  target="blank"
                  style={{ display: 'block' }}
                  key={url}
                  href={url}
                >
                  {url}
                </a>
              ))}
            </Fragment>
          );
        }
        case 'Select': {
          return (
            <span>
              {getSelectViewValue(value, dataItem.controlData, props)}
            </span>
          );
        }

        default: {
          return <span>{value}</span>;
        }
      }
    } else {
      switch (name) {
        case 'Input': {
          return (
            <Input
              value={value}
              onChange={this.handleChange}
              onBlur={this.handleBeforeSave}
              {...props}
            />
          );
        }
        case 'TextArea': {
          return (
            <TextArea
              value={value}
              onChange={this.handleChange}
              onBlur={this.handleBeforeSave}
              {...props}
              autosize={true}
            />
          );
        }
        case 'Search': {
          return (
            <Search
              onChange={this.handleChange}
              onSearch={this.handleSearch}
              onBlur={this.handleBeforeSave}
              value={value}
            />
          );
        }
        case 'DatePicker': {
          const valueProp = getDatePickerValueProp(value);
          return (
            <DatePicker
              {...valueProp}
              onChange={this.handleChange}
              {...props}
            />
          );
        }
        case 'DateTimePicker': {
          const valueProp = getDatePickerValueProp(value);
          return (
            <DateTimePicker
              {...valueProp}
              onChange={this.handleChange}
              onBlur={this.handleBeforeSave}
              {...props}
            />
          );
        }
        case 'Checkbox': {
          const checked = getCheckboxChecked(value);
          return <Checkbox checked={checked} onChange={this.handleChange} />;
        }
        case 'Select': {
          const { options } = props;
          const newValue = getSelectValue(value, props);

          return (
            <Select
              value={newValue}
              onChange={this.handleChange}
              {...props}
              className="control__select"
            >
              {options.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          );
        }
        // 需要在窗体设计里面给字段加上 “添加目录文件图片” 属性
        case 'Upload': {
          const fileList = getFileList(value);
          return (
            <Upload
              {...props}
              fileList={fileList}
              customRequest={this.handleUploadFile}
              onRemove={this.handleRemoveFile}
            >
              <Button>
                <Icon type="upload" /> 上传
              </Button>
            </Upload>
          );
        }
        // 拍照
        case 'TakePicture': {
          const fileList = getFileList(value);
          return (
            <Fragment>
              <Button onClick={this.handleStartTakePicture}>
                <Icon type="camera" /> 拍照
              </Button>
              {fileList.map(file => (
                <div className="control__file-list-item" key={file.url}>
                  <Icon type="link" className="control__file-list-item-link" />
                  <a href={file.url} target="_blank" style={{ marginLeft: 4 }}>
                    {file.url}
                  </a>
                  <Icon
                    type="close"
                    className="control__file-list-item-close"
                    onClick={() => this.handleRemoveFile(file)}
                  />
                </div>
              ))}
              <Modal
                visible={takePictureVisible}
                title="拍照"
                width={640}
                height={440}
                onCancel={this.handleEndTakePicture}
                okText={takePictureOkText}
                cancelText={takePictureCancelText}
                onOk={this.handleTakePicture}
                maskClosable={false}
              >
                {this.renderTakePictureContent()}
              </Modal>
            </Fragment>
          );
        }
        default: {
          return null;
        }
      }
    }
  }
}

const composedHoc = compose(
  withUploadFile(),
  withAdvDicTable,
  withHttpBeforeSave()
);
export default composedHoc(Control);
