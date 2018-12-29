import React from 'react';
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
import DateTimePicker from '../DateTimePicker';

const { TextArea, Search } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;
/**
 * FormItem
 */
class FormItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.value !== nextProps.value ||
      this.props.help !== nextProps.help ||
      this.props.mode !== nextProps.mode
    ) {
      return true;
    }
    return false;
  }

  // 渲染控件
  renderControl = formItemData => {
    const { name, id, props } = formItemData;
    const { value, onChange, onBlur, mode } = this.props;

    if (mode === 'view') {
      if (typeof value === 'function') {
        return <div key={formItemData.id}>{value()}</div>;
      } else {
        return <div key={formItemData.id}>{value}</div>;
      }
    }

    switch (name) {
      case 'Input': {
        return (
          <Input
            {...props}
            value={value}
            onChange={e => {
              onChange(id, e.target.value);
            }}
            onBlur={e => {
              onBlur(id, e.target.value);
            }}
          />
        );
      }

      case 'TextArea': {
        return (
          <TextArea
            {...props}
            value={value}
            onChange={e => {
              onChange(id, e.target.value);
            }}
            onBlur={e => {
              onBlur(id, e.target.value);
            }}
          />
        );
      }

      case 'Search': {
        return (
          <Search
            {...props}
            value={value}
            onChange={e => {
              onChange(id, e.target.value);
            }}
            onBlur={e => {
              onBlur(id, e.target.value);
            }}
          />
        );
      }
      case 'DatePicker': {
        return (
          <DatePicker
            {...props}
            value={value}
            onChange={(date, dateString) => {
              onChange(id, date);
            }}
            onBlur={e => {
              onBlur(id, e.target.value);
            }}
          />
        );
      }

      case 'DateTimePicker': {
        return (
          <DateTimePicker
            {...props}
            value={value}
            onChange={(date, dateString) => {
              onChange(id, date);
            }}
            onBlur={e => {
              onBlur(id, e.target.value);
            }}
          />
        );
      }

      case 'RadioGroup': {
        return (
          <RadioGroup
            {...props}
            value={value}
            onChange={e => {
              onChange(id, e.target.value);
            }}
            onBlur={e => {
              onBlur(id, e.target.value);
            }}
          />
        );
      }

      case 'Select': {
        return (
          <Select
            value={value}
            onChange={(value, option) => {
              onChange(id, value);
            }}
            onBlur={(value, option) => {
              onBlur(value);
            }}
          >
            {props.options.map(option => (
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
    }
  };
  render() {
    const { help, formItemData, mode } = this.props;
    const { id, label, labelCol, wrapperCol } = formItemData;
    return (
      <Form.Item
        key={id}
        label={label}
        help={mode === 'edit' && help}
        validateStatus={help && 'error'}
        labelCol={{ span: labelCol || 8 }}
        wrapperCol={{ span: wrapperCol || 16 }}
      >
        {this.renderControl(formItemData)}
      </Form.Item>
    );
  }
}

export default FormItem;
