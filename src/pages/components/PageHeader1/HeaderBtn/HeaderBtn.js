import React from 'react';
import './HeaderBtn.less';
import { Tooltip } from 'antd';

export default class HeaderBtn extends React.PureComponent {
  render() {
    const { iconClass, onClick, tip, className } = this.props;
    return (
      <div className="page-header-v2-btn" onClick={onClick}>
        <span
          className={`page-header-v2-btn-icon iconfont-theme iconfont ${iconClass} ${
            className ? className : ''
          }`}
        />
        <div className="page-header-v2-btn-text">{tip}</div>
      </div>
    );
  }
}
