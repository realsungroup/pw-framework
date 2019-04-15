import React, { Component } from 'react';
import {Radio, Button,Icon,Input} from 'antd';
import './Choice.less'

const RadioGroup = Radio.Group;
 class Choice extends  Component{
   constructor(props){
    super(props);
    this.state ={
    };
   }
   render(){
     return (
       <div className='choice'>
          <div><span className="mark">*</span>您对本次活动的满意度</div>
              <RadioGroup onChange={this.radioChange} value={this.state.value}>
                <Radio value={1}>非常满意</Radio><br/>
                <Radio value={2}>一般满意</Radio><br/>
                <Radio value={3}>满意</Radio><br/>
                <Radio value={4}>不满意</Radio><br/>
                <Radio value={5}>其他:<Input className='otherinp' style={{height:18,width:80,}}/></Radio>
              </RadioGroup>
              <div className="choiceActionBox">
              <Button size='small' icon="form">编辑</Button>
              <Button size='small' icon="copy">复制</Button>
              <Button size='small' icon="delete">删除</Button>
              <Button size='small' icon="arrow-up">上移</Button>
              <Button size='small' icon="arrow-down">下移</Button>
              <Button size='small' icon="up-circle">最前</Button>
              <Button size='small' icon="down-circle">最后</Button>
              </div>
       </div>
     );
   }
 }


 export default Choice;