import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import ModifyDoorsModal from '../components/custom/ModifyDoorsModal';

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <ModifyDoorsModal
          visible
          record={{
            REC_OFF: null,
            REC_QUARTER: 3,
            REC_EDTTIME: '2021-09-20 10:40:54',
            REC_CRTTIME: '2021-09-20 10:40:54',
            REC_SHNAME: null,
            REC_DEP2: '0',
            name: '测试1',
            describe: '测试1描述！',
            REC_DEP4: '0',
            REC_YEAR: 2021,
            REC_ID: 685449654481,
            REC_SHTIME: null,
            REC_DATE: '2021-09-20 00:00:00',
            REC_WEEK: 39,
            groupId: '685449654481',
            REC_EDTID: 'demo',
            REC_DEP1: '2000',
            REC_SH: null,
            REC_DEP3: '0',
            REC_ON: null,
            REC_RESID: 682507600534,
            REC_YM: 202109,
            REC_MONTH: 9,
            REC_CLOSE: null,
            REC_CRTID: 'demo'
          }}
        ></ModifyDoorsModal>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
