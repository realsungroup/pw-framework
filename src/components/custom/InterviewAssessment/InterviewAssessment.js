import React, { Component } from 'react';
import {
  Button
} from 'antd';
import './InterviewAssessment.less';
class InterviewAssessment extends React.Component {
  constructor() {
    super();
    this.state = {
        name:'张三',
        position:'HR',
        level:'g3',
        hiringManger:'李四',
        interviewer:'王五',
        interviewer2:'赵六',
        chara:6,
        eduOther:'',
        graFrom:'',
        workExp:'',
        wkOther:'',
        groupInter:'',
        p4r:'',
        hiOther:'',
        secRound:'',
        eduBack:'',
        wkExp:'',
        lanSki:'',
        SRI:'',
        GHB:'',

        vIT:'',
        vLA:'',
        vCF:'',
        vDR:'',

        // T1
        vTS:'',
        vEA:'',
        vTE:'',
        vAO:'',
        vPS:'',
        vSd:'',
        vLF:'',
        // T5
        vTS2:'',
        vTO:'',
        vTD:'',
        vTE2:'',
        vCr:'',
        vSA:'',
        vPrA:'',
        // T6
        vTS3:'',
        vTO2:'',
        vTC:'',
        vTE3:'',
        vDwA:'',
        vIM:'',
        vStrA:'',
        //S5
        vTS4:'',
        vAO2:'',
        vPS2:'',
        vSd2:'',
        vLF2:'',
        //S6
        vTS5:'',
        vAO3:'',
        vPS3:'',
        vDO:'',
        vCDR:'',
        //S9
        vTS6:'',
        vDevO:'',
        vPlan:'',
        vOrg:'',
        vPriS:'',
        vMMW:'',
        // S10
        vTS7:'',
        vvBET:'',
        vPM:'',
        vMoOt:'',
        vCM:'',

    }
  }
  handlechange(key,val,ref){

        this.setState({
            [key]:val.target.value   
        })
        // 解决radio打印不出选中项的问题
        if(ref){
          if(document.getElementById(ref).checked==true){
            document.getElementById(ref).defaultChecked=true
          }else{
            document.getElementById(ref).defaultChecked=false
          }
        }

    }
  componentDidMount(){
    var mydate = new Date();
    var yy = mydate.getFullYear();
    var mm = mydate.getMonth()+1;
    var dd = mydate.getDate();
    this.setState({newdate:yy+'-'+mm+'-'+dd});
    this.setState({interviewer:'张三'});
    this.setState({interviewer2:'李四'});
    if(this.state.chara==0){
      this.refs.T1.classList.remove('hidden')
    }else if(this.state.chara==1){
      this.refs.T5.classList.remove('hidden')
    }else if(this.state.chara==2){
      this.refs.T6.classList.remove('hidden')
    }else if(this.state.chara==3){
      this.refs.S5.classList.remove('hidden')
    }else if(this.state.chara==4){
      this.refs.S6.classList.remove('hidden')
    }else if(this.state.chara==5){
      this.refs.S9.classList.remove('hidden')
    }else if(this.state.chara==6){
      this.refs.S10.classList.remove('hidden')
    }
  }
  onPrinting = () => {
    const bodyHtml = window.document.body.innerHTML;

     var footstr = "</body>";
     var newstr = document.getElementById('toPrint').innerHTML;

     var style="<style>.wrap div rect:last-child{border-bottom:none;}ul{padding:0}.hidden{display:none;}h4{margin:0}.wrap{background: #fff;height:1191px;width:842px}h3{text-align:center;margin-top:8px;width:842px;}img{width:120px}ul{list-style: none; overflow: hidden;width:100%;margin-top: 16px;}ul li{width:25%;float:left;overflow: hidden; }ul li b{display: block;float: left;width:50%;}ul li p{width: 50%;float: left;margin:0;} ul li span{font-weight: bold;}rect{display: block;width:842px;border-top:1px solid #000;border-left:1px solid #000;overflow: hidden;box-sizing:border-box;}cell{float:left;display: block;border-right:1px solid #000;padding:10px; min-height:38px;box-sizing: border-box;}cell b{width:100%;font-size: 12px;display: block;}cell:first-child{width:25%;}cell:last-child{width:75%;}input{margin-right:8px;}cell label{margin-right:16px;}cell:last-child b{width:auto;display:inline-block;}cell .fillText{width:104px;font-size: 12px;outline:none;border:none;border-bottom:1px solid #000;}.byline b{padding-top:5px;padding-bottom:5px;}.uniline{padding-top:16px;padding-bottom:19px;}.triSlice cell:nth-child(3){width:40%;height:38px;}.triSlice cell:nth-child(3) b{position:relative;top:-2px;}.triSlice cell:nth-child(2){width:35%;}.alter1 cell:first-child b{padding-top:10px;padding-bottom:11px;}.alter1 cell:nth-child(2){padding:0; width:35%;}.alter1 cell:nth-child(3){width:40%;padding:0;}.alter1 cell:nth-child(2) b,.alter1 cell:nth-child(3) b{padding:0;line-height:25px;border-bottom:1px solid #000;display:block;width:100%;text-indent:10px;}.alter1 cell b:last-child{border:none;}.alter2 cell:first-child{padding-top:23px;padding-bottom:23px;}.wholeLine{width:100%;padding:10px;border-right:1px solid #000;}textarea{width:100%;border:none;outline:none;height:31px!important;resize:none;}.alter3{padding-top:25px;padding-bottom:26px;}.alterFill{ margin-left: 8px;margin-right: 24px;}h4{text-align: center;}.alter4{padding-top:32px;padding-bottom:33px;}rect:last-child{ border-bottom:1px solid #000;}.GIC{height:56px!important;}.alter5{padding-top:22px;padding-bottom:23px; }.alter6 cell:nth-child(1) b{padding:0; } .alter6 cell:nth-child(2) b{ padding-top:15px;padding-bottom:16px;}.alter6 cell:nth-child(3){padding-top:15px; padding-bottom:16px;}.alter7 cell:nth-child(1) b{padding-top:23px;padding-bottom:24px;}</style>"

     var headstr = "<html><head><title></title>"+style+"</head><body>";
     document.body.innerHTML = headstr + newstr + footstr;
     window.print();
    window.document.body.innerHTML = bodyHtml;
    window.location.reload();
  };
  render() {
    return (
      <div className='IA'>
        <Button type='primary'>保存</Button>
        <Button onClick={this.onPrinting}>打印</Button>
        <div id='toPrint' ref={p => (this.printer = p)}>
          <div className='wrap'>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAA1CAYAAABiKw8nAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNTgzQkQzQjIzQUExMUU5QTlFMEIwOTExQjRGOEI4MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowNTgzQkQzQzIzQUExMUU5QTlFMEIwOTExQjRGOEI4MiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA1ODNCRDM5MjNBQTExRTlBOUUwQjA5MTFCNEY4QjgyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA1ODNCRDNBMjNBQTExRTlBOUUwQjA5MTFCNEY4QjgyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+teLRYwAADlxJREFUeNrsXQu4VUUV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"/>
            <h3>面试评估表 <br/> Interview Assessment</h3>
            <ul>
              <li>
                <b>应聘者姓名</b><p> {this.state.name}</p>
                <span>Name of Interviewee</span>
              </li>
              <li>
                <b>应聘职位</b><p> {this.state.position}</p>
                <span>Position</span>
              </li>
              <li>
                <b>级别</b><p> {this.state.level}</p>
                <span>Name of Interviewee</span>
              </li>
              <li>
                <b>岗位招聘经理</b><p> {this.state.hiringManger}</p>
                <span>Hiring Manger</span>
              </li>
            </ul>
            <rect>
              <cell>
                <b>面试官/Intervieweer</b>
              </cell>
              <cell>
              </cell>
            </rect>
            <rect>
              <cell className='byline'>
                <b>教育背景/<br/>Education Background</b>
              </cell>
              <cell>
                <input type='radio' value='bachelor' name='eb' checked={this.state.eduBack=='bachelor'?'checked':''} onChange={v=>{this.handlechange("eduBack",v,'bachelor')}} id='bachelor'/><label for='bachelor'>Bachelor 本科</label>
                <input type='radio' value='master' name='eb' checked={this.state.eduBack=='master'?'checked':''} onChange={v=>{this.handlechange("eduBack",v,'master')}} id='master'/><label for='master'>Master 硕士</label>
                <input type='radio' value='doctor' name='eb' checked={this.state.eduBack=='doctor'?'checked':''} onChange={v=>{this.handlechange("eduBack",v,'doctor')}} id='doctor'/><label for='doctor'>Doctor 博士</label>
                <input type='radio' value='otherEb' name='eb' checked={this.state.eduBack=='otherEb'?'checked':''} onChange={v=>{this.handlechange("eduBack",v,'otherEb')}} id='otherEb'/><label for='other'>Other 其他</label>
                <input type='text'className='fillText' value={this.state.eduOther} onChange={v=>{this.handlechange("eduOther",v)}}/>
                <br/>
                <b>Graduated from 毕业学校：</b>
                <input type='text'className='fillText' value={this.state.graFrom} onChange={v=>{this.handlechange("graFrom",v)}}/>
              </cell>
            </rect>
            <rect>
              <cell className='byline'>
                <b>工作经验/<br/>Work Experience</b>
              </cell>
              <cell>
                <input type='number'min='0'className='fillText' value={this.state.workExp} onChange={v=>{this.handlechange("workExp",v)}}/><b>Years 年</b>
                <br/>
                <input type='radio' name='we' id='Huawei' value='Huawei' checked={this.state.wkExp=='Huawei'?'checked':''} onChange={v=>{this.handlechange("wkExp",v,'Huawei')}}/><label for='Huawei'>Huawei</label>
                <input type='radio' name='we' id='Innolight' value='Innolight' checked={this.state.wkExp=='Innolight'?'checked':''} onChange={v=>{this.handlechange("wkExp",v,'Innolight')}}/><label for='Innolight'>Innolight</label>
                <input type='radio' name='we' id='Accelink' value='Accelink' checked={this.state.wkExp=='Accelink'?'checked':''} onChange={v=>{this.handlechange("wkExp",v,'Accelink')}}/><label for='Accelink'>Accelink</label>
                <input type='radio' name='we' id='Neophotonics' value='Neophotonics' checked={this.state.wkExp=='Neophotonics'?'checked':''} onChange={v=>{this.handlechange("wkExp",v,'Neophotonics')}}/><label for='Neophotonics'>Neophotonics</label>
                <input type='radio' name='we' id='otherWe' value='otherWe' checked={this.state.wkExp=='otherWe'?'checked':''} onChange={v=>{this.handlechange("wkExp",v,'otherWe')}}/><label for='other'>Other 其他</label>
                <input type='text'className='fillText' value={this.state.wkOther} onChange={v=>{this.handlechange("wkOther",v)}}/>

              </cell>
            </rect>
            <rect>
              <cell>
                <b>英语技能/<br/>Language Skills</b>
              </cell>
              <cell className='uniline'>
                <input type='radio' name='ls' id='basic' value='basic' checked={this.state.lanSki=='basic'?'checked':''} onChange={v=>{this.handlechange("lanSki",v,'basic')}}/><label for='basic'>Basic</label>
                <input type='radio' name='ls' id='communicative' value='communicative' checked={this.state.lanSki=='communicative'?'checked':''} onChange={v=>{this.handlechange("lanSki",v,'communicative')}}/><label for='communicative'>Communicative</label>
                <input type='radio' name='ls' id='fluent' value='fluent' checked={this.state.lanSki=='fluent'?'checked':''} onChange={v=>{this.handlechange("lanSki",v,'fluent')}}/><label for='fluent'>Fluent</label>
                <input type='radio' name='ls' id='professional' value='professional' checked={this.state.lanSki=='professional'?'checked':''} onChange={v=>{this.handlechange("lanSki",v,'professional')}}/><label for='professional'>Professional</label>
                <input type='radio' name='ls' id='native' value='native' checked={this.state.lanSki=='native'?'checked':''} onChange={v=>{this.handlechange("lanSki",v,'native')}}/><label for='native'>Native</label>

              </cell>
            </rect>
            <rect className='triSlice'>
              <cell>
                <b>项目/Items</b>
              </cell>
              <cell>
                <b>评估因素/Factors</b>
              </cell>
              <cell>
                <b>得分/Items</b>
              </cell>
            </rect>
        <div className='hidden' ref='T1'>
            <rect className='alter1'>
              <cell>
                <b>
                  技术胜任力<br/>Technical Competency
                </b>
              </cell>
              <cell>
                <b>专业技术/Technical Skills</b>
                <b>执行力/Executive Ability</b>
                <b>技术交流/Technical Exchange</b>
              </cell>
              <cell>
                <b>
                  <input type='radio' name='vTS' id='vTS1' value='1' checked={this.state.vTS=='1'?'checked':''} onChange={v=>{this.handlechange("vTS",v,'vTS1')}}/><label for='vTS1'>1</label>

                  <input type='radio' name='vTS' id='vTS2' value='2' checked={this.state.vTS=='2'?'checked':''} onChange={v=>{this.handlechange("vTS",v,'vTS2')}}/><label for='vTS2'>2</label>

                  <input type='radio' name='vTS' id='vTS3' value='3' checked={this.state.vTS=='3'?'checked':''} onChange={v=>{this.handlechange("vTS",v,'vTS3')}}/><label for='vTS3'>3</label>

                  <input type='radio' name='vTS' id='vTS4' value='4' checked={this.state.vTS=='4'?'checked':''} onChange={v=>{this.handlechange("vTS",v,'vTS4')}}/><label for='vTS4'>4</label>

                  <input type='radio' name='vTS' id='vTS5' value='5' checked={this.state.vTS=='5'?'checked':''} onChange={v=>{this.handlechange("vTS",v,'vTS5')}}/><label for='vTS5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vEA' id='vEA1' value='1' checked={this.state.vEA=='1'?'checked':''} onChange={v=>{this.handlechange("vEA",v,'vEA1')}}/><label for='vEA1'>1</label>

                  <input type='radio' name='vEA' id='vEA2' value='2' checked={this.state.vEA=='2'?'checked':''} onChange={v=>{this.handlechange("vEA",v,'vEA2')}}/><label for='vEA2'>2</label>

                  <input type='radio' name='vEA' id='vEA3' value='3' checked={this.state.vEA=='3'?'checked':''} onChange={v=>{this.handlechange("vEA",v,'vEA3')}}/><label for='vEA3'>3</label>

                  <input type='radio' name='vEA' id='vEA4' value='4' checked={this.state.vEA=='4'?'checked':''} onChange={v=>{this.handlechange("vEA",v,'vEA4')}}/><label for='vEA4'>4</label>

                  <input type='radio' name='vEA' id='vEA5' value='5' checked={this.state.vEA=='5'?'checked':''} onChange={v=>{this.handlechange("vEA",v,'vEA5')}}/><label for='vEA5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vTE' id='vTE1' value='1' checked={this.state.vTE=='1'?'checked':''} onChange={v=>{this.handlechange("vTE",v,'vTE1')}}/><label for='vTE1'>1</label>

                  <input type='radio' name='vTE' id='vTE2' value='2' checked={this.state.vTE=='2'?'checked':''} onChange={v=>{this.handlechange("vTE",v,'vTE2')}}/><label for='vTE2'>2</label>

                  <input type='radio' name='vTE' id='vTE3' value='3' checked={this.state.vTE=='3'?'checked':''} onChange={v=>{this.handlechange("vTE",v,'vTE3')}}/><label for='vTE3'>3</label>

                  <input type='radio' name='vTE' id='vTE4' value='4' checked={this.state.vTE=='4'?'checked':''} onChange={v=>{this.handlechange("vTE",v,'vTE4')}}/><label for='vTE4'>4</label>

                  <input type='radio' name='vTE' id='vTE5' value='5' checked={this.state.vTE=='5'?'checked':''} onChange={v=>{this.handlechange("vEA",v,'vTE5')}}/><label for='vTE5'>5</label>
                </b>
              </cell>
            </rect>
            <rect className='alter1 alter2'>
              <cell>
                <b>
                  岗位胜任力<br/>Technical Competency
                </b>
              </cell>
              <cell>
                <b>以行动为导向/Action Oriented</b>
                <b>解决问题/Problem Solving</b>
                <b>自我发展/Self-development</b>
                <b>及时学习/Learning on the Fly</b>
              </cell>
              <cell>
                <b>
                  <input type='radio' name='vAO' id='vAO1' value='1' checked={this.state.vAO=='1'?'checked':''} onChange={v=>{this.handlechange("vAO",v,'vAO1')}}/><label for='vAO1'>1</label>

                  <input type='radio' name='vAO' id='vAO2' value='2' checked={this.state.vAO=='2'?'checked':''} onChange={v=>{this.handlechange("vAO",v,'vAO2')}}/><label for='vAO2'>2</label>

                  <input type='radio' name='vAO' id='vAO3' value='3' checked={this.state.vAO=='3'?'checked':''} onChange={v=>{this.handlechange("vAO",v,'vAO3')}}/><label for='vAO3'>3</label>

                  <input type='radio' name='vAO' id='vAO4' value='4' checked={this.state.vAO=='4'?'checked':''} onChange={v=>{this.handlechange("vAO",v,'vAO4')}}/><label for='vAO4'>4</label>

                  <input type='radio' name='vAO' id='vAO5' value='5' checked={this.state.vAO=='5'?'checked':''} onChange={v=>{this.handlechange("vAO",v,'vAO5')}}/><label for='vAO5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPS' id='vPS1' value='1' checked={this.state.vPS=='1'?'checked':''} onChange={v=>{this.handlechange("vPS",v,'vPS1')}}/><label for='vPS1'>1</label>

                  <input type='radio' name='vPS' id='vPS2' value='2' checked={this.state.vPS=='2'?'checked':''} onChange={v=>{this.handlechange("vPS",v,'vPS2')}}/><label for='vPS2'>2</label>

                  <input type='radio' name='vPS' id='vPS3' value='3' checked={this.state.vPS=='3'?'checked':''} onChange={v=>{this.handlechange("vPS",v,'vPS3')}}/><label for='vPS3'>3</label>

                  <input type='radio' name='vPS' id='vPS4' value='4' checked={this.state.vPS=='4'?'checked':''} onChange={v=>{this.handlechange("vPS",v,'vPS4')}}/><label for='vPS4'>4</label>

                  <input type='radio' name='vPS' id='vPS5' value='5' checked={this.state.vPS=='5'?'checked':''} onChange={v=>{this.handlechange("vPS",v,'vPS5')}}/><label for='vPS5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vSd' id='vSd1' value='1' checked={this.state.vSd=='1'?'checked':''} onChange={v=>{this.handlechange("vSd",v,'vSd1')}}/><label for='vSd1'>1</label>

                  <input type='radio' name='vSd' id='vSd2' value='2' checked={this.state.vSd=='2'?'checked':''} onChange={v=>{this.handlechange("vSd",v,'vSd1')}}/><label for='vSd2'>2</label>

                  <input type='radio' name='vSd' id='vSd3' value='3' checked={this.state.vSd=='3'?'checked':''} onChange={v=>{this.handlechange("vSd",v,'vSd1')}}/><label for='vSd3'>3</label>

                  <input type='radio' name='vSd' id='vSd4' value='4' checked={this.state.vSd=='4'?'checked':''} onChange={v=>{this.handlechange("vSd",v,'vSd1')}}/><label for='vSd4'>4</label>

                  <input type='radio' name='vSd' id='vSd5' value='5' checked={this.state.vSd=='5'?'checked':''} onChange={v=>{this.handlechange("vSd",v,'vSd1')}}/><label for='vSd5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vLF' id='vLF1' value='1' checked={this.state.vLF=='1'?'checked':''} onChange={v=>{this.handlechange("vLF",v,'vLF1')}}/><label for='vLF1'>1</label>

                  <input type='radio' name='vLF' id='vLF2' value='2' checked={this.state.vLF=='2'?'checked':''} onChange={v=>{this.handlechange("vLF",v,'vLF2')}}/><label for='vLF2'>2</label>

                  <input type='radio' name='vLF' id='vLF3' value='3' checked={this.state.vLF=='3'?'checked':''} onChange={v=>{this.handlechange("vLF",v,'vLF3')}}/><label for='vLF3'>3</label>

                  <input type='radio' name='vLF' id='vLF4' value='4' checked={this.state.vLF=='4'?'checked':''} onChange={v=>{this.handlechange("vLF",v,'vLF4')}}/><label for='vLF4'>4</label>

                  <input type='radio' name='vLF' id='vLF5' value='5' checked={this.state.vLF=='5'?'checked':''} onChange={v=>{this.handlechange("vLF",v,'vLF5')}}/><label for='vLF5'>5</label>
                </b>
              </cell>
            </rect>
          </div>

          <div ref='T5' className='hidden'>
            <rect className='alter1 alter2'>
              <cell>
                <b>
                  技术胜任力<br/>Technical Competency
                </b>
              </cell>
              <cell>
                <b>专业技术/Technical Skills</b>
                <b>技术全局观/Technical Outlook</b>
                <b>技术分解/Technical Decomposition</b>
                <b>技术交流/Technical Exchange</b>
              </cell>
              <cell>
                <b>
                  <input type='radio' name='vTS2' id='vTS6' value='1' checked={this.state.vTS2=='1'?'checked':''} onChange={v=>{this.handlechange("vTS2",v,'vTS6')}}/><label for='vTS6'>1</label>

                  <input type='radio' name='vTS2' id='vTS7' value='2' checked={this.state.vTS2=='2'?'checked':''} onChange={v=>{this.handlechange("vTS2",v,'vTS7')}}/><label for='vTS7'>2</label>

                  <input type='radio' name='vTS2' id='vTS8' value='3' checked={this.state.vTS2=='3'?'checked':''} onChange={v=>{this.handlechange("vTS2",v,'vTS8')}}/><label for='vTS8'>3</label>

                  <input type='radio' name='vTS2' id='vTS9' value='4' checked={this.state.vTS2=='4'?'checked':''} onChange={v=>{this.handlechange("vTS2",v,'vTS9')}}/><label for='vTS9'>4</label>

                  <input type='radio' name='vTS2' id='vTS10' value='5' checked={this.state.vTS2=='5'?'checked':''} onChange={v=>{this.handlechange("vTS2",v,'vTS10')}}/><label for='vTS10'>5</label>
                </b>
                <b>
                  <input type='radio' name='vTO' id='vTO1' value='1' checked={this.state.vTO=='1'?'checked':''} onChange={v=>{this.handlechange("vTO",v,'vTO1')}}/><label for='vTO1'>1</label>

                  <input type='radio' name='vTO' id='vTO2' value='2' checked={this.state.vTO=='2'?'checked':''} onChange={v=>{this.handlechange("vTO",v,'vTO2')}}/><label for='vTO2'>2</label>

                  <input type='radio' name='vTO' id='vTO3' value='3' checked={this.state.vTO=='3'?'checked':''} onChange={v=>{this.handlechange("vTO",v,'vTO3')}}/><label for='vTO3'>3</label>

                  <input type='radio' name='vTO' id='vTO4' value='4' checked={this.state.vTO=='4'?'checked':''} onChange={v=>{this.handlechange("vTO",v,'vTO4')}}/><label for='vTO4'>4</label>

                  <input type='radio' name='vTO' id='vTO5' value='5' checked={this.state.vTO=='5'?'checked':''} onChange={v=>{this.handlechange("vTO",v,'vTO5')}}/><label for='vTO5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vTD' id='vTD1' value='1' checked={this.state.vTD=='1'?'checked':''} onChange={v=>{this.handlechange("vTD",v,'vTD1')}}/><label for='vTD1'>1</label>

                  <input type='radio' name='vTD' id='vTD2' value='2' checked={this.state.vTD=='2'?'checked':''} onChange={v=>{this.handlechange("vTD",v,'vTD2')}}/><label for='vTD2'>2</label>

                  <input type='radio' name='vTD' id='vTD3' value='3' checked={this.state.vTD=='3'?'checked':''} onChange={v=>{this.handlechange("vTD",v,'vTD3')}}/><label for='vTD3'>3</label>

                  <input type='radio' name='vTD' id='vTD4' value='4' checked={this.state.vTD=='4'?'checked':''} onChange={v=>{this.handlechange("vTD",v,'vTD4')}}/><label for='vTD4'>4</label>

                  <input type='radio' name='vTD' id='vTD5' value='5' checked={this.state.vTD=='5'?'checked':''} onChange={v=>{this.handlechange("vTD",v,'vTD5')}}/><label for='vTD5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vTE2' id='vTE6' value='1' checked={this.state.vTE2=='1'?'checked':''} onChange={v=>{this.handlechange("vTE2",v,'vTE6')}}/><label for='vTE6'>1</label>

                  <input type='radio' name='vTE2' id='vTE7' value='2' checked={this.state.vTE2=='2'?'checked':''} onChange={v=>{this.handlechange("vTE2",v,'vTE7')}}/><label for='vTE7'>2</label>

                  <input type='radio' name='vTE2' id='vTE8' value='3' checked={this.state.vTE2=='3'?'checked':''} onChange={v=>{this.handlechange("vTE2",v,'vTE8')}}/><label for='vTE8'>3</label>

                  <input type='radio' name='vTE2' id='vTE9' value='4' checked={this.state.vTE2=='4'?'checked':''} onChange={v=>{this.handlechange("vTE2",v,'vTE9')}}/><label for='vTE9'>4</label>

                  <input type='radio' name='vTE2' id='vTE10' value='5' checked={this.state.vTE2=='5'?'checked':''} onChange={v=>{this.handlechange("vTE2",v,'vTE10')}}/><label for='vTE10'>5</label>
                </b>
              </cell>
            </rect>
            <rect className='alter1'>
              <cell>
                <b>
                  岗位胜任力<br/>Technical Competency
                </b>
              </cell>
              <cell>
                <b>创造力/Creativity</b>
                <b>独当一面/Standing Alone</b>
                <b>确定轻重缓急/Priority Setting</b>
              </cell>
              <cell>
                <b>
                  <input type='radio' name='vCr' id='vCr1' value='1' checked={this.state.vCr=='1'?'checked':''} onChange={v=>{this.handlechange("vCr",v,'vCr1')}}/><label for='vCr1'>1</label>

                  <input type='radio' name='vCr' id='vCr2' value='2' checked={this.state.vCr=='2'?'checked':''} onChange={v=>{this.handlechange("vCr",v,'vCr2')}}/><label for='vCr2'>2</label>

                  <input type='radio' name='vCr' id='vCr3' value='3' checked={this.state.vCr=='3'?'checked':''} onChange={v=>{this.handlechange("vCr",v,'vCr3')}}/><label for='vCr3'>3</label>

                  <input type='radio' name='vCr' id='vCr4' value='4' checked={this.state.vCr=='4'?'checked':''} onChange={v=>{this.handlechange("vCr",v,'vCr4')}}/><label for='vCr4'>4</label>

                  <input type='radio' name='vCr' id='vCr5' value='5' checked={this.state.vCr=='5'?'checked':''} onChange={v=>{this.handlechange("vCr",v,'vCr5')}}/><label for='vCr5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vSA' id='vSA1' value='1' checked={this.state.vSA=='1'?'checked':''} onChange={v=>{this.handlechange("vSA",v,'vSA1')}}/><label for='vSA1'>1</label>

                  <input type='radio' name='vSA' id='vSA2' value='2' checked={this.state.vSA=='2'?'checked':''} onChange={v=>{this.handlechange("vSA",v,'vSA2')}}/><label for='vSA2'>2</label>

                  <input type='radio' name='vSA' id='vSA3' value='3' checked={this.state.vSA=='3'?'checked':''} onChange={v=>{this.handlechange("vSA",v,'vSA3')}}/><label for='vSA3'>3</label>

                  <input type='radio' name='vSA' id='vSA4' value='4' checked={this.state.vSA=='4'?'checked':''} onChange={v=>{this.handlechange("vSA",v,'vSA4')}}/><label for='vSA4'>4</label>

                  <input type='radio' name='vSA' id='vSA5' value='5' checked={this.state.vSA=='5'?'checked':''} onChange={v=>{this.handlechange("vSA",v,'vSA5')}}/><label for='vSA5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPrA' id='vPrA1' value='1' checked={this.state.vPrA=='1'?'checked':''} onChange={v=>{this.handlechange("vPrA",v,'vPrA1')}}/><label for='vPrA1'>1</label>

                  <input type='radio' name='vPrA' id='vPrA2' value='2' checked={this.state.vPrA=='2'?'checked':''} onChange={v=>{this.handlechange("vPrA",v,'vPrA2')}}/><label for='vPrA2'>2</label>

                  <input type='radio' name='vPrA' id='vPrA3' value='3' checked={this.state.vPrA=='3'?'checked':''} onChange={v=>{this.handlechange("vPrA",v,'vPrA3')}}/><label for='vPrA3'>3</label>

                  <input type='radio' name='vPrA' id='vPrA4' value='4' checked={this.state.vPrA=='4'?'checked':''} onChange={v=>{this.handlechange("vPrA",v,'vPrA4')}}/><label for='vPrA4'>4</label>

                  <input type='radio' name='vPrA' id='vPrA5' value='5' checked={this.state.vPrA=='5'?'checked':''} onChange={v=>{this.handlechange("vPrA",v,'vPrA5')}}/><label for='vPrA5'>5</label>
                </b>
              </cell>
            </rect>
            </div>
            <div ref='T6' className='hidden'>
              <rect className='alter1 alter2'>
                <cell>
                  <b>
                    技术胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b>专业技术/Technical Skills</b>
                  <b>技术全局观/Technical Outlook</b>
                  <b>技术构建/Technical Construction</b>
                  <b>技术交流/Technical Exchange</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vTS3' id='vTS11' value='1' checked={this.state.vTS3=='1'?'checked':''} onChange={v=>{this.handlechange("vTS3",v,'vTS11')}}/><label for='vTS11'>1</label>

                    <input type='radio' name='vTS3' id='vTS12' value='2' checked={this.state.vTS3=='2'?'checked':''} onChange={v=>{this.handlechange("vTS3",v,'vTS12')}}/><label for='vTS12'>2</label>

                    <input type='radio' name='vTS3' id='vTS13' value='3' checked={this.state.vTS3=='3'?'checked':''} onChange={v=>{this.handlechange("vTS3",v,'vTS13')}}/><label for='vTS13'>3</label>

                    <input type='radio' name='vTS3' id='vTS14' value='4' checked={this.state.vTS3=='4'?'checked':''} onChange={v=>{this.handlechange("vTS3",v,'vTS14')}}/><label for='vTS14'>4</label>

                    <input type='radio' name='vTS3' id='vTS15' value='5' checked={this.state.vTS3=='5'?'checked':''} onChange={v=>{this.handlechange("vTS3",v,'vTS15')}}/><label for='vTS15'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vTO2' id='vTO6' value='1' checked={this.state.vTO2=='1'?'checked':''} onChange={v=>{this.handlechange("vTO2",v,'vTO6')}}/><label for='vTO6'>1</label>

                    <input type='radio' name='vTO2' id='vTO7' value='2' checked={this.state.vTO2=='2'?'checked':''} onChange={v=>{this.handlechange("vTO2",v,'vTO7')}}/><label for='vTO7'>2</label>

                    <input type='radio' name='vTO2' id='vTO8' value='3' checked={this.state.vTO2=='3'?'checked':''} onChange={v=>{this.handlechange("vTO2",v,'vTO8')}}/><label for='vTO8'>3</label>

                    <input type='radio' name='vTO2' id='vTO9' value='4' checked={this.state.vTO2=='4'?'checked':''} onChange={v=>{this.handlechange("vTO2",v,'vTO9')}}/><label for='vTO9'>4</label>

                    <input type='radio' name='vTO2' id='vTO10' value='5' checked={this.state.vTO2=='5'?'checked':''} onChange={v=>{this.handlechange("vTO2",v,'vTO10')}}/><label for='vTO10'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vTC' id='vTC1' value='1' checked={this.state.vTC=='1'?'checked':''} onChange={v=>{this.handlechange("vTC",v,'vTC1')}}/><label for='vTC1'>1</label>

                    <input type='radio' name='vTC' id='vTC2' value='2' checked={this.state.vTC=='2'?'checked':''} onChange={v=>{this.handlechange("vTC",v,'vTC2')}}/><label for='vTC2'>2</label>

                    <input type='radio' name='vTC' id='vTC3' value='3' checked={this.state.vTC=='3'?'checked':''} onChange={v=>{this.handlechange("vTC",v,'vTC3')}}/><label for='vTC3'>3</label>

                    <input type='radio' name='vTC' id='vTC4' value='4' checked={this.state.vTC=='4'?'checked':''} onChange={v=>{this.handlechange("vTC",v,'vTC4')}}/><label for='vTC4'>4</label>

                    <input type='radio' name='vTC' id='vTC5' value='5' checked={this.state.vTC=='5'?'checked':''} onChange={v=>{this.handlechange("vTC",v,'vTC5')}}/><label for='vTC5'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vTE3' id='vTE11' value='1' checked={this.state.vTE3=='1'?'checked':''} onChange={v=>{this.handlechange("vTE3",v,'vTE11')}}/><label for='vTE11'>1</label>

                    <input type='radio' name='vTE3' id='vTE12' value='2' checked={this.state.vTE3=='2'?'checked':''} onChange={v=>{this.handlechange("vTE3",v,'vTE12')}}/><label for='vTE12'>2</label>

                    <input type='radio' name='vTE3' id='vTE13' value='3' checked={this.state.vTE3=='3'?'checked':''} onChange={v=>{this.handlechange("vTE3",v,'vTE13')}}/><label for='vTE13'>3</label>

                    <input type='radio' name='vTE3' id='vTE14' value='4' checked={this.state.vTE3=='4'?'checked':''} onChange={v=>{this.handlechange("vTE3",v,'vTE14')}}/><label for='vTE14'>4</label>

                    <input type='radio' name='vTE3' id='vTE15' value='5' checked={this.state.vTE3=='5'?'checked':''} onChange={v=>{this.handlechange("vTE3",v,'vTE15')}}/><label for='vTE15'>5</label>
                  </b>
                </cell>
              </rect>
              <rect className='alter1'>
                <cell>
                  <b>
                    岗位胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b>应对不明朗局面/Dealing with Ambiguity</b>
                  <b>创新管理/Innovation Management</b>
                  <b>策略的敏锐性/Strategic Agility</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vDwA' id='vDwA1' value='1' checked={this.state.vDwA=='1'?'checked':''} onChange={v=>{this.handlechange("vDwA",v,'vDwA1')}}/><label for='vDwA1'>1</label>

                    <input type='radio' name='vDwA' id='vDwA2' value='2' checked={this.state.vDwA=='2'?'checked':''} onChange={v=>{this.handlechange("vDwA",v,'vDwA2')}}/><label for='vDwA2'>2</label>

                    <input type='radio' name='vDwA' id='vDwA3' value='3' checked={this.state.vDwA=='3'?'checked':''} onChange={v=>{this.handlechange("vDwA",v,'vDwA3')}}/><label for='vDwA3'>3</label>

                    <input type='radio' name='vDwA' id='vDwA4' value='4' checked={this.state.vDwA=='4'?'checked':''} onChange={v=>{this.handlechange("vDwA",v,'vDwA4')}}/><label for='vDwA4'>4</label>

                    <input type='radio' name='vDwA' id='vDwA5' value='5' checked={this.state.vDwA=='5'?'checked':''} onChange={v=>{this.handlechange("vDwA",v,'vDwA5')}}/><label for='vDwA5'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vIM' id='vIM1' value='1' checked={this.state.vIM=='1'?'checked':''} onChange={v=>{this.handlechange("vIM",v,'vIM1')}}/><label for='vIM1'>1</label>

                    <input type='radio' name='vIM' id='vIM2' value='2' checked={this.state.vIM=='2'?'checked':''} onChange={v=>{this.handlechange("vIM",v,'vIM2')}}/><label for='vIM2'>2</label>

                    <input type='radio' name='vIM' id='vIM3' value='3' checked={this.state.vIM=='3'?'checked':''} onChange={v=>{this.handlechange("vIM",v,'vIM3')}}/><label for='vIM3'>3</label>

                    <input type='radio' name='vIM' id='vIM4' value='4' checked={this.state.vIM=='4'?'checked':''} onChange={v=>{this.handlechange("vIM",v,'vIM4')}}/><label for='vIM4'>4</label>

                    <input type='radio' name='vIM' id='vIM5' value='5' checked={this.state.vIM=='5'?'checked':''} onChange={v=>{this.handlechange("vIM",v,'vIM5')}}/><label for='vIM5'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vStrA' id='vStrA1' value='1' checked={this.state.vStrA=='1'?'checked':''} onChange={v=>{this.handlechange("vStrA",v,'vStrA1')}}/><label for='vStrA1'>1</label>

                    <input type='radio' name='vStrA' id='vStrA2' value='2' checked={this.state.vStrA=='2'?'checked':''} onChange={v=>{this.handlechange("vStrA",v,'vStrA2')}}/><label for='vStrA2'>2</label>

                    <input type='radio' name='vStrA' id='vStrA3' value='3' checked={this.state.vStrA=='3'?'checked':''} onChange={v=>{this.handlechange("vStrA",v,'vStrA3')}}/><label for='vStrA3'>3</label>

                    <input type='radio' name='vStrA' id='vStrA4' value='4' checked={this.state.vStrA=='4'?'checked':''} onChange={v=>{this.handlechange("vStrA",v,'vStrA4')}}/><label for='vStrA4'>4</label>

                    <input type='radio' name='vStrA' id='vStrA5' value='5' checked={this.state.vStrA=='5'?'checked':''} onChange={v=>{this.handlechange("vStrA",v,'vStrA5')}}/><label for='vStrA5'>5</label>
                  </b>
                </cell>
              </rect>
            </div>

            <div ref='S5' className='hidden'>
              <rect className='alter1 alter6'>
                <cell>
                  <b>
                    技术胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b>专业技术/Technical Skills</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vTS4' id='vTS16' value='1' checked={this.state.vTS4=='1'?'checked':''} onChange={v=>{this.handlechange("vTS4",v,'vTS16')}}/><label for='vTS11'>1</label>

                    <input type='radio' name='vTS4' id='vTS17' value='2' checked={this.state.vTS4=='2'?'checked':''} onChange={v=>{this.handlechange("vTS4",v,'vTS17')}}/><label for='vTS12'>2</label>

                    <input type='radio' name='vTS4' id='vTS18' value='3' checked={this.state.vTS4=='3'?'checked':''} onChange={v=>{this.handlechange("vTS4",v,'vTS18')}}/><label for='vTS13'>3</label>

                    <input type='radio' name='vTS4' id='vTS19' value='4' checked={this.state.vTS4=='4'?'checked':''} onChange={v=>{this.handlechange("vTS4",v,'vTS19')}}/><label for='vTS14'>4</label>

                    <input type='radio' name='vTS4' id='vTS20' value='5' checked={this.state.vTS4=='5'?'checked':''} onChange={v=>{this.handlechange("vTS4",v,'vTS20')}}/><label for='vTS15'>5</label>
                  </b>

                </cell>
              </rect>
              <rect className='alter1 alter2'>
                <cell>
                  <b>
                    岗位胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b>以行动为导向/Action Oriented</b>
                  <b>解决问题/Problem Solving</b>
                  <b>自我发展/Self-development</b>
                  <b>及时学习/Learning on the Fly</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vAO2' id='vAO6' value='1' checked={this.state.vAO2=='1'?'checked':''} onChange={v=>{this.handlechange("vAO2",v,'vAO6')}}/><label for='vAO6'>1</label>

                    <input type='radio' name='vAO2' id='vAO7' value='2' checked={this.state.vAO2=='2'?'checked':''} onChange={v=>{this.handlechange("vAO2",v,'vAO7')}}/><label for='vAO7'>2</label>

                    <input type='radio' name='vAO2' id='vAO8' value='3' checked={this.state.vAO2=='3'?'checked':''} onChange={v=>{this.handlechange("vAO2",v,'vAO8')}}/><label for='vAO8'>3</label>

                    <input type='radio' name='vAO2' id='vAO9' value='4' checked={this.state.vAO2=='4'?'checked':''} onChange={v=>{this.handlechange("vAO2",v,'vAO9')}}/><label for='vAO9'>4</label>

                    <input type='radio' name='vAO2' id='vAO10' value='5' checked={this.state.vAO2=='5'?'checked':''} onChange={v=>{this.handlechange("vAO2",v,'vAO10')}}/><label for='vAO10'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vPS2' id='vPS6' value='1' checked={this.state.vPS2=='1'?'checked':''} onChange={v=>{this.handlechange("vPS2",v,'vPS6')}}/><label for='vPS6'>1</label>

                    <input type='radio' name='vPS2' id='vPS7' value='2' checked={this.state.vPS2=='2'?'checked':''} onChange={v=>{this.handlechange("vPS2",v,'vPS7')}}/><label for='vPS7'>2</label>

                    <input type='radio' name='vPS2' id='vPS8' value='3' checked={this.state.vPS2=='3'?'checked':''} onChange={v=>{this.handlechange("vPS2",v,'vPS8')}}/><label for='vPS8'>3</label>

                    <input type='radio' name='vPS2' id='vPS9' value='4' checked={this.state.vPS2=='4'?'checked':''} onChange={v=>{this.handlechange("vPS2",v,'vPS9')}}/><label for='vPS9'>4</label>

                    <input type='radio' name='vPS2' id='vPS10' value='5' checked={this.state.vPS2=='5'?'checked':''} onChange={v=>{this.handlechange("vPS2",v,'vPS10')}}/><label for='vPS10'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vSd2' id='vSd6' value='1' checked={this.state.vSd2=='1'?'checked':''} onChange={v=>{this.handlechange("vSd2",v,'vSd6')}}/><label for='vSd6'>1</label>

                    <input type='radio' name='vSd2' id='vSd7' value='2' checked={this.state.vSd2=='2'?'checked':''} onChange={v=>{this.handlechange("vSd2",v,'vSd7')}}/><label for='vSd7'>2</label>

                    <input type='radio' name='vSd2' id='vSd8' value='3' checked={this.state.vSd2=='3'?'checked':''} onChange={v=>{this.handlechange("vSd2",v,'vSd8')}}/><label for='vSd8'>3</label>

                    <input type='radio' name='vSd2' id='vSd9' value='4' checked={this.state.vSd2=='4'?'checked':''} onChange={v=>{this.handlechange("vSd2",v,'vSd9')}}/><label for='vSd9'>4</label>

                    <input type='radio' name='vSd2' id='vSd10' value='5' checked={this.state.vSd2=='5'?'checked':''} onChange={v=>{this.handlechange("vSd2",v,'vSd10')}}/><label for='vSd10'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vLF2' id='vLF6' value='1' checked={this.state.vLF2=='1'?'checked':''} onChange={v=>{this.handlechange("vLF2",v,'vLF6')}}/><label for='vLF6'>1</label>

                    <input type='radio' name='vLF2' id='vLF7' value='2' checked={this.state.vLF2=='2'?'checked':''} onChange={v=>{this.handlechange("vLF2",v,'vLF7')}}/><label for='vLF7'>2</label>

                    <input type='radio' name='vLF2' id='vLF8' value='3' checked={this.state.vLF2=='3'?'checked':''} onChange={v=>{this.handlechange("vLF2",v,'vLF8')}}/><label for='vLF8'>3</label>

                    <input type='radio' name='vLF2' id='vLF9' value='4' checked={this.state.vLF2=='4'?'checked':''} onChange={v=>{this.handlechange("vLF2",v,'vLF9')}}/><label for='vLF9'>4</label>

                    <input type='radio' name='vLF2' id='vLF10' value='5' checked={this.state.vLF2=='5'?'checked':''} onChange={v=>{this.handlechange("vLF2",v,'vLF10')}}/><label for='vLF10'>5</label>
                  </b>
                </cell>
              </rect>
            </div>

            <div ref='S6' className='hidden'>
              <rect className='alter1 alter6'>
                <cell>
                  <b>
                    技术胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b>专业技术/Technical Skills</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vTS5' id='vTS21' value='1' checked={this.state.vTS5=='1'?'checked':''} onChange={v=>{this.handlechange("vTS5",v,'vTS21')}}/><label for='vTS21'>1</label>

                    <input type='radio' name='vTS5' id='vTS22' value='2' checked={this.state.vTS5=='2'?'checked':''} onChange={v=>{this.handlechange("vTS5",v,'vTS22')}}/><label for='vTS22'>2</label>

                    <input type='radio' name='vTS5' id='vTS23' value='3' checked={this.state.vTS5=='3'?'checked':''} onChange={v=>{this.handlechange("vTS5",v,'vTS23')}}/><label for='vTS23'>3</label>

                    <input type='radio' name='vTS5' id='vTS24' value='4' checked={this.state.vTS5=='4'?'checked':''} onChange={v=>{this.handlechange("vTS5",v,'vTS24')}}/><label for='vTS24'>4</label>

                    <input type='radio' name='vTS5' id='vTS25' value='5' checked={this.state.vTS5=='5'?'checked':''} onChange={v=>{this.handlechange("vTS5",v,'vTS25')}}/><label for='vTS25'>5</label>
                  </b>

                </cell>
              </rect>
              <rect className='alter1 alter2'>
                <cell>
                  <b>
                  领导力胜任力<br/>Leadership Competency
                  </b>
                </cell>
                <cell>
                  <b>以行动为导向/Action Oriented</b>
                  <b>解决问题/Problem Solving</b>
                  <b>指导/Direct Others</b>
                  <b>勇于面对下属/Confront Direct Reports</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vAO3' id='vAO11' value='1' checked={this.state.vAO3=='1'?'checked':''} onChange={v=>{this.handlechange("vAO3",v,'vAO11')}}/><label for='vAO11'>1</label>

                    <input type='radio' name='vAO3' id='vAO12' value='2' checked={this.state.vAO3=='2'?'checked':''} onChange={v=>{this.handlechange("vAO3",v,'vAO12')}}/><label for='vAO12'>2</label>

                    <input type='radio' name='vAO3' id='vAO13' value='3' checked={this.state.vAO3=='3'?'checked':''} onChange={v=>{this.handlechange("vAO3",v,'vAO13')}}/><label for='vAO13'>3</label>

                    <input type='radio' name='vAO3' id='vAO14' value='4' checked={this.state.vAO3=='4'?'checked':''} onChange={v=>{this.handlechange("vAO3",v,'vAO14')}}/><label for='vAO14'>4</label>

                    <input type='radio' name='vAO3' id='vAO15' value='5' checked={this.state.vAO3=='5'?'checked':''} onChange={v=>{this.handlechange("vAO3",v,'vAO15')}}/><label for='vAO15'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vPS3' id='vPS11' value='1' checked={this.state.vPS3=='1'?'checked':''} onChange={v=>{this.handlechange("vPS3",v,'vPS11')}}/><label for='vPS11'>1</label>

                    <input type='radio' name='vPS3' id='vPS12' value='2' checked={this.state.vPS3=='2'?'checked':''} onChange={v=>{this.handlechange("vPS3",v,'vPS12')}}/><label for='vPS12'>2</label>

                    <input type='radio' name='vPS3' id='vPS13' value='3' checked={this.state.vPS3=='3'?'checked':''} onChange={v=>{this.handlechange("vPS3",v,'vPS13')}}/><label for='vPS13'>3</label>

                    <input type='radio' name='vPS3' id='vPS14' value='4' checked={this.state.vPS3=='4'?'checked':''} onChange={v=>{this.handlechange("vPS3",v,'vPS14')}}/><label for='vPS14'>4</label>

                    <input type='radio' name='vPS3' id='vPS15' value='5' checked={this.state.vPS3=='5'?'checked':''} onChange={v=>{this.handlechange("vPS3",v,'vPS15')}}/><label for='vPS15'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vDO' id='vDO1' value='1' checked={this.state.vDO=='1'?'checked':''} onChange={v=>{this.handlechange("vDO",v,'vDO1')}}/><label for='vDO1'>1</label>

                    <input type='radio' name='vDO' id='vDO2' value='2' checked={this.state.vDO=='2'?'checked':''} onChange={v=>{this.handlechange("vDO",v,'vDO2')}}/><label for='vDO2'>2</label>

                    <input type='radio' name='vDO' id='vDO3' value='3' checked={this.state.vDO=='3'?'checked':''} onChange={v=>{this.handlechange("vDO",v,'vDO3')}}/><label for='vDO3'>3</label>

                    <input type='radio' name='vDO' id='vDO4' value='4' checked={this.state.vDO=='4'?'checked':''} onChange={v=>{this.handlechange("vDO",v,'vDO4')}}/><label for='vDO4'>4</label>

                    <input type='radio' name='vDO' id='vDO5' value='5' checked={this.state.vDO=='5'?'checked':''} onChange={v=>{this.handlechange("vDO",v,'vDO5')}}/><label for='vDO5'>5</label>
                  </b>
                  <b>
                    <input type='radio' name='vCDR' id='vCDR1' value='1' checked={this.state.vCDR=='1'?'checked':''} onChange={v=>{this.handlechange("vCDR",v,'vCDR1')}}/><label for='vCDR1'>1</label>

                    <input type='radio' name='vCDR' id='vCDR2' value='2' checked={this.state.vCDR=='2'?'checked':''} onChange={v=>{this.handlechange("vCDR",v,'vCDR2')}}/><label for='vCDR2'>2</label>

                    <input type='radio' name='vCDR' id='vCDR3' value='3' checked={this.state.vCDR=='3'?'checked':''} onChange={v=>{this.handlechange("vCDR",v,'vCDR3')}}/><label for='vCDR3'>3</label>

                    <input type='radio' name='vCDR' id='vCDR4' value='4' checked={this.state.vCDR=='4'?'checked':''} onChange={v=>{this.handlechange("vCDR",v,'vCDR4')}}/><label for='vCDR4'>4</label>

                    <input type='radio' name='vCDR' id='vCDR5' value='5' checked={this.state.vCDR=='5'?'checked':''} onChange={v=>{this.handlechange("vCDR",v,'vCDR5')}}/><label for='vCDR5'>5</label>
                  </b>
                </cell>
              </rect>
            </div>


            <div ref='S9' className='hidden'>
              <rect className='alter1 alter6'>
                <cell>
                  <b>
                    技术胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b>专业技术/Technical Skills</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vTS6' id='vTS26' value='1' checked={this.state.vTS6=='1'?'checked':''} onChange={v=>{this.handlechange("vTS6",v,'vTS26')}}/><label for='vTS26'>1</label>

                    <input type='radio' name='vTS6' id='vTS27' value='2' checked={this.state.vTS6=='2'?'checked':''} onChange={v=>{this.handlechange("vTS6",v,'vTS27')}}/><label for='vTS27'>2</label>

                    <input type='radio' name='vTS6' id='vTS28' value='3' checked={this.state.vTS6=='3'?'checked':''} onChange={v=>{this.handlechange("vTS6",v,'vTS28')}}/><label for='vTS28'>3</label>

                    <input type='radio' name='vTS6' id='vTS29' value='4' checked={this.state.vTS6=='4'?'checked':''} onChange={v=>{this.handlechange("vTS6",v,'vTS29')}}/><label for='vTS29'>4</label>

                    <input type='radio' name='vTS6' id='vTS30' value='5' checked={this.state.vTS6=='5'?'checked':''} onChange={v=>{this.handlechange("vTS6",v,'vTS30')}}/><label for='vTS30'>5</label>
                  </b>

                </cell>
              </rect>
              <rect className='alter1 alter2 alter7'>
                <cell>
                  <b>
                  领导力胜任力<br/>Leadership Competency
                  </b>
                </cell>
                <cell>
                  <b>培养下属和其他人员/Develop Others</b>
                  <b>制定计划/Planning</b>
                  <b>组织能力/Organization</b>
                  <b>确定轻重缓急/Priority Setting</b>
                  <b>管理与衡量工作/Manager and Measure Work</b>
                </cell>
                <cell>
                <b>
                  <input type='radio' name='vDevO' id='vDevO1' value='1' checked={this.state.vDevO=='1'?'checked':''} onChange={v=>{this.handlechange("vDevO",v,'vDevO1')}}/><label for='vDevO1'>1</label>

                  <input type='radio' name='vDevO' id='vDevO2' value='2' checked={this.state.vDevO=='2'?'checked':''} onChange={v=>{this.handlechange("vDevO",v,'vDevO2')}}/><label for='vDevO2'>2</label>

                  <input type='radio' name='vDevO' id='vDevO3' value='3' checked={this.state.vDevO=='3'?'checked':''} onChange={v=>{this.handlechange("vDevO",v,'vDevO3')}}/><label for='vDevO3'>3</label>

                  <input type='radio' name='vDevO' id='vDevO4' value='4' checked={this.state.vDevO=='4'?'checked':''} onChange={v=>{this.handlechange("vDevO",v,'vDevO4')}}/><label for='vDevO4'>4</label>

                  <input type='radio' name='vDevO' id='vDevO5' value='5' checked={this.state.vDevO=='5'?'checked':''} onChange={v=>{this.handlechange("vDevO",v,'vDevO5')}}/><label for='vDevO5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPlan' id='vPlan1' value='1' checked={this.state.vPlan=='1'?'checked':''} onChange={v=>{this.handlechange("vPlan",v,'vPlan1')}}/><label for='vPlan1'>1</label>

                  <input type='radio' name='vPlan' id='vPlan2' value='2' checked={this.state.vPlan=='2'?'checked':''} onChange={v=>{this.handlechange("vPlan",v,'vPlan2')}}/><label for='vPlan2'>2</label>

                  <input type='radio' name='vPlan' id='vPlan3' value='3' checked={this.state.vPlan=='3'?'checked':''} onChange={v=>{this.handlechange("vPlan",v,'vPlan3')}}/><label for='vPlan3'>3</label>

                  <input type='radio' name='vPlan' id='vPlan4' value='4' checked={this.state.vPlan=='4'?'checked':''} onChange={v=>{this.handlechange("vPlan",v,'vPlan4')}}/><label for='vPlan4'>4</label>

                  <input type='radio' name='vPlan' id='vPlan5' value='5' checked={this.state.vPlan=='5'?'checked':''} onChange={v=>{this.handlechange("vPlan",v,'vPlan5')}}/><label for='vPlan5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vOrg' id='vOrg1' value='1' checked={this.state.vOrg=='1'?'checked':''} onChange={v=>{this.handlechange("vOrg",v,'vOrg1')}}/><label for='vOrg1'>1</label>

                  <input type='radio' name='vOrg' id='vOrg2' value='2' checked={this.state.vOrg=='2'?'checked':''} onChange={v=>{this.handlechange("vOrg",v,'vOrg1')}}/><label for='vOrg2'>2</label>

                  <input type='radio' name='vOrg' id='vOrg3' value='3' checked={this.state.vOrg=='3'?'checked':''} onChange={v=>{this.handlechange("vOrg",v,'vOrg1')}}/><label for='vOrg3'>3</label>

                  <input type='radio' name='vOrg' id='vOrg4' value='4' checked={this.state.vOrg=='4'?'checked':''} onChange={v=>{this.handlechange("vOrg",v,'vOrg1')}}/><label for='vOrg4'>4</label>

                  <input type='radio' name='vOrg' id='vOrg5' value='5' checked={this.state.vOrg=='5'?'checked':''} onChange={v=>{this.handlechange("vOrg",v,'vOrg1')}}/><label for='vOrg5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPriS' id='vPriS1' value='1' checked={this.state.vPriS=='1'?'checked':''} onChange={v=>{this.handlechange("vPriS",v,'vPriS1')}}/><label for='vPriS1'>1</label>

                  <input type='radio' name='vPriS' id='vPriS2' value='2' checked={this.state.vPriS=='2'?'checked':''} onChange={v=>{this.handlechange("vPriS",v,'vPriS2')}}/><label for='vPriS2'>2</label>

                  <input type='radio' name='vPriS' id='vPriS3' value='3' checked={this.state.vPriS=='3'?'checked':''} onChange={v=>{this.handlechange("vPriS",v,'vPriS3')}}/><label for='vPriS3'>3</label>

                  <input type='radio' name='vPriS' id='vPriS4' value='4' checked={this.state.vPriS=='4'?'checked':''} onChange={v=>{this.handlechange("vPriS",v,'vPriS4')}}/><label for='vPriS4'>4</label>

                  <input type='radio' name='vPriS' id='vPriS5' value='5' checked={this.state.vPriS=='5'?'checked':''} onChange={v=>{this.handlechange("vPriS",v,'vPriS5')}}/><label for='vPriS5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vMMW' id='vMMW1' value='1' checked={this.state.vMMW=='1'?'checked':''} onChange={v=>{this.handlechange("vMMW",v,'vMMW1')}}/><label for='vMMW1'>1</label>

                  <input type='radio' name='vMMW' id='vMMW2' value='2' checked={this.state.vMMW=='2'?'checked':''} onChange={v=>{this.handlechange("vMMW",v,'vMMW2')}}/><label for='vMMW2'>2</label>

                  <input type='radio' name='vMMW' id='vMMW3' value='3' checked={this.state.vMMW=='3'?'checked':''} onChange={v=>{this.handlechange("vMMW",v,'vMMW3')}}/><label for='vMMW3'>3</label>

                  <input type='radio' name='vMMW' id='vMMW4' value='4' checked={this.state.vMMW=='4'?'checked':''} onChange={v=>{this.handlechange("vMMW",v,'vMMW4')}}/><label for='vMMW4'>4</label>

                  <input type='radio' name='vMMW' id='vMMW5' value='5' checked={this.state.vMMW=='5'?'checked':''} onChange={v=>{this.handlechange("vMMW",v,'vMMW5')}}/><label for='vMMW5'>5</label>
                </b>
                </cell>
              </rect>
            </div>

            <div ref='S10' className='hidden'>
              <rect className='alter1 alter6'>
                <cell>
                  <b>
                    技术胜任力<br/>Technical Competency
                  </b>
                </cell>
                <cell>
                  <b>专业技术/Technical Skills</b>
                </cell>
                <cell>
                  <b>
                    <input type='radio' name='vTS7' id='vTS31' value='1' checked={this.state.vTS7=='1'?'checked':''} onChange={v=>{this.handlechange("vTS7",v,'vTS31')}}/><label for='vTS31'>1</label>

                    <input type='radio' name='vTS7' id='vTS32' value='2' checked={this.state.vTS7=='2'?'checked':''} onChange={v=>{this.handlechange("vTS7",v,'vTS32')}}/><label for='vTS32'>2</label>

                    <input type='radio' name='vTS7' id='vTS33' value='3' checked={this.state.vTS7=='3'?'checked':''} onChange={v=>{this.handlechange("vTS7",v,'vTS33')}}/><label for='vTS33'>3</label>

                    <input type='radio' name='vTS7' id='vTS34' value='4' checked={this.state.vTS7=='4'?'checked':''} onChange={v=>{this.handlechange("vTS7",v,'vTS34')}}/><label for='vTS34'>4</label>

                    <input type='radio' name='vTS7' id='vTS35' value='5' checked={this.state.vTS7=='5'?'checked':''} onChange={v=>{this.handlechange("vTS7",v,'vTS35')}}/><label for='vTS35'>5</label>
                  </b>

                </cell>
              </rect>
              <rect className='alter1 alter2 alter7'>
                <cell>
                  <b>
                    领导力胜任力<br/>Leadership Competency
                  </b>
                </cell>
                <cell>
                  <b>组建高效团队/Build Effective Teams</b>
                  <b>流程管理/Process Management</b>
                  <b>激励他人/Mottivating Others</b>
                  <b>冲突管理/Conflict Management</b>
                  <b>决策质量/Decision Quality</b>
                </cell>
                <cell>
                <b>
                  <input type='radio' name='vBET' id='vBET1' value='1' checked={this.state.vBET=='1'?'checked':''} onChange={v=>{this.handlechange("vBET",v,'vBET1')}}/><label for='vBET1'>1</label>

                  <input type='radio' name='vBET' id='vBET2' value='2' checked={this.state.vBET=='2'?'checked':''} onChange={v=>{this.handlechange("vBET",v,'vBET2')}}/><label for='vBET2'>2</label>

                  <input type='radio' name='vBET' id='vBET3' value='3' checked={this.state.vBET=='3'?'checked':''} onChange={v=>{this.handlechange("vBET",v,'vBET3')}}/><label for='vBET3'>3</label>

                  <input type='radio' name='vBET' id='vBET4' value='4' checked={this.state.vBET=='4'?'checked':''} onChange={v=>{this.handlechange("vBET",v,'vBET4')}}/><label for='vBET4'>4</label>

                  <input type='radio' name='vBET' id='vBET5' value='5' checked={this.state.vBET=='5'?'checked':''} onChange={v=>{this.handlechange("vBET",v,'vBET5')}}/><label for='vBET5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPM' id='vPM1' value='1' checked={this.state.vPM=='1'?'checked':''} onChange={v=>{this.handlechange("vPM",v,'vPM1')}}/><label for='vPM1'>1</label>

                  <input type='radio' name='vPM' id='vPM2' value='2' checked={this.state.vPM=='2'?'checked':''} onChange={v=>{this.handlechange("vPM",v,'vPM2')}}/><label for='vPM2'>2</label>

                  <input type='radio' name='vPM' id='vPM3' value='3' checked={this.state.vPM=='3'?'checked':''} onChange={v=>{this.handlechange("vPM",v,'vPM3')}}/><label for='vPM3'>3</label>

                  <input type='radio' name='vPM' id='vPM4' value='4' checked={this.state.vPM=='4'?'checked':''} onChange={v=>{this.handlechange("vPM",v,'vPM4')}}/><label for='vPM4'>4</label>

                  <input type='radio' name='vPM' id='vPM5' value='5' checked={this.state.vPM=='5'?'checked':''} onChange={v=>{this.handlechange("vPM",v,'vPM5')}}/><label for='vPM5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vMoOt' id='vMoOt1' value='1' checked={this.state.vMoOt=='1'?'checked':''} onChange={v=>{this.handlechange("vMoOt",v,'vMoOt1')}}/><label for='vMoOt1'>1</label>

                  <input type='radio' name='vMoOt' id='vMoOt2' value='2' checked={this.state.vMoOt=='2'?'checked':''} onChange={v=>{this.handlechange("vMoOt",v,'vMoOt1')}}/><label for='vMoOt2'>2</label>

                  <input type='radio' name='vMoOt' id='vMoOt3' value='3' checked={this.state.vMoOt=='3'?'checked':''} onChange={v=>{this.handlechange("vMoOt",v,'vMoOt1')}}/><label for='vMoOt3'>3</label>

                  <input type='radio' name='vMoOt' id='vMoOt4' value='4' checked={this.state.vMoOt=='4'?'checked':''} onChange={v=>{this.handlechange("vMoOt",v,'vMoOt1')}}/><label for='vMoOt4'>4</label>

                  <input type='radio' name='vMoOt' id='vMoOt5' value='5' checked={this.state.vMoOt=='5'?'checked':''} onChange={v=>{this.handlechange("vMoOt",v,'vMoOt1')}}/><label for='vMoOt5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vCM' id='vCM1' value='1' checked={this.state.vCM=='1'?'checked':''} onChange={v=>{this.handlechange("vCM",v,'vCM1')}}/><label for='vCM1'>1</label>

                  <input type='radio' name='vCM' id='vCM2' value='2' checked={this.state.vCM=='2'?'checked':''} onChange={v=>{this.handlechange("vCM",v,'vCM2')}}/><label for='vCM2'>2</label>

                  <input type='radio' name='vCM' id='vCM3' value='3' checked={this.state.vCM=='3'?'checked':''} onChange={v=>{this.handlechange("vCM",v,'vCM3')}}/><label for='vCM3'>3</label>

                  <input type='radio' name='vCM' id='vCM4' value='4' checked={this.state.vCM=='4'?'checked':''} onChange={v=>{this.handlechange("vCM",v,'vCM4')}}/><label for='vCM4'>4</label>

                  <input type='radio' name='vCM' id='vCM5' value='5' checked={this.state.vCM=='5'?'checked':''} onChange={v=>{this.handlechange("vCM",v,'vCM5')}}/><label for='vCM5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vDQ' id='vDQ1' value='1' checked={this.state.vDQ=='1'?'checked':''} onChange={v=>{this.handlechange("vDQ",v,'vDQ1')}}/><label for='vDQ1'>1</label>

                  <input type='radio' name='vDQ' id='vDQ2' value='2' checked={this.state.vDQ=='2'?'checked':''} onChange={v=>{this.handlechange("vDQ",v,'vDQ2')}}/><label for='vDQ2'>2</label>

                  <input type='radio' name='vDQ' id='vDQ3' value='3' checked={this.state.vDQ=='3'?'checked':''} onChange={v=>{this.handlechange("vDQ",v,'vDQ3')}}/><label for='vDQ3'>3</label>

                  <input type='radio' name='vDQ' id='vDQ4' value='4' checked={this.state.vDQ=='4'?'checked':''} onChange={v=>{this.handlechange("vDQ",v,'vDQ4')}}/><label for='vDQ4'>4</label>

                  <input type='radio' name='vDQ' id='vDQ5' value='5' checked={this.state.vDQ=='5'?'checked':''} onChange={v=>{this.handlechange("vDQ",v,'vDQ5')}}/><label for='vDQ5'>5</label>
                </b>
                </cell>
              </rect>
            </div>

            <rect className='alter1 alter2'>
              <cell>
                <b>
                  核心胜任力<br/>Core Competency(价值观)
                </b>
              </cell>
              <cell>
                <b>诚信为本/Integrity and Trust</b>
                <b>善于学习/Learning Agility</b>
                <b>客户导向/Customer Focus</b>
                <b>追求成效/Drive for Results</b>
              </cell>
              <cell>
                <b>
                  <input type='radio' name='vIT' id='vIT1' value='1' checked={this.state.vIT=='1'?'checked':''} onChange={v=>{this.handlechange("vIT",v,'vIT1')}}/><label for='vIT1'>1</label>

                  <input type='radio' name='vIT' id='vIT2' value='2' checked={this.state.vIT=='2'?'checked':''} onChange={v=>{this.handlechange("vIT",v,'vIT2')}}/><label for='vIT2'>2</label>

                  <input type='radio' name='vIT' id='vIT3' value='3' checked={this.state.vIT=='3'?'checked':''} onChange={v=>{this.handlechange("vIT",v,'vIT3')}}/><label for='vIT3'>3</label>

                  <input type='radio' name='vIT' id='vIT4' value='4' checked={this.state.vIT=='4'?'checked':''} onChange={v=>{this.handlechange("vIT",v,'vIT4')}}/><label for='vIT4'>4</label>

                  <input type='radio' name='vIT' id='vIT5' value='5' checked={this.state.vIT=='5'?'checked':''} onChange={v=>{this.handlechange("vIT",v,'vIT5')}}/><label for='vIT5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vLA' id='vLA1' value='1' checked={this.state.vLA=='1'?'checked':''} onChange={v=>{this.handlechange("vLA",v,'vLA1')}}/><label for='vLA1'>1</label>

                  <input type='radio' name='vLA' id='vLA2' value='2' checked={this.state.vLA=='2'?'checked':''} onChange={v=>{this.handlechange("vLA",v,'vLA2')}}/><label for='vLA2'>2</label>

                  <input type='radio' name='vLA' id='vLA3' value='3' checked={this.state.vLA=='3'?'checked':''} onChange={v=>{this.handlechange("vLA",v,'vLA3')}}/><label for='vLA3'>3</label>

                  <input type='radio' name='vLA' id='vLA4' value='4' checked={this.state.vLA=='4'?'checked':''} onChange={v=>{this.handlechange("vLA",v,'vLA4')}}/><label for='vLA4'>4</label>

                  <input type='radio' name='vLA' id='vLA5' value='5' checked={this.state.vLA=='5'?'checked':''} onChange={v=>{this.handlechange("vLA",v,'vLA5')}}/><label for='vLA5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vCF' id='vCF1' value='1' checked={this.state.vCF=='1'?'checked':''} onChange={v=>{this.handlechange("vCF",v,'vCF1')}}/><label for='vCF1'>1</label>

                  <input type='radio' name='vCF' id='vCF2' value='2' checked={this.state.vCF=='2'?'checked':''} onChange={v=>{this.handlechange("vCF",v,'vCF2')}}/><label for='vCF2'>2</label>

                  <input type='radio' name='vCF' id='vCF3' value='3' checked={this.state.vCF=='3'?'checked':''} onChange={v=>{this.handlechange("vCF",v,'vCF3')}}/><label for='vCF3'>3</label>

                  <input type='radio' name='vCF' id='vCF4' value='4' checked={this.state.vCF=='4'?'checked':''} onChange={v=>{this.handlechange("vCF",v,'vCF4')}}/><label for='vCF4'>4</label>

                  <input type='radio' name='vCF' id='vCF5' value='5' checked={this.state.vCF=='5'?'checked':''} onChange={v=>{this.handlechange("vCF",v,'vCF5')}}/><label for='vCF5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vDR' id='vDR1' value='1' checked={this.state.vDR=='1'?'checked':''} onChange={v=>{this.handlechange("vDR",v,'vDR1')}}/><label for='vDR1'>1</label>

                  <input type='radio' name='vDR' id='vDR2' value='2' checked={this.state.vDR=='2'?'checked':''} onChange={v=>{this.handlechange("vDR",v,'vDR2')}}/><label for='vDR2'>2</label>

                  <input type='radio' name='vDR' id='vDR3' value='3' checked={this.state.vDR=='3'?'checked':''} onChange={v=>{this.handlechange("vDR",v,'vDR3')}}/><label for='vDR3'>3</label>

                  <input type='radio' name='vDR' id='vDR4' value='4' checked={this.state.vDR=='4'?'checked':''} onChange={v=>{this.handlechange("vDR",v,'vDR4')}}/><label for='vDR4'>4</label>

                  <input type='radio' name='vDR' id='vDR5' value='5' checked={this.state.vDR=='5'?'checked':''} onChange={v=>{this.handlechange("vDR",v,'vDR5')}}/><label for='vDR5'>5</label>
                </b>
              </cell>
            </rect>

              <rect className='wholeLine'>
                <b>评分说明/Instructions:</b>
                <p>5-远超职位要求/Extremly exceed the expectation; 4-超过职位要求/Exceed the expectation; 3-符合职位要求/Meet the expectation; 2-未达到职位要求/Below the expextation; 1-远不及职位要求/Extremely below the expectation</p>
              </rect>
              <rect>
                <cell className='alter5'>
                  <b>
                    小组面试评估<br/>Group Interview Comments
                  </b>
                </cell>
                <cell>
                  <textarea className='GIC' value={this.state.groupInter} onChange={v=>{this.handlechange("groupInter",v)}}>
                  </textarea>
                </cell>
              </rect>
              <rect>
                <cell>
                  <b>
                    建议复试项<br/>Propose foe Retrial
                  </b>
                </cell>
                <cell>
                  <textarea value={this.state.p4r} onChange={v=>{this.handlechange("p4r",v)}}>
                  </textarea>
                </cell>
              </rect>
              <rect>
                <cell className='alter3'>
                  <b>小组面试结论<br/>Group Hiring Decision</b>
                </cell>
                <cell>
                <input type='radio' name='GHB' id='hire' value='hire' checked={this.state.GHB=='hire'?'checked':''} onChange={v=>{this.handlechange("GHB",v,'hire')}}/><label for='hire'>Hire 聘用</label>
                <input type='radio' name='GHB' id='reject' value='reject' checked={this.state.GHB=='reject'?'checked':''} onChange={v=>{this.handlechange("GHB",v,'reject')}}/><label for='reject'>Reject 淘汰</label>
                <input type='radio' name='GHB' id='backup' value='backup' checked={this.state.GHB=='backup'?'checked':''} onChange={v=>{this.handlechange("GHB",v,'backup')}}/><label for='backup'>Backup 保留</label>
                <br/>
                <input type='radio' name='GHB' id='rec2other' value='rec2other' checked={this.state.GHB=='rec2other'?'checked':''} onChange={v=>{this.handlechange("GHB",v,'rec2other')}}/><label for='rec2other'>Recommend to other position 推荐其他岗位</label>
                <input type='text'className='fillText' value={this.state.hiOther} onChange={v=>{this.handlechange("hiOther",v)}}/>
                <br/>
                <b>签名/Signature:</b>
                <input type='text'className='fillText alterFill'/>
                <b>日期/Date:{this.state.newdate}</b>
                </cell>
              </rect>
              <rect className='wholeLine'>
                <h4>复试评价记录 Retrial Comments</h4>
              </rect>
              <rect>
                <cell className='alter4'>
                  <b>复试评语<br/>Second Round Interview</b>
                </cell>
                <cell>
                  <textarea value={this.state.secRound} onChange={v=>{this.handlechange("secRound",v)}}></textarea>
                  <b>Hiring Decision：</b>
                  <input type='radio' name='SRI' id='hire2' value='hire2' checked={this.state.SRI=='hire2'?'checked':''} onChange={v=>{this.handlechange("SRI",v,'hire2')}}/><label for='hire2'>Hire 聘用</label>
                  <input type='radio' name='SRI' id='reject2' value='reject2' checked={this.state.SRI=='reject2'?'checked':''} onChange={v=>{this.handlechange("SRI",v,'reject2')}}/><label for='reject2'>Reject 淘汰</label>
                  <input type='radio' name='SRI' id='backup2' value='backup2' checked={this.state.SRI=='backup2'?'checked':''} onChange={v=>{this.handlechange("SRI",v,'backup2')}}/><label for='backup2'>Backup 保留</label>
                  <br/>
                  <b style={{marginRight:'24px'}}>面试官/Interviewer:{this.state.interviewer2}</b>
                  <b>日期/Date:{this.state.newdate}</b>
                </cell>
              </rect>
          </div>

        </div>
      </div>

    )
  }
}
export default InterviewAssessment;
