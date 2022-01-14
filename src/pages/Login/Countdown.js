import React, { Component } from 'react';

/**
 * 倒计时组件
 */
export default class Countdown extends Component {
  state = {
    count: 60
  };
  componentDidMount = () => {
    this.timerId = setInterval(() => {
      if (this.state.count === 0) {
        clearInterval(this.timerId);
        // 倒计时结束
        this.props.onDownEnd && this.props.onDownEnd();
        this.setState({ count: 60 });
      } else {
        this.setState({ count: --this.state.count });
      }
    }, 1000);
  };

  render() {
    return <span>{this.state.count}</span>;
  }
}
