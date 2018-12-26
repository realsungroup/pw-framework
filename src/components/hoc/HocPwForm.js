import React from 'react';
import { deepCompare } from 'pure-render-deepcompare-decorator';

export default function HocPwForm(WrappedComponent) {
  return class WrapComponent extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
      if (this.props.value !== nextProps.value) {
        return true;
      }
      return false;
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
