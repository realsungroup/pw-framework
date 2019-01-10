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
     * 描述控件的数据
     */
    dataItem: PropTypes.object.isRequired,

    /**
     * form 对象
     */
    form: PropTypes.object.isRequired
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => { };

  componentWillUnmount = () => { };

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

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  };

  render() {
    const { dataItem, value } = this.props;
    const name = dataItem.name;
    const props = dataItem.props;
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
        const { options } = props;
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
          <Upload {...props}>
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
