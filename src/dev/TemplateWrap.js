import React, { Component } from 'react';
import { Button, message, LocaleProvider, Radio } from 'antd';
import http from 'Util20/api';
import { setItem, getItem } from 'Util20/util';
// 使用自定义 loading
import loadingGif from '../assets/loading.gif';
import { Spin } from 'antd';

// antd 组件国际化
import zh_CN_antd from 'antd/lib/locale-provider/zh_CN';
import en_US_antd from 'antd/lib/locale-provider/en_US';
import 'moment/locale/zh-cn';

// 业务文案国际化
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import zh_CN from '../locales/zh-CN';
import en_US from '../locales/en-US';
import { IntlProvider, addLocaleData } from 'react-intl';

import '../antd-media.less';
import './TemplateWrap.less';

addLocaleData([...en, ...zh]);

// 自定义 Spin 组件所用图片
Spin.setDefaultIndicator(
  <img style={{ width: 69, height: 75 }} src={loadingGif} alt="" />
);

const style = {
  margin: '0 4px'
};

class TemplateWrap extends Component {
  handleLoginClick = async () => {
    const code = '20465';
    const password = 'xxh@20465';

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

  handleLanguageSelectChange = value => {
    value = value.target.value;
    setItem('language', value);
    document.location.href = '/';
  };

  render() {
    // 国际化
    const language = getItem('language') || '中文';
    setItem('language', language);

    let localeAntd = zh_CN_antd;
    let locale = 'zh',
      messages = zh_CN;
    if (language === 'English') {
      localeAntd = en_US_antd;
      locale = 'en';
      messages = en_US;
    }

    return (
      <LocaleProvider locale={localeAntd}>
        <IntlProvider locale={locale} messages={messages}>
          <div style={{ height: '100%', width: '100%' }}>
            <Button
              style={style}
              onClick={this.handleLoginClick}
              type="primary"
            >
              登录
            </Button>
            <Button
              style={style}
              onClick={this.handleClearCache}
              type="primary"
            >
              清除缓存
            </Button>
            <Radio.Group
              style={style}
              value={language}
              onChange={this.handleLanguageSelectChange}
            >
              <Radio.Button value="中文">中文</Radio.Button>
              <Radio.Button value="English">English</Radio.Button>
            </Radio.Group>
            <div style={{ marginTop: 16 }}>{this.props.children}</div>
          </div>
        </IntlProvider>
      </LocaleProvider>
    );
  }
}

export default TemplateWrap;
