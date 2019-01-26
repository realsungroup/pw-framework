import React from 'react';
import PropTypes from 'prop-types';
import './FunctionsHeader.less';

const FunctionsHeader = ({ title, hasBackBtn, className }) => (
  <div className={`functions-header ${className ? className : ''}`}>
    {hasBackBtn && (
      <i
        className="back-btn iconfont icon-back"
        onClick={() => this.props.history.goBack()}
      />
    )}
    <span className="functions-header__title">{title}</span>
  </div>
);

FunctionsHeader.propTypes = {
  title: PropTypes.string.isRequired, // 标题
  hasBackBtn: PropTypes.bool, // 是否有返回上一页的按钮，默认值：true
  className: PropTypes.string // className
};

FunctionsHeader.defaultProps = {
  hasBackBtn: true
};

export default FunctionsHeader;
