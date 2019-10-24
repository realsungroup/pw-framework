import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DatePicker } from 'antd';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
const DatePickerStyle = {
  width: '100%'
};

export default class MoodEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: props.value ? moment(props.value) : null,
      dateString: props.value
    };
  }

  componentDidMount() {
    console.log(this.refs);
    this.refs.container.addEventListener(
      'keydown',
      this.checkAndToggleMoodIfLeftRight
    );
    this.focus();
  }

  componentWillUnmount() {
    this.refs.container.removeEventListener(
      'keydown',
      this.checkAndToggleMoodIfLeftRight
    );
  }

  componentDidUpdate() {
    this.focus();
  }

  focus() {
    window.setTimeout(() => {
      let container = ReactDOM.findDOMNode(this.refs.container);
      if (container) {
        container.focus();
      }
    });
  }

  getValue() {
    return this.state.dateString;
  }

  isPopup() {
    return false;
  }

  handleChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({
      date,
      dateString
    });
  };

  render() {
    const { date } = this.state;
    return (
      <div
        ref="container"
        tabIndex={1} // important - without this the keypresses wont be caught
      >
        <DatePicker
          style={DatePickerStyle}
          defaultValue={moment('2015-06-06', dateFormat)}
          onChange={this.handleChange}
          value={date}
          // showTime
        />
      </div>
    );
  }
}
