import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import PersonsSelectByOrg from '../components/custom/PersonsSelectByOrg';

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <PersonsSelectByOrg
          orgIndexCodes={[
            'e548a6fd-00e3-4421-bfbd-6c980fa93509',
            'a915aa72-f001-4b31-9167-019ae64c517c'
          ]}
          // orgIndexCodes={['root000000']}
        ></PersonsSelectByOrg>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
