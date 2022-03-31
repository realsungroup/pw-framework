import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import RightBtns from './RightBtns';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import logoImg from '../../../assets/logo.png';
import UserInfo from '../../components/UserInfo';
import './PageHeader.less';
import http, { makeCancelable } from 'Util20/api';
import { Drawer, Menu } from 'antd';
import qs from 'qs';
import { connect } from 'react-redux';
import { getNavlistApps } from '../../../redux/actions/PageHeaderActions';
import { getAppConfig } from 'Util20/appConfig';
import BIButton from '../../components/BIButton';

const biConfig = getAppConfig('biConfig');

const SubMenu = Menu.SubMenu;
const { homeLogoSize, openFuncInSelfResids } = window.pwConfig[
  process.env.NODE_ENV
];

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
    drawerVisible: true,
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
    window.addEventListener('scroll', debounce(this.shadowChange, 200));
    const { title, type } = this.getTypeAndTitle();
    this.props.dispatch({ type: 'SET_TITLE_TYPE', data: { title, type } });
    this.props.dispatch(getNavlistApps());
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.shadowChange);
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

  handleAppClick = (app, type) => {
    const resid = parseInt(app.ResID || app.resid, 10);
    const target = getTarget(resid).target || 'self';
    window.open(
      `/fnmodule?resid=${resid}&recid=${app.REC_ID}&type=${type}&title=${
        app.title
      }`,
      target
    );
  };

  handleSwitchClick = () => {
    this.setState({ drawerVisible: !this.state.drawerVisible });
  };

  render() {
    const { lockScreenRef, PageHeaderReducers } = this.props;
    const { isInTop, drawerVisible } = this.state;

    const { apps, title = '', type = '' } = PageHeaderReducers;

    const user = JSON.parse(localStorage.getItem('userInfo'));
    const userData = {
      userName: user.SysUserInfo.UserName
    };

    return (
      <div
        className={classNames('page-header', {
          'in-top': isInTop
        })}
      >
        <div className="page-header__logo">
          <Link to="/" className="iconfont icon-logo" />
        </div>

        <div className="page-header__client-logo">
          <Link to="/" style={{ display: 'block' }}>
            <img
              src={logoImg}
              alt="logo"
              className="page-header__logo-img"
              style={{ height: homeLogoSize }}
            />
          </Link>
        </div>
        <div className="page-header__right-btns">
          <RightBtns lockScreenRef={lockScreenRef} />
        </div>
        <div className="page-header__user">
          <UserInfo userName={userData.userName} />
        </div>
        {biConfig.open && (
          <div className='page-header__bi' style={{ marginTop: 8 }}>
            <BIButton />
          </div>
        )}
        <Drawer
          className="workbench-body-drawer"
          placement="right"
          closable={true}
          visible={drawerVisible}
        >
          <div className="workbench-body-drawer__title">
            <i className="iconfont icon-gongzuotai" />
            工作台
          </div>
          <div
            className="workbench-body-drawer__switch"
            onClick={this.handleSwitchClick}
          >
            <i
              className={`iconfont ${
                drawerVisible ? 'icon-guanbi' : 'icon-gongzuotai'
              }`}
            />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultOpenKeys={[type]}
            defaultSelectedKeys={[title]}
          >
            {apps.map(item => (
              <SubMenu key={item.typeName} title={item.typeName}>
                {item.apps.map(app => (
                  <Menu.Item
                    key={app.title}
                    onClick={() => this.handleAppClick(app, item.typeName)}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 30,
                        textAlign: 'center'
                      }}
                    >
                      <i
                        className={`workbench-body-drawer__sub-item-icon iconfont icon-${app.DeskiconCls ||
                          'wdkq_icon'}`}
                      />
                    </span>

                    {app.title}
                  </Menu.Item>
                ))}
              </SubMenu>
            ))}
          </Menu>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps)(withRouter(PageHeader));
