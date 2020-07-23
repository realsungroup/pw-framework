import React from 'react';
import './ChartCommunication.less';
import TableData from '../../common/data/TableData';
import { Tabs, Select, Menu ,Button,Spin} from 'antd';
import http from 'Util20/api';

const { Option } = Select;
const { TabPane } = Tabs;
const { SubMenu } = Menu;

class ChartCommunication extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL = window.pwConfig[process.env.NODE_ENV].customURLs.onlineTrainning;
    this.state = {
      month:1,
      year:2017,
      yearGroup:[],
      total:0,
      app:0,
      offline:0,
      tousu:0,
      qiuzhu:0,
      jianyi:0,
      loading:false,
      replyTousu:1,
      replyQiuzhu:2,
      replyJianyi:3,
      maxTime:3,

    };
  }
  callback=(v)=>{
    console.log(v)
  }
  getTime=()=>{
    let myDate = new Date();
    let myMonth = myDate.getMonth()+1;
    let myYear = myDate.getFullYear();
    let c=myYear
    let n=0;
    let yearGroup=[];
    while(c>2012){
      yearGroup.push(c)
      c=c-1;
      n++;
    }
    this.setState({month:myMonth,year:myYear,yearGroup});
    this.getData('month',myMonth,myYear);
  }
  componentDidMount(){
  }
  selectMonth=(v)=>{
    this.setState({month:v});
    this.getData('month',v,this.state.year);
  }
  selectYear=(v)=>{
    this.setState({year:v});
    this.getData('month',this.state.month,v);
  }
  getData=async(type,mm,yy)=>{
    this.setState({
      loading:true,total:0,
      app:0,
      offline:0,
      tousu:0,
      qiuzhu:0,
      jianyi:0
    })
    let cms= ``;
    if(type=='month'){
      if(mm){
        cms=`REC_CRTTIME > "${yy+'-'+mm+'-01'}" and REC_CRTTIME < "${((Number(mm)+1==13)?(Number(yy)+1):yy)+'-'+((Number(mm)+1==13)?1:Number(mm)+1)}-01"`
      }
    }
    try{
      let res = await http({baseURL:this.baseURL}).getTable({
        resid: '648050843809',
        cmswhere:cms
      });
      let n=0;
      let app=0;
      let offline=0;
      let tousu=0;
      let qiuzhu=0;
      let jianyi=0;
      while(n<res.data.length){
        if(res.data[n].offline=='Y'){
          offline=offline+1;
        }else{
          app=app+1;
        }
        if(res.data[n].type=='投诉'){
          tousu=tousu+1;
        }else if(res.data[n].type=='求助/申诉'){
          qiuzhu=qiuzhu+1;
        }else{
          jianyi=jianyi+1;
        }
        n++;
      }
      this.setState({loading:false,total:res.data.length,app,offline,tousu,qiuzhu,jianyi})
      console.log(res)
    }catch(e){console.log(e.message);this.setState({loading:false})}
  }
  componentWillMount(){
    this.getTime();
  }
  render() {
    return (
      <div className='wrap'>
        <Tabs defaultActiveKey="1" onChange={(v)=>this.callback(v)}>
          <TabPane tab="月报" key="1">
            <div className='innerWrap'>
              <div className='center'>
                <div className='ctr'>
                  <div class='ctr-line'>
                    <span>请选择年份：</span>
                    <Select defaultValue={this.state.year}style={{ width: 120 }} onChange={(v)=>this.selectYear(v)}>
                      {this.state.yearGroup.map(v=>{
                        return(
                          <Option index={v} value={v}>{v}</Option>
                        )
                      })}
                    </Select>
                  </div>
                  <div class='ctr-line'>
                    <span>请选择月份：</span>
                    <Select defaultValue={this.state.month}style={{ width: 120 }} onChange={(v)=>this.selectMonth(v)}>
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5">5</Option>
                      <Option value="6">6</Option>
                      <Option value="7">7</Option>
                      <Option value="8">8</Option>
                      <Option value="9">9</Option>
                      <Option value="10">10</Option>
                      <Option value="11">11</Option>
                      <Option value="12">12</Option>
                    </Select>
                  </div>
                  <Button>打印</Button>
                </div>
                
                <div className='toPrint'>
                    <h3 style={{textAlign:'center',fontSize:'16px'}}>{this.state.year}年{this.state.month}月员工沟通统计报告</h3>
                    <p style={{fontSize:'14px'}}>公司：菲尼萨（无锡）</p>
                    <p style={{fontSize:'14px'}}>统计时间段：{this.state.year}年{this.state.month}月1日 00:00:00 至 {(Number(this.state.month)+1==13)?(Number(this.state.year)+1):this.state.year}年{(Number(this.state.month)+1==13)?1:Number(this.state.month)+1}月1日 00:00:00</p>
                    <Spin spinning={this.state.loading}>
                      <div>
                          <span>沟通次数：{this.state.total}次</span>
                          <i style={{display:'inline-block',width:'1rem',height:'1rem',verticalAlign:'middle',marginLeft:'1.5rem',marginRight:'4px',background:'#1890ff'}}></i><span>APP：{this.state.app}次</span>
                          <i style={{display:'inline-block',width:'1rem',height:'1rem',verticalAlign:'middle',marginLeft:'1.5rem',marginRight:'4px',background:'#f5222d'}}></i><span>线下：{this.state.offline}次</span>
                      </div>
                      <div style={{marginTop:16,width:545,height:'1rem',overflow:'hidden',background:this.state.total==0?'#f5f5f5':'#fff'}}>
                          <div style={{float:'left',height:'1rem',background:'#1890ff',width:(this.state.total==0)?0:(this.state.app/this.state.total*100)+'%'}}></div>
                          <div style={{float:'left',height:'1rem',background:'#f5222d',width:(this.state.total==0)?0:(this.state.offline/this.state.total*100)+'%'}}></div>
                      </div>
                      <div style={{marginTop:16}}>
                          <i style={{display:'inline-block',width:'1rem',height:'1rem',verticalAlign:'middle',marginRight:'4px',background:'#F9531B'}}></i><span>投诉：{this.state.tousu}次</span>
                          <i style={{display:'inline-block',width:'1rem',height:'1rem',verticalAlign:'middle',marginLeft:'1.5rem',marginRight:'4px',background:'#13C1C1'}}></i><span>求助/申诉：{this.state.qiuzhu}次</span>
                          <i style={{display:'inline-block',width:'1rem',height:'1rem',verticalAlign:'middle',marginLeft:'1.5rem',marginRight:'4px',background:'#2F53EB'}}></i><span>合理化建议：{this.state.jianyi}次</span>
                      </div>
                      <div style={{marginTop:16,width:545,height:'1rem',overflow:'hidden',background:this.state.total==0?'#f5f5f5':'#fff'}}>
                          <div style={{float:'left',height:'1rem',background:'#F9531B',width:(this.state.total==0)?0:(this.state.tousu/this.state.total*100)+'%'}}></div>
                          <div style={{float:'left',height:'1rem',background:'#13C1C1',width:(this.state.total==0)?0:(this.state.qiuzhu/this.state.total*100)+'%'}}></div>
                          <div style={{float:'left',height:'1rem',background:'#2F53EB',width:(this.state.total==0)?0:(this.state.jianyi/this.state.total*100)+'%'}}></div>
                      </div>
                      <div style={{overflow:'hidden'}}>
                        <p style={{width:'80px'}}>回复时长：</p>
                        <p style={{width:'80px',float:'left'}}>投诉：</p><div style={{width:465}}><div style={{width:this.state.replyTousu/this.state.maxTime*100+'%'}}></div></div>
                        <p style={{width:'80px',float:'left'}}>求助/申诉：</p><div style={{width:465}}><div style={{width:this.state.replyQiuzhu/this.state.maxTime*100+'%'}}></div></div>
                        <p style={{width:'80px',float:'left'}}>合理化建议：</p><div style={{width:465}}><div style={{width:this.state.replyJianyi/this.state.maxTime*100+'%'}}></div></div>
                      </div>
                    </Spin>
                </div>
                

              </div>
            </div>
          </TabPane>
          <TabPane tab="季报" key="2">
            
          </TabPane>
          <TabPane tab="年报" key="3">
            
          </TabPane>
          <TabPane tab="自定义" key="4">
            
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default ChartCommunication;
