import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import RightPointSelect from '../components/custom/RightPointSelect';

class App extends Component {
  state = {
    activeKey: '门禁分组',
    rows: []
  };

  handleChange = (activeKey, rows) => {
    this.setState({ activeKey, rows });
  };

  render() {
    const { activeKey } = this.state;
    return (
      <TemplateWrap>
        <RightPointSelect
          regionIndexCodes={[
            '06155983-b505-4b41-89b1-75cd63ad3cf2',
            'ec25ecfb-388d-4b86-9932-853e8c34474d'
          ]}
          activeKey={activeKey}
          onChange={this.handleChange}
        ></RightPointSelect>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
