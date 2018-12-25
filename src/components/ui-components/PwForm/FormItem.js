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

const { TextArea, Search } = Input;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const renderControl = (item, restProps) => {
  const { control, id } = item;
  const { value, onChange } = restProps;
  console.log({ restProps });

  switch (control.name) {
    case 'Input': {
      return (
        <Input
          {...control.props}
          value={value}
          onChange={e => {
            console.log({ id, value: e.target.value });

            onChange(id, e.target.value);
          }}
        />
      );
    }
    case 'TextArea': {
      return <TextArea {...control.props} />;
    }
    case 'Search': {
      return <Search {...control.props} />;
    }
    case 'DatePicker': {
      return <DatePicker {...control.props} />;
    }
    case 'RadioGroup': {
      return <RadioGroup {...control.props} />;
    }
    case 'Select': {
      return (
        <Select>
          {control.props.options.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      );
    }
    case 'Upload': {
      return (
        <Upload {...control.props}>
          <Button>
            <Icon type="upload" /> 上传
          </Button>
        </Upload>
      );
    }
  }
};

class FormItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.value !== nextProps.value) {
      return true;
    }
    return false;
  }
  render() {
    const { item, ...restProps } = this.props;
    const {
      id,
      label,
      initialValue,
      labelCol,
      wrapperCol,
      rules,
      control
    } = item;
    return (
      <Form.Item
        key={id}
        label={label}
        labelCol={{ span: labelCol || 8 }}
        wrapperCol={{ span: wrapperCol || 16 }}
      >
        {renderControl(this.props.item, restProps)}
      </Form.Item>
    );
  }
}

// const FormItem = props => {
//   const { item, ...restProps } = props;
//   const {
//     id,
//     label,
//     initialValue,
//     labelCol,
//     wrapperCol,
//     rules,
//     control
//   } = item;
//   return (
//     <Form.Item
//       key={id}
//       label={label}
//       labelCol={{ span: labelCol || 8 }}
//       wrapperCol={{ span: wrapperCol || 16 }}
//     >
//       {renderControl(props.item, restProps)}
//     </Form.Item>
//   );
// };

export default FormItem;
