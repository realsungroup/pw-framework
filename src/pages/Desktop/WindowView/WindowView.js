import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './WindowView.less';
import className from 'classnames';
import { Icon } from 'antd';
import omit from 'omit.js';

/**
 * 窗口组件
 */
export default class WindowView extends React.Component {
  static propTypes = {
    /**
     * 窗口是否显示
     * 默认：-
     */
    visible: PropTypes.bool.isRequired,

    /**
     * 窗口 iframe 的 src
     * 默认：-
     */
    src: PropTypes.string.isRequired,

    /**
     * 窗口标题
     * 默认：-
     */
    title: PropTypes.string,

    /**
     * 关闭时的回调
     * 默认：-
     */
    onClose: PropTypes.func,

    /**
     * 最小化时的回调
     * 默认：-
     */
    onMin: PropTypes.func,

    /**
     * 最大化时的回调
     * 默认：-
     */
    onMax: PropTypes.func,

    /**
     * 点击激活窗口的回调
     * 默认：-
     */
    onActive: PropTypes.func
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      zoomStatus: 'max' // 缩放状态：'max' 最大化；'min' 最小化；'custom' 自定义窗口大小
    };
  }

  componentDidMount() {}

  handleClose = () => {
    const { onClose } = this.props;
    onClose && onClose();
  };

  handleMin = () => {
    const { onMin } = this.props;
    onMin && onMin();
  };

  handleMax = () => {
    const { onMax } = this.props;
    onMax && onMax();
  };

  handelActiveWindowView = () => {
    const { onActive } = this.props;
    onActive && onActive();
  };

  render() {
    const { visible, src, title, zoomStatus, ...restProps } = this.props;
    const classes = className('window-view', {
      'window-view--hide': !visible
    });

    const otherProps = omit(restProps, ['onMin', 'onActive']);

    const child = (
      <div
        className={classes}
        onClick={this.handelActiveWindowView}
        {...otherProps}
      >
        <div className="window-view__header">
          <div className="window-view__header-title">{title}</div>
          <div className="window-view__header-btns">
            <div
              className="window-view__header-min-btn"
              onClick={this.handleMin}
            >
              <i />
            </div>
            <div
              className="window-view__header-max-btn"
              onClick={this.handleMax}
            >
              <i />
            </div>
            <div
              className="window-view__header-close-btn"
              onClick={this.handleClose}
            >
              <Icon type="close" />
            </div>
          </div>
        </div>
        <div className="window-view__content">
          <iframe src={src} frameBorder="0" className="window-view__iframe" />
        </div>
      </div>
    );

    const container = document.querySelector('.desktop__main');
    return ReactDOM.createPortal(child, container);
  }
}
