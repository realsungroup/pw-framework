import React from 'react';
import {
  Input,
  DatePicker,
  Select,
  Upload,
  Button,
  Icon,
  Checkbox,
  message
} from 'antd';
import DateTimePicker from '../DateTimePicker';
import withAdvDicTable from '../../hoc/withAdvDicTable';
import { FILESEPARATOR } from 'Util/constants';
import withUploadFile from '../../hoc/withUploadFile';
import { withHttpBeforeSave } from '../../hoc/withHttp';
import { compose } from 'recompose';
import moment from 'moment';
import { defaultProps, propTypes } from './propTypes';

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

/**
 * Control
 */
class Control extends React.Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {};

  componentWillUnmount = () => {};

  shouldComponentUpdate = (nextProps, nextState) => {
    if (
      nextProps.value !== this.props.value ||
      nextProps.mode !== this.props.mode
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
    const { dataItem, hasBeforeSave } = this.props;
    // Checkbox/Select/DatePicker/DateTimePicker beforeSave
    if (hasBeforeSave) {
      if (beforeSaveOnChangeControls.indexOf(dataItem.name) !== -1) {
        setTimeout(() => {
          this.handleBeforeSave();
        }, 0);
      }
    }
    this.triggerChange(value);
  };

  triggerChange = changedValue => {
    this.props.onChange && this.props.onChange(changedValue);
  };

  // 上传文件（注意：不能使用 async 函数）
  handleUploadFile = fileInfo => {
    const { uploadFile, uploadUrl } = this.props;
    const file = fileInfo.file;
    try {
      uploadFile(
        file,
        fileUrl => {
          const value = this.getFileListValue('add', fileUrl);
          this.handleChange(value);
          message.success('上传成功');
        },
        err => {
          console.error(err);
          message.error('上传失败');
        },
        uploadUrl
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

  render() {
    const { dataItem, value, mode } = this.props;
    const name = dataItem.name;
    const props = dataItem.props;

    if (mode === 'view') {
      switch (name) {
        case 'Upload': {
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
            />
          );
        }
        case 'TextArea': {
          return (
            <TextArea
              value={value}
              onChange={this.handleChange}
              onBlur={this.handleBeforeSave}
            />
          );
        }
        case 'Search': {
          return (
            <Search
              onChange={this.handleChange}
              onSearch={this.handleSearch}
              onBlur={this.handleBeforeSave}
            />
          );
        }
        case 'DatePicker': {
          const valueProp = getDatePickerValueProp(value);
          return <DatePicker {...valueProp} onChange={this.handleChange} />;
        }
        case 'DateTimePicker': {
          const valueProp = getDatePickerValueProp(value);
          return (
            <DateTimePicker
              {...valueProp}
              onChange={this.handleChange}
              onBlur={this.handleBeforeSave}
            />
          );
        }
        case 'Checkbox': {
          const checked = getCheckboxChecked(value);
          return <Checkbox checked={checked} onChange={this.handleChange} />;
        }
        case 'Select': {
          const { options } = props;
          return (
            <Select value={value} onChange={this.handleChange}>
              {options.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          );
        }
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
