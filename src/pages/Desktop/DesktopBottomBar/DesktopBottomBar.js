import React from 'react';
import './DesktopBottomBar.less';
import PropTypes from 'prop-types';
import { Select, Icon } from 'antd';
import DesktopDate from './DesktopDate';
import DesktopMenu from './DesktopMenu';

import classNames from 'classnames';
const Option = Select.Option;

const noop = () => {};

/**
 * 桌面底部条组件
 */
export default class DesktopBottomBar extends React.Component {
  static propTypes = {
    /**
     * 被激活的 app
     * 默认：[]
     */
    activeApps: PropTypes.array.isRequired,

    /**
     * logo 点击时的回调
     * 默认：(e) => void；e 表示 event 对象
     */
    onLogoClick: PropTypes.func,

    /**
     * 点击打开 dashboard 的回调函数
     * 默认：() => void;
     */
    onOpenDashboard: PropTypes.func,

    /**
     * 点击打开 提醒列表 的回调函数
     * 默认：() => void;
     */
    onOpenReminderList: PropTypes.func,

    /**
     * 点击条上的 app 时的回调
     * 默认：(activeApp) => void; activeApp 表示点击的 app 数据
     */
    onAppClick: PropTypes.func,

    /**
     * 关机按钮点击时的回调
     * 默认：() => void
     */
    onPoweroffClick: PropTypes.func
  };

  static defaultProps = {
    onLogoClick: noop,
    menuVisible: false,
    onOpenDashboard: noop,
    onOpenReminderList: noop,
    onAppClick: noop,
    onPoweroffClick: noop
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleLogoClick = e => {
    this.props.onLogoClick(e);
  };

  renderActiveApps = () => {
    const { activeApps, onAppClick, onCloseApp } = this.props;

    return activeApps.map((activeApp, index) => {
      const classes = classNames('desktop-bottom-bar__active-app', {
        'desktop-bottom-bar__active-app--active': activeApp.isActive
      });
      return (
        <div
          className={classes}
          key={activeApp + index}
          onClick={() => onAppClick(activeApp)}
        >
          {activeApp.DeskiconCls && (
            <i
              className={`iconfont icon-${activeApp.DeskiconCls ||
                'wdkq_icon'}`}
            />
          )}

          <span>{activeApp.appName}</span>
          <Icon
            type="close-circle"
            className="desktop-bottom-bar__active-app-close"
            onClick={e => {
              e.stopPropagation();
              onCloseApp(activeApp);
            }}
          />
        </div>
      );
    });
  };

  render() {
    const {
      userInfo,
      allFolders,
      menuVisible,
      onOpenDashboard,
      onOpenReminderList,
      onMenuClick,
      onPoweroffClick,
      onOpenModifyPassModal,
      onLockScreen,
      onOpenPersonCenter
    } = this.props;
    return (
      <div className="desktop-bottom-bar">
        <div className="desktop-bottom-bar__left">
          <div
            className="desktop-bottom-bar__logo"
            onClick={this.handleLogoClick}
          >
            <i className="iconfont icon-logo" />
          </div>
          <div className="desktop-bottom-bar__active-apps">
            {this.renderActiveApps()}
          </div>
        </div>
        <div className="desktop-bottom-bar__right">
          <DesktopDate className="desktop-bottom-bar__date" />
          <div
            className="desktop-bottom-bar__right-item"
            onClick={onOpenDashboard}
          >
            <Icon type="dashboard" />
          </div>
          <div
            className="desktop-bottom-bar__right-item"
            onClick={onOpenReminderList}
          >
            <Icon type="bell" />
          </div>
        </div>
        <DesktopMenu
          visible={menuVisible}
          userInfo={userInfo}
          allFolders={allFolders}
          onMenuClick={onMenuClick}
          onPoweroffClick={onPoweroffClick}
          onOpenModifyPassModal={onOpenModifyPassModal}
          onLockScreen={onLockScreen}
          onOpenPersonCenter={onOpenPersonCenter}
        />
      </div>
    );
  }
}
