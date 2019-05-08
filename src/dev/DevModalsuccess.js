import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
import {Modal,Button,Input} from 'antd';
// 导入需要开发的组件，如：
// import TableData from 'Common/data/TableData';

class App extends Component {
   constructor(props){
    super(props);
    this.state={
      tel:''
    };
   }
  //  监听电话的变化
   handleTelChange =(value)=>{
     console.log(11111)
     console.log(value);
     this.setState({
       tel:value,
     })
   }
  //  考试问卷的变化
   hanldesubmit=()=>{
    Modal.success({
      title: '提交成功',
      content: (
        <div>
          <p className="thanks">感谢您参与本次问卷调查</p>
            <p>
              恭喜你获得精美礼品一份。请输入手机号凭手机号前去人力资源部领取奖品一份
              <br />
              <Input
                value={this.state.tel}
                onChange={e => {
                  this.handleTelChange(e.target.value);
                }}
              />
            </p>

        </div>
      )
    });
   } 
  render() {
    return <TemplateWrap>
      <Button onClick={this.hanldesubmit}>
        提交
      </Button>
      
    </TemplateWrap>;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
