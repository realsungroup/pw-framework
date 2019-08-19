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
import ReactDOM from 'react-dom';
addLocaleData([...en, ...zh]);

// 自定义 Spin 组件所用图片
Spin.setDefaultIndicator(
  <img style={{ width: 69, height: 75 }} src={loadingGif} alt="" />
);

const style = {
  margin: '0 4px'
};

class TemplateWrapTest extends Component {
  
  
  

  render() {
   
    
    return (
       
          <div>
            <button type="button" >login</button>
            <input></input>
          </div>
           
    );
  }
}

ReactDOM.render(<TemplateWrapTest />, document.getElementById('root'));
