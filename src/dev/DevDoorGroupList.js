import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import DoorGroupList from '../components/custom/DoorGroupList';

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <DoorGroupList></DoorGroupList>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
