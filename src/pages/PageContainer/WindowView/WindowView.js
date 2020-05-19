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
     * 窗口类型
     * 默认：'WORKBENCH'
     */
    type: PropTypes.oneOf(['DESKTOP', 'WORKBENCH']),

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
     * 尺寸设为自定义时的回调
     * 默认：-
     */
    onCustom: PropTypes.func,

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
    zIndex: PropTypes.number.isRequired,

    /**
     * 窗口是否被激活
     */
    isActive: PropTypes.bool,

    /**
     * 缩放状态：'min' 最小化状态；'max' 最大化状态；'custom' 自定义窗口大小状态
     * 默认：-
     */
    zoomStatus: PropTypes.oneOf(['min', 'max', 'custom']),

    /**
     * 在工作台模式下是否最大化
     * 默认：false
     */
    isWorkbenchMax: PropTypes.bool
  };

  static defaultProps = {
    x: 0,
    y: 0,
    type: 'WORKBENCH',
    isWorkbenchMax: false
  };

  constructor(props) {
    super(props);
    const { title } = props;
    this.state = {
      zoomStatus: 'max', // 缩放状态：'max' 最大化；'custom' 自定义窗口大小
      title
    };
  }

  componentDidMount = () => {
    window.pwCallback = window.pwCallback || {};
    const ctx = this;
    window.pwCallback.modifyTitle = title => {
      ctx.setState({ title });
    };
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height ||
      nextProps.x !== this.props.x ||
      nextProps.y !== this.props.y ||
      nextProps.visible !== this.props.visible ||
      nextProps.zIndex !== this.props.zIndex ||
      nextProps.isActive !== this.props.isActive ||
      nextProps.zoomStatus !== this.props.zoomStatus ||
      nextState.title !== this.state.title
    ) {
      return true;
    }
    return false;
  }

  getChildrenRef = node => {
    this.iframeRef = node;
  };

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

  handleCustom = () => {
    const { onCustom } = this.props;
    onCustom && onCustom();
  };

  handelActiveWindowView = () => {
    const { type } = this.props;
    if (type === 'DESKTOP') {
      const { onActive } = this.props;
      onActive && onActive();
    } else {
      return false;
    }
  };

  handleResizeStop = (event, direction, refToElement, delta) => {
    const { type } = this.props;
    if (type === 'DESKTOP') {
      const { onResizeStop } = this.props;
      onResizeStop && onResizeStop(delta.width, delta.height);
    }
  };

  handleDragStop = (e, data) => {
    const { type } = this.props;
    if (type === 'DESKTOP') {
      const { onDragStop } = this.props;
      onDragStop && onDragStop(data.lastX, data.lastY);
    }
  };

  handleGoBack = () => {
    this.iframeRef &&
      this.iframeRef.contentWindow &&
      this.iframeRef.contentWindow.postMessage(
        {
          type: 'goBack'
        },
        '*'
      );
  };

  renderMiddleBtn = () => {
    const { zoomStatus } = this.props;
    if (zoomStatus === 'max') {
      return (
        <div
          className="window-view__header-custom-btn"
          onClick={this.handleCustom}
        >
          <Icon type="switcher" />
        </div>
      );
    }
    return (
      <div className="window-view__header-max-btn" onClick={this.handleMax}>
        <i />
      </div>
    );
  };

  getEnable = type => {
    let enable = false;
    if (type === 'DESKTOP') {
      enable = {
        top: false,
        right: true,
        bottom: true,
        left: false,
        topRight: false,
        bottomRight: true,
        bottomLeft: false,
        topLeft: false
      };
    }

    return enable;
  };

  render() {
    const {
      visible,
      src,
      zoomStatus,
      children,
      minWidth,
      minHeight,
      width,
      height,
      x,
      y,
      zIndex,
      isActive,
      type,
      maxWidth,
      maxHeight,
      isWorkbenchMax,
      ...restProps
    } = this.props;

    const { title } = this.state;

    const otherProps = omit(restProps, [
      'onMin',
      'onActive',
      'onMax',
      'onDragStop',
      'onResizeStop',
      'onCustom'
    ]);

    const newChildren = React.cloneElement(children, {
      id: 'title',
      ref: this.getChildrenRef
    });

    const resizeStyle = {
      position: 'absolute',
      zIndex
    };

    // 设置 width 和 height 无效，re-resizeable 的 bug
    // https://codesandbox.io/s/blazing-wave-gj19m?file=/src/index.js:256-260
    // if (type === 'WORKBENCH') {
    //   resizeStyle.width = width;
    //   resizeStyle.height = height;
    // }

    const child = (
      <Draggable
        handle=".window-view__header"
        position={{ x, y }}
        onStop={this.handleDragStop}
        onStart={this.handelActiveWindowView}
      >
        <Resizable
          enable={this.getEnable(type)}
          {...{ minWidth, minHeight, maxWidth, maxHeight }}
          size={
            type === 'DESKTOP'
              ? {
                  width: width || 230,
                  height: height || 380
                }
              : {}
          }
          className={classNames('window-view', {
            'window-view--hide': !visible,
            'window-view--inactive': !isActive,
            'window-view--workbench': type === 'WORKBENCH',
            'window-view--workbench-normal':
              type === 'WORKBENCH' && !isWorkbenchMax,
            'window-view--workbench-max': type === 'WORKBENCH' && isWorkbenchMax
          })}
          style={resizeStyle}
          onResizeStart={this.handelActiveWindowView}
          onResizeStop={this.handleResizeStop}
          onClick={this.handelActiveWindowView}
          {...otherProps}
        >
          <div
            className={classNames('window-view__header', {
              'window-view__header--hide': type === 'WORKBENCH'
            })}
          >
            <div
              className="window-view__header-title"
              onClick={this.handleGoBack}
            >
              <Icon type="left" />
              <span style={{ marginLeft: 8 }}>{title}</span>
            </div>
            <div className="window-view__header-btns">
              <div
                className="window-view__header-min-btn"
                onClick={this.handleMin}
              >
                <i />
              </div>
              {this.renderMiddleBtn()}
              <div
                className="window-view__header-close-btn"
                onClick={this.handleClose}
              >
                <Icon type="close" />
              </div>
            </div>
          </div>
          <div className="window-view__content">{newChildren}</div>
          {/* mask */}
        </Resizable>
      </Draggable>
    );

    const container = document.querySelector('.page-container');
    return ReactDOM.createPortal(child, container);
  }
}
