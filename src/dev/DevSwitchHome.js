import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';

// 导入需要开发的组件
import SwitchHome from '../pages/components/SwitchHome';

class DevSwitchHome extends Component {
  state = { homeMode: 'DESKTOP' };

  handleSwitch = homeMode => {
    this.setState({ homeMode });
  };

  render() {
    const { homeMode } = this.state;
    return (
      <div>
        <SwitchHome
          homeMode={homeMode}
          onSwitch={this.handleSwitch}
        ></SwitchHome>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <DevSwitchHome />
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
