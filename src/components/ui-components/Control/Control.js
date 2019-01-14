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

const { TextArea, Search } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { Fragment } = React;

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
    displayMode: PropTypes.oneOf(['edit', 'view'])
  };

  static defaultProps = {
    displayMode: 'view'
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
    showAdvDicTable(form, dataItem);
  };

  handleChange = value => {
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
    const { uploadFile } = this.props;
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
        'http://kingofdinner.realsun.me:8081/rispweb/rispservice/SvcUploadFile2.aspx?savepath=C:\\web\\web\\rispweb\\upfiles&httppath=http://kingofdinner.realsun.me:8081/rispweb/upfiles'
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

  render() {
    const { dataItem, value, displayMode } = this.props;
    const name = dataItem.name;
    const props = dataItem.props;

    if (displayMode === 'view') {
      switch (name) {
        case 'Upload': {
          const arr = value.split(';file;');
          return (
            <Fragment>
              {arr.map(item => (
                <a
                  target="blank"
                  style={{ display: 'block' }}
                  key={item}
                  href={item}
                >
                  {item}
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
          return <Input value={value} onChange={this.handleChange} />;
        }
        case 'TextArea': {
          return <TextArea value={value} onChange={this.handleChange} />;
        }
        case 'Search': {
          return (
            <Search onChange={this.handleChange} onSearch={this.handleSearch} />
          );
        }
        case 'DatePicker': {
          const valueProp = value ? { value: value } : null;
          return <DatePicker {...valueProp} onChange={this.handleChange} />;
        }
        case 'DateTimePicker': {
          const valueProp = value ? { value: value } : null;
          return <DateTimePicker {...valueProp} onChange={this.handleChange} />;
        }
        case 'Checkbox': {
          const checked = value;
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
          return (
            <Upload
              {...props}
              fileList={value}
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

export default withUploadFile()(withAdvDicTable(Control));
