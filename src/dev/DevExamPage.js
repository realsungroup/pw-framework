import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
// import TableData from 'Common/data/TableData';
import ExamPage from '../components/custom/ExamPage'

class App extends Component {
  render() {
    return <TemplateWrap>
      <ExamPage></ExamPage>
    </TemplateWrap>;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
