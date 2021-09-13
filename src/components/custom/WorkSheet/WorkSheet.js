import React from 'react';
import './WorkSheet.less';
import { Select, Button,message,DatePicker,Modal,Input,Spin } from 'antd';
import { TableData } from '../../common/loadableCommon';
import WorkSheetDetail from '../WorkSheetDetail';
import DeliveryNote from '../DeliveryNote';
import http from 'Util20/api';
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
class WorkSheet extends React.Component {
  constructor(props){
    super(props)
   this.state={
     loading:false,
      depa:[
        {
          depaId:'',
          depaName:''
        }
      ],//部门
      sheetStatus:[],//审批单状态
      filerStatus:'',
      filterSTA:'',
      filterSTB:'',
      filterEDA:'',
      filterEDB:'',
      filterDepa:'',
      cms: ``,
      editRight:{
        part1:false
      },
      curSheetId:'',
      isNew:true,
      isTongji:false,
      sheetBrid:'工作单',
      filterSTA2:'',
      filterSTB2:'',
      cms2:``,
      cms3:`1<0`
  }
  }
  
  async componentDidMount() {
   
    this.getFilters();
    this.getRight();

  }

  //获取新建订单权限
  getRight=async()=>{
    //获取localstorage的部门代码
    // let res;
    let depaID=localStorage.getItem('userInfo');
    depaID=JSON.parse(depaID);
    depaID=depaID.UserInfo.GroupList;
    depaID=depaID.substring(1,depaID.length-1);
    depaID=depaID.split(',')
    let n = 0;
    while(n<depaID.length){
      depaID[n]=depaID[n].substring(1,depaID[n].length-1);
      if(depaID[n]=='684243850125'){
        this.setState({isTongji:true});
      }
      n++;
    }
    // //获取pw后台的新建权限
    // try {
    //   res = await http().getTable({
    //     resid: 681075873039,
    //     cmswhere:`C3_682274906470 = '${depaID}'`
    //   });
    //   console.log(res)
    //   let n =0;
    //   let obj={}
    //   while(n<res.data.length){
    //     if(res.data[n].depaId=='681076033443'){
    //       obj.part1=true;
    //     }
    //     if(res.data[n].depaId=='681076169400'){
    //       obj.part2=true;
    //     }
    //     if(res.data[n].depaId=='681076179960'){
    //       obj.part3=true;
    //     }
    //     if(res.data[n].depaId=='681076187961'){
    //       obj.part4=true;
    //     }
    //     if(res.data[n].depaId=='681076196461'){
    //       obj.part5=true;
    //     }
    //     if(res.data[n].depaId=='681076208531'){
    //       obj.part6=true;
    //     }
    //     n++;
    //   }
    let obj={
      part1:true,
      part2:false,
      part3:false,
      part4:false,
      part5:false,
      part6:false,
    }
     this.setState({editRight:obj});
    // } catch (error) {
    //   message.error(error.message);
    //   console.log(error);
    // }
  }
  //获取订单状态种类
  getFilters=async()=>{
    let res;
    try {
      res = await http().getTableColumnDefine({
        resid: 678790254230,
      });
      console.log(res);
      this.setState({colData:res.data});
      let n =0;
      while(n<res.data.length){
        if(res.data[n].ColName=='sheetStatus'){
          this.setState({sheetStatus:res.data[n].DisplayOptions})
        }
        if(res.data[n].ColName=='C3_682782291042'){
          this.setState({zfyy:res.data[n].DisplayOptions})
        }
        n++;
      }
      this.getDepa();
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }

  }
  //刷新表格
  handleRefresh = () => {
    this.tableDataRef.handleRefresh();
  };

