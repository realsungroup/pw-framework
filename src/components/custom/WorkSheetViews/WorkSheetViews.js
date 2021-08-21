import React from 'react';
import './WorkSheetViews.less';
import echarts from 'echarts';
import moment from 'moment';
import { Select, Button, message, DatePicker, Modal, Spin } from 'antd';
import WorkSheetDetail from '../WorkSheetDetail';
import http from 'Util20/api';

const { Option } = Select;
const { RangePicker } = DatePicker;
class WorkSheetViews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total:0,
      done:[],
      junk:[],
      loading:false,
      sheetData:{all:[]},
      showDetails:false,
      filterV:{id:'all',value:'全部'},
      editRight:{
        part1:false
      },
      editRight:{
        part1:false
      },
      filter:[
        {id:'all',value:'全部'},{id:'681076169400',value:'工程部'},{id:'681076179960',value:'激光部'},{id:'681076187961',value:'制造部'},{id:'681076208531',value:'质检部'}
      ]
    };
  }

  async componentDidMount() {
    this.getData();
  }
  getData=async()=>{
    let myDate = new Date();
    myDate = moment(myDate).format('YYYY-MM-DD');
    this.setState({curDate:myDate,loading:true});
    let res;
    let junk=[];
    let done=[];
    let depaId=[{id:'681076169400',value:'工程部'},{id:'681076179960',value:'激光部'},{id:'681076187961',value:'制造部'},{id:'681076208531',value:'质检部'}];
    let sheetData={};
    let all=[]
    try {
      res = await http().getTable({
        resid: 678790254230,
        cmswhere:`REC_CRTTIME > '${myDate}' and C3_680644403785 = 'Y'`
      });
      //分类
      let n = 0;
      while(n<res.data.length){
        if(res.data[n].sheetStatus=='已作废'){
          junk.push(res.data[n]);
        }else if(res.data[n].sheetStatus=='已完成'){
          done.push(res.data[n]);
        }else if(res.data[n].sheetStatus=='进行中'){
          let c=0;
          all.push(res.data[n]);
          while(c<depaId.length){
            if((res.data[n].curDepaId==depaId[c].id&&res.data[n].C3_682377833865=='工作中')||(res.data[n].C3_682540124939==depaId[c].id&&res.data[n].C3_682377833865=='已完成')){
              let arr=sheetData[depaId[c].id]||[];
              let obj =res.data[n];
              if(res.data[n].C3_682540124939==depaId[c].id&&res.data[n].C3_682377833865=='已完成'){
                obj.sjqk='未开始'
              }
              arr.push(obj)
              sheetData[depaId[c].id]=arr;
            }
            c++;
          }
        }
        n++;
      }
      sheetData.all=all;
      console.log(res,sheetData)
      this.setState({loading:false,total:res.data.length,junk,done,sheetData});
    } catch (error) {
      message.error(error.message);
    this.setState({loading:false});
    }
  }
  //显示详情页
  showDetails = (v, id) => {
    console.log('id', id);
    let value = true;
    let ID = '';
    if (v != null) {
      value = v;
      ID = id;
    }
    console.log('value', value, v);
    this.setState({
      showDetails: value,
      curSheetId: ID,
    });
  };
  render() {
    return (
     <div className="viewer">
        <Spin spinning={this.state.loading}>
        <Modal
          visible={this.state.showImg}
          footer={null}
          onCancel={() => {
            this.setState({ showImg: false });
          }}
          destroyOnClose
          width={'80vw'}
          style={{background:'#999'}}
        >
          <div
            style={{
              width: '100%',
              height: '80vh',
              background: 'url(' + this.state.imgUrl + ')',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
        </Modal>
       <div className='header_main'>
          {this.state.curDate} 当日订单数：{this.state.total} 已完成数：{this.state.done.length} 报废：{this.state.junk.length}
        </div>
        <div className='filter'>
          {
            this.state.filter.map(
              item =>(
                <span onClick={()=>{this.setState({filterV:item})}} className={this.state.filterV.id==item.id?'current':''}>
                  {item.value}
                </span>
              )
            )
          }
        </div>
        <div className='content'>
          {
            this.state.sheetData[this.state.filterV.id]?this.state.sheetData[this.state.filterV.id].map(
              item=>(
                  <div>
                    <h3>
                    No.{item.uniqueNo}
                    </h3>
                    <div>
                    <p>
                      {item.sjqk=='未开始'?
                      item.C3_682444267100:
                      item.C3_682888156896+'：('+item.C3_682371274376+')'
                    }
                    </p>
                    <p>
                      {
                        item.sjqk=='未开始'?'未开始':item.C3_682379482255
                      }
                    </p>
                    </div>
                    <div>
                      <p onClick={
                      ()=>{this.showDetails(true,item.C3_682281119677)}
                    }>查看详情</p>
                      <p onClick={() => {
                      this.setState({
                        showImg: true,
                        imgUrl: item.imgUrl
                      });
                    }}>查看图纸</p>
                    </div>
                  </div>)
            ):null
          }
        </div>
        </Spin>
        <div className='detailContent' style={this.state.showDetails?{display:'block'}:{display:'none'}}>
             
             <WorkSheetDetail
                hasBack={true}
                backFunc={()=>{this.showDetails(false)}}
                editRight={this.state.editRight}
                curSheetId={this.state.curSheetId}
                mesId={this.state.mesId}
                view={true}
             >
              </WorkSheetDetail>   
        </div>

      </div>

    );
  }
}

export default WorkSheetViews;
