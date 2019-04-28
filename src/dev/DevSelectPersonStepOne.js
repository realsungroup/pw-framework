import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from '../serviceWorker';
import TemplateWrap from './TemplateWrap';
import { Steps ,Radio} from 'antd';
const Step = Steps.Step;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
// 导入需要开发的组件，如：
// import TableData from 'Common/data/TableData';


// 

class App extends Component {
  constructor(props){
    super(props);
    this.state= {
      curNav:'部门'
    };
  }

  // 选择导航向值的变化
  hanldeCurrentNavChange = (value)=>{
    console.log(value);
    this.setState({
      curNav:value,
    })
  }


  render() {
    return <TemplateWrap>
      <div className='fisrtStep'  style={{width:'80%',margin:'0  auto'}}>
      <div className="navSteps">
       <Steps>
         <Step title="选择人员"></Step>
         <Step title="验证"></Step>
       </Steps>
       </div>
       <div className='navBtns' style={{marginTop:10}}>
         <RadioGroup onChange={(e)=>{this.hanldeCurrentNavChange(e.target.value)}} value={this.state.curNav}> 
           <RadioButton value={'部门'}>按部门</RadioButton>
           <RadioButton value={'级别'}>按级别</RadioButton>
           <RadioButton value={'所在地'}>按所在地</RadioButton>
         </RadioGroup>
       </div>
       </div>
    </TemplateWrap>;
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