  //获取部门种类
  getDepa=async()=>{
    let res;
    try {
      res = await http().getTable({
        resid: 681075873039,
        cmswhere:`show = 'Y'`
      });
      this.setState({depa:res.data})
      console.log(res)
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }

  }
  //根据筛选条件刷新tabledata
  getData=async()=>{
    let cms =``;
    if(this.state.filterStatus){
      cms+=`sheetStatus = '${this.state.filterStatus}'`
    };
    if(this.state.filterDepa){
      if(this.state.filterStatus){
        cms+=` and curDepaId = '${this.state.filterDepa}'`
      }else{
        cms+=`curDepaId = '${this.state.filterDepa}'`
      }
    };
    if(this.state.filterSTA){
      if(this.state.filterStatus || this.state.filterDepa){
      cms+=` and C3_678796788873 > '${this.state.filterSTA}' and C3_678796788873 < '${this.state.filterSTB}'`
      }else{
      cms+=`C3_678796788873 > '${this.state.filterSTA}' and C3_678796788873 < '${this.state.filterSTB}'`

      }
    };
    if(this.state.filterEDA){
      if(this.state.filterStatus || this.state.filterDepa || this.state.filterSTA){
      cms+=` and C3_678796797075 > '${this.state.filterEDA}' and C3_678796788873 < '${this.state.filterEDB}'`
      }else{
        cms+=`C3_678796797075 > '${this.state.filterEDA}' and C3_678796788873 < '${this.state.filterEDB}'`
      }
    };
    console.log('cms',cms)
    this.setState({
      cms
    })
  }
  //根据筛选条件显示送货单
  getData2=async()=>{
    let cms2 = `C3_684709769640 > '${this.state.filterSTA2}' and C3_684709769640 < '${this.state.filterSTB2}'`
    this.setState({
      cms2,
      cms3:`1<0`
    })
  }
  //显示详情页
  showDetails=(v,id)=>{
    console.log('id',id)
    let ID='';
    let isNew=true;
    let value = true;
    if(v!=null){
      ID=id;
      isNew=false;
      value = v;
    }
    this.handleRefresh();
    this.setState({showDetails:value,curSheetId:ID,isNew:isNew});
  }
  //显示送货单
  showDelivery=(bol,id)=>{
    let b=true;
    if(bol!=null){
      b=false;
    }
    if(id){
      this.setState({selId:id});
    }
    this.setState({showDel:b})
  }
  //修改评论
  handleModi = async() =>{
    this.setState({loading:true})

    let res;
    try {
      res = await http().modifyRecords({
        resid: 678790254230,
        data:[
          {
            REC_ID:this.state.cid,
            C3_682368706409:this.state.fb
          }
        ]
      });
      this.setState({loading:false,showModi:false});
      this.handleRefresh();
      message.success('保存成功');
      console.log(res)
    } catch (error) {
      this.setState({loading:false})
      message.error(error.message);
      console.log(error);
    }
  }
  render() {
    return (
      <div className="sheetlist">
        <Modal
         visible={this.state.showModi}
         onOk={()=>{this.handleModi();}}
         onCancel={() => {
           this.setState({ showModi: false });
         }}
         destroyOnClose
         width={'80vw'}
        >
          <div>
            <Spin spinning={this.state.loading}>
            <p>请输入客户评价：</p>
            <TextArea
                              value={this.state.fb}
                              onChange={v => {
                                this.setState({fb:v.target.value})
                              }}
                            /></Spin>
          </div>
        </Modal>
        
        <div className='filterLine'>
          <ul>
          <li className='bridFilter'>
            <p className={this.state.sheetBrid=='工作单'?'current':''} onClick={()=>{
              this.setState({sheetBrid:'工作单'})
            }}>工作单</p>
            <p className={this.state.sheetBrid=='送货单'?'current':''} onClick={()=>{
              this.setState({sheetBrid:'送货单'})
            }}>送货单</p>
          </li>
          {this.state.sheetBrid=='工作单'?
                <>
                <li>
                    状态：
                    <Select
                      style={{ width: 120 }}
                      placeholder="请选择状态"
                      value={this.state.filterStatus}
                      onChange={(v) =>{
                        this.setState({filterStatus: v})
                      }}
                    >
                      {this.state.sheetStatus.map(item => (
                        <Option value={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  </li>
                  <li>
                    接单时间：
                    <RangePicker
                      value={this.state.filterST}

                      onChange={(dates, dateString) => {
                        console.log(dates, dateString);
                        let cmswhere = this.state.cmswhere;
                        if (dateString[0] && dateString[1]) {
                          this.setState({filterST:dates,filterSTA:dateString[0],filterSTB:dateString[1]});
                        }
                      }}
                    ></RangePicker>
                  </li>
                  <li>
                    交货时间：
                    <RangePicker
                      value={this.state.filterED}
                      onChange={(dates, dateString) => {
                        console.log(dates, dateString);
                        let cmswhere = this.state.cmswhere;
                        if (dateString[0] && dateString[1]) {
                          this.setState({filterED:dates,filterEDA:dateString[0],filterEDB:dateString[1]});
                        }
                      }}
                    ></RangePicker>
                  </li>
                  <li>
                    部门：
                    <Select
                      style={{ width: 120 }}
                      placeholder="请选择部门"
                      value={this.state.filterDepa}
                      onChange={(v) =>{
                        this.setState({filterDepa: v})
                      }}
                    >
                      {this.state.depa.map(item => (
                        <Option value={item.depaId}>
                          {item.depaName}
                        </Option>
                      ))}
                    </Select>
                  </li>
                  <li>
                  <Button type='primary' style={{marginRight:'.5rem'}}onClick={()=>{
                    this.getData();
                  }}>确认</Button>
                  <Button
                    onClick={
                      ()=>{
                        this.setState({
                          filterStatus:'',
                          filterST:null,
                          filterED:null,
                          filterSTA:'',
                          filterSTB:'',
                          filterEDA:'',
                          filterEDB:'',
                          filterDepa:'',
                          cms: ``
                        })
                      }
                    }
                  >
                    重置
                  </Button>
                  </li>
                  </>:<>
                  <li>
                    日期：
                    <RangePicker
                      value={this.state.filterST2}

                      onChange={(dates, dateString) => {
                        if (dateString[0] && dateString[1]) {
                          this.setState({filterST2:dates,filterSTA2:dateString[0],filterSTB2:dateString[1]});
                        }
                      }}
                    ></RangePicker>
                  </li>
                  <li>
                  <Button type='primary' style={{marginRight:'.5rem'}}onClick={()=>{
                    this.getData2();
                  }}>确认</Button>
                  <Button
                    onClick={
                      ()=>{
                        this.setState({
                          filterST2:null,
                          filterSTA2:'',
                          filterSTB2:'',
                          cms2: ``,
                          cms3:`1<0`
                        })
                      }
                    }
                  >
                    重置
                  </Button>
                  </li>
                  </>
          }
          
          </ul>
        </div>
        <div className='table' style={this.state.sheetBrid=='工作单'?{}:{display:'none'}}>
              <TableData
                resid="682730277282"
                wrappedComponentRef={element =>
                  (this.tableDataRef = element)
                }
                cmswhere={this.state.cms}
                refTargetComponentName="TableData"
                subtractH={180}
                hasAdd={false}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                hasRowSelection={true}
                hasAdvSearch={false}
                hasBeBtns={true}
                importConfig={null}
                actionBarExtra={({ dataSource, selectedRowKeys }) => {
                  return (
                    <>
                    {this.state.isTongji?null:
                    <>
                      <Button onClick={()=>{this.showDetails();}}>
                        新建工作单
                    </Button>
                    <Button onClick={()=>{
                      let data = dataSource;
                      let Reldata = [];
                      data.map(item => {
                        selectedRowKeys.map(items => {
                          if (item.REC_ID === items) {
                            Reldata.push(item);
                          }
                        });
                      });
                      this.setState({selectedData:Reldata,selId:''});
                      this.showDelivery();
                      }}>
                    新建送货单
                </Button></>
                    }
                    </>
                  );
                }}
                customRowBtns={[
                  (record, btnSize) => {
                    return (
                      <>
                      <Button
                        onClick={()=>{this.showDetails(true,record.C3_682281119677)}}
                      >
                        查看
                      </Button>
                      {
                        record.sheetStatus=='已完成' && (!this.state.isTongji)?
                        <Button onClick={()=>{
                          this.setState({
                            fb:record.C3_682368706409,
                            cid:record.REC_ID,
                            showModi:true
                          })
                        }}>
                          填写用户反馈
                        </Button>:null
                      }
                      </>
                    );
                  }
                ]}
              />
        </div>

        <div className='tableDelivery' style={this.state.sheetBrid=='工作单'?{display:'none'}:{}}>
              <div className='main'>
              <TableData
                resid="684709694605"
                wrappedComponentRef={element =>
                  (this.tableDataRef = element)
                }
                cmswhere={this.state.cms2}
                refTargetComponentName="TableData2"
                onRowClick={v => {
                  this.setState({
                    cms3: `C3_684709983325 = '${v.C3_684709750566}'`
                  });
                }}
                subtractH={180}
                hasAdd={false}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                hasRowSelection={false}
                hasAdvSearch={false}
                hasBeBtns={true}
                importConfig={null}
                customRowBtns={[
                  (record, btnSize) => {
                    return (
                      <Button
                        onClick={()=>{
                          this.showDelivery(null,record.C3_684709750566)}
                        }
                      >
                        查看
                      </Button>
                    );
                  }
                ]}
              />
              </div>
              <div className='sub'>
              <TableData
                resid="684709960176"
                wrappedComponentRef={element =>
                  (this.tableDataRef = element)
                }e
                cmswhere={this.state.cms3}
                subtractH={180}
                hasAdd={false}
                hasRowView={false}
                hasRowDelete={false}
                hasRowEdit={false}
                hasDelete={false}
                hasModify={false}
                hasRowModify={false}
                hasRowSelection={false}
                hasAdvSearch={false}
                hasBeBtns={true}
                importConfig={null}
              />
              </div>
             
        </div>

        <div className='detailContent' style={this.state.showDetails?{display:'block'}:{display:'none'}}>
             
             <WorkSheetDetail
                hasBack={true}
                new={this.state.isNew}
                backFunc={()=>{this.showDetails(false)}}
                editRight={this.state.editRight}
                handleRefresh={()=>{this.handleRefresh()}}
                curSheetId={this.state.curSheetId}
                colData={this.state.colData}
                zfyy={this.state.zfyy}
             >
              </WorkSheetDetail>   
        </div>
        <div className='delContent' 
        style={this.state.showDel?{display:'block'}:{display:'none'}}
        >
          <DeliveryNote
          backFunc={()=>{this.showDelivery(false)}}
          handleRefresh={()=>{this.handleRefresh()}}
          data={
            this.state.selectedData
          }
          selId={
            this.state.selId
          }
          ></DeliveryNote>
        </div>
      </div>

    );
  }
}

export default WorkSheet;
