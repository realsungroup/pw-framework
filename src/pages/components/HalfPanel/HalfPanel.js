import React from 'react';
import './HalfPanel.less';

const HalfPanel = ({ title, children, className, prefix, ...restProps }) => (
  <div className={`half-panel ${className}`} {...restProps}>
    {title && (
      <div className="half-panel-title">
        {prefix ? prefix : <div className="half-panel-title-icon-default" />}
        <div className="half-panel-title-text">{title}</div>
      </div>
    )}
    {children}
  </div>
);

export default HalfPanel;
