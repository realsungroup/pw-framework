import React from 'react';
import ReactDOM from 'react-dom';
import './DesktopMenu.less';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Avatar, Icon, Menu } from 'antd';
const { SubMenu } = Menu;
const noop = () => {};

/**
 * 桌面左下角菜单组件
 */
export default class DesktopMenu extends React.Component {
  static propTypes = {
    /**
     * 菜单是否显示
     * 默认：false
     */
    visible: PropTypes.bool,

    /**
     * 用户信息
     * 默认：-
     */
    userInfo: PropTypes.object.isRequired,

    /**
     * menu 点击时的回调
     * 默认：() => void
     */
    onMenuClick: PropTypes.func,

    /**
     * 关机按钮点击时的回调
     * 默认：() => void
     */
    onPoweroffClick: PropTypes.func
  };

  static defaultProps = {
    onMenuClick: noop,
    onPoweroffClick: noop,
    onOpenModifyPassModal: noop
  };

  constructor(props) {
    super(props);
  }

  renderMenuItem = data => {
    if (data.isParentNode) {
      return (
        <SubMenu
          key={data.key + ''}
          title={
            <span>
              <Icon type="menu" />
              <span>{data.title}</span>
            </span>
          }
        >
          {data.AppLinks.map(app => this.renderMenuItem(app))}
        </SubMenu>
      );
    }
    return (
      <Menu.Item
        key={data.key + ''}
        onClick={() => this.props.onMenuClick(data)}
      >
        {data.title}
      </Menu.Item>
    );
  };

  render() {
    const {
      visible,
      userInfo,
      allFolders,
      onPoweroffClick,
      onOpenModifyPassModal,
      onLockScreen,
      onOpenPersonCenter
    } = this.props;
    const child = (
      <div
        className={classNames('desktop-menu', {
          'desktop-menu--hide': !visible
        })}
        onClick={e => e.stopPropagation()}
      >
        <div className="desktop-menu-user">
          <div className="desktop-menu-user-info" onClick={onOpenPersonCenter}>
            <div className="desktop-menu-user-avatar">
              <Avatar icon="user" />
            </div>
            <div className="desktop-menu-user-username">
              {userInfo.UserCode}
            </div>
          </div>

          <div className="desktop-menu-icon-wrapper">
            <Icon
              type="lock"
              className="desktop-menu-icon"
              onClick={onLockScreen}
            />
          </div>

          <div className="desktop-menu-icon-wrapper">
            <i
              className="iconfont icon-mod-password desktop-menu-icon"
              onClick={onOpenModifyPassModal}
            />
          </div>

          <Icon
            type="poweroff"
            className="desktop-menu-poweroff"
            onClick={onPoweroffClick}
          />
        </div>
        <div className="desktop-menu-list">
          <Menu
            theme="theme"
            style={{ width: '100%' }}
            // defaultOpenKeys={allFoldersExpandedKeys}
            // selectedKeys={[this.state.current]}
            mode="inline"
          >
            {allFolders.map(folder => this.renderMenuItem(folder))}
          </Menu>
        </div>
      </div>
    );

    const container = document.querySelector('.desktop');

    if (!container) {
      return null;
    }

    return ReactDOM.createPortal(child, container);
  }
}
