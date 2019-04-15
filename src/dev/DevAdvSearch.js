import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import AdvSearch from '../components/common/ui/AdvSearch';

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <div
          style={{
            width: 600,
            height: 600,
            marginLeft: 20,
            border: '1px solid #000'
          }}
        >
          <AdvSearch
            fields={[
              {
                label: '姓名',
                value: 'name',
                control: 'Input'
              },
              {
                label: '年龄',
                value: 'age',
                control: 'Input'
              }
            ]}
          />
        </div>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
