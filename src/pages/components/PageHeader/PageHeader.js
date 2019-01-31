import React from 'react';
import { message } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import RightBtns from './RightBtns';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import logoImg from '../../../assets/logo.png';
import { setThemeColor, setLanguage } from 'Util/api';
import UserInfo from '../../components/UserInfo';
import './PageHeader.less';

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
    const { reminderNum, lockScreenRef } = this.props;
    const { isInTop } = this.state;

    const user = JSON.parse(localStorage.getItem('userInfo'));
    const userData = {
      userName: user.SysUserInfo.UserName
    };

    const rightBtns = <RightBtns lockScreenRef={lockScreenRef} />;
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
            <img src={logoImg} alt="logo" className="page-header__logo-img" />
          </Link>
        </div>

        {rightBtns && (
          <div className="page-header__right-btns">
            {Array.isArray(rightBtns) && rightBtns.length > 0 ? (
              rightBtns.map((btn, idx) => (
                <div key={idx} className="page-header-right-btn">
                  {btn}
                </div>
              ))
            ) : (
              <div className="page-header-right-btn">{rightBtns}</div>
            )}
          </div>
        )}
        <div className="page-header__user">
          <UserInfo userName={userData.userName} />
        </div>
      </div>
    );
  }
}

export default withRouter(PageHeader);
