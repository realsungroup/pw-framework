import React from 'react';
import './Panel.less';

const Panel = ({ className, children, ...restProps }) => (
  <div className={`panel ${className}`} {...restProps}>
    {children}
  </div>
);

Panel.defaultProps = {
  className: 'panel'
};

export default Panel;
