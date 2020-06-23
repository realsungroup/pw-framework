import React from 'react';
import errorPng from './error.png';

function noop() {}

/**
 * 错误处理组件
 */
export default class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      errorInfo: null,
      hasError: false
    };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#ffffff',
            flexDirection: 'column'
          }}
        >
          <img
            src={errorPng}
            style={{ height: '60vh', width: 'auto', marginBottom: 24 }}
          />
          <h2>出现了一个错误，我们将尽快解决</h2>
        </div>
      );
    }

    return this.props.children;
  }
}
