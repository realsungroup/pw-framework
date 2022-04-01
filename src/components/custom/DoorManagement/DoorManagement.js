import React, { Component } from 'react';
import { Pagination,Tabs,Button,Table,Spin } from 'antd';
import './DoorManagement.less';
import TableData from '../../common/data/TableData';
import http, { makeCancelable } from 'Util20/api';

const thead=[
  {
    title: '月份',
    dataIndex: 'C3_595166992528',
    key:'C3_595166992528'
  },{
    title: '工号',
    dataIndex: 'C3_595166604634',
    key:'C3_595166604634'
  },{
    title: '姓名',
    dataIndex: 'C3_595166693246',
    key:'C3_595166693246'
  },
  {
    title:'部门',
    dataIndex:'C3_595166712341',
    key:'C3_595166712341'
  },
  {
    title: '权限组名',
    dataIndex: 'C3_595166751093',
    key:'C3_595166751093'
  },
]
class DoorManagement extends React.Component {
  constructor(props) {
    super(props);
    this.baseURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceBaseURL;
    this.downloadURL =
      window.pwConfig[process.env.NODE_ENV].customURLs.attendanceDownloadURL;
      this.state={
        data:[],
        process:'未开始',
        loading:false,
        percent:'0%',
        step:1,
        add:[],
        minus:[],
        same:[]
      }
  }
  
  getData=async()=>{
    this.setState({
      loading:true,
      process:'获取当月记录',
      percent:'0%',
      step:1
    });
    let yy = new Date().getFullYear()+'';
    let mm = new Date().getMonth()+1;
    let ly = yy;
    let lm = mm-1;
    if(lm<0){
      lm=12;
      ly=Number(yy)-1;
    }
    if(lm<10){
      lm='0'+lm;
    }else{
      lm=lm+'';
    }
    ly=ly+'';
    let lym=ly+lm;
    if(mm<10){
      mm='0'+mm;
    }else{
      mm=mm+'';
    }
    let ym=yy+mm;
    let jobID=localStorage.getItem('userInfo');
    jobID=JSON.parse(jobID);
    jobID=jobID.UserInfo.EMP_ID;
    ym='202107';
    lym='202106';
    let cms =`(C3_595166992528 = '${ym}' or C3_595166992528 = '${lym}') and C3_595166775274 = '${jobID}'`
    let res=await http({baseURL:this.baseURL}).getTable({
      resid:702153120852,
      cmswhere:cms
    });
    this.setState({
      process:'整理数据',
      step:2,
      percent:'0%'
    });
    let n=0;
    let data=res.data;
    let lyArr=[];
    let cyArr=[];
    while(n<data.length){
      if(data[n].C3_595166992528===lym){
        lyArr.push(data[n]);
      }else{
        cyArr.push(data[n]);
      }
      this.setState({percent:Math.floor(n/data.length*100)+'%'});
      n++;
    };
    console.log(lyArr,cyArr)
    this.setState({
      process:'筛选减少的门禁权限',
      step:3,
      percent:'0%'
    });
    let add=[];
    let minus=[];
    let same=[];
    n=0;
    while(n<lyArr.length){
      let c = 0;
      let bol=false;
      while(c<cyArr.length){
        if(lyArr[n].C3_595166604634===cyArr[c].C3_595166604634 && lyArr[n].C3_595166751093===cyArr[c].C3_595166751093){
          bol=true;
          same.push(cyArr[c]);
        }
        c++;
      }
      if(!bol){
        minus.push(lyArr[n]);
      }
      this.setState({percent:Math.floor(n/lyArr.length*100)+'%'});
      n++;
    };
    this.setState({
      process:'筛选增加的门禁权限',
      step:4,
      percent:'0%'
    });
    n=0;
    while(n<cyArr.length){
      let c = 0;
      let bol=false;
      while(c<lyArr.length){
        if(lyArr[c].C3_595166604634===cyArr[n].C3_595166604634 && lyArr[c].C3_595166751093===cyArr[n].C3_595166751093){
          bol=true;
        }
        c++;
      }
      if(!bol){
        add.push(cyArr[n]);
      }
      this.setState({percent:Math.floor(n/cyArr.length*100)+'%'});
      n++;
    };
    console.log(add,minus,same)
    this.setState({loading:false,process:'完成',add,minus,same})
  }
  render() {
    const{activeKey}=this.state
    return (
      <div className="DoorManagement">
         <Tabs
             defaultActiveKey="1"
          >
                  <Tabs.TabPane tab="现有门禁清单" key={1}>
                  <div className='tableWrap'>
                  <TableData
                      baseURL={this.baseURL}
                      resid={'702143248405'}
                      wrappedComponentRef={element =>
                        (this.tableDataRef2 = element)
                      }
                      refTargetComponentName="TableData"
                      subtractH={200}
                      hasAdd={false}
                      hasRowView={false}
                      hasRowDelete={true}
                      hasRowEdit={false}
                      hasDelete={true}
                      hasModify={false}
                      hasBeBtns={true}
                      hasRowModify={true}
                      hasRowSelection={true}
                      hasAdvSearch={false}
                      importConfig={null}
                    />
                  </div>

                  </Tabs.TabPane>
                  <Tabs.TabPane tab="月度变动清单" key={2}>
                    <Spin spinning={this.state.loading}>
                  <div className='tableWrap'>
                    
                    <Button type={'primary'} onClick={()=>{this.getData();}}>获取数据</Button>
                  {
                    this.state.process!='完成'?null:
                    <ul>
                      <li>
                      <div className='add'>新增权限</div>
                      <Table dataSource={this.state.add} columns={thead} pagination={{simple :true}}/>
                      </li>
                      <li>
                      <div className='minus'>减少权限</div>
                      <Table dataSource={this.state.minus} columns={thead} pagination={{simple :true}}/>
                      </li>
                      <li>
                      <div className='same'>未变权限</div>
                      <Table dataSource={this.state.same} columns={thead} pagination={{simple :true}}/>
                      </li>
                       
                    </ul>
                  }
                  </div>
                  </Spin>
                  </Tabs.TabPane>
          </Tabs>
      </div>
    );
  }
}

export default DoorManagement;
