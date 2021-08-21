import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import DoorsSelect from '../components/custom/DoorsSelect';

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <DoorsSelect
          regionIndexCodes={[
            '06155983-b505-4b41-89b1-75cd63ad3cf2',
            'ec25ecfb-388d-4b86-9932-853e8c34474d'
          ]}
          // regionIndexCodes={['root000000']}
        ></DoorsSelect>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
