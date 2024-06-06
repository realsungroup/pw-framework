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
import XLSX from 'xlsx';
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
      // 表头  
        function transformKey(key) {  
          const headerMap = {  
            creaTime: '变动时间',  
            creator: '创建人',  
            name: '员工姓名',
            numberId: '员工工号',
            cardType: '卡类别',
            transactionType: '交易类型',
            dealSymbol: '交易符号',
            creatMonth: '创建月份',
            lastConsumptionNumber: '上期消费序号',
            ConsumptionNumber: '消费序号',
            recid: '交易编号',
            isDealed: '是否已结算',
            accountPerkBefore: '交易前补贴账户余额',
            accountPerkDelta: '补贴账户余额交易额',
            accountPerkAfter: '交易后补贴值账户余额',
            dealNumber: '交易类型编号',
            sychroned: '是否已经同步',
            api_wx: '微信api',
            calRecid: '消费计算记录编号',
            cardNo: '全球唯一卡号',
          };  
          return headerMap[key] || key; // 如果找不到映射，就返回原键  
        }
        // 获取所有不同的键并转换为表头  
        const keys = Array.from(new Set(dataArray.flatMap(Object.keys)));  
        const headers = keys.map(transformKey);  
        // 创建工作簿和工作表  
        const wb = XLSX.utils.book_new();  
        const ws = XLSX.utils.json_to_sheet(dataArray.map(row => {  
          // 转换键名  
          return Object.fromEntries(Object.entries(row).map(([key, value]) => [transformKey(key), value]));  
        }), { header: headers }); // 使用表头  
        // 将工作表添加到工作簿  
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  
        // 写入文件（Node.js环境）  
        XLSX.writeFile(wb, '导入员工账户变动记录'+moment().format('YYYYMM')+'.xlsx'); 
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
