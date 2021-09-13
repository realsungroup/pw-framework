import React from 'react';
import './DeliveryNote.less';
import http from 'Util20/api';
import moment from 'moment';
import { Button, message, DatePicker, Modal, Spin } from 'antd';
import { TableData } from '../../common/loadableCommon';
class DeliveryNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      sheets:[],
      C3_684709867684:0,
      CNY:'零',
      C3_684709779164:'',//付款方式
      C3_684709721632:'',//客户名
    };
  }

  async componentDidMount() {
  }
  handlePrintDel = () => {
    // 打印
    const bodyHtml = window.document.body.innerHTML;

    let footstr = '</body>';
    let newstr = document.getElementById('toPrintDel').innerHTML;
    let style =
      '<style> th{padding:0 .5rem;line-height: 1.5rem;height: 1.5rem;}.ant-calendar-picker i{display:none;.ant-calendar-picker input{border:none;}}</style>';
    let headstr = '<html><head><title></title>' + style + '</head><body>';
    document.body.innerHTML = headstr + newstr + footstr;
    window.print();
    window.document.body.innerHTML = bodyHtml;
    window.location.reload();
  };
  componentWillReceiveProps = async nextProps => {
    let data = nextProps.data;
    this.setState({
      loading:false,
      sheets:[],
      C3_684709867684:0,
      CNY:'零',
      C3_684709779164:'',//付款方式
      C3_684709721632:'',//客户名
      C3_684709897259:'',//制表人姓名
      showWorker:false,
      showCustomers:false
    })
    this.dataArrangement(data);
    console.log(data)
    }

    changeNumMoneyToChinese(money)
    {
        let cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
        let cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
        let cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
        let cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
        let cnInteger = "整"; //整数金额时后面跟的字符
        let cnIntLast = "元"; //整型完以后的单位
        let maxNum = 999999999999999.9999; //最大处理的数字
        let IntegerNum; //金额整数部分
        let DecimalNum; //金额小数部分
        let ChineseStr = ""; //输出的中文金额字符串
        let parts; //分离金额后用的数组，预定义    
        let Symbol="";//正负值标记
        if (money == "") {
            return "";
        }
    
        money = parseFloat(money);
        if (money >= maxNum) {
            alert('超出最大处理数字');
            return "";
        }
        if (money == 0) {
            ChineseStr = cnNums[0] + cnIntLast + cnInteger;
            return ChineseStr;
        }
        if(money<0)
        {
            money=-money;
            Symbol="负 ";        
        }
        money = money.toString(); //转换为字符串
        if (money.indexOf(".") == -1) {
            IntegerNum = money;
            DecimalNum = '';
        } else {
            parts = money.split(".");
            IntegerNum = parts[0];
            DecimalNum = parts[1].substr(0, 4);
        }
        if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
            let zeroCount = 0;
            let IntLen = IntegerNum.length;
            for (let i = 0; i < IntLen; i++) {
                let n = IntegerNum.substr(i, 1);
                let p = IntLen - i - 1;
                let q = p / 4;
                let m = p % 4;
                if (n == "0") {
                    zeroCount++;
                }
                else {
                    if (zeroCount > 0) {
                        ChineseStr += cnNums[0];
                    }
                    zeroCount = 0; //归零
                    ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m == 0 && zeroCount < 4) {
                    ChineseStr += cnIntUnits[q];
                }
            }
            ChineseStr += cnIntLast;
            //整型部分处理完毕
        }
        if (DecimalNum != '') { //小数部分
            let decLen = DecimalNum.length;
            for (let i = 0; i < decLen; i++) {
                let n = DecimalNum.substr(i, 1);
                if (n != '0') {
                    ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
            }
        }
        if (ChineseStr == '') {
            ChineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (DecimalNum == '') {
            ChineseStr += cnInteger;
        }
        ChineseStr = Symbol +ChineseStr;
        
        return ChineseStr;
    }
    
  
  dataArrangement=(data)=>{
    let sheets=[];
    let n = 0;
    let date = new Date();
    date=moment(date);
    this.setState({date});
    let total=0;
    while(n<7){
        if(data){
          if(n<data.length){
            if(n==0){
              this.setState({
                C3_684709721632:data[0].C3_678796767356,
                C3_684709729783:data[0].C3_682184234543,
              })
            }
            let obj = data[n];
            if(obj.C3_681946447748&&obj.C3_678796906793){
              obj.C3_684709867684=Number(obj.C3_681946447748)*Number(obj.C3_678796906793);
            }else{
              obj.C3_684709867684=0;
            }
            total= total + obj.C3_684709867684;
            sheets.push(data[n])
          }else{
            sheets.push({})
          }
        };
        n++;
    }
    let CNY = this.changeNumMoneyToChinese(total);
    this.setState({sheets,C3_684709867684:total,CNY})
  }
  changeSheetData=(id,key,v,cal)=>{
    console.log(key,id,v,this.state.sheets)
    let arr = this.state.sheets;
    let obj  =arr[key];
    obj[id]=v;
    if(!cal){
      if(obj.C3_681946447748&&obj.C3_678796906793){
        obj.C3_684709867684=Number(obj.C3_681946447748)*Number(obj.C3_678796906793);
      }else{
        obj.C3_684709867684=0;
      }
    }
    let n = 0;
    let total = 0;
    while(n<arr.length){
      total+=Number(arr[n].C3_684709867684||0);
      n++;
    }
    let CNY = this.changeNumMoneyToChinese(total);
    this.setState({sheets:arr,CNY,C3_684709867684:total});
  }
  handleSubmit=async()=>{
    this.setState({loading:true});
    let res;
    let arr=[];
    let n = 0;
    let s=this.state.sheets;
    while(n<s.length){
      arr.push({
        resid: '684709960176',
        maindata:{
          C3_684709974730:s[n].C3_680644203469,
          C3_684709996844:s[n].C3_678796779827,
          C3_684710017537:s[n].C3_681946447748,
          C3_684710028635:s[n].C3_678796906793,
          C3_684710040036:s[n].C3_684709867684,
          C3_684710051566:s[n].C3_684710051566,
          _state: 'added',
          _id: 1
        },
       _id:n
      })
      n++;
    }
    console.log('sub',arr)
    try {
      res = await http().saveRecordAndSubTables({
        data: [
          {
            resid: '684709694605',
            maindata: {
              C3_684709721632: this.state.C3_684709721632, 
              C3_684709729783: this.state.C3_684709721632, 
              C3_684709769640:this.state.date,
              C3_684709779164:this.state.C3_684709779164,
              C3_684709867684:this.state.C3_684709867684,
              C3_684709897259:this.state.C3_684709897259,
              C3_684709906752:this.state.C3_684709906752,
              _state: 'added',
              _id: 1
            },
            subdata: arr
          }
        ]
      });
      message.success('添加成功');
    this.setState({loading:false});

      this.props.backFunc();
      this.props.handleRefresh();
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  }
  getDelivery = async(id) =>{
    let res;
    this.setState({loading:true});
    try {
      res = await http().getRecordAndSubTables({
        resid: 681075873039,
        subresid:684709960176,
        cmswhere: `REC_ID = '${id}'`,
        getsubresource: 1
      });
      this.setState({loading:false});
    } catch (error) {
      message.error(error.message);
      this.setState({loading:false});
      console.log(error);
    }
  }
  render() {
    return (
      <Spin spinning={this.state.loading}>

     <div className="wrap">
       <Button onClick={()=>{this.handlePrintDel();}} style={{padding:'0 8px',marginRight:'8px'}}>打印</Button>
       <Button onClick={()=>{this.props.backFunc();}} style={{padding:'0 8px',marginRight:'8px'}}>返回</Button>
       <Button onClick={()=>{this.handleSubmit();}} style={{padding:'0 8px'}} type={'primary'}>提交</Button>
        <div id='toPrintDel' style={{width:'794px',marginLeft:'calc(50% - 397px)'}}>
          <div style={{width:'794px',padding:'1rem',boxSizing:'border-box'}}>
          <div style={{overflow:'hidden'}}>
            <div style={{float:'left',width:'10%'}}>
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAA5CAIAAAAX74ozAAAACXBIWXMAAAsTAAALEwEAmpwYAAA57GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoV2luZG93cyk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjEtMDgtMDhUMTY6NTU6MzIrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDIxLTA4LTA4VDE2OjU1OjMyKzA4OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAyMS0wOC0wOFQxNjo1NTozMiswODowMDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6Mzk1Y2NkOTYtNjZkOC01YzQ2LTgzODgtZTBhM2M1MGQ5NmE5PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD5hZG9iZTpkb2NpZDpwaG90b3Nob3A6MTU5NjhkZTktZjgyNi0xMWViLThhNjYtOWZjMTM4MDA3NWFkPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6YjMxMmMyN2UtOWI0MC01YTRjLTg2YzYtZjEyZGMwYzc0M2EzPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmIzMTJjMjdlLTliNDAtNWE0Yy04NmM2LWYxMmRjMGM3NDNhMzwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMS0wOC0wOFQxNjo1NTozMiswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDozOTVjY2Q5Ni02NmQ4LTVjNDYtODM4OC1lMGEzYzUwZDk2YTk8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjEtMDgtMDhUMTY6NTU6MzIrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT42NTUzNTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+Nzg8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NTc8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pi15F8EAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAACcNJREFUeNrsW39Mmukd/6rFKpRY6xzlNIyyc6TGxcyYcKWzZi4uTbhjYbNj0dJzIedCLmQsJizsSN1CwsLFxIVFY8LNhc6diXc25Gi4ubM0XuysPWvD7CilpUgdRUphCAcFFJ798dKXV+oP/EHr7Xz+et/n+32f9/k8z/f5fj/P93nfAoQQfD1KIXxtygHUA6gHUA+gHkD9v4V67cpH4adLd2/d2lIz+Sya366gvSshz6JCLOKwmMnVBFYT8LjxF43oBjd/HFMjFxVZpqdQHsreQJ00jApbm3FUCqk0LYhmJqqrrS0XqABQBJCKxxFCQZ9XJGyzzc+9eqhup03IbyUTbIRBIY9p+zIaqSQu4jc1bd6aSi7DNCmFgFbjCKGGWhZWQyujRoOBVwM1HPTxW5uqy6nkQqgupzbWMEcHtfPmCbWkq45WGQ0GcU06pQTrbnVZ2Rb27/fg4zKkVvG5HPy2ubEBV1uN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" />
            </div>
            <div style={{float:'left',textAlign:'center',width:'90%'}}>
              <h2>无锡美银精工磨具有限公司</h2>
              <p>地址：无锡国家高级技术产业区（开元工业园）锡士路18号</p>
              <p>电话：0510-85346588 85342958 传真：0510-85346598 QQ：513405811</p>
            </div>
           
        </div>
        <div style={{overflow:'hidden',textAlign:'left',marginTop:'1rem'}}>
              <div style={{float:'left',width:'40%'}}>
                <p style={{cursor:'pointer'}} onClick={() => {
                  this.setState({ showCustomers: true });
                }}>客户名称：<big style={{fontSize:'1.5rem',fontWeight:'bold'}}
                >
                  {this.state.C3_684709721632}
                  </big></p>
                <p>付款方式：
                  <span style={{marginLeft:'1rem',cursor:'pointer'}} onClick={()=>{
                    this.setState({C3_684709779164:'现金'}) }}>{this.state.C3_684709779164=='现金'?'√':'□'} 现金</span>
                  <span style={{marginLeft:'1rem',cursor:'pointer'}} onClick={()=>{
                    this.setState({C3_684709779164:'月结'})}}>{this.state.C3_684709779164=='月结'?'√':'□'} 月结</span>
                  <span style={{marginLeft:'1rem',cursor:'pointer'}} onClick={()=>{
                    this.setState({C3_684709779164:'支票'})}}>{this.state.C3_684709779164=='支票'?'√':'□'} 支票</span>
                </p>
              </div>
              <div style={{float:'left',width:'40%',textIndent:'26%'}}>
                <big style={{fontWeight:'1.5rem'}}>送货单</big>
              </div>
              <div style={{float:'left',width:'20%'}}>
                <p>送货单号：{this.state.C3_684709750566}</p>
                <p>日期：

                <DatePicker
                value={this.state.date}
                style={{cursor:'pointer',width:'110px'}}
                onChange={(v)=>{
                  this.setState({date:v})
                }}
                />
                </p>
              </div>
            </div>
            <div style={{marginTop:'1rem',overflow:'hidden'}}>
              <table border='1' style={{textAlign:'left',width:'calc(100% - 1rem)',float:'left'}}>
                <tr style={{textAlign:'center'}}>
                  <th style={{width:'12%'}}>
                    工程单号
                  </th>
                  <th style={{width:'25%'}}>
                    产品名称
                  </th>
                  <th style={{width:'15%'}}>
                    数量
                  </th>
                  <th style={{width:'15%'}}>
                    单价
                  </th>
                  <th style={{width:'15%'}}>
                    金额
                  </th>
                  <th>
                    备注
                  </th>
                </tr>
                {this.state.sheets.map((item,key)=>{
                  return(
                    <tr>
                    <th>
                      <input 
                        value={item.C3_680644203469}
                        onChange={(v)=>{
                          this.changeSheetData('C3_68064420346',key,v.target.value)
                        }}
                        style={{
                          width:'100%',
                          border:'none'
                        }}
                      />
                    </th>
                    <th>
                    <input 
                        value={item.C3_678796779827}
                        onChange={(v)=>{
                          this.changeSheetData('C3_678796779827',key,v.target.value)
                        }}
                        style={{
                          width:'100%',
                          border:'none'
                        }}
                      />
                    </th>
                    <th>
                    <input 
                        value={item.C3_681946447748}
                        onChange={(v)=>{
                          this.changeSheetData('C3_681946447748',key,v.target.value)
                        }}
                        type='number'
                        style={{
                          width:'100%',
                          border:'none'
                        }}
                      />
                    </th>
                    <th>
                    <input 
                        value={item.C3_678796906793}
                        onChange={(v)=>{
                          this.changeSheetData('C3_678796906793',key,v.target.value)
                        }}
                        type='number'
                        style={{
                          width:'100%',
                          border:'none'
                        }}
                      />
                    </th>
                    <th>
                      <input 
                        value={item.C3_684709867684}
                        onChange={(v)=>{
                          this.changeSheetData('C3_684709867684',key,v.target.value,true)
                        }}
                        type='number'
                        style={{
                          width:'100%',
                          border:'none'
                        }}
                      />
                    </th>
                    <th>
                    <input 
                        value={item.C3_684710051566}
                        onChange={(v)=>{
                          this.changeSheetData('C3_684710051566',key,v.target.value,true)
                        }}
                        style={{
                          width:'100%',
                          border:'none'
                        }}
                      />
                    
                    </th>
                    
                  </tr>
                  )
                })}
                
                <tr>
                  <th style={{textAlign:'right'}}>
                    合计：
                  </th>
                  <th>
                
                  </th>
                  <th>
                  
                  </th>
                  <th>
                  
                  </th>
                  <th>
                  <input 
                        value={this.state.C3_684709867684}
                        onChange={(v)=>{
                          let CNY = this.changeNumMoneyToChinese(v.target.value);
                          this.setState({
                            C3_684709867684:v.target.value,
                            CNY
                          });
                        }}
                        type='number'
                        style={{
                          width:'100%',
                          border:'none'
                        }}
                      />
                  </th>
                  <th>
                  
                  </th>
                  
                </tr>
                <tr>
                  <th colspan={7}>
                  合计金额（大写）：人民币
                    <input
                      value={this.state.CNY}
                      style={{
                        border:'none',
                        fontWeight:'bold',
                        width:'calc(100% - 170px)'
                      }}
                      onChange={
                        (v)=>{
                          this.setState({CNY:v.target.value});
                        }
                      }
                    />
                  </th>
                </tr>
              </table>
            <p style={{float:'left',width:'1rem',fontSize:'.8rem'}}>
              一存根白二客户红三财务黄
            </p>
            </div>
            <div style={{overflow:'hidden',textAlign:'left'}}>
              <p style={{float:'left',lineHeight:'1.5rem',width:'50%'}}>送货人：</p>
              <p style={{float:'left',lineHeight:'1.5rem',width:'25%'}}>客户签收：</p>
              <p style={{float:'left',lineHeight:'1.5rem',width:'25%',cursor:'pointer'}} 
              onClick={() => {
                              this.setState({ showWorker: true
                            })}}>制表人：{this.state.C3_684709897259}</p>
            </div>
            <div  style={{textAlign:'left'}}>
              <p>客户须知：</p>
              <p>1.请及时接受产品及退回来稿等。</p>
              <p>2.刀模上机前请仔细核对，如有问题立即停止使用，我司只承担刀模本身维修费用，不负连带责任。</p>
            </div>
            </div>
        </div>

        <Modal
          visible={this.state.showCustomers}
          footer={null}
          onCancel={() => {
            this.setState({ showCustomers: false });
          }}
          destroyOnClose
          width={'80vw'}
        >
          <div style={{ width: '100%', height: '80vh' }}>
            <TableData
              resid="680643338700"
              subtractH={180}
              hasAdd={true}
              hasRowView={false}
              hasRowDelete={false}
              hasRowEdit={false}
              hasDelete={false}
              hasModify={false}
              hasRowModify={false}
              hasRowSelection={false}
              hasAdvSearch={false}
              importConfig={null}
              customRowBtns={[
                (record, btnSize) => {
                  return (
                    <Button
                      type="primary"
                      onClick={() => {
                        this.setState({
                          showCustomers: false,
                          C3_684709721632:record.nameCustomer,
                          C3_684709729783:record.idCustomer
                        });
                      }}
                    >
                      选择
                    </Button>
                  );
                }
              ]}
            />
          </div>
        </Modal>

<Modal
visible={this.state.showWorker}
footer={null}
onCancel={() => {
  this.setState({ showWorker: false });
}}
destroyOnClose
width={'80vw'}
>
<div style={{ width: '100%', height: '80vh' }}>
  <TableData
    resid="682683140687"
    subtractH={180}
    hasAdd={true}
    hasRowView={false}
    hasRowDelete={false}
    hasRowEdit={false}
    hasDelete={false}
    hasModify={false}
    hasRowModify={false}
    hasRowSelection={false}
    hasAdvSearch={false}
    importConfig={null}
    customRowBtns={[
      (record, btnSize) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              this.setState({
                C3_684709897259:record.C3_227192484125,
                C3_684709906752:record.C3_227192472953,
                showWorker:false
              })
            }}
          >
            选择
          </Button>
        );
      }
    ]}
  />
</div>
</Modal>
      </div>
      </Spin>
    );
  }
}

export default DeliveryNote;
