import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import './SwitchHome.less';

/**
 * 切换首页
 */
export default class SwitchHome extends React.Component {
  static propTypes = {
    /**
     * 首页的模式：'DESKTOP' 桌面模式 | 'WORKBENCH' 工作台模式
     * 默认：'WORKBENCH'
     */
    homeMode: PropTypes.oneOf(['DESKTOP', 'WORKBENCH']),

    /**
     * 切换时的回调
     * 默认：-
     */
    onSwitch: PropTypes.func
  };

  static defaultProps = {
    homeMode: 'WORKBENCH'
  };

  state = {
    isClick: false
  };

  handleClick = () => {
    const { onSwitch, homeMode } = this.props;
    let _homeMode = 'DESKTOP';
    if (homeMode === 'DESKTOP') {
      _homeMode = 'WORKBENCH';
    }
    onSwitch && onSwitch(_homeMode);
    this.setState({ isClick: true });
    setTimeout(() => {
      this.setState({ isClick: false });
    }, 500);
  };

  getTooltipTitle = () => {
    const { homeMode } = this.props;
    if (homeMode === 'DESKTOP') {
      return '切换至工作台';
    } else {
      return '切换至桌面版';
    }
  };

  render() {
    const { isClick } = this.state;
    const { homeMode } = this.props;

    const children = (
      <div
        className={classNames('switch-home', {
          'switch-home--clicked': isClick
        })}
      >
        <div
          className={classNames('switch-home__bar', {
            [`switch-home__bar--desktop`]: homeMode === 'DESKTOP',
            [`switch-home__bar--workbench`]: homeMode === 'WORKBENCH'
          })}
        ></div>

        <Tooltip placement="right" title={this.getTooltipTitle()}>
          <div
            className={classNames('switch-home__btn', {
              [`switch-home__btn--desktop`]: homeMode === 'DESKTOP',
              [`switch-home__btn--workbench`]: homeMode === 'WORKBENCH'
            })}
            onClick={this.handleClick}
          >
            <i
              className={classNames('switch-home__btn-image', 'iconfont', {
                [`icon-desktop2workbench`]: homeMode === 'DESKTOP',
                [`icon-workbench2desktop`]: homeMode === 'WORKBENCH',
                [`switch-home__btn-image--desktop`]: homeMode === 'DESKTOP',
                [`switch-home__btn-image--workbench`]: homeMode === 'WORKBENCH'
              })}
            ></i>
          </div>
        </Tooltip>
      </div>
    );

    return ReactDOM.createPortal(children, document.body);
  }
}
