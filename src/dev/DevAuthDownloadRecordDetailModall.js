import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import AuthDownloadRecordDetailModal from '../components/custom/AuthDownloadRecordDetailModal';

class App extends Component {
  render() {
    return (
      <TemplateWrap visible={false}>
        <AuthDownloadRecordDetailModal downloadResultId="07ab64418e76b83d8fd81edff2b76279"></AuthDownloadRecordDetailModal>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
