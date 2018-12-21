import React from 'react';
import Tooltip from 'antd/lib/tooltip';
import 'antd/lib/tooltip/style';
import PropTypes from 'prop-types';

/**
 * 带有 tooltip 的字体图标
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

IconWithTooltip.propTypes = {
  /**
   * 提示信息
   */
  tip: PropTypes.string.isRequired,
  /**
   * 字体图标类名
   */
  iconClass: PropTypes.string.isRequired
};

IconWithTooltip.defaultProps = {};

export default IconWithTooltip;
