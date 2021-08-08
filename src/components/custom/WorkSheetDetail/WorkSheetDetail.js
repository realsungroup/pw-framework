import React from 'react';
import './WorkSheetDetail.less';
import { Row,Col,Select, Button,message,Icon,Input,DatePicker } from 'antd';
import { TableData } from '../../common/loadableCommon';

import http from 'Util20/api';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

class WorkSheetDetail extends React.Component {
  constructor(props){
    super(props)
  }
  
  async componentDidMount() {
   
  }
  handlePrint = () => {
    // 打印
    const bodyHtml = window.document.body.innerHTML;

    var footstr = "</body>";
     var newstr = document.getElementById('toPrint').innerHTML;
     var style='<style>  .ant-calendar-picker {    box-sizing: border-box;    margin: 0;    padding: 0;    color: rgba(0, 0, 0, 0.65);    font-size: 14px;    font-variant: tabular-nums;    line-height: 1.5;    list-style: none;    -webkit-font-feature-settings: "tnum";    font-feature-settings: "tnum", "tnum";    position: relative;    display: inline-block;    outline: none;    cursor: text;    -webkit-transition: opacity 0.3s;    transition: opacity 0.3s;}.ant-calendar-picker {    box-sizing: border-box;    margin: 0;    padding: 0;    color: rgba(0, 0, 0, 0.65);    font-size: 14px;    font-variant: tabular-nums;    line-height: 1.5;    list-style: none;    -webkit-font-feature-settings: "tnum", "tnum";    font-feature-settings: "tnum", "tnum";    position: relative;    display: inline-block;    outline: none;    cursor: text;    -webkit-transition: opacity 0.3s;    transition: opacity 0.3s;}    .ant-input {    box-sizing: border-box;    margin: 0;    padding: 0;    font-variant: tabular-nums;    list-style: none;    -webkit-font-feature-settings: "tnum", "tnum";    font-feature-settings: "tnum", "tnum";    position: relative;    display: inline-block;    width: 100%;    height: 32px;    padding: 4px 11px;    color: rgba(0, 0, 0, 0.65);    font-size: 14px;    line-height: 1.5;    background-color: #fff;    background-image: none;    border: 1px solid #d9d9d9;    border-radius: 4px;    -webkit-transition: all 0.3s;    transition: all 0.3s;}.ant-input-sm {    height: 24px;    padding: 1px 7px;}    .ant-input {    color: rgba(0, 0, 0, 0.65);    background-color: #fff;    background-image: none;    border: 1px solid #d9d9d9;    border-radius: 4px;}    .ant-calendar-picker-input.ant-input-sm {    padding-top: 0;    padding-bottom: 0;}    textarea.ant-input {    max-width: 100%;    height: auto;    min-height: 32px;    vertical-align: bottom;    -webkit-transition: all 0.3s, height 0s;    transition: all 0.3s, height 0s;}    .ant-row {    position: relative;    height: auto;    margin-right: 0;    margin-left: 0;    zoom: 1;    display: block;    box-sizing: border-box;    }.ant-row::before, .ant-row::after {    content: "";    display: table;}.ant-col{    position: relative;}.ant-col-1 {    display: block;    box-sizing: border-box;    width: 4.16666667%;}.ant-col-2 {    display: block;    box-sizing: border-box;    width: 8.33333333%;}.ant-col-3 {    display: block;    box-sizing: border-box;    width: 12.5%;}.ant-col-4 {    display: block;    box-sizing: border-box;    width: 16.66666667%;}.ant-col-5 {    display: block;    box-sizing: border-box;    width: 20.83333333%;}   .ant-col-6 {    display: block;    box-sizing: border-box;    width: 25%;}.ant-col-7 {    display: block;    box-sizing: border-box;    width: 29.16666667%;}.ant-col-24 {    display: block;    box-sizing: border-box;    width: 100%;}        *{margin:0;padding:0;box-sizing: border-box;text-align: center;}    .toPrint {  display: inline-block;  width: 794px;  height: 1090px;  padding: 2rem;  font-size: 14px;}.toPrint input {  border: 0px solid #fff;}.toPrint i {  display: none;}.toPrint .header {  width: 100%;}.toPrint .header div {  float: left;  width: calc(50% - 7.5rem);}.toPrint .header h4 {  display: inline-block;  font-size: 1.2rem;  width: 15rem;}.toPrint .header p {  float: right;  font-size: 1.2rem;  width: calc(50% - 7.5rem);}.toPrint .header p b {  color: #f5222d;}.toPrint .timer {  width: 100%;  overflow: hidden;}.toPrint .timer>div {  float: left;  line-height: 1.5rem;}.toPrint .timer div input {  position: relative;  0px;  border-bottom: 0px solid #000;  border-radius: 0px;}.toPrint .timer>div:nth-child(2) {  float: right;}.toPrint .timer .tableWrap {  width: 100%;  overflow: hidden;}.toPrint .timer .tableWrap .depas {  float: left;  overflow: hidden;  width: 1.5rem;  margin-top: 0.5rem;  border-left: 1px solid #000;  border-top: 1px solid #000;  border-bottom: 1px solid #000;}.toPrint .timer .tableWrap .depas div {  border-bottom: 1px solid #000;}.toPrint .timer .tableWrap .depas div:first-child {  height: calc(15.5rem + 9px);}.toPrint .timer .tableWrap .depas div:nth-child(2) {  height: calc(8rem + 4px);}.toPrint .timer .tableWrap .depas div:nth-child(3) {  height: calc(8rem + 3px);}.toPrint .timer .tableWrap .depas div:nth-child(4) {  height: calc(8rem + 3px);}.toPrint .timer .tableWrap .depas div:nth-child(5) {  height: calc(4.5rem + 3px);}.toPrint .timer .tableWrap .depas div:nth-child(6) {  height: calc(7.5rem + 3px);  border-bottom: 0px solid #000;}.toPrint .timer .tableWrap .table {  float: left;  width: calc(100% - 1.5rem);  margin-top: 0.5rem;  height: 851px;}.toPrint .timer .tableWrap .table div {  float: none;}.toPrint .timer .tableWrap .table .ant-row {  display: flex;  border-top: 1px solid #000;  border-left: 1px solid #000;  border-right: 1px solid #000;  box-sizing: border-box;}.toPrint .timer .tableWrap .table .ant-row:last-child {  border-bottom: 1px solid #000;}.toPrint .timer .tableWrap .table .ant-col {  border-right: 1px solid #000;  box-sizing: border-box;}.toPrint .timer .tableWrap .table .ant-col:last-child {  border-right: 0px solid #000;}.toPrint .timer .tableWrap .table .ant-col input {  top: 0;  border: 0px solid #fff;  line-height: 1.5rem;  width: 100%;transform: scale(0.95);}.toPrint .timer .tableWrap .table .ant-col textarea {  width: 100%;  border: 0px solid #fff;  resize: none;  height: 1rem;}.toPrint .timer .tableWrap .table .multInput input {  width: 44%;}.toPrint .timer .tableWrap .table .multInput span {  width: 10%;}</style>';
     var headstr = "<html><head><title></title>"+style+"</head><body>";
     document.body.innerHTML = headstr + newstr + footstr;
     window.print();
    window.document.body.innerHTML = bodyHtml;
    window.location.reload();
  };
  render() {
    return (
      

      <div className='sheetDetails'>
        <div className='streamList'>
            {
              this.props.hasBack?
              <div className='backLine'>
                <div onClick={()=>{this.props.backFunc();}}>
                  <Icon type='left'/>
                  返回
                </div>
              </div>
              :null
            }
            <ul style={this.props.hasBack?{margin:'3.3rem .5rem .8rem'}:{margin:'.8rem .5rem'}}>
              <li>
                <div>
                  <div>1</div>
                  <b>业务部</b>
                </div>
                <ul>
                  <li>
                    <b>1.1</b>
                    <div>
                      <span>2021-07-23 12:00:01</span>
                      <span>张三</span>
                      <span>业务员</span>
                    </div>
                  </li>
                </ul>
              </li>
              <li className="current">
                <div>
                  <div>2</div>
                  <b>部门A</b>
                </div>
                <ul>
                  <li className="current">
                    <b>2.1</b>
                    <div>

                    <span>进行中</span>
                    <span>张三</span>
                    <span>业务员</span>
                    </div>

                  </li>
                  <li>
                    <b>2.2</b>
                    <div>

                    <span>进行中</span>
                    <span>张三</span>
                    <span>业务员</span>
                    </div>

                  </li>
                </ul>
              </li>
              <li className="willDo">
                <div>
                  <div>3</div>
                  <b>部门B</b>
                </div>
                <ul>
                  <li>
                    <b>3.1</b>
                    <div>

                    <span>未开始</span>
                    <span>张三</span>
                    <span>业务员</span>
                    </div>

                  </li>
                  <li>
                    <b>3.2</b>
                    <div>

                    <span>未开始</span>
                    <span>张三</span>
                    <span>业务员</span>
                    </div>

                  </li>
                </ul>
              </li>
            </ul>
        </div>
        <div className='sheet'>
          
          <div className='historySelections'>
            <ul style={{minWidth:'100%',width:(2*10)+'rem'}}>
              <li className='current'>
              2021-07-24 12:00
              </li>
              <li>
              2021-07-24 12:00
              </li>
            </ul>
            
          </div>
          
        <div className='rightContent'>
            <div className='pics'>
              <div className='toChange'>
              </div>
              <div className='picsMenu'>
                <div>下载</div>
                <div>替换</div>

              </div>
            </div>
            <div className='reasons'>
              <b>
                修改原因：
              </b>
              <p>
                原因AAAA
              </p>
            </div>
            <div className='feedback'>
              <b>
                用户反馈：
              </b>
              <span>产看关联反馈</span>
              <p>
                反馈AAAA
              </p>
            </div>
          </div>

          <div className='menu'>
            <ul>
              <li>
                保存
              </li>
              <li>
                复制新建
              </li>
              <li>
                开始当前流程
              </li>
              <li>
                结束当前流程
              </li>
              <li onClick={()=>{this.handlePrint();}}>
                打印
              </li>
              <li className='right'>
                取消订单
              </li>
              <li className='right'>
                报废订单
              </li>
            </ul>
          </div>
          <div className='workSheetForm'>
              <div id='toPrint'>
                <div className='toPrint'>
                <div className='header'>
                  <div>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAA5CAIAAAAX74ozAAAACXBIWXMAAAsTAAALEwEAmpwYAAA57GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjEtMDgtMDhUMTY6NTU6MzIrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDIxLTA4LTA4VDE2OjU1OjMyKzA4OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAyMS0wOC0wOFQxNjo1NTozMiswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6Mzk1Y2NkOTYtNjZkOC01YzQ2LTgzODgtZTBhM2M1MGQ5NmE5PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6MTU5NjhkZTktZjgyNi0xMWViLThhNjYtOWZjMTM4MDA3NWFkPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YjMxMmMyN2UtOWI0MC01YTRjLTg2YzYtZjEyZGMwYzc0M2EzPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmIzMTJjMjdlLTliNDAtNWE0Yy04NmM2LWYxMmRjMGM3NDNhMzwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMS0wOC0wOFQxNjo1NTozMiswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDozOTVjY2Q5Ni02NmQ4LTVjNDYtODM4OC1lMGEzYzUwZDk2YTk8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjEtMDgtMDhUMTY6NTU6MzIrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+Nzg8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NTc8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pi15F8EAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAACcNJREFUeNrsW39Mmukd/6rFKpRY6xzlNIyyc6TGxcyYcKWzZi4uTbhjYbNj0dJzIedCLmQsJizsSN1CwsLFxIVFY8LNhc6diXc25Gi4ubM0XuysPWvD7CilpUgdRUphCAcFFJ798dKXV+oP/EHr7Xz+et/n+32f9/k8z/f5fj/P93nfAoQQfD1KIXxtygHUA6gHUA+gHkD9v4V67cpH4adLd2/d2lIz+Sya366gvSshz6JCLOKwmMnVBFYT8LjxF43oBjd/HFMjFxVZpqdQHsreQJ00jApbm3FUCqk0LYhmJqqrrS0XqABQBJCKxxFCQZ9XJGyzzc+9eqhup03IbyUTbIRBIY9p+zIaqSQu4jc1bd6aSi7DNCmFgFbjCKGGWhZWQyujRoOBVwM1HPTxW5uqy6nkQqgupzbWMEcHtfPmCbWkq45WGQ0GcU06pQTrbnVZ2Rb27/fg4zKkVvG5HPy2ubEBV1uN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"/>
                  </div>
                  <h4>无锡美银精工磨具有限公司产品制作工程单</h4>
                  <p>No <b>112377</b></p>
                </div>
                <div className='timer'>
                  <div>
                    接单时间：<DatePicker size='small'showTime/>
                  </div>
                  <div>
                    交货时间：<DatePicker size='small' showTime/>
                  </div>
                  <div className='tableWrap'>
                  <div className='depas'>
                    <div>
                      业务部
                    </div>
                    <div>
                      工程部
                    </div>
                    <div>
                      激光部
                    </div>
                    <div>
                      制造部
                    </div>
                    <div>
                      仓库
                    </div>
                    <div>
                      校验
                    </div>
                  </div>
                  <div className='table'>
                    
                    <Row>
                      <Col span={5}>客户名称</Col>
                      <Col span={4}><input/></Col>
                      <Col span={5}>产品名称</Col>
                      <Col span={4}><input/></Col>
                      <Col span={3}>数量</Col>
                      <Col span={3}><input/></Col>
                    </Row>
                    <Row>
                      <Col style={{width:'8%'}}>图面</Col>
                      <Col style={{width:'8%'}}>正切</Col>
                      <Col style={{width:'8%'}}>反切</Col>
                      <Col style={{width:'8%'}}>入刀</Col>
                      <Col style={{width:'8%'}}>净介</Col>
                      <Col style={{width:'8%'}}>参照</Col>
                      <Col style={{width:'8%'}}>菲林</Col>
                      <Col style={{width:'8%'}}>色位</Col>
                      <Col style={{width:'9%'}}>图纸尺寸</Col>
                      <Col style={{width:'8%'}}>传真</Col>
                      <Col style={{width:'8%'}}>邮件</Col>
                      <Col style={{width:'11%'}}>实样（物）</Col>
                    </Row>
                    <Row>
                      <Col span={2}>稿数情况</Col>
                      <Col span={2}>菲林</Col>
                      <Col span={2}>图纸</Col>
                      <Col span={2}>稿</Col>
                      <Col span={2}>实物</Col>
                      <Col span={4}>稿样是否归还客户</Col>
                      <Col span={2}>是</Col>
                      <Col span={2}>否</Col>
                      <Col span={2}>板度要求</Col>
                      <Col span={4}><input/></Col>
                    </Row>
                    <Row>
                      <Col span={2}>接单人</Col>
                      <Col span={3}><input/></Col>
                      <Col span={2}>送货单号</Col>
                      <Col span={3}><input/></Col>
                      <Col span={2}>价格</Col>
                      <Col span={2}><input/></Col>
                      <Col span={2}>含税</Col>
                      <Col span={2}>不含税</Col>
                      <Col span={2}>复核人</Col>
                      <Col span={4}><input/></Col>
                    </Row>
                    <Row>
                      <Col span={24} >
                        <div>
                          <span style={{width:'100%',textAlign:'left'}}>
                          接单绘图说明：
                          </span>
                          <TextArea/>
                        </div>
                      </Col>

                    </Row>
                    <Row>
                      <Col span={2}>
                        刀材名称
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        齿刀名称
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}> 
                        数量
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        痕线名称
                      </Col>
                      <Col span={2} >
                      <input/>
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        孔类名称
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        销类名称
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        其他
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                      <Col span={2}>
                        数量
                      </Col>
                      <Col span={2}>
                      <input/>
                        
                      </Col>
                    </Row>
                    <Row>
                      <Col span={4}>
                        板材要求
                      </Col>
                      <Col span={4}>
                        木板厚度
                      </Col>
                      <Col span={1}>
                        22
                      </Col>
                      <Col span={1}>
                        20
                      </Col>
                      <Col span={1}>
                        18
                      </Col>
                      <Col span={1}>
                        15
                      </Col>
                      <Col span={1}>
                        12
                      </Col>
                      <Col span={1}>
                        10
                      </Col>
                      <Col span={5}>
                        塑料板
                      </Col>
                      <Col span={1}>
                        10
                      </Col>
                      <Col span={1}>
                        8
                      </Col>
                      <Col span={1}>
                        6
                      </Col>
                      <Col span={1}>
                        5
                      </Col>
                      <Col span={1}>
                        4
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        制图人
                      </Col>
                      <Col span={3}>
                      <input/>
                      </Col>
                      <Col span={3}>
                        制图档号
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={3}>
                        制图尺寸
                      </Col>
                      <Col span={3} className='multInput'>
                        <input/><span>X</span><input/>
                      </Col>
                      <Col span={2}>
                      孔径1
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        孔径2
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        制米数
                      </Col>
                      <Col span={1}>
                        刀长
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={1}>
                        线长
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        半穿刀
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={1}>
                      齿刀
                      </Col>
                      <Col span={2}><input/></Col>
                      <Col span={2}>
                        制图时间
                      </Col>
                      <Col className='multInput' span={7}>
                      <input style={{width:'45%'}}/><span style={{width:'10%'}}>至</span><input style={{width:'45%'}}/>
                      </Col>
                      </Row>
                      <Row>
                      <Col span={24}>
                        <div>
                          <span style={{width:'100%',textAlign:'left'}}>
                          制图备注：
                          </span>
                          <TextArea/>
                        </div>
                        <div>
                          <span style={{width:'10%'}}>
                          检验人：
                          </span>
                          <input style={{width:'90%'}}/>
                        </div>
                      </Col>

                    </Row>
                    <Row>
                      <Col span={2}>
                        割板人
                      </Col>
                      <Col span={4}>
                      <input/>
                      </Col>
                      <Col span={3}>
                        割板时间
                      </Col>
                      <Col className='multInput' span={5}>
                      <input/><span>至</span><input/>
                      </Col>
                      <Col span={5}>
                        切割板尺寸
                      </Col>
                      <Col className='multInput' span={5}>
                      <input/><span>X</span><input/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={3}>
                        割缝宽度
                      </Col>
                      <Col span={2}>
                        1.0
                      </Col>
                      <Col span={2}>
                       0.71
                      </Col>
                      <Col span={2}>
                        0.53
                      </Col>
                      <Col span={2}>
                      0.45
                      </Col>
                      <Col span={2}>
                        其他
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        切割方式
                      </Col>
                      <Col span={2}>
                        连续
                      </Col>
                      <Col span={2}>
                        脉冲
                      </Col>
                      <Col span={2}>
                        半穿
                      </Col>
                      
                    </Row>
                    <Row>
                      <Col span={24}>
                        <div>
                          <span style={{width:'100%',textAlign:'left'}}>
                          切割要备注：
                          </span>
                          <TextArea/>
                        </div>
                      </Col>

                    </Row>
                    <Row>
                      <Col span={3}>
                        重割原因
                      </Col>
                      <Col span={4}>
                      <input/>
                      </Col>
                      <Col span={3}>
                       重割次数
                      </Col>
                      <Col span={2}>
                        1
                      </Col>
                      <Col span={2}>
                      2
                      </Col>
                      <Col span={2}>
                        3
                      </Col>
                      <Col span={2}>
                      确认人
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        检验人
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        装刀人
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={1}>
                       时间
                      </Col>
                      <Col className='multInput' span={7}>
                      <input/><span>至</span><input/>
                      </Col>
                      <Col span={3}>
                      第二装刀人
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={1}>
                       时间
                      </Col>
                      <Col className='multInput' span={6}>
                      <input/><span>至</span><input/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                      弯刀人
                      </Col>
                      <Col span={2} >
                       时间
                      </Col>
                      <Col className='multInput'span={7} >
                      <input/><span>至</span><input/>
                      </Col>
                      <Col span={3}>
                      弯刀米数
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={4}>
                      弯刀机工作量
                      </Col>
                      <Col span={4}>
                      <input style={{width:'89%'}}/><span style={{width:'10%'}}>%</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <div>
                          <span style={{width:'100%',textAlign:'left'}}>
                        装刀备注：
                        </span>
                        <TextArea/>
                        </div>
                        <div>
                          <span style={{width:'10%'}}>
                          检验人：
                          </span>
                          <input style={{width:'90%'}}/>
                        </div>

                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        刀材名称
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2} >
                      <input/>
                      </Col>
                      <Col span={2}>
                        实用
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        齿刀名称
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        实用
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        痕线名称
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        实用
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        孔类名称
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        实用
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        销类名称
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        规格
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        实用
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        领料人
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        发料人
                      </Col>
                      <Col span={2}>
                      <input/>
                      </Col>
                    </Row>
                    <Row>
                      <Col style={{width:'2rem'}}>
                        检验内容
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        尺寸
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        正反
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        结构
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        拼板
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        咬口
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        木板
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        桥位
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        清废
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        平衡
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        定位
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        半桥
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        刻字
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        钢刀
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        齿刀
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        钢孔
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        销
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        稿数
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        半穿
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        接刀
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        出图
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        板度
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        海绵
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                        版面
                      </Col>
                      <Col style={{width:'calc(100% - 36.5rem)'}}>
                        检验时间
                        <br/>_至_
                      </Col>
                    </Row>
                    <Row>
                      <Col  style={{width:'2rem'}}>
                        制图
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'calc(100% - 36.5rem)'}}>
                      <input/>
                      </Col>
                    </Row>
                    <Row>
                      <Col style={{width:'2rem'}}>
                        品管
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col><Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'1.5rem'}}>
                      <input/>
                      </Col>
                      <Col style={{width:'calc(100% - 36.5rem)'}}>
                      <input/>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={2}>
                        出货方式
                      </Col>
                      <Col span={1}>
                        送
                      </Col>
                      <Col span={2}>
                        自取
                      </Col>
                      <Col span={2}>
                        托运
                      </Col>
                      <Col span={2}>
                        快递
                      </Col>
                      <Col span={2}>
                        最终评定
                      </Col>
                      <Col span={1}>
                        OK
                      </Col>
                      <Col span={1}>
                        NG
                      </Col>
                      <Col span={2}>
                        送货人
                      </Col><Col span={3}>
                      <input/>
                      </Col>
                      <Col span={2}>
                        检验人
                      </Col>
                      <Col span={4}>
                      <input/>
                      </Col>
                    </Row>
                  </div>
                  </div>
                </div>

              </div>
              </div>
          </div>
        </div>

      </div>

    );
  }
}

export default WorkSheetDetail;
