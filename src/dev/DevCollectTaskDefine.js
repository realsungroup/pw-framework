import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import CollectTaskDefine from '../components/custom/CollectTaskDefine';

class App extends Component {
  render() {
    return (
      <TemplateWrap visible={false}>
        <div style={{ height: 500 }}>
          <CollectTaskDefine></CollectTaskDefine>
        </div>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
