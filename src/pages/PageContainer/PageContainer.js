import React from "react";
import SearchBox from "../components/SearchBox";
import PageHeader from "../components/PageHeader";
import UserInfo from "../components/UserInfo";
import { Route } from "react-router-dom";
import { getItem } from "../../util/localCache";
import {
  Home,
  PersonCenter,
  WorkbenchSetting,
  GetConfig,
  Reminder,
} from "../loadablePage";
import { message, Input, Button, Icon } from "antd";
import { defaultLogin, domainLogin } from "Util/api";
import LockScreen from "../components/LockScreen";
import PageBody from "../components/PageBody";
import "./PageContainer.less";

const { domainLoginConfig, lockScreenWaitTime } = window.pwConfig;
const time = lockScreenWaitTime;

export default class Container extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reminderNum: 0,
      password: "",
    };
    this.lockScreenRef = React.createRef();
  }

  componentDidMount = () => {
    let userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        userInfo = JSON.parse(userInfo);
      } catch (err) {
        return this.setThemeColor(window.themeColor);
      }
      const themeColor =
        (userInfo.UserInfo.EMP_Color && {
          "@primary-color": userInfo.UserInfo.EMP_Color,
        }) ||
        window.themeColor;
      this.setThemeColor(themeColor);
    }
  };

  setThemeColor = (themeColor) => {
    setTimeout(() => {
      try {
        window &&
          window.less &&
          window.less &&
          window.less.modifyVars &&
          window.less
            .modifyVars(themeColor)
            .then(() => {})
            .catch((err) => {
              message.error(err.message);
            });
      } catch (err) {
        // message.error("设置主题色出错，请刷新页面");
      }
    }, 0);
  };

  unloadCallback = () => {
    localStorage.removeItem("userInfo");
  };

  handleMaskShow = () => {
    window.addEventListener("unload", this.unloadCallback);
  };

  handlePassChange = (e) => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = async () => {
    const { password } = this.state;
    let res;
    // 普通方式登录
    const loginMode = localStorage.getItem("loginMode");
    if (loginMode === "normal") {
      try {
        res = await defaultLogin(this.userCode, password);
      } catch (err) {
        console.error(err);
        return message.error(err.message);
      }

      // 域登录
    } else {
      const domain = domainLoginConfig.domain;
      const usernameSuffix = domainLoginConfig.usernameSuffix;
      const domainUserField = domainLoginConfig.domainUserField;
      try {
        res = await domainLogin(
          this.userCode + usernameSuffix,
          password,
          domain,
          domainUserField
        );
      } catch (err) {
        console.error(err);
        return message.error(err.message);
      }
    }
    if (res.OpResult === "N") {
      return message.error("密码输入错误");
    }
    localStorage.setItem("userInfo", JSON.stringify(res));
    this.lockScreenRef.current.removeLockScreen();
    this.setState({ password: "" });
    window.removeEventListener("unload", this.unloadCallback);
  };

  render() {
    const { reminderNum, password } = this.state;
    const user = JSON.parse(getItem("userInfo"));
    let userData;

    // 读取用户信息报错时
    // 说明没登录
    // 进入登录页面
    try {
      userData = {
        userName: user.SysUserInfo.UserName,
      };
    } catch (err) {
      document.location.href = "/login";
    }

    const searchBox = <SearchBox placeholder="" />;
    const userInfo = (
      <UserInfo userName={userData.userName} userRank={userData.userRank} />
    );

    let username;
    if (user) {
      this.userCode = user.UserCode;
      username = user.Data;
    }
    return (
      <div className="page-container">
        {/* 锁屏 */}
        {username && (
          <LockScreen
            className="app-lock-screen-wrap"
            time={time}
            maskShow={this.handleMaskShow}
            ref={this.lockScreenRef}
          >
            <div className="app-lock-screen">
              <div className="app-lock-screen__logo">
                <span className="app-lock-screen__logo-bg" />
                <span className="iconfont icon-lock-logo" />
              </div>
              <div className="app-lock-screen__username">{username}</div>

              <div className="app-lock-screen__input">
                <Input.Password
                  value={password}
                  onChange={this.handlePassChange}
                  style={{ width: 200, marginRight: 10 }}
                  onPressEnter={this.handleSubmit}
                />
                <Button
                  type="primary"
                  shape="circle"
                  className="app-lock-screen__submit"
                  onClick={this.handleSubmit}
                >
                  <Icon type="login" theme="outlined" />
                </Button>
              </div>
            </div>
          </LockScreen>
        )}
        {/* 页面 */}
        <PageHeader
          searchBox={searchBox}
          title={userInfo}
          reminderNum={reminderNum}
          lockScreenRef={this.lockScreenRef}
        />
        <PageBody>
          <Route path="/" exact component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/person-center" component={PersonCenter} />
          <Route path="/workbench-setting" component={WorkbenchSetting} />
          <Route path="/fnmodule" component={GetConfig} />
          <Route path="/reminder" component={Reminder} />
        </PageBody>
      </div>
    );
  }
}
