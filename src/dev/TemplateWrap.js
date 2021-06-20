import React, { Component } from 'react';
import {
  Button,
  message,
  LocaleProvider,
  Radio,
  Input,
  Modal,
  Form
} from 'antd';
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
  constructor(props) {
    super(props);
    let baseURL;
    try {
      baseURL = getItem('templateWrapBaseURL');
    } catch (err) {}
    if (!baseURL) {
      baseURL = 'http://ngrok4.realsun.me:6060';
    }
    this.state = {
      visible: false,
      code: 'dem1',
      password: '123456',
      baseURL
    };

    http.setDefaultBaseURL(baseURL);
  }

  handleLoginClick = () => {
    this.setState({ visible: true });
  };

  handleSubmit = async () => {
    const { code, password } = this.state;

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

    if (res.OpResult === 'Y') {
      message.success('登录成功');
      this.setState({ visible: false });
      setItem('userInfo', JSON.stringify(res));
    } else {
      message.error(res.ErrorMsg || '登录失败');
    }
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
    const { visible, baseURL, code, password } = this.state;
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

    const wrapperStyle = {
      marginTop: 8
    };

    return (
      <LocaleProvider locale={localeAntd}>
        <IntlProvider locale={locale} messages={messages}>
          <div style={{ height: '100%', width: '100%' }}>
            <div style={wrapperStyle}>
              <span>基地址：</span>
              <Input
                value={baseURL}
                onChange={e => {
                  const value = e.target.value;
                  this.setState({ baseURL: value });
                  http.setDefaultBaseURL(value);
                  setItem('templateWrapBaseURL', value);
                }}
              ></Input>
            </div>
            <div style={wrapperStyle}>
              <Button
                style={style}
                onClick={this.handleLoginClick}
                type="primary"
              >
                登录
              </Button>
            </div>

            <div style={wrapperStyle}>
              <Button
                style={style}
                onClick={this.handleClearCache}
                type="primary"
              >
                清除缓存
              </Button>
            </div>

            <div style={wrapperStyle}>
              <Radio.Group
                style={style}
                value={language}
                onChange={this.handleLanguageSelectChange}
              >
                <Radio.Button value="中文">中文</Radio.Button>
                <Radio.Button value="English">English</Radio.Button>
              </Radio.Group>
            </div>

            <div style={{ marginTop: 16 }}>{this.props.children}</div>
            <Modal
              visible={visible}
              onCancel={() => this.setState({ visible: false })}
              footer={null}
            >
              <Form>
                <Form.Item>
                  <Input
                    value={code}
                    placeholder="用户名"
                    onChange={e => this.setState({ code: e.target.value })}
                  />
                </Form.Item>
                <Form.Item>
                  <Input
                    value={password}
                    placeholder="密码"
                    onChange={e => this.setState({ password: e.target.value })}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.handleSubmit} block>
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </IntlProvider>
      </LocaleProvider>
    );
  }
}

export default TemplateWrap;
