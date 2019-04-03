import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import BusinessManagement from 'Common/data/BusinessManagement';

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <BusinessManagement
          rootId={308175022132}
          title="标题党"
          enTitle="biaotidang"
        />
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
