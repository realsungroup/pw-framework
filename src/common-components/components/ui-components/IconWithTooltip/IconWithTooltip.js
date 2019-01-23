import React from 'react';
import { Tooltip } from 'antd';
import { propTypes, defaultProps } from './propTypes';
/**
 * 带有 tooltip 的字体图标按钮
 */
const IconWithTooltip = React.memo(props => {
  const {
    tip,
    iconClass,
    style,
    className,
    placement = 'top',
    ...restProps
  } = props;
  return (
    <Tooltip title={tip} placement={placement}>
      <i
        className={`iconfont ${iconClass} ${className}`}
        {...restProps}
        style={{ cursor: 'pointer', ...style }}
      />
    </Tooltip>
  );
});

IconWithTooltip.propTypes = propTypes;

IconWithTooltip.defaultProps = defaultProps;

export default IconWithTooltip;
