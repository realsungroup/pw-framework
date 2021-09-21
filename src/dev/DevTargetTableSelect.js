import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import TargetTableSelect from '../components/custom/CollectTaskDefine/TargetTableSelect';

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <TargetTableSelect />
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
