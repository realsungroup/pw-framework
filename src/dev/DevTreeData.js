import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
// import TableData from 'Common/data/TableData';
import TreeData from 'Common/data/TreeData';

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 600, background: '#fff' }}>
            <TreeData
              resid="417643880834"
              baseURL="http://10.108.2.66:6060//"
              idField="DEP_ID"
              pidField="DEP_PID"
              titleField="DEP_NAME"
              rootNode={{
                title: 'Enterprise',
                key: 0
              }}
            />
          </div>
        </div>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
