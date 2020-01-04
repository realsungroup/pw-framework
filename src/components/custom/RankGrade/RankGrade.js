import React, { Component } from 'react';
import './RankGrade.less';
import { TableData } from '../../common/loadableCommon';

import {
  Spin,
  Modal,
  Select,
  Tabs,
  Button
} from 'antd';
import http from 'Util20/api';
const { TabPane } = Tabs;
const { Option } = Select;
class RankGrade extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selVal:'SH.&WX.',
      date:[]
    };
  }

  componentDidMount() {
    this.getFY();
  }
// 计算下拉的财年
getFY = async() =>{
  var myDate = new Date();
  myDate=myDate.getFullYear();
  var t=myDate;
  var n=2010;
  var arr=[];
  while(n<myDate){
    arr.push('FY'+myDate)
    myDate--;
  }
  this.setState({date:arr,curDate:'FY'+t})

}
  handleChange=(v)=>{
    this.setState({selVal:v})
  }
  render() {
    
    return (
     <Spin spinning={this.state.loading}>
       <header className='RGHeader'>
        <div className='selectLocation'>
        <label>合同地：</label>
        <Select value={this.state.selVal} defaultValue='SH.&WX.' style={{ width: 120 }} onChange={(v)=>{this.handleChange(v)}}>
          <Option value='SH.&WX.'>SH.&WX.</Option>
          <Option value="SH.">SH.</Option>
          <Option value="WX.">WX.</Option>
        </Select>
        <label style={{marginLeft:'16px'}}>财年：</label><Select value={this.state.curDate} style={{ marginLeft:'8px',width: 120 }} onChange={v=>{this.handleChange(v)}}>
        { this.state.date.map((item) => {
                    return(
                      <Option value={item}>{item}</Option>
        )})}
        </Select>
        </div>
        <div className='repo'>
          <div>
            FY2020年中({this.state.selVal})
          </div>
          <div>
            总人数
          </div>
          <div>
            优秀10%
          </div>
          <div>
            优良20%
          </div>
          <div>
            不合格5%
          </div>
          <div>
            星级员工10%
          </div>
          <div>
            优秀员工20%
          </div>
          <div>
            下属额定
          </div>
          <div>
            38
          </div>
          <div>
            38
          </div>
          <div>
            38
          </div>
          <div>
            38
          </div>
          <div>
            38
          </div>
          <div>
            38
          </div>
          <div>
            下属实际
          </div> 
          <div>
            38
          </div>
          <div>
            38
          </div>
          <div>
            38
          </div>
          <div>
            38
          </div>
          <div>
            38
          </div>
          <div>
            38
          </div>
        </div>
       </header>
       <content className='RGContent'>
        <Tabs defaultActiveKey="1">
          <TabPane tab="全部" key="1" style={{height:'calc(100vh - 262px)'}}>
            <TableData
            resid={'420130498195'}
            actionBarWidth={80}
            subtractH={100}
            hasAdd={false}
            hasRowView={false}
            hasModify={false}
            hasDelete={false}
            hasRowModify={true}
            hasRowDelete={false}
          />
          </TabPane>
          <TabPane tab="已提交" key="2" style={{height:'calc(100vh - 262px)'}}>
            <TableData
            resid={'420130498195'}
            actionBarWidth={80}
            subtractH={100}
            hasAdd={false}
            hasRowView={false}
            hasModify={false}
            hasDelete={false}
            hasRowModify={true}
            hasRowDelete={false}
          />
          </TabPane>
          <TabPane tab="上级已审批" key="3" style={{height:'calc(100vh - 262px)'}}>

            <TableData
            resid={'420130498195'}
            actionBarWidth={80}
            subtractH={100}
            hasAdd={false}
            hasRowView={false}
            hasModify={false}
            hasDelete={false}
            hasRowModify={true}
            hasRowDelete={false}
          />
          </TabPane>
          <TabPane tab="不参评" key="4" style={{height:'calc(100vh - 262px)'}}>

            <TableData
            resid={'420130498195'}
            actionBarWidth={80}
            subtractH={100}
            hasAdd={false}
            hasRowView={false}
            hasModify={false}
            hasDelete={false}
            hasRowModify={true}
            hasRowDelete={false}
          />
          </TabPane>
        </Tabs>
       </content>
       <div className='actionBar'>
         <Button type="primary" style={{marginLeft:'1.67vw'}}>提交</Button>
         <Button type="danger" style={{marginLeft:'16px'}}>取消提交</Button>
        </div>
     </Spin>
    );
  }
}

export default RankGrade;
