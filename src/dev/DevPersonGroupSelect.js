import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import PersonGroupSelect from '../components/custom/PersonGroupSelect';

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <PersonGroupSelect></PersonGroupSelect>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
