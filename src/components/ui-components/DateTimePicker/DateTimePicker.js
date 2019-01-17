import React from 'react';
import { DatePicker, TimePicker } from 'antd';
import { propTypes, defaultProps } from './propTypes';
/**
 * 日期时间选择器
 */

class DateTimePicker extends React.Component {
  static propTypes = propTypes;

  static defaultProps = defaultProps;

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value;
    this.state = {
      value
    };
  }

  handleDateChange = date => {
    if (!('value' in this.props)) {
      this.setState({ value: date });
    }
    this.triggerChange(date);
  };

  handleTimeChange = time => {
    if (!('value' in this.props)) {
      this.setState({ value: time });
    }
    this.triggerChange(time);
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
    onChange && onChange(changedValue);
  };

  render() {
    const { value } = this.state;
    const {
      dateFormat,
      timeFormat,
      space,
      datePickerProps,
      timePickerProps
    } = this.props;
    return (
      <div className="date-time-picker">
        <DatePicker
          value={value}
          onChange={this.handleDateChange}
          format={dateFormat}
          style={{ marginRight: space }}
          {...datePickerProps}
        />
        <TimePicker
          value={value}
          onChange={this.handleTimeChange}
          format={timeFormat}
          {...timePickerProps}
        />
      </div>
    );
  }
}
export default DateTimePicker;
