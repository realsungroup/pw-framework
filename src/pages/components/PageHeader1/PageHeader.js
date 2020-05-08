import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import RightBtns from './RightBtns';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import logoImg from '../../../assets/logo-26.png';
import UserInfo from './UserInfo';
import './PageHeader.less';
import http, { makeCancelable } from 'Util20/api';
import { Drawer, Menu, Icon, Input, Badge, Popover } from 'antd';
import qs from 'qs';
import { connect } from 'react-redux';
import { getNavlistApps } from '../../../redux/actions/PageHeaderActions';
import HeaderBtn from './HeaderBtn';
import windowImg from './images/window-icon.png';
import windowSvg from './images/窗口.svg';

const SubMenu = Menu.SubMenu;
const { homeLogoSize, openFuncInSelfResids } = window.pwConfig[
  process.env.NODE_ENV
];
const { Search } = Input;

const getTarget = resid => {
  // 在新 tab 中打开功能页面
  if (openFuncInSelfResids.indexOf(resid) === -1) {
    return { target: '_blank' };
  }
  return {};
};

class PageHeader extends React.Component {
  state = {
    loading: false,
    isInTop: true, // 页面滚动条是否处在最顶部
    apps: [],
    drawerVisible: false,
    rightDrawerVisible: false,
    type: '', // 所在页面的功能类型
    title: '' // 所在页面的功能标题
  };

  static defaultProps = {
    rightBtns: <RightBtns />
  };

  componentDidMount() {
    this.setState({
      drawerVisible: false
    });
    // window.addEventListener('scroll', debounce(this.shadowChange, 200));
    const { title, type } = this.getTypeAndTitle();
    this.props.dispatch({ type: 'SET_TITLE_TYPE', data: { title, type } });
    // this.props.dispatch(getNavlistApps());
  }

  componentWillUnmount = () => {
    // window.removeEventListener('scroll', this.shadowChange);
  };

  getTypeAndTitle = () => {
    const querystring = this.props.location.search.substring(1);
    return qs.parse(querystring);
  };

  shadowChange = () => {
    const top = document.documentElement.scrollTop;
    let isInTop = true;
    if (top) {
      isInTop = false;
    }
    this.setState({ isInTop });
  };
  handleLockBtnClick = () => {
    this.props.onLockScreen();
  };

  handleAppClick = (app, type) => {
    const resid = parseInt(app.ResID || app.resid, 10);
    const target = getTarget(resid).target || 'self';
    window.open(
      `/fnmodule?resid=${resid}&recid=${app.REC_ID}&type=${type}&title=${app.title}`,
      target
    );
  };

  handleSwitchClick = () => {
    this.setState({ drawerVisible: !this.state.drawerVisible });
  };
  closeLeftDrawer = () => this.setState({ drawerVisible: false });
  closeRightDrawer = () => this.setState({ rightDrawerVisible: false });

