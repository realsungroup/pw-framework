import React, { Component } from 'react';
import { Button, message } from 'antd';
import OrgChartData from 'Common/data/OrgChartData';
import http from 'Util20/api';
import { setItem, getItem } from 'Util20/util';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
// 使用自定义 loading
import loadingGif from '../assets/loading.gif';
import { Spin } from 'antd';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import zh_CN from '../locales/zh-CN';
import en_US from '../locales/en-US';
import { IntlProvider, addLocaleData } from 'react-intl';
addLocaleData([...en, ...zh]);

Spin.setDefaultIndicator(
  <img style={{ width: 69, height: 75 }} src={loadingGif} alt="" />
);
class App extends Component {
  handleLoginClick = async () => {
    const code = 'demo1';
    const password = '66287175';

    let res;
    try {
      res = await http().login({
        Code: code,
        Password: password
      });
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    message.success('登录成功');
    setItem('userInfo', JSON.stringify(res));
  };

  handleClearCache = async () => {
    let res;
    try {
      await http().clearCache();
    } catch (err) {
      console.error(err);
      return message.error(err.message);
    }
    message.success('清除缓存成功');
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

    let locale = 'zh',
      messages = zh_CN;
    if (language === 'English') {
      locale = 'en';
      messages = en_US;
    }

    return (
      <IntlProvider locale={locale} messages={messages}>
        <div style={{ width: '100%', height: '100%' }}>
          <div style={{ width: '100%', height: 800 }}>
            <OrgChartData
              resid={602348115218}
              template="rony"
              chartId="org-chart"
              chartWrapId="org-chart-wrap"
              level={3}
              isExpandAllChildren={true}
              pidField="C3_602347244770"
              idField="C3_602347243263"
              enableDragDrop
              showFields={{
                field_0: 'C3_602347243459',
                field_1: 'C3_602347246317',
                field_2: 'C3_602347244217',
                field_3: 'C3_602347243840',
                field_4: 'C3_602347242079',

                img_0: 'C3_602350177952'
              }}
              recordFormContainerProps={{ width: 500 }}
              rootIds={[61, 67]}
              rootIdsResid={602348168470}
              groupingConfig={[
                {
                  resourceOfTag: '602358161328',
                  sourceColumnOfGroupName: 'C3_602358186727',
                  sourceColumnOfTagName: 'C3_602358186916',
                  columnOfTagName: 'C3_602347242284',
                  isGroupTag: true
                }
              ]}
            />
          </div>
          <Button onClick={this.handleLoginClick} type="primary">
            登录
          </Button>
          <Button onClick={this.handleClearCache} type="primary">
            清除缓存
          </Button>
        </div>
      </IntlProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
