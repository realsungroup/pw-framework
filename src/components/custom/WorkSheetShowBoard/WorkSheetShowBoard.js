import React from 'react';
import './WorkSheetShowBoard.less';
import { Select, Button,message,DatePicker,Row,Col } from 'antd';
import { TableData } from '../../common/loadableCommon';
import http from 'Util20/api';

const { Option } = Select;
const { RangePicker } = DatePicker;
class WorkSheetShowBoard extends React.Component {
  constructor(props){
    super(props)
   this.state={
     filter:'全部',
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
   
    // this.getFilters();
    // this.getRight();

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
      <div className="cardWrap">
        <div>
        <div className='filter'>
        <div className={this.state.filter=='全部'?'current':''} onClick={()=>{this.setState({filter:'全部'})}}>全部</div>
          <div className={this.state.filter=='未认领'?'current':''} onClick={()=>{this.setState({filter:'未认领'})}}>未认领</div>
          <div className={this.state.filter=='已认领'?'current':''} onClick={()=>{this.setState({filter:'已认领'})}}>已认领</div>
        </div>
        <div className='showBoard'>
          123
        </div>
        <div className='emergy sheet'>
          <div>
          <label>加急</label>
          <h3>No.12345678</h3>
          </div>
          <div>
            <p>制图 张三</p>
            <p>2021-12-13 16:00:01开始</p>
          </div>
          <div>
            <p>查看图纸</p>
            <p>查看详情</p>
          </div>
        </div>
       
        <div className='emergy sheet'>
          <div>
          <label>加急</label>
          <h3>No.12345678</h3>
          </div>
          <div>
            <p>制图 张三</p>
            <p>2021-12-13 16:00:01开始</p>
          </div>
          <div>
            <p>查看图纸</p>
            <p>查看详情</p>
          </div>
        </div>   <div className='emergy sheet'>
          <div>
          <label>加急</label>
          <h3>No.12345678</h3>
          </div>
          <div>
            <p>制图 张三</p>
            <p>2021-12-13 16:00:01开始</p>
          </div>
          <div>
            <p>查看图纸</p>
            <p>查看详情</p>
          </div>
        </div>   <div className='emergy sheet'>
          <div>
          <label>加急</label>
          <h3>No.12345678</h3>
          </div>
          <div>
            <p>制图 张三</p>
            <p>2021-12-13 16:00:01开始</p>
          </div>
          <div>
            <p>查看图纸</p>
            <p>查看详情</p>
          </div>
        </div>   <div className='emergy sheet'>
          <div>
          <label>加急</label>
          <h3>No.12345678</h3>
          </div>
          <div>
            <p>制图 张三</p>
            <p>2021-12-13 16:00:01开始</p>
          </div>
          <div>
            <p>查看图纸</p>
            <p>查看详情</p>
          </div>
        </div>   
        <div className='sheet'>
          <div>
          <label>进行中</label>
          <h3>No.12345678</h3>
          </div>
          <div>
            <p>制图 张三</p>
            <p>2021-12-13 16:00:01开始</p>
          </div>
          <div>
            <p>查看图纸</p>
            <p>查看详情</p>
          </div>
        </div>   
        <div className='ready sheet'>
          <div>
          <label>未开始</label>
          <h3>No.12345678</h3>
          </div>
          <div>
            <p>制图 张三</p>
            <p>2021-12-13 16:00:01开始</p>
          </div>
          <div>
            <p>查看图纸</p>
            <p>查看详情</p>
          </div>
        </div>
        </div>
      </div>

    );
  }
}

export default WorkSheetShowBoard;
