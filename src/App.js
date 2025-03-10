import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './util/auth';
import { IntlProvider, addLocaleData } from 'react-intl';

import { Icon, LocaleProvider, Button, message } from 'antd';

import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import zh_CN from './locales/zh-CN';
import en_US from './locales/en-US';

// import { PageContainer, Login, NotFound } from './pages/loadablePage';

// import NonsupportIE from 'nonsupport-ie-react';
import NonsupportIE from './pages/components/NonsupportIE';

import ClipboardJS from 'clipboard';

import ErrorBoundary from './pages/components/ErrorBoundary';

// antd 组件国际化
import zh_CN_antd from 'antd/lib/locale-provider/zh_CN';
import en_US_antd from 'antd/lib/locale-provider/en_US';
import 'moment/locale/zh-cn';

import { setItem, getItem } from 'Util/util';
import './App.css';
import qs from 'qs';

// redux
import { Provider } from 'react-redux';
import store from './store';

import {
  Desktop,
  GetConfig,
  Login,
  Reminder,
  PageContainer,
  NotFound
} from './pages/loadablePage';

addLocaleData([...en, ...zh]);

const ReminderMsg = (
  <div className="app__nonuse-ie">
    本应用不支持
    <div className="app__nonuse-tag">
      <Icon type="ie" theme="outlined" />
      <span>IE11版本以下的 浏览器</span>
    </div>
    <br />
    请将地址：{document.location.href} 复制到
    <br />
    <div className="app__nonuse-tag">
      <a href="javascript:;" target="_blank">
        <Icon type="chrome" theme="outlined" />
        <span>谷歌浏览器</span>
      </a>
    </div>
    或
    <div className="app__nonuse-tag">
      <a href="javascript:;" target="_blank">
        <Icon type="fire" theme="outlined" />
        <span>火狐浏览器</span>
      </a>
    </div>
    中打开
  </div>
);

class WarningBar extends React.PureComponent {
  render() {
    const { visible, onClose } = this.props;
    let style = visible ? {} : { display: 'none' };
    return (
      <div className="app__warning-bar" style={style}>
        <div className="app__warning-bar-icon">
          <Icon type="warning" style={{ marginRight: 20, fontSize: 35 }} />
        </div>
        <div className="app__warning-bar-text">
          <div>
            请注意 PowerWorks 在 Internet Explorer 上运行可能会影响您的使用体验
          </div>
          <div>
            我们强烈建议您使用 Microsoft Edge, Google Chrome 或 Firefox
            以获得更好的使用效果。
          </div>
        </div>
        <div className="app__warning-bar-close">
          <Button size="small" onClick={onClose}>
            关闭
          </Button>
          <Button
            type="primary"
            size="small"
            className="app__warning-bar-copy"
            data-clipboard-text={document.location.href}
          >
            复制本页地址
          </Button>
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    const { resid: resId } = this.resolveQueryString();

    this.state = {
      warningBarVisible: true,
      resId
    };
  }

  resolveQueryString = () => {
    const querystring = window.location.search.substring(1);
    return qs.parse(querystring);
  };

  componentDidMount = () => {
    const clipboard = new ClipboardJS('.app__warning-bar-copy');
    clipboard.on('success', function(e) {
      message.success('复制成功');
    });

    clipboard.on('error', function(e) {
      message.error('复制失败');
    });
  };

  handleCloseWarningBar = () => {
    this.setState({ warningBarVisible: false });
  };

  render() {
    // 国际化
    let userInfo,
      language = '中文';
    try {
      userInfo = JSON.parse(getItem('userInfo'));
      if (!userInfo) {
        language = getItem('language') || '中文';
        setItem('language', language);
      } else {
        language = userInfo.UserInfo.EMP_LANGUAGE;
      }
    } catch (err) {}

    let localeAntd = zh_CN_antd;
    let locale = 'zh',
      messages = zh_CN;
    if (language === 'English') {
      localeAntd = en_US_antd;
      locale = 'en';
      messages = en_US;
    }

    // 'DESKTOP' or 'WORKBENCH'
    let desktopStyle;
    try {
      desktopStyle = userInfo.UserInfo.EMP_MAINPAGE;
      if (['DESKTOP', 'WORKBENCH'].indexOf(desktopStyle) === -1) {
        // 默认 'WORKBENCH'
        desktopStyle = 'WORKBENCH';
      }
    } catch (err) {}

    if (
      desktopStyle === 'WORKBENCH' &&
      this.state.resId &&
      window.location.href.indexOf('/fnmodule') === -1
    ) {
      const { origin, search } = window.location;
      window.location.href = `${origin}/fnmodule${search}`;
      return;
    }

    return (
      <ErrorBoundary>
        <Provider store={store}>
          <NonsupportIE
            // curIEVersion="ie11"
            supportVersionList={['ie11']}
            reminder={ReminderMsg}
            warningBar={ReactDOM.createPortal(
              <WarningBar
                visible={this.state.warningBarVisible}
                onClose={this.handleCloseWarningBar}
              />,
              document.body
            )}
          >
            <LocaleProvider locale={localeAntd}>
              <IntlProvider locale={locale} messages={messages}>
                <Router>
                  <Switch>
                    {desktopStyle === 'DESKTOP' && (
                      <PrivateRoute exact path="/" component={Desktop} />
                    )}
                    {desktopStyle === 'DESKTOP' && (
                      <PrivateRoute path="/fnmodule" component={GetConfig} />
                    )}
                    {desktopStyle === 'DESKTOP' && (
                      <PrivateRoute path="/reminder" component={Reminder} />
                    )}

                    {desktopStyle === 'WORKBENCH' && (
                      <PrivateRoute exact path="/" component={PageContainer} />
                    )}
                    {desktopStyle === 'WORKBENCH' && (
                      <PrivateRoute
                        path="/fnmodule"
                        component={PageContainer}
                      />
                    )}
                    {desktopStyle === 'WORKBENCH' && (
                      <PrivateRoute
                        path="/reminder"
                        component={PageContainer}
                      />
                    )}
                    {desktopStyle === 'WORKBENCH' && (
                      <PrivateRoute
                        path="/workbench-setting"
                        component={PageContainer}
                      />
                    )}
                    {desktopStyle === 'WORKBENCH' && (
                      <PrivateRoute
                        path="/report-table"
                        component={PageContainer}
                      />
                    )}
                    {desktopStyle === 'WORKBENCH' && (
                      <PrivateRoute
                        path="/person-center"
                        component={PageContainer}
                      />
                    )}

                    {['DESKTOP', 'WORKBENCH'].indexOf(desktopStyle) === -1 && (
                      <PrivateRoute exact path="/" component={PageContainer} />
                    )}

                    <Route path="/login" component={Login} />
                    <Route path="*" component={NotFound} />
                  </Switch>
                </Router>
              </IntlProvider>
            </LocaleProvider>
          </NonsupportIE>
        </Provider>
      </ErrorBoundary>
    );
  }
}

export default App;
