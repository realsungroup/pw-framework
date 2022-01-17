import React from 'react';
import { TableData } from '../../common/loadableCommon';
import { Button, message,Popconfirm, Modal,Icon ,Spin,Tabs,Input,Select,DatePicker} from 'antd';
import './EmpMember.less';
import moment from 'moment';
import http from '../../../util20/api';
import TextArea from 'antd/lib/input/TextArea';
const TabPane = Tabs.TabPane;
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class EmpMember extends React.Component {
  constructor(props) {
    super(props);
  }
  
  state={
    stDate:undefined,
    edDate:undefined,
    loading:false
  }
  componentDidMount=async()=>{
    this.getBaseData()
  }
  handleChangeDate=(stDate,edDate)=>{
    this.setState({stDate,edDate});
  }
  getBaseData=async()=>{
    this.setState({loading:true});
    try{
      let resEnter=await http().getTable({
        resid:'692791348405'
      });
      let resXian = await http().getTableColumnDefine({
        resid: '695668784727',
      });
      let xian=[];
      let n=0;
      while(n<resXian.data.length){
        if(resXian.data[n].ColName==='township'){
          xian=resXian.data[n].DisplayOptions;
        }
        n++;
      }
      console.log(resEnter,xian)
      this.setState({loading:false,enterprise:resEnter.data,xian});
    }catch(e){
      console.log(e.error);
      this.setState({loading:false});
    }
  }
  handleGenerate=async(stDate,edDate)=>{
    this.setState({loading:true});
    try{
      let resMem=await http().getTable({
        resid:'695668784727',
        cmswhere:`(createDate >= '${stDate}' and createDate <= '${edDate}') or (enterDate >= '${stDate}' and enterDate <= '${edDate}')`
      });
      console.log('人员',resMem);
      let enter=this.state.enterprise;
      let xian=this.state.xian;
      let e=[];
      console.log('企业',enter);
      console.log('县',xian);
      if(enter.length>0){
        let n = 0 ;
        while(n<enter.length){
          let obj={};
          if(xian.length>0){
            let c=0;
            obj.enterpriseRecid=enter[n].recid;
            obj.signUp=0;
            obj.empAll=0;
            obj.memo='';
            obj.stDate=stDate;
            obj.edDate=edDate;
            obj.recid=enter[n].recid;
            while(c<xian.length){
              obj['emp'+(c+1)]=0;
              c++;
            }
          }
          e.push(obj);
          n++;
        }
      }
      let k=0;
      //遍历人员
      if(resMem.data.length>0){
        let k1=0;
        //遍历企业
        while(k1<e.length){
          if(e[k1].recid===resMem.data[k].enterpriseId){
              //填报数量
              if(moment(resMem.data[k].creatDate).format() >= moment(stDate).format() && moment(resMem.data[k].creatDate).format() <= moment(edDate).format()){
                e[k1].signUp=e[k1].signUp+1;
              }
              //录用数量
              if(moment(resMem.data[k].enterDate).format() >= moment(stDate).format() && moment(resMem.data[k].enterDate).format() <= moment(edDate).format()){
                e[k1].empAll=e[k1].empAll+1;
                //遍历县
                let k2=0;
                let bol=false;
                while(k2<xian.length){
                  if(resMem.data[k].township===xian[k2]){
                    e[k1]['emp'+(k2+1)]=e[k1]['emp'+(k2+1)]+1;
                    bol=true;
                  }
                  k2++;
                }
                if(!bol&&resMem.data[k].township){
                  e[k1]['emp'+(k2)]=e[k1]['emp'+(k2)]+1;
                }
              }
          }
          k1++;
        }
        k++;
      }
      console.log('e',e)
      this.setState({loading:false,tData:e})
    }catch(e){
      console.log(e.message)
      this.setState({loading:false})

    }
  }
  render() {
    return (
      <div
        className="empMember"
      >
           <Tabs defaultActiveKey="1" className="tabs_container">
         
         <TabPane tab="报表生成" key="1">
           <Spin spinning={this.state.loading}>
          <div>
            <span>请选择起止日期：</span>
            <RangePicker
                      style={{ marginLeft: 24 }}
                      size="small"
                      allowClear
                      value={
                        this.state.stDate && this.state.edDate
                          ? [
                              moment(this.state.stDate, dateFormat),
                              moment(this.state.edDate, dateFormat)
                            ]
                          : [null, null]
                      }
                      onChange={(dates, dateString) => {
                        this.handleChangeDate(dateString[0], dateString[1]);
                      }}
                    ></RangePicker>
            <Button type='praimary' size='small' disabled={!this.state.stDate||!this.state.edDate} onClick={()=>{this.handleGenerate(this.state.stDate,this.state.edDate)}}>确定</Button>
          </div>
          </Spin>
        </TabPane>
        <TabPane tab="历史报表" key="2">
        </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default EmpMember;
