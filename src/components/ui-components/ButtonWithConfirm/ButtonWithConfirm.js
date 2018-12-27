import React from 'react';
import { Popconfirm, Button } from 'antd';
import PropTypes from 'prop-types';

/**
 * 带有 Popconfirm 的 Button 组件
 */

const ButtonWithConfirm = React.memo(
  ({ popConfirmProps = {}, buttonProps = {}, children }) => {
    return (
      <Popconfirm okText="确定" cancelText="取消" {...popConfirmProps}>
        <Button {...buttonProps}>{children}</Button>
      </Popconfirm>
    );
  }
);

ButtonWithConfirm.propTypes = {
  /**
   * PopConfirm 组件接收的 props
   * 默认：-
   */
  popConfirmProps: PropTypes.object,

  /**
   * Button 组件接收的 props
   * 默认：-
   */
  buttonProps: PropTypes.object
};

export default ButtonWithConfirm;
