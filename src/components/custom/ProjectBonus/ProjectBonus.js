import React, { Component } from 'react';
import {Radio, Button,Icon,Input,Spin,Modal} from 'antd';
import http from '../../../util20/api';
import TableData from '../../common/data/TableData';

 class ProjectBonus extends  Component{
   constructor(props){
    super(props);
    this.state ={}
   }
   render(){
     return (
       <div className='ProjectBonus' style={{width:'100vw',height:'100vh',background:'#fff'}}>
       <TableData
         resid={623607636504}
         hasBeBtns={false}
         hasAdd={true}
         hasDelete={false}
         hasModify={false}
         hasRowDelete={false}
         hasRowModify={false}
         style ={{height:"100%"}}
         refTargetComponentName="TableData"
       />
      </div>
     );
   }
 }


 export default ProjectBonus;
