import React from 'react';
import { message } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import RightBtns from './RightBtns';
import './PageHeader.less';
import Loading from 'react-fullscreen-loading';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import logoImg from '../../../assets/logo.png';
import { setThemeColor, setLanguage } from 'Util/api';
import UserInfo from '../../components/UserInfo';

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

  handleGoBack = () => {
    this.props.history.goBack();
  };

  vars = { '@primary-color': '' };
  handleChangeComplete = (val, color) => {
    const rbga = color.rgb;
    this.vars = {
      '@primary-color': `rgba(${rbga.r},${rbga.g},${rbga.b},${rbga.a})`
    };
    this.setState({ color: rbga });
  };

  renderSelectedColor = async () => {
    this.setState({ loading: true });
    setTimeout(() => {
      window.less
        .modifyVars(this.vars)
        .then(() => {
          this.setState({ loading: false, pickerVisible: false });
          message.success('修改主题成功');
        })
        .catch(err => {
          this.setState({ loading: false });
          message.error(err.message);
        });
    }, 200);
    let res;
    try {
      res = await setThemeColor(this.vars['@primary-color']);
    } catch (err) {
      return message.error(err.message);
    }
    this.modUserInfoThemColor(this.vars['@primary-color']);
  };

  modUserInfoThemColor = color => {
    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        userInfo = JSON.parse(userInfo);
      } catch (err) {
        return;
      }
      userInfo.UserInfo.EMP_Color = color;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  };

  closePicker = e => {
    e.stopPropagation();
    this.setState({ pickerVisible: false });
  };

  closeLanguagePopover = e => {
    e.stopPropagation();
    this.setState({ languageVisible: false });
  };

  handleRadioGroupChange = async e => {
    const value = e.target.value;
    this.setState({ language: value });
    let res;
    try {
      res = await setLanguage(value);
    } catch (err) {
      return message.error(err.message);
    }
    if (res.OpResult === 'Y') {
      this.modLanguage(value);
      message.success('切换语言成功，即将重新加载本页');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  modLanguage = language => {
    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        userInfo = JSON.parse(userInfo);
      } catch (err) {
        return;
      }
      userInfo.UserInfo.EMP_LANGUAGE = language;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  };

  render() {
    const { reminderNum, lockScreenRef } = this.props;
    const { loading, isInTop } = this.state;

    const user = JSON.parse(localStorage.getItem('userInfo'));
    const userData = {
      userName: user.SysUserInfo.UserName
    };

    const rightBtns = (
      <RightBtns reminderNum={reminderNum} lockScreenRef={lockScreenRef} />
    );
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
          <Link to="/">
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
