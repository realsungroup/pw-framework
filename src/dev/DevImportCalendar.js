import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
import Calendar from "ic-components/lib/Calendar";
import 'ic-components/lib/Calendar/style/index.less';
  
// 导入需要开发的组件，如：
// import TableData from 'Common/data/TableData';

class App extends Component {
  render() {
    return <TemplateWrap><Calendar  events={[]}
    
    
     ></Calendar></TemplateWrap>;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
