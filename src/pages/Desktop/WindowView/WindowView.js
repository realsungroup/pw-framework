import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './WindowView.less';
import classNames from 'classnames';
import { Icon } from 'antd';
import omit from 'omit.js';
import Resizable from 're-resizable';
import Draggable from 'react-draggable';

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
    onActive: PropTypes.func,

    /**
     * 宽度
     * 默认：-
     */
    width: PropTypes.number,

    /**
     * 高度
     * 默认：-
     */
    height: PropTypes.number,

    /**
     * resize 停止时的回调，如：(dW, dH) => console.log({ dW, dH }) // dW 表示变化的 width，dH 表示变化的 height
     * 默认：-
     */
    onResizeStop: PropTypes.func,

    /**
     * 窗口距离左边的距离
     * 默认：0
     */
    x: PropTypes.number,

    /**
     * 窗口距离顶部的距离
     * 默认：0
     */
    y: PropTypes.number,

    /**
     * 拖拽 停止时的回调，如：(x, y) => console.log({ x, y }) // x 表示变化后的 x，y 表示变化后的 y
     * 默认：-
     */
    onDragStop: PropTypes.func,

    /**
     * css 层级
     * 默认：-
     */
    zIndex: PropTypes.number.isRequired
  };

  static defaultProps = {
    x: 0,
    y: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      zoomStatus: 'max' // 缩放状态：'max' 最大化；'min' 最小化；'custom' 自定义窗口大小
    };
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height ||
      nextProps.x !== this.props.x ||
      nextProps.y !== this.props.y
    ) {
      return true;
    }
    return false;
  }

  handleClose = e => {
    e.stopPropagation();
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

  handleResizeStop = (event, direction, refToElement, delta) => {
    const { onResizeStop } = this.props;
    onResizeStop && onResizeStop(delta.width, delta.height);
  };

  handleDragStop = (e, data) => {
    const { onDragStop } = this.props;
    onDragStop && onDragStop(data.lastX, data.lastY);
  };

  render() {
    const {
      visible,
      src,
      title,
      zoomStatus,
      children,
      minWidth,
      minHeight,
      width,
      height,
      x,
      y,
      zIndex,
      ...restProps
    } = this.props;
    const classes = classNames('window-view', {
      'window-view--hide': !visible
    });

    const otherProps = omit(restProps, [
      'onMin',
      'onActive',
      'onMax',
      'onDragStop',
      'onResizeStop'
    ]);

    const child = (
      <Draggable
        handle=".window-view__header"
        position={{ x, y }}
        onStop={this.handleDragStop}
      >
        <Resizable
          minWidth={minWidth}
          minHeight={minHeight}
          size={{
            width: width || 230,
            height: height || 380
          }}
          className={classes}
          style={{ position: 'absolute', zIndex }}
          onResizeStop={this.handleResizeStop}
          onClick={this.handelActiveWindowView}
        >
          <div {...otherProps}>
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
            <div className="window-view__content">{children}</div>
          </div>
        </Resizable>
      </Draggable>
    );

    const container = document.querySelector('.desktop__main');
    return ReactDOM.createPortal(child, container);
  }
}
