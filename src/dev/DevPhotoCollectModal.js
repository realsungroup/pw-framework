import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';

// 导入需要开发的组件
import PhotoCollectModal from '../components/custom/PhotoCollectModal';

class DevPhotoCollectModal extends Component {
  render() {
    return (
      <div>
        <PhotoCollectModal
          personRecord={{
            name: '韩明',
            photo: ''
          }}
          visible
        />
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <DevPhotoCollectModal />
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
