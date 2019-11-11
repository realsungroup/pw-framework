import React from 'react';
import './HalfPanel.less';

const HalfPanel = ({ title, children, className, prefix, ...restProps }) => (
  <div className={`half-panel ${className ? className : ''}`} {...restProps}>
    {title && (
      <div className="half-panel__title">
        {!!prefix && prefix}
        <div className="half-panel__title-text">{title}</div>
      </div>
    )}
    {children}
  </div>
);

export default HalfPanel;
