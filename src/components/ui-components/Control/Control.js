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
  Icon
} from 'antd';
import DateTimePicker from '../../ui-components/DateTimePicker';
import withAdvDicTable from '../../hoc/withAdvDicTable';

const { TextArea, Search } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;

/**
 * Control
 */
class Control extends React.Component {
  static propTypes = {
    /**
     * 控件（如：Input）组件接收的 props
     */
    controlProps: PropTypes.object,

    /**
     * 控件名称
     */
    name: PropTypes.oneOf([
      'Input',
      'TextArea',
      'Search',
      'DatePicker',
      'DateTimePicker',
      'RadioGroup',
      'Select',
      'Upload'
    ]).isRequired,

    /**
     * 控件值
     */
    value: PropTypes.any

    /**
     * 控件数据
     */
    // controlData: PropTypes.object.isRequired,

    /**
     * form 对象
     */
    // form: PropTypes.object.isRequired
  };

  static defaultProps = {};

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
    const { controlData, showAdvDicTable, form } = this.props;
    showAdvDicTable(form, controlData.controlData);
  };

  handleChange = value => {
    this.triggerChange(value);
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  };

  render() {
    const { name, controlProps, value } = this.props;
    switch (name) {
      case 'Input': {
        return <Input value={value} onChange={this.handleChange} />;
      }
      case 'TextArea': {
        return <TextArea onChange={this.handleChange} />;
      }
      case 'Search': {
        return (
          <Search onChange={this.handleChange} onSearch={this.handleSearch} />
        );
      }
      case 'DatePicker': {
        return <DatePicker onChange={this.handleChange} />;
      }
      case 'DateTimePicker': {
        return <DateTimePicker onChange={this.handleChange} />;
      }
      case 'RadioGroup': {
        return <RadioGroup onChange={this.handleChange} />;
      }
      case 'Select': {
        const { options } = controlProps;
        console.log({ options });

        return (
          <Select onChange={this.handleChange}>
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
          <Upload {...controlProps}>
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

export default withAdvDicTable(Control);
