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
        interviewer:'',
        interviewer2:'',
        chara:0,
        eduOther:'',
        graFrom:'',
        workExp:'',
        wkOther:'',
        groupInter:'',
        p4r:'',
        hiOther:'',
        secRound:'',
        eduBack:''
    }
  }
  handlechange(key,val){
      console.log('tar',val.target.checked)
        this.setState({
            [key]:val.target.value   
        })
        console.log(this.state)
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
      console.log('ref',this.refs.T1)
      this.refs.T1.classList.remove('hidden')
    }
  }
  onPrinting = () => {
    const bodyHtml = window.document.body.innerHTML;

     var footstr = "</body>";
     var newstr = document.getElementById('toPrint').innerHTML;

     var style="<style>.wrap div rect:last-child{border-bottom:none;}ul{padding:0}.hidden{display:none;}h4{margin:0}.wrap{height:1191px;width:842px}h3{text-align:center;margin-top:8px;width:842px;}img{width:120px}ul{list-style: none; overflow: hidden;width:100%;margin-top: 16px;}ul li{width:25%;float:left;overflow: hidden; }ul li b{display: block;float: left;width:50%;}ul li p{width: 50%;float: left;margin:0;} ul li span{font-weight: bold;}rect{display: block;width:842px;border-top:1px solid #000;border-left:1px solid #000;overflow: hidden;box-sizing:border-box;}cell{float:left;display: block;border-right:1px solid #000;padding:10px; min-height:38px;box-sizing: border-box;}cell b{width:100%;font-size: 12px;display: block;}cell:first-child{width:25%;}cell:last-child{width:75%;}input{margin-right:8px;}cell label{margin-right:16px;}cell:last-child b{width:auto;display:inline-block;}cell .fillText{width:104px;font-size: 12px;outline:none;border:none;border-bottom:1px solid #000;}.byline b{padding-top:5px;padding-bottom:5px;}.uniline{padding-top:16px;padding-bottom:19px;}.triSlice cell:nth-child(3){width:40%;height:38px;}.triSlice cell:nth-child(3) b{position:relative;top:-2px;}.triSlice cell:nth-child(2){width:35%;}.alter1 cell:first-child b{padding-top:10px;padding-bottom:11px;}.alter1 cell:nth-child(2){padding:0; width:35%;}.alter1 cell:nth-child(3){width:40%;padding:0;}.alter1 cell:nth-child(2) b,.alter1 cell:nth-child(3) b{padding:0;line-height:25px;border-bottom:1px solid #000;display:block;width:100%;text-indent:10px;}.alter1 cell b:last-child{border:none;}.alter2 cell:first-child{padding-top:23px;padding-bottom:23px;}.wholeLine{width:100%;padding:10px;border-right:1px solid #000;}textarea{width:100%;border:none;outline:none;height:31px!important;resize:none;}.alter3{padding-top:25px;padding-bottom:26px;}.alterFill{ margin-left: 8px;margin-right: 24px;}h4{text-align: center;}.alter4{padding-top:32px;padding-bottom:33px;}rect:last-child{ border-bottom:1px solid #000;}.GIC{height:56px!important;}.alter5{padding-top:22px;padding-bottom:23px; }</style>"

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
                <input type='radio' value='bachelor' name='eb' checked={this.state.eduBack=='bachelor'} onChange={v=>{this.handlechange("eduBack",v)}} id='bachelor'/><label for='bachelor'>Bachelor 本科</label>
                <input type='radio' value='master' name='eb' checked={this.state.eduBack=='master'} onChange={v=>{this.handlechange("eduBack",v)}} id='master'/><label for='master'>Master 硕士</label>
                <input type='radio' value='doctor' name='eb' checked={this.state.eduBack=='doctor'} onChange={v=>{this.handlechange("eduBack",v)}} id='doctor'/><label for='doctor'>Doctor 博士</label>
                <input type='radio' value='otherEb' name='eb' checked={this.state.eduBack=='otherEb'} onChange={v=>{this.handlechange("eduBack",v)}} id='otherEb'/><label for='other'>Other 其他</label>
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
                <input type='radio' checked name='we' id='Huawei'/><label for='Huawei'>Huawei</label>
                <input type='radio' name='we' id='Innolight'/><label for='Innolight'>Innolight</label>
                <input type='radio' name='we' id='Accelink'/><label for='Accelink'>Accelink</label>
                <input type='radio' name='we' id='Neophotonics'/><label for='Neophotonics'>Neophotonics</label>
                <input type='radio' name='we' id='otherWe'/><label for='other'>Other 其他</label>
                <input type='text'className='fillText' value={this.state.wkOther} onChange={v=>{this.handlechange("wkOther",v)}}/>

              </cell>
            </rect>
            <rect>
              <cell>
                <b>英语技能/<br/>Language Skills</b>
              </cell>
              <cell className='uniline'>
                <input type='radio' name='ls' id='basic'/><label for='basic'>Basic</label>
                <input type='radio' name='ls' id='communicative'/><label for='communicative'>Communicative</label>
                <input type='radio' name='ls' id='fluent'/><label for='fluent'>Fluent</label>
                <input type='radio' name='ls' id='professional'/><label for='professional'>Professional</label>
                <input type='radio' name='ls' id='native'/><label for='native'>Native</label>

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
                  <input type='radio' name='vTS' id='vTS1'/><label for='vTS1'>1</label>

                  <input type='radio' name='vTS' id='vTS2'/><label for='vTS2'>2</label>

                  <input type='radio' name='vTS' id='vTS3'/><label for='vTS3'>3</label>

                  <input type='radio' name='vTS' id='vTS4'/><label for='vTS4'>4</label>

                  <input type='radio' name='vTS' id='vTS5'/><label for='vTS5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vEA' id='vEA1'/><label for='vEA1'>1</label>

                  <input type='radio' name='vEA' id='vEA2'/><label for='vEA2'>2</label>

                  <input type='radio' name='vEA' id='vEA3'/><label for='vEA3'>3</label>

                  <input type='radio' name='vEA' id='vEA4'/><label for='vEA4'>4</label>

                  <input type='radio' name='vEA' id='vEA5'/><label for='vEA5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vTE' id='vTE1'/><label for='vTE1'>1</label>

                  <input type='radio' name='vTE' id='vTE2'/><label for='vTE2'>2</label>

                  <input type='radio' name='vTE' id='vTE3'/><label for='vTE3'>3</label>

                  <input type='radio' name='vTE' id='vTE4'/><label for='vTE4'>4</label>

                  <input type='radio' name='vTE' id='vTE5'/><label for='vTE5'>5</label>
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
                  <input type='radio' name='vAO' id='vAO1'/><label for='vAO1'>1</label>

                  <input type='radio' name='vAO' id='vAO2'/><label for='vAO2'>2</label>

                  <input type='radio' name='vAO' id='vAO3'/><label for='vAO3'>3</label>

                  <input type='radio' name='vAO' id='vAO4'/><label for='vAO4'>4</label>

                  <input type='radio' name='vAO' id='vAO5'/><label for='vAO5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vPS' id='vPS1'/><label for='vPS1'>1</label>

                  <input type='radio' name='vPS' id='vPS2'/><label for='vPS2'>2</label>

                  <input type='radio' name='vPS' id='vPS3'/><label for='vPS3'>3</label>

                  <input type='radio' name='vPS' id='vPS4'/><label for='vPS4'>4</label>

                  <input type='radio' name='vPS' id='vPS5'/><label for='vPS5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vSd' id='vSd1'/><label for='vSd1'>1</label>

                  <input type='radio' name='vSd' id='vSd2'/><label for='vSd2'>2</label>

                  <input type='radio' name='vSd' id='vSd3'/><label for='vSd3'>3</label>

                  <input type='radio' name='vSd' id='vSd4'/><label for='vSd4'>4</label>

                  <input type='radio' name='vSd' id='vSd5'/><label for='vSd5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vLF' id='vLF1'/><label for='vLF1'>1</label>

                  <input type='radio' name='vLF' id='vLF2'/><label for='vLF2'>2</label>

                  <input type='radio' name='vLF' id='vLF3'/><label for='vLF3'>3</label>

                  <input type='radio' name='vLF' id='vLF4'/><label for='vLF4'>4</label>

                  <input type='radio' name='vLF' id='vLF5'/><label for='vLF5'>5</label>
                </b>
              </cell>
            </rect>
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
                  <input type='radio' name='vIT' id='vIT1'/><label for='vIT1'>1</label>

                  <input type='radio' name='vIT' id='vIT2'/><label for='vIT2'>2</label>

                  <input type='radio' name='vIT' id='vIT3'/><label for='vIT3'>3</label>

                  <input type='radio' name='vIT' id='vIT4'/><label for='vIT4'>4</label>

                  <input type='radio' name='vIT' id='vIT5'/><label for='vIT5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vLA' id='vLA1'/><label for='vLA1'>1</label>

                  <input type='radio' name='vLA' id='vLA2'/><label for='vLA2'>2</label>

                  <input type='radio' name='vLA' id='vLA3'/><label for='vLA3'>3</label>

                  <input type='radio' name='vLA' id='vLA4'/><label for='vLA4'>4</label>

                  <input type='radio' name='vLA' id='vLA5'/><label for='vLA5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vCF' id='vCF1'/><label for='vCF1'>1</label>

                  <input type='radio' name='vCF' id='vCF2'/><label for='vCF2'>2</label>

                  <input type='radio' name='vCF' id='vCF3'/><label for='vCF3'>3</label>

                  <input type='radio' name='vCF' id='vCF4'/><label for='vCF4'>4</label>

                  <input type='radio' name='vCF' id='vCF5'/><label for='vCF5'>5</label>
                </b>
                <b>
                  <input type='radio' name='vDR' id='vDR1'/><label for='vDR1'>1</label>

                  <input type='radio' name='vDR' id='vDR2'/><label for='vDR2'>2</label>

                  <input type='radio' name='vDR' id='vDR3'/><label for='vDR3'>3</label>

                  <input type='radio' name='vDR' id='vDR4'/><label for='vDR4'>4</label>

                  <input type='radio' name='vDR' id='vDR5'/><label for='vDR5'>5</label>
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
                <input type='radio' name='vTS2' id='vTS6'/><label for='vTS6'>1</label>

                <input type='radio' name='vTS2' id='vTS7'/><label for='vTS7'>2</label>

                <input type='radio' name='vTS2' id='vTS8'/><label for='vTS8'>3</label>

                <input type='radio' name='vTS2' id='vTS9'/><label for='vTS9'>4</label>

                <input type='radio' name='vTS2' id='vTS10'/><label for='vTS10'>5</label>
              </b>
              <b>
                <input type='radio' name='vTO' id='vTO1'/><label for='vTO1'>1</label>

                <input type='radio' name='vTO' id='vTO2'/><label for='vTO2'>2</label>

                <input type='radio' name='vTO' id='vTO3'/><label for='vTO3'>3</label>

                <input type='radio' name='vTO' id='vTO4'/><label for='vTO4'>4</label>

                <input type='radio' name='vTO' id='vTO5'/><label for='vTO5'>5</label>
              </b>
              <b>
                <input type='radio' name='vTD' id='vTD1'/><label for='vTD1'>1</label>

                <input type='radio' name='vTD' id='vTD2'/><label for='vTD2'>2</label>

                <input type='radio' name='vTD' id='vTD3'/><label for='vTD3'>3</label>

                <input type='radio' name='vTD' id='vTD4'/><label for='vTD4'>4</label>

                <input type='radio' name='vTD' id='vTD5'/><label for='vTD5'>5</label>
              </b>
              <b>
                <input type='radio' name='vTE2' id='vTE6'/><label for='vTE6'>1</label>

                <input type='radio' name='vTE2' id='vTE7'/><label for='vTE7'>2</label>

                <input type='radio' name='vTE2' id='vTE8'/><label for='vTE8'>3</label>

                <input type='radio' name='vTE2' id='vTE9'/><label for='vTE9'>4</label>

                <input type='radio' name='vTE2' id='vTE10'/><label for='vTE10'>5</label>
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
                <input type='radio' name='vCr' id='vCr1'/><label for='vCr1'>1</label>

                <input type='radio' name='vCr' id='vCr2'/><label for='vCr2'>2</label>

                <input type='radio' name='vCr' id='vCr3'/><label for='vCr3'>3</label>

                <input type='radio' name='vCr' id='vCr4'/><label for='vCr4'>4</label>

                <input type='radio' name='vCr' id='vCr5'/><label for='vCr5'>5</label>
              </b>
              <b>
                <input type='radio' name='vSA' id='vSA1'/><label for='vSA1'>1</label>

                <input type='radio' name='vSA' id='vSA2'/><label for='vSA2'>2</label>

                <input type='radio' name='vSA' id='vSA3'/><label for='vSA3'>3</label>

                <input type='radio' name='vSA' id='vSA4'/><label for='vSA4'>4</label>

                <input type='radio' name='vSA' id='vSA5'/><label for='vSA5'>5</label>
              </b>
              <b>
                <input type='radio' name='vPrA' id='vPrA1'/><label for='vPrA1'>1</label>

                <input type='radio' name='vPrA' id='vPrA2'/><label for='vPrA2'>2</label>

                <input type='radio' name='vPrA' id='vPrA3'/><label for='vPrA3'>3</label>

                <input type='radio' name='vPrA' id='vPrA4'/><label for='vPrA4'>4</label>

                <input type='radio' name='vPrA' id='vPrA5'/><label for='vPrA5'>5</label>
              </b>
            </cell>
          </rect>
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
                <input type='radio' name='vIT2' id='vIT6'/><label for='vIT6'>1</label>

                <input type='radio' name='vIT2' id='vIT7'/><label for='vIT7'>2</label>

                <input type='radio' name='vIT2' id='vIT8'/><label for='vIT8'>3</label>

                <input type='radio' name='vIT2' id='vIT9'/><label for='vIT9'>4</label>

                <input type='radio' name='vIT2' id='vIT10'/><label for='vIT10'>5</label>
              </b>
              <b>
                <input type='radio' name='vLA2' id='vLA6'/><label for='vLA6'>1</label>

                <input type='radio' name='vLA2' id='vLA7'/><label for='vLA7'>2</label>

                <input type='radio' name='vLA2' id='vLA8'/><label for='vLA8'>3</label>

                <input type='radio' name='vLA2' id='vLA9'/><label for='vLA9'>4</label>

                <input type='radio' name='vLA2' id='vLA10'/><label for='vLA10'>5</label>
              </b>
              <b>
                <input type='radio' name='vCF2' id='vCF6'/><label for='vCF6'>1</label>

                <input type='radio' name='vCF2' id='vCF7'/><label for='vCF7'>2</label>

                <input type='radio' name='vCF2' id='vCF8'/><label for='vCF8'>3</label>

                <input type='radio' name='vCF2' id='vCF9'/><label for='vCF9'>4</label>

                <input type='radio' name='vCF2' id='vCF10'/><label for='vCF10'>5</label>
              </b>
              <b>
                <input type='radio' name='vDR2' id='vDR6'/><label for='vDR6'>1</label>

                <input type='radio' name='vDR2' id='vDR7'/><label for='vDR7'>2</label>

                <input type='radio' name='vDR2' id='vDR8'/><label for='vDR8'>3</label>

                <input type='radio' name='vDR2' id='vDR9'/><label for='vDR9'>4</label>

                <input type='radio' name='vDR2' id='vDR10'/><label for='vDR10'>5</label>
              </b>
            </cell>
          </rect>
          </div>

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
              <input type='radio' name='GHB' id='hire'/><label for='hire'>Hire 聘用</label>
              <input type='radio' name='GHB' id='reject'/><label for='reject'>Reject 淘汰</label>
              <input type='radio' name='GHB' id='backup'/><label for='backup'>Backup 保留</label>
              <br/>
              <input type='radio' name='GHB' id='rec2other'/><label for='rec2other'>Recommend to other position 推荐其他岗位</label>
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
                <input type='radio' name='SRI' id='hire2'/><label for='hire2'>Hire 聘用</label>
                <input type='radio' name='SRI' id='reject2'/><label for='reject2'>Reject 淘汰</label>
                <input type='radio' name='SRI' id='backup2'/><label for='backup2'>Backup 保留</label>
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
