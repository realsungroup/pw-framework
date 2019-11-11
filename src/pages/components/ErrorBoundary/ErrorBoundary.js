import React from 'react';

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
      return <h1>发生了一些错误，我们会尽快处理！</h1>;
    }

    return this.props.children;
  }
}
