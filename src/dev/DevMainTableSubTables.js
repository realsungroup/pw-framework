import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import MainTableSubTables from '../components/common/data/MainTableSubTables';

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <MainTableSubTables
          resid={424358078333}
          style={{
            width: 800,
            // height: 600,
            overflow: 'auto',
            margin: '0 auto'
          }}
          mainTableProps={{
            hasAdd: false
          }}
          subTablesProps={{
            311025002785: {
              hasAdd: false,
              hasDelete: false
            }
          }}
        ></MainTableSubTables>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
