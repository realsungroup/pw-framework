import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import PersonInfoInFile from '../components/custom/PersonInfoInFile';

class App extends Component {
  render() {
    return <TemplateWrap><PersonInfoInFile edit={false}></PersonInfoInFile></TemplateWrap>;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
