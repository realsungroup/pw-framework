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
export default class DesktopMenu extends React.PureComponent {
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
    this.state = {
      menuVisible: false,
      hoverFolder: { categoricalApps: new Map() },
      openKeys: []
    };
  }

  stopPropagation = e => {
    e.stopPropagation();
  };

  handleMouseOver = folder => () => {
    this.setState({
      hoverFolder: folder,
      menuVisible: true
    });
  };

  handleMouseOut = e => {
    e.stopPropagation();
    this.setState({ menuVisible: false, openKeys: [] });
  };

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
      menus,
      onPoweroffClick,
      onOpenModifyPassModal,
      onLockScreen,
      onOpenPersonCenter
    } = this.props;
    const { hoverFolder, menuVisible, openKeys } = this.state;
    const categoricalApps = [...hoverFolder.categoricalApps.entries()];
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
          {/* <Menu
            theme="theme"
            style={{ width: '100%' }}
            // defaultOpenKeys={allFoldersExpandedKeys}
            // selectedKeys={[this.state.current]}
            // mode="inline"
            // mode="vertical"
          >
            {menus.map(folder => this.renderMenuItem(folder))}
          </Menu> */}
          <ul
            className="desktop-menu-list__functions-entry"
            onMouseLeave={() => {
              this.setState({
                menuVisible: false,
                hoverFolder: { categoricalApps: new Map() }
              });
            }}
          >
            {menus.map(folder => {
              return (
                <li
                  className="functions-entry__li--top-level"
                  key={folder.title}
                  style={{
                    background:
                      folder.title === hoverFolder.title
                        ? 'rgba(255, 255, 255, 0.1)'
                        : ''
                  }}
                  onMouseEnter={this.handleMouseOver(folder)}
                  onMouseLeave={this.handleMouseOut}
                >
                  <div className="functions-entry__menuitem--container">
                    <span className="functions-entry__menuitem__title">
                      {folder.title}
                    </span>
                    <Icon
                      type="caret-right"
                      onMouseLeave={this.stopPropagation}
                      className="functions-entry__menuitem__icon--caret-right"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div
          className="desktop-menu-list__portal"
          style={{
            display: menuVisible || categoricalApps.length ? '' : 'none'
          }}
        >
          <Menu
            mode="inline"
            onOpenChange={openKeys => {
              this.setState({ openKeys });
            }}
            openKeys={
              categoricalApps.length === 1 ? [categoricalApps[0][0]] : openKeys
            }
          >
            {categoricalApps.map(category => {
              return (
                <SubMenu title={category[0]} key={category[0]}>
                  {category[1].map(app => {
                    return (
                      <Menu.Item
                        key={app.title}
                        onClick={() => this.props.onMenuClick(app)}
                      >
                        {app.title}
                      </Menu.Item>
                    );
                  })}
                </SubMenu>
              );
            })}
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
