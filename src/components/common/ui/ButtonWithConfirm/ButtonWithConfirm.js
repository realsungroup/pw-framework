import React from 'react';
import { Popconfirm, Button } from 'antd';
import { propTypes, defaultProps } from './propTypes';

/**
 * 带有 Popconfirm 的 Button 组件
 */

const ButtonWithConfirm = React.memo(
  ({ popConfirmProps = {}, buttonProps = {}, children }) => {
    return (
      <Popconfirm {...popConfirmProps}>
        <Button {...buttonProps}>{children}</Button>
      </Popconfirm>
    );
  }
);

ButtonWithConfirm.propTypes = propTypes;
ButtonWithConfirm.defaultProps = defaultProps;

export default ButtonWithConfirm;
