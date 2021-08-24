import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import ModifyPersonsByOrgModal from '../components/custom/ModifyPersonsByOrgModal';

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <ModifyPersonsByOrgModal
          visible
          record={{
            name: '分组1',
            describe: '111',
            groupId: 683045157730,
            REC_ID: 683045157730
          }}
        ></ModifyPersonsByOrgModal>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
