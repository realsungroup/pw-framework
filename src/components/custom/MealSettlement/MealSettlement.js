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
const tableId = {
  memberId: 758726389557,//需要结算的账户表
  calId: 756560986054,//结算表
};
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
  };
  componentDidMount() {
  }
 
  handleRun = async (resid, data) => {
    const ym=moment().format('YYYYMM');
    try{
      let calData = await http({ baseURL: this.baseURL }).getTable({
        resid: calId,
      });
      let memberData = await http({ baseURL: this.baseURL }).getTable({
        resid: memberId,
      });
      calData=calData.data;
      memberData=memberData.data;
      console.log('calData',calData);
      console.log('memberData',memberData);
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
      console.log('excelData',excelData)
    }catch(e){
      console.log(e.message);
      message.error(e.message);
    }
    
  }
  handleExport=async()=>{

  }
  render() {
    const { process, settled, task, memData, loading, memDataAtt, memDataOrigin } = this.state
    return (
      <div className='mealSettlement'>
        <div className='mealSettlement_controlPad'>
          <div>
            <Button type={'primary'} loading={loading} onClick={() => {
              this.handleRun();
            }}>开始</Button>
            <Button onClick={() => { this.handleExport() }}>导出</Button>
          </div>
        </div>

      </div>

    );
  }
}
