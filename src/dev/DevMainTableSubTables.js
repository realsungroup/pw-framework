import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
// 导入需要开发的组件，如：
import MainTableSubTables from '../components/common/data/MainTableSubTables';

const props = {
  baseURL: 'http://ngrok5.realsun.me:6060',
  downloadBaseURL: 'http://10.108.2.66:80/',
  resid: 483136878846,
  mainTableProps:{
    actionBarWidth: 200,
    hasAdd: true,
    hasBeBtns: true,
    hasModify: true,
    hasBackBtn: true,
    hasDelete: true,
    hasRowModify: true,
    hasRowView: true,
    hasRowDelete: true,
    addText:'新建审核',
    formProps: {
      // height: 500
    },
    subtractH: 240
  },
  subTablesProps: {
    526569913543:{
      hasBeBtns: true,
      isUseFormDefine:false
    },
    528384647857:{
      hasBeBtns: true,
      isUseFormDefine:false
    },
    483143248907: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    483143269379: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    483143292739: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    483143313607: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    490441845783: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    490441985369: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    490442033277: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    490442082614: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    490442208450: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    490442251347: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    490442311854: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    490442351603: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    490442367584: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    490442379053: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    490442394231: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    490442407188: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533377990246: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533378160861: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533378175759: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533378198800: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533378212840: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533378238689: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533378256722: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533378269639: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533378289607: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533378309262: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533378346468: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533378368276: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533378381536: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533378397713: {
      hasBeBtns: true,
      isUseFormDefine:false
    },
    533378418165: {
      hasBeBtns: true,
      isUseFormDefine:false
    }
  }
}

class App extends Component {
  render() {
    return (
      <TemplateWrap>
        <MainTableSubTables {...props}></MainTableSubTables>
      </TemplateWrap>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
