import React from 'react';
import { TableData,MainTableSubTables} from '../../common/loadableCommon';
import { Button,Checkbox, message,Popconfirm, Modal,Icon ,Spin,Tabs,Input,Select,DatePicker,Table,Radio} from 'antd';
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
    loading:false,
    tData:null,
    columns:[],
    activeKey:"1",
    widthAll:0,
    radioVal:'全部'
  }
  componentDidMount=async()=>{
    this.getBaseData();
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
      let resSub =  await http().getTableColumnDefine({
        resid: '695655104050',
      });
      let resMem =  await http().getTableColumnDefine({
        resid: '695668784727',
      });
      console.log('resSub',resSub);
      let col=[];
      let xian=[];
      let n=0;
      while(n<resXian.data.length){
        if(resXian.data[n].ColName==='township'){
          xian=resXian.data[n].DisplayOptions;
        }
        n++;
      }
      n=0;
      while(n<resSub.data.length){
        if(resSub.data[n].ColName==='memo'){
        }else{
          col.push({
            title: resSub.data[n].ColDispName,
            dataIndex: resSub.data[n].ColName,
            key: resSub.data[n].ColName,
          })
        }
        
        n++;
      }
      n=0;
      let colMem=[]
      let widthAll=0;
      while(n<resMem.data.length){
        let w = resMem.data[n].ColDispName.length*16+32;
        widthAll=widthAll+w;
        w=w+'px'
        colMem.push({
            title: resMem.data[n].ColDispName,
            dataIndex: resMem.data[n].ColName,
            key: resMem.data[n].ColName,
            width:w
          })
        n++;
      }
      col.push({
        title: '操作',
        dataIndex: 'operation',
        render: (_, record) => {
          return(
            <a
             onClick={()=>{
               this.openModal(record.enterpriseRecid);
             }}
            >
              查看详情
            </a>
          )
        }
      })
      this.setState({loading:false,columns:col,enterprise:resEnter.data,xian,colMem,widthAll:widthAll+'px'});
    }catch(e){
      console.log(e.error);
      this.setState({loading:false});
    }
  }
  openModal=(id)=>{
    let n =0;
    let arr=this.state.memData;
    let fin=[];
    while(n<arr.length){
      if(arr[n].enterpriseId===id){
        fin.push(arr[n])
      }
      n++;
    }
    this.setState({showModal:true,memGroup:fin,memOrg:fin});
  }
  handleGenerate=async(stDate,edDate)=>{
    this.setState({loading:true});
    try{
      let resMem=await http().getTable({
        resid:'692379348888',
        cmswhere:`(createDate >= '${stDate}' and createDate <= '${edDate}') or (enterDate >= '${stDate}' and enterDate <= '${edDate}')`
      });
      console.log('人员',resMem);
      this.setState({memData:resMem.data});
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
            obj.key=enter[n].recid;
            obj.enterpriseRecid=enter[n].recid;
            obj.enterpriseName=enter[n].enterpriseName;
            obj.signUp=0;
            obj.empAll=0;
            obj.memo='';
            obj.stDate=stDate;
            obj.edDate=edDate;
            obj.recid=enter[n].recid;
            obj.enterpriseNo=Number(enter[n].orderNum);
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
        while(k<resMem.data.length){
        let k1=0;
        //遍历企业
        while(k1<e.length){
          if(e[k1].recid===resMem.data[k].enterpriseId){
              //填报数量
              console.log(resMem.data[k],resMem.data[k].creatDate,stDate,edDate)
              if(moment(resMem.data[k].createDate).format() >= moment(stDate).format() && moment(resMem.data[k].createDate).format() <= moment(edDate).format()){
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
      }
      e=e.sort(this.compare('enterpriseNo'));
      this.setState({loading:false,tData:e})
    }catch(e){
      console.log(e.message)
      this.setState({loading:false})
    }
  }
  compare=(property)=>{
    return function(a,b){
         var value1 = a[property];
        var value2 = b[property];
        return (value1 >value2 ? 1 : -1);
    };
  }
  submit=async()=>{
    this.setState({loading:true});
      let res2;
      let arr=this.state.tData;
      let n=0;
      let subData=[];
      while(n<arr.length){
        let obj =arr[n];
        obj._state='added';
        obj._id=(n+2);
        subData.push({
          resid: '695655104050',
          maindata:obj
        })
        n++;
      }
      console.log('data',[
        {
          resid: '695655732656',
          maindata: {
            _state: 'added',
            _id: 1
          },
          subdata:subData
        }
      ])
      try {
        res2 = await http().saveRecordAndSubTables({
          data: [
            {
              resid: '695655732656',
              maindata: {
                _state: 'added',
                _id: 1
              },
              subdata:subData
            }
          ]
        });
      this.setState({loading:false,activeKey:"2"});
      this.tableDataRef.handleRefresh();
      } catch (err) {
      this.setState({loading:false});
        console.log(err.message);
      }
  }
  changeRadio=(v)=>{
    let arr =[];
    let n=0;
    console.log('v',v)
    while(n<this.state.memOrg.length){
      if((this.state.memOrg[n].subSucess==='是'&&v.target.value==='是')||(this.state.memOrg[n].subSucess!='是'&&!v.target.value==='否')||(v.target.value==='全部')){
        arr.push(this.state.memOrg[n])
      }
      n++;
    }
    this.setState({radioVal:v.target.value,memGroup:arr});
  }
  render() {
    return (
      <div
        className="empMember"
      >
           <Tabs className="tabs_container" activeKey={this.state.activeKey} onChange={(v)=>{this.setState({activeKey:v})}}>
         <TabPane tab="报表生成" key="1">
          <Modal
            visible={this.state.showModal}
            title="人员详情"
            width={'90vw'}
            footer={null}
            onCancel={()=>{this.setState({memGroup:[],showModal:false})}}
            destroyOnClose
          >
            <span>提交状态：</span>
            <Radio.Group onChange={(v)=>{this.changeRadio(v);}} value={this.state.radioVal} style={{marginBottom:8}}>
              <Radio value={'全部'}>全部</Radio>
              <Radio value={'是'}>已提交</Radio>
              <Radio value={'否'}>未提交</Radio>
            </Radio.Group>
              <Table
                  columns={this.state.colMem}
                  dataSource={this.state.memGroup}
                  scroll={{ x: this.state.widthAll}}
                  bordered
                  sticky
                  size="middle"
                />
          </Modal>
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
            <Button style={{marginLeft:8}} size='small' disabled={!this.state.stDate||!this.state.edDate} onClick={()=>{this.handleGenerate(this.state.stDate,this.state.edDate)}}>确定</Button>
            {
              !this.state.tData?null:<Popconfirm
              title="您确定要生成报表吗？"
              onConfirm={() => this.submit()}
             >
             <Button type={'primary'} style={{marginLeft:8}} size='small'>生成报表</Button>
             </Popconfirm>
            }
          </div>
          <div className='tableWrap'>
            {
              this.state.tData?
              <Table
                columns={this.state.columns}
                dataSource={this.state.tData}
                bordered
                pagination={{pageSize:100, position: ['none', 'none'] }}
                size="middle"
              />
              :<b>请先选择起止时间，然后点击“确认”按钮</b>
            }
          </div>
          </Spin>
        </TabPane>
        <TabPane tab="历史报表" key="2">
          <div>
          <MainTableSubTables
                resid={695655732656}
                style={{
                  overflow: 'auto',
                  margin: '0 auto'
                }}
                mainTableProps={{
                  hasAdd: false,
                  isWrap:true,
                  hasModify:false,
                  hasRowSelection:false,
                  hasDelete: true,
                  hasRowModify:false,
                  hasRowView:false,
                  hasRowDelete:false,
                  refTargetComponentName:"TableData",
                  wrappedComponentRef:element => (this.tableDataRef = element),
                  advSearch:{
                  isRequestFormData:false,
                  },
      
                }}
               
                subTablesProps={{
                  695655104050: {
                    hasAdd: true,
                    hasDelete: true,
                    hasRowModify:true,
                    hasRowView:true,
                  hasModify:false,
                  advSearch:{
                    isRequestFormData:false,
                  },
                  }
                }}
            ></MainTableSubTables>
          </div>
        </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default EmpMember;