  render() {
    const {
      lockScreenRef,
      PageHeaderReducers,
      onPwlogoClick,
      activeAppsNumber,
      menus,
      searchTextHeader,
      onSearchChange,
      allFoldersExpandedKeys,
      activeApps,
      onOpenWindow,
      onCloseActiveApp,
      visible
    } = this.props;
    const { isInTop, drawerVisible, rightDrawerVisible } = this.state;

    const { apps, title = '', type = '' } = PageHeaderReducers;

    const user = JSON.parse(localStorage.getItem('userInfo'));
    const userData = {
      userName: user.SysUserInfo.UserName
    };

    return (
      <div className={classNames('page-header', { hidden: !visible })}>
        <div className="page-header__logo">
          <a
            href="javascript:;"
            onClick={onPwlogoClick}
            className="iconfont icon-logo"
          />
          <div style={{ float: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icon
                type="unordered-list"
                className="page-header-unordered-list-icon"
                onClick={() => {
                  this.setState({ drawerVisible: !drawerVisible });
                }}
              />
              <Search
                value={searchTextHeader}
                key="page-header-search"
                onChange={onSearchChange}
                onFocus={() => {
                  this.setState({ drawerVisible: true });
                }}
              />
            </div>
          </div>
        </div>

        <div className="page-header__client-logo">
          <Link to="/" style={{ display: 'block' }}>
            <img
              src={logoImg}
              alt="logo"
              className="page-header__logo-img"
              style={{ height: 52 }}
            />
          </Link>
        </div>

        <div className="page-header__user">
          <UserInfo
            onClick={() =>
              this.setState({ rightDrawerVisible: !rightDrawerVisible })
            }
            userName={userData.userName}
          />
        </div>
        <div
          className="page-header__lock-screen"
          onClick={this.handleLockBtnClick}
        >
          <HeaderBtn
            className="right-btns__header-btn"
            iconClass="icon-lock-screen"
          />
        </div>
        <div
          className="page-header__abbreviation"
          onClick={() => {
            this.props.onShowAbbreviation();
          }}
        >
          <Popover
            placement="bottomRight"
            content={
              <ActiveAppList
                activeApps={activeApps}
                onOpenWindow={onOpenWindow}
                onCloseActiveApp={onCloseActiveApp}
              />
            }
            overlayClassName="new-home__page-header-popver"
          >
            <Badge count={activeAppsNumber}>
              {/* <img src={windowSvg} className="page-header__abbreviation-icon" /> */}
              <span className="new-home__page-header-icon iconfont icon-chuangkou"></span>
            </Badge>
          </Popover>
        </div>

        <Drawer
          visible={drawerVisible}
          className="page-header__left-drawer"
          placement="left"
          onClose={this.closeLeftDrawer}
          closable={false}
        >
          <Menu
            style={{ width: '100%', border: 'none' }}
            defaultOpenKeys={allFoldersExpandedKeys}
            // selectedKeys={[this.state.current]}
            mode="inline"
            className="new-home__page-header__menu"
            overflowedIndicator={<Icon type="down" />}
          >
            {menus.map(folder => this.renderMenuItem(folder))}
          </Menu>
        </Drawer>
        <Drawer
          className="page-header__left-drawer"
          visible={rightDrawerVisible}
          placement="right"
          onClose={this.closeRightDrawer}
          closable={false}
          width={300}
        >
          <RightBtns onLockScreen={this.props.onLockScreen} />
        </Drawer>
      </div>
    );
  }

  renderMenuItem = data => {
    if (data.isParentNode) {
      return (
        <SubMenu
          key={data.key + ''}
          title={
            <span>
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
        onClick={() => {
          this.setState({ drawerVisible: false });
          this.props.onMenuClick(data);
        }}
      >
        {/* <img src={data.appIconUrl} className="new-home-app-icon-mail" /> */}
        {data.title}
      </Menu.Item>
    );
  };
}
const ActiveAppList = React.memo(
  ({ activeApps, onOpenWindow, onCloseActiveApp }) => {
    return (
      <div className="new-home__page-header__active-apps">
        {activeApps.length ? (
          activeApps.map(app => {
            return (
              <div
                className="new-home__page-header__active-app"
                key={app.REC_ID}
                onClick={e => {
                  e.stopPropagation();
                  onOpenWindow([
                    {
                      app,
                      typeName: app.BusinessNode
                    }
                  ]);
                }}
              >
                <div className="new-home__page-header__active-app__title">
                  {app.appIconUrl && app.appIconUrlValidate ? (
                    <img src={app.appIconUrl} className="new-home-app-icon" />
                  ) : (
                    <Icon type="mail" className="new-home-app-icon-mail" />
                  )}
                  <span
                    className={
                      app.isActive
                        ? 'new-home__page-header__active-app--active'
                        : ''
                    }
                  >
                    {app.title}
                  </span>
                </div>
                <Icon
                  type="close"
                  onClick={e => {
                    e.stopPropagation();
                    onCloseActiveApp(app);
                  }}
                  className="cancel-btn"
                />
              </div>
            );
          })
        ) : (
          <div
            style={{
              height: 100,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            未打开任何功能
          </div>
        )}
      </div>
    );
  }
);

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps)(withRouter(PageHeader));
