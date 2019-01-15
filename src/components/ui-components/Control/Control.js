import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Select,
  Upload,
  Button,
  Icon,
  Checkbox,
  message
} from 'antd';
import DateTimePicker from '../../ui-components/DateTimePicker';
import withAdvDicTable from '../../hoc/withAdvDicTable';
import { FILESEPARATOR } from '../../../util/constants';
import withUploadFile from '../../hoc/withUploadFile';
import { withHttpBeforeSave } from '../../hoc/withHttp';
import { compose } from 'recompose';
import moment from 'moment';

const { TextArea, Search } = Input;
const RadioGroup = Radio.Group;
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
  static propTypes = {
    /**
     * 描述控件的数据
     */
    dataItem: PropTypes.object.isRequired,

    /**
     * form 对象
     */
    form: PropTypes.object.isRequired,

    /**
     * 控件显示状态
     * 可选：'edit' 编辑状态 | 'view' 查看状态
     * 默认：'view'
     */
    displayMode: PropTypes.oneOf(['edit', 'view']),

    /**
     * 上传文件的地址
     * 默认：'http://kingofdinner.realsun.me:8081/rispweb/rispservice/SvcUploadFile2.aspx?savepath=C:\\web\\web\\rispweb\\upfiles&httppath=http://kingofdinner.realsun.me:8081/rispweb/upfiles'
     */
    uploadUrl: PropTypes.string,

    /**
     * 操作
     * 可选：'add' 添加 | 'modify' | 'view' 查看
     */
    operation: PropTypes.string,

    /**
     * 资源 id
     */
    resid: PropTypes.number,

    /**
     * 是否能够通过计算公式获取保存之前的记录
     */
    hasBeforeSave: PropTypes.bool
  };

  static defaultProps = {
    displayMode: 'view',
    uploadUrl:
      'http://kingofdinner.realsun.me:8081/rispweb/rispservice/SvcUploadFile2.aspx?savepath=C:\\web\\web\\rispweb\\upfiles&httppath=http://kingofdinner.realsun.me:8081/rispweb/upfiles'
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {};

  componentWillUnmount = () => {};

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.value !== this.props.value) {
      return true;
    }
    return false;
  };

  handleSearch = () => {
    const { showAdvDicTable, form, dataItem } = this.props;
    showAdvDicTable(form, dataItem, this.handleBeforeSave);
  };

  handleChange = value => {
    const { dataItem, hasBeforeSave } = this.props;
    // Checkbox/Select/DatePicker/DateTimePicker beforeSave
    if (beforeSaveOnChangeControls.indexOf(dataItem.name) !== -1) {
      if (hasBeforeSave) {
        setTimeout(() => {
          this.handleBeforeSave();
        }, 0);
      }
    }

    this.triggerChange(value);
  };

  triggerChange = (changedValue, isRemoveFile = false) => {
    const { dataItem, value } = this.props;
    const { name } = dataItem;
    if (name === 'Upload' && !isRemoveFile) {
      const uid = value.length ? -(value.length + 1) : -1;
      changedValue = [
        ...value,
        {
          uid: uid,
          name: changedValue,
          status: 'done',
          url: changedValue
        }
      ];
      console.log({ changedValue });
    }

    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  };

  // 上传文件（注意：不能使用 async 函数）
  handleUploadFile = fileInfo => {
    const { uploadFile, uploadUrl } = this.props;
    try {
      uploadFile(
        fileInfo,
        (err, fileUrl) => {
          if (err) {
            return message.error(err.message);
          }
          message.success('上传成功');
          this.triggerChange(fileUrl);
        },
        uploadUrl
      );
    } catch (err) {
      return message.error(err.message);
    }
  };

  handleRemoveFile = file => {
    const { value } = this.props;
    const index = value.findIndex(item => item.uid === file.uid);
    if (index === -1) {
      return message.error('删除出错');
    }
    let changedValue = [...value];
    if (changedValue.length === 1) {
      changedValue = [];
    } else {
      changedValue = changedValue.splice(index, 1);
    }
    this.triggerChange(changedValue, true);
  };

  handleBeforeSave = () => {
    if (!this.props.hasBeforeSave) {
      return;
    }
    const { form, operation, resid, record } = this.props;
    this.props.httpBeforeSave(resid, record, form, operation);
  };

  render() {
    const { dataItem, value, displayMode } = this.props;
    const name = dataItem.name;
    const props = dataItem.props;

    if (displayMode === 'view') {
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
          const fileList = getFileList();
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
