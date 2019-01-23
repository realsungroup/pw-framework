import React from 'react';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types';
import './WrapedCheckbox.less';

/**
 * 被包装的 Checkbox 组件：WrapedCheckbox
 */
export default class WrapedCheckbox extends React.PureComponent {
  static propTypes = {
    /**
     * label 位置
     * 可选：'left' | 'right'
     * 默认：'right'
     */
    labelPlacement: PropTypes.oneOf(['left', 'right'])
  };

  static defaultProps = {
    labelPlacement: 'right'
  };

  render() {
    const { labelPlacement, children, className, ...restProps } = this.props;
    if (labelPlacement === 'right') {
      return (
        <Checkbox {...restProps} className={className}>
          {children}
        </Checkbox>
      );
    }
    return (
      <label className={`wraped-checkbox ${className}`}>
        <span className="wraped-checkbox__label">{children}</span>
        <Checkbox {...restProps} />
      </label>
    );
  }
}
