import React from 'react';
import './WorkSheet.less';
import { Select, Button,message,DatePicker } from 'antd';
import { TableData } from '../../common/loadableCommon';
import WorkSheetDetail from '../WorkSheetDetail';
import http from 'Util20/api';

const { Option } = Select;
const { RangePicker } = DatePicker;
class WorkSheet extends React.Component {
  constructor(props){
    super(props)
   this.state={
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
      clearData:false,
      curSheetId:'',
      isNew:true
  }
  }
  
  async componentDidMount() {
   
    this.getFilters();
    this.getRight();

  }

  //获取新建订单权限
  getRight=async()=>{
    //获取localstorage的部门代码
    let res;
    let depaID=localStorage.getItem('userInfo');
    depaID=JSON.parse(depaID);
    depaID=depaID.UserInfo.EMP_DEPID;
    //获取pw后台的新建权限
    try {
      res = await http().getTable({
        resid: 681075873039,
        cmswhere:`C3_682274906470 = '${depaID}'`
      });
      console.log(res)
      let n =0;
      let obj={}
      while(n<res.data.length){
        if(res.data[n].depaId=='681076033443'){
          obj.part1=true;
        }
        if(res.data[n].depaId=='681076169400'){
          obj.part2=true;
        }
        if(res.data[n].depaId=='681076179960'){
          obj.part3=true;
        }
        if(res.data[n].depaId=='681076187961'){
          obj.part4=true;
        }
        if(res.data[n].depaId=='681076196461'){
          obj.part5=true;
        }
        if(res.data[n].depaId=='681076208531'){
          obj.part6=true;
        }
        n++;
      }
     this.setState({editRight:obj});
    } catch (error) {
      message.error(error.message);
      console.log(error);
    }
  }
  //获取订单状态种类
  getFilters=async()=>{
    let res;
    try {
      res = await http().getTableColumnDefine({
        resid: 678790254230,
      });
      console.log(res)
      let n =0;
      while(n<res.data.length){
        if(res.data[n].ColName=='sheetStatus'){
          this.setState({sheetStatus:res.data[n].DisplayOptions})
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
  //显示详情页
  showDetails=(v,id)=>{
    console.log('id',id)
    let value = true;
    let ID='';
    let isNew=true;
    if(v!=null){
      value=v;
      ID=id;
      isNew=false;
    }
    console.log('value',value,v)
    this.setState({showDetails:value,clearData:value,curSheetId:ID,isNew:isNew});
  }
  render() {
    return (
      <div className="sheetlist">
        <div className='filterLine'>
          <ul>
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
          </ul>
        </div>
        <div className='table'>
              <TableData
                resid="678790254230"
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
                hasRowSelection={false}
                hasAdvSearch={false}
                importConfig={null}
                actionBarExtra={({ dataSource, selectedRowKeys }) => {
                  return (
                    <>
                    {
                      this.state.editRight.part1?
                      <Button onClick={()=>{this.showDetails();}}>
                        新建
                    </Button>
                      :null
                    }
                    </>
                  );
                }}
                customRowBtns={[
                  (record, btnSize) => {
                    return (
                      <Button
                        onClick={()=>{this.showDetails(true,record.C3_682281119677)}}
                      >
                        查看
                      </Button>
                    );
                  }
                ]}
              />
        </div>
        <div className='detailContent' style={this.state.showDetails?{display:'block'}:{display:'none'}}>
             
             <WorkSheetDetail
                hasBack={true}
                new={this.state.isNew}
                backFunc={()=>{this.showDetails(false)}}
                editRight={this.state.editRight}
                handleRefresh={()=>{this.handleRefresh()}}
                clearData={this.state.clearData}
                curSheetId={this.state.curSheetId}
             >
              </WorkSheetDetail>   
        </div>
      </div>

    );
  }
}

export default WorkSheet;
