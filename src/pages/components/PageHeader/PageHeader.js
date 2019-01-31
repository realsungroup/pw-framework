import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import RightBtns from './RightBtns';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import logoImg from '../../../assets/logo.png';
import UserInfo from '../../components/UserInfo';
import './PageHeader.less';

const { homeLogoSize } = window.pwConfig;

class PageHeader extends React.Component {
  state = {
    loading: false,
    isInTop: true // 页面滚动条是否处在最顶部
  };

  static defaultProps = {
    rightBtns: <RightBtns />
  };

  componentDidMount() {
    window.addEventListener('scroll', debounce(this.shadowChange, 200));
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.shadowChange);
  };

  shadowChange = () => {
    const top = document.documentElement.scrollTop;
    let isInTop = true;
    if (top) {
      isInTop = false;
    }
    this.setState({ isInTop });
  };

  render() {
    const { lockScreenRef } = this.props;
    const { isInTop } = this.state;

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
      </div>
    );
  }
}

export default withRouter(PageHeader);
