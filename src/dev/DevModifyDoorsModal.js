import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import ModifyDoorsModal from '../components/custom/ModifyDoorsModal';

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <ModifyDoorsModal
          visible
          record={{
            name: '分组1',
            describe: '分组描述',
            groupId: 682971487808,
            REC_ID: 682971487808
          }}
        ></ModifyDoorsModal>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
