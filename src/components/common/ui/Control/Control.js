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
  Modal,
  Radio,
  AutoComplete,
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
import { getRadioGroupOptions } from './util'
import './Control.less';
import http from 'Util20/api';

const { TextArea, Search } = Input;
const Option = Select.Option;
const { Fragment } = React;

const getDatePickerValueProp = value => {
  if (value instanceof moment) {
    return value ? { value } : null;
  }
  return value ? { value: moment(value) } : null;
};

const trueValues = ['Y', '1'];
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


const getAutoCompleteDataSource = (res, key) => {
  let ret = [];
  if (!res || !key) {
    return ret;
  }
  if (res && Array.isArray(res.cmscolumninfo)) {
    const item = res.cmscolumninfo.find(cmscolumninfoItem => cmscolumninfoItem.id === key);
    if (item && item[key]) {
      const obj = item[key];
      ret = obj.DisplayOptions;
    }
  }
  return ret;
}

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
      takePictureCancelText: '取消', // 可选值：'取消' | '重拍'
      mediaFieldValue: '', // 媒体字段值
      isMediaField: false, // 是否为多媒体字段
      dataSource: [], // AutoComplete 的下拉选项
    };
  }

  componentDidMount = async () => {
    const { dataItem, resid, record, dblinkname, baseURL, mediaFieldBaseURL } = this.props;
    const { id, name, controlData } = dataItem;
    const { ColType } = controlData;
    if (name === 'Input' && ColType === 6) {
      let httpParams = {};
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      let res;
      try {
        res = await http(httpParams).getBinImage({
          resid,
          colname: id,
          recid: record.REC_ID,
          dblinkname
        })
      } catch (err) {
        return message.error(err.message);
      }

      if (res && res.data) {
        this.setState({ mediaFieldValue: `${mediaFieldBaseURL}${res.data}`, isMediaField: true });
      } else {
        this.setState({ mediaFieldValue: '', isMediaField: true, });
      }
    }

    if (name === 'AutoComplete') {
      const resid = controlData.ColParam3;
      const key = controlData.ColParam4;
      if (!resid || !key) {
        return;
      }
      // 请求下拉选项
      let httpParams = {};
      if (baseURL) {
        httpParams.baseURL = baseURL;
      }
      let res;
      try {
        res = await http(httpParams).getTable({
          resid,
          getcolumninfo: 1,
        })
      } catch (err) {
        return message.error(err.message);
      }

      const dataSource = getAutoCompleteDataSource(res, key);
      this.setState({ dataSource });
    }
  };

  componentWillUnmount = () => { };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (
      nextProps.value !== this.props.value ||
      nextProps.mode !== this.props.mode ||
      nextState.takePictureVisible !== this.state.takePictureVisible ||
      nextState.takePictureStatus !== this.state.takePictureStatus ||
      nextState.isMediaField !== this.state.isMediaField ||
      nextState.mediaFieldValue !== this.state.mediaFieldValue ||
      nextState.dataSource !== this.state.dataSource
    ) {
      return true;
    }
    return false;
  };  

  retFilterFieldValues = innerFieldNames => {
    const { record } = this.props;
    const colValues = [];
    innerFieldNames.forEach(innerFieldName => {
      colValues.push({
        col1: innerFieldName.col1,
        col1Value: record[innerFieldName.col1],
        col2: innerFieldName.col2
      });
    });
    return colValues;
  };

  // 获取由过滤字段组合成的 cmswhere 查询语句，来查询高级字典表格的数据
  getAdvDicCmswhere = advData => {
    if (!advData) {
      return '';
    }
    let where = '';
    if (advData) {
      const innerFieldNames = advData.DictionaryFilterCol.map(item => {
        return { col1: item.Column1, col2: item.Column2 };
      });
      if (innerFieldNames.length !== 0) {
        const colValues = this.retFilterFieldValues(innerFieldNames);
        colValues.forEach((colValue, index) => {
          if (index === colValues.length - 1) {
            colValue.col1Value &&
              (where += colValue.col2 + "='" + colValue.col1Value + "'"); // 需要用单引号将字段值括起来
          } else {
            colValue.col1Value &&
              (where += colValue.col2 + "='" + colValue.col1Value + "'" + ' and ');
          }
        });
      }
      if (advData.DictWhere) {
        if (where) {
          where += ` and ${advData.DictWhere}`;
        } else {
          where = advData.DictWhere;
        }
      }
    }
    return where;
  };

  handleSearch = () => {
    const { showAdvDicTable, form, dataItem, baseURL, record } = this.props;
    const advDicTableProps = {
      cmswhere: this.getAdvDicCmswhere(
        dataItem.controlData &&
        dataItem.controlData.AdvDictionaryListData &&
        dataItem.controlData.AdvDictionaryListData[0]
      )
    }
    showAdvDicTable(baseURL, form, dataItem, advDicTableProps, this.handleBeforeSave);
  };

  handleCheckboxChange = (e) => {
    const { dataItem } = this.props;
    const controlData = dataItem.controlData;
    if (controlData) {
      const trueValue = controlData.ColParam3;
      if (e.target.checked) {
        this.handleChange(trueValue);
      } else {
        this.handleChange('');
      }
    }
  }

  /**
   * 控件值发生改变的回调
   * @param {string | moment} value 改变后的值
   */
  handleChange = value => {
    const {
      dataItem,
      hasBeforeSave,
      onSingleChange,
      form,
      saveMode
    } = this.props;
    // Checkbox/Select/DatePicker/DateTimePicker beforeSave
    if (hasBeforeSave) {
      if (beforeSaveOnChangeControls.indexOf(dataItem.name) !== -1) {
        setTimeout(() => {
          this.handleBeforeSave();
        }, 0);
      }
    }
    this.triggerChange(value);
    saveMode === 'single' &&
      onSingleChange &&
      onSingleChange(dataItem.id, form);
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
    const { uploadFile, dblinkname, uploadConfig } = this.props;
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
        dblinkname,
        uploadConfig
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
      } catch (err) { }

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
    const { dataItem, value, mode, customStyle } = this.props;
    const name = dataItem.name;
    const props = dataItem.props;
    const {
      takePictureVisible,
      takePictureCancelText,
      takePictureOkText
    } = this.state;

    if (mode === 'view') {
      switch (name) {
        case 'Input': {
          const { mediaFieldValue, isMediaField } = this.state
          if (!isMediaField) {
            return (
              <span>{value}</span>
            );
          }

          // 多媒体字段
          if (mediaFieldValue) {
            return <img src={mediaFieldValue} key={mediaFieldValue} alt={mediaFieldValue} className="control__media-field-img"></img>
          }

          return null;
        }
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

        case 'Image': {
          return value ? <img
            src={value}
            alt={value}
            style={{ width: customStyle.width, height: customStyle.height }}
          ></img> : ''

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
        case 'AutoComplete': {
          const { dataSource } = this.state;

          return (
            <AutoComplete
              dataSource={dataSource}
              value={value}
              onChange={this.handleChange}
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
          return <Checkbox checked={checked} onChange={this.handleCheckboxChange} />;
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
        case 'Image': {
          return value ? <img
            src={value}
            alt={value}
            style={{ width: customStyle.width, height: customStyle.height }}
          ></img> : ''
        }

        case 'RadioGroup': {
          const options = getRadioGroupOptions(dataItem);

          return (
            <Radio.Group value={value} onChange={this.handleChange}>
              {options.map(option => <Radio key={option.value} value={option.value}>{option.label}</Radio>)}
            </Radio.Group>
          )
        }
        
        default: {
          return <div>{value}</div>;
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
