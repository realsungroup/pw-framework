import React, { Component } from 'react';
import TableData from '../../common/data/TableData';
import {
  Modal,
  Button,
  message,
  Input,
  Row,
  Col,
  Radio,
  Checkbox,
  DatePicker,
  Select,
  Spin, Tabs
} from 'antd';
import http from 'Util20/api';
import './MealSettlement.less';
import moment from 'moment';
import { resolve } from 'url';
import loading from 'react-fullscreen-loading';
const { Option } = Select;
/**
 * 就餐结算
 */
export default class MealSettlement extends Component {
  constructor(props) {
    super(props);
    this.baseURL = window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadBaseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
  }
  state = {
    excelData:[],
    caled:false,
    loading:false
  };
  componentDidMount() {
  }
  handleRun = async (resid, data) => {
    const ym=moment().format('YYYYMM');
    this.setState({loading:true});
    try{
      let calData = await http({ baseURL: this.baseURL }).getTable({
        resid: 756560986054,
      });
      let memberData = await http({ baseURL: this.baseURL }).getTable({
        resid: 758726389557,
      });
      calData=calData.data;
      memberData=memberData.data;
      const creaTime = moment().format('YYYY-MM-DD hh:mm:ss');
      const recidHead = moment().format('YYYYMMDD')
      let excelData=[];
      for(let i=0;i<memberData.length;i++){
        for(let c=0;c<calData.length;c++){
          //obj1:审批补扣 obj2:补贴补扣 obj3账户转入
          if(memberData[i].numberId===calData[c].numberId){
            let money = memberData[i].accountPerk;
            let moneyAfter = Number(money)-Number(calData[c].unpassedTotal);
            let order = Number(memberData[i].ConsumptionNumber);
            let obj1={
              creaTime,
              creator:'demo',
              name:memberData[i].name,
              numberId:memberData[i].numberId,
              cardType:memberData[i].cardType,
              transactionType:'审批补扣',
              dealSymbol:'减',
              creatMonth:ym,
              lastConsumptionNumber:order,
              ConsumptionNumber:order+1,
              recid:'1'+recidHead+i,
              isDealed:'Y',
              accountPerkBefore:Number(money),
              accountPerkDelta:Number(calData[c].unpassedTotal),
              accountPerkAfter:moneyAfter,
              dealNumber:4,
              sychroned:'Y',
              api_wx:'POST:api/200/table/save:taskapibase2',
              calRecid:'1'+recidHead+i,
              cardNo:memberData[i].cardNo
            }
            moneyAfter = Number(moneyAfter) - Number(calData[c].dealValue);
            order=order+1;
            let obj2={
              creaTime,
              creator:'demo',
              name:memberData[i].name,
              numberId:memberData[i].numberId,
              cardType:memberData[i].cardType,
              transactionType:'结算补扣',
              dealSymbol:'减',
              creatMonth:ym,
              lastConsumptionNumber:order,
              ConsumptionNumber:order+1,
              recid:'2'+recidHead+i,
              isDealed:'Y',
              accountPerkBefore:Number(money),
              accountPerkDelta:Number(calData[c].dealValue),
              accountPerkAfter:moneyAfter,
              dealNumber:5,
              sychroned:'Y',
              api_wx:'POST:api/200/table/save:taskapibase2',
              calRecid:'2'+recidHead+i,
              cardNo:memberData[i].cardNo
            }
            moneyAfter = Number(moneyAfter) + Number(calData[c].attedanceTotal);
            order=order+1;
            let obj3={
              creaTime,
              creator:'demo',
              name:memberData[i].name,
              numberId:memberData[i].numberId,
              cardType:memberData[i].cardType,
              transactionType:'账户转入',
              dealSymbol:'加',
              creatMonth:ym,
              lastConsumptionNumber:order,
              ConsumptionNumber:order+1,
              recid:'3'+recidHead+i,
              isDealed:'',
              accountPerkBefore:Number(money),
              accountPerkDelta:Number(calData[c].attedanceTotal),
              accountPerkAfter:moneyAfter,
              dealNumber:11,
              sychroned:'',
              api_wx:'POST:api/200/table/save:taskapibase2',
              calRecid:'3'+recidHead+i,
              cardNo:memberData[i].cardNo
            }
            excelData.push(obj1,obj2,obj3);
          }
        }
      }
      this.setState({excelData,caled:true,loading:false});
    }catch(e){
      console.log(e.message);
      this.setState({loading:false});
      message.error(e.message);
    }
    
  }
  handleExport=async()=>{
      // 原始数据数组  
      const dataArray = this.state.excelData;  
        
      // CSV表头  
      const headers = ['creaTime', 'creator', 'name','numberId','cardType','transactionType','dealSymbol','creatMonth','lastConsumptionNumber','ConsumptionNumber','recid','isDealed','accountPerkBefore','accountPerkDelta','accountPerkAfter','dealNumber','sychroned','api_wx','calRecid','cardNo'];  
        
      // 转换为CSV字符串  
      function arrayToCsv(data, headers) {  
        let csv = headers.join(',') + '\r\n'; // 添加表头并换行  
        data.forEach(row => {  
          let fields = headers.map(header => {  
            // 如果数据对象中没有该属性，则默认为空字符串  
            return row.hasOwnProperty(header) ? row[header] : '';  
          });  
          csv += fields.join(',') + '\r\n'; // 添加数据行并换行  
        });  
        return csv;  
      }  
        
      // 调用函数并获取CSV字符串  
      const csvString = arrayToCsv(dataArray, headers);  
        
      // 创建一个Blob对象  
      const blob = new Blob([csvString], { type: 'text/csv' });  
        
      // 创建一个指向该Blob对象的URL  
      const csvUrl = URL.createObjectURL(blob);  
        
      // 创建一个链接元素  
      const link = document.createElement('a');  
      link.href = csvUrl;  
        
      // 设置文件名  
      link.setAttribute('download', 'data.csv');  
        
      // 触发点击以开始下载  
      document.body.appendChild(link);  
      link.click();  
        
      // 清理  
      document.body.removeChild(link);
  }
  render() {
    const { caled,loading} = this.state
    return (
      <div className='mealSettlement'>
        <div className='mealSettlement_controlPad'>
          <div>
            <Button type={'primary'} loading={loading} disabled={caled} onClick={() => {
              this.handleRun();
            }}>开始</Button>
            <Button disabled={!caled} onClick={() => {this.handleExport() }}>导出</Button>
          </div>
        </div>

      </div>

    );
  }
}
